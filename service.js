'use strict'

var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('./config.js');
var Usuario = require('./models/usuario');
var regex = require('xregexp');
var Role = require('./models/role');
function createToken(user){
	var payload = {
		sub : user._id,
		iat	: moment().unix(),
		exp : moment().add(14, "days").unix()
	};

	return jwt.sign(payload, config.TOKEN_SECRET);
}

function ensureAuthenticated (req, res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(token){
		jwt.verify(token, config.TOKEN_SECRET, (err, decoded) => {
			if(err){
				return res
					.status(500)
					.send({message: "Error de autenticacion", err: err})
			}else{

				if(decoded.exp <= moment().unix()){
					return res
						.status(401)
						.send({message: "El token ha expirado"});
				}else{
					req.decoded = decoded;
	        		next();
	        	}
			}
		});
	}else{
		return res
			.status(403)
			.send({
		        message: 'Token no enviado.'
		    });
	}

}

function checkAdmin(req, res, next){
	var userId = req.decoded.sub;

	Usuario.findById(userId).exec((err, user) => {
		if(err){
			return res
				.status(500)
				.send({message: "Error interno."});
		}else{
			if(!user){
				return res
					.status(404)
					.send({message: "El usuario no existe."});
			}else{

				Role.findOne({tipo : "admin"}, (err, role) => {
					if(err){
						return res
								.status(500)
								.send({message: "Error en el servidor.", err: err});
					}else{
						if(String(user.role) === String(role._id)){
							next();
						}else{
							return res
								.status(409)
								.send({message: "No tienes permisos de administrador."});
						}
					}
				});
			}
		}
	});
}

function Alojador(req, res, next){
	var userId = req.decoded.sub;

	Usuario.findById(userId).exec((err, user) => {
		if(err){
			return res
				.status(500)
				.send({message: "Error interno."});
		}else{
			if(!user){
				return res
					.status(404)
					.send({message: "El usuario no existe."});
			}else{

				Role.findOne({tipo : "alojador"}, (err, role) => {
					if(err){
							return res
									.status(500)
									.send({message: "Error en el servidor.", err: err});
					}else{
						if(String(user.role) === String(role._id)){
							next();
						}else{
							return res
								.status(409)
								.send({message: "No tienes permisos de alojador."});
						}
					}
				})

			}
		}
	});
}

function isNumber(number){
	var regExpresion = regex(/^\d+$/);
	var numero = parseInt(number);
	var numb = regExpresion.test(numero);

	return numb;

}

function stringWN(string){

	var regExpresion = regex(/^[a-zA-Z_áéíóúñ\s]*$/);
	var str = regExpresion.test(string);

	return str;
}

function fechaSinHora(fecha){
	var parseo = fecha.setHours(0,0,0,0);
	var fechaLista = new Date(parseo);

	return fechaLista;

}

module.exports = {
	createToken,
	ensureAuthenticated,
	checkAdmin,
	Alojador,
	isNumber,
	stringWN,
	fechaSinHora
}
