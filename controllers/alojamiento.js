'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Alojamiento = require('../models/alojamiento');
var Reservas = require('../models/cupoHabitacion');
var fs = require('fs');
var Mensaje = require('../models/mensaje');
var Controlador = require('./controladorSentencias');

var message = new Mensaje();
var consulta;

function getAlojamiento(req, res){

	message.error = "No se encontro el alojamiento.";
	var idAlojamiento = req.params.id;
	consulta = Alojamiento.findById({_id : idAlojamiento});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getAlojamientos(req, res){
		message.error = "No se encontraron alojamientos";
 		consulta = Alojamiento.find({}).populate('domicilio');
		Controlador.ejecutarSentencia(res, message, consulta);
		consulta = null;
}


function saveAlojamiento(req, res){
	message.error = "No se agrego el alojamiento.";
	message.success = "Alojamiento agregado correctamente.";
//Obtenemos los datos enviados
	var params = req.body;

	if(params.denominacion != null){
			if(params.descripcion != null){
					//Creamos el objeto alojamiento
					var alojamiento = new Alojamiento();

					//Seteamos los valores recibidos y rellenamos otros.
					alojamiento.denominacion = params.denominacion;
					alojamiento.descripcion = params.descripcion;
					alojamiento.altaAlojamiento = new Date();

					consulta = alojamiento.save();
					Controlador.ejecutarSentencia(res, message, consulta);
					consulta = null;

			}else{
				return res
					.status(404).send({message: "El campo descripción es obligatorio."});
			}

	}else{
		return res
			.status(404).send({message: "El campo denominacion es obligatorio."});
	}

}

function addClasificacion(req, res){

	var id = req.params.id;
	var clasificacion = req.body.clasificacion;

	if(clasificacion != null){
		if(Array.isArray(clasificacion)){
				message.error = "No se pudieron insertar las clasificaciones.";
				message.success = "Clasificaciones agregadas con éxito."
				//Si es una lista de clasificaciones..
				consulta = Alojamiento.findByIdAndUpdate(id, {$push : { "clasificacion" : {$each: clasificacion}}}, {new: true});
				Controlador.ejecutarSentencia(req, res, consulta);

		}else{
			message.error = "No se pudo insertar la clasificacion.";
			message.success = "Clasificacion agregada con éxito."
			//Si se agrega solamente una clasificacion
			consulta = Alojamiento.findByIdAndUpdate(id, {$push : { "clasificacion" : clasificacion }});
			Controlador.ejecutarSentencia(req, res, consulta);
			consulta = null;

		}

	}else{
		return res
			.status(409)
			.send({message: "El campo no puede estar vacío."})
	}

}

function bajaAlojamiento(req, res){

	var id = req.params.id;
	message.error = "No se ha podido dar de baja al alojamiento.";
	message.success = "Alojamiento dado de baja correctamente.";
	consulta = Alojamiento.findByIdAndUpdate(id, {bajaAlojamiento : new Date()});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function altaAlojamiento(req, res){

	var id = req.params.id;
	message.error = "No se ha podido dar de alta al alojamiento.";
	message.success = "Alojamiento dado de alta correctamente.";
	consulta = Alojamiento.findByIdAndUpdate(id, {bajaAlojamiento : null});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getAlojamientosActive(req, res){
	var consulta = "";
	message.error = "No hay alojamientos activos.";
	consulta = Alojamiento.find({});
	Controlador.ejecutarSentencia(req, res, consulta);
	consulta = null;

}


//Esta funcion traerá los alojamientos con habitaciones disponibles en un rango
function alojamientosDisponibles(req, res){

	var fechaOcupacion = req.body.fechaOcupacion;
	var fechaDesocupacion = req.body.fechaDesocupacion;
	var destino = req.body.destino;
	var habitacionesArray = [];
	var arrayAlojamientos = [];
	var reservasArray = [];
	var alojamientosMostrar = new Array();

	var cursor = Alojamiento.find({}).populate({
			path: 'domicilio',
			match: {provincia: { $in : [destino] }}
	}).cursor();

	try {

		cursor.on('data', ( data ) => {
			//Guardamos el alojamiento encontrado.
			arrayAlojamientos.push(data);
			//Si no encuentra el alojamiento, devolvería un null a la respuesta.
			if( data.domicilio == null ){
				//Si el elemento en el que estamos, tiene el domilio null
				//Eliminamos el elemento guardado anteriormente.
				arrayAlojamientos.pop();
			}else{
				//Por cada habitacion en el array
				for (var habitacion of data.habitaciones) {
						habitacionesArray.push(habitacion);
				}
			}

		});

	} catch (e) {
			return res.send({message : "Ocurrio un problema en el servidor. Err: " + e})
	}

	try {

		//Obtenemos la lista de las reservas para la fecha indicada
		cursor.on('end', () => {
			var cursorReservas = Reservas.find({ $and : [{noDisponible : { $in : [ fechaOcupacion ] }},
				{habitacion : habitacionesArray}] }).cursor();

				//Obtenemos las reservas que correspondan con la fecha indicada y la habitacion.
				cursorReservas.on('data', ( data ) => {
						//Agregamos la habitacion
						reservasArray.push(data.habitacion);
				});

				cursorReservas.on('end', () => {
						var disponibles = 0;
						var matched;

						//Buscar como eliminar y contar las habitaciones que tendríamos para mostrar.
						//Lista de alojamientos encontrados.
						for (var alojamiento of arrayAlojamientos) {
								//Lista de las habitaciones que pertenecen al alojamiento
								for (var habitacion of alojamiento.habitaciones) {
									//Lista de habitaciones que estan reservadas en la fecha indicada
									//Y que pertenecen a los alojamientos.
									for (var idReserva of reservasArray) {
											//Si la reserva coincide con la habitacion del alojamiento..
											if( String(habitacion) === String(idReserva) ){
												//Vamos eliminando el elemento del array
												//Para buscar menos en la proxima vuelta.
												// idReserva.pop();
												var element = reservasArray.indexOf(idReserva)
												reservasArray.splice(element,1);

												//Seleccionamos el elemento que vamos a borrar del array.
												matched = habitacion.indexOf(habitacion);
												//Eliminamos el elemento seleccionado.
												alojamiento.habitaciones.splice(matched, 1);
												//Salimos del for.
												break;
											}
									}
								}
								disponibles = alojamiento.habitaciones.length;
								if(disponibles > 0){
						      alojamiento.habitacionesDisp = disponibles;
						      alojamientosMostrar.push(alojamiento);
						    }
						}

						

				});

			});

	} catch (e) {
			return res.send({message : "Ocurrio un problema en el servidor. Err: " + e})
	}
}

module.exports = {
	getAlojamiento,
	getAlojamientos,
	addClasificacion,
	saveAlojamiento,
	bajaAlojamiento,
	altaAlojamiento,
	getAlojamientosActive,
	alojamientosDisponibles
}
