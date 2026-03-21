
import { Router } from 'express'
import { AuthController } from './auth.controller'
import { catchAsync } from '@utils/catchAsync.util'

const router = Router()
const authController = new AuthController()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - cedula
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Sonia
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               cedula:
 *                 type: string
 *                 example: "1750109587"
 *               email:
 *                 type: string
 *                 example: sonia@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                           example: 1
 *                         nombre:
 *                           type: string
 *                           example: Sonia
 *                         cedula:
 *                           type: string
 *                           example: "1750109587"
 *                         email:
 *                           type: string
 *                           example: sonia@gmail.com
 *       400:
 *         description: Datos inválidos o cédula/email ya registrado
 */
router.post('/register', catchAsync(authController.register.bind(authController)))

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión con cédula y contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cedula
 *               - password
 *             properties:
 *               cedula:
 *                 type: string
 *                 example: "1750109587"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', catchAsync(authController.login.bind(authController)))

/**
 * @swagger
 * /auth/recuperar-clave:
 *   post:
 *     summary: Solicitar recuperación de contraseña por email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@gmail.com
 *     responses:
 *       200:
 *         description: Email de recuperación enviado si el usuario existe
 */
router.post('/recuperar-clave', catchAsync(authController.recuperarClave.bind(authController)))

/**
 * @swagger
 * /auth/nueva-clave/{token}:
 *   post:
 *     summary: Establecer nueva contraseña usando el token del email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token recibido en el email de recuperación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "nuevaPassword123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Token inválido o expirado
 */
router.post('/nueva-clave/:token', catchAsync(authController.nuevaClave.bind(authController)))

/**
 * @swagger
 * /auth/restablecer-clave-web/{token}:
 *   get:
 *     summary: Formulario web para restablecer contraseña
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/restablecer-clave-web/:token', 
  catchAsync(authController.restablecerClaveWeb.bind(authController)))



export default router