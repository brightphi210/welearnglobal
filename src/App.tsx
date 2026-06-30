// import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashNavbar from './components/DashNavbar'
import DashSideBar from './components/DashSideBar'
import TutorDashNavbar from './components/TutorDashNavbar.'
import TutorDashSideBar from './components/TutorDashSideBar'
import StudentContent from './content/StudentContent'
import TutorContent from './content/TutorContent'
import './index.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthProvider from './providers/AuthProvider'
import ProtectedRoute from './providers/ProtectedRoute'

const App = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/student/dashboard/*"
              element={
                <ProtectedRoute
                  allowedRole="student"
                  element={
                    <div className="flex min-h-screen bg-gray-50">
                      <DashSideBar />
                      <div className="flex-1">
                        <DashNavbar />
                        <StudentContent />
                      </div>
                    </div>
                  }
                />
              }
            />

            <Route
              path="/tutor/dashboard/*"
              element={
                <ProtectedRoute
                  allowedRole="tutor"
                  element={
                    <div className="flex min-h-screen bg-gray-50">
                      <TutorDashNavbar />
                      <div className="flex-1">
                        <TutorDashSideBar />
                        <TutorContent />
                      </div>
                    </div>
                  }
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App