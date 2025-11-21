import { ScheduleMenu } from '../ScheduleMenu'

export default function ScheduleMenuExample() {
  return <ScheduleMenu onSelectView={(view) => console.log('Selected view:', view)} />
}
