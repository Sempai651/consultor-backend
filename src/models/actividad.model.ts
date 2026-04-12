import { getPool } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

interface ActividadRow extends RowDataPacket {
  id: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
  createdAt: Date;
}

export const ActividadModel = {
  async create(data: {
    tipo: string;
    titulo: string;
    descripcion: string;
    icono: string;
    color: string;
  }): Promise<ActividadRow | null> {
    const pool = getPool();
    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO actividades (tipo, titulo, descripcion, icono, color) 
       VALUES (?, ?, ?, ?, ?)`,
      [data.tipo, data.titulo, data.descripcion, data.icono, data.color]
    );
    
    const [newActividad] = await pool.execute<ActividadRow[]>(
      'SELECT * FROM actividades WHERE id = ?',
      [result.insertId]
    );
    return newActividad.length > 0 ? newActividad[0] : null;
  },

  async getRecientes(): Promise<ActividadRow[]> {
    const pool = getPool();
    const [rows] = await pool.execute<ActividadRow[]>(
      'SELECT * FROM actividades ORDER BY id DESC LIMIT 20'
    );
    return rows;
  },
};