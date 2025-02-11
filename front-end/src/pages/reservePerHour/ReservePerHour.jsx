import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Grid, Chip } from '@mui/material';
import { DateTimePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Alert from '../../components/UseAlert';
import dayjs from 'dayjs';
import resource from '../../api/requests/resource';
import classroom from '../../api/requests/classrooms';
import { useNavigate } from 'react-router-dom';

const ReservePerHour = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
  
  const { renderAlerts, addAlert } = Alert();
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    dtStart: dayjs().format("YYYY-MM-DDTHH:mm"),
    dtEnd: dayjs().hour(new Date().getHours()).minute(new Date().getMinutes()).add(50, "minute").format("YYYY-MM-DDTHH:mm"),
    durationHours: 0,
    durationMinutes: 50,
    qtdPlace: '', 
    block: 'A', 
    idsResources: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      block: formData.block,
      qtdPlace: formData.qtdPlace || 0,
      dtStart: formData.dtStart,
      dtEnd: formData.dtEnd,
      idsResources: formData.idsResources || []
    }

    console.log(payload);
    
    const { data } = await classroom.findAvailableClassrooms(payload);
    if (data.length > 0) {
      navigate('/classrooms-avaliable', {
        state: {
          data: data
        }
      });
      setFormData({
        dtStart: dayjs().format("YYYY-MM-DDTHH:mm"),
        dtEnd: dayjs().hour(new Date().getHours()).minute(new Date().getMinutes()).add(50, "minute").format("YYYY-MM-DDTHH:mm"),
        durationHours: 0,
        durationMinutes: 50,
        qtdPlace: '', 
        block: 'A', 
        idsResources: []
      });
      setIsOpen(false);  
    } else {
      addAlert('Não foi encontrada nenhuma sala disponível nesse horário', 'error');
    }
  };

  const getResources = async () => {
    try {
      const { data } = await resource.getAll();
      setResources(data.content);  // Ajuste conforme necessário para o seu formato de resposta
    } catch (error) {
      console.log(error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  return (
    <>
      {renderAlerts()}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Agendar Reserva</DialogTitle>
        <DialogContent>
          <div className="flex gap-4 pt-3">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <DateTimePicker
                value={dayjs(formData.dtStart)} 
                label="Data"
                onChange={(newValue) => setFormData((prev) => ({ 
                  ...prev, 
                  dtStart: newValue.format("YYYY-MM-DDTHH:mm") 
                }))}
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <TimePicker
                label="Tempo de duração"
                value={dayjs().startOf('day').add(formData.durationHours || 0, 'hour').add(formData.durationMinutes || 50, 'minute')} 
                onChange={(newValue) => {
                  const newHours = newValue.hour();
                  const newMinutes = newValue.minute();
    
                  const updatedDtEnd = dayjs(formData.dtStart)
                    .add(newHours, 'hour')
                    .add(newMinutes, 'minute');
    
                  setFormData((prev) => ({
                    ...prev,
                    durationHours: newHours,
                    durationMinutes: newMinutes,
                    dtEnd: updatedDtEnd.format("YYYY-MM-DDTHH:mm"),
                  }));
                }}
              />
            </LocalizationProvider>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="Quantidade de lugares"
                type="number"
                fullWidth
                name="qtdPlace"
                required
                value={formData.qtdPlace || 0}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Bloco</InputLabel>
                <Select
                  label="Bloco"
                  required
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                >
                  <MenuItem value="A">Bloco A</MenuItem>
                  <MenuItem value="B">Bloco B</MenuItem>
                  <MenuItem value="C">Bloco C</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControl fullWidth margin="normal">
            <InputLabel>Recursos Necessários</InputLabel>
            <Select
              label="Recursos Necessários"
              multiple
              name="idsResources"
              value={formData.idsResources}
              onChange={handleChange}
              renderValue={(selected) => {
                const selectedResources = resources.filter(resource => selected.includes(resource.id));
                return (
                  <div className="flex gap-2">
                    {selectedResources.map((resource) => (
                      <Chip
                        key={resource.id}
                        label={`Nome: ${resource.name} - Tipo: ${resource.type}`}
                        color='primary'
                      />
                    ))}
                  </div>
                );
              }}
            >
              {resources.map((resource) => (
                <MenuItem key={resource.id} value={resource.id}>
                  <Checkbox checked={formData.idsResources.includes(resource.id)} />
                  <ListItemText primary={resource.name} secondary={`Tipo: ${resource.type}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ReservePerHour.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default ReservePerHour;
