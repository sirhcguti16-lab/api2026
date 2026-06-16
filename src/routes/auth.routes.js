import { Router } from 'express';
import { login, register, renewToken } from '../controladores/authCtrl.js';
import { authRequired } from '../middlewares/authMiddleware.js'; // Tu middleware de protección

const router = Router();

// 1. RUTA DE LOGIN: Debe ser PÚBLICA (Sin middleware)
router.post('/login', login);

// 2. RUTA DE REGISTRO: Debe ser PÚBLICA (Sin middleware) <-- AQUÍ ESTABA EL ERROR
router.post('/register', register); 

// 3. RUTA DE RENOVAR: Esta SÍ debe ser PRIVADA (Lleva middleware)
router.get('/renew', authRequired, renewToken);

export default router;