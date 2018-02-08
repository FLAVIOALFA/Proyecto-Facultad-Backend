'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var RoleSchema = Schema({
	 tipo: String 
});

//Esto nos creará una coleccion de objetos dentro de Usuario
module.exports = mongoose.model('Role', RoleSchema);
