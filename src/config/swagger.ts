
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import { envs } from '@config/envs'

// Opciones de configuración de Swagger
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
    
    // Aquí definimos el esquema de seguridad JWT
    
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
  // Le decimos a swagger-jsdoc dónde están los comentarios JSDoc
  
  apis: ['./src/modules/**/*.routes.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

// Esta función recibe la app de Express y agrega la ruta /api-docs
export const setupSwagger = (app: Express): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Consultor API Docs',
      swaggerOptions: {
        persistAuthorization: true, // el token no se borra al recargar la página
      },
    })
  )

  console.log(`📚 Swagger disponible en http://localhost:${envs.PORT}/api-docs`)
}