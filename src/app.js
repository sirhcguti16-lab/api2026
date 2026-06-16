import express from 'express'
import cors from 'cors'
import clientesRouter from './routes/clientes.routes.js'
import productosRouter from './routes/productos.routes.js'
import authRouter from './routes/auth.routes.js'

const app = express()

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

// rutas de autenticación
app.use('/api/auth', authRouter)

// rutas protegidas de clientes y productos
app.use('/api', clientesRouter)
app.use('/api', productosRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

export default app
