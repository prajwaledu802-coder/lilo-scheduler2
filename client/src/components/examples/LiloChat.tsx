import { LiloChat } from '../LiloChat'

export default function LiloChatExample() {
  return <LiloChat onSendMessage={(msg) => console.log('Message sent:', msg)} />
}
