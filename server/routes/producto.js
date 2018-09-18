const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//**************/
//Obtener productos
//*************/
app.get('/producto', (req, res) => {
    //trae todos los productos 
    //populate: usuario y categoria
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(hasta)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            };
            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productos: productos,
                    cuantos: conteo
                });
            });
        });
});
//producto por id
app.get('/producto/:id', (req, res) => {
    id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'El producto no fue encontrado'
                    }
                });
            }
            res.status(201).json({
                ok: true,
                producto: productoDB
            });
        }).populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');
});
//Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(201).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productos
            });
        });
});

//Crear un nuevo producto
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(201).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
//Actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no fue encontrado'
                }
            });
        };
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });




    });
});

//Borrar un producto
app.delete('/producto/:id', (req, res) => {
    id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(201).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no fue encontrado'
                }
            });
        };
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(201).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });
        });
    });
});

module.exports = app;