var mongoose = require('mongoose');
'use strict'
//Importamos el schema de mongoose
var Schema = mongoose.Schema;
var AlojamientoSchema = Schema({
	denominacion: String,
	destacada: { type: Boolean, default: false},
	descripcion: String,
	bajaAlojamiento : Date,
	altaAlojamiento : Date,
	domicilio: {
		type: Schema.Types.ObjectId,
		ref: 'Domicilio'
	},
	clasificacion: [{
			type: Schema.Types.ObjectId,
			ref: 'Clasificacion'
	}],
	fotos : [{
			type: Schema.Types.ObjectId,
			ref : 'Foto'
		}],
	habitaciones:[{
			type: Schema.Types.ObjectId,
			ref: 'Habitacion'
	}],
	habitacionesDisp : Number
});
module.exports = mongoose.model('Alojamiento', AlojamientoSchema);
