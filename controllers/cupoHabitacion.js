'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var CupoHabitacion = require('../models/cupoHabitacion');
var Habitacion = require('../models/habitacion');
var Usuario = require('../models/usuario');
var moment = require('moment');

var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

//Obtener las reservas de X alojamiento.
//En una fecha específica
function getReservas(req,res){

  var Alojamiento = require('../models/alojamiento');
  var habitacion = req.params.id;
  var fecha = req.body.fecha;
  message.error = "No hay reservas realizadas.";
  consulta = CupoHabitacion.find({ noDisponible: { $in : [fecha]}});
  // consulta = CupoHabitacion.find({});
  Controlador.ejecutarSentencia(res, message, consulta);
  consulta = null;

}

function reservarHabitacion(req, res){

  //Obtenemos el objectId del usuario
  var usuario = req.decoded.sub;
  //Obtenemos el objectId de la habitacion
  var habitacion = req.body.habitacion;
  var params = req.body;

  if(params.fechaOcupacion != null){
    if(params.fechaDesocupacion != null){

        //Aca va a venir la fecha como '25/02/2017' / 'DD/MM/YYYY'
        //Lo convertimos a '02/25/2017' / 'MM/DD/YYYY'
        var fOcupacionParsear = parsearFechas(params.fechaOcupacion);
        var fDesocupacionParsear = parsearFechas(params.fechaDesocupacion);

        CupoHabitacion.findOne({habitacion : habitacion})
                      .where("noDisponible", fOcupacionParsear)
                      .exec( (err, reserva) => {
             if(err){
               return res
                    .status(500)
                    .send({message: "Error en el servidor.", err:err});
             }else{
               if(reserva){
                  //Si encuentra una reserva..
                  return res
                      .status(409)
                      .send({message: "Ya existe una reserva para ésta fecha.", reserva : reserva});
               }else{
                 //Si no hay reservas, podemos guardar los datos.
                 var cupoHabitacion = new CupoHabitacion();

                 //Dia en el que se realiza la reserva
                 cupoHabitacion.diaReserva = moment().format();

                 //Habitacion a reservar
                 cupoHabitacion.habitacion = habitacion;

                 //Usuario que reserva
                 cupoHabitacion.usuario = usuario;

                 //Cambiamos el estado de la habitacion
                 cupoHabitacion.estado = "Ocupada";

                 //Fecha de ocupacion de la habitacion
                 cupoHabitacion.fechaOcupacion = fOcupacionParsear;

                 //Fecha de desocupacion de la habitacion
                 cupoHabitacion.fechaDesocupacion = fDesocupacionParsear;

                 //Tenemos que obtener la cantidad de dias de la reserva
                 var diasReserva = new Array();

                 var fecha1 = moment(fOcupacionParsear, 'MM/DD/YYYY');
                 var fecha2 = moment(fDesocupacionParsear, 'MM/DD/YYYY');
                 //Obtenemos la cantidad de dias
                 var diferencia = fecha2.diff(fecha1, 'days');

                 //Llenamos el array de los dias de las reservas
                 for(var i = 0; i < diferencia; i++){
                      diasReserva[i] = moment(fecha1).add(i, 'days').format('L');
                 }
                 //Si queda en 0, quiere decir que se intenta reservar por el dia
                 //Lo cual no será posible
                 if(diferencia == 0){
                   return res
                        .status(409)
                        .send({message: "No es posible reservar una habitación por el día."});
                 }

                 cupoHabitacion.save( ( err, reservaDone ) => {
                   if(err){
                     return res
                        .status(500)
                        .send({message: "Error en el servidor.", err:err});
                   }else{
                     //Id de la reserva realizada
                     var idReserva = reservaDone._id;

                     message.success = "Reserva realizada con exito.";
                     message.error = "No se ha podido reservar la habitación.";
                     consulta = CupoHabitacion.findByIdAndUpdate(idReserva, { $addToSet: { noDisponible : { $each: diasReserva }}} );
                     Controlador.ejecutarSentencia(res, message, consulta);
                     consulta = null;

                   }
                 });


               }
             }
        });

    }else{
      return res
        .status(409)
        .send({message: "No se ha seleccionado ninguna fecha de desocupación"})
    }
  }else{
    return res
      .status(409)
      .send({message: "No se ha seleccionado ninguna fecha de ocupación"})
  }

}

function parsearFechas(fecha){

    var conver = fecha.split('/');
    var fechaConvertida = [conver[1], conver[0], conver[2]].join('/');
    var fechaDate = moment(fechaConvertida).format('L');
    return fechaDate;

}

function obtenerReservas(req, res){
  message.error = "No hay reservas realizadas.";
  consulta = CupoHabitacion.find({});
  // consulta = CupoHabitacion.find({});
  Controlador.ejecutarSentencia(res, message, consulta);
  consulta = null;
}


module.exports = {
  getReservas,
  reservarHabitacion,
  obtenerReservas
}
