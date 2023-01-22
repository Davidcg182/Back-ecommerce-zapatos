const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    apellido: {
        type: String,
        default: ""
    },
    cumpleaños: {
        type: String,
        default: ""
    },
    contraseña: {
        type: String,
        required: true,
        select: false
    },
    favoritos: {
        type: Array
    },
    ciudad:
    {
        type: String,
        default: ""
    },
    pais:
    {
        type: String,
        default: ""
    },
    direccion:
    {
        type: String,
        default: ""
    },
    tarjeta:
    {
        type: Number,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('usuarios', userSchema);