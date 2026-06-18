import { conmysql } from '../db.js'

// Helper corregido para usar la URL real de Clever Cloud con HTTPS
const buildImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  
  // Si la ruta ya tiene una URL completa (http:// o https://), la dejamos pasar limpia
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // URL de tu hosting en Clever Cloud
  const HOSTING_URL = 'https://app-007b6888-710c-4364-b395-07597295286a.cleverapps.io';
  
  return `${HOSTING_URL}${imagePath}`;
}

export const getProductos = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM productos')
    const productos = result.map((prod) => ({
      ...prod,
      prod_imagen: buildImageUrl(req, prod.prod_imagen)
    }))
    res.json(productos)
  } catch (error) {
    return res.status(500).json({ message: 'Error al consultar productos' })
  }
}

export const getProductoxid = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      'SELECT * FROM productos WHERE prod_id = ?',
      [req.params.id]
    )

    if (result.length <= 0) {
      return res.json({
        cant: 0,
        message: 'Producto no encontrado'
      })
    }

    const producto = {
      ...result[0],
      prod_imagen: buildImageUrl(req, result[0].prod_imagen)
    }

    res.json({
      cant: result.length,
      data: producto
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const postProducto = async (req, res) => {
    try {
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null; // capturar la imagen que se envía desde un formulario
        console.log("Datos del producto:", req.body);  // Verifica req.body
        console.log("Archivo de imagen:", req.file);   // Verifica req.file
        
        // validar que no se repita el código
        const [fila] = await conmysql.query('Select * from productos where prod_codigo=?', [prod_codigo])
        if (fila.length > 0) return res.status(404).json({
            id: 0,
            messge: 'Producto con código: ' + prod_codigo + ' ya está registrado'
        })

        const [result] = await conmysql.query(
            "INSERT INTO productos(prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?,?)",
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
        );
        res.send({ prod_id: result.insertId })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}

// función para actualizar un producto existente
export const putProducto = async (req, res) => {
    try {
        const { id } = req.params
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body
        
        let prod_imagen = req.file ? `/uploads/${req.file.filename}` : null; // capturar la imagen que se envía desde un formulario
        
        // Solo buscar en la BD si no se envió una nueva imagen
        if (!req.file) {
          const [rows] = await conmysql.query(
            'SELECT prod_imagen FROM productos WHERE prod_id = ?',
            [id]
          );
          // Si el producto existe, conservar su imagen actual
          if (rows && rows.length > 0) {
            prod_imagen = rows[0].prod_imagen;
          } else {
            return res.status(404).json({ message: 'Producto no encontrado' });
          }
        }

        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? where prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({
            messge: 'Productos no encontrado'
        })
        const [rows] = await conmysql.query('Select * from productos where prod_id=?', [id])
        res.json(rows[0])
        
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' })
    }
}

export const patchProducto = async (req, res) => {
  try {
    const { id } = req.params
    const {
      prod_codigo = null,
      prod_nombre = null,
      prod_stock = null,
      prod_precio = null,
      prod_activo = null,
      prod_imagen = null
    } = req.body

    const [result] = await conmysql.query(
      `UPDATE productos SET
        prod_codigo = COALESCE(?, prod_codigo),
        prod_nombre = COALESCE(?, prod_nombre),
        prod_stock = COALESCE(?, prod_stock),
        prod_precio = COALESCE(?, prod_precio),
        prod_activo = COALESCE(?, prod_activo),
        prod_imagen = COALESCE(?, prod_imagen)
      WHERE prod_id = ?`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.send({ message: 'Producto actualizado (PATCH)' })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await conmysql.query(
      'DELETE FROM productos WHERE prod_id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.send({ message: 'Producto eliminado con éxito' })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}