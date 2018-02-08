'use strict'

//Importamos mongoose
var mongoose = require('mongoose');
//Importamos la clase app.js
var app = require('./app');
var port = process.env.PORT || 3700;

//Lo primero que hará la app sera la conexion de MongoDB
//Después de indicar el puerto de Mongo, pasamos la base de datos.
mongoose.connect('mongodb://localhost:27017/app_reservas', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("Base de datos funcionando correctamente!");

		app.listen(port, function(){
			console.log(`Api RESTful de reservas escuchando en http://localhost:${port}`);
		});

	}

});