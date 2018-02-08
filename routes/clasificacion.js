'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var clasificacionController = require('../controllers/clasificacion');
var service = require('../service');
//Llamamos al router.
var api = express.Router();

//Para hacer cualquier solicitud hay que estar logueado.
//api.use(service.ensureAuthenticated);

//Obtener las clasificaciones
api.get('/clasificaciones', service.ensureAuthenticated, clasificacionController.getClasificaciones);
//Obtener una clasificacion
api.get('/clasificacion/:id', service.ensureAuthenticated, clasificacionController.getClasificacion);
//Obtener las subclasificaciones de una clasificacion
api.get('/subclasificaciones/:id', service.ensureAuthenticated, clasificacionController.getSubClasificaciones);
/*
============================ ADMINISTRADOR ============================
*/
//api.use(service.checkAdmin);

//Agregar una clasificacion o una subclasificacion
api.post('/clasificacion/:id?', service.ensureAuthenticated, service.checkAdmin, clasificacionController.saveClasificacion);
//Actualizar una clasificacion o subclasificacion
api.put('/actualizar-clasificacion/:id', service.checkAdmin, clasificacionController.updateClasificacion);


//Exportamos el router.
module.exports = api;
