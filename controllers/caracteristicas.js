'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Caracteristica = require('../models/caracteristicas');

var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

function getCaracteristicas(req, res){

	message.error = "No se encontraron caracteristicas.";
	consulta = Caracteristica.find({});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getCaracteristica(req, res){

	var id = req.params.id;
	message.error = "No existe el id de la caracteristica";
	consulta = Caracteristica.findById(id);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function saveCaracteristica(req, res) {

	var params = req.body;

	//Buscamos si existe la caracteristica en la DB
	Caracteristica.findOne({denominacion : params.denominacion.toLowerCase()}, (err, carac) => {
		if(err) return res.status(500).send({message: "Error en el servidor", err:err});
		
		if(!carac){
			//Buscamos que no venga vacía
			if(params.denominacion != null){
				var caracteristica = new Caracteristicas();
				//Seteamos el valor al objeto
				caracteristica.denominacion = params.denominacion;
				//Guardamos el nuevo objeto
				message.error = "Se agrego la caracteristica " + params.denominacion + " correctamente.";
				consulta = caracteristica.save();
				Controlador.ejecutarSentencia(res, message, consulta);
				consulta = null;

			}else{
				return res
					.status(409)
					.send({message: "No se envió el nombre de la caracteristica"});
			}
		}else{
			return res
				.status(409)
				.send({message:"La caracteristica ingresada ya existe"});
		}
	});
}

function updateCaracteristica(req, res){
	var id = req.params.id;
	var params = req.body;
	message.error = "No existe la caracteristica.";
	message.success = "Caracteristica actualizada correctamente.";

	consulta = Caracteristica.findByIdAndUpdate(id, params);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

module.exports = {
	getCaracteristica,
	getCaracteristicas,
	saveCaracteristica,
	updateCaracteristica
}
