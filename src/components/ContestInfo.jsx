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
  availablePicks,
  contestFormat,
  entryFee,
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

  const calculateavailablePicksLeft = () => {
    const userBets = aggregateBets.find(
      (bet) => bet.username === participantsUsername
    );
    const betsPlaced = userBets ? userBets.numberOfBets : 0;

    // Available free picks minus bets already submitted (ignores local state picks)
    return Math.max(availablePicks - betsPlaced, 0);
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

  const parsePrizeValue = (prizeString) => {
    if (!prizeString) return 0;
    const match = prizeString.replace(/[^0-9.]/g, ""); // keep only numbers
    return parseFloat(match) || 0;
  };

  const generatePayoutTiers = (
    totalPrizeLabel,
    contestFormat,
    availablePicks
  ) => {
    const totalPrize = parsePrizeValue(totalPrizeLabel); // numeric version
    if (contestFormat === "Pickem") {
      const percentages = [0.3, 0.22, 0.16, 0.11, 0.09, 0.07, 0.05];
      return percentages.map((pct, index) => ({
        rank: index + 1,
        amount: `${(totalPrize * pct).toFixed(2)}`,
      }));
    } else if (contestFormat === "Streak") {
      return [
        {
          condition: `Achieve a perfect streak of ${availablePicks} for ${availablePicks}`,
          message: `You must win all ${availablePicks} picks to qualify for the prize.`,
          amount: totalPrizeLabel, // use the full string
        },
        {
          condition: `If no one achieves a perfect streak`,
          message: `There will be no payout for this contest.`,
          amount: `No payout.`,
        },
        {
          condition: `Tiebreaker rules`,
          message: `If multiple participants achieve the same streak, the prize will be split evenly.`,
          amount: `Prize shared equally.`,
        },
        {
          condition: `Example`,
          message: `If 3 participants achieve a streak of ${availablePicks}, each will be split equally between them.`,
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
            <strong>{calculateavailablePicksLeft()}</strong>
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
            {/* paid entry contests initial version */}
            {contestFormat === "Pickem" && (
              <>
                <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "#bbb",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  Top 7 participants win a share of the {contestPrimaryPrize}{" "}
                  prize.
                </Typography>
                <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "#bbb",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  You must submit at least {Math.floor(availablePicks * 0.75)}/
                  {availablePicks} picks to qualify for prizes.
                </Typography>
                <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "#bbb",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  Prize pool may increase based on the total number of
                  participants.
                </Typography>
              </>
            )}

            {contestFormat === "Pickem"
              ? generatePayoutTiers(
                  contestPrimaryPrize,
                  contestFormat,
                  availablePicks
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
                  contestFormat,
                  availablePicks
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
            {/* {generatePayoutTiers(
              contestPrimaryPrize,
              contestFormat,
              availablePicks
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
            ))} */}
          </List>
        </Card>
      </Box>
    </>
  );
};

export default ContestInfo;
