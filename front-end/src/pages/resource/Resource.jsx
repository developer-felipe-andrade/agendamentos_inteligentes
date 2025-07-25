import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import resource from '../../api/requests/resource';
import { useAlert } from "../../components/AlertContext.jsx";
import { useEffect, useState } from 'react';
import Scaffold from '../../components/Scaffold';
import ConfirmationModal from '../../components/ConfirmationModal';

const Resource = () => {
  const [dataValues, setDataValues] = useState([]);
  const { addAlert } = useAlert();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);


  const getData = async () => {
    try {
      const { data } = await resource.getAll();
      
      setDataValues(data.content);
    } catch (error) {
      console.log(error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  const getResourceById = async (id) => {
    const { data } = await resource.findById(id);
    setFormData(data);
  }

  const handleConfirm = async () => {
    try {
      await resource.delete(selectedId);
      getData();
      addAlert('Recurso excluído com sucesso!', 'success');
    } catch (error) {
      console.log(error);
      addAlert('Erro ao excluir o recurso', 'error');
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    setModalOpen(true);
    setSelectedId(id);
  };

  const handleCloseModal = () => {
    setModalOpen(false)
  };

  const handleOpen = async (id) => {
    if (id) {
      await getResourceById(id);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', type: '' });
  };

  const handleSave = async () => {
    try {
      await resource.create(formData);
      addAlert('Recurso salvo com sucesso!', 'success');
    } catch (error) {
      console.log(error);
      addAlert('Erro ao salvar o recurso', 'error');
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

return (
  <div className="h-screen w-screen overflow-hidden">

  <ConfirmationModal
    open={modalOpen}
    onClose={handleCloseModal}
    onConfirm={handleConfirm}
    title="Excluir Recurso"
    message="Você tem certeza que deseja excluir esse recurso?"
  />

  <Scaffold>
      <div className="flex justify-end mb-4">
        <Button
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
          sx={{ backgroundColor: '#007bff' }}
          onClick={() => handleOpen(null)}
        >
          Cadastrar
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome do Recurso</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataValues.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(row.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Cadastrar Recurso</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nome do Recurso"
            name="name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Tipo"
            name="type"
            fullWidth
            required
            value={formData.type}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={formData.name === '' || formData.type === ''}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
     </Scaffold>
  </div>
  );
};


export default Resource;
