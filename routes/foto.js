'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var fotoController = require('../controllers/foto');

//Llamamos al router.
var api = express.Router();


//Exportamos el router.
module.exports = api;
