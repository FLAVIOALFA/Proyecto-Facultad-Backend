'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var ProvinciaSchema = Schema({
	_id : Number,
	nombre: String,
	pais: { 
		type: Number, 
		ref: 'Pais'
	}

});

//Esto nos creará una coleccion de objetos dentro de Album
module.exports = mongoose.model('Provincia', ProvinciaSchema);