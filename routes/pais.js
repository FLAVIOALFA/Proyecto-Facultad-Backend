'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var paisController = require('../controllers/pais');
//Traemos los servicios

var service = require('../service');
var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;

//Llamamos al router.
var api = express.Router();

//========================== VISITANTES DE LA PAGINA ==========================
api.get('/paises', paisController.getPaises);

//========================== USUARIOS ADMINISTRADORES ==========================
api.get('/actualizar-paises/:id',autenticacion, esAdmin, paisController.updatePaises);

//Exportamos el router.
module.exports = api;
