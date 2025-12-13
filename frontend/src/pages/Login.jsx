import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

import { useAuth } from "../utils/AuthContext";
import React, { useState, useEffect } from "react"; // Add useEffect
import { GOOGLE_CLIENT_ID } from "../constants/interests"; // Add this import

// Add this constant after imports
const GOOGLE_LOGIN_REDIRECT = `${window.location.origin}/login`;
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Add this after your existing useState declarations
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state === "login") {
      handleGoogleCallback(code);
    }
  }, []);

  // Add this function before handleLogin
  const handleGoogleCallback = async (code) => {
    setLoading(true);
    try {
      const res = await API.post(
        "/user/google-login", // You'll need this backend endpoint
        {
          code,
          redirectUri: GOOGLE_LOGIN_REDIRECT,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const { accessToken, refreshToken, user } = res.data.data;
        console.log(accessToken, refreshToken);

        login();

        if (user.isProfileCompleted) {
          navigate("/");
        } else {
          navigate("/complete-profile");
        }
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert(
        err.response?.data?.message || "Google login failed. Please try again."
      );
      window.history.replaceState({}, document.title, "/login");
    } finally {
      setLoading(false);
    }
  };

  // Add this function
  const handleGoogleLogin = () => {
    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_LOGIN_REDIRECT)}` +
      `&response_type=code&scope=openid%20email%20profile` +
      `&state=login`;
  };

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/user/login", {
        email,
        password,
      });
      console.log("Full Response:", res);
      if (res.status === 200) {
        const { accessToken, refreshToken, user } = res.data.data;
        console.log(accessToken, refreshToken);

        login();

        if (res.data.data.user.isProfileCompleted) {
          console.log("it made it here");
          navigate("/");
        } else {
          navigate("/complete-profile");
        }
      } else {
        console.error("Login failed with status:", res.status);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex fle-col items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-lg:mx-auto">
            <form className="space-y-6">
              <div className="mb-12">
                <h1 className="text-slate-900 text-3xl font-semibold">
                  Sign in
                </h1>
                <p className="text-slate-600 text-[15px] mt-6 leading-relaxed">
                  Sign in to your account and explore a world of possibilities.
                  Your journey begins here.
                </p>
              </div>

              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    name="username"
                    type="text"
                    required
                    className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter user name"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="10"
                      cy="7"
                      r="6"
                      data-original="#000000"
                    ></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      type={showPassword ? "text" : "password"} // toggle input type
                      required
                      className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                      placeholder="Enter password"
                    />
                    <svg
                      onClick={() => setShowPassword((prev) => !prev)} // toggle on click
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        // Eye Off Icon (Password is visible)
                        <path
                          d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.757 0-5-2.243-5-5 
        0-1.084.347-2.087.934-2.906l6.972 6.972c-.819.587-1.822.934-2.906.934zm4.066-2.094-6.972-6.972c.819-.587 
        1.822-.934 2.906-.934 2.757 0 5 2.243 5 5 0 1.084-.347 2.087-.934 2.906z"
                        />
                      ) : (
                        // Eye Icon (Password is hidden)
                        <path
                          d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 
        5-5 5 2.243 5 5-2.243 5-5 5zm0-8c-1.657 0-3 1.343-3 
        3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                        />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-slate-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="jajvascript:void(0);"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className="!mt-12">
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer flex items-center justify-center"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Sign in"
                  )}
                </button>
                {/* Add this after your Sign in button, before the "Don't have an account" text */}
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-slate-300"></div>
                  <span className="flex-shrink mx-4 text-slate-600 text-sm">
                    Or
                  </span>
                  <div className="flex-grow border-t border-slate-300"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
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
                  Sign in with Google
                </button>

                <p className="text-sm !mt-6 text-center text-slate-600">
                  Don't have an account{" "}
                  <a
                    onClick={() => navigate("/signup")}
                    className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
                  >
                    Register here
                  </a>
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
}

export default Login;
