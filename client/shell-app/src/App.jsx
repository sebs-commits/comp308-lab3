// shell-app/src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { useQuery, gql } from "@apollo/client";
import "./App.css";

const AuthApp = lazy(() => import("authApp/App"));
const VitalsApp = lazy(() => import("vitalsApp/App"));

// GraphQL query to check the current user's authentication status
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      username
    }
  }
`;
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "network-only",
    onError: (error) => {
      console.error("Authentication error:", error);
      setIsLoggedIn(false);
    }
  });

  useEffect(() => {
    const handleLoginSuccess = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
    };

    const handleLogout = () => {
      setIsLoggedIn(false);
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);
    window.addEventListener("logout", handleLogout);

    if (!loading && !error) {
      setIsLoggedIn(!!data?.currentUser);
    }

    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
      window.removeEventListener("logout", handleLogout);
    };
  }, [loading, error, data]);

  if (loading) return <div>Loading authentication status...</div>;
  if (error) return <div>Authentication Error: {error.message}</div>;

  return (
    <div className="App">
      <Suspense fallback={<div>Loading application...</div>}>
        {!isLoggedIn ? <AuthApp /> : <VitalsApp />}
      </Suspense>
    </div>
  );
}

export default App;
