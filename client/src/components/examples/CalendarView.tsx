import { CalendarView } from '../CalendarView'

export default function CalendarViewExample() {
  return (
    <CalendarView 
      events={[]}
      onDateClick={(date) => console.log('Date clicked:', date)}
    />
  )
}
