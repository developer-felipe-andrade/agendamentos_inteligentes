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
import User from '../../api/requests/user';
import Notifications from '../../api/requests/notifications';
import { useEffect, useState } from 'react';
import Alert from '../../components/UseAlert';
import { Close, Done } from '@mui/icons-material';
import { translateRole} from '../../helpers/translate';
import Scaffold from '../../components/Scaffold';
import emailConfig from '../../api/requests/email-config';


const Users = () => {
  const { renderAlerts, addAlert } = Alert();
  const [dataValues, setDataValues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [rejectionComment, setRejectionComment] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);

  const getData = async () => {
    try {
      const { data } = await User.pendingUsers();
      setDataValues(data);
    } catch (error) {
      console.log('error', error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  const handleAprove = async (id) => {
    try {
      const data = {users: [id]}
      await User.release(data);
      addAlert('Usuário aprovado com sucesso');
    } catch (error){
      console.log('error', error);
      addAlert('Erro ao aprovar o cadastro do usuário', 'error')
    } finally {
      getData();
    }
  }

  const handleOpenRejectModal = (user) => {
    setSelectedUserEmail(user.login);
    setSelectedUserId(user.id);
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
      await User.delete(selectedUserId);
      addAlert('Notificação enviada com sucesso');
    } catch (error) {
      console.log('error', error);
      addAlert('Erro ao rejeitar o cadastro do usuário', 'error');
    } finally {
      getData();
    }

    handleCloseModal();
  };

  const checkEmailConfig = async () => {
    try {
      const { data } = await emailConfig.exists();
      setOpenEmailDialog(!data); 
    } catch (error) {
      console.log(error);
      addAlert('Erro ao verificar a configuração de e-mail!', 'error');
    }
  };

  useEffect(() => {
    checkEmailConfig();
    getData();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {renderAlerts()}
      <Scaffold>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Perfil</TableCell>
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
                <TableCell>
                  <IconButton
                    onClick={() => handleAprove(row.id)}
                  >
                    <Done />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenRejectModal(row)}
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

        {openEmailDialog && (
        <Dialog open={openEmailDialog}>
          <DialogTitle>Configuração de E-mail</DialogTitle>
          <DialogContent>
            <p>O e-mail para envio de notificações não está configurado.</p>
            <p>Por favor, clique no menu para configurar o e-mail para envio.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEmailDialog(false)} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}
      </Scaffold>
    </div>
  );
};

export default Users;
