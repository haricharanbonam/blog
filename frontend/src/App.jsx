import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import CreateBlog from "./pages/createBlog";
import ProfileCompletion from "./pages/ProfileCompletion";
import Profile from "./pages/Profile";
import Followers from "./components/Followers";
function AppWrapper() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Blog />
            </PrivateRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <PrivateRoute>
              <ViewBlog />
            </PrivateRoute>
          }
        />
        <Route
          path="/complete-profile"
          element={
            <PrivateRoute>
              <ProfileCompletion />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/email-sent" element={<EmailSentWrapper />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateBlog />
            </PrivateRoute>
          }
        />
        <Route
          path="/followers/:username"
          element={
            <PrivateRoute>
              <Followers />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
