import React, { useState, useEffect } from 'react';
import './DishDetail.scss';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Button, Grid, Avatar, Divider, Chip, Modal, IconButton, Paper } from '@mui/material';

const DishDetail = ({ dish, onBack }) => {
  const [seller, setSeller] = useState(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  useEffect(() => {
    if (dish.cocineroId) {
      fetch(`http://localhost:5000/api/users/${dish.cocineroId}`)
        .then(res => res.json())
        .then(data => setSeller(data))
        .catch(err => console.error('Error fetching seller:', err));
    }
  }, [dish.cocineroId]);

  const handleOpenImg = (img) => {
    setSelectedImg(img);
    setOpenLightbox(true);
  };

  return (
    <Box className="dish-detail">
      <Button onClick={onBack} sx={{ color: '#f43c3c', mb: 2, textTransform: 'none', fontWeight: 'bold' }}>
        ← Volver al Explorador
      </Button>
      
      <Grid container spacing={4}>
        {/* Sección de Imágenes e Historia */}
        <Grid item xs={12} md={7}>
          <Box className="image-section">
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#555' }}>Plato del Día</Typography>
            <img 
              src={dish.imagen || 'https://via.placeholder.com/600x400?text=Sin+Imagen'} 
              alt={dish.nombre} 
              className="main-dish-image"
              onClick={() => handleOpenImg(dish.imagen)}
            />
            
            {seller?.fotosAmbiente && seller.fotosAmbiente.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#555' }}>Nuestra Cocina y Comedor</Typography>
                <Box className="environment-gallery">
                  {seller.fotosAmbiente.map((pic, idx) => (
                    <Box key={idx} className="gallery-item" onClick={() => handleOpenImg(pic)}>
                      <img src={pic} alt={`ambiente-${idx}`} />
                      <div className="overlay">Ampliar</div>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Sección de Información y Acción */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} className="info-card" sx={{ border: '1px solid #eee', borderRadius: '16px', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#333', lineHeight: 1.2 }}>{dish.nombre}</Typography>
                <Chip label={dish.categoria} sx={{ bgcolor: '#f43c3c', color: 'white', fontWeight: 'bold' }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 3, gap: 1.5 }}>
              <Avatar src={seller?.avatar} sx={{ width: 50, height: 50, border: '2px solid #f43c3c' }}>
                {dish.cocinero[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1 }}>{dish.cocinero}</Typography>
                <Typography variant="caption" color="textSecondary">Cocina local certificada</Typography>
              </Box>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', bgcolor: '#fff9e6', px: 1, borderRadius: 1 }}>
                <StarIcon sx={{ color: '#FFB703', fontSize: '1rem' }} />
                <Typography sx={{ fontWeight: 'bold', ml: 0.5 }}>{dish.rating}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body1" sx={{ color: '#555', mb: 3, fontStyle: 'italic' }}>
              "{dish.descripcion || 'Sin descripción disponible para este delicioso plato local.'}"
            </Typography>

            <Box className="details-list">
              <Box className="detail-row">
                <LocationOnIcon sx={{ color: '#f43c3c' }} />
                <Typography variant="body2">{dish.ubicacion}</Typography>
              </Box>
              <Box className="detail-row">
                <AccessTimeIcon sx={{ color: '#666' }} />
                <Typography variant="body2">Atención: {dish.horaInicio} – {dish.horaFin}</Typography>
              </Box>
              <Box className="detail-row" sx={{ mt: 1 }}>
                <Typography variant="h5" sx={{ color: '#f43c3c', fontWeight: 800 }}>S/. {dish.precio}.00</Typography>
                <Typography variant="body2" sx={{ ml: 1, color: '#888' }}>({dish.porciones} platos restantes)</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#888', textAlign: 'center' }}>¿LISTO PARA PEDIR? CONTACTA A LA MAMAY:</Typography>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<WhatsAppIcon />}
                sx={{ 
                    bgcolor: '#25D366', mb: 2, py: 1.8, borderRadius: '12px',
                    fontSize: '1rem', fontWeight: 'bold', textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
                    '&:hover': { bgcolor: '#128C7E' } 
                }}
                href={`https://wa.me/${seller?.telefono?.replace(/\D/g, '')}?text=Hola%20${dish.cocinero},%20me%20gustaría%20pedir%20tu%20plato:%20${dish.nombre}`}
                target="_blank"
              >
                Hacer pedido por WhatsApp
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<PhoneIcon />}
                sx={{ 
                    color: '#f43c3c', borderColor: '#f43c3c', py: 1.5, borderRadius: '12px',
                    fontWeight: 'bold', textTransform: 'none',
                    '&:hover': { bgcolor: '#fff5f5', borderColor: '#f43c3c' }
                }}
                href={`tel:${seller?.telefono}`}
              >
                Llamar directamente
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Lightbox Modal */}
      <Modal open={openLightbox} onClose={() => setOpenLightbox(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', outline: 'none' }}>
          <IconButton 
            onClick={() => setOpenLightbox(false)} 
            sx={{ position: 'absolute', top: -40, right: 0, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
          <img src={selectedImg} alt="ampliada" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
        </Box>
      </Modal>
    </Box>
  );
};

export default DishDetail;
