import { Navigate, Route, Routes } from 'react-router-dom'
import BookedTutorClass from '../pages/studentDashboard/BookedTutorClass'
import StudentMessages from '../pages/studentDashboard/StudentMessages'
import StudentNotification from '../pages/studentDashboard/StudentNotification'
import StudentOverview from '../pages/studentDashboard/StudentOverview'
import StudentProfile from '../pages/studentDashboard/StudentProfile'
import StudentSessionDetail from '../pages/studentDashboard/StudentSesssionDetails'
import StudentTutorProfile from '../pages/studentDashboard/StudentTutorProfile'
import StudentTutors from '../pages/studentDashboard/StudentTutors'

const StudentContent = () => {
    return (
        <div className='main-content h-[98vh] w-full overflow-y-scroll'>
            <Routes>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path='overview' element={<StudentOverview />} />
                <Route path='messages' element={<StudentMessages />} />
                <Route path='bookings' element={<BookedTutorClass />} />
                <Route path='tutors' element={<StudentTutors />} />
                <Route path='profile' element={<StudentProfile />} />
                <Route path="notifications" element={<StudentNotification />} />
                <Route path='tutor/:id' element={<StudentTutorProfile />} />
                <Route path="session/:id" element={<StudentSessionDetail />} />
            </Routes>
        </div>
    )
}

export default StudentContent