const mongoose = require('mongoose');
const Dish = require('./models/Dish');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mamaysdb';

const seedData = [
  {
    nombre: 'Ceviche de Trucha del Titicaca',
    cocinero: 'Mamay Rosario',
    precio: 18,
    categoria: 'Entradas',
    descripcion: 'Fresca trucha del Lago Titicaca marinada con limón, ají limo, cebolla morada y cilantro. Lista para el almuerzo.',
    porciones: 8,
    horaInicio: '12:00',
    horaFin: '15:00',
    rating: 4.9,
    reseñas: 127,
    ubicacion: 'Puno Centro',
    emoji: '🐟',
    color: '#FF6B6B',
  },
  {
    nombre: 'Sopa de Quinua con Cordero',
    cocinero: 'Mamay Carmen',
    precio: 12,
    categoria: 'Sopas',
    descripcion: 'Reconfortante sopa altiplánica con quinua real, verduras de temporada y tierno cordero. El calor que necesitas.',
    porciones: 5,
    horaInicio: '11:00',
    horaFin: '14:00',
    rating: 4.7,
    reseñas: 89,
    ubicacion: 'Juliaca',
    emoji: '🍲',
    color: '#F7A072',
  },
  {
    nombre: 'Segundo de Pejerrey Frito',
    cocinero: 'Mamay Lucía',
    precio: 15,
    categoria: 'Segundos',
    descripcion: 'Crujiente pejerrey del Titicaca acompañado de papas doradas, ensalada fresca y arroz con leche de quinua.',
    porciones: 10,
    horaInicio: '12:30',
    horaFin: '15:30',
    rating: 4.8,
    reseñas: 203,
    ubicacion: 'Puno Centro',
    emoji: '🍽️',
    color: '#48CAE4',
  },
  {
    nombre: 'Mazamorra de Cañihua',
    cocinero: 'Mamay Elena',
    precio: 6,
    categoria: 'Postres',
    descripcion: 'Postre tradicional puneño hecho con cañihua orgánica, canela y clavo de olor. Nutritivo y delicioso.',
    porciones: 12,
    horaInicio: '15:00',
    horaFin: '18:00',
    rating: 4.6,
    reseñas: 54,
    ubicacion: 'Chucuito',
    emoji: '🍮',
    color: '#C77DFF',
  },
  {
    nombre: 'Chairo Puneño',
    cocinero: 'Mamay Gregoria',
    precio: 14,
    categoria: 'Sopas',
    descripcion: 'El guiso ancestral andino: chuño, chalona, zapallo, cebada y hierbas aromáticas. Receta de generaciones.',
    porciones: 6,
    horaInicio: '10:00',
    horaFin: '13:00',
    rating: 5.0,
    reseñas: 311,
    ubicacion: 'Azángaro',
    emoji: '🫕',
    color: '#52B788',
  },
  {
    nombre: 'Api Morado con Buñuelos',
    cocinero: 'Mamay Filomena',
    precio: 8,
    categoria: 'Bebidas',
    descripcion: 'Bebida caliente de maíz morado con buñuelos esponjosos bañados en miel de caña. Desayuno puneño por excelencia.',
    porciones: 15,
    horaInicio: '07:00',
    horaFin: '10:00',
    rating: 4.8,
    reseñas: 178,
    ubicacion: 'Ilave',
    emoji: '🥤',
    color: '#9B5DE5',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB para seeding');
    await Dish.deleteMany({});
    await Dish.insertMany(seedData);
    console.log('✅ Datos iniciales cargados con éxito');
    process.exit();
  } catch (err) {
    console.error('❌ Error en seeding:', err);
    process.exit(1);
  }
}

seed();
