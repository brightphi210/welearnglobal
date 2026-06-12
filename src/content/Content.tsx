import { Navigate, Route, Routes } from 'react-router-dom'
import Overview from '../assets/pages/tutorDashboard/Overview'

const Content = () => {
    return (
        <div className='main-content h-[98vh] w-full overflow-y-scroll'>
            <Routes>
                <Route path='/' element={<Navigate to={'/tutor/dashboard/overview'} />} />
                <Route path='/tutor/dashboard/overview' element={<Overview />} />
            </Routes>
        </div>
    )
}

export default Content
