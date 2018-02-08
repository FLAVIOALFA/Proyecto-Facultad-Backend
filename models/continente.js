'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var ContinenteSchema = Schema({
	_id : Number,
	nombre: String
});

//Esto nos creará una coleccion de objetos dentro de Album
module.exports = mongoose.model('Continente', ContinenteSchema);
