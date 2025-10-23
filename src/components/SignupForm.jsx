import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../css/SignupForm.css";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for password match
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/auth/signup", // Api endpoint for signup
        {
          name,
          email,
          password,
          userName,
          passwordConfirm,
        }
      );
      login(response.data.data.user, response.data.data.token);
      toast.success("Signup successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
      toast.error(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#4F46E5",
          }}
        >
          Sign Up
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
        By creating an account, you agree to our{" "}
        <Link
          to="/terms-and-conditions"
          style={{
            color: "#4F46E5",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Terms & Conditions
        </Link>{" "}
        and confirm that you are at least 18 years old and that all information
        provided is true.
      </p>
    </div>
  );
};

export default SignupForm;
