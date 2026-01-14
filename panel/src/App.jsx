import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import Points from './components/Points'
import Register from './components/Register'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState('user') // 'user' or 'admin'

  const handleLogin = (role = 'user') => {
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole('user')
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        
        {/* ユーザー用ルート */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && userRole === 'user' ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated && userRole === 'user' ? (
              <Profile onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/points"
          element={
            isAuthenticated && userRole === 'user' ? (
              <Points onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 管理者用ルート */}
        <Route
          path="/admin"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
