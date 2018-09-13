require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
//Configuración global de rutas
app.use(require('./routes/index.js'));


// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public para que se pueda acceder desde cualquier lugar
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, (err, resp) => {
    if (err) throw err;

    console.log("Base de datos ONLINE");
});

app.listen(process.env.PORT, () => console.log(`Escuchando en puerto: ${process.env.PORT}`));