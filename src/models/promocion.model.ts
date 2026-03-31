import { getPool } from '@config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

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

export const PromocionModel = {
  async getAll(): Promise<PromocionRow[]> {
    const pool = getPool();
    const [rows] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones ORDER BY id DESC'
    );
    return rows;
  },

  async getById(id: number): Promise<PromocionRow | null> {
    const pool = getPool();
    const [rows] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async create(data: {
    titulo: string;
    categoria: string;
    descripcion: string;
    imagen: string;
    fecha_vencimiento: string;
  }): Promise<PromocionRow | null> {
    const pool = getPool();
    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO promociones (titulo, categoria, descripcion, imagen, fecha_vencimiento) 
       VALUES (?, ?, ?, ?, ?)`,
      [data.titulo, data.categoria, data.descripcion, data.imagen, data.fecha_vencimiento]
    );
    
    const [newPromo] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE id = ?',
      [result.insertId]
    );
    return newPromo.length > 0 ? newPromo[0] : null;
  },

  async update(id: number, data: Partial<{
    titulo: string;
    categoria: string;
    descripcion: string;
    imagen: string;
    fecha_vencimiento: string;
    estado: string;
  }>): Promise<PromocionRow | null> {
    const pool = getPool();
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];
    await pool.execute(`UPDATE promociones SET ${fields} WHERE id = ?`, values);
    
    const [updated] = await pool.execute<PromocionRow[]>(
      'SELECT * FROM promociones WHERE id = ?',
      [id]
    );
    return updated.length > 0 ? updated[0] : null;
  },

  async delete(id: number): Promise<boolean> {
    const pool = getPool();
    const [result] = await pool.execute<OkPacket>(
      'DELETE FROM promociones WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

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
};