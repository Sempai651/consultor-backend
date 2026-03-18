/**res.json({ data: usuario })           
res.json({ result: usuario })         
res.json({ usuario: usuario })        
res.status(400).json({ msg: 'Error' }) 
*/

interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T 
    statusCode: number
}

export class ResponseUtil {

  // Respuesta exitosa — 200, 201, etc.
  static success<T>(
    res: any,
    message: string,
    data?: T,
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      statusCode,
    }
    res.status(statusCode).json(response)
  }

  // Respuesta de error — 400, 401, 404, 500, etc.
  static error(
    res: any,
    message: string,
    statusCode: number = 500
  ): void {
    const response: ApiResponse<null> = {
      success: false,
      message,
      statusCode,
    }
    res.status(statusCode).json(response)
  }
}