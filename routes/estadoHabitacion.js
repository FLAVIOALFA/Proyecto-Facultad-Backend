'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var estadoHabController = require('../controllers/estadoHabitacion');

var service = require('../service');
var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;

//Llamamos al router.
var api = express.Router();

//Para acceder a cualquier ruta de Domicilio
//El usuario alojador deberá estar registrado

//========================== VISITANTES DE LA PAGINA ==========================E
api.get('/estados', estadoHabController.getEstados);

//========================== USUARIOS ADMINISTRADORES ==========================
api.post('/estado', autenticacion, esAdmin, estadoHabController.saveEstado);

//Exportamos el router.
module.exports = api;
