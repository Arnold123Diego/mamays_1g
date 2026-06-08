const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Encriptar contraseña antes de guardar
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
