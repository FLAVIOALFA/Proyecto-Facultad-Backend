'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var CupoHabitacionSchema = Schema({
	fechaOcupacion: String,
	fechaDesocupacion: String,
	diaReserva: String,
	noDisponible: [{
		type: String
	}],
	estado: {
		type: String,
		enum: ['Ocupada','No Disponible', 'Promocion']
	},
	habitacion: {
		type: Schema.Types.ObjectId,
		ref: 'Habitacion'
	},
	usuario : {
		type: Schema.Types.ObjectId,
		ref: 'Usuario'
	}
});

//Esto nos creará una coleccion de objetos dentro de Album
module.exports = mongoose.model('CupoHabitacion', CupoHabitacionSchema);
