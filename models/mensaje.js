'use strict'

var mongoose = require('mongoose');
//Importamos el schema de mongoose
var Schema = mongoose.Schema;

var MensajeSchema = Schema({
	success: String,
	error: String
});

//Exportar la clase para los mensajes
module.exports = mongoose.model('Mensaje', MensajeSchema);
