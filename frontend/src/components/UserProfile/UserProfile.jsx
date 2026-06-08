import React, { useState, useRef } from 'react';
import './UserProfile.scss';
import { 
  Box, Tabs, Tab, TextField, Button, Typography, Container, Paper, 
  Avatar, IconButton, Grid, Chip, Divider, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

const dietaryOptions = ["Vegetariano", "Vegano", "Sin Gluten", "Keto", "Paleo", "Omnívoro"];
const lifestyleOptions = ["Estudiante", "Trabajador Remoto", "Atleta", "Padre/Madre de familia", "Viajero", "Senior"];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserProfile = ({ userRole, onBack, onClearRole }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState(user);
  
  const [newItem, setNewItem] = useState({ allergy: '', category: '', dish: '', service: '' });
  const diningPhotosRef = useRef(null);

  const handleAddItem = (type, value) => {
    if (!value.trim()) return;
    const key = type === 'allergy' ? 'alergias' : type === 'category' ? 'categoriasFavoritas' : type === 'dish' ? 'platosPreferidos' : 'serviciosAdicionales';
    const currentList = profileData[key] || [];
    setProfileData({...profileData, [key]: [...currentList, value]});
    setNewItem({ ...newItem, [type]: '' });
  };

  const removeItem = (key, index) => {
    setProfileData({...profileData, [key]: profileData[key].filter((_, i) => i !== index)});
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, ...profileData })
      });
      const updatedUser = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('✅ Perfil actualizado');
      }
    } catch (err) { alert('❌ Error al guardar'); }
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({...profileData, avatar: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md" className="user-profile-container">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
            <Avatar src={profileData.avatar} sx={{ width: 120, height: 120, border: '4px solid #f43c3c', mb: 2 }} />
            <IconButton sx={{ position: 'absolute', bottom: 10, right: 0, backgroundColor: 'white' }}>
              <PhotoCamera sx={{ color: '#f43c3c' }} />
            </IconButton>
            <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
          </Box>
          <Typography variant="h4" sx={{ color: '#f43c3c', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
            Perfil de {profileData.nombre}
          </Typography>
        </Box>
        
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} centered sx={{ mb: 3 }}>
          <Tab label="Básico" />
          <Tab label="Adicional" />
          {userRole === 'cook' && <Tab label="De Cocina" />}
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Nombre" value={profileData.nombre || ''} onChange={e => setProfileData({...profileData, nombre: e.target.value})} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Apellido" value={profileData.apellido || ''} onChange={e => setProfileData({...profileData, apellido: e.target.value})} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Teléfono" value={profileData.telefono || ''} onChange={e => setProfileData({...profileData, telefono: e.target.value})} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Fecha Nacimiento" type="date" InputLabelProps={{ shrink: true }} value={profileData.fechaNacimiento?.split('T')[0] || ''} onChange={e => setProfileData({...profileData, fechaNacimiento: e.target.value})} /></Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estilo de Alimentación</InputLabel>
                  <Select
                    value={profileData.dietaryPrefs || ''}
                    label="Estilo de Alimentación"
                    onChange={e => setProfileData({...profileData, dietaryPrefs: e.target.value})}
                  >
                    {dietaryOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estilo de Vida</InputLabel>
                  <Select
                    value={profileData.estiloVida || ''}
                    label="Estilo de Vida"
                    onChange={e => setProfileData({...profileData, estiloVida: e.target.value})}
                  >
                    {lifestyleOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3 }}>Platos Favoritos</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
              {(profileData.platosPreferidos || []).map((p, i) => (
                <Chip key={i} label={p} onDelete={() => removeItem('platosPreferidos', i)} color="primary" variant="outlined" />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField 
                size="small" 
                fullWidth
                placeholder="Ej: Lomo Saltado, Ceviche..." 
                value={newItem.dish} 
                onChange={e => setNewItem({...newItem, dish: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem('dish', newItem.dish)}
              />
              <IconButton color="primary" onClick={() => handleAddItem('dish', newItem.dish)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>

            <Typography variant="h6" sx={{ mt: 3 }}>Categorías Favoritas</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
              {(profileData.categoriasFavoritas || []).map((c, i) => (
                <Chip key={i} label={c} onDelete={() => removeItem('categoriasFavoritas', i)} color="secondary" variant="outlined" />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField 
                size="small" 
                fullWidth
                placeholder="Ej: Criolla, Marina, Postres..." 
                value={newItem.category} 
                onChange={e => setNewItem({...newItem, category: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem('category', newItem.category)}
              />
              <IconButton color="secondary" onClick={() => handleAddItem('category', newItem.category)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6">Alergias</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
              {(profileData.alergias || []).map((a, i) => <Chip key={i} label={a} onDelete={() => removeItem('alergias', i)} />)}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField size="small" fullWidth placeholder="Añadir alergia" value={newItem.allergy} onChange={e => setNewItem({...newItem, allergy: e.target.value})} />
              <IconButton onClick={() => handleAddItem('allergy', newItem.allergy)}><AddCircleOutlineIcon /></IconButton>
            </Box>
          </Box>
        )}

        {activeTab === 2 && userRole === 'cook' && (
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Dirección Cocina" value={profileData.direccionCocina || ''} onChange={e => setProfileData({...profileData, direccionCocina: e.target.value})} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Banco" value={profileData.banco || ''} onChange={e => setProfileData({...profileData, banco: e.target.value})} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Número Cuenta" value={profileData.numeroCuenta || ''} onChange={e => setProfileData({...profileData, numeroCuenta: e.target.value})} /></Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Servicios Adicionales</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                {(profileData.serviciosAdicionales || []).map((s, i) => (
                  <Chip key={i} label={s} onDelete={() => removeItem('serviciosAdicionales', i)} color="success" variant="outlined" />
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField 
                  size="small" 
                  fullWidth
                  placeholder="Ej: WiFi, Estacionamiento, Zona de juegos..." 
                  value={newItem.service} 
                  onChange={e => setNewItem({...newItem, service: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem('service', newItem.service)}
                />
                <IconButton color="success" onClick={() => handleAddItem('service', newItem.service)}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Fotos del Ambiente (Comedor/Cocina)</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                {(profileData.fotosAmbiente || []).map((photo, idx) => (
                  <Box key={idx} sx={{ position: 'relative' }}>
                    <img src={photo} alt={`ambiente-${idx}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                    <IconButton 
                      size="small" 
                      onClick={() => setProfileData({...profileData, fotosAmbiente: profileData.fotosAmbiente.filter((_, i) => i !== idx)})}
                      sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white', '&:hover': { bgcolor: '#eee' } }}
                    >
                      <CloseIcon fontSize="small" sx={{ color: '#f43c3c' }} />
                    </IconButton>
                  </Box>
                ))}
                <Box 
                  onClick={() => diningPhotosRef.current.click()}
                  sx={{ 
                    width: 100, height: 100, border: '2px dashed #ccc', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    '&:hover': { borderColor: '#f43c3c' }
                  }}
                >
                  <PhotoCamera sx={{ color: '#ccc' }} />
                </Box>
              </Box>
              <input 
                type="file" 
                multiple 
                hidden 
                ref={diningPhotosRef} 
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  files.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfileData(prev => ({...prev, fotosAmbiente: [...(prev.fotosAmbiente || []), reader.result]}));
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#e83a3a', mr: 2 }}>Guardar Cambios</Button>
          <Button variant="outlined" onClick={onBack}>Volver</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
