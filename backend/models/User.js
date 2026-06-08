const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['buyer', 'cook', 'admin'], default: 'buyer' },
  // Datos adicionales de perfil
  apellido: String,
  sexo: String,
  fechaNacimiento: Date,
  telefono: String,
  dietaryPrefs: { type: String, default: '' },
  estiloVida: { type: String, default: '' },
  alergias: [String],
  categoriasFavoritas: [String],
  platosPreferidos: [String],
  // Campos de vendedor (cocina)
  direccionCocina: String,
  banco: String,
  numeroCuenta: String,
  serviciosAdicionales: [String],
  fotosAmbiente: [String],
  avatar: String, // Base64 picture
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
