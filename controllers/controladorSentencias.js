'use strict'
var message = require('../models/mensaje');

function ejecutarSentencia(res, message, consulta){
  var id;
    consulta.then(
      response => {

          if(response != null && response != ""){
            //En caso de que este todo bien..
            return res
              .status(200)
              .send({mensaje: message.success, respuesta : response});

          }else{
            return res
                .status(404)
                .send({mensaje: message.error})
          }

      }, err => {
          if(err != null){
            return res
                .status(500)
                .send({mensaje: "Error en el servidor.", err : err});
          }
      });

}

module.exports = {
	ejecutarSentencia
}
