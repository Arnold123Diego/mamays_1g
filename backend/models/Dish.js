const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cocinero: { type: String, required: true }, // Nombre para mostrar
  cocineroId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID para consultas
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  descripcion: { type: String },
  porciones: { type: Number, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reseñas: { type: Number, default: 0 },
  ubicacion: { type: String, required: true },
  emoji: { type: String },
  color: { type: String },
  imagen: { type: String }, // Campo para el base64 de la imagen
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dish', DishSchema);
