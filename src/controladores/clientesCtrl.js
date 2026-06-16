import {conmysql} from '../db.js'

export const getClientes = 
    async (req,res) => {
        try {
        const [result] = await conmysql.query('SELECT * FROM clientes')
        res.json(result)
    }catch (error) {
        return res.status(500).json({message: 'Error al consultar clientes'})
}
} 


export const getClientesxid =async(req,res) => {
    try {
        const[result] = await conmysql.query(
            'SELECT * FROM clientes WHERE cli_id = ?',[req.params.id]);
            if (result.length <= 0) return res.json(
                {
                cant : 0,
                message: 'Cliente no encontrado'
            }
        )
        res.json(
            {
                cant : result.length,
                data: result[0] 
            });
    } catch (error) {
        return res.status(500).json({message: 'Error en el  servidor'});
    } 
}


export  const postinsertarClientes = async (req,res) => {
    try {

        const {cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad} = req.body 
        //console.log(req.body)
        const[result] = await conmysql.query(
            'INSERT INTO clientes (cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad) VALUES (?,?,?,?,?,?,?)',
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad]
        )
        res.send({cli_id:result.insertId});
    }catch (error) {
        return res.status(500).json({message: 'Error en el servidor'})
    }
}


export  const putClientes = async (req,res) => {
    try {

        const {id} = req.params
        const {cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad} = req.body 
        //console.log(req.body)
        const[result] = await conmysql.query(
            'UPDATE clientes SET cli_identificacion = ?, cli_nombre = ?, cli_telefono = ?, cli_correo = ?, cli_direccion = ?, cli_pais = ?, cli_ciudad = ? WHERE cli_id = ?',
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, id]
        )
        res.send({message: 'Cliente actualizado'});
    }catch (error) {
        return res.status(500).json({message: 'Error en el servidor'})
    }
}

export const patchClientes = async (req, res) => {
    try {
        const { id } = req.params
        
        
        const { 
            cli_identificacion = null, 
            cli_nombre = null, 
            cli_telefono = null, 
            cli_correo = null, 
            cli_direccion = null, 
            cli_pais = null, 
            cli_ciudad = null 
        } = req.body 

        
        const [result] = await conmysql.query(
            `UPDATE clientes SET 
                cli_identificacion = COALESCE(?, cli_identificacion), 
                cli_nombre = COALESCE(?, cli_nombre), 
                cli_telefono = COALESCE(?, cli_telefono), 
                cli_correo = COALESCE(?, cli_correo), 
                cli_direccion = COALESCE(?, cli_direccion), 
                cli_pais = COALESCE(?, cli_pais), 
                cli_ciudad = COALESCE(?, cli_ciudad) 
            WHERE cli_id = ?`,
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, id]
        )

        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        res.send({ message: 'Cliente actualizado (PATCH)' });

    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' })
    }
}


export const deleteClientes = async (req, res) => {
    try {
        const { id } = req.params

        
        const [result] = await conmysql.query(
            'DELETE FROM clientes WHERE cli_id = ?',
            [id]
        )

        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        res.send({ message: 'Cliente eliminado con éxito' });

    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' })
    }
}