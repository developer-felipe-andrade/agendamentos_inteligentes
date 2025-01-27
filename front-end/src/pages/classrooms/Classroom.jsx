import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import classroom from '../../api/requests/classrooms'
import { useEffect, useState } from 'react';
import Alert from '../../components/UseAlert';
import ConfirmationModal from '../../components/ConfirmationModal';
import user from '../../api/requests/user';
import Scaffold from '../../components/Scaffold';


const Classroom = () => {
  const [dataValues, setDataValues] = useState([]);
  const { renderAlerts, addAlert } = Alert();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', qtdPlace: '', block: "", acessible: true, active: true, confirmation: true, idUser: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [users, setUsers] = useState([]);


  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedId(0);
  };

  const handleConfirm = async () => {
    try {
      await classroom.delete(selectedId);
      
      getData();
      handleCloseModal();
      addAlert('Sala excluída com sucesso.', 'success');
    } catch (error) {
      addAlert('Erro ao deletar a sala', 'error');
    }
  };

  const getData = async () => {
    try {
      const { data } = await classroom.getAll();
      
      setDataValues(data.content);
    } catch (error) {
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  const getClassroomById = async (id) => {
    const { data } = await classroom.findById(id);
    
    setFormData({
      name: data.name,
      qtdPlace: data.qtdPlace,
      block: data.block,
      acessible: data.acessible,
      active: data.active,
      confirmation: data.confirmation,
      idUser: data.responsible?.id
    });
  }

  const handleDelete = async (id) => {
    setModalOpen(true);
    setSelectedId(id);
  };

  const handleOpen = async (id) => {
    if (id) {
      await getClassroomById(id);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', qtdPlace: '', block: "", acessible: true, active: true, confirmation: true, idUser: "" });
  };  

  const handleSave = async () => {
    try {
      await classroom.create(formData);
      addAlert('Sala salva com sucesso!', 'success');
    } catch (error) {
      addAlert('Erro ao salvar a sala', 'error');
    } finally {
      getData();
      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (formData.confirmation) {
      const fetchData = async () => {
        try {
          const { data } = await user.responsibles();
          setUsers(data); 
        } catch (error) {
          console.error('Erro ao buscar dados da API:', error);
        }
      };
  
      fetchData();
    }
  }, [formData.confirmation]);

  return (
    <div className="h-screen w-screen overflow-hidden mt-2">
        <ConfirmationModal
          open={modalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          title="Excluir Sala"
          message="Você tem certeza que deseja excluir essa sala?"
        />
      <Scaffold>
        {renderAlerts()}
      
        <div className="flex justify-end mb-4">
          <Button
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
            onClick={() => handleOpen(null)}
          >
            Cadastrar
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome da Sala</TableCell>
              <TableCell>Bloco</TableCell>
              <TableCell>Capacidade</TableCell>
              <TableCell>É acessível para pessoas com modalidade reduzida?</TableCell>
              <TableCell>Precisa de confirmação?</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataValues.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.block}</TableCell>
                <TableCell>{row.qtdPlace}</TableCell>
                <TableCell>{row.acessible ? 'Sim' : 'Não'}</TableCell>
                <TableCell>{row.confirmation ? 'Sim' : 'Não'}</TableCell>
                <TableCell>{row.active ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell>{row.responsible?.name ?? 'Não necessário'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpen(row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scaffold>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Cadastrar Sala</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nome"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Quantidade"
            name="qtdPlace"
            fullWidth
            type="number"
            inputProps={{ min: 1 }}
            value={formData.qtdPlace}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Bloco"
            name="block"
            fullWidth
            value={formData.block}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="acessble"
                checked={formData.acessible}
                onChange={(e) =>
                  setFormData({ ...formData, acessible: e.target.checked })
                }
                color="primary"
              />
            }
            label="É acessível para pessoas com modalidade reduzida?"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                color="primary"
              />
            }
            label="Ativo"
          />
         <FormControlLabel
          control={
            <Checkbox
              name="confirmation"
              checked={formData.confirmation}
              onChange={(e) =>
                setFormData({ ...formData, confirmation: e.target.checked })
              }
              color="primary"
            />
          }
          label="Precisa de confirmação?"
        />
        {formData.confirmation && (
          <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="responsible-select-field">Selecione o responsável</InputLabel>
          <Select
            labelId="responsible-select-field"
            id="role-select"
            value={formData.idUser}
            onChange={(e) =>
              setFormData({ ...formData, idUser: e.target.value })
            }
            label="Selecione o responsável"
          >
            {
              users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Classroom;
