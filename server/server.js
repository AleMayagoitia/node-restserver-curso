require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
//Configuración global de rutas
app.use(require('./routes/index.js'));


// parse application/json
app.use(bodyParser.json());

mongoose.connect(process.env.URLDB, (err, resp) => {
    if (err) throw err;

    console.log("Base de datos ONLINE");
});

app.listen(process.env.PORT, () => console.log(`Escuchando en puerto: ${process.env.PORT}`));