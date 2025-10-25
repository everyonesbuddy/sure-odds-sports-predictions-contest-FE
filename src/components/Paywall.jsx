import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const Paywall = ({
  contestName,
  contestEndDate,
  contestStartDate,
  availablePicks,
  entryFee,
}) => {
  const [countdownMessage, setCountdownMessage] = useState("");
  const { token, user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleStripeCheckout = async () => {
    if (!token || !user?._id) {
      toast.error("You must be logged in to enter the contest.");
      return;
    }

    try {
      const response = await fetch(
        "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            contestName,
            price: entryFee,
            startDate: new Date(contestStartDate).toISOString(),
            endDate: new Date(contestEndDate).toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        window.location.href = data.url; // Redirect to Stripe payment page
      } else {
        toast.error(data.message || "Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("Failed to initiate payment. Try again.");
    }
  };

  const calculateDuration = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    let duration = 0;
    let message = "";

    if (now < startDate) {
      duration = startDate - now;
      message = `Contest starts in ${Math.floor(
        duration / (1000 * 60 * 60 * 24)
      )}d ${Math.floor((duration / (1000 * 60 * 60)) % 24)}h ${Math.floor(
        (duration / (1000 * 60)) % 60
      )}m`;
    } else if (now < endDate) {
      duration = endDate - now;
      message = `Contest ends in ${Math.floor(
        duration / (1000 * 60 * 60 * 24)
      )}d ${Math.floor((duration / (1000 * 60 * 60)) % 24)}h ${Math.floor(
        (duration / (1000 * 60)) % 60
      )}m`;
    } else {
      message = "The contest has ended.";
    }

    return { duration, message };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { message } = calculateDuration(contestStartDate, contestEndDate);
      setCountdownMessage(message);
    }, 1000);

    return () => clearInterval(interval);
  }, [contestStartDate, contestEndDate]);

  return (
    <Box
      sx={{
        textAlign: "center",
        color: "#fff",
        py: isMobile ? 3 : 4,
        width: isMobile ? "100%" : "600px",
        margin: "auto",
      }}
    >
      <Card
        sx={{
          borderRadius: "16px",
          background: "#2b2b2b",
          color: "#fff",
          p: isMobile ? 2 : 4,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontSize: isMobile ? "20px" : "30px",
            color: "#f5f5f5",
            textAlign: "center",
            pb: isMobile ? 2 : 4,
          }}
        >
          🔥 Join {contestName} – Win Cash & Bragging Rights!
        </Typography>

        {/* Countdown */}
        <Typography
          sx={{
            fontSize: isMobile ? "12px" : "16px",
            color: "#ccc",
            mb: isMobile ? 2 : 3,
          }}
        >
          {countdownMessage}
        </Typography>

        {/* Payment CTA */}
        <Box
          sx={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            p: isMobile ? 2 : 3,
            mb: isMobile ? 3 : 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "18px",
              mb: isMobile ? 1 : 2,
              color: "#ffcc00",
            }}
          >
            Enter Now for ₦{entryFee}
          </Typography>

          <Button
            variant="contained"
            onClick={handleStripeCheckout}
            sx={{
              fontSize: isMobile ? "12px" : "14px",
              py: isMobile ? 0.8 : 1.2,
              px: isMobile ? 2 : 3,
              backgroundColor: "#ffcc00",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#ffdb4d",
                transform: "scale(1.05)",
              },
            }}
          >
            Pay & Join Contest
          </Button>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#aaa",
              mt: 1.5,
            }}
          >
            One-time payment. No subscription. Use your local or dollar card for
            easy checkout.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Paywall;
