// user-app/src/UserComponent.jsx
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./index.css";
// GraphQL mutations
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password)
  }
`;

function UserComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: () => {
      // Dispatch custom event upon successful login
      window.dispatchEvent(
        new CustomEvent("loginSuccess", { detail: { isLoggedIn: true } })
      );
    },
    onError: (error) => setAuthError(error.message || "Login failed"),
  });

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => {
      alert("Registration successful! Please log in.");
      setActiveTab("login"); // Switch to login view
    },
    onError: (error) => setAuthError(error.message || "Registration failed"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError("");

    if (!username || !password) {
      setAuthError("Username and password are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (activeTab === "login") {
        await login({ variables: { username, password } });
      } else {
        await register({ variables: { username, password } });
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={() => setActiveTab("login")}
          disabled={isSubmitting}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          disabled={isSubmitting}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {authError && <div>{authError}</div>}
        
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : activeTab === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}

export default UserComponent;
