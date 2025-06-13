import { useLocation, Navigate } from "react-router-dom";
import EmailSent from "../pages/EmailSent";
const EmailSentWrapper = () => {
  const location = useLocation();
  const email = location.state?.email;
  if (!email) return <Navigate to="/signup" />;
  return <EmailSent email={email} />;
};
export default EmailSentWrapper;
