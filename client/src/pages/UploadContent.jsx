import React, { useState } from "react";
import { uploadContent } from "../services/ContentService";
import {FaCloudUploadAlt,FaFileAlt,FaTimes} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UploadContent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    startTime: "",
    endTime: "",
    rotationDuration: 5,
    rotationOrder: 1,
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.subject ||
      !form.startTime ||
      !form.endTime ||
      !file
    ) {
      return toast.error("Please fill all required fields.");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("subject", form.subject);
      formData.append("startTime", form.startTime);
      formData.append("endTime", form.endTime);
      formData.append("rotationDuration", form.rotationDuration);
      formData.append("rotationOrder", form.rotationOrder);
      formData.append("file", file);

      const res = await uploadContent(formData);

      if (res.success) {
        toast.success("Content uploaded successfully!");
        navigate('/my-content');

        setForm({
          title: "",
          description: "",
          subject: "",
          startTime: "",
          endTime: "",
          rotationDuration: 5,
          rotationOrder: 1,
        });

        setFile(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Upload failed.");
      console.error("Error uploading content:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-2">
          Upload Content
        </h2>

        <p className="text-gray-500 mb-8">
          Upload files for broadcasting to students.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* Upload Area */}

          <label
            className="border-2 border-dashed border-indigo-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition"
          >
            <FaCloudUploadAlt
              className="text-6xl text-indigo-600 mb-3"
            />

            <p className="font-semibold text-lg">
              Click to upload
            </p>

            <p className="text-sm text-gray-500">
              PDF, Image, PPT, Video
            </p>

            <input
              type="file"
              className="hidden"
              onChange={handleFile}
            />
          </label>

          {file && (
            <div className="flex items-center justify-between bg-gray-100 rounded-xl px-5 py-3">

              <div className="flex items-center gap-3">

                <FaFileAlt className="text-indigo-600"/>

                <span>{file.name}</span>

              </div>

              <button
                type="button"
                onClick={removeFile}
              >
                <FaTimes className="text-red-500"/>
              </button>

            </div>
          )}

          {/* Title */}

          <div>
            <label className="font-medium">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}

          <div>

            <label className="font-medium">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write description..."
              className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          {/* Subject */}

          <div>

            <label className="font-medium">
              Subject
            </label>

            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Subject</option>
              <option>Mathematics</option>
              <option>Computer Science</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>English</option>
              <option>Placement</option>
            </select>

          </div>

          {/* Times */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label>Start Time</label>

              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="mt-2 w-full border rounded-xl px-4 py-3"
              />

            </div>

            <div>

              <label>End Time</label>

              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="mt-2 w-full border rounded-xl px-4 py-3"
              />

            </div>

          </div>

          {/* Rotation */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label>Rotation Duration (minutes)</label>

              <input
                type="number"
                name="rotationDuration"
                value={form.rotationDuration}
                onChange={handleChange}
                className="mt-2 w-full border rounded-xl px-4 py-3"
              />

            </div>

            <div>

              <label>Rotation Order</label>

              <input
                type="number"
                name="rotationOrder"
                value={form.rotationOrder}
                onChange={handleChange}
                className="mt-2 w-full border rounded-xl px-4 py-3"
              />

            </div>

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Uploading..." : "Upload Content"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default UploadContent;