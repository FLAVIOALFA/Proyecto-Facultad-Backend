'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Habitacion = require('../models/habitacion');
var CaracteristicasHabitacion = require('../models/caracteristicas');
var Alojamiento = require('../models/alojamiento');
var moment = require('moment');

var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

function getHabitaciones(req, res){

		message.error = "No hay habitaciones agregadas.";
		consulta = Habitacion.find({});
		Controlador.ejecutarSentencia(res, message, consulta);
		consulta = null;

}

function getHabitacion(req, res){

	var id = req.params.id;
	message.error = "No existe la habitacion.";
	consulta = Habitacion.findById(id);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function saveHabitacion(req, res){

	var alojamientoId = req.body.id;
	var params = req.body;
	var habitacion = new Habitacion();
	var horaIngresoEgreso = 09;

	//Obtener el nombre para la habitacion
	if(params.denominacion != null){
		habitacion.denominacion = params.denominacion;
		//Este valor puede venir vacio
		habitacion.descripcion = params.descripcion;

		//Obtener el codigo de la habitacion
		if(params.codigo != null){
			habitacion.codigo = params.codigo;

			//Obtener el tipo de cama para la habitacion
			if(params.tipoCama != null){
				habitacion.tipoCama = params.tipoCama;

				//Obtener el precio diario para la habitacion
				if(params.tarifa != null){
					habitacion.tarifa = params.tarifa;

					//Solo hago esto por seguridad, no debería nunca venir vacío
					if(alojamientoId != null){
						habitacion.alojamiento = alojamientoId;
						habitacion.altaHabitacion = new Date();

						//Obtener la hora de ingreso a la habitacion
						if(params.horaIngreso != null){
							habitacion.horaIngreso = params.horaIngreso;
						}else{
							habitacion.horaIngreso = horaIngresoEgreso;
						}

						//Hora de egreso por defecto.
						habitacion.horaSalida = horaIngresoEgreso;

						message.success = "Habitación agregada correctamente.";
						consulta = habitacion.save();
						Controlador.ejecutarSentencia(res, message, consulta);
						consulta = null;

					}else{
						return res
							.status(409)
							.send({message : "Se debe enviar el alojamiento al que pertenece la habitación."});
					}

				}else{
					return res
						.status(409)
						.send({message : "El campo Tarifa no puede estar vacío."});
				}

			}else{
				return res
					.status(409)
					.send({message : "El campo Tipo Cama no puede estar vacío."});
			}

		}else{
			return res
				.status(409)
				.send({message : "El campo Codigo no puede estar vacío."});
		}

	}else{
		return res
			.status(409)
			.send({message : "El campo Denominacion no puede estar vacío."});
	}

}

function updateHabitacion(req, res){

	var id = req.params.id;
	var params = req.body;
	message.error = "No se encontró la habitación.";
	message.success = "Habitación actualizada correctamente.";
	consulta = Habitacion.findByIdAndUpdate(id, params);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function bajaHabitacion(req, res){

	var id = req.params.id;
	message.error = "No se pudo darle de baja a la habitación.";
	message.success = "Habitación dada de baja correctamente.";
	consulta = Habitacion.findByIdAndUpdate(id, { bajaHabitacion : new Date() });
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function altaHabitacion(req, res){

	var id = req.params.id;
	message.error = "No se pudo darle de alta a la habitación.";
	message.success = "Habitación dada de alta correctamente.";
	consulta = Habitacion.findByIdAndUpdate(id, {bajaHabitacion : null});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getHabitacionesActive(req, res){

	message.error = "No hay habitaciones activas.";
	consulta = Habitacion.find({}).where('bajaHabitacion', null);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getHabitacionActive(req, res){

	var id = req.params.id;
	message.error = "Esta habitacion no está disponible.";
	consulta = Habitacion.findById(id).where('bajaHabitacion', null);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function addCaracteristicas(req, res){

		habitacionId = req.body.id;
		caracteristicas = req.body.caracteristicas;

		message.error = "No se pudieron agregar las caracteristicas seleccionadas.";
		message.success = "Caracteristicas agregadas correctamente.";
		consulta = Habitacion.findByIdAndUpdate(habitacionId,{ $addToSet: { caracteristicas : {$each : caracteristicas }}} );
		Controlador.ejecutarSentencia(res, message, consulta);
		consulta = null;

}

module.exports = {
	getHabitacion,
	getHabitaciones,
	saveHabitacion,
	updateHabitacion,
	bajaHabitacion,
	altaHabitacion,
	getHabitacionesActive,
	getHabitacionActive,
	addCaracteristicas
}
