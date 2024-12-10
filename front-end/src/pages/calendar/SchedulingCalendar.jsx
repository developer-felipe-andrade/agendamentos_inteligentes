import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, Grid2, InputLabel, MenuItem, Select, Switch, TextareaAutosize, TextField } from '@mui/material'
import { useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function SchedulingCalendar() {
  const [formData, setFormData] = useState({ dtStart: new Date(), dtEnd: new Date(), obs: "", notifications: [] });
  const [open, setOpen] = useState(false);

  const handleOpen = async (date) => {
    console.log(date)

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
              <DateTimePicker value={formData.dtStart} label="Data inicial" />
            </DemoContainer>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker value={formData.dtStart} label="Data final" />
            </DemoContainer>
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel shrink htmlFor="custom-textarea">
              Nome do Recurso
            </InputLabel>
            <TextareaAutosize
              id="custom-textarea"
              minRows={4}
              placeholder="Nome do Recurso"
              name="name"
              value={formData.obs}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "16.5px 14px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                backgroundColor: "white",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1976d2")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(0, 0, 0, 0.23)")}
            />
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ padding: "20px" }}>
              <Button variant="contained" onClick={addField}>
                Adicionar
              </Button>
              <Grid2 container spacing={2} style={{ marginTop: "20px" }}>
                {fields.map((field, index) => (
                  <Grid2 item xs={12} key={index} container spacing={2}>
                    <Grid2 item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                          value={field.type}
                          onChange={(e) => handleTypeChange(index, e.target.value)}
                        >
                          <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                          <MenuItem value="E-mail">E-mail</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid2>
                    <Grid2 item xs={8}>
                      <DateTimePicker
                        label="Data e Hora"
                        value={field.date}
                        onChange={(newValue) => handleDateChange(index, newValue)}
                        renderInput={(props) => <TextField fullWidth {...props} />}
                      />
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
