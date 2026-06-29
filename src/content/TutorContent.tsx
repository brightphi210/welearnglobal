import { Navigate, Route, Routes } from 'react-router-dom'
import Overview from '../assets/pages/tutorDashboard/Overview'

const TutorContent = () => {
    return (
        <div className='main-content h-[98vh] w-full overflow-y-scroll'>
            <Routes>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path='overview' element={<Overview />} />
            </Routes>
        </div>
    )
}

export default TutorContent