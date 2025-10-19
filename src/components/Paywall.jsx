import React, { useState, useEffect } from "react";
import {
  TextField,
  Card,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const Paywall = ({
  contestName,
  spreadsheetUrl,
  contestPrimaryPrize,
  contestLeague,
  contestEndDate,
  contestStartDate,
  currentUserBetsForContest,
  availablePicks,
  entryFee,
}) => {
  const [code, setCode] = useState("");
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);
  const [countdownMessage, setCountdownMessage] = useState("");
  const { token, updateRegisteredContests } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCodeSubmit = async () => {
    setIsCodeSubmitting(true);
    try {
      const response = await fetch(
        "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/codes/submitCode",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Refresh user data in AuthProvider
        await updateRegisteredContests({
          name: contestName,
          accessCodeUsed: code,
          startDate: contestStartDate,
          endDate: contestEndDate,
        });

        setCode("");
        toast.success("Code applied successfully!");
      } else {
        toast.error(data.message || "Invalid or already used code.");
      }
    } catch (error) {
      console.error("Error validating code:", error);
      toast.error("Failed to validate code. Please try again.");
    } finally {
      setIsCodeSubmitting(false);
    }
  };

  const calculateDuration = (start, end) => {
    const currentDate = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (currentDate < startDate) {
      const durationInMilliseconds = startDate - currentDate;
      const durationInDays = Math.floor(
        durationInMilliseconds / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

      return {
        duration: durationInMilliseconds,
        message: `Contest starts in ${durationInDays} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`,
      };
    } else if (currentDate < endDate) {
      const durationInMilliseconds = endDate - currentDate;
      const durationInDays = Math.floor(
        durationInMilliseconds / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

      return {
        duration: durationInMilliseconds,
        message: `Contest ends in ${durationInDays} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`,
      };
    } else {
      return {
        duration: 0,
        message: `The contest has ended.`,
      };
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { message } = calculateDuration(contestStartDate, contestEndDate);
      setCountdownMessage(message);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [contestStartDate, contestEndDate]);
  return (
    <>
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
          {/* 🔥 Header */}
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
            🔥 Enter the Contest – Win Cash & Bragging Rights!
          </Typography>

          {/* 🕒 Countdown */}
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : "16px",
              color: "#ccc",
              mb: isMobile ? 2 : 3,
            }}
          >
            {countdownMessage}
          </Typography>

          {/* 🟡 Step 1: Get Access Code */}
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
              Step 1: Get Your Access Code
            </Typography>

            <Button
              variant="contained"
              href="https://buy.stripe.com/9B63cwg3P142c5T8aM6Ri08"
              target="_blank"
              rel="noopener noreferrer"
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
              Unlock Entry for ₦{entryFee}
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "#aaa",
                mt: 1.5,
              }}
            >
              One-time payment. No subscription. Use your local or dollar card
              for easy checkout.
            </Typography>
          </Box>

          {/* 🟣 Step 2: Apply Access Code */}
          <Box
            sx={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              p: isMobile ? 2 : 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: isMobile ? "14px" : "18px",
                mb: isMobile ? 1 : 2,
                color: "#4F46E5",
              }}
            >
              Step 2: Enter Your Access Code
            </Typography>

            <TextField
              label="Have a Code? Enter it Here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  borderRadius: "8px",
                  height: "38px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "& input": {
                    height: "38px",
                    padding: "10px",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: isMobile ? "13px" : "15px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                  fontSize: isMobile ? "13px" : "15px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#fff" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff" },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleCodeSubmit}
              disabled={isCodeSubmitting}
              fullWidth
              sx={{
                backgroundColor: "#4F46E5",
                fontWeight: "bold",
                borderRadius: "8px",
                py: 1.2,
                fontSize: isMobile ? "14px" : "16px",
                "&:hover": {
                  backgroundColor: "#3E3BA7",
                  transform: "scale(1.05)",
                },
              }}
            >
              {isCodeSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Apply Code & Enter Contest"
              )}
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Paywall;
