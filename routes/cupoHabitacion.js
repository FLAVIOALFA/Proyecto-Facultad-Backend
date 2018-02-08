'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var cupoHabitacionController = require('../controllers/cupoHabitacion');

var service = require('../service');
var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;

//Llamamos al router.
var api = express.Router();
var service = require('../service');

//Para realizar una reserva se tiene que estar logueado
api.post('/reservar-habitacion', autenticacion, cupoHabitacionController.reservarHabitacion);
api.post('/cupos', autenticacion, cupoHabitacionController.getReservas);
api.get('/obtenerReservas', cupoHabitacionController.obtenerReservas);
//Exportamos el router.
module.exports = api;
