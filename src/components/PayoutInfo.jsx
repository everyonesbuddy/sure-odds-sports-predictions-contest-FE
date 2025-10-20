import React from "react";
import {
  Card,
  Typography,
  Box,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const PayoutInfo = ({
  contestName,
  contestPrimaryPrize,
  contestFormat,
  availablePicks,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    const totalPrize = parsePrizeValue(totalPrizeLabel);
    if (contestFormat === "Pickem") {
      const percentages = [0.35, 0.25, 0.2, 0.12, 0.08]; // Top 5 now
      return percentages.map((pct, index) => ({
        rank: index + 1,
        amount: `${(totalPrize * pct).toFixed(2)}`,
      }));
    } else if (contestFormat === "Streak") {
      return [
        {
          condition: `Achieve a perfect streak of ${availablePicks} for ${availablePicks}`,
          message: `You must win all ${availablePicks} picks to qualify for the prize.`,
          amount: totalPrizeLabel,
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
          message: `If 3 participants achieve a streak of ${availablePicks}, each will split equally.`,
          amount: `Split prize.`,
        },
      ];
    }
    return [];
  };

  return (
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

        {/* Payout Breakdown */}
        <Typography
          variant="h3"
          sx={{
            fontSize: isMobile ? "16px" : "20px",
            fontWeight: 600,
            color: "#f5f5f5",
            mb: 2,
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
          {contestFormat === "Pickem" && (
            <Typography
              sx={{
                fontSize: isMobile ? "12px" : "14px",
                color: "#bbb",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              Top 5 participants win a share of the {contestPrimaryPrize} prize.
            </Typography>
          )}

          {generatePayoutTiers(
            contestPrimaryPrize,
            contestFormat,
            availablePicks
          ).map((p, index) => (
            <ListItem
              key={index}
              sx={{
                display: contestFormat === "Pickem" ? "flex" : "list-item",
                justifyContent:
                  contestFormat === "Pickem" ? "space-between" : "initial",
                listStyleType: contestFormat === "Streak" ? "disc" : "none",
                paddingLeft: contestFormat === "Streak" ? "20px" : 0,
                marginBottom: "3px",
              }}
            >
              {contestFormat === "Pickem" ? (
                <>
                  <span>#{p.rank}</span> <strong>${p.amount}</strong>
                </>
              ) : (
                <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "#f5f5f5",
                  }}
                >
                  <strong>{p.condition}:</strong> {p.message} <br />
                  <strong>Amount:</strong> {p.amount}
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default PayoutInfo;
