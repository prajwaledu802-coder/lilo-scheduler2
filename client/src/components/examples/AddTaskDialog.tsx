import { AddTaskDialog } from '../AddTaskDialog'

export default function AddTaskDialogExample() {
  return <AddTaskDialog onAdd={(task) => console.log('New task:', task)} />
}
