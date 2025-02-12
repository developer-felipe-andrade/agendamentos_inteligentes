import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, IconButton } from "@mui/material";
import { Done, Close } from "@mui/icons-material";
import dayjs from "dayjs";
import Alert from '../../components/UseAlert';
import reservation from "../../api/requests/reservation";
import user from '../../api/requests/user';
import Scaffold from "../../components/Scaffold";

const AproveSchedule = () => {
  const [reservations, setReservations] = useState([]);
  const { renderAlerts, addAlert } = Alert();

  const getPendingSchedules = async () => {
    try {
      const response = await user.me();
      console.log(response);

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

  return (
    <Scaffold>
      {renderAlerts()}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data/Hora Início</TableCell>
              <TableCell>Data/Hora Fim</TableCell>
              <TableCell>Nome da Sala</TableCell>
              <TableCell>Bloco</TableCell>
              <TableCell>Nome do Solicitante</TableCell>
              <TableCell>Email do Solicitante</TableCell>
              <TableCell>Observação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{dayjs(reservation.dtStart).format("DD/MM/YYYY HH:mm")}</TableCell>
                <TableCell>{dayjs(reservation.dtEnd).format("DD/MM/YYYY HH:mm")}</TableCell>
                <TableCell>{reservation.classroom.name}</TableCell>
                <TableCell>{reservation.classroom.block}</TableCell>
                <TableCell>{reservation.user.name}</TableCell>
                <TableCell>{reservation.user.login}</TableCell>
                <TableCell>{reservation.obs || "-"}</TableCell>
                <TableCell>
                  <IconButton
                  >
                    <Done />
                  </IconButton>
                  <IconButton
                  >
                    <Close />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scaffold>
  );
};

export default AproveSchedule;