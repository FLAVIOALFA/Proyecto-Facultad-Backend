'use strict'
//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Continente = require('../models/continente');
var Pais = require('../models/pais');
var mongoXlsx = require('mongo-xlsx');
var Provincia = require('../models/provincia');

var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

function getContinentes(req, res){

	message.error = "No se encontraron continentes.";
	consulta = Continente.find({});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function updateContinente(req, res){

	var id = req.body.id;
	var params = req.body;
	message.error = "No se pudo actualizar el continente.";
	consulta = Continente.findByIdAndUpdate(id, params);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;
	
}

module.exports = {
	getContinentes,
	updateContinente
}
