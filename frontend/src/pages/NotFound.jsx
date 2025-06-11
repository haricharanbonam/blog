// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl font-bold text-indigo-600">404</h1>
      <p className="mt-4 text-lg text-gray-700">Page Not Found</p>
      <p className="mb-6 text-sm text-gray-500">
        The page you're looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
