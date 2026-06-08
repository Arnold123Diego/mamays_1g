const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  cook: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true, default: 1 },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'yape', 'transfer'], 
    default: 'cash' 
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'pending_verification'],
    default: 'unpaid'
  },
  transactionId: { type: String }, // Para el ID de Yape o Transferencia
  evidenceImage: { type: String }, // Base64 de la captura de pantalla
  reservationTime: { type: String }, // Ej: "12:30 PM"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
