import React, { useEffect, useMemo, useState } from "react";
import { Search, BookOpen, Download, ExternalLink, User } from "lucide-react";
import { getAllApprovedContent, getContentBySubject } from "../services/ContentService";

const StudentDashboard = () => {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchAllContent = async () => {
    try {
      setLoading(true);

      const res = await getAllApprovedContent();

      if (res.success) {
        setFiles(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = async (value) => {
    setSubject(value);

    if (value === "All") {
      fetchAllContent();
      return;
    }

    try {
      setLoading(true);

      const res = await getContentBySubject(value);

      if (res.success) {
        setFiles(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContent();
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [files, search]);

  const subjects = [
    "All",
    ...new Set(files.map((item) => item.subject)),
  ];

  return (
    <div className="space-y-8">

      {/* Heading */}

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Student Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Browse all approved study materials.
        </p>

      </div>

      {/* Search + Filter */}

      <div className="flex flex-col md:flex-row gap-4">

        <div className="flex items-center bg-white border rounded-xl px-4 py-3 flex-1">

          <Search className="w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search by title..."
            className="ml-3 w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <select
          value={subject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="bg-white border rounded-xl px-4"
        >
          {subjects.map((sub) => (
            <option key={sub}>{sub}</option>
          ))}
        </select>

      </div>

      {/* Cards */}

      {loading ? (

        <div className="text-center py-20 text-gray-500">
          Loading...
        </div>

      ) : filteredFiles.length === 0 ? (

        <div className="bg-white rounded-xl p-12 text-center shadow">

          <BookOpen className="mx-auto w-12 h-12 text-gray-300" />

          <h2 className="text-xl font-semibold mt-4">
            No Files Found
          </h2>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredFiles.map((file) => (

            <div
              key={file._id}
              className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition p-6"
            >

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <BookOpen className="text-indigo-600" />

                </div>

                <div>

                  <h2 className="font-semibold text-gray-800">
                    {file.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {file.subject}
                  </p>

                </div>

              </div>

              <div className="mt-6 space-y-2 text-sm">

                <p className="flex items-center gap-2">

                  <User size={16} />

                  <span className="font-medium">
                    Uploaded By:
                  </span>

                  {file.uploadedBy?.name}

                </p>

                <p>

                  <span className="font-medium">
                    Uploaded On:
                  </span>{" "}

                  {new Date(file.createdAt).toLocaleDateString()}

                </p>

              </div>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() =>
                    window.open(
                      `${import.meta.env.VITE_BACKEND_URL}/api/content/view/${file._id}`,
                      "_blank"
                    )
                  }
                  className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 transition"
                >
                  <ExternalLink size={18} />
                  View
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `${import.meta.env.VITE_BACKEND_URL}/api/content/download/${file._id}`,
                      "_blank"
                    )
                  }
                  className="flex-1 flex justify-center items-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
                >
                  <Download size={18} />
                  Download
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

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

export default StudentDashboard;