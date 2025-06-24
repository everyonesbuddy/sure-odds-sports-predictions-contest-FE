import React, { useState, useEffect } from "react";
import {
  TextField,
  Card,
  Typography,
  Button,
  Box,
  List,
  ListItem,
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
  contestTotalPrize,
  contestLeague,
  contestEndDate,
  contestStartDate,
  currentUserBetsForContest,
  availableFreePicks,
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
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              fontSize: isMobile ? "20px" : "30px",
              color: "#f5f5f5",
              textAlign: "center",
              pb: isMobile ? 1 : 4,
            }}
          >
            🔥 Enter the Contest – Win Cash & Bragging Rights!
          </Typography>

          {/* Contest Details List */}
          <List
            sx={{
              fontSize: isMobile ? "14px" : "18px",
              fontWeight: "500",
              color: "#ccc",
              p: 0,
            }}
          >
            <ListItem
              sx={{
                fontSize: isMobile ? "10px" : "18px",
                color: "#f5f5f5",
                pb: isMobile ? 0.5 : 2,
              }}
            >
              {countdownMessage}
            </ListItem>

            <ListItem>
              <Button
                variant="contained"
                href="https://buy.stripe.com/28odRT1518lJgj63cg"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: isMobile ? "10px" : "12px",
                  py: isMobile ? 0.6 : 0.8,
                  px: isMobile ? 1.8 : 2.5,
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
                Unlock Entry for $4.99 – Get Your Access Code
              </Button>
            </ListItem>
          </List>

          <Box sx={{ textAlign: "center", mt: isMobile ? 1 : 2 }}>
            <>
              <Box sx={{ mt: isMobile ? 1.5 : 2 }}>
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
                <Typography variant="caption" sx={{ color: "#aaa", mt: 1 }}>
                  One-time payment. No subscription. 100% of entry fees go
                  toward the prize pool.
                </Typography>
              </Box>
            </>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Paywall;
