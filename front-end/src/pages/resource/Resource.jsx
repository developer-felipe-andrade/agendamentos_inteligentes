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
import Alert from '../../components/UseAlert';
import { useEffect, useState } from 'react';
import Scaffold from '../../components/Scaffold';

const Resource = () => {
  const [dataValues, setDataValues] = useState([]);
  const { renderAlerts, addAlert } = Alert();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '' });

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

  const handleDelete = async (id) => {
    try {
      await resource.delete(id);
      getData();
      addAlert('Recurso excluído com sucesso!', 'success');
    } catch (error) {
      console.log(error);
      addAlert('Erro ao excluir o recurso', 'error');
    }
  };

  const handleOpen = async (id) => {
    if (id) {
      await getResourceById(id);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', type: '' }); // Limpar o formulário
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
  <Scaffold>

  <div className="h-screen w-screen overflow-hidden p-4">
    {renderAlerts()}

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
            <TableCell>ID</TableCell>
            <TableCell>Nome do Recurso</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataValues.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
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
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Tipo"
            name="type"
            fullWidth
            value={formData.type}
            onChange={handleChange}
          />
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
  </Scaffold>
  );
};


export default Resource;
