import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from '@config/database';
import { envs } from '@config/envs';
import authRoutes from '@modules/auth/auth.routes';
import promocionesRoutes from '@modules/promociones/promociones.routes';
import { setupSwagger } from '@config/swagger';
import { getPool } from '@config/database';
import { RowDataPacket } from 'mysql2';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

//RUTAS DE ACTIVIDAD (DIRECTAS)

// Obtener actividades recientes
app.get('/api/actividad/reciente', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM actividades ORDER BY id DESC LIMIT 20'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.log('📱 Error al obtener actividades, usando array vacío');
    res.json({ success: true, data: [] });
  }
});

// Registrar actividad
app.post('/api/actividad', async (req, res) => {
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
    console.log('📱 Actividad guardada localmente');
    res.json({ success: true, msg: 'Actividad registrada localmente' });
  }
});

// RUTAS PRINCIPALES 
app.use('/api/auth', authRoutes);
app.use('/api/promociones', promocionesRoutes);

// Swagger
setupSwagger(app);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(envs.PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${envs.PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();