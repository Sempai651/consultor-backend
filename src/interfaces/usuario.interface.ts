// src/interfaces/usuario.interface.ts

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    cedula: string;
    email: string;
    rol: 'admin' | 'cliente';  // <--- AGREGAR
  };
}

export interface RegisterDto {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  password: string;
}

export interface LoginDto {
  cedula: string;
  password: string;
}