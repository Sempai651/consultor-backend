
import express from 'express'
import cors from 'cors'
import { connectDB } from '@config/database'
import { verifyMailer } from '@config/mailer'
import { setupSwagger } from '@config/swagger'    
import { envs } from '@config/envs'
import { errorMiddleware } from '@middlewares/error.middleware'
import { syncModels } from '@models/index'         
import router from '@routes/index'

const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger 
setupSwagger(app)

// Rutas de la API
app.use('/api', router)

// El middleware de errores SIEMPRE va al final
app.use(errorMiddleware)

const startServer = async (): Promise<void> => {
  await connectDB()       
  await syncModels()      
  await verifyMailer()    

  app.listen(envs.PORT, () => {
    console.log(` Servidor en http://localhost:${envs.PORT}`)
    console.log(` Swagger en http://localhost:${envs.PORT}/api-docs`)
  })
}

startServer()


