'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var Role = require('../models/role');

var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

//Obtener roles
function getRoles(req, res){

	message.error = "No se encontraron roles.";
	consulta = Role.find({});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function getRole(req, res){

	var id = req.params.id;
	message.error = "No existe el id del role";
	consulta = Role.findById(id);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function saveRole(req, res) {

	var params = req.body;
	if(params.tipo != null){

		Role.findOne({tipo: params.tipo}, (err, role) => {
			if(err){
				return res
						.status(500)
						.send({message: "Error en el servidor.", err: err});
			}else{
				if(!role){
					var role = new Role();
					role.tipo = params.tipo;

					message.success = "Se agrego el rol " + params.tipo + " correctamente.";
					consulta = role.save();
					Controlador.ejecutarSentencia(res, message, consulta);
					consulta = null;
				}else{
					return res
							.status(400)
							.send({message: "El rol enviado ya existe en la base de datos."});
				}
			}
		});

	}else{
		return res
			.status(409)
			.send({message: "No se envió el nombre de la caracteristica"});
	}
}

function updateRole(req, res){

	var id = req.params.id;
	var params = req.body;
	message.error = "No existe el rol que se intenta actualizar.";
	message.success = "Rol actualizado correctamente";
	consulta = Role.findByIdAndUpdate(id, params);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function deleteRole(req, res){

	var roleId = req.params.id;
	message.error = "No se ha borrado el rol seleccionado.";
	consulta = Role.findByIdAndRemove(roleId);
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

module.exports = {
	getRole,
	getRoles,
	saveRole,
	updateRole,
  deleteRole
}
