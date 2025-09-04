import { useEffect, useState } from "react";

const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Use consistent storage and key name
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  return { isLoggedIn };
};

export default useAuthStatus;
