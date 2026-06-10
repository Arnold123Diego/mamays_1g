const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
const Dish = require('./models/Dish');
const User = require('./models/User');
const Reservation = require('./models/Reservation');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await new User({ nombre: profile.displayName, email: profile.emails[0].value, password: 'oauth-user' }).save();
    }
    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => res.redirect('/'));


// Registro de usuario
app.post('/api/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login básico
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar perfil de usuario
app.put('/api/user/update', async (req, res) => {
  try {
    const { email, ...updateData } = req.body;
    const user = await User.findOneAndUpdate({ email }, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Si el usuario es cocinero y cambió su nombre, actualizar sus platos
    if (user.rol === 'cook' && updateData.nombre) {
      const nuevoNombre = `${user.nombre}`;
      await Dish.updateMany(
        { cocineroId: user._id },
        { cocinero: nuevoNombre }
      );
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener detalles de un usuario
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener todos los platos
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para publicar un nuevo plato
app.post('/api/dishes', async (req, res) => {
  const newDish = new Dish(req.body);
  try {
    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ruta para actualizar un plato
app.put('/api/dishes/:id', async (req, res) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDish) return res.status(404).json({ message: 'Plato no encontrado' });
    res.json(updatedDish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ruta para eliminar un plato
app.delete('/api/dishes/:id', async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Plato no encontrado' });
    // También podríamos eliminar las reservas asociadas a este plato si fuera necesario
    await Reservation.deleteMany({ dish: req.params.id });
    res.json({ message: 'Plato eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener platos de un cocinero específico
app.get('/api/dishes/cook/:cookId', async (req, res) => {
  try {
    const dishes = await Dish.find({ cocineroId: req.params.cookId });
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

// --- RUTAS DE RESERVAS ---

// Crear una nueva reserva
app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    
    // Descontar porciones del plato
    await Dish.findByIdAndUpdate(req.body.dish, { $inc: { porciones: -req.body.quantity } });
    
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener reservas para un cocinero
app.get('/api/reservations/cook/:cookId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ cook: req.params.cookId })
      .populate('user', 'nombre email avatar')
      .populate('dish', 'nombre precio')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar estado de reserva
app.patch('/api/reservations/:id', async (req, res) => {
  try {
    const oldReservation = await Reservation.findById(req.params.id);
    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Si se cancela la reserva, devolver las porciones al plato
    if (req.body.status === 'cancelled' && oldReservation.status !== 'cancelled') {
      await Dish.findByIdAndUpdate(oldReservation.dish, { $inc: { porciones: oldReservation.quantity } });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
