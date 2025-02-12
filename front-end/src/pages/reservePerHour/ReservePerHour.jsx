import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Chip, FormControlLabel, Grid } from '@mui/material';
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
    idsResources: [],
    isAccessible: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      qtdPlace: formData.qtdPlace || 0,
      dtStart: formData.dtStart,
      dtEnd: formData.dtEnd,
      idsResources: formData.idsResources || [],
      isAccessible: formData.isAccessible  
    }
    
    const { data } = await classroom.findAvailableClassrooms(payload);
    if (data.length > 0) {
      navigate('/classrooms-avaliable', {
        state: {
          data: data,
          formData: formData
        }
      });
      setFormData({
        dtStart: dayjs().format("YYYY-MM-DDTHH:mm"),
        dtEnd: dayjs().hour(new Date().getHours()).minute(new Date().getMinutes()).add(50, "minute").format("YYYY-MM-DDTHH:mm"),
        durationHours: 0,
        durationMinutes: 50,
        qtdPlace: '',
        idsResources: [],
        isAccessible: false
      });
      setIsOpen(false);  
    } else {
      addAlert('Não foi encontrada nenhuma sala disponível nesse horário', 'error');
    }
  };

  const getResources = async () => {
    try {
      const { data } = await resource.getAll();
      setResources(data.content); 
    } catch (error) {
      console.log(error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  const handleClose = () => {
    setFormData({
      dtStart: dayjs().format("YYYY-MM-DDTHH:mm"),
      dtEnd: dayjs().hour(new Date().getHours()).minute(new Date().getMinutes()).add(50, "minute").format("YYYY-MM-DDTHH:mm"),
      durationHours: 0,
      durationMinutes: 50,
      qtdPlace: '',
      idsResources: [],
      isAccessible: false
    });
    
    setIsOpen(false);
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

          <Grid container spacing={2} pt={3}>
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
              <FormControlLabel
                control={
                  <Checkbox
                    name="isAccessible"
                    checked={formData.isAccessible}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="É acessível para pessoas com modalidade reduzida?"
              />
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
                        color="primary"
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
          <Button onClick={handleClose} color="primary">
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
