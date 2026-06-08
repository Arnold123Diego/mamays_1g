import React, { useState, useEffect, useCallback } from 'react';
import './MyDiners.scss';
import { 
  Box, Typography, Container, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Avatar, 
  Chip, Checkbox, Button, TextField, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyDiners = ({ onBack }) => {
  const [diners, setDiners] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchReservations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/reservations/cook/${user._id}`);
      const data = await res.json();
      setDiners(data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  const updateReservation = async (id, updateData) => {
    try {
      const res = await fetch(`${API_URL}/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        fetchReservations(); // Recargar lista
      }
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  const toggleAttended = (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'confirmed' : 'completed';
    updateReservation(id, { status: newStatus });
  };

  const togglePaid = (id, currentPaymentStatus, hasTransactionId) => {
    let newPaymentStatus;
    if (currentPaymentStatus === 'paid') {
      newPaymentStatus = hasTransactionId ? 'pending_verification' : 'unpaid';
    } else {
      newPaymentStatus = 'paid';
    }
    updateReservation(id, { paymentStatus: newPaymentStatus });
  };

  const handleDiscard = (id) => {
    if (window.confirm('¿Estás seguro de descartar esta reserva? Las porciones se devolverán automáticamente al stock del plato.')) {
      updateReservation(id, { status: 'cancelled' });
    }
  };

  return (
    <Container maxWidth="lg" className="my-diners-container">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: '15px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#e83a3a', fontWeight: 'bold' }}>
            Mis Comensales
          </Typography>
          <IconButton onClick={fetchReservations} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Usuario</TableCell>
                <TableCell>Plato Reservado</TableCell>
                <TableCell>Cant.</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell align="center">¿Pagó?</TableCell>
                <TableCell>Hora Reserva</TableCell>
                <TableCell align="center">¿Asistió?</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diners.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center">No hay reservas aún.</TableCell></TableRow>
              ) : (
                diners.map((diner) => (
                  <TableRow key={diner._id} hover sx={{ opacity: diner.status === 'cancelled' ? 0.6 : 1, bgcolor: diner.status === 'cancelled' ? '#fff5f5' : 'transparent' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={diner.user?.avatar} alt={diner.user?.nombre}>{diner.user?.nombre?.[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>{diner.user?.nombre}</Typography>
                          <Typography variant="caption" color="textSecondary">{diner.user?.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{diner.dish?.nombre}</TableCell>
                    <TableCell>x{diner.quantity}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{diner.paymentMethod}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        {diner.paymentStatus === 'pending_verification' ? (
                          <>
                            <Chip 
                              label="Verificar Pago" 
                              color="info" 
                              size="small" 
                              disabled={diner.status === 'cancelled'}
                              onClick={() => togglePaid(diner._id, diner.paymentStatus, !!diner.transactionId)}
                              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#0052cc' }}>
                              ID: {diner.transactionId}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Chip 
                              icon={diner.paymentStatus === 'paid' ? <CheckCircleIcon /> : <CancelIcon />} 
                              label={diner.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'} 
                              color={diner.paymentStatus === 'paid' ? 'success' : 'warning'} 
                              size="small" 
                              variant="outlined" 
                              disabled={diner.status === 'cancelled'}
                              onClick={() => togglePaid(diner._id, diner.paymentStatus, !!diner.transactionId)}
                              sx={{ cursor: 'pointer' }}
                            />
                            {diner.paymentStatus === 'paid' && diner.status !== 'cancelled' && (
                              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '10px' }}>
                                (Clic para revertir)
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{diner.reservationTime || '---'}</TableCell>
                    <TableCell align="center">
                      <Checkbox 
                        disabled={diner.status === 'cancelled'}
                        checked={diner.status === 'completed'} 
                        onChange={() => toggleAttended(diner._id, diner.status)}
                        sx={{ color: '#e83a3a', '&.Mui-checked': { color: '#e83a3a' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {diner.status !== 'cancelled' ? (
                        <IconButton onClick={() => handleDiscard(diner._id)} color="error" title="Descartar Reserva">
                          <DeleteIcon />
                        </IconButton>
                      ) : (
                        <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>DESCARTADA</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
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
