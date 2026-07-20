import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import {User,Monitor,LogOut,Mail,Shield,Info} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout=async()=>{
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Settings
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="text-blue-600" />
            </div>

            <h2 className="text-xl font-semibold">
              Profile
            </h2>
          </div>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-semibold text-gray-800">
                {user?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Mail size={16} />
                Email
              </p>

              <p className="font-semibold text-gray-800 break-all">
                {user?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Shield size={16} />
                Role
              </p>

              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium capitalize">
                {user?.role}
              </span>
            </div>

          </div>

        </div>

        {/* Application Card */}
        <div className="bg-white rounded-xl shadow-md p-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <Monitor className="text-green-600" />
            </div>

            <h2 className="text-xl font-semibold">
              Application
            </h2>
          </div>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Application
              </p>

              <p className="font-semibold">
                CampusFlow
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Version
              </p>

              <p className="font-semibold">
                1.0.0
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Info size={16} />
                Description
              </p>

              <p className="text-gray-700 text-sm leading-6">
                CampusFlow is a content broadcasting platform
                that enables teachers to upload learning
                materials, administrators to approve content,
                and students to securely access approved
                resources.
              </p>
            </div>

          </div>

        </div>

        {/* Logout Card */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">

          <div>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <LogOut className="text-red-600" />
              </div>

              <h2 className="text-xl font-semibold">
                Logout
              </h2>
            </div>

            <p className="text-gray-600 leading-7">
              You are currently signed in as{" "}
              <span className="font-semibold">
                {user?.name}
              </span>.
            </p>

            <p className="text-gray-500 mt-4">
              Click the button below to securely logout from
              CampusFlow.
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
};

export default Setting;