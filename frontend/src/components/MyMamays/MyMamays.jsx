import React, { useState } from 'react';
import './MyMamays.scss';
import { 
  Box, Typography, Container, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Avatar, 
  Chip, Button
} from '@mui/material';

const initialFavoriteSellers = [
  { id: 1, name: 'Mamay Rosa', photo: '', dish: 'Ceviche de Trucha', foodType: 'Comida Marina', rating: 4.8 },
  { id: 2, name: 'Mamay Carmen', photo: '', dish: 'Ají de Gallina', foodType: 'Comida Criolla', rating: 4.5 },
  { id: 3, name: 'Mamay Elena', photo: '', dish: 'Chairo Puneño', foodType: 'Comida Andina', rating: 4.9 },
];

const MyMamays = ({ onBack }) => {
  const [favoriteSellers] = useState(initialFavoriteSellers);

  return (
    <Container maxWidth="lg" className="my-mamays-container">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: '15px' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#e83a3a', fontWeight: 'bold', mb: 4 }}>
          Mis Mamays Favoritas
        </Typography>

        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Nombre Mamay</TableCell>
                <TableCell>Plato Destacado</TableCell>
                <TableCell>Tipo de Comida</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {favoriteSellers.map((seller) => (
                <TableRow key={seller.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={seller.photo} alt={seller.name}>{seller.name[0]}</Avatar>
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>{seller.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{seller.dish}</TableCell>
                  <TableCell>
                    <Chip label={seller.foodType} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{seller.rating} ⭐</TableCell>
                  <TableCell align="center">
                     <Button size="small" variant="outlined" color="error">Ver Menú</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={onBack} sx={{ color: '#e83a3a', borderColor: '#e83a3a' }}>
            Volver al Inicio
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MyMamays;
