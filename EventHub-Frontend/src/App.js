import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import CreateEvent from './pages/CreateEvent'
import Event from './pages/Event'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-550 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/new" element={<CreateEvent />} />
            <Route path="/event/:eventId" element={<Event />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
