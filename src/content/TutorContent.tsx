import { Navigate, Route, Routes } from 'react-router-dom'
import TutorBookings from '../pages/tutorDashboard/TutorBookings'
import TutorOverview from '../pages/tutorDashboard/TutorOverview'
import TutorWallet from '../pages/tutorDashboard/TutorWallet'

const TutorContent = () => {
    return (
        <div className='main-content h-[98vh] w-full overflow-y-scroll'>
            <Routes>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path='overview' element={<TutorOverview />} />
                <Route path='wallet' element={<TutorWallet />} />
                <Route path='bookings' element={<TutorBookings />} />
            </Routes>
        </div>
    )
}

export default TutorContent