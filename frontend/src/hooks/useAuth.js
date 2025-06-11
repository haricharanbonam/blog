import { useEffect, useState } from "react";

const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  return { isLoggedIn };
};

export default useAuthStatus;
