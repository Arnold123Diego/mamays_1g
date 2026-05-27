import React, { useState, useEffect } from 'react';
import './DishFeed.scss';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DishFeed = ({ onDishClick }) => {
  const [dishes, setDishes] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [filterCat, setFilterCat] = useState('Todos');

  useEffect(() => {
    fetch(`${API_URL}/api/dishes`)
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(err => console.error('Error fetching dishes:', err));
  }, []);

  const categorias = ['Todos', 'Entradas', 'Segundos', 'Sopas', 'Postres', 'Bebidas'];

  const toggleFav = (id, e) => {
    e.stopPropagation(); // Evitar navegar al plato al dar like
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = filterCat === 'Todos'
    ? dishes
    : dishes.filter(d => d.categoria === filterCat);

  return (
    <div className="dish-feed">
      <div className="dish-feed__header">
        <h2>🍽️ Platos disponibles hoy</h2>
        <p>Cocinadas con amor por las Mamays de tu comunidad</p>
      </div>

      {/* Filtros por categoría */}
      <div className="dish-feed__filters">
        {categorias.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filterCat === cat ? 'active' : ''}`}
            onClick={() => setFilterCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de platos */}
      <div className="dish-feed__grid">
        {filtered.map(dish => (
          <div key={dish._id} className="dish-card" onClick={() => onDishClick(dish)}>
            {/* Banner visual con imagen si existe o emoji */}
            <div className="dish-card__banner" style={{ backgroundColor: dish.color || '#48CAE4' }}>
              {dish.imagen ? (
                <img src={dish.imagen} alt={dish.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className="dish-card__emoji">{dish.emoji}</span>
              )}
              <button
                className="dish-card__fav"
                onClick={(e) => toggleFav(dish._id, e)}
                aria-label="Favorito"
              >
                {favorites[dish._id]
                  ? <FavoriteIcon style={{ color: '#ff3b3b', fontSize: '1.3rem' }} />
                  : <FavoriteBorderIcon style={{ color: 'white', fontSize: '1.3rem' }} />
                }
              </button>
              <span className="dish-card__categoria">{dish.categoria}</span>
            </div>

            {/* Contenido */}
            <div className="dish-card__body">
              <h3 className="dish-card__nombre">{dish.nombre}</h3>
              <p className="dish-card__cocinero">👩‍🍳 {dish.cocinero}</p>

              <div className="dish-card__meta">
                <span className="dish-card__rating">
                  <StarIcon style={{ fontSize: '0.9rem', color: '#FFB703' }} />
                  {dish.rating} ({dish.reseñas})
                </span>
                <span className="dish-card__ubicacion">
                  <LocationOnIcon style={{ fontSize: '0.9rem', color: '#e83a3a' }} />
                  {dish.ubicacion}
                </span>
              </div>

              <p className="dish-card__desc">{dish.descripcion}</p>

              <div className="dish-card__horario">
                <AccessTimeIcon style={{ fontSize: '0.85rem', color: '#888' }} />
                <span>{dish.horaInicio} – {dish.horaFin} · {dish.porciones} porciones</span>
              </div>

              <div className="dish-card__footer">
                <span className="dish-card__precio">S/. {dish.precio}.00</span>
                <button className="dish-card__btn">
                  <ShoppingCartIcon style={{ fontSize: '1rem' }} />
                  Pedir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishFeed;
