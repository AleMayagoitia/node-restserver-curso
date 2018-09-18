const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria.js');
const _ = require('underscore');

//Mostrar todas las categorías
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        //ordena por:
        .sort('descripcion')
        //revisar que ids u objetos existen en la categoria solicitada y permite cargar informacion
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias: categorias,
                    cuantas: conteo
                });
            });
        });
});

//Mostrar una categoría por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById();
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//Crear nueva categoria
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    //regresa la nueva categoría
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//Actualiza categoria
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findOneAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            res.json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        } else {
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        };
    });
});

//Borra categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Solo un admin puede borrar
    //Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findOneAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            res.json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        } else {
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        };
    });
});


module.exports = app;