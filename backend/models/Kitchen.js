const mongoose = require('mongoose');

const KitchenSchema = new mongoose.Schema({
  nombre_cocina: { type: String, required: true },
  ama_de_casa: { type: String, required: true },
  descripcion: String,
  ubicacion: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  menu_del_dia: [{
    plato: String,
    precio: Number,
    etiquetas: [String]
  }],
  estado: { type: String, enum: ['Abierto', 'Cerrado'], default: 'Abierto' },
  puntuacion: { type: Number, default: 5 },
  imagen_perfil: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Kitchen', KitchenSchema);
