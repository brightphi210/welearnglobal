// import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import DashNavbar from './component/DashNavbar'
// import SideBar from './component/SideBar'
import Home from './assets/pages/Home'
import Login from './assets/pages/Login'
import Signup from './assets/pages/Signup'
import DashNavbar from './components/DashNavbar'
import DashSideBar from './components/DashSideBar'
import Content2 from './content/Content2'
import './index.css'
import AuthProvider from './providers/AuthProvider'
import ProtectedRoute from './providers/ProtectedRoute'

const App = () => {
  // const YOUR_GOOGLE_CLIENT_ID = "849861043227-982qa4p2jeqj6nja96tv8cdm5h3sm6lg.apps.googleusercontent.com"

  return (
    <>
      {/* <GoogleOAuthProvider clientId={YOUR_GOOGLE_CLIENT_ID}> */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Home />} />
            <Route
              path="*"
              element={
                <ProtectedRoute
                  element={
                    <div className="flex min-h-screen bg-white">
                      {/* Sidebar */}
                      <DashSideBar />

                      {/* Main Content Area */}
                      <div className="flex-1 ">
                        {/* Fixed Navbar */}
                        <DashNavbar />

                        {/* Scrollable Content */}
                        <div className="w-full">
                          <Content2 />
                        </div>
                      </div>
                    </div>
                  }
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      {/* </GoogleOAuthProvider> */}
    </>
  )
}

export default App