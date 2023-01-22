const express = require('express');
const userSchema = require('../Models/modelUser.js');
const productSchema = require('../Models/modelProducts.js');

const router = express.Router()

//Ruta de creacion de usuarios (users)
router.post('/', async (req, res) => {
    try {
        const newUser = await userSchema(req.body);
        await newUser.save()
        res.send(newUser)
    } catch (error) {
        res.status(400).send({ error: "error" })
    }
});

// Ruta login
router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;
    const usuario = await userSchema.findOne({ email });
    const constraseña = await userSchema.findOne({ contraseña });

    if (usuario && constraseña) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            admin: usuario.admin,
            estado: usuario.estado,
            createdAt: usuario.createdAt
        })
    } else {
        res.status(401).send("Usuario y/o contraseña invalidos")
    }
});

//Ruta de obtener todos los usuarios (users)
router.get('/', (req, res) => {
    userSchema.find()
        .then((data) => res.send(data))
        .catch((e) => res.send({ error: e }))
})

//Ruta de obtener 1 usuarios especifico (user)
router.get('/:id', (req, res) => {
    const { id } = req.params
    userSchema
        .findById(id)
        .then((data) => res.send(data))
        .catch((e) => res.send({ message: e }));
})

// Ruta de modificar 1 usuarios especifico (user)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, apellido, cumpleaños, contraseña, ciudad, pais, admin, estado, direccion } = req.body;
        const user = await userSchema
            .updateOne({ _id: id }, { $set: { nombre, email, apellido, cumpleaños, contraseña, ciudad, pais, admin, estado, direccion } })
        res.json(user)
    } catch (error) {
        res.send({ message: e });
    }

})

// router.put('/:id', async (req, res) => {

//     const { id } = req.params;
//     const user = await userSchema.findById(id)
//     const { nombre, email, apellido, cumpleaños, contraseña, ciudad, pais, admin, estado, direccion } = req.body;
    
//     if (user) {
//         user.nombre = nombre
//         user.email = email
//         user.apellido = apellido
//         user.cumpleaños = cumpleaños
//         user.contraseña = contraseña
//         user.ciudad = ciudad
//         user.pais = pais
//         user.admin = admin
//         user.estado = estado
//         user.direccion = direccion 
    
//         const updateUser = await user.save();
//         res.json(updateUser)
//     }
//     else {
//         res.status(401).send("User not found");
//     }
// });

//Ruta de eliminacion de 1 usuarios especifico (user)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    userSchema
        .remove({ _id: id })
        .then((data) => res.send(data))
        .catch((e) => res.send({ message: e }));
});

// router.post('/:id/favorito', async (req, res) => {
//     const { producto, actividad } = req.body;
//     const { id } = req.params
//     //console.log(id)
//     const user = await userSchema.findById(id)
//     //console.log(product.color)
//     if (user) {
//         const alreadyFav = user.favoritos.find(
//             (e) => e.producto.toString() === producto.toString()
//         )
//         if (alreadyFav) {
//             return res.status(400).send("Ya agregaste este producto a favoritos")
//             //throw new Error("Ya agregaste una revision a este producto") //crashea el back
//         }
//         const favorit = {
//             producto,
//             actividad,
//         };

//         user.favoritos.push(favorit);
//         await user.save();
//         res.status(201).json({ mensaje: "producto agregado a favoritos" })
//     } else {
//         res.status(404).send("Producto no encontrado")
//         //throw new Error("Producto no encontrado")
//     }
// });

router.post('/:idproduct/favorito', async (req, res) => {
    const { idproduct } = req.params;
    const { iduser } = req.query;
    //console.log(id)
    const user = await userSchema.findById(iduser)
    const product = await productSchema.findById(idproduct)
    //console.log(user, product)
    //console.log(product.color)
    if (user) {
        if (user.favoritos.length > 0) {
            const alreadyFav = user.favoritos.find(
                (e) => e.modelo.toString() === product.modelo.toString()
            )
            if (alreadyFav) {
                return res.status(400).send("Ya agregaste este producto a favoritos")
                //throw new Error("Ya agregaste una revision a este producto") //crashea el back
            }
        }
        const favorit = {
            actividad: product.actividad,
            color: product.color,
            imagenes: product.imagenes,
            marca: product.marca,
            modelo: product.modelo,
            precio: product.precio,
            talle: product.talle,
            descripcion: product.descripcion,
            producto: idproduct
        };

        user.favoritos.push(favorit);
        await user.save();
        res.status(201).json({ mensaje: "producto agregado a favoritos" })
    } else {
        res.status(404).send("Producto no encontrado")
        //throw new Error("Producto no encontrado")
    }
});

module.exports = router;