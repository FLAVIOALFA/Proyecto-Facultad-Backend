'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var habitacionController = require('../controllers/habitacion');

var service = require('../service');
var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;
var esAlojador = service.Alojador;
//Llamamos al router.
var api = express.Router();

// ========================== VISITANTES DE LA PAGINA ==========================
api.get('/habitacion-activa', habitacionController.getHabitacionActive);
api.get('/habitaciones-activas', habitacionController.getHabitacionesActive);

//========================== USUARIOS ALOJADORES ==========================
//Metodos solo para Usuarios que sean Alojamientos.
api.post('/habitacion', autenticacion, esAlojador, habitacionController.saveHabitacion);
api.put('/habitacion/:id', autenticacion, esAlojador, habitacionController.updateHabitacion);
api.put('/baja-habitacion/:id', autenticacion, esAlojador, habitacionController.bajaHabitacion);
api.put('/alta-habitacion/:id', autenticacion, esAlojador, habitacionController.altaHabitacion);
api.put('/add-caracteristicas', autenticacion, esAlojador, habitacionController.addCaracteristicas);
//Estas rutas estan para que el alojamiento dueño de las habitaciones tenga acceso a ver
//Todas las habitaciones que estan cargadas, esten o no dadas de alta.
api.get('/habitaciones-alojamiento', autenticacion, esAlojador, habitacionController.getHabitaciones);
api.get('/habitacion-alojamiento/:id', autenticacion, esAlojador, habitacionController.getHabitacion);

//Exportamos el router.
module.exports = api;
