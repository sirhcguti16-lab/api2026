import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // 1. Importamos la clave secreta

export const authRequired = (req, res, next) => {
    // Tu lógica para obtener las cabeceras...
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.split(' ')[1]; // Extrae el token después de 'Bearer'
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    // 2. Agregamos JWT_SECRET como segundo parámetro
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: "Token inválido" });

        req.user = user;
        next();
    });
};