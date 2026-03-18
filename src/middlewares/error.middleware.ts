
import { Request, Response, NextFunction } from 'express'
import { ResponseUtil } from '@utils/response.util'

//Creamos un manejador de errores 
export const errorMiddleware = (err: Error,req: Request,res: Response,next: NextFunction): void => {
  console.error(`[ERROR] ${err.message}`)

  ResponseUtil.error(res,err.message || 'Error interno del servidor',500)
}

