import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import API from "../utils/axios";
import { INTERESTS } from "../constants/interests";


const ProfileCompletion = () => {
  const navigate = useNavigate();
  const [about, setAbout] = useState("");
  const [profession, setProfession] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post(
        "/user/setInterests",
        {
          interests: selectedInterests,
          aboutme:about,
          Profession:profession
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        navigate("/");
      } else {
        console.log("Unexpected response status:", res.status);
      }
    } catch (err) {
      console.error("Something went wrong:", err.response?.data || err.message);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-700">
        Complete Your Profile
      </h1>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">
          Tell us about yourself
        </label>
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows="4"
          placeholder="Write a few lines..."
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">
          Your Profession
        </label>
        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="" disabled>
            Select your profession
          </option>
          <option value="Student">Student</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Teacher">Teacher</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Choose Your Interests
        </label>
        <div className="flex flex-wrap gap-3">
          {INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${
                  isSelected
                    ? "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {isSelected ? <FaMinus /> : <FaPlus />} {interest}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileCompletion;
