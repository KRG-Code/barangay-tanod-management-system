import React from "react";
import { Navigate } from "react-router-dom";
import { useCombinedContext } from "../contexts/useContext";

export default function ProtectedRoute({ userTypeAllowed, children }) {
  const { userType } = useCombinedContext();

  // If user is not logged in or doesn't have the allowed user type, redirect them
  if (!userType || !userTypeAllowed.includes(userType)) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the children components (the protected route content)
  return children;
}
