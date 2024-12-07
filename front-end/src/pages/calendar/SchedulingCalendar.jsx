import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function SchedulingCalendar() {
  const [formData, setFormData] = useState({ name: '', type: '', initialDate: new Date() });
  const [open, setOpen] = useState(false);

  const handleOpen = async (date) => {
    console.log(date)

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', type: '', initialDate: new Date() }); // Limpar o formulário
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {};
  
  return (
    <div className="h-screen w-screen">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height="100%"
        dateClick={(info) => handleOpen(info)}
        dayCellClassNames={(info) => 'cursor-pointer hover:bg-gray-200'} // Adiciona a classe 'group' às células dos dias
        slotLaneClassNames={() => 'cursor-pointer hover:bg-gray-200'}
      />

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Agendar</DialogTitle>
        <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker label="Basic date time picker" />
          </DemoContainer>
        </LocalizationProvider>
       
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
  )
}
