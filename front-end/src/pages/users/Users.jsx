import {
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import user from '../../api/requests/user';
import Notifications from '../../api/requests/notifications';
import { useEffect, useState } from 'react';
import Alert from '../../components/UseAlert';
import { Close, Done } from '@mui/icons-material';
import { translateProfession, translateRole} from '../../helpers/translate';

const Users = () => {
  const { renderAlerts, addAlert } = Alert();
  const [dataValues, setDataValues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [rejectionComment, setRejectionComment] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  const getData = async () => {
    try {
      const { data } = await user.pendingUsers();
      setDataValues(data);
    } catch (error) {
      console.log('error', error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  const handleAprove = async (id) => {
    try {
      const data = {users: [id]}
      await user.release(data);
      addAlert('Usuário aprovado com sucesso');
    } catch (error){
      console.log('error', error);
      addAlert('Erro ao aprovar o cadastro do usuário', 'error')
    } finally {
      getData();
    }
  }

  const handleOpenRejectModal = (email) => {
    setSelectedUserEmail(email);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setRejectionComment('');
    setSelectedUserEmail(null);
  };

  const handleReject = async () => {
    const data = {
      to: selectedUserEmail,
      body: rejectionComment
    };

    try {
      await Notifications.sendEmail(data);
      addAlert('Notificação enviada com sucesso');
    } catch (error) {
      console.log('error', error);
      addAlert('Erro ao rejeitar o cadastro do usuário', 'error');
    }

    handleCloseModal();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden mt-2">
      {renderAlerts()}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Papel dentro da faculdade</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataValues.map((row) => (
            <TableRow key={row.id}> 
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.login}</TableCell>
              <TableCell>{row.phoneNumber}</TableCell>
              <TableCell>{translateRole(row.role)}</TableCell>
              <TableCell>{translateProfession(row.profession)}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleAprove(row.id)}
                >
                  <Done />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenRejectModal(row.login)}
                >
                  <Close />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>Rejeitar Usuário</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo da rejeição"
            fullWidth
            multiline
            rows={4}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleReject} color="primary" variant="contained" disabled={!rejectionComment}>
            Enviar notificação
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
