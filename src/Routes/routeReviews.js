const express = require("express");
const productSchema = require("../Models/modelProducts.js")

const router = express.Router();

router.get("", async (req, res) => {
    try {
        const products = await productSchema.find();
        const reviews = products.map(e => e.revisiones);
        const orderReviews = reviews.flat(reviews.length)
        res.send(orderReviews)
        //res.send(reviews)
    } catch (error) {
        console.log(error)
    }
});

//Ruta de eliminacion de 1 reseña especifica 
// router.put('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const products = await productSchema.find();
//         products.forEach(async e => {
//             if (e.revisiones.length > 0) {
//                 const filtProducts = e.revisiones.filter(f => f._id !== id);
//                 console.log(filtProducts)
//                 await filtProducts.save();
//                 return res.send(filtProducts)
//             }
//         })
//     } catch (error) {
//         console.log(error)
//     }
// });


// //Ruta de eliminacion de 1 reseña especifica 
// router.delete('/:id', (req, res) => {
//     const { id } = req.params;
//     productSchema
//         .remove({ _id: id })
//         .then((data) => res.send(data))
//         .catch((e) => res.send({ message: e }));
// });

module.exports = router;