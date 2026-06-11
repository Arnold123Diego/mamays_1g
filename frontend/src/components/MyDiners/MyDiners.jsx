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
import VisibilityIcon from '@mui/icons-material/Visibility';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyDiners = ({ onBack }) => {
  const [diners, setDiners] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [reservationToDiscard, setReservationToDiscard] = useState(null);
  const [selectedDiner, setSelectedDiner] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
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

  const handleOpenDiscardDialog = (id) => {
    setReservationToDiscard(id);
    setDiscardDialogOpen(true);
  };

  const handleViewProfile = (dinerUser) => {
    setSelectedDiner(dinerUser);
    setProfileOpen(true);
  };

  const handleConfirmDiscard = () => {
    if (reservationToDiscard) {
      updateReservation(reservationToDiscard, { status: 'cancelled' });
      setDiscardDialogOpen(false);
      setReservationToDiscard(null);
    }
  };

  const activeDiners = diners.filter(d => d.status !== 'cancelled');

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
              {activeDiners.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center">No hay reservas activas aún.</TableCell></TableRow>
              ) : (
                activeDiners.map((diner) => (
                  <TableRow key={diner._id} hover>
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
                              onClick={() => togglePaid(diner._id, diner.paymentStatus, !!diner.transactionId)}
                              sx={{ cursor: 'pointer' }}
                            />
                            {diner.paymentStatus === 'paid' && (
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
                        checked={diner.status === 'completed'} 
                        onChange={() => toggleAttended(diner._id, diner.status)}
                        sx={{ color: '#e83a3a', '&.Mui-checked': { color: '#e83a3a' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton onClick={() => handleViewProfile(diner.user)} color="primary" title="Ver Perfil del Comensal">
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDiscardDialog(diner._id)} color="error" title="Descartar Reserva">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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

      {/* Diálogo de Confirmación para Descartar */}
      <Dialog open={discardDialogOpen} onClose={() => setDiscardDialogOpen(false)}>
        <DialogTitle sx={{ color: '#e83a3a', fontWeight: 'bold' }}>
          ¿Confirmar descarte de pedido?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Al descartar este pedido, las porciones correspondientes se devolverán automáticamente al stock disponible de tu plato.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer y el comensal ya no aparecerá en tu lista.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDiscardDialogOpen(false)} color="inherit">
            No, Mantener
          </Button>
          <Button 
            onClick={handleConfirmDiscard} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: '8px' }}
          >
            Sí, Descartar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Detalle del Comensal */}
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Avatar 
            src={selectedDiner?.avatar} 
            sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '3px solid #e83a3a' }}
          >
            {selectedDiner?.nombre?.[0]}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {selectedDiner?.nombre} {selectedDiner?.apellido}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: '#e83a3a', fontWeight: 'bold' }}>
            📞 {selectedDiner?.telefono || 'Sin teléfono'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>🥗 Dieta y Estilo:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={selectedDiner?.dietaryPrefs || 'No especificado'} size="small" variant="outlined" />
            <Chip label={selectedDiner?.estiloVida || 'No especificado'} size="small" variant="outlined" />
          </Box>

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#d32f2f' }}>⚠️ Alergias:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {selectedDiner?.alergias?.length > 0 ? (
              selectedDiner.alergias.map((a, i) => <Chip key={i} label={a} size="small" color="error" />)
            ) : (
              <Typography variant="caption">Ninguna reportada</Typography>
            )}
          </Box>

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>⭐ Favoritos:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {selectedDiner?.platosPreferidos?.map((p, i) => <Chip key={i} label={p} size="small" color="primary" variant="outlined" />)}
            {selectedDiner?.categoriasFavoritas?.map((c, i) => <Chip key={i} label={c} size="small" color="secondary" variant="outlined" />)}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button fullWidth onClick={() => setProfileOpen(false)} variant="contained" sx={{ bgcolor: '#e83a3a' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

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
