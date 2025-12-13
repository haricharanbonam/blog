import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { GOOGLE_CLIENT_ID } from "../constants/interests";


const SignupForm = () => {
  const navigate = useNavigate();
  const GOOGLE_SIGNUP_REDIRECT = `${window.location.origin}/signup`;
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state === "signup") {
      handleGoogleCallback(code);
    }
  }, []);

  const handleGoogleCallback = async (code) => {
    try {
      const res = await API.post(
        "/user/google-register",
        {
          code,
          redirectUri: GOOGLE_SIGNUP_REDIRECT,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.status === 200) {
        setMessage("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      console.log(err.response);
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Google sign up failed. Please try again.");
      }
      window.history.replaceState({}, document.title, "/signup");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_SIGNUP_REDIRECT)}` +
      `&response_type=code&scope=openid%20email%20profile` +
      `&state=signup`;
  };
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleLogin = () => {
    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_LOGIN_REDIRECT)}` +
      `&response_type=code&scope=openid%20email%20profile`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/user/register", formData, {
        withCredentials: true,
      });

      if (res.status === 201) {
        setMessage("Registration successful!");
        navigate("/email-sent", { state: { email: formData.email } });
      }
    } catch (err) {
      console.log(err.response);
      if (err.response?.status === 409 && err.response.data?.message) {
        setMessage(err.response.data.message); // "User with email / username already exists"
      } else if (err.response?.data?.message) {
        setMessage(err.response.data.message); // Any other backend message
      } else {
        setMessage("Something went wrong. Please try again."); // Network/server error
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          {/* LEFT: Form */}
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-lg:mx-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-12">
                <h1 className="text-slate-900 text-3xl font-semibold">
                  Sign Up
                </h1>
                <p className="text-slate-600 text-[15px] mt-6 leading-relaxed">
                  Sign up to your account and explore a world of possibilities.
                  Your journey begins here.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">
                  Full Name
                </label>
                <input
                  onChange={handleChange}
                  name="fullName"
                  type="text"
                  required
                  className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter full name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">
                  Username
                </label>
                <input
                  onChange={handleChange}
                  name="username"
                  type="text"
                  required
                  className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">
                  Email
                </label>
                <input
                  onChange={handleChange}
                  name="email"
                  type="email"
                  required
                  className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">
                  Password
                </label>
                <input
                  onChange={handleChange}
                  name="password"
                  type="password"
                  required
                  className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">
                  Confirm Password
                </label>
                <input
                  onChange={handleChange}
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Confirm password"
                />
              </div>

              {/* Submit */}
              <div className="!mt-12">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
                >
                  Sign Up
                </button>
                {/* Add this after your regular Sign Up button */}
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-slate-300"></div>
                  <span className="flex-shrink mx-4 text-slate-600 text-sm">
                    Or
                  </span>
                  <div className="flex-grow border-t border-slate-300"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:outline-none cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>
                <p className="text-sm !mt-6 text-center text-slate-600">
                  Already have an account{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap cursor-pointer"
                  >
                    Login Here
                  </span>
                </p>
                <p className="text-sm text-center text-red-600 mt-4">
                  {message}
                </p>
              </div>
            </form>
          </div>

          <div className="max-lg:mt-8">
            <div className="w-full aspect-[71/50] max-lg:w-4/5 mx-auto flex items-center justify-center">
              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-[#5A3BFF]">
                BlogX
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
