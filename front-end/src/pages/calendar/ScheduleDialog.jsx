import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { LocalizationProvider, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import Alert from '../../components/UseAlert';
import reservation from '../../api/requests/reservation';
import 'dayjs/locale/pt-br';

ScheduleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selectedRoom: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  selectedDate: PropTypes.string,
  selectedSchedule: PropTypes.string,
  passDataToSend: PropTypes.object
};

export default function ScheduleDialog ({ open, selectedRoom, onClose, selectedDate, selectedSchedule, passDataToSend }) {
  const navigate = useNavigate();
  
  const { renderAlerts, addAlert } = Alert();
  const [formData, setFormData] = useState({
    title: "",
    dtStart: passDataToSend?.dtStart ? dayjs(passDataToSend?.dtStart).format("YYYY-MM-DDTHH:mm") : dayjs(selectedDate).hour(new Date().getHours()).minute(new Date().getMinutes()).format("YYYY-MM-DDTHH:mm"),
    dtEnd: passDataToSend?.dtStart ? dayjs(passDataToSend?.dtEnd).format("YYYY-MM-DDTHH:mm") : dayjs(selectedDate).hour(new Date().getHours()).minute(new Date().getMinutes()).add(50, "minute").format("YYYY-MM-DDTHH:mm"),
    obs: "", 
    classroomId: selectedRoom,
    notifications: []
  });
  
  const [fields, setFields] = useState([{ form: "EMAIL", anticipationTime: dayjs().hour(0).minute(30) }]);
  const [typeRecurrence, setTypeRecurrence] = useState('none');
  const [timeRecurrence, setTimeRecurrence] = useState(0);

  const handleSave = async () => {
    try {
      let payload = {
        ...formData,
        notifications: [...fields]
      }

      if (typeRecurrence !== 'none') {
        payload.recurrence = true;
        payload.typeRecurrence = typeRecurrence;
        payload.timeRecurrence = timeRecurrence;
      }

      if (!selectedSchedule) {
        await reservation.register(payload);
        addAlert("Agendamento criado com sucesso!", "success");
      } else {
        payload.id = selectedSchedule;
        await reservation.update(selectedSchedule, payload);
        addAlert("Agendamento criado com sucesso!", "success");
      }
      handleClose();
      navigate('/reserve');
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
      title: "",
      dtStart: passDataToSend?.dtStart ? dayjs(passDataToSend?.dtStart).format("YYYY-MM-DDTHH:mm") : dayjs(selectedDate).hour(new Date().getHours()).minute(new Date().getMinutes()).format("YYYY-MM-DDTHH:mm"),
      dtEnd: passDataToSend?.dtStart ? dayjs(passDataToSend?.dtEnd).format("YYYY-MM-DDTHH:mm") : dayjs(selectedDate).hour(new Date().getHours()).minute(new Date().getMinutes()).add(50, "minute").format("YYYY-MM-DDTHH:mm"),
      obs: "", 
      classroomId: selectedRoom,
      notifications: [],
      durationHours: 0,
      durationMinutes: 50
    });
    
    setFields([{ form: "EMAIL", anticipationTime: dayjs().hour(0).minute(30) }]);
  }

  const getSchedule = async () => {
    try {
      const { data } = await reservation.findById(selectedSchedule);
      setFormData({
        title: data.title,
        dtStart: dayjs(data.dtStart).format("YYYY-MM-DDTHH:mm"),
        dtEnd: dayjs(data.dtEnd).format("YYYY-MM-DDTHH:mm"),
        obs: data.obs, 
        classroomId: data.classroom.id,
        notifications: data.notifications
      });
    } catch (error) {
      console.log(error);
      addAlert('Erro ao buscar os dados do agendamento', 'error');
    }
  }; 

  const handleDelete = async () => {
    try {
      await reservation.delete(selectedSchedule);
      addAlert("Agendamento excluído com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      addAlert("Erro ao excluir o agendamento!", "error");
    } finally {
      handleClose();
    }
  };

  const isFormValid = formData.title.trim() !== "" && formData.dtStart && formData.dtEnd && fields.every(field => field.anticipationTime);

  useEffect(() => {
    if (open && selectedSchedule) {
      console.log('cheguei');
      getSchedule();
    }
  }, [])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      {renderAlerts()}
      <DialogTitle>{passDataToSend ? '' : 'Agendar'}</DialogTitle>
      <DialogContent>
        <div className="flex gap-4 pt-3">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DateTimePicker
              required
              value={dayjs(formData.dtStart)}
              label="Data"
              onChange={(newValue) => {
                const dtStart = newValue.format("YYYY-MM-DDTHH:mm");
                const dtEnd = dayjs(dtStart)
                  .add(formData.durationHours || 0, 'hour')
                  .add(formData.durationMinutes ?? 50, 'minute')
                  .format("YYYY-MM-DDTHH:mm");

                setFormData((prev) => ({
                  ...prev,
                  dtStart,
                  dtEnd,
                }));
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <TimePicker
              required
              label="Tempo de duração"
              value={dayjs(formData.dtStart).startOf('day').add(formData.durationHours || 0, 'hour').add(formData.durationMinutes ?? 50, 'minute')}
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

        <div className="pt-2">
          <TextField
            required
            label="Título"
            name="title"
            fullWidth
            value={formData.title || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="pt-2">
          <TextField
            label="Observação"
            name="obs"
            fullWidth
            value={formData.obs}
            onChange={(e) => setFormData((prev) => ({ ...prev, obs: e.target.value }))}
            multiline
            rows={4}
          />
        </div>

        {
          !selectedSchedule && (
            <div className="flex gap-4 pt-3">
              <FormControl fullWidth>
                <InputLabel>Recorrência</InputLabel>
                <Select
                  label="Recorrência"
                  value={typeRecurrence}
                  onChange={(e) => setTypeRecurrence(e.target.value)}
                >
                  <MenuItem value="none">Sem recorrência</MenuItem>
                  <MenuItem value="ONLYDAY">Toda {dayjs(formData.dtStart).locale('pt-br').format('dddd')}</MenuItem>
                  <MenuItem value="MONDAYTOFRIDAY">Segunda a Sexta</MenuItem>
                  <MenuItem value="ALLDAY">Todos os dias</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Quantidade de repetições"
                type="number"
                value={timeRecurrence}
                onChange={(e) => setTimeRecurrence(e.target.value)}
                disabled={typeRecurrence === 'none'}
                fullWidth
              />
            </div>
          )
        }
      
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="py-2">
            <Button
              disabled={fields.length > 0}
              variant="contained"
              onClick={addField}
            >
              Adicionar Notificação
            </Button>
            
            <div className="grid grid-cols-2 gap-4 pt-3">
              {fields.map((field, index) => (
                <React.Fragment key={index}>
                  <FormControl fullWidth>
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
                    </Select>
                  </FormControl>

                  <TimePicker
                    required
                    label="Tempo de antecipação."
                    ampm={false}
                    format="HH:mm"
                    value={field.anticipationTime || dayjs().hour(0).minute(0)}
                    onChange={(newValue) => {
                      const updatedFields = [...fields];
                      updatedFields[index].anticipationTime = newValue;
                      setFields(updatedFields);
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </React.Fragment>
              ))}
            </div>

          </div>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        {selectedSchedule && (
          <Button onClick={handleDelete} variant="contained" color="error" style={{ marginRight: "auto" }}>
            Excluir
          </Button>
        )}
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!isFormValid}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};