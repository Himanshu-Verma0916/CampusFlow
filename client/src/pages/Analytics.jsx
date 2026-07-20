import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getAllContent, getMyContent } from "../services/ContentService";
import { FileText, CheckCircle, Clock, XCircle, BookOpen, User, } from "lucide-react";

const Analytics = () => {
    const { user, loading } = useAppContext();

    const [content, setContent] = useState([]);

    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
    });

    const [topSubject, setTopSubject] = useState("-");
    const [teacherStats, setTeacherStats] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    const [topSubjectCount, setTopSubjectCount] = useState(0);

    // most uploaded subject
    const [platformSummary, setPlatformSummary] = useState({
        totalSubjects: 0,
        totalTeachers: 0,
        approvalRate: 0,
        pendingRate: 0,
    });

    const fetchAnalytics = async () => {
        try {
            const response =
                user.role === "admin"
                    ? await getAllContent()
                    : await getMyContent();

            const data = response.data || [];

            setContent(data);

            calculateStats(data);
            calculateTopSubject(data);
            calculateTeacherStats(data);

            // platform summary
            calculatePlatformSummary(data);

            const recent = [...data]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setRecentActivity(recent);
        } catch (error) {
            console.error("Analytics Error:", error);
        }
    };

    const calculateStats = (data) => {
        const approved = data.filter(
            (item) => item.status === "approved"
        ).length;

        const pending = data.filter(
            (item) => item.status === "pending"
        ).length;

        const rejected = data.filter(
            (item) => item.status === "rejected"
        ).length;

        setStats({
            total: data.length,
            approved,
            pending,
            rejected,
        });
    };

    const calculateTopSubject = (data) => {
        const subjects = {};

        data.forEach((item) => {
            subjects[item.subject] = (subjects[item.subject] || 0) + 1;
        });

        let highest = "-";
        let count = 0;

        Object.entries(subjects).forEach(([subject, value]) => {
            if (value > count) {
                highest = subject;
                count = value;
            }
        });

        setTopSubject(highest);
        setTopSubjectCount(count);
    };

    const calculateTeacherStats = (data) => {
        if (user.role !== "admin") return;

        const teachers = {};

        data.forEach((item) => {
            const teacher =
                item.uploadedBy?.name ||
                item.uploadedBy?.username ||
                "Unknown";

            teachers[teacher] =
                (teachers[teacher] || 0) + 1;
        });

        const result = Object.entries(teachers)
            .map(([name, uploads]) => ({
                name,
                uploads,
            }))
            .sort((a, b) => b.uploads - a.uploads);

        setTeacherStats(result);
    };

    const calculatePlatformSummary = (data) => {
        const uniqueSubjects = new Set(
            data.map(item => item.subject).filter(Boolean)
        );

        const uniqueTeachers = new Set(
            data.map(item => item.uploadedBy?.name).filter(Boolean)
        );

        const approved = data.filter(
            item => item.status === "approved"
        ).length;

        const pending = data.filter(
            item => item.status === "pending"
        ).length;

        const total = data.length || 1;

        setPlatformSummary({
            totalSubjects: uniqueSubjects.size,
            totalTeachers: uniqueTeachers.size,
            approvalRate: ((approved / total) * 100).toFixed(1),
            pendingRate: ((pending / total) * 100).toFixed(1),
        });
    };

    useEffect(() => {
        if (loading || !user) return;

        fetchAnalytics();
    }, [loading, user]);

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Analytics
            </h1>
            <p className='text-gray-500 mt-2 mb-6'>
                Quick overview of broadcasting activity and content awaiting your review.
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Total Uploads</p>
                        <h2 className="text-3xl font-bold">{stats.total}</h2>
                    </div>

                    <div className="bg-blue-100 p-3 rounded-full">
                        <FileText className="text-blue-600" size={30} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Approved</p>
                        <h2 className="text-3xl font-bold text-green-600">
                            {stats.approved}
                        </h2>
                    </div>

                    <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle className="text-green-600" size={30} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Pending</p>
                        <h2 className="text-3xl font-bold text-yellow-500">
                            {stats.pending}
                        </h2>
                    </div>

                    <div className="bg-yellow-100 p-3 rounded-full">
                        <Clock className="text-yellow-600" size={30} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Rejected</p>
                        <h2 className="text-3xl font-bold text-red-500">
                            {stats.rejected}
                        </h2>
                    </div>

                    <div className="bg-red-100 p-3 rounded-full">
                        <XCircle className="text-red-600" size={30} />
                    </div>
                </div>

            </div>

            {/* Information Cards */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Top Subject */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="text-indigo-600" />
                        <h2 className="text-xl font-semibold">
                            Most Uploaded Subject
                        </h2>
                    </div>

                    <p className="text-2xl font-bold text-indigo-600">
                        {topSubject}
                    </p>

                    <p className="text-gray-500 mt-2">
                        {topSubjectCount} Uploads
                    </p>

                    <div className="border-t mt-6 pt-5">
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Platform Summary
                        </h3>

                        <div className="space-y-3">

                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Subjects</span>
                                <span className="font-semibold">
                                    {platformSummary.totalSubjects}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Teachers</span>
                                <span className="font-semibold">
                                    {user.role === "admin"
                                        ? platformSummary.totalTeachers
                                        : "1"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Approval Rate</span>
                                <span className="font-semibold text-green-600">
                                    {platformSummary.approvalRate}%
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Pending Rate</span>
                                <span className="font-semibold text-yellow-600">
                                    {platformSummary.pendingRate}%
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Activity */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Recent Activity
                    </h2>

                    {recentActivity.length === 0 ? (
                        <p className="text-gray-500">
                            No recent uploads found.
                        </p>
                    ) : (
                        <div className="space-y-3">

                            {recentActivity.map((item) => (

                                <div
                                    key={item._id}
                                    className="border rounded-lg p-3 hover:bg-gray-50 transition"
                                >
                                    <h3 className="font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {item.subject}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>

                                    <span
                                        className={`inline-block mt-2 text-xs px-3 py-1 rounded-full
                    ${item.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>

                                </div>

                            ))}

                        </div>
                    )}

                </div>

            </div>

            {/* Teacher Statistics */}
            {user?.role === "admin" && (

                <div className="bg-white rounded-xl shadow mt-8 p-6">

                    <div className="flex items-center gap-3 mb-5">
                        <User className="text-blue-600" />
                        <h2 className="text-xl font-semibold">
                            Teacher Statistics
                        </h2>
                    </div>

                    {teacherStats.length === 0 ? (
                        <p className="text-gray-500">
                            No teacher data available.
                        </p>
                    ) : (

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="border-b">

                                    <tr>
                                        <th className="text-left py-3">
                                            Teacher
                                        </th>

                                        <th className="text-left py-3">
                                            Uploads
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {teacherStats.map((teacher, index) => (

                                        <tr
                                            key={index}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="py-3">
                                                #{index + 1} {teacher.name}
                                            </td>

                                            <td className="py-3 font-semibold">
                                                {teacher.uploads}
                                            </td>
                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
};

export default Analytics;