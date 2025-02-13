import { Fragment, useEffect, useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableRow, 
  TableContainer, Paper, IconButton, Checkbox, Button, 
  Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  CircularProgress
} from "@mui/material";
import { Done, Close as CloseIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import Alert from '../../components/UseAlert';
import reservation from "../../api/requests/reservation";
import user from '../../api/requests/user';
import Scaffold from "../../components/Scaffold";

const AproveSchedule = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservations, setSelectedReservations] = useState({});
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { renderAlerts, addAlert } = Alert();

  const getPendingSchedules = async () => {
    try {
      const response = await user.me();
      const { data } = await reservation.findByResponsible(response.data.id);
      setReservations(data.content);
    } catch (error) {
      console.log(error);
      addAlert('Houve um erro ao buscar as reservas pendentes', 'error');
    }
  };

  useEffect(() => {
    getPendingSchedules();
  }, []);

  const groupedByEmailReservations = reservations.reduce((acc, reservation) => {
    const userEmail = reservation.user.login; // Usando o email do usuário
    if (!acc[userEmail]) {
      acc[userEmail] = [];
    }
    acc[userEmail].push(reservation);
    return acc;
  }, {});

  const isUserSelected = (userEmail) => 
    groupedByEmailReservations[userEmail]?.every((res) => selectedReservations[userEmail]?.includes(res.id));

  const handleUserSelect = (userEmail) => {
    const allSelected = isUserSelected(userEmail);
    const newSelection = { ...selectedReservations };

    groupedByEmailReservations[userEmail].forEach((res) => {
      if (!newSelection[userEmail]) {
        newSelection[userEmail] = [];
      }
      if (allSelected) {
        newSelection[userEmail] = newSelection[userEmail].filter((id) => id !== res.id);
      } else {
        newSelection[userEmail].push(res.id);
      }
    });

    setSelectedReservations(newSelection);
  };

  const handleReservationSelect = (reservationId, userEmail) => {
    setSelectedReservations((prev) => {
      const newSelection = { ...prev };
      if (!newSelection[userEmail]) {
        newSelection[userEmail] = [];
      }
      if (newSelection[userEmail].includes(reservationId)) {
        newSelection[userEmail] = newSelection[userEmail].filter((id) => id !== reservationId);
      } else {
        newSelection[userEmail].push(reservationId);
      }
      return newSelection;
    });
  };

  const handleReject = () => {
    setOpenRejectDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenRejectDialog(false);
    setRejectionMessage("");
  };

  const handleSendRejection = async () => {
    setIsLoading(true);
    try {
      const payload = Object.keys(selectedReservations).flatMap((userEmail) => {
        const reservationIds = selectedReservations[userEmail];

        return [{ userEmail, reservationIds, message: rejectionMessage }];
      });

      await reservation.reject(payload);
      addAlert('Reserva rejeitada e mensagem enviada!', 'success');
    } catch (error) {
      console.log(error);
      addAlert('houve um erro ao rejeitar a reserva', 'error');
    } finally {
      setIsLoading(false);
      setSelectedReservations([]);
      setOpenRejectDialog(false);
      setRejectionMessage("");
      getPendingSchedules();
    }
  };

  const handleAprove = async () => {
    try {
      const payload = Object.values(selectedReservations).flat()

      await reservation.approve(payload);
      addAlert("Reservas aprovadas", "success");
    } catch(error) {
      console.log(error);
      addAlert("Houve um erro ao aprovar as reservas", "error");    
    } finally {
      setSelectedReservations([]);
      getPendingSchedules();
    }
  }

  const handleOpenRejectDialogFromIcon = (reservation) => {
    const userEmail = reservation.user.login;
    setSelectedReservations({ [userEmail]: [reservation.id] });
    setOpenRejectDialog(true);
  };

  const handleApproveFromIcon = async (r) => {
    try {
      const userEmail = r.user.login;
      setSelectedReservations({[userEmail]: [r.id] });
  
      await reservation.approve([String(r.id)] );  
      addAlert("Reserva aprovada", "success");
    } catch (error) {
      console.log(error);
      addAlert("Houve um erro ao aprovar a reserva", "error");    
    } finally {
      setSelectedReservations([]);
      getPendingSchedules();
    }
  };
  
  return (
    <Scaffold>
      {renderAlerts()}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Reservas Pendentes ({Object.values(selectedReservations).flat().length} selecionado{Object.values(selectedReservations).flat().length !== 1 ? "s" : ""})
        </Typography>
        <Box>
          <Button 
            color="black" 
            disabled={Object.values(selectedReservations).flat().length === 0}
            onClick={handleReject}
          >
            <span>Rejeitar</span>
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            disabled={Object.values(selectedReservations).flat().length === 0} 
            sx={{ mr: 1 }}
            onClick={handleAprove}
          >
            <span>Aprovar</span>
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Selecionar</TableCell>
              <TableCell>Data/Hora Início</TableCell>
              <TableCell>Data/Hora Fim</TableCell>
              <TableCell>Bloco</TableCell>
              <TableCell>Nome do Solicitante</TableCell>
              <TableCell>Email do Solicitante</TableCell>
              <TableCell>Observação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedByEmailReservations).map(([userEmail, userReservations]) => (
              <Fragment key={userEmail}>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <Checkbox 
                      checked={isUserSelected(userEmail) || false} // Sempre um valor booleano
                      indeterminate={userReservations.some((res) => selectedReservations[userEmail]?.includes(res.id)) && 
                        !isUserSelected(userEmail)}
                      onChange={() => handleUserSelect(userEmail)}
                    />
                  </TableCell>
                  <TableCell colSpan={7} sx={{ fontWeight: "bold" }}>{userEmail}</TableCell>
                </TableRow>

                {userReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedReservations[userEmail]?.includes(reservation.id) || false} // Sempre um valor booleano
                        onChange={() => handleReservationSelect(reservation.id, userEmail)}
                      />
                    </TableCell>
                    <TableCell>{dayjs(reservation.dtStart).format("DD/MM/YYYY HH:mm")}</TableCell>
                    <TableCell>{dayjs(reservation.dtEnd).format("DD/MM/YYYY HH:mm")}</TableCell>
                    <TableCell>{reservation.classroom.block}</TableCell>
                    <TableCell>{reservation.user.name}</TableCell>
                    <TableCell>{reservation.user.login}</TableCell>
                    <TableCell>{reservation.obs || "-"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenRejectDialogFromIcon(reservation)}>
                        <CloseIcon />
                      </IconButton>
                      <IconButton onClick={() => handleApproveFromIcon(reservation)}>
                        <Done />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openRejectDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Rejeitar Reserva</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mensagem de Rejeição"
            multiline
            fullWidth
            rows={4}
            value={rejectionMessage}
            onChange={(e) => setRejectionMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSendRejection}
            variant="contained"
            color="primary"
            disabled={isLoading} 
            startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null} 
          >
            {isLoading ? "Aguarde..." : "Enviar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Scaffold>
  );
};

export default AproveSchedule;
