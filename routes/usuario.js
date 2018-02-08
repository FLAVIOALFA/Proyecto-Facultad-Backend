'use strict'

//Importamos express
var express = require('express');
//Importamos el controlador del objeto
var usuarioController = require('../controllers/usuario');

var service = require('../service');
var autenticacion = service.ensureAuthenticated;
var esAdmin = service.checkAdmin;

//Llamamos al router.
var api = express.Router();

//Ruta de prueba para metodos
api.get('/prueba', usuarioController.prueba);

//========================== VISITANTES DE LA PAGINA ==========================
api.post('/usuario', usuarioController.saveUser);
api.post('/login', usuarioController.login);

//========================== USUARIOS LOGUEADOS ==========================
api.get('/usuario/:id', usuarioController.getUser);
api.put('/usuario/:id', autenticacion, usuarioController.updateUser);
api.put('/changePass/:id', autenticacion, usuarioController.changePass);

//========================== USUARIOS ADMINISTRADORES ==========================
api.get('/usuarios', autenticacion, esAdmin, usuarioController.getUsers);
api.put('/update-role', autenticacion, esAdmin, usuarioController.updateRole);
api.get('/usuarios-active', autenticacion, esAdmin, usuarioController.getUsersActive);
api.get('/usuarios-no-active', autenticacion, esAdmin, usuarioController.getUsersNoActive);
api.put('/usuario-baja/:id', autenticacion, esAdmin, usuarioController.bajaUser);

//Exportamos el router.
module.exports = api;
