import { ProfileSettings } from '../ProfileSettings'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ProfileSettingsExample() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Profile Settings</Button>
      <ProfileSettings 
        open={open}
        onOpenChange={setOpen}
        userEmail="john.doe@example.com"
        onSave={(data) => console.log('Profile saved:', data)}
      />
    </>
  )
}
