import { UserProfileDropdown } from '../UserProfileDropdown'

export default function UserProfileDropdownExample() {
  return (
    <UserProfileDropdown 
      userEmail="john.doe@example.com"
      onProfileClick={() => console.log('Profile clicked')}
      onLogout={() => console.log('Logout clicked')}
    />
  )
}
