'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var EstadoHabitacionSchema = Schema({
	estado: String
});

//Esto nos creará una coleccion de objetos dentro de Album
module.exports = mongoose.model('EstadoHabitacion', EstadoHabitacionSchema);
