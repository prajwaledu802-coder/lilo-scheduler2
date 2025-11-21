import { TaskCard } from '../TaskCard'
import { useState } from 'react'

export default function TaskCardExample() {
  const [completed, setCompleted] = useState(false)
  
  return (
    <div className="max-w-lg space-y-4">
      <TaskCard
        id="1"
        title="DBMS Revision"
        time="8:00 PM"
        notes="Study chapters 5-7 on normalization"
        repeat="weekly"
        priority="high"
        completed={completed}
        onToggle={() => setCompleted(!completed)}
        onEdit={(id) => console.log('Edit task:', id)}
        onDelete={(id) => console.log('Delete task:', id)}
      />
      <TaskCard
        id="2"
        title="Morning Exercise"
        time="6:00 AM"
        repeat="daily"
        priority="medium"
        onToggle={(id) => console.log('Toggle task:', id)}
      />
    </div>
  )
}
