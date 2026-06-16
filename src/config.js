import { config } from 'dotenv'

config()

// Variables adaptadas para Clever Cloud y soporte Local
export const DB_HOST = process.env.MYSQL_ADDON_HOST || process.env.DB_HOST 
export const DB_DATABASE = process.env.MYSQL_ADDON_DB || process.env.DB_DATABASE 
export const DB_USER = process.env.MYSQL_ADDON_USER || process.env.DB_USER 
export const DB_PASSWORD = process.env.MYSQL_ADDON_PASSWORD || process.env.DB_PASSWORD 
export const DB_PORT = process.env.MYSQL_ADDON_PORT || process.env.DB_PORT || 3306

// El puerto de la API (Clever Cloud asigna uno automáticamente en process.env.PORT)
export const PORT = process.env.PORT || 3000

// Tus otras variables se quedan exactamente igual
export const JWT_SECRET = process.env.JWT_SECRET || 'mi_super_secreto_jwt'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
export const AUTH_USER = process.env.AUTH_USER || 'admin'
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD || '123456'