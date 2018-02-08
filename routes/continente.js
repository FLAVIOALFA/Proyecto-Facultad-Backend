'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var continenteController = require('../controllers/continente');

//Llamamos al router.
var api = express.Router();

api.put('/continente', continenteController.updateContinente);

api.get('/continentes', continenteController.getContinentes);

//Exportamos el router.
module.exports = api;
