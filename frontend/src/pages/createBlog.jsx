import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { INTEREST_OPTIONS } from "../constants/interests";
import Navbar from "../components/NavBar";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [markdownFile, setMarkdownFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#2a2a2a",
      borderColor: state.isFocused ? "#a855f7" : "rgba(255, 255, 255, 0.1)",
      color: "white",
      padding: "5px",
      borderRadius: "0.75rem",
      boxShadow: state.isFocused ? "0 0 0 1px #a855f7" : "none",
      "&:hover": {
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#2a2a2a",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#3a3a3a" : "#2a2a2a",
      color: "white",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#4a4a4a",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#3a3a3a",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#d1d5db",
      ":hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async () => {
      const markdownText = reader.result;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", markdownText);
      formData.append("coverImage", coverImage);
      formData.append(
        "interests",
        JSON.stringify(interests.map((i) => i.value))
      );

      try {
        const res = await API.post("/blog/create", formData, {
          withCredentials: true,
        });
        alert("Blog created successfully");
        navigate("/");
      } catch (error) {
        console.error("Error creating blog:", error);
        alert("Failed to create blog");
      }
    };
    if (markdownFile) {
      reader.readAsText(markdownFile);
    } else {
      alert("Please upload a README.md file");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-[#1a1a1a] rounded-2xl shadow-lg shadow-purple-900/10 border border-white/10 p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Create New Blog</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">Blog Title</label>
                <input
                type="text"
                placeholder="Enter an engaging title..."
                className="w-full p-4 bg-[#2a2a2a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
            </div>
            
            <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                Cover Image (JPEG/PNG)
                </label>
                <input
                type="file"
                accept="image/*"
                className="w-full p-3 bg-[#2a2a2a] border border-white/10 rounded-xl text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
                onChange={(e) => setCoverImage(e.target.files[0])}
                required
                />
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                Markdown File (README.md)
                </label>
                <input
                type="file"
                accept=".md"
                className="w-full p-3 bg-[#2a2a2a] border border-white/10 rounded-xl text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
                onChange={(e) => setMarkdownFile(e.target.files[0])}
                required
                />
                <p className="text-sm text-gray-500 mt-2">
                Don’t have a Markdown file?{" "}
                <a
                    href="https://dillinger.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                >
                    Click here
                </a>{" "}
                to create one.
                </p>
            </div>

            <div>
                 <label className="block text-gray-400 text-sm mb-2 font-medium">
                Topics & Interests
                </label>
                <Select
                    isMulti
                    name="interests"
                    options={INTEREST_OPTIONS}
                    styles={customStyles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select relevant topics..."
                    onChange={setInterests}
                />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition duration-300 shadow-lg shadow-purple-900/20 mt-4"
            >
              🚀 Publish Blog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
