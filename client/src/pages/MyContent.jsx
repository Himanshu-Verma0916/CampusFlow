import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getMyContent } from "../services/ContentService";
import { FaSearch, FaPlus, FaFilePdf, FaImage, FaVideo, FaFilePowerpoint, FaFileAlt, FaExternalLinkAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

const MyContent = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();

    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);

            const res = await getMyContent();

            if (res.success) {
                setContents(res.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total: contents.length,
            pending: contents.filter((c) => c.status === "pending").length,
            approved: contents.filter((c) => c.status === "approved").length,
            rejected: contents.filter((c) => c.status === "rejected").length,
        };
    }, [contents]);

    const filteredData = useMemo(() => {
        return contents.filter((item) => {
            const searchMatch =
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.subject.toLowerCase().includes(search.toLowerCase());

            const statusMatch =
                statusFilter === "all" || item.status === statusFilter;

            return searchMatch && statusMatch;
        });
    }, [contents, search, statusFilter]);

    const statusClass = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const getFileIcon = (url = "") => {
        const file = url.toLowerCase();

        if (file.endsWith(".pdf"))
            return <FaFilePdf className="text-red-500 text-2xl" />;

        if (
            file.endsWith(".png") ||
            file.endsWith(".jpg") ||
            file.endsWith(".jpeg") ||
            file.endsWith(".gif")
        )
            return <FaImage className="text-green-500 text-2xl" />;

        if (
            file.endsWith(".mp4") ||
            file.endsWith(".avi") ||
            file.endsWith(".mov")
        )
            return <FaVideo className="text-blue-500 text-2xl" />;

        if (
            file.endsWith(".ppt") ||
            file.endsWith(".pptx")
        )
            return (
                <FaFilePowerpoint className="text-orange-500 text-2xl" />
            );

        return <FaFileAlt className="text-gray-500 text-2xl" />;
    };

    return (
        <div className="p-8">

            {/* Header */}

            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">

                <div>
                    <h1 className="text-3xl font-bold">
                        My Content
                    </h1>

                    <p className="text-gray-500">
                        Welcome {user?.name}
                    </p>
                </div>

                <button
                    onClick={() => navigate("/upload")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                >
                    <FaPlus />
                    Upload Content
                </button>

            </div>

            {/* Stats */}

            <div className="grid md:grid-cols-4 gap-5 mb-8">

                <StatCard title="Total" value={stats.total} />

                <StatCard title="Pending" value={stats.pending} />

                <StatCard title="Approved" value={stats.approved} />

                <StatCard title="Rejected" value={stats.rejected} />

            </div>

            {/* Search + Filter */}

            <div className="flex flex-col md:flex-row gap-4 mb-8">

                <div className="relative flex-1">

                    <FaSearch className="absolute left-4 top-4 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded-xl pl-12 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    className="border rounded-xl px-5 py-3"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

            </div>

            {/* Loading */}

            {loading ? (
                <div className="text-center py-20 text-lg">
                    Loading...
                </div>
            ) : filteredData.length === 0 ? (
                <div className="bg-white rounded-3xl shadow p-12 text-center">

                    <FaFileAlt className="text-6xl mx-auto text-gray-300 mb-5" />

                    <h2 className="text-2xl font-bold">
                        No Content Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Upload your first content.
                    </p>

                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">

                    {filteredData.map((item) => (

                        <div
                            key={item._id}
                            className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6"
                        >
                            <div className="flex justify-between items-start">

                                <div className="flex gap-4">

                                    {getFileIcon(item.fileUrl)}

                                    <div>

                                        <h2 className="text-xl font-bold">
                                            {item.title}
                                        </h2>

                                        <p className="text-gray-500">
                                            {item.subject}
                                        </p>

                                    </div>

                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm capitalize font-semibold ${statusClass(
                                        item.status
                                    )}`}
                                >
                                    {item.status}
                                </span>

                            </div>

                            <p className="text-gray-600 mt-5">
                                {item.description ||
                                    "No description provided."}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-600">

                                <div className="flex items-center gap-2">

                                    <FaCalendarAlt />

                                    {new Date(
                                        item.startTime
                                    ).toLocaleDateString()}

                                </div>

                                <div className="flex items-center gap-2">

                                    <FaClock />

                                    {item.rotationDuration} min

                                </div>

                            </div>

                            <div className="mt-6 flex justify-between items-center">

                                <div className="text-sm text-gray-500">
                                    Order : {item.rotationOrder}
                                </div>


                                <button
                                    onClick={() =>
                                        window.open(
                                            `${import.meta.env.VITE_BACKEND_URL}/api/content/view/${item._id}`,
                                            "_blank"
                                        )
                                    }
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"
                                >
                                    View File
                                    <FaExternalLinkAlt size={13} />
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value }) => (
    <div className="bg-white rounded-2xl shadow-md p-6">
        <p className="text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
);

export default MyContent;