import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Container, Paper, Grid, Card, CardMedia, 
  CardContent, CardActions, Button, IconButton, Chip, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyKitchen = ({ onEditDish, onAddNew, onBack }) => {
  const [dishes, setDishes] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchMyDishes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/dishes/cook/${user._id}`);
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      console.error('Error fetching my dishes:', err);
    }
  }, [user._id]);

  useEffect(() => {
    fetchMyDishes();
  }, [fetchMyDishes]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este plato?')) {
      try {
        const res = await fetch(`${API_URL}/api/dishes/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchMyDishes();
        }
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#e83a3a', fontWeight: 'bold' }}>
          Mi Cocina 👩‍🍳
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={onAddNew}
          sx={{ backgroundColor: '#e83a3a', '&:hover': { backgroundColor: '#c52d2d' } }}
        >
          Publicar Nuevo
        </Button>
      </Box>

      {dishes.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '15px' }}>
          <RestaurantMenuIcon sx={{ fontSize: '4rem', color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Aún no has publicado ningún plato.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2, color: '#e83a3a', borderColor: '#e83a3a' }} onClick={onAddNew}>
            ¡Empezar a cocinar!
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {dishes.map((dish) => (
            <Grid item xs={12} sm={6} md={4} key={dish._id}>
              <Card sx={{ borderRadius: '15px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={dish.imagen || 'https://via.placeholder.com/300x160?text=Sin+Imagen'}
                  alt={dish.nombre}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {dish.nombre}
                    </Typography>
                    <Chip label={dish.categoria} size="small" sx={{ bgcolor: '#fff5f5', color: '#e83a3a', fontWeight: 'bold' }} />
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
                    {dish.descripcion}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="caption">
                      {dish.horaInicio} - {dish.horaFin} · {dish.porciones} porc.
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#e83a3a', mt: 1, fontWeight: 'bold' }}>
                    S/. {dish.precio}.00
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                  <IconButton onClick={() => onEditDish(dish)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(dish._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="outlined" onClick={onBack} sx={{ color: '#e83a3a', borderColor: '#e83a3a' }}>
          Volver al Inicio
        </Button>
      </Box>
    </Container>
  );
};

export default MyKitchen;
