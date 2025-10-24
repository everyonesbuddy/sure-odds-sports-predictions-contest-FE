import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contestName = searchParams.get("contest");

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
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", color: "#ff5555" }}
      >
        ❌ Payment Cancelled
      </Typography>
      <Typography sx={{ mb: 3 }}>
        You can retry payment to enter the contest.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(`/contest/${encodeURIComponent(contestName)}`)}
        sx={{
          backgroundColor: "#ffcc00",
          color: "#000",
          fontWeight: "bold",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#ffdb4d" },
        }}
      >
        Return to Contest
      </Button>
    </Box>
  );
};

export default PaymentCancelled;
