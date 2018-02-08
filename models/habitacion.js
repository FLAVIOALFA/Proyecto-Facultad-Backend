'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var HabitacionSchema = Schema({
	denominacion: String,
	descripcion: String,
	codigo: String,
	tipoCama: String,
	horaIngreso: {type : Number},
	horaSalida: {type : Number},
	tarifa: Number,
	bajaHabitacion : Date,
	altaHabitacion : Date,
	cantidadOcupantes: Number,
	caracteristicas: [{
		type: Schema.Types.ObjectId,
		ref: 'Caracteristicas'
	}]

});

//Esto nos creará una coleccion de objetos dentro de Album
module.exports = mongoose.model('Habitacion', HabitacionSchema);
