import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import { envs } from '@config/envs'

// Configuracion principal de Swagger
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Consultor API',
      version: '1.0.0',
      description: 'API REST para la aplicación móvil Consultor',
      contact: {
        name: 'Equipo de desarrollo',
      },
    },
    servers: [
      {
        url: `http://localhost:${envs.PORT}/api`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido en el login',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts'], // Busca comentarios en las rutas
}

// Genera el objeto con la especificacion
const swaggerSpec = swaggerJsdoc(options)

// Exportamos la funcion para configurar Swagger en la app
export const setupSwagger = (app: Express): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Consultor API Docs',
      swaggerOptions: {
        persistAuthorization: true, // Guarda el token al recargar
      },
    })
  )

  console.log(`📚 Swagger disponible en http://localhost:${envs.PORT}/api-docs`)
}