import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // 1. Importamos la clave secreta

export const authRequired = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers['x-access-token'];
    if (!authHeader) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            const message = err.name === 'TokenExpiredError'
                ? 'Token expirado'
                : 'Token inválido';
            return res.status(401).json({ message });
        }

        req.user = user;
        next();
    });
};