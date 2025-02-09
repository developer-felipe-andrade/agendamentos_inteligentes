import PropTypes from 'prop-types';
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid2 } from "@mui/material";
import { LocalizationProvider, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Alert from '../../components/UseAlert';
import reservation from '../../api/requests/reservation';
import 'dayjs/locale/pt-br';

ScheduleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selectedRoom: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedDate: PropTypes.string.isRequired
};

export default function ScheduleDialog ({ open, selectedRoom, onClose, selectedDate }) {
  const { renderAlerts, addAlert } = Alert();
  const [formData, setFormData] = useState({
    dtStart: dayjs(selectedDate).hour(new Date().getHours()).minute(new Date().getMinutes()).toISOString(),
    dtEnd: dayjs().add(50, "minute").toISOString(),
    status: "PENDING",
    obs: "", 
    classroomId: selectedRoom,
    notifications: [],
  });
  const [fields, setFields] = useState([]);
  
  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        notifications: [...fields]
      }

      await reservation.register(payload);
      addAlert("Agendamento criado com sucesso!", "success");
      handleClose();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      addAlert("Erro ao criar o agendamento!", "error");
    }
  };

  const addField = () => {
    setFields([...fields, { form: "", anticipationTime: dayjs().hour(0).minute(30) }]);
  };

  const handleClose = () => {
    onClose();
    setFormData({
      dtStart: dayjs(selectedDate).hour(new Date().getHours()).minute(new Date().getMinutes()).toISOString(),
      dtEnd: dayjs(selectedDate).add(50, "minute").toISOString(),
      status: "PENDING",
      obs: "", 
      classroomId: selectedRoom,
      notifications: [],
    });

    setFields([]);
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      {renderAlerts()}
      <DialogTitle>Agendar</DialogTitle>
      <DialogContent>
        <div className="flex gap-4 pt-3">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DateTimePicker
              value={dayjs(formData.dtStart)} // Atualiza a data de início
              label="Data"
              onChange={(newValue) => setFormData((prev) => ({ ...prev, dtStart: newValue.toISOString() }))}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <TimePicker
              label="Tempo de duração"
              value={dayjs().startOf('day').add(formData.durationHours || 0, 'hour').add(formData.durationMinutes || 50, 'minute')} // Define valor inicial considerando horas e minutos
              onChange={(newValue) => {
                const newHours = newValue.hour(); // Pega as horas selecionadas
                const newMinutes = newValue.minute(); // Pega os minutos selecionados
                const updatedDtEnd = dayjs(formData.dtStart).add(newHours, 'hour').add(newMinutes, 'minute'); // Soma ao dtStart
                setFormData((prev) => ({
                  ...prev,
                  durationHours: newHours, // Armazena as horas selecionadas
                  durationMinutes: newMinutes, // Armazena os minutos selecionados
                  dtEnd: updatedDtEnd.toISOString(),
                }));
              }}
            />
          </LocalizationProvider>
        </div>

        <div className="pt-2">
          <TextField
            label="Observação"
            name="obs"
            fullWidth
            value={formData.obs} // Vinculado ao campo de observação
            onChange={(e) => setFormData((prev) => ({ ...prev, obs: e.target.value }))}
            multiline
            rows={4}
          />
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="py-2">
            <Button
              disabled={fields.length > 1}
              variant="contained"
              onClick={addField}
            >
              Adicionar Notificação
            </Button>
            
            <Grid2 container className='py-3'>
              {fields.map((field, index) => (
                <Grid2 xs={12} key={index} container spacing={2}>
                  <Grid2 xs={6}>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Forma</InputLabel>
                      <Select
                        id={`notification-type-${index}`}
                        label="Forma"
                        value={field.form}
                        onChange={(e) => {
                          const updatedFields = [...fields];
                          updatedFields[index].form = e.target.value;
                          setFields(updatedFields);
                        }}
                      >
                        <MenuItem value="EMAIL">E-mail</MenuItem>
                        <MenuItem value="SMS">SMS</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid2>
                  <Grid2 xs={6}>
                    <TimePicker
                      label="Tempo de antecipação."
                      ampm={false}
                      format="HH:mm"
                      value={field.anticipationTime}
                      onChange={(newValue) => {
                        const updatedFields = [...fields];
                        updatedFields[index].anticipationTime = newValue;
                        setFields(updatedFields);
                      }}
                    />
                  </Grid2>
                </Grid2>
              ))}
            </Grid2>
          </div>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};