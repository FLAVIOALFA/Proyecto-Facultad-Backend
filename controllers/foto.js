'use strict'

//Esto nos permite sacar las rutas donde se guardan las imagenes
var path = require('path');
var Foto = require('../models/foto');
var Alojamiento = require('../models/alojamiento');

var Controlador = require('./controladorSentencias');
var Mensaje = require('../models/mensaje');
var message = new Mensaje();
var consulta;

function addImage(req, res){
	var id = req.params.id;
	var foto = req.body.foto;
	message.error = "No se agrego ninguna imagen al alojamiento.";
	message.success = "Imagen agrega correctamente";

	consulta = Alojamiento.findByIdAndUpdate(id, {$push : {"fotos" : foto }});
	Controlador.ejecutarSentencia(res, message, consulta);
	consulta = null;
	
}

function uploadImage(req, res){
	var imageId = req.params.id;

	var file_name = "No subido..";

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[1];

		Image.findByIdAndUpdate(imageId, {picture: file_name}, (err, imageUpdated) => {
			if(err){
				res.status(500).send({message: "Error en la peticion"});
			}else{
				if(!imageUpdated){
					res.status(404).send({message: "No se ha actualizado la imagen"});
				}else{
					res.status(200).send({image: imageUpdated});
				}
			}
		});
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'});
	}

}

module.exports = {
}
