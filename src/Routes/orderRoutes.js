const express = require('express');
const mercadopago = require('mercadopago');
const Order = require('../Models/orderModel.js');
const userSchema = require('../Models/modelUser.js');
const zapSchema = require('../Models/modelProducts.js');

const orderRouter = express.Router();

//CREATE ORDER
orderRouter.post("/", async (req, res) => {
    try {
      const { items, user, total, direccion, ciudad, pais } = req.body;
      
      const respuesta = items.map((p) => {
        return { ...p, stock: p.inventario - p.qty };
      });
      
      
      const arts = respuesta.map((prods) => {
        // console.log("ESTO ES PRODS ", prods);
        return {
          id: prods.producto,
          // picture_url: prods.imagenes[0],
          category_id: "fashion",
          title: prods.nombreArticulo,
          unit_price: prods.precioVenta,
          // description: prods.descripcion,
          quantity: prods.qty,
          currency_id: "ARS",
        };
      });
      
      
      const artOrder = respuesta.map((p) => {
        return {
          marca: p.marca,
          modelo: p.nombreArticulo,
          cantidad: p.qty,
          precio: p.precioVenta,
          producto: p.producto,
        };
      });
      
      
      for (const q in respuesta) {
        if (q.stock < 0) {
          res.status(400).json({
            msg: "La cantidad solicitada de " + q.nombreArticulo + " supera el stock disponible.", ordenResp: "", estatus: "fail"  
          });
        }
      }
      
      if (items && items.length === 0) {
        res.status(400).json({ msg: "No hay productos en la orden de compra", ordenResp: "", estatus: "fail" });
      } else {
        const preference = {
          items: arts,
          back_urls: {
            success: "https://henry-pf-front-end.vercel.app/compraexitosa",
            failure: "https://henry-pf-front-end.vercel.app/compraexitosa",
            pending: "https://henry-pf-front-end.vercel.app/compraexitosa",
          },
          //auto_return: "approved",
          binary_mode: true,
        };
        
        
        const resp = await mercadopago.preferences.create(preference);
        
        const usuarios = await userSchema.find();
        const userInfo = usuarios.filter(obj => obj._id === user);
        
        
        
        const order = {
          usuario: user,
          direccionEntrega: {
            direccion: direccion,
            ciudad: ciudad,
            pais: pais,
          },
          orderItems: artOrder,
          metodoDePago: "mercadopago",
          preferenceId: resp.body.init_point,
          // preferenceInit: resp.body.init_point,
          // preferenceId: resp.body.id,
          precioTotal: total,
          estadoPago: "pending",
          fechaCreacion: new Date()
          .toLocaleString()
          .replace(",", "")
          .replace(/:.. /, " "),
          estadoEntrega: false,
        };
        
        
        console.log("LA ORDEN ", order);
        const nuevaOrden = new Order(order);
        
        await nuevaOrden.save();
        
       // console.log("LA ORDEN ", nuevaOrden);

        

        res
          .status(201)
          .json({ msg: "Orden creada con exito", ordenResp: nuevaOrden, estatus: "ok" });
      }
    } catch {
        res.status(404).json({ msg: "No hubo respuesta de la base de datos, por favor, intente mas tarde", ordenResp: "", estatus: "fail" });
    }
});
// orderRouter.post('/', async (req, res) => {
//     const {
//         usuario,
//         orderItems,
//         direccionEntrega,
//         metodoDePago,
//         precioEnvio,
//     } = req.body;

//     if (orderItems && orderItems.length === 0) {
//         res.status(400).send("No hay productos en la orden de compra");
//     }

//     else {

//         let totalprice = 0
//         orderItems.forEach(e => {
//             e.precio = e.cantidad * e.precio
//             totalprice = totalprice + e.precio
//         });

//         const order = new Order({
//             usuario,
//             orderItems,
//             direccionEntrega,
//             metodoDePago,
//             precioEnvio,
//             precioTotal: totalprice
//         });

//         const createOrder = await order.save();
//         res.status(201).json(createOrder);
//     }
// });

// GET ORDER BY ID
orderRouter.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        res.json(order);
    }
    else {
        res.status(401).send("Orden de compra inexistente");
    }
});

// GET ALL ORDERS
orderRouter.get('', async (req, res) => {
    const order = await Order.find()
    if (order) {
        res.json(order);
    }
    else {
        res.status(401).send("No se encuentran ordenes de compra");
    }
});

// // ORDER IS PAID
orderRouter.put('/:id/pay', async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.estadoPago = true;
        order.resultadoDePago = {
            id: req.body.id,
            estado: req.body.estado,
            fechaDePago: req.body.fechaDePago,
            email: req.body.email,
        }

        const updateOrder = await order.save();
        res.json(updateOrder)
    }
    else {
        res.status(401).send("Order not found");
    }
});

//PEDIDO ENTREGADO
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