import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
const EmailSent = ({ email }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-blue-200">
        <FontAwesomeIcon
          icon={faEnvelope}
          className="text-blue-600 text-6xl mb-6 animate-bounce"
        />
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-6">
          A verification link has been sent to <br />
          <span className="font-medium text-blue-700">{email}</span>
        </p>
        <p className="text-sm text-gray-500">
          Please check your inbox and click on the link to verify your email.
        </p>
        <p
          onClick={() => (window.location.href = "/login")}
          className="text-md font-bold cursor-pointer text-blue-500"
        >
          Click Here To Login
        </p>
      </div>
    </div>
  );
};

export default EmailSent;
