import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, Dialog, DialogActions, DialogContent,
  DialogTitle, Button, useMediaQuery, useTheme, Box, Typography, IconButton
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import Scaffold from '../../components/Scaffold';
import { Check, ViewList } from '@mui/icons-material';
import ScheduleDialog from '../calendar/ScheduleDialog';

const ClassroomsAvaliable = () => {
  const location = useLocation();
  const classrooms = location.state.data || [];
  const formData = location.state.formData || [];

  const [payload, setPayload] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [resources, setResources] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleViewResources = (resourcesList) => {
    setResources(resourcesList);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenScheduleDialog = (roomId) => {
    setSelectedRoom(roomId);
    setPayload({
      dtStart: formData.dtStart,
      dtEnd: formData.dtEnd
    });
    setOpenScheduleDialog(true);
  };

  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
    setSelectedRoom("");
  };

  return (
    <Scaffold>
      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {classrooms.map((row) => (
            <Paper key={row.id} sx={{ padding: 2 }}>
              <Typography variant="subtitle1"><strong>Nome:</strong> {row.name}</Typography>
              <Typography><strong>Capacidade:</strong> {row.qtdPlace}</Typography>
              <Typography><strong>Bloco:</strong> {row.block}</Typography>
              <Typography><strong>Acessível:</strong> <Checkbox checked={row.isAccessible} /></Typography>
              <Typography><strong>Ativo:</strong> <Checkbox checked={row.active}/></Typography>
              <Box mt={1} display="flex" gap={2}>
                <IconButton onClick={() => handleViewResources(row.resources)} title="Ver Recursos">
                  <ViewList sx={{ color: 'primary.main' }} />
                </IconButton>
                <IconButton onClick={() => handleOpenScheduleDialog(row.id)} title="Selecionar sala">
                  <Check sx={{ color: 'primary.main' }} />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ '& td, & th': { textAlign: 'center' } }}>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Capacidade</TableCell>
                <TableCell>Bloco</TableCell>
                <TableCell>Acessível</TableCell>
                <TableCell>Ativo</TableCell>
                <TableCell>Recursos</TableCell>
                <TableCell>Selecionar sala para agendamento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classrooms.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.qtdPlace}</TableCell>
                  <TableCell>{row.block}</TableCell>
                  <TableCell>
                    <Checkbox checked={row.isAccessible} disabled />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={row.active} disabled />
                  </TableCell>
                  <TableCell>
                    <ViewList
                      onClick={() => handleViewResources(row.resources)}
                      sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Check
                      onClick={() => handleOpenScheduleDialog(row.id)}
                      sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {openScheduleDialog && (
        <ScheduleDialog
          open={openScheduleDialog}
          onClose={handleCloseScheduleDialog}
          passDataToSend={payload}
          selectedRoom={selectedRoom}
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Lista de Recursos</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell>{resource.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Scaffold>
  );
};

export default ClassroomsAvaliable;