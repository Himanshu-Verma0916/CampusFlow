import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { campusIcon, admin } from '../assets/assets';

import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setSidebar }) => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();
    
  const isStudent = user?.role === "student";

    return (

        <div className='w-full bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-50'>

            {/* LEFT SECTION */}
            <div className='flex items-center gap-4'>

                {/* MENU BUTTON FOR MOBILE */}
                <button
                    onClick={() => setSidebar(prev => !prev)}
                    className='lg:hidden'
                >
                    <Menu className='w-6 h-6 text-gray-700' />
                </button>

                {/* LOGO + TITLE */}
                <div onClick={() => navigate('/')} className='flex items-center gap-3 cursor-pointer'>

                    <div className='w-15 h-15 rounded-xl flex items-center justify-center text-white font-bold text-lg'>
                        <img src={campusIcon} alt='Campus Icon' />

                    </div>

                    <div className='hidden sm:block'>
                        <h1 className='text-[16px] font-semibold text-gray-800 cursor-pointer'>
                            CampusFlow
                        </h1>

                        <p className='text-xs text-gray-500'>
                            Smart campus broadcasting system
                        </p>
                    </div>

                </div>

            </div>

            {/* CENTER LINKS */}
            <div className='hidden lg:flex items-center gap-30 text-sm font-medium text-gray-500'>

                <p onClick={()=>{ navigate('/')}} className='cursor-pointer hover:text-indigo-600 hover:scale-110 transition-all'>
                    Overview
                </p>

                <p disabled={isStudent} onClick={()=>{ !isStudent && navigate('/analytics')}} className='cursor-pointer hover:text-indigo-600 hover:scale-110 transition-all'>
                    Workflows
                </p>

                <p disabled={isStudent}  onClick={()=>{ !isStudent && navigate('/my-content')}} className='cursor-pointer hover:text-indigo-600 hover:scale-110 transition-all'>
                    Docs
                </p>

            </div>

            {/* RIGHT SECTION */}
            <div className='flex items-center gap-3'>

                {/* PROFILE */}
                {user ? (
                    <div className="relative group ml-2">

                        {/* Trigger */}
                        <div className="cursor-pointer text-right">
                            <h2 className="text-sm font-semibold text-gray-800">
                                Welcome, {user.name}
                            </h2>

                            <p className="text-xs text-gray-500 capitalize">
                                {user.role}
                            </p>
                        </div>

                        {/* Dropdown */}
                        <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

                            <button
                                onClick={async () => {
                                    await logout();
                                    navigate("/login");
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition"
                            >
                                Logout
                            </button>

                        </div>

                    </div>
                ) : (
                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => navigate("/register")}
                            className="hidden sm:block px-4 py-2 text-sm font-medium border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                        >
                            Create Account
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
                        >
                            Login
                        </button>

                    </div>
                )}


            </div>

        </div>

    );

};

export default Navbar;