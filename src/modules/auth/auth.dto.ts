

// Algoritmo oficial de validación de cédula ecuatoriana
const validarCedulaEcuatoriana = (cedula: string): boolean => {

    
    if (!/^\d{10}$/.test(cedula)) return false

    
    const provincia = parseInt(cedula.substring(0, 2))
    if (provincia < 1 || provincia > 24) return false

    
    const tercerDigito = parseInt(cedula[2])
    if (tercerDigito >= 6) return false

    
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
    let suma = 0

    for (let i = 0; i < 9; i++) {
        let valor = parseInt(cedula[i]) * coeficientes[i]
        // Si el resultado es >= 10, se resta 9
        if (valor >= 10) valor -= 9
        suma += valor
    }

    
    const digitoVerificador = parseInt(cedula[9])

    
    const residuo = suma % 10
    const resultado = residuo === 0 ? 0 : 10 - residuo

    return resultado === digitoVerificador
}

export const validateRegister = (body: any): string | null => {
    const { nombre, apellido, cedula, email, password } = body

    if (!nombre || nombre.trim() === '')
        return 'El nombre es obligatorio'

    if (!apellido || apellido.trim() === '')
        return 'El apellido es obligatorio'

    if (!cedula || !validarCedulaEcuatoriana(cedula))
        return 'La cédula ecuatoriana no es válida'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return 'El email no es válido'

    if (!password || password.length < 8)
        return 'La contraseña debe tener al menos 8 caracteres'

    return null
}

export const validateLogin = (body: any): string | null => {
    const { cedula, password } = body

    if (!cedula || !validarCedulaEcuatoriana(cedula))
        return 'La cédula ecuatoriana no es válida'

    if (!password || password.trim() === '')
        return 'La contraseña es obligatoria'

    return null
}

export const validateRecuperarClave = (body: any): string | null => {
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return 'El email no es válido'

    return null
}