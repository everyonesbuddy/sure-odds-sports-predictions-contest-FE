import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../css/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/auth/login", // Api endpoint for login
        {
          email,
          password,
        }
      );
      login(response.data.data.user, response.data.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#4F46E5",
          }}
        >
          Login
        </button>
        {error && <div className="error">{error}</div>}
      </form>
      <p
        style={{
          marginTop: "1.5rem",
          fontSize: "0.9rem",
          color: "#000",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Don't have an account yet?{" "}
        <Link
          to="/signup"
          style={{
            color: "#4F46E5",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Register
        </Link>{" "}
      </p>
    </div>
  );
};

export default LoginForm;
