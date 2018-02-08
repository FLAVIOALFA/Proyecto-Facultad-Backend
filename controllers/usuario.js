'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Usuario = require('../models/usuario');
var Role = require('../models/role');
var fs = require('fs');
var crypto = require('crypto');
var service = require('../service');
var dateFormat = require('dateformat');
var moment = require('moment');

var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

//Obtener un usuario especifico
function getUser(req, res){
	var userId = req.params.id;
	message.error = "El usuario no existe.";

	consulta = Usuario.findById(userId).populate('domicilio').populate('role');
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;
}

//Obtener los usuarios del sistema
function getUsers(req, res){

	var consulta = Usuario.find({});
	message.error = "No hay usuarios agregados.";
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

//Crear un usuario nuevo
function saveUser(req, res){

	let params = req.body;

	Usuario.findOne({email: params.email}, (err, user) => {

		let usuario = new Usuario();

		//Validamos que el usuario no exista para crearlo.
		if(!user){
			//var email = validaEmail(params.email);
				usuario.email = params.email;

				if(params.pass01 === params.pass02){
					var pass = params.pass01;

					if(pass.length > 7){
						usuario.password = encrypt(pass);
						//Role por defecto para cualquier usuario al crearlo. Role: Usuario
						//usuario.role = "59892089179d6925706eb069";
						usuario.fecha_alta = new Date();

						//Validamos si los datos son enviados sino, no se almacenaran.
						if(service.stringWN(params.nombre) && params.nombre !== null)
							usuario.nombre = params.nombre;
						if(service.stringWN(params.apellido) && params.apellido !== null)
							usuario.apellido = params.apellido;
						if(params.fecha_nacimiento !== null)
							usuario.fecha_nacimiento = params.fecha_nacimiento;

						message.success = "Usuario " + params.email + " creado correctamente.";
						consulta = usuario.save();
						Controlador.ejecutarSentencia(res, message, consulta);
						consulta = null;

					}else{
						return res
							.status(409)
							.send({message: "La contraseña debe tener mas de 8 caracteres"});
					}

				}else{
					return res
						.status(409)
						.send({message: "Las contraseñas no coinciden!"});
				}

		}else{
			return res
				.status(409)
				.send({message: "El correo ya ha sido utilizado!"})
		}

	})

}

//Actualizar un usuario
function updateUser(req, res){
	var userId = req.params.id;
	var params = req.body;
	message.error = "El usuario no existe.";

	consulta = Usuario.findByIdAndUpdate(userId, params)
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

function updateRole(req, res){
	var userId = req.body.id;
	var role = req.body.role;
	message.error = "El usuario no existe.";
	message.success = "Se actualizo el role del usuario.";

	consulta = Usuario.findByIdAndUpdate(userId, {role: role});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;
}

//Dar de baja un usuario
function bajaUser(req, res){
	var userId = req.params.id;
	var fechaBaja = new Date();
	message.error = "No se pudo dar de baja al usuario.";
	message.success = "Usuario dado de baja correctamente.";

	consulta = Usuario.findByIdAndUpdate(userId, {fecha_baja : fechaBaja});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;
}

//Obtener los usuarios activos
function getUsersActive(req, res){

	consulta = Usuario.find({}).where('fecha_baja', null);
	message.error = "No hay usuarios activos.";
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

//Obtener los usuarios dados de baja en el sistema
function getUsersNoActive(req, res){

	message.error = "No hay usuarios.";
	consulta = Usuario.find({}).where('fecha_baja').exists();
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;

}

//Funcion de loguearse
function login(req, res){

	Usuario.findOne({email: req.body.email.toLowerCase()},(err, usuario) => {
						if(err){
							return res
								.status(500)
								.send({message: "Error en el servidor", err: err});
						}else{
							if(!usuario){
								return res
									.status(404)
									.send({message: "La combinacion de usuario y contraseña no coinciden con nuestros usuarios registrados."});
							}else{
								var pass = encrypt(req.body.password);
								if(pass === usuario.password){
									//Aca respondemos devolviendo el token.
									return res
										.status(200)
										.send({token: service.createToken(usuario), identity : usuario});
								}else{
									return res
										.status(404)
										.send({message: "La contraseña es incorrecta"})
								}
							}
						}
					}).populate('domicilio')

}

function changePass(req, res){

    var userId = req.body.id;
    var pass = req.body.password;

    message.error = "El usuario no existe.";
    message.success = "Contraseña cambiada correctamente. Vuelva a iniciar sesión.";

    consulta = Usuario.findByIdAndUpdate(userId, {password: pass});
    Controlador.ejecutarSentencia(res, message, consulta);
    consulta = null;

}


//Funcion para encriptar una contraseña
function encrypt(pass){

	var passwordEncrypt = "eNaM2sa8fjy01dd";
	var algorithmEncrypt = 'sha256';

    var cipher = crypto.createHmac(algorithmEncrypt, passwordEncrypt);
    var crypted = cipher.update(pass);
    crypted = crypted.digest('hex');
    return crypted;

}

//Funcion para validar un email
function validaEmail(email){

	var validator = require('email-validator');
	var validado = validator.validate(email);

	return validado;
}

//Funcion para pruebas
function prueba(req, res){
		var Alojamiento = require('../models/alojamiento');
		var idProvincia = 814;
		var Reservas = require('../models/cupoHabitacion');
		var arr = new Array();
		var cur = Alojamiento.find({}).cursor();

		try {
			var contador = 0;
			cur.on('data', ( data ) => {
					// if( '59c6ade2c658912ff8404a69' === String(data._id)){
					// 		console.log("Si lo encontro.")
					// 		// var i = arr.indexOf(arr[contador]._id);
					// 		// arr.splice(i, 1);
					//
					// }

					arr.push(data);

					contador ++;
					console.log("type " + typeof data)

			})

			cur.on('end', () => {

					for (let data of arr) {
						if('59c6adebc658912ff8404a6a' === String(data._id)){
							console.log("Si lo elimino");
							//ARREGLAR ESTA PARTE!!

						}
					}

					res.send({datos : arr})

			})

		} catch (e) {
			console.log("Entro al catch")
			res.send({message: "Error: " + e})
		} finally {

		}

}

function addAtr(doc, docs){

		doc["nuevoAtr"] = "nuevo";
		docs = doc;
		return docs;

}

//Exportamos los metodos
module.exports = {
	getUser, getUsers, saveUser,updateUser,
	updateRole,	bajaUser, getUsersActive,
	getUsersNoActive,login, changePass,
	prueba
}
