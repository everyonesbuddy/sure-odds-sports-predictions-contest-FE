import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../css/SignupForm.css";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        "https://sure-odds-be-5f8d8ba5995a.herokuapp.com/api/v1/auth/signup",
        {
          name,
          email,
          password,
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
        <button type="submit">Sign Up</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default SignupForm;
