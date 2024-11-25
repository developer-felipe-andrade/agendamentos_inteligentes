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
  Checkbox
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import classroom from '../../api/requests/classrooms'
import { useEffect, useState } from 'react';
import Alert from '../../components/UseAlert';


const Classroom = () => {
  const [dataValues, setDataValues] = useState([]);
  const { renderAlerts, addAlert } = Alert();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', qtdPlace: '', block: "", acessible: true, active: true, confirmation: true });

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
    setFormData(data);
  }

  const handleEdit = async (id) => {
    try {
      await classroom.update(formData, id);
      addAlert('Recurso atualizado com sucesso!', 'success');
    } catch (error) {
      addAlert('Erro ao atualizar o recurso', 'error');
    } finally {
      getData();
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    await classroom.delete(id);
    getData();
  };

  const handleOpen = async (id) => {
    if (id) {
      await getClassroomById(id);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', qtdPlace: '', block: "", acessible: true, active: true, confirmation: true });
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

  return (
    <div className="h-screen w-screen overflow-hidden mt-2">
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
            <TableCell>É acessível?</TableCell>
            <TableCell>Precisa de confirmação?</TableCell>
            <TableCell>Status</TableCell>
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
            label="É acessível?"
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
