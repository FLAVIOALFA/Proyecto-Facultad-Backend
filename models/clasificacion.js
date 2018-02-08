'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var ClasificacionSchema = Schema({
	denominacion: String,
	fechaAlta: Date,
	fechaBaja: Date,
	clasificacion: {
		type: Schema.Types.ObjectId, 
		ref: 'Clasificacion'
	}

});

//Esto nos creará una coleccion de objetos dentro de Album
module.exports = mongoose.model('Clasificacion', ClasificacionSchema);
