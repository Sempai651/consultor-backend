// src/models/funcion.model.ts
import { getPool } from '@config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

// Definimos la interfaz de una Funcion
export interface Funcion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definimos la estructura que devuelve MySQL
interface FuncionRow extends RowDataPacket {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  activo: number;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo de Funciones con MySQL directo
export const FuncionModel = {
  // Obtener todas las funciones
  async getAll(): Promise<Funcion[]> {
    const pool = getPool();
    const [rows] = await pool.execute<FuncionRow[]>(
      'SELECT * FROM funciones ORDER BY id DESC'
    );
    return rows.map(row => ({
      ...row,
      activo: row.activo === 1
    }));
  },

  // Obtener una funcion por ID
  async getById(id: number): Promise<Funcion | null> {
    const pool = getPool();
    const [rows] = await pool.execute<FuncionRow[]>(
      'SELECT * FROM funciones WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      activo: row.activo === 1
    };
  },

  // Crear una nueva funcion
  async create(data: Omit<Funcion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Funcion | null> {
    const pool = getPool();
    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO funciones (titulo, descripcion, imagen, categoria, activo) 
       VALUES (?, ?, ?, ?, ?)`,
      [data.titulo, data.descripcion, data.imagen, data.categoria, data.activo ? 1 : 0]
    );
    
    const [newFuncion] = await pool.execute<FuncionRow[]>(
      'SELECT * FROM funciones WHERE id = ?',
      [result.insertId]
    );
    if (newFuncion.length === 0) return null;
    const row = newFuncion[0];
    return {
      ...row,
      activo: row.activo === 1
    };
  },

  // Actualizar una funcion
  async update(id: number, data: Partial<Omit<Funcion, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Funcion | null> {
    const pool = getPool();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (data.titulo !== undefined) {
      fields.push('titulo = ?');
      values.push(data.titulo);
    }
    if (data.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(data.descripcion);
    }
    if (data.imagen !== undefined) {
      fields.push('imagen = ?');
      values.push(data.imagen);
    }
    if (data.categoria !== undefined) {
      fields.push('categoria = ?');
      values.push(data.categoria);
    }
    if (data.activo !== undefined) {
      fields.push('activo = ?');
      values.push(data.activo ? 1 : 0);
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    await pool.execute(
      `UPDATE funciones SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    const [updated] = await pool.execute<FuncionRow[]>(
      'SELECT * FROM funciones WHERE id = ?',
      [id]
    );
    if (updated.length === 0) return null;
    const row = updated[0];
    return {
      ...row,
      activo: row.activo === 1
    };
  },

  // Eliminar una funcion
  async delete(id: number): Promise<boolean> {
    const pool = getPool();
    const [result] = await pool.execute<OkPacket>(
      'DELETE FROM funciones WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default FuncionModel;