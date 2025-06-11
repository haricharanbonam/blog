import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import PrivateRoute from "./components/Auth";
import ViewBlog from "./pages/ViewBlog";
import EmailSentWrapper from "./routes/EmailWrapper";
import SignupForm from "./pages/Signup";
import Navbar from "./components/NavBar";
import NotFound from "./pages/NotFound";
import PublicRoute from "./components/PublicRoute";
import useAuthStatus from "./hooks/useAuth";
function App() {
  const { isLoggedIn } = useAuthStatus();

  return (
    <>
    
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isLoggedIn}>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute isAuthenticated={isLoggedIn}>
              <SignupForm />
            </PublicRoute>
          }
        />

        <Route
          path="/blog"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <Blog />
            </PrivateRoute>
          }
        />

        <Route
          path="/blog/:id"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <ViewBlog />
            </PrivateRoute>
          }
        />

        <Route path="/email-sent" element={<EmailSentWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
