'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Domicilio = require('../models/domicilio');
var Usuario = require('../models/usuario');
var Alojamiento = require('../models/alojamiento');
var Provincia = require('../models/provincia');
var service = require('../service');
var async = require('async');
//Elementos para el ejecutar sentencia
var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

function getAddress(req, res){
	var id = req.params.id;
	consulta = Domicilio.findById(id);

	message.error = "El domicilio no existe.";

	Controlador.ejecutarSentencia(res, message, consulta);
  consulta = null;

}

function getAllAddress(req, res){
	consulta = Domicilio.find({});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;
}

function saveAddress(req, res){

	var id = req.params.id;
	var params = req.body;
	if(params.provincia !== null){
		if(params.calle !== null && params.barrio !== null){
			var num = service.isNumber(params.numero);
			if(num){
					var domi = new Domicilio();
					//domi.provincia = params.provincia;
					//Solo un campo de los 2 puede venir vacío
					domi.calle = params.calle != null ? params.calle : null;
					domi.barrio = params.barrio != null ? params.barrio : null;
          			domi.provincia = params.provincia;
					//Este campo si viene, verificamos que sea un numero

					domi.numero = params.numero;

					domi.save((err, domiStored) => {
						if(err){
							return res
								.status(500)
								.send({message: "Error en la peticion, intentelo de nuevo.", err: err});
						}else{
             				message.success = "Domicilio guardado con exito!";
							Usuario.findOne({_id: id}, (err, usuario) => {
								if(err){
									return res
										.status(500)
										.send({message: "Error en la peticion!"});
								}else{
									if(!usuario){

									//Si no existe el usuario, quiere decir que se lo debemos agregar al alojamiento
									var consulta = Alojamiento.findByIdAndUpdate(id, { domicilio : domiStored._id });
									Controlador.ejecutarSentencia(res, message, consulta);
									consulta = null;

									}else{

										//Si el usuario existe le agregamos el domicilio
										consulta = Usuario.findByIdAndUpdate(usuario._id, {domicilio : domiStored._id});
										Controlador.ejecutarSentencia(res, message, consulta);
										consulta = null;

									}
								}
							});
						}
					});
				}else{
					return res
						.status(409)
						.send({message: "Debe ingresar valores numéricos."});
				}

		}else{
			return res
				.status(409)
				.send({message: "Debe completar el campo Calle o Barrio!"});
		}

	}else{
		res.status(409).send({message: "El campo Provincia no puede estar vacío!"});
	}

}

function updateDomicilio(req, res){
    var addressId = req.params.id;
    var params = req.body;

		console.log(req.body);

    message.error = "El domicilio no existe.";
    message.success = "Domicilio actualizado correctamente.";

    consulta = Domicilio.findByIdAndUpdate(addressId, params);
    Controlador.ejecutarSentencia(res, message, consulta);
    consulta = null;

}

module.exports = {
	getAddress,
	saveAddress,
	getAllAddress,
	updateDomicilio
}
