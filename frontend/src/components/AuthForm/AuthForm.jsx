import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Container, MenuItem } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRol, setSelectedRol] = useState('buyer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const user = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(user));
        alert('✅ Éxito');
        onAuthSuccess(user);
      } else {
        alert(`❌ Error: ${user.message}`);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center">{isLogin ? 'Iniciar Sesión' : 'Registro'}</Typography>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <TextField name="nombre" fullWidth label="Nombre" margin="normal" required />
              <TextField name="apellido" fullWidth label="Apellido" margin="normal" required />
              <TextField 
                name="telefono" 
                fullWidth 
                label="Teléfono" 
                margin="normal" 
                required 
                inputProps={{ 
                  pattern: "[0-9]{9}", 
                  title: "El teléfono debe tener 9 dígitos numéricos",
                  maxLength: 9
                }} 
                placeholder="Ej. 987654321"
              />
              <TextField name="fechaNacimiento" fullWidth label="Fecha de Nacimiento" type="date" margin="normal" InputLabelProps={{ shrink: true }} required />
              <TextField 
                name="rol" 
                select 
                fullWidth 
                label="Rol" 
                margin="normal" 
                value={selectedRol}
                onChange={(e) => setSelectedRol(e.target.value)}
                required
              >
                <MenuItem value="buyer">Comprador</MenuItem>
                <MenuItem value="cook">Cocinero</MenuItem>
              </TextField>

              {selectedRol === 'cook' && (
                <>
                  <TextField name="direccionCocina" fullWidth label="Dirección de la Cocina" margin="normal" placeholder="Jr. Libertad 456, Puno" required />
                  <TextField name="banco" select fullWidth label="Banco para recibir pagos" margin="normal" defaultValue="BCP">
                    <MenuItem value="BCP">BCP</MenuItem>
                    <MenuItem value="Interbank">Interbank</MenuItem>
                    <MenuItem value="BBVA">BBVA</MenuItem>
                    <MenuItem value="Scotiabank">Scotiabank</MenuItem>
                    <MenuItem value="Banco de la Nación">Banco de la Nación</MenuItem>
                    <MenuItem value="Yape/Plin">Yape / Plin</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </TextField>
                  <TextField 
                    name="numeroCuenta" 
                    fullWidth 
                    label="Número de Cuenta / CCI" 
                    margin="normal" 
                    placeholder="000-000000000-0-00" 
                    required 
                    inputProps={{ 
                      pattern: "[0-9\\-]+", 
                      title: "Solo números y guiones" 
                    }}
                  />
                </>
              )}
            </>
          )}
          <TextField name="email" fullWidth label="Email" type="email" margin="normal" required />
          <TextField name="password" fullWidth label="Contraseña" type="password" margin="normal" required />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, backgroundColor: '#e83a3a' }}>
            {isLogin ? 'Entrar' : 'Registrarse'}
          </Button>
          <Button fullWidth onClick={() => setIsLogin(!isLogin)} sx={{ mt: 1 }}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AuthForm;
