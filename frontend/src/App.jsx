import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import PrivateRoute from "./components/Auth";
import ViewBlog from "./pages/ViewBlog";
import EmailSentWrapper from "./routes/EmailWrapper";
import SignupForm from "./pages/Signup";
import NotFound from "./pages/NotFound";
import CreateBlog from "./pages/createBlog";
import ProfileCompletion from "./pages/ProfileCompletion";
import Profile from "./pages/Profile";
import Followers from "./components/Followers";
import { AuthProvider,useAuth } from "./utils/AuthContext";

function AppWrapper() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Authenticating user...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />

      <Route
        path="/"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Blog />
          </PrivateRoute>
        }
      />

      <Route
        path="/blog/:id"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ViewBlog />
          </PrivateRoute>
        }
      />

      <Route
        path="/complete-profile"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ProfileCompletion />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/:username"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route path="/email-sent" element={<EmailSentWrapper />} />
      <Route path="*" element={<NotFound />} />

      <Route
        path="/create"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <CreateBlog />
          </PrivateRoute>
        }
      />

      <Route
        path="/followers/:username"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Followers />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </Router>
  );
}
