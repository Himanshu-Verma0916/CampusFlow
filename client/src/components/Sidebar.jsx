import React from 'react';
import { LayoutDashboard, Upload, FileText, Radio, BarChart3, Settings, X, LogOut } from 'lucide-react';
import { campusIcon } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../context/AppContext';

const Sidebar = ({ sidebar, setSidebar }) => {
  const navigate = useNavigate();

  const { user, logout } = useAppContext();
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === "student";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {
        sidebar &&
        <div
          onClick={() => setSidebar(false)}
          className='fixed inset-0 bg-black/40 z-40 lg:hidden'
        ></div>
      }
      {/* SIDEBAR */}
      <div className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] w-[270px] bg-white border-r border-gray-200 text-gray-700 z-40 transform transition-all duration-300
      ${sidebar ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0`}>

        {/* TOP */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-600'>

          {/* LOGO */}
          <div className='flex items-center gap-3'>

            <div className='w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-lg'>
              <img src={campusIcon} alt='Campus Icon' />
            </div>

            <div>

              <h1 className='text-[17px] font-semibold'>
                CampusFlow
              </h1>

              <p className='text-xs text-gray-400'>
                Smart campus broadcasting system
              </p>

            </div>

          </div>

          {/* CLOSE BTN */}
          <button
            onClick={() => setSidebar(false)}
            className='lg:hidden'
          >
            <X className='w-6 h-6 text-gray-300' />
          </button>

        </div>

        {/* NAV LINKS */}
        <div className='flex flex-col gap-2 p-4 text-sm font-medium'>

          {/* DASHBOARD */}
          <button  onClick={() => navigate('/')} className='flex items-center gap-3 bg-indigo-700 text-white px-4 py-3 rounded-md'>

            <LayoutDashboard className='w-5 h-5' />

            <p>Dashboard</p>

          </button>

          {/* UPLOAD CONTENT */}
          <button disabled={isStudent} disabled={isAdmin} onClick={() => !isStudent && !isAdmin && navigate('/upload')} className='flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm hover:scale-110 hover:bg-gray-700 hover:text-white transition-all'>
            <Upload className='w-5 h-5' />
            <p>Upload Content</p>
          </button>

          {/* MY CONTENT */}
          <button disabled={isStudent} disabled={isAdmin} onClick={() => !isStudent && !isAdmin && navigate('/my-content')} className='flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm hover:scale-110 hover:bg-gray-700 hover:text-white transition-all'>
            <FileText className='w-5 h-5' />
            <p>My Content</p>
          </button>

          {/* ANALYTICS */}
          <button disabled={isStudent} disabled={isAdmin} onClick={() =>!isStudent && !isAdmin && navigate('/analytics')} className='flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm hover:scale-110 hover:bg-gray-700 hover:text-white transition-all'>
            <BarChart3 className='w-5 h-5' />
            <p>Analytics</p>
          </button>

          {/* SETTINGS */}
          <button  onClick={() =>navigate('/settings')} className='flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm hover:scale-110 hover:bg-gray-700 hover:text-white transition-all'>
            <Settings className='w-5 h-5' />
            <p>Settings</p>
          </button>

          {
            user && (
              <div className="flex flex-col h-[calc(100%-88px)]">
                <button onClick={() => { handleLogout() }}
                  className="flex items-center text-red-700 gap-3 px-4 py-3 rounded-xl shadow-sm hover:scale-110 hover:bg-red-600 hover:text-white transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )
          }



        </div>


      </div>

    </>

  );

};

export default Sidebar;