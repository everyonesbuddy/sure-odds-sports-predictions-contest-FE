import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    toast.success("Login successful!");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logout successful!");
  };

  // Function to update registered contests
  const updateRegisteredContests = async (contestData) => {
    try {
      const response = await axios.post(
        "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/users/register",
        contestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update only the registeredContests field while preserving the rest of the user structure
        const updatedUser = {
          ...user,
          registeredContests: response.data.data.registeredContests, // Update registeredContests
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update local storage
        toast.success("Registered contest updated successfully!");
      } else {
        toast.error("Failed to update registered contests.");
      }
    } catch (error) {
      console.error("Failed to update registered contests:", error);
      toast.error("Failed to update registered contests.");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateRegisteredContests,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
