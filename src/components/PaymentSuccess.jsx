import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contestName = searchParams.get("contest");
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleSuccess = async () => {
      if (refreshUser) await refreshUser(); // ✅ Refresh user data
      if (contestName) {
        navigate(`/contest/${encodeURIComponent(contestName)}`);
      } else {
        navigate("/");
      }
    };

    const timer = setTimeout(handleSuccess, 3000);

    return () => clearTimeout(timer);
  }, [contestName, navigate, refreshUser]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        ✅ Payment Successful!
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Redirecting you to your contest in a few seconds...
      </Typography>
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default PaymentSuccess;
