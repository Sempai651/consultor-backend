import { Request, Response, NextFunction } from 'express'


// Este wrapper envuelve cualquier función async del controlador
// y atrapa los errores automáticamente

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next)  
  }
}