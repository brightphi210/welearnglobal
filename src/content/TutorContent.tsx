import { Navigate, Route, Routes } from 'react-router-dom'
import TutorBookings from '../pages/tutorDashboard/TutorBookings'
import TutorMessages from '../pages/tutorDashboard/TutorMessages'
import TutorOverview from '../pages/tutorDashboard/TutorOverview'
import TutorProfile from '../pages/tutorDashboard/TutorProfile'
import TutorSessionDetails from '../pages/tutorDashboard/TutorSessionDetails'
import TutorWallet from '../pages/tutorDashboard/TutorWallet'

const TutorContent = () => {
    return (
        <div className='main-content h-[98vh] w-full overflow-y-scroll'>
            <Routes>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path='overview' element={<TutorOverview />} />
                <Route path='wallet' element={<TutorWallet />} />
                <Route path='bookings' element={<TutorBookings />} />
                <Route path='messages' element={<TutorMessages />} />
                <Route path='profile' element={<TutorProfile />} />
                <Route path='sessions/:id' element={<TutorSessionDetails />} />
            </Routes>
        </div>
    )
}

export default TutorContent