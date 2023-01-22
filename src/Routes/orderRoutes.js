const express = require('express');
const Order = require('../Models/orderModel.js');

const orderRouter = express.Router();

//CREATE ORDER
orderRouter.post('/', async (req, res) => {

    const {
        usuario,
        orderItems,
        direccionEntrega,
        metodoDePago,
        precioEnvio,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).send("no hay productos en la orden de compra");
    }

    else {

        let x = 0
        orderItems.forEach(e => {
            x = x + e.precio
        });

        const order = new Order({
            usuario,
            orderItems,
            direccionEntrega,
            metodoDePago,
            precioEnvio,
            precioTotal: x
        });

        const createOrder = await order.save();
        res.status(201).json(createOrder);
    }
});

// GET ORDER BY ID
orderRouter.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        res.json(order);
    }
    else {
        res.status(401).send("Order not found");
    }
});

// GET ORDERS
orderRouter.get('', async (req, res) => {
    const order = await Order.find()
    if (order) {
        res.json(order);
    }
    else {
        res.status(401).send("Order not found");
    }
});

// router.get('', (req, res) => {
//     zapSchema.find()
//         .then((data) => res.send(data))
//         .catch((e) => res.send({ error: e }))
// })


// // ORDER IS PAID
// orderRouter.put('/:id/pay', async (req, res) => {
//     const order = await Order.findById(req.params.id);

//     if (order) {
//         order.estadoPago = true;
//         order.fechaPago = "AGREGAR FUNCION CON FECHA ACTUAL"
//         // order.resultadoDePago = {
//         //     id: req.body.id,
//         //     estado: req.body.estado,
//         //     fechaDePago: req.body.fechaDePago,
//         //     email: req.body.email,
//         // }

//         const updateOrder = await order.save();
//         res.json(updateOrder)
//     }
//     else {
//         res.status(401).send("Order not found");
//     }
// });


orderRouter.put('/:id/enviado', async (req, res) => {
    const order = await Order.findById(req.params.id);
    const {precioEnvio, estadoEntrega} = req.body
    if (order) {
        order.estadoEntrega = estadoEntrega;
        order.precioEnvio = precioEnvio
        const updateOrder = await order.save();
        res.json(updateOrder)
    }
    else {
        res.status(401).send("Order not found");
    }
});

module.exports = orderRouter