'use strict'
//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var roleController = require('../controllers/role');
var service = require('../service');
var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;
//Llamamos al router.
var api = express.Router();

//========================== USUARIOS ADMINISTRADORES ==========================
//Metodos accesibles solo para administradores
api.get('/roles', roleController.getRoles);
api.get('/role/:id', autenticacion, esAdmin, roleController.getRole);
api.post('/role', autenticacion, esAdmin, roleController.saveRole);
api.put('/role/:id', autenticacion, esAdmin, roleController.updateRole);
api.delete('/role/:id', autenticacion, esAdmin, roleController.deleteRole);

//Exportamos el router.
module.exports = api;
