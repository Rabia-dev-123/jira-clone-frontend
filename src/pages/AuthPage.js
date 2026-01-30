import React from "react";
import Signup from "./Auth/Signup";
import Login from "./Auth/LoginPage";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  return (
    <div>
      {isSignup ? <Signup /> : <Login />}
    </div>
  );
};

export default AuthPage;
