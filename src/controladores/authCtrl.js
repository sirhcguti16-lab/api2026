import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { conmysql } from '../db.js'; 
import { JWT_SECRET } from '../config.js';

// 1. INICIO DE SESIÓN (LOGIN)
export const login = async (req, res) => {
    try {
        const { user: frontendUser, password } = req.body; 

        console.log("Datos recibidos:", { frontendUser, password });

        // Buscamos en la BD usando la columna real 'usr_usuario'
        const [rows] = await conmysql.query('SELECT * FROM usuarios WHERE usr_usuario = ?', [frontendUser]);

        // Si no encuentra filas, el usuario no existe
        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const dbUser = rows[0];
        console.log("Usuario encontrado en BD:", dbUser);

        // Comparamos la contraseña recibida con el hash de la BD ('usr_clave')
        const match = await bcrypt.compare(password, dbUser.usr_clave);

        if (!match) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // 4. GENERAR EL TOKEN JWT (Usando el JWT_SECRET importado)
        const token = jwt.sign(
            { id: dbUser.usr_id, user: dbUser.usr_usuario },
            JWT_SECRET || 'clave_secreta_de_emergencia', // Si config falla, usa un plan B
            { expiresIn: '1h' }
        );

        console.log("¡Token generado con éxito!:", token);

        // 5. Respondemos enviando el Token correctamente
        return res.status(200).json({ 
            message: "Login exitoso", 
            token: token,
            user: dbUser.usr_usuario,
            usuario: { 
                id: dbUser.usr_id, 
                nombre: dbUser.usr_usuario
            }
        });
    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// 2. REGISTRO DE USUARIOS
export const register = async (req, res) => {
    const { usr_usuario, clave } = req.body; 

    try {
        if (!usr_usuario || !clave) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt);

        await conmysql.query('INSERT INTO usuarios (usr_usuario, usr_clave) VALUES (?, ?)', [usr_usuario, hashedPassword]);

        return res.status(201).json({ message: 'Usuario registrado exitosamente con clave encriptada.' });
    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({ message: 'Error al registrar', error: error.message });
    }
};

// 3. RENOVAR TOKEN
export const renewToken = async (req, res) => {
    const usuario = req.user; 

    try {
        if (!usuario) {
            return res.status(401).json({ message: 'No hay usuario autenticado para renovar el token' });
        }

        const token = jwt.sign(
            { id: usuario.id, user: usuario.user },
            JWT_SECRET || 'clave_secreta_de_emergencia',
            { expiresIn: '1h' }
        );

        return res.json({
            message: 'Token renovado con éxito',
            token: token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al renovar el token', error: error.message });
    }
};