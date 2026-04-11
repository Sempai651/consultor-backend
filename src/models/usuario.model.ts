import { getPool } from '@config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

// Interfaz para los resultados de las consultas
interface UsuarioRow extends RowDataPacket {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  password: string;
  rol: 'admin' | 'cliente';  // NUEVO CAMPO
  activo: number;
  tokenRecuperacion: string | null;
  tokenExpiracion: Date | null;
}

export const UsuarioModel = {
  // Buscar por cédula
  findByCedula: async (cedula: string): Promise<UsuarioRow | null> => {
    const pool = getPool();
    const [rows] = await pool.execute<UsuarioRow[]>(
      'SELECT * FROM usuarios WHERE cedula = ?',
      [cedula]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Buscar por email
  findByEmail: async (email: string): Promise<UsuarioRow | null> => {
    const pool = getPool();
    const [rows] = await pool.execute<UsuarioRow[]>(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Buscar por ID
  findById: async (id: number): Promise<UsuarioRow | null> => {
    const pool = getPool();
    const [rows] = await pool.execute<UsuarioRow[]>(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Buscar por token de recuperación
  findByToken: async (token: string): Promise<UsuarioRow | null> => {
    const pool = getPool();
    const [rows] = await pool.execute<UsuarioRow[]>(
      'SELECT * FROM usuarios WHERE tokenRecuperacion = ?',
      [token]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Crear usuario (con rol por defecto 'cliente')
  create: async (data: {
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    password: string;
    rol?: 'admin' | 'cliente';  // NUEVO: opcional, por defecto 'cliente'
  }): Promise<UsuarioRow | null> => {
    const pool = getPool();
    const rol = data.rol || 'cliente';  // Por defecto cliente
    
    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO usuarios (nombre, apellido, cedula, email, password, rol) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.nombre, data.apellido, data.cedula, data.email, data.password, rol]
    );
    
    const [newUser] = await pool.execute<UsuarioRow[]>(
      'SELECT * FROM usuarios WHERE id = ?',
      [result.insertId]
    );
    return newUser.length > 0 ? newUser[0] : null;
  },

  // Actualizar usuario
  update: async (id: number, data: Record<string, any>): Promise<UsuarioRow | null> => {
    const pool = getPool();
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];
    await pool.execute(`UPDATE usuarios SET ${fields} WHERE id = ?`, values);
    
    const [updated] = await pool.execute<UsuarioRow[]>(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );
    return updated.length > 0 ? updated[0] : null;
  },
};