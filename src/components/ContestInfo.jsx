import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const ContestInfo = ({
  contestName,
  spreadsheetUrl,
  contestPrimaryPrize,
  contestLeague,
  contestEndDate,
  contestStartDate,
  currentUserBetsForContest,
  aggregateBets,
  availableFreePicks,
  contestType,
}) => {
  const [countdownMessage, setCountdownMessage] = useState("");
  const [participantsUsername, setParticipantsUsername] = useState("");

  const { user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const calculateAvailableFreePicksLeft = () => {
    const userBets = aggregateBets.find(
      (bet) => bet.username === participantsUsername
    );
    const betsPlaced = userBets ? userBets.numberOfBets : 0;

    // Available free picks minus bets already submitted (ignores local state picks)
    return Math.max(availableFreePicks - betsPlaced, 0);
  };

  useEffect(() => {
    if (user && user.email) {
      setParticipantsUsername(user.userName);
      // setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { message } = calculateDuration(contestStartDate, contestEndDate);
      setCountdownMessage(message);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [contestStartDate, contestEndDate]);

  // const generatePayoutTiers = (totalPrize) => {
  //   const percentages = [
  //     0.28, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.04, 0.02, 0.02,
  //   ];
  //   return percentages.map((pct, index) => ({
  //     rank: index + 1,
  //     amount: (totalPrize * pct).toFixed(2),
  //   }));
  // };
  const generatePayoutTiers = (totalPrize, contestType, availableFreePicks) => {
    if (contestType === "Pickem") {
      const percentages = [
        0.28, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.04, 0.02, 0.02,
      ];
      return percentages.map((pct, index) => ({
        rank: index + 1,
        amount: (totalPrize * pct).toFixed(2),
      }));
    } else if (contestType === "Streak") {
      // Detailed payout structure for streak contests
      return [
        {
          condition: `Achieve a perfect streak of ${availableFreePicks} for ${availableFreePicks}`,
          message: `You must win all ${availableFreePicks} picks to qualify for the prize.`,
          amount: `$${totalPrize}`,
        },
        {
          condition: `If no one achieves a perfect streak`,
          message: `The prize will roll over to the next contest.`,
          amount: `No payout for this contest.`,
        },
        {
          condition: `Tiebreaker rules`,
          message: `If multiple participants achieve the same streak, the prize will be split evenly.`,
          amount: `Prize shared equally.`,
        },
        {
          condition: `Example`,
          message: `If 3 participants achieve a streak of ${availableFreePicks}, each will receive $${(
            totalPrize / 3
          ).toFixed(2)}.`,
          amount: `Split prize.`,
        },
      ];
    }
    return [];
  };

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          color: "#fff",
          py: isMobile ? 1 : 2,
          width: isMobile ? "100%" : "600px",
          margin: "auto",
        }}
      >
        <Card
          sx={{
            borderRadius: "16px",
            background: "#2b2b2b",
            color: "#fff",
            p: isMobile ? 1 : 2,
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
              pb: isMobile ? 1 : 3,
            }}
          >
            🏆 {contestName}
          </Typography>

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? "13px" : "16px",
              color: "#90cdf4",
              mb: 2,
            }}
          >
            ⏳ {countdownMessage}
          </Typography>

          <Typography
            sx={{
              fontSize: isMobile ? "13px" : "16px",
              mb: 2,
            }}
          >
            Available Picks Remaining:{" "}
            <strong>{calculateAvailableFreePicksLeft()}</strong>
          </Typography>

          {/* Payout Breakdown */}
          <Typography
            variant="h3"
            sx={{
              fontSize: isMobile ? "16px" : "20px",
              fontWeight: 600,
              color: "#f5f5f5",
              mb: 1,
            }}
          >
            💸 Payout Structure
          </Typography>

          <List
            dense
            sx={{
              textAlign: "left",
              color: "#ccc",
              fontSize: isMobile ? "12px" : "14px",
              maxWidth: "400px",
              margin: "0 auto",
              padding: 0,
            }}
          >
            {contestType === "Pickem"
              ? generatePayoutTiers(
                  contestPrimaryPrize,
                  contestType,
                  availableFreePicks
                ).map((p, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      px: 0,
                    }}
                  >
                    <span>#{p.rank}</span> <strong>${p.amount}</strong>
                  </ListItem>
                ))
              : generatePayoutTiers(
                  contestPrimaryPrize,
                  contestType,
                  availableFreePicks
                ).map((p, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "list-item", // Use list-item for bullet points
                      listStyleType: "disc", // Add bullet points
                      paddingLeft: "20px", // Add spacing for bullet alignment
                      marginBottom: "3px", // Add spacing between bullet points
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: isMobile ? "12px" : "14px",
                        color: "#f5f5f5",
                      }}
                    >
                      <strong>{p.condition}:</strong> {p.message} <br />
                      <strong>Amount:</strong> {p.amount}
                    </Typography>
                  </ListItem>
                ))}
          </List>
        </Card>
      </Box>
    </>
  );
};

export default ContestInfo;
