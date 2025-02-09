import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useEffect, useState } from 'react'
import Scaffold from '../../components/Scaffold'
import classroom from '../../api/requests/classrooms'
import Alert from '../../components/UseAlert';
import reservation from '../../api/requests/reservation';
import ScheduleDialog from './ScheduleDialog';
import dayjs from "dayjs";

export default function SchedulingCalendar() {
  const { renderAlerts, addAlert } = Alert();
  const [classrooms, setClassrooms] = useState([]);  
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs().toISOString());
  const [schedulings, setSchedulings] = useState([]);
  const [openModal, setOpenModal] = useState(false);

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
        start: item.dtStart,
        end: item.dtEnd,
        extendedProps: {
          status: item.status,
          user: item.user.name
        },
        backgroundColor: item.status === 'PENDING' ? '#FF6347' : '#d1fae5',
        borderColor: item.status === 'PENDING' ? '#FF6347' : '#d1fae5'
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
    setSelectedDate(info.dateStr);
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    getSchedulings(selectedRoom);
    setOpenModal(false);
  }

  useEffect(() => {
    getClassrooms();
  }, []);
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Scaffold>
        {renderAlerts()}
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel>Salas de Aula</InputLabel>
          <Select id="room" label="Salas de Aula" value={selectedRoom} onChange={handleChangeClassroom} sx={{ mr: 3 }}>
            {classrooms.map((room, index) => (
              <MenuItem key={index} value={room.id}>
                Nome: {room.name} - Capacidade: {room.qtdPlace} - Bloco: {room.block} - Responsável: {room.responsible?.name ?? 'Não há responsável'}
              </MenuItem>
            ))}
          </Select>
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
          dateClick={(info) => handleOpenModal(info)}
          dayCellClassNames={() => 'cursor-pointer hover:bg-gray-200'}
          slotLaneClassNames={() => 'cursor-pointer hover:bg-gray-200'}
          events={schedulings}
        />
      </Scaffold>
      {
        openModal && (
          <ScheduleDialog 
            open={openModal}
            selectedRoom={selectedRoom}
            selectedDate={selectedDate}
            onClose={handleCloseModal}
          />
        )
      }
    </div>
  )
}
