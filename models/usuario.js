'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
	nombre: String,
	apellido: String,
	email: String,
	fecha_nacimiento: String,
	sexo: String,
	telefono: Number,
	password: String,
	fecha_alta: Date,
	fecha_baja: Date,
	foto_perfil: {
		type: Schema.Types.ObjectId,
		ref: 'Foto'
	},
	role: {
		type: Schema.Types.ObjectId,
		ref: 'Role',
		default: '59892089179d6925706eb069' // Role por defecto, usuario.
	},
	domicilio: {
		type: Schema.Types.ObjectId,
		ref: 'Domicilio'
	}

});

//Esto nos creará una coleccion de objetos dentro de Usuario
module.exports = mongoose.model('Usuario', UsuarioSchema);
