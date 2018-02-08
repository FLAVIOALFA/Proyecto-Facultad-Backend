'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var alojamientoController = require('../controllers/alojamiento');
var service = require('../service');

var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;

//Llamamos al router.
var api = express.Router();

//Estas consultas son publicas
api.get('/alojamiento/:id', alojamientoController.getAlojamiento);
//Obtener alojamientos activos para los usuarios, son los que se van a mostrar.
api.get('/alojamientosActivos', alojamientoController.getAlojamientosActive);

//Para estas acciones se necesita ser administrador
//Obtener todos los alojamientos, incluso los no activos
api.get('/alojamientos', autenticacion, esAdmin, alojamientoController.getAlojamientos);
//Para agregar un alojamiento
api.post('/alojamiento', autenticacion, alojamientoController.saveAlojamiento);
//Agregar una clasificacion
api.put('/addClasAloj/:id', autenticacion, esAdmin, alojamientoController.addClasificacion);
//Dar de baja a un alojamientol
api.post('/bajaAlojamiento/:id', autenticacion, esAdmin, alojamientoController.bajaAlojamiento);
//Dar de alta a un alojamientol
api.post('/bajaAlojamiento/:id', autenticacion, esAdmin, alojamientoController.altaAlojamiento);

//Exportamos el router.
module.exports = api;
