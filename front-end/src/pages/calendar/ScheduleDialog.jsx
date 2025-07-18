import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material";
import { LocalizationProvider, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import { useAlert } from "../../components/AlertContext.jsx";
import reservation from '../../api/requests/reservation';
import user from '../../api/requests/user';
import 'dayjs/locale/pt-br';
import { Close } from '@mui/icons-material';

ScheduleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selectedRoom: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  selectedDate: PropTypes.string,
  selectedSchedule: PropTypes.string,
  passDataToSend: PropTypes.object
};

export default function ScheduleDialog ({ open, selectedRoom, onClose, selectedDate, selectedSchedule, passDataToSend, isOffline }) {
  const navigate = useNavigate();
  
  const { addAlert } = useAlert();
  const [formData, setFormData] = useState({
    title: "",
    dtStart: passDataToSend?.dtStart ? dayjs(passDataToSend?.dtStart).format("YYYY-MM-DDTHH:mm") : dayjs(selectedDate).hour(new Date().getHours()).minute(new Date().getMinutes()).format("YYYY-MM-DDTHH:mm"),
    dtEnd: passDataToSend?.dtStart ? dayjs(passDataToSend?.dtEnd).format("YYYY-MM-DDTHH:mm") : dayjs(selectedDate).hour(new Date().getHours()).minute(new Date().getMinutes()).add(50, "minute").format("YYYY-MM-DDTHH:mm"),
    obs: "", 
    classroomId: selectedRoom,
    notifications: []
  });
  
  const [fields, setFields] = useState([{ form: "EMAIL", anticipationTime: dayjs(formData.dtStart).subtract(1, 'day')}]);
  const [typeRecurrence, setTypeRecurrence] = useState('none');
  const [timeRecurrence, setTimeRecurrence] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [userConnected, setUserConnected] = useState({});

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
    setFields([...fields, { form: "", anticipationTime: dayjs(formData.dtStart).subtract(1, 'day')}]);
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

      setUserEmail(data.user.login);
    } catch (error) {
      console.log(error);
      addAlert('Erro ao buscar os dados do agendamento', 'error');
    }
  }; 

  const handleDelete = async () => {
    try {
      console.log("Excluindo agendamento:", selectedSchedule);


      await reservation.delete(selectedSchedule);
      addAlert("Agendamento excluído com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      addAlert("Erro ao excluir o agendamento!", "error");
    } finally {
      handleClose();
    }
  };

  async function getUserConnected() {
    try {
      const { data } = await user.me();
      setUserConnected(data);

    } catch {
      navigate('/login');
    }
  }

  const isFormValid = formData.title.trim() !== "" && formData.dtStart && formData.dtEnd && fields.every(field => field.anticipationTime);
  const isEmailValid = userEmail === userConnected.login;
  const isGodUser = userConnected.isGodUser;

  useEffect(() => {
    if (open && selectedSchedule) {
      if (!isOffline) {
        getUserConnected();
      }
      getSchedule();
    }
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{passDataToSend ? '' : 'Agendar'}</DialogTitle>
      <DialogContent>
        <div className="flex gap-4 pt-3">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DateTimePicker
              required
              disabled={isOffline}
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
              minDate={dayjs()}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <TimePicker
              required
              disabled={isOffline}
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
            disabled={isOffline}
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
            disabled={isOffline}
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
                  disabled={isOffline}
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
                disabled={typeRecurrence === 'none' || isOffline}
                fullWidth
              />
            </div>
          )
        }
      
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="py-2">
            <Button
              disabled={isOffline}
              variant="contained"
              onClick={addField}
            >
              Adicionar Notificação
            </Button>
            
            <div className="grid grid-cols-2 gap-4 pt-3 mt-2">
              {fields.map((field, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-2">
                    <DateTimePicker
                      disabled={isOffline}
                      required
                      label="Tempo de antecipação"
                      ampm={false}
                      value={dayjs(formData.dtStart).subtract(1, 'day') || field.anticipationTime}
                      onChange={(newValue) => {
                        const updatedFields = [...fields];
                        updatedFields[index].anticipationTime = newValue;
                        setFields(updatedFields);
                      }}
                      slotProps={{ textField: { fullWidth: true } }}
                      format="DD/MM/YYYY HH:mm"
                      maxDate={dayjs(formData.dtStart)}
                      minDate={dayjs()}
                    />
                    <IconButton
                      disabled={isOffline}
                      variant="outlined"
                      onClick={() => {
                        const updatedFields = fields.filter((_, i) => i !== index);
                        setFields(updatedFields);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </div>
                </React.Fragment>
              ))}
            </div>

          </div>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        {selectedSchedule && (
          <Button onClick={handleDelete} variant="contained" color="error" style={{ marginRight: "auto" }} disabled={!isEmailValid && !isGodUser}>
            Excluir
          </Button>
        )}
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!isFormValid || (!isEmailValid && selectedSchedule) && !isGodUser}>
          Salvar 
        </Button>
      </DialogActions>
    </Dialog>
  );
};