'use strict'

var Estado = require('../models/estadoHabitacion');
var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');

var message = new Mensaje();
var consulta;

function getEstados(req, res){

    message.error = "No hay estados de habitaciones.";
    consulta = Estado.find({}).select();
    Controlador.ejecutarSentencia(res, message, consulta);
    consulta = null;

}

function saveEstado(req, res){

    var params = req.body;
    if(params.estado != null){

      var estado = new Estado();
      estado.estado = params.estado;

      consulta = estado.save();
      Controlador.ejecutarSentencia(res, message, consulta);
      consulta = null;

    }else{
      return res
          .status(409)
          .send({message: "El campo Estado no puede estar vacío."});
    }
}

module.exports = {
  getEstados,
  saveEstado
}
