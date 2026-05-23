const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mamaysdb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB (Mamays Puno DB)'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Rutas base (Simuladas por ahora)
app.get('/', (req, res) => {
  res.send('API de Mamays Puno funcionando 🚀');
});

// Importar modelos
const Kitchen = require('./models/Kitchen');

// Ruta para obtener todas las cocinas (Para el Mapa)
app.get('/api/kitchens', async (req, res) => {
  try {
    const kitchens = await Kitchen.find();
    res.json(kitchens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para que una ama de casa registre su cocina
app.post('/api/kitchens', async (req, res) => {
  const kitchen = new Kitchen(req.body);
  try {
    const newKitchen = await kitchen.save();
    res.status(201).json(newKitchen);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
