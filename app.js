'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Configuramos las cabeceras
var cors = require('cors');
var corsOptions = {
	origin : '*',
	methods : 'POST,GET,PUT,DELETE,OPTIONS',
	allowedHeaders: 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-access-token'
};
app.use(cors(corsOptions));

// carga de rutas

var usuario_routes = require('./routes/usuario');
var domicilio_routes = require('./routes/domicilio');
var alojamiento_routes = require('./routes/alojamiento');
var habitacion_routes = require('./routes/habitacion');
var pais_routes = require('./routes/pais');
var continente_routes = require('./routes/continente');
var provincia_routes = require('./routes/provincia');
var role_routes = require('./routes/role');
var clasificacion_routes = require('./routes/clasificacion');
var estadoHabitacion_routes = require('./routes/estadoHabitacion');
var reservas_routes = require('./routes/cupoHabitacion');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configuracion de las cabeceras

//Rutas base
app.use('/api', usuario_routes);
app.use('/api', domicilio_routes);
app.use('/api', habitacion_routes);
app.use('/api', alojamiento_routes);
app.use('/api', continente_routes);
app.use('/api', pais_routes);
app.use('/api', provincia_routes);
app.use('/api', role_routes);
app.use('/api', clasificacion_routes);
app.use('/api', reservas_routes);
app.use('/api', estadoHabitacion_routes);

module.exports = app;
