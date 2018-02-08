'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Pais = require('../models/pais');
var Provincia = require('../models/provincia');

var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

function getPaises(req, res){
	message.error = "No hay paises para mostrar.";
	consulta = Pais.find({}).sort({nombre : 'ascending'});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;
}

function updatePaises(req, res){
	var id = req.params.id;
	var params = req.body;
	message.error = "No existe el país.";
	consulta = Pais.findByIdAndUpdate(id, params);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;
}

module.exports = {
	getPaises,
	updatePaises
}
