import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import UploadContent from './pages/UploadContent'
import StudentDashboard from './pages/StudentDashBoard'
import MyContent from './pages/MyContent'
import Analytics from './pages/Analytics'
import Setting from './pages/Setting'

import { useAppContext } from './context/AppContext';


const App = () => {

  const [sidebar, setSidebar] = useState(false);
  const { user } = useAppContext();

  return (

    <div className='min-h-screen bg-[#f5f7fb]'>
      <ToastContainer />
      {/* NAVBAR */}
      <Navbar setSidebar={setSidebar} />

      {/* MAIN SECTION */}
      <div className='flex'>

        {/* SIDEBAR */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>

        {/* PAGE CONTENT */}
        <div className='flex-1 lg:ml-[270px] p-4 md:p-6'>

          <Routes>

            <Route path='/' element={user?.role === 'student' ? <StudentDashboard /> : <Dashboard />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/upload' element={<UploadContent />} />
            <Route path='/my-content' element={<MyContent />} />
            <Route path='/analytics' element={<Analytics />} />
            <Route path='/settings' element={<Setting />} />
          </Routes>

        </div>

      </div>

    </div>

  )

}

export default App