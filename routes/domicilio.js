'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var domicilioController = require('../controllers/domicilio');

var service = require('../service');
var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;

//Llamamos al router.
var api = express.Router();

//Para acceder a cualquier ruta de Domicilio
api.get('/todos', domicilioController.getAllAddress);
//El usuario deberá estar registrado
api.post('/domicilio/:id', autenticacion, domicilioController.saveAddress);
api.get('/domicilio/:id', autenticacion, domicilioController.getAddress);
api.put('/address/:id', autenticacion, domicilioController.updateDomicilio);

//Exportamos el router.
module.exports = api;
