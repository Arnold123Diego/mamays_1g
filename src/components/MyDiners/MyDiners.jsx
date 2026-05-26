import React, { useState } from 'react';
import './MyDiners.scss';
import { 
  Box, Typography, Container, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Avatar, 
  Chip, Checkbox, Button, TextField, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const initialDiners = [
  { id: 1, name: 'Juan Pérez', photo: '', dish: 'Ceviche de Trucha', paymentMethod: 'Yape', paid: true, time: '12:30 PM', attended: false },
  { id: 2, name: 'María Garcia', photo: '', dish: 'Ají de Gallina', paymentMethod: 'Efectivo', paid: false, time: '01:15 PM', attended: false },
  { id: 3, name: 'Ricardo Loli', photo: '', dish: 'Chairo Puneño', paymentMethod: 'Transferencia BCP', paid: true, time: '12:45 PM', attended: true },
];

const MyDiners = ({ onBack }) => {
  const [diners, setDiners] = useState(initialDiners);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  const toggleAttended = (id) => {
    setDiners(diners.map(d => d.id === id ? { ...d, attended: !d.attended } : d));
  };

  return (
    <Container maxWidth="lg" className="my-diners-container">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: '15px' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#e83a3a', fontWeight: 'bold', mb: 4 }}>
          Mis Comensales
        </Typography>

        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Usuario</TableCell>
                <TableCell>Plato Reservado</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell align="center">¿Pagó?</TableCell>
                <TableCell>Hora de Pago</TableCell>
                <TableCell align="center">¿Asistió?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diners.map((diner) => (
                <TableRow key={diner.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={diner.photo} alt={diner.name}>{diner.name[0]}</Avatar>
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>{diner.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{diner.dish}</TableCell>
                  <TableCell>{diner.paymentMethod}</TableCell>
                  <TableCell align="center">
                    {diner.paid ? (
                      <Chip icon={<CheckCircleIcon />} label="Pagado" color="success" size="small" variant="outlined" />
                    ) : (
                      <Chip icon={<CancelIcon />} label="Pendiente" color="warning" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>{diner.time}</TableCell>
                  <TableCell align="center">
                    <Checkbox 
                      checked={diner.attended} 
                      onChange={() => toggleAttended(diner.id)}
                      sx={{ color: '#e83a3a', '&.Mui-checked': { color: '#e83a3a' } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 6 }} />

        <Box sx={{ textAlign: 'center', backgroundColor: '#fff5f5', p: 4, borderRadius: '10px' }}>
          <Typography variant="h6" sx={{ color: '#e83a3a', mb: 1, fontWeight: 'bold' }}>
            ¿Problemas con algún usuario?
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Si tuviste inconvenientes con un comensal, repórtalo para mantener la comunidad segura.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ReportProblemIcon />}
            onClick={() => setReportOpen(true)}
            sx={{ backgroundColor: '#e83a3a', '&:hover': { backgroundColor: '#c52d2d' } }}
          >
            Reportar Usuario
          </Button>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={onBack} sx={{ color: '#e83a3a', borderColor: '#e83a3a' }}>
            Volver al Inicio
          </Button>
        </Box>
      </Paper>

      {/* Dialogo de Reporte */}
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: '#e83a3a', fontWeight: 'bold' }}>Reportar Problema</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del usuario y descripción del problema"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setReportOpen(false)} color="inherit">Cancelar</Button>
          <Button 
            onClick={() => { setReportOpen(false); alert('Reporte enviado correctamente'); }} 
            variant="contained" 
            sx={{ backgroundColor: '#e83a3a' }}
          >
            Enviar Reporte
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyDiners;
