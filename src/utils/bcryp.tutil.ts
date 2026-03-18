import bcrypt from 'bcryptjs'

export class BcryptUtil {

  // Incriptamos a un hash seguro, y le ingresamos un sat rounds de 10 
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

//comparamos la password con su hash guardada en la BD
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}