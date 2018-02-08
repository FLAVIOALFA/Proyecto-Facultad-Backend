'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var caracteristicasController = require('../controllers/caracteristicas');

//Llamamos al router.
var api = express.Router();


//Exportamos el router.
module.exports = api;
