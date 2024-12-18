import {
  Button,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import user from '../../api/requests/user'
import { useEffect, useState } from 'react';
import Alert from '../../components/UseAlert';
import { Close, Done } from '@mui/icons-material';
import { translateProfession, translateRole} from '../../helpers/translate'

const Users = () => {
  const { renderAlerts, addAlert } = Alert();
  const [dataValues, setDataValues] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = async (date) => {
    setOpen(true);
  };

  const getData = async () => {
    try {
      const { data } = await user.pendingUsers();
      
      setDataValues(data);
    } catch (error) {
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  const handleAprove = async (id) => {
      try {
        const data = {users: [id]}
        await user.release(data);

        addAlert('Usuário aprovado com sucesso');
      } catch (error) {
        addAlert('Erro ao aprovar o cadastro do usuário', 'error')
      } finally {
        getData();
      }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden mt-2">
      {renderAlerts()}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Papel dentro da faculdade</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataValues.map((row) => (
            <TableRow key={row.id}> 
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.login}</TableCell>
              <TableCell>{translateRole(row.role)}</TableCell>
              <TableCell>{translateProfession(row.profession)}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleAprove(row.id)}
                >
                  <Done />
                </IconButton>
                <IconButton
                  onClick={() => handleOpen()}
                >
                  <Close />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog>
        
      </Dialog>
    </div>
  );
};

export default Users;
