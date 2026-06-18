import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/upload.js' // Importación corregida con { }
import {
  getProductos,
  getProductoxid,
  postProducto,
  putProducto,
  patchProducto,
  deleteProducto
} from '../controladores/prodCtrl.js'

const router = Router()

// Proteger todas las rutas de abajo
router.use(authRequired)

router.get('/productos', getProductos)
router.get('/productos/:id', getProductoxid)

// Inyectamos Multer para procesar 'prod_imagen' al insertar y editar
router.post('/productos', upload.single('prod_imagen'), postProducto)
router.put('/productos/:id', upload.single('prod_imagen'), putProducto)

router.patch('/productos/:id', patchProducto)
router.delete('/productos/:id', deleteProducto)

export default router