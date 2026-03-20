import { useState } from 'react'
import PinScreen from './components/PinScreen'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <PinScreen onLogin={setUser} />
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />
}
