'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var PaisSchema = Schema({
	_id: Number,
	codPais: String,
	nombre: String,
	codContinente: Number

});

//Esto nos creará una coleccion de objetos dentro de Album
module.exports = mongoose.model('Pais', PaisSchema);