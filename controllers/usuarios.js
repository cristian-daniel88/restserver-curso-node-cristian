const { response, request } = require('express');

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { validate } = require('../models/usuario');



const usuariosGet = async(req = request, res = response) => {

    
     
    // El query como ejemplo en postman: {{url}}/api/usuarios?desde=5&limite=10  


    // cuando ponemos el estado en true, solos los usuarios con estado en true apareceran en nuestra peticion get
    const query = {estado: true};
    const {limite = 5, desde = 0, } = req.query;
   
    const [total, usuarios] = await Promise.all([
        //total de usuarios con estado=true
        Usuario.countDocuments(query),
    
        //usuarios
        Usuario.find(query)
            .skip(Number(desde))
            .limit( Number(limite) )
    ]);

    res.json({
        
         total,
         usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const {nombre,  correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
 
    // Encriptar contraseña 
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);


    // guardar en base de datos
    await usuario.save();

    res.json({
        msg: 'post API - usuariosPost',
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos
    if ( password ) {
        // Encriptar contraseña 
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );


    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

//

const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;

    // fisicamente  lo borramos, es decir de todos lados
    // const usuario = await Usuario.findByIdAndDelete( id );
    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
         
    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}

//