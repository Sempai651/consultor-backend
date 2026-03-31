import nodemailer from 'nodemailer'
import { envs } from '@config/envs'

const transporter = nodemailer.createTransport({
    host: envs.SMTP_HOST,
    port: envs.SMTP_PORT,
    secure: false,
    auth: {
        user: envs.SMTP_USER,
        pass: envs.SMTP_PASS,
    },
})

export const verifyMailer = async (): Promise<void> => {
    await transporter.verify()
    console.log('Conexion SMTP exitosa')
}

export default transporter