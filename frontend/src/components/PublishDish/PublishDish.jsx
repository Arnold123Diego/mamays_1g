import React, { useState, useRef } from 'react';
import './PublishDish.scss';
import { 
  Box, TextField, Button, Typography, Container, Paper, 
  IconButton, MenuItem, Grid 
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PublishDish = ({ onBack, dishToEdit }) => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [dishPhoto, setDishPhoto] = useState(dishToEdit?.imagen || null);
  const dishPhotoRef = useRef(null);
  const editMode = !!dishToEdit;

  const [formDataState, setFormDataState] = useState({
    nombre: dishToEdit?.nombre || '',
    precio: dishToEdit?.precio || '',
    categoria: dishToEdit?.categoria || 'Entradas',
    descripcion: dishToEdit?.descripcion || '',
    porciones: dishToEdit?.porciones || '',
    horaInicio: dishToEdit?.horaInicio || '',
    horaFin: dishToEdit?.horaFin || '',
    fecha: dishToEdit?.fecha?.split('T')[0] || new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    setFormDataState({ ...formDataState, [e.target.name]: e.target.value });
  };

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
    const finalData = {
      ...formDataState,
      ubicacion: user.direccionCocina || 'Puno Centro',
      cocinero: user.nombre,
      cocineroId: user._id,
      imagen: dishPhoto,
      // Conservar rating y reseñas si estamos editando
      rating: dishToEdit?.rating || 5,
      reseñas: dishToEdit?.reseñas || 0,
      emoji: dishToEdit?.emoji || '🍲',
      color: dishToEdit?.color || '#FF6B6B',
    };

    try {
      const url = editMode ? `${API_URL}/api/dishes/${dishToEdit._id}` : `${API_URL}/api/dishes`;
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      
      if (res.ok) {
        alert(editMode ? '✅ ¡Tu plato se actualizó con éxito!' : '✅ ¡Tu plato se publicó con éxito!');
        onBack();
      } else {
        const errorData = await res.json();
        alert(`❌ Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error de conexión con el servidor');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este plato? Esta acción eliminará también las reservas asociadas.')) {
      try {
        const res = await fetch(`${API_URL}/api/dishes/${dishToEdit._id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          alert('🗑️ Plato eliminado correctamente');
          onBack();
        } else {
          alert('❌ Error al eliminar el plato');
        }
      } catch (err) {
        alert('❌ Error de conexión');
      }
    }
  };

  return (
    <Container maxWidth="md" className="publish-dish-container">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: '#e83a3a', fontWeight: 'bold' }}>
          {editMode ? 'Editar Plato' : 'Publicar Nuevo Plato'}
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: '#666' }}>
          {editMode ? 'Modifica los detalles de tu especialidad' : 'Comparte tu sazón con la comunidad de Mamays'}
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
              <TextField name="nombre" fullWidth label="Nombre del Plato" variant="outlined" value={formDataState.nombre} onChange={handleInputChange} required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="precio" fullWidth label="Precio (S/.)" type="number" variant="outlined" value={formDataState.precio} onChange={handleInputChange} required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="categoria" fullWidth select label="Categoría" variant="outlined" value={formDataState.categoria} onChange={handleInputChange}>
                <MenuItem value="Entradas">Entradas</MenuItem>
                <MenuItem value="Segundos">Segundos / Platos de Fondo</MenuItem>
                <MenuItem value="Sopas">Sopas / Caldos</MenuItem>
                <MenuItem value="Postres">Postres</MenuItem>
                <MenuItem value="Bebidas">Bebidas</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField name="descripcion" fullWidth label="Descripción e Ingredientes" variant="outlined" multiline rows={4} value={formDataState.descripcion} onChange={handleInputChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="porciones" fullWidth label="Porciones Disponibles" type="number" variant="outlined" value={formDataState.porciones} onChange={handleInputChange} required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="fecha" fullWidth label="Fecha de Venta" type="date" variant="outlined" InputLabelProps={{ shrink: true }} value={formDataState.fecha} onChange={handleInputChange} required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="horaInicio" fullWidth label="Hora de Inicio" type="time" variant="outlined" InputLabelProps={{ shrink: true }} value={formDataState.horaInicio} onChange={handleInputChange} required />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="horaFin" fullWidth label="Hora de Fin" type="time" variant="outlined" InputLabelProps={{ shrink: true }} value={formDataState.horaFin} onChange={handleInputChange} required />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#e83a3a', px: 4, '&:hover': { backgroundColor: '#c52d2d' } }}>
              {editMode ? 'Guardar Cambios' : 'Publicar Plato'}
            </Button>
            
            {editMode && (
              <Button variant="contained" color="error" onClick={handleDelete} sx={{ px: 4 }}>
                Eliminar Plato
              </Button>
            )}

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
