'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var DomicilioSchema = Schema({
	calle: String,
	barrio: String,
	numero: Number,
	latitud: Number,
	longitud: Number,
	provincia: {
		type: Number, 
		ref: 'Provincia'
	}

});

//Esto nos creará una coleccion de objetos dentro de Album
module.exports = mongoose.model('Domicilio', DomicilioSchema);
