import express from 'express';
import cors from 'cors'; // Si lo estás usando
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import productoRoutes from './routes/productos.routes.js'; // Tus rutas de productos

// Calcular rutas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares globales de procesamiento
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================================
// HABILITAR ACCESO PÚBLICO A LA CARPETA UPLOADS
// ========================================================
// Al estar index.js dentro de 'src', resuelve directo a 'src/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Tus rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api', productoRoutes);

export default app;

