import { conmysql } from '../db.js'

export const getProductos = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM productos')
    res.json(result)
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

    res.json({
      cant: result.length,
      data: result[0]
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const postInsertarProducto = async (req, res) => {
  try {
    const {
      prod_codigo,
      prod_nombre,
      prod_stock,
      prod_precio,
      prod_activo,
      prod_imagen
    } = req.body

    const [result] = await conmysql.query(
      'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?,?,?,?,?,?)',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
    )

    res.send({ prod_id: result.insertId })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const putProducto = async (req, res) => {
  try {
    const { id } = req.params
    const {
      prod_codigo,
      prod_nombre,
      prod_stock,
      prod_precio,
      prod_activo,
      prod_imagen
    } = req.body

    await conmysql.query(
      'UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ? WHERE prod_id = ?',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    )

    res.send({ message: 'Producto actualizado' })
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
