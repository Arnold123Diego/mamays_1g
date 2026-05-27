import React, { useState, useRef } from 'react';
import './PublishDish.scss';
import { 
  Box, TextField, Button, Typography, Container, Paper, 
  IconButton, MenuItem, Grid 
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PublishDish = ({ onBack }) => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [dishPhoto, setDishPhoto] = useState(null);
  const dishPhotoRef = useRef(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDishPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      nombre: data.get('nombre'),
      precio: data.get('precio'),
      categoria: data.get('categoria'),
      descripcion: data.get('descripcion'),
      porciones: data.get('porciones'),
      ubicacion: user.direccionCocina || 'Puno Centro',
      cocinero: user.nombre,
      cocineroId: user._id,
      horaInicio: data.get('horaInicio'),
      horaFin: data.get('horaFin'),
      rating: 5,
      reseñas: 0,
      emoji: '🍲',
      color: '#FF6B6B',
      imagen: dishPhoto
    };

    try {
      const res = await fetch(`${API_URL}/api/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert('✅ ¡Tu plato se publicó con éxito!');
        onBack();
      } else {
        const errorData = await res.json();
        alert(`❌ Error al publicar: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error de conexión con el servidor');
    }
  };

  return (
    <Container maxWidth="md" className="publish-dish-container">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: '#e83a3a', fontWeight: 'bold' }}>
          Publicar Nuevo Plato
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: '#666' }}>
          Comparte tu sazón con la comunidad de Mamays
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                onClick={() => dishPhotoRef.current.click()}
                sx={{ 
                  width: '100%', 
                  height: '200px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  border: '2px dashed #ccc', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { borderColor: '#e83a3a', backgroundColor: '#fff5f5' }
                }}
              >
                {dishPhoto ? (
                  <>
                    <img src={dishPhoto} alt="plato" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); setDishPhoto(null); }}
                      sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.8)' }}
                    >
                      <CloseIcon sx={{ color: '#e83a3a' }} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <PhotoCamera sx={{ fontSize: '3rem', color: '#ccc', mb: 1 }} />
                    <Typography sx={{ color: '#999' }}>Subir Foto del Plato</Typography>
                  </>
                )}
              </Box>
              <input type="file" hidden ref={dishPhotoRef} onChange={handlePhotoChange} accept="image/*" />
            </Grid>

            <Grid item xs={12}>
              <TextField name="nombre" fullWidth label="Nombre del Plato" variant="outlined" placeholder="Ej. Ceviche de Trucha Orgánica" required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="precio" fullWidth label="Precio (S/.)" type="number" variant="outlined" placeholder="0.00" required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="categoria" fullWidth select label="Categoría" variant="outlined" defaultValue="Entradas">
                <MenuItem value="Entradas">Entradas</MenuItem>
                <MenuItem value="Segundos">Segundos / Platos de Fondo</MenuItem>
                <MenuItem value="Sopas">Sopas / Caldos</MenuItem>
                <MenuItem value="Postres">Postres</MenuItem>
                <MenuItem value="Bebidas">Bebidas</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField name="descripcion" fullWidth label="Descripción e Ingredientes" variant="outlined" multiline rows={4} placeholder="Cuéntanos qué hace especial a este plato..." />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="porciones" fullWidth label="¿Cuántos platos vas a vender? (Porciones)" type="number" variant="outlined" placeholder="0" required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="fecha" fullWidth label="¿Cuándo vas a vender tu plato?" type="date" variant="outlined" InputLabelProps={{ shrink: true }} required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="horaInicio" fullWidth label="Hora de Inicio" type="time" variant="outlined" InputLabelProps={{ shrink: true }} required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="horaFin" fullWidth label="Hora de Fin" type="time" variant="outlined" InputLabelProps={{ shrink: true }} required />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#e83a3a', px: 4, '&:hover': { backgroundColor: '#c52d2d' } }}>
              Publicar Plato
            </Button>
            <Button variant="outlined" onClick={onBack} sx={{ color: '#e83a3a', borderColor: '#e83a3a' }}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PublishDish;
