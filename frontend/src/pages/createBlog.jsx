import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { INTEREST_OPTIONS } from "../constants/interests";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [markdownFile, setMarkdownFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full p-3 border rounded-xl"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="block text-sm font-medium mb-2">
          Cover Image (JPEG/PNG):
        </label>
        <input
          type="file"
          accept="image/*"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setCoverImage(e.target.files[0])}
          required
        />
        <label className="block text-sm font-medium mb-2">
          Markdown File (README.md):
        </label>

        <input
          type="file"
          accept=".md"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setMarkdownFile(e.target.files[0])}
          required
        />

        <Select
          isMulti
          name="interests"
          options={INTEREST_OPTIONS}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select interests..."
          onChange={setInterests}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
