import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware.js'
import {
  getProductos,
  getProductoxid,
  postInsertarProducto,
  putProducto,
  patchProducto,
  deleteProducto
} from '../controladores/prodCtrl.js'

const router = Router()

router.use(authRequired)

router.get('/productos', getProductos)
router.get('/productos/:id', getProductoxid)
router.post('/productos', postInsertarProducto)
router.put('/productos/:id', putProducto)
router.patch('/productos/:id', patchProducto)
router.delete('/productos/:id', deleteProducto)

export default router
