


export interface RegisterDto {
    nombre: string
    apellido: string
    cedula: string      
    email: string
    password: string
}

export interface LoginDto {
    cedula: string      
    password: string
}

export interface JwtPayload {
    id: number
    cedula: string      
}

export interface AuthResponse {
    token: string
    usuario: {
        id: number
        nombre: string
        cedula: string
        email: string
    }
}