import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function Calendar() {
  return (
    <div className='h-screen w-screen'>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="dayGridMonth" 
        headerToolbar={{
          end: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}                                                                                                                          
      />
    </div>
  )
}
