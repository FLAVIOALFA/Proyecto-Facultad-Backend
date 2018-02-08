'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Clasificacion = require('../models/clasificacion');
var fs = require('fs');
var Mensaje = require('../models/mensaje');
var Controlador = require('./controladorSentencias');

var message = new Mensaje();
var consulta;

function getClasificaciones(req, res){

	message.error = "No hay clasificaciones agregadas.";
	consulta = Clasificacion.find({});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getClasificacion(req, res){

	var id = req.params.id;
	message.error = "No existe la clasificacion.";

	consulta = Clasificacion.findById({_id : id});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getSubClasificaciones(req, res){

	message.error = "No hay clasificaciones.";
	consulta = Clasificacion.find().where('clasificacion').exists();
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getSubClasificacionById(req, res){

		var id = req.body.id;
		message.error = "No hay sub clasificaciones.";
		consulta = Clasificacion.find().where('clasificacion', id);
		Controlador.ejecutarSentencia(res, message, consulta);
		consulta = null;

}

function saveClasificacion(req, res){

		var idClasf = req.params.id != null ? idClasf = req.params.id : null;
		var clasif = new Clasificacion();
		var params = req.body;

		if(params.denominacion != null){

			clasif.denominacion = params.denominacion;
			clasif.fecha_alta = new Date();
			message.error = "No existe la clasificacion.";
			message.success = "Sub clasificacion agregada con exito.";

			clasif.save((err, clasificacion) => {
				if(err){
					return res
						.status(500)
						.send({message: "Error en la peticion!", err: err});
				}else{
					//Si es una subclasificacion entonces agregamos
					//El campo id al elemento padre.
					if(idClasf != null){
						consulta = Clasificacion.findByIdAndUpdate(idClasf,{clasificacion :clasificacion._id});
						Controlador.ejecutarSentencia(res, message, consulta);
						consulta = null;
					}else{
						//Si no, solo agregamos la nueva clasificacion
						return res
							.status(200)
							.send({message: "Clasificacion agregada correctamente!"});
					}
				}
			});

		}else{
			return res
				.status(409)
				.send({message: "El campo Denominacion no puede estar vacío!"});
		}
}

function updateClasificacion(req, res){

	var id = req.body.id;
	var params = req.body;

	Clasificacion.findById(id, (err, clasificacion) => {
		if(err){
			return res
				.status(500)
				.send({message : "Error en el servidor.", err : err});
		}else{

			if(req.denominacion != null){
				var denominacion = req.denominacion;

				if(clasificacion.clasificacion != null){
				//Es una subclasificacion
					if(params.clasificacion != null){
						consulta = Clasificacion.findByIdAndUpdate(id, {denominacion : params.denominacion, clasificacion : params.clasificacion});
					}else{
						return res
							.status(404)
							.send({message : "El campo clasificacion no puede estar vacío."});
					}

				}else{
					//Es una clasificacion
					consulta = Clasificacion.findByIdAndUpdate(id, {denominacion : params.denominacion});
				}

				//Ejecutar la consulta
				message.error = "No existe la clasificacion.";
				message.success = "Clasificacion actualizada correctamente.";
				Controlador.ejecutarSentencia(res, message, consulta);
				consulta = null;

			}else{
				return res
					.status(409)
					.send({message : 'El campo denominacion no puede estar vacío.'});
			}

		}
	});
}

module.exports = {
	getClasificaciones,
	getClasificacion,
	getSubClasificaciones,
	getSubClasificacionById,
	saveClasificacion,
	updateClasificacion
}
