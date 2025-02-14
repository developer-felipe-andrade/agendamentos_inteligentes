import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Box, FormControl, MenuItem, Select } from '@mui/material'
import { useEffect, useState } from 'react'
import Scaffold from '../../components/Scaffold'
import classroom from '../../api/requests/classrooms'
import Alert from '../../components/UseAlert';
import reservation from '../../api/requests/reservation';
import ScheduleDialog from './ScheduleDialog';
import ShareSchedule from './ShareSchedule';
import dayjs from "dayjs";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import emailConfig from '../../api/requests/email-config';

export default function SchedulingCalendar() {
  const { renderAlerts, addAlert } = Alert();
  const [classrooms, setClassrooms] = useState([]);  
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs().toISOString());
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [schedulings, setSchedulings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);

  const checkEmailConfig = async () => {
    try {
      const { data } = await emailConfig.exists();
      setOpenEmailDialog(!data); 
    } catch (error) {
      console.log(error);
      addAlert('Erro ao verificar a configuração de e-mail!', 'error');
    }
  };

  const getClassrooms = async () => {
    try {
      const { data } = await classroom.getAll();     
      setClassrooms(data.content);
    } catch (error) {
      console.log(error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  const getSchedulings = async (id) => {
    try {
      const { data } = await reservation.findByClassroom(id);

      setSchedulings(data.content.map(item => ({
        id: item.id,
        title: item.title,
        start: dayjs(item.dtStart).format("YYYY-MM-DDTHH:mm"),
        end: dayjs(item.dtEnd).format("YYYY-MM-DDTHH:mm"),
        extendedProps: {
          status: item.status,
          user: item.user.name
        },
        backgroundColor: item.status === 'PENDING' ? 'red' : 'green',
        borderColor: item.status === 'PENDING' ? 'red' : 'green'
      })));
    } catch (error) {
      console.log(error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  }

  const handleChangeClassroom = (event) => {
    setSelectedRoom(event.target.value);
    getSchedulings(event.target.value);
  }

  const handleOpenModal = (info) => {
    setSelectedSchedule(info.event?.id);
    setSelectedDate(info.dateStr);
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    if (selectedRoom) {
      getSchedulings(selectedRoom);
    }
    setOpenModal(false);
  }

  useEffect(() => {
    checkEmailConfig();
    getClassrooms();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Scaffold>
        {renderAlerts()}

        <FormControl fullWidth sx={{ m: 1 }}>
          <Box display="flex" alignItems="center">
            {/* Select de Salas de Aula */}
            <FormControl fullWidth sx={{ m: 1 }}>
              <Select displayEmpty id="room" value={selectedRoom} onChange={handleChangeClassroom} sx={{ mr: 3 }}>
                <MenuItem value="" disabled>Selecione uma sala</MenuItem>
                {classrooms.map((room, index) => (
                  <MenuItem key={index} value={room.id}>
                    Nome: {room.name} - Capacidade: {room.qtdPlace} - Bloco: {room.block} - Responsável: {room.responsible?.name ?? 'Não há responsável'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ShareSchedule selectedRoom={selectedRoom} />
          </Box>
        </FormControl>

        <FullCalendar
          validRange={{
            start: dayjs().format('YYYY-MM-DD')
          }}
          locale={ptBrLocale}
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="87%"
          eventClick={(info) => handleOpenModal(info)}
          dateClick={(info) => handleOpenModal(info)}
          dayCellClassNames={() => 'cursor-pointer hover:bg-gray-200'}
          slotLaneClassNames={() => 'cursor-pointer hover:bg-gray-200'}
          events={schedulings}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false, 
          }}
        />
      </Scaffold>

      {openModal && (
        <ScheduleDialog 
          open={openModal}
          selectedRoom={selectedRoom}
          selectedDate={selectedDate}
          selectedSchedule={selectedSchedule}
          onClose={handleCloseModal}
        />
      )}

      {openEmailDialog && (
        <Dialog open={openEmailDialog}>
          <DialogTitle>Configuração de E-mail</DialogTitle>
          <DialogContent>
            <p>O e-mail para envio de notificações não está configurado.</p>
            <p>Por favor, clique no menu para configurar o e-mail para envio.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEmailDialog(false)} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
