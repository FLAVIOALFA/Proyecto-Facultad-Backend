'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var caracteristicasHabitacionController = require('../controllers/caracteristicasHabitacion');

//Llamamos al router.
var api = express.Router();


//Exportamos el router.
module.exports = api;
