import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { uploadContent, getMyContent, getLiveContent, getContentBySubject, getAllApprovedContent } from "../services/ContentService";
import { getPendingContent, approveContent, rejectContent, getAllContent, getContentByStatus } from "../services/AdminService";

const Dashboard = () => {
    const { user, loading } = useAppContext();
    const navigate = useNavigate();

    //   create state variables to hold the counts
    const [totalUploads, setTotalUploads] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);

    //   for recent uploads, we can create a state variable to hold the recent uploads
    const [recentUploads, setRecentUploads] = useState([]);

    // for pending approvals, we can create a state variable to hold the pending approvals
    const [pendingApprovals, setPendingApprovals] = useState([]);

    // for upcoming broadcast
    const [upcomingBroadcasts, setUpcomingBroadcasts] = useState([]);
    // for live broadcast
    const [liveBroadcast, setLiveBroadcast] = useState(null);

    const fetchTotalUploads = async () => {
        if (!user) return;
        // const response = await getMyContent();
        let response;

        if (user.role === "teacher") {
            response = await getMyContent();
        } else if (user.role === "admin") {
            response = await getAllContent();
        }
        if (response.success) {
            setTotalUploads(response.data.length);
        }
    };

    const fetchPendingCount = async () => {
        if (!user) return;
        let response;

        if (user.role === "teacher") {
            response = await getMyContent();
        } else if (user.role === "admin") {
            response = await getAllContent();
        }
        if (response.success) {
            const pendingItems = response.data.filter(item => item.status === "pending");
            setPendingCount(pendingItems.length);
        }
    }

    const fetchPendingApprovals = async () => {
        if (!user) return;
        const response = await getPendingContent();
        if (response.success) {
            setPendingApprovals(response.data);
        }
    }

    const fetchApprovedCount = async () => {
        if (!user) return;
        let response;

        if (user.role === "teacher") {
            response = await getMyContent();
        } else if (user.role === "admin") {
            response = await getAllContent();
        }
        if (response.success) {
            const approvedItems = response.data.filter(item => item.status === "approved");
            setApprovedCount(approvedItems.length);
        }
    }

    const fetchRejectedCount = async () => {
        if (!user) return;
        let response;

        if (user.role === "teacher") {
            response = await getMyContent();
        } else if (user.role === "admin") {
            response = await getAllContent();
        }
        if (response.success) {
            const rejectedItems = response.data.filter(item => item.status === "rejected");
            setRejectedCount(rejectedItems.length);
        }
    }


    // recent uploads
    const fetchRecentUploads = async () => {
        if (!user) return;
        let response;

        if (user.role === "teacher") {
            response = await getMyContent();
        } else if (user.role === "admin") {
            response = await getAllContent();
        }
        if (response.success) {
            setRecentUploads(response.data.slice(0, 5)); // Get the 5 most recent uploads
        }
    };

    const handleContentApproval = async (id) => {
        if (!user) return;
        const response = await approveContent(id);
        if (response.success) {
            // update the pending approvals state
            setPendingApprovals(prev => prev.filter(item => item._id !== id));
            // update the counts
            setPendingCount(prev => prev - 1);
            setApprovedCount(prev => prev + 1);
        }
    }

    const handleContentRejection = async (id, reason) => {
        if (!user) return;
        const response = await rejectContent(id, reason);
        if (response.success) {
            // update the pending approvals state
            setPendingApprovals(prev => prev.filter(item => item._id !== id));
            // update the counts
            setPendingCount(prev => prev - 1);
            setRejectedCount(prev => prev + 1);
        }
    }

    const fetchUpcomingBroadcasts = async () => {
        try {
            // const response = await getAllContent();
            let response;

            if (user.role === "admin") {
                response = await getAllContent();
            } else {
                response = await getMyContent();
            }
            const now = new Date();

            const upcoming = response.data
                .filter(item => new Date(item.startTime) > now)
                .sort(
                    (a, b) => new Date(a.startTime) - new Date(b.startTime)
                )
                .slice(0, 3);

            setUpcomingBroadcasts(upcoming);

        } catch (error) {
            console.error(error);
        }
    };

    // fetch live broacast
    const fetchLiveBroadcast = async () => {
        try {
            let response;
            if (user?.role === 'admin') {
                response = await getAllContent()
            } else {
                response = await getMyContent();
            }
            const now = new Date();
            const live = response.data.find((item) => {
                const start = new Date(item.startTime);
                const end = new Date(item.endTime);

                return start <= now && end >= now;
            });
            setLiveBroadcast(live || null);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (loading) return; // Wait until user data is loaded
        if (!user) return; // If user is not logged in, do not fetch data
        fetchTotalUploads();
        fetchPendingCount();
        fetchApprovedCount();
        fetchRejectedCount();
        fetchRecentUploads();
        if (user.role === "admin") {
            fetchPendingApprovals();
        }
        fetchUpcomingBroadcasts();
        fetchLiveBroadcast();


    }, [loading, user]); // Re-run when loading or user changes

    return (

        <div className='w-full min-h-screen pb-6'>

            {/* MAIN GRID */}
            <div className='grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6'>

                {/* LEFT SECTION */}
                <div className='space-y-6'>

                    {/* WELCOME CARD */}
                    <div className='bg-white rounded-3xl border border-gray-200 p-6 shadow-sm'>

                        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>

                            <div>

                                <p className='text-sm text-gray-400 mb-2'>
                                    Welcome back
                                </p>

                                <h1 className='text-4xl font-bold text-gray-800'>
                                    Hello, {user?.name || 'User'}
                                </h1>

                                <p className='text-gray-500 mt-2'>
                                    Quick overview of broadcasting activity and content awaiting your review.
                                </p>

                            </div>

                            <button className='bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-6 py-3 rounded-2xl font-medium w-fit'>
                                Create Broadcast
                            </button>

                        </div>

                        {/* STATS */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8'>

                            {/* CARD */}
                            <div className='bg-gray-50 rounded-2xl p-5 border border-gray-100'>

                                <p className='text-sm text-gray-400'>
                                    Uploaded Content
                                </p>

                                <h2 className='text-3xl font-bold text-gray-800 mt-4'>
                                    {totalUploads}
                                </h2>

                                <p className='text-sm text-green-500 mt-2'>
                                    +12% from last month
                                </p>

                            </div>

                            {/* CARD */}
                            <div className='bg-gray-50 rounded-2xl p-5 border border-gray-100'>

                                <p className='text-sm text-gray-400'>
                                    Pending Approvals
                                </p>

                                <h2 className='text-3xl font-bold text-gray-800 mt-4'>
                                    {pendingCount}
                                </h2>

                                <p className='text-sm text-red-400 mt-2'>
                                    {pendingCount} awaiting review
                                </p>

                            </div>

                            {/* CARD */}
                            <div className='bg-gray-50 rounded-2xl p-5 border border-gray-100'>

                                <p className='text-sm text-gray-400'>
                                    Approved Broadcasts
                                </p>

                                <h2 className='text-3xl font-bold text-gray-800 mt-4'>
                                    {approvedCount}
                                </h2>

                                <p className='text-sm text-gray-500 mt-2'>
                                    Preparing schedule
                                </p>

                            </div>

                            {/* CARD */}
                            <div className='bg-gray-50 rounded-2xl p-5 border border-gray-100'>

                                <p className='text-sm text-gray-400'>
                                    Rejected Items
                                </p>

                                <h2 className='text-3xl font-bold text-gray-800 mt-4'>
                                    {rejectedCount}
                                </h2>

                                <p className='text-sm text-gray-500 mt-2'>
                                    Recent rejections
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* RECENT UPLOADS */}
                    <div className='bg-white rounded-3xl border border-gray-200 p-6 shadow-sm'>

                        {/* HEADER */}
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>

                            <div>

                                <h2 className='text-2xl font-bold text-gray-800'>
                                    Recent Uploads
                                </h2>

                                <p className='text-sm text-gray-400 mt-1'>
                                    Latest content uploaded by teachers
                                </p>

                            </div>

                            <div className='flex items-center gap-3'>

                                <input
                                    type='text'
                                    placeholder='Search uploads'
                                    className='bg-gray-50 border border-gray-200 px-4 py-3 rounded-full outline-none text-sm w-[220px]'
                                />

                                <button className='border border-gray-300 px-5 py-3 rounded-2xl text-sm hover:bg-gray-100 transition-all'>
                                    Export
                                </button>

                            </div>

                        </div>

                        {/* TABLE */}
                        <div className='overflow-x-auto'>

                            <table className='w-full min-w-[750px]'>

                                <thead>

                                    <tr className='border-b border-gray-200 text-left text-sm text-gray-400'>

                                        <th className='pb-4 font-medium'>
                                            Title
                                        </th>

                                        <th className='pb-4 font-medium'>
                                            Subject
                                        </th>

                                        <th className='pb-4 font-medium'>
                                            Teacher
                                        </th>

                                        <th className='pb-4 font-medium'>
                                            Upload
                                        </th>

                                        <th className='pb-4 font-medium'>
                                            Schedule
                                        </th>

                                        <th className='pb-4 font-medium'>
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>
                                    {recentUploads.map(upload => (
                                        <tr key={upload._id} className='border-b border-gray-100'>

                                            <td className='py-5 font-medium text-gray-800'>
                                                {upload.title}
                                            </td>

                                            <td className='py-5 text-gray-500'>
                                                {upload.subject}
                                            </td>

                                            <td className='py-5 text-gray-500'>
                                                {upload.uploadedBy?.name || user?.name}
                                            </td>

                                            <td className='py-5 text-gray-500'>
                                                {new Date(upload.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })}
                                            </td>

                                            <td className='py-5 text-gray-500'>
                                                {new Date(upload.startTime).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })}

                                                {" - "}

                                                {new Date(upload.endTime).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })}
                                            </td>

                                            <td className='py-5'>
                                                <span className='bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-sm'>
                                                    {upload.status}
                                                </span>
                                            </td>

                                        </tr>
                                    ))}



                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* PENDING APPROVALS */}
                    {/* only for admins */}
                    {user?.role === 'admin' && (
                        <div className='bg-white rounded-3xl border border-gray-200 p-6 shadow-sm'>

                            {/* HEADER */}
                            <div className='flex items-center justify-between mb-6'>

                                <div>

                                    <h2 className='text-2xl font-bold text-gray-800'>
                                        Pending Approvals
                                    </h2>

                                    <p className='text-sm text-gray-400 mt-1'>
                                        Items waiting for principal review
                                    </p>

                                </div>

                                <p className='text-sm text-gray-400'>
                                    Showing {pendingApprovals.length} pending item(s)
                                </p>

                            </div>

                            {/* CARD */}
                            <div className='space-y-5'>

                                {pendingApprovals.map((approval) => (
                                    <div key={approval._id} className='border border-gray-200 rounded-2xl p-5'>
                                        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>
                                            <div className='space-y-2'>

                                                <h3 className='text-xl font-semibold text-gray-800'>
                                                    {approval.title}
                                                </h3>

                                                {/* <p className='text-sm text-gray-400 mt-2'>
                                                Subject: {approval.subject} · Uploaded by {approval.uploadedBy?.name} · {approval.uploadDate}
                                            </p> */}
                                                <p className='text-sm text-gray-400 mt-2'>
                                                    Subject: {approval.subject} • Uploaded by {approval.uploadedBy?.name} •{" "}
                                                    {new Date(approval.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric"
                                                    })}
                                                </p>

                                                {/* <p className='text-sm text-gray-500 mt-3 leading-7'>
                                                Notes preview: {approval.preview}
                                            </p> */}

                                            </div>

                                            {user?.role === 'admin' && (
                                                <div className='flex items-center gap-3'>

                                                    <button onClick={() => { handleContentApproval(approval._id) }} className='bg-green-100 text-green-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-green-200 transition-all'>
                                                        Approve
                                                    </button>

                                                    <button onClick={() => { handleContentRejection(approval._id, "Content does not meet guidelines.") }} className='bg-red-100 text-red-500 px-5 py-2 rounded-full text-sm font-medium hover:bg-red-200 transition-all'>
                                                        Reject
                                                    </button>

                                                </div>
                                            )}

                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>
                    )}

                </div>

                {/* RIGHT SECTION */}
                <div className='space-y-6'>

                    {/* UPCOMING */}
                    <div className='bg-white rounded-3xl border border-gray-200 p-6 shadow-sm'>

                        <h2 className='text-xl font-bold text-gray-800'>
                            Upcoming Broadcasts
                        </h2>

                        <p className='text-sm text-gray-400 mt-1'>
                            Today
                        </p>

                        <div className="space-y-4 mt-6">

                            {upcomingBroadcasts.length > 0 ? (

                                upcomingBroadcasts.map((item) => (

                                    <div
                                        key={item._id}
                                        className="border border-gray-200 rounded-2xl p-4"
                                    >

                                        <h3 className="font-semibold text-gray-800">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm text-gray-400 mt-2">
                                            {item.uploadedBy?.name} ·{" "}
                                            {new Date(item.startTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}

                                            {" — "}

                                            {new Date(item.endTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <span
                                            className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${item.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>

                                    </div>

                                ))

                            ) : (

                                <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-400">
                                    No upcoming broadcasts scheduled.
                                </div>

                            )}

                        </div>

                        {/* GRAPH PLACEHOLDER
                        <button className="w-full mt-6 border border-gray-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition">
                            View All Broadcasts
                        </button> */}

                    </div>

                    {/* QUICK ACTIONS */}
                    <div className='bg-white rounded-3xl border border-gray-200 p-6 shadow-sm'>

                        <h2 className='text-xl font-bold text-gray-800'>
                            Quick Actions
                        </h2>

                        <p className='text-sm text-gray-400 mt-1'>
                            Manage
                        </p>

                        <div className='grid grid-cols-2 gap-4 mt-6'>

                            <button onClick={() => { navigate('/upload') }} className='bg-indigo-600 hover:bg-indigo-700 transition-all text-white py-3 rounded-2xl text-sm font-medium'>
                                New Upload
                            </button>

                            <button onClick={() => navigate('/analytics')} className='border border-gray-300 hover:bg-gray-100 transition-all py-3 rounded-2xl text-sm font-medium'>
                                Analytics
                            </button>

                        </div>

                    </div>

                    {/* LIVE MONITOR */}
                    <div className='bg-white rounded-3xl border border-gray-200 p-6 shadow-sm'>

                        <div className='flex items-center justify-between'>

                            <div>

                                <h2 className='text-xl font-bold text-gray-800'>
                                    Broadcasting Live Monitor
                                </h2>

                                <p className='text-sm text-gray-400 mt-1'>
                                    Overview of current rotation
                                </p>

                            </div>

                            <button className='bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm'>
                                Manage
                            </button>

                        </div>

                        {/* LIVE CARD */}
                        <div className="border border-gray-200 rounded-2xl p-5 mt-6">

                            {
                                liveBroadcast ? (

                                    <>

                                        <p className="text-sm text-green-600 font-medium">
                                            ● Live Now
                                        </p>

                                        <div className="mt-4">

                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {liveBroadcast.title}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-2">
                                                {liveBroadcast.uploadedBy?.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {liveBroadcast.subject}
                                            </p>

                                            <p className="text-sm text-gray-400 mt-4">

                                                {new Date(liveBroadcast.startTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}

                                                {" - "}

                                                {new Date(liveBroadcast.endTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}

                                            </p>

                                        </div>

                                    </>

                                ) : (

                                    <div className="py-12 text-center">

                                        <p className="text-gray-500 font-medium">
                                            No live broadcast
                                        </p>

                                        <p className="text-sm text-gray-400 mt-2">
                                            Waiting for the next scheduled broadcast.
                                        </p>

                                    </div>

                                )

                            }

                        </div>

                    </div>

                </div>

            </div>

            {/* FOOTER HELP */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mt-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Logo */}
                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                            <img
                                src="/campusIcon.png"
                                alt="CampusFlow Logo"
                                className="w-7 h-7 object-contain"
                            />

                        </div>

                        <div>

                            <h3 className="text-lg font-bold text-gray-800">
                                CampusFlow
                            </h3>

                            <p className="text-sm text-gray-500">
                                Smart Campus Broadcasting System
                            </p>

                        </div>

                    </div>

                    {/* Version */}
                    <div className="text-sm text-gray-400 text-left md:text-right">
                        <p>Version 1.0.0</p>
                        <p>© 2026 CampusFlow</p>
                    </div>

                </div>

            </div>

        </div>

    );

};

export default Dashboard;