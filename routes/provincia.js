'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var provinciaController = require('../controllers/provincia');

var service = require('../service');
var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;

//Llamamos al router.
var api = express.Router();

//========================== VISITANTES DE LA PAGINA ==========================
api.get('/provincias/:id', provinciaController.getProvinciasXPais);
api.get('/provincia/:id', autenticacion ,provinciaController.getProvincia);
//========================== USUARIOS ADMINISTRADORES ==========================
api.get('/get', autenticacion, esAdmin, provinciaController.getAllProvincias);

//Exportamos el router.
module.exports = api;
