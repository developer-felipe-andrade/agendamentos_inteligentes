import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid2, InputLabel, MenuItem, Select,TextField } from '@mui/material'
import { useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function SchedulingCalendar() {
  const [formData, setFormData] = useState({ dtStart: new Date(), dtEnd: new Date(), obs: "", notifications: [] });
  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFields([])
    setFormData({ dtStart: new Date(), dtEnd: new Date(), obs: "", notifications: [] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {};

  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields((prevFields) => [
      ...prevFields,
      { type: "WhatsApp", date: null },
    ]);
  };

  const handleTypeChange = (index, value) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, type: value } : field
      )
    );
  };

  const handleDateChange = (index, newValue) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, date: newValue } : field
      )
    );
  };
  
  return (
    <div className="h-screen w-screen">
      <FormControl fullWidth sx={{ m: 2 }}>
        <InputLabel>Salas de Aula</InputLabel>
        <Select
          id={`room`}
          label="Salas de Aula"
          onChange={handleChange}
          sx={{ mr: 3 }}  // Adicionando um espaço à direita
        >
          <MenuItem value="EMAIL">Nome: Laboratório 01 - Capacidade: 40 - Bloco: A</MenuItem>
          <MenuItem value="WHATSAPP">Nome: Laboratório 01 - Capacidade: 40 - Bloco: B</MenuItem>
        </Select>
      </FormControl>

      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        customButtons={{
          dayGridMonth: {
            text: 'Mês',
          },
          timeGridWeek: {
            text: 'Semana',
          },
          timeGridDay: {
            text: 'Dia',
          },
        }}
        height="100%"
        dateClick={(info) => handleOpen(info)}
        dayCellClassNames={(info) => 'cursor-pointer hover:bg-gray-200'} // Adiciona a classe 'group' às células dos dias
        slotLaneClassNames={() => 'cursor-pointer hover:bg-gray-200'}
        events={[
          { title: 'Aula POO', start: '2024-12-12T10:30:00', end: '2024-12-12T11:30:00'},
          { title: 'TCC', start: '2024-12-13T14:30:00', end: '2024-12-13T15:30:00'},
          { title: 'Algoritmo', start: '2024-12-14T20:30:00', end: '2024-12-14T21:30:00'},
        ]}
        
      />

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Agendar</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker label="Data inicial" />
            </DemoContainer>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} cl>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker label="Data final" />
            </DemoContainer>
          </LocalizationProvider>

          <div className='pt-2'>
            <TextField
              label="Observação"
              name="obs"
              fullWidth
              value={formData.obs}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='py-2'>
              <Button disabled={fields.length > 1} variant="contained" onClick={addField}>
                Adicionar Notificação
              </Button>
              
              <Grid2 container>
                {fields.map((field, index) => (
                  <Grid2 item xs={12} key={index} container spacing={2}>
                    <Grid2 item xs={6}>
                      <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                          id={`notification-typ e-${index}`}
                          label="Tipo"
                          onChange={handleChange}
                        >
                          <MenuItem value="EMAIL">E-mail</MenuItem>
                          <MenuItem value="WHATSAPP">WhatsApp</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid2>
                    <Grid2 item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                          <DateTimePicker label="Data final" />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid2>
                  </Grid2>
                ))}
              </Grid2>
            </div>
          </LocalizationProvider>
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
  )
}
