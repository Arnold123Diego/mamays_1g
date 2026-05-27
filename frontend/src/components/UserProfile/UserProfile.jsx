import React, { useState, useRef } from 'react';
import './UserProfile.scss';
import { 
  Box, Tabs, Tab, TextField, Button, Typography, Container, Paper, 
  Avatar, IconButton, Grid, Chip, Divider 
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

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
            <Typography variant="h6">Alergias</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
              {(profileData.alergias || []).map((a, i) => <Chip key={i} label={a} onDelete={() => removeItem('alergias', i)} />)}
            </Box>
            <TextField size="small" placeholder="Añadir alergia" value={newItem.allergy} onChange={e => setNewItem({...newItem, allergy: e.target.value})} />
            <IconButton onClick={() => handleAddItem('allergy', newItem.allergy)}><AddCircleOutlineIcon /></IconButton>
            
            <Typography variant="h6" sx={{ mt: 2 }}>Categorías Favoritas</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
              {(profileData.categoriasFavoritas || []).map((c, i) => <Chip key={i} label={c} onDelete={() => removeItem('categoriasFavoritas', i)} />)}
            </Box>
            <TextField size="small" placeholder="Añadir categoría" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} />
            <IconButton onClick={() => handleAddItem('category', newItem.category)}><AddCircleOutlineIcon /></IconButton>
          </Box>
        )}

        {activeTab === 2 && userRole === 'cook' && (
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Dirección Cocina" value={profileData.direccionCocina || ''} onChange={e => setProfileData({...profileData, direccionCocina: e.target.value})} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Banco" value={profileData.banco || ''} onChange={e => setProfileData({...profileData, banco: e.target.value})} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Número Cuenta" value={profileData.numeroCuenta || ''} onChange={e => setProfileData({...profileData, numeroCuenta: e.target.value})} /></Grid>
            
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
