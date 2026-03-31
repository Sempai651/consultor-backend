import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from '@config/database';
import { envs } from '@config/envs';
import authRoutes from '@modules/auth/auth.routes';
import promocionesRoutes from '@modules/promociones/promociones.routes';
import { setupSwagger } from '@config/swagger';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

// Routes
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