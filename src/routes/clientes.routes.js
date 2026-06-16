import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware.js'

import { getClientes, getClientesxid, postinsertarClientes, putClientes, patchClientes, deleteClientes } from '../controladores/clientesCtrl.js'

const router = Router()

// Proteger todas las rutas de clientes con JWT
router.use(authRequired)

router.get('/clientes',getClientes)
router.get('/clientes/:id', getClientesxid)
router.post('/clientes', postinsertarClientes)
router.put('/clientes/:id', putClientes)
router.patch('/clientes/:id', patchClientes)
router.delete('/clientes/:id', deleteClientes)

export default router