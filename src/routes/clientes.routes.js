import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware.js'
import { getClientes, getClientesxid, postinsertarClientes, putClientes, patchClientes, deleteClientes } from '../controladores/clientesCtrl.js'

const router = Router()

router.use(authRequired)

router.get('/', getClientes)
router.get('/:id', getClientesxid)
router.post('/', postinsertarClientes)
router.put('/:id', putClientes)
router.patch('/:id', patchClientes)
router.delete('/:id', deleteClientes)

export default router