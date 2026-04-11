// Importamos la funcion para obtener la conexion a la base de datos
import { getPool } from '@config/database';
// Importamos tipos de mysql2 para las respuestas de las consultas
import { RowDataPacket, OkPacket } from 'mysql2';

// Definimos la estructura que tendra cada fila de la tabla promociones
interface PromocionRow extends RowDataPacket {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  fecha_creacion: Date;
  fecha_vencimiento: Date;
  estado: string;
}

// Función auxiliar para comparar fechas sin zona horaria
const compararFechas = (fechaStr: string): boolean => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  // Convertir fecha manualmente para evitar zona horaria
  const [year, month, day] = fechaStr.split('-').map(Number);
  const fechaVencimiento = new Date(year, month - 1, day);
  fechaVencimiento.setHours(0, 0, 0, 0);
  
  return fechaVencimiento < hoy;
};

// Función para actualizar automáticamente promociones vencidas a estado 'inactivo'
const actualizarEstadosVencidos = async () => {
  const pool = getPool();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  await pool.execute(
    `UPDATE promociones SET estado = 'inactivo' WHERE fecha_vencimiento < ? AND estado = 'activo'`,
    [hoy]
  );
};

// Exportamos el modelo con todos los metodos para manejar promociones
export const PromocionModel = {
  // Obtener todas las promociones (con actualización automática de estados)
  async getAll(): Promise<PromocionRow[]> {
    // Actualizar estados vencidos automáticamente
    await actualizarEstadosVencidos();
    
    const pool = getPool();
    const [rows] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones ORDER BY fecha_vencimiento ASC'
    );
    return rows;
  },

  // Obtener una sola promocion por su ID
  async getById(id: number): Promise<PromocionRow | null> {
    const pool = getPool();
    const [rows] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Crear una nueva promocion
  async create(data: {
    titulo: string;
    categoria: string;
    descripcion: string;
    imagen: string;
    fecha_vencimiento: string;
  }): Promise<PromocionRow | null> {
    const pool = getPool();
    
    // Validar que la fecha no sea pasada
    if (compararFechas(data.fecha_vencimiento)) {
      throw new Error('No se puede crear una promoción con fecha de vencimiento anterior a la fecha actual');
    }
    
    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO promociones (titulo, categoria, descripcion, imagen, fecha_vencimiento, estado) 
       VALUES (?, ?, ?, ?, ?, 'activo')`,
      [data.titulo, data.categoria, data.descripcion, data.imagen, data.fecha_vencimiento]
    );
    
    const [newPromo] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE id = ?',
      [result.insertId]
    );
    return newPromo.length > 0 ? newPromo[0] : null;
  },

  // Actualizar una promocion existente
  async update(id: number, data: Partial<{
    titulo: string;
    categoria: string;
    descripcion: string;
    imagen: string;
    fecha_vencimiento: string;
    estado: string;
  }>): Promise<PromocionRow | null> {
    const pool = getPool();
    
    if (data.fecha_vencimiento && compararFechas(data.fecha_vencimiento)) {
      throw new Error('No se puede actualizar con fecha de vencimiento anterior a la actual');
    }
    
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];
    await pool.execute(`UPDATE promociones SET ${fields} WHERE id = ?`, values);
    
    const [updated] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE id = ?',
      [id]
    );
    return updated.length > 0 ? updated[0] : null;
  },

  // Eliminar una promocion por su ID
  async delete(id: number): Promise<boolean> {
    const pool = getPool();
    const [result] = await pool.execute<OkPacket>(
      'DELETE FROM promociones WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Cambiar el estado de una promocion (activo/inactivo)
  async toggleEstado(id: number, estado: string): Promise<PromocionRow | null> {
    const pool = getPool();
    await pool.execute(
      'UPDATE promociones SET estado = ? WHERE id = ?',
      [estado, id]
    );
    
    const [updated] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE id = ?',
      [id]
    );
    return updated.length > 0 ? updated[0] : null;
  },

  // ========== MÉTODOS PARA FILTROS ==========

  // Filtrar promociones por categoría, estado y rango de fechas
  async filtrar(filtros: {
    categoria?: string;
    estado?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
  }): Promise<PromocionRow[]> {
    const pool = getPool();
    let query = 'SELECT * FROM promociones WHERE 1=1';
    const values: any[] = [];

    if (filtros.categoria && filtros.categoria !== 'todas') {
      query += ' AND categoria = ?';
      values.push(filtros.categoria);
    }

    if (filtros.estado && filtros.estado !== 'todos') {
      query += ' AND estado = ?';
      values.push(filtros.estado);
    }

    if (filtros.fechaInicio) {
      query += ' AND fecha_creacion >= ?';
      values.push(filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      query += ' AND fecha_vencimiento <= ?';
      values.push(filtros.fechaFin);
    }

    query += ' ORDER BY fecha_vencimiento ASC';
    
    const [rows] = await pool.execute<PromocionRow[]>(query, values);
    return rows;
  },

  // Buscar promociones por título (búsqueda parcial)
  async buscarPorTitulo(termino: string): Promise<PromocionRow[]> {
    const pool = getPool();
    const [rows] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE titulo LIKE ? ORDER BY fecha_vencimiento ASC',
      [`%${termino}%`]
    );
    return rows;
  },

  // Buscar promociones por categoría específica
  async buscarPorCategoria(categoria: string): Promise<PromocionRow[]> {
    const pool = getPool();
    const [rows] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE categoria = ? ORDER BY fecha_vencimiento ASC',
      [categoria]
    );
    return rows;
  },

  // Obtener solo promociones activas (para el home y clientes)
  async getActivas(): Promise<PromocionRow[]> {
    // Actualizar estados vencidos automáticamente
    await actualizarEstadosVencidos();
    
    const pool = getPool();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const [rows] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE estado = "activo" AND fecha_vencimiento >= ? ORDER BY fecha_vencimiento ASC',
      [hoy]
    );
    return rows;
  },

  // Obtener promociones vencidas
  async getVencidas(): Promise<PromocionRow[]> {
    const pool = getPool();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const [rows] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE fecha_vencimiento < ? ORDER BY fecha_vencimiento ASC',
      [hoy]
    );
    return rows;
  },
};