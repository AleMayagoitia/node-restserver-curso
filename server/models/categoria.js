const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    /*
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"],
        unique: true
    },*/
    descripcion: {
        type: String,
        required: [true, "La descripción es necesaria"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, "El nombre es necesario"]

    }
});

categoriaSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();

    return categoriaObject;
}

categoriaSchema.plugin(uniqueValidator, {
    message: "{PATH} debe ser único"
});

module.exports = mongoose.model('Categoria', categoriaSchema);