import { Route, Routes } from 'react-router-dom'
import StudentMessages from '../assets/pages/studentDashboard/StudentMessages'
import StudentOverview from '../assets/pages/studentDashboard/StudentOverview'
import StudentTutorProfile from '../assets/pages/studentDashboard/StudentTutorProfile'
import StudentTutors from '../assets/pages/studentDashboard/StudentTutors'

const Content2 = () => {
    return (
        <div className='main-content h-[98vh] w-full overflow-y-scroll'>
            <Routes>
                {/* <Route path='/' element={<Navigate to={'/student/dashboard/overview'} />} /> */}
                <Route path='/student/dashboard/overview' element={<StudentOverview />} />
                <Route path='/student/dashboard/messages' element={<StudentMessages />} />
                <Route path='/student/dashboard/tutors' element={<StudentTutors />} />
                <Route path='/student/dashboard/tutor/:id' element={<StudentTutorProfile />} />
            </Routes>
        </div>
    )
}

export default Content2
