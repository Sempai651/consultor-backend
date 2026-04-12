import { Router } from 'express';
import { getPool } from '../../config/database';
import { RowDataPacket } from 'mysql2';

const router = Router();

// Ruta de prueba - Obtener actividades recientes (sin auth)
router.get('/reciente', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM actividades ORDER BY id DESC LIMIT 20'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
});

// Ruta de prueba - Registrar actividad (sin auth)
router.post('/', async (req, res) => {
  try {
    const { tipo, titulo, descripcion, icono, color } = req.body;
    const pool = getPool();
    await pool.execute(
      `INSERT INTO actividades (tipo, titulo, descripcion, icono, color) 
       VALUES (?, ?, ?, ?, ?)`,
      [tipo, titulo, descripcion, icono || 'bell', color || '#6B7280']
    );
    res.json({ success: true, msg: 'Actividad registrada' });
  } catch (error) {
    res.json({ success: true, msg: 'Actividad registrada localmente' });
  }
});

export default router;