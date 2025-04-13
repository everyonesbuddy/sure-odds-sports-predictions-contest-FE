import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Typography,
  Box,
  CardContent,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Leaderboard = ({ contestEndDate, contestStartDate, aggregateBets }) => {
  const [countdownMessage, setCountdownMessage] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const interval = setInterval(() => {
      const { message } = calculateDuration(contestStartDate, contestEndDate);
      setCountdownMessage(message);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [contestStartDate, contestEndDate]);

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

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "20px", fontWeight: "bold" }}
        >
          <p className={`card-contest-format`}>{countdownMessage}</p>
        </Typography>
      </Box>
      <Box>
        {aggregateBets.length === 0 ? (
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              maxWidth: "600px",
              margin: "auto",
              marginTop: 2,
              marginBottom: 5,
              backgroundColor: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="body1" align="center">
                <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  Contest has not started or no bets have been resolved.
                </span>
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: "#2b2b2b" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: isMobile ? "12px" : "inherit",
                      color: "#fff",
                    }}
                  >
                    Participant (username)
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ color: "#fff" }}>
                      Total Won Odds
                      <Tooltip title="Total amount of odds for bets that were won">
                        <IconButton size="small">
                          <HelpOutlineIcon
                            fontSize="small"
                            sx={{ color: "#fff" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell sx={{ color: "#fff" }}>
                      Total Won %{" "}
                      <Tooltip title="Percentage of bets won out of total bets made">
                        <IconButton size="small">
                          <HelpOutlineIcon
                            fontSize="small"
                            sx={{ color: "#fff" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      fontSize: isMobile ? "12px" : "inherit",
                      color: "#fff",
                    }}
                  >
                    Win Streak
                    <Tooltip title="Currrent Win Streak">
                      <IconButton size="small">
                        <HelpOutlineIcon
                          fontSize="small"
                          sx={{ color: "#fff" }}
                        />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aggregateBets.map((handicapper, index) => (
                  <TableRow
                    key={handicapper.username}
                    sx={{ backgroundColor: "#2b2b2b" }}
                  >
                    <TableCell sx={{ color: "#fff" }}>
                      {index + 1}. {handicapper.username}
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ color: "#fff" }}>
                        {handicapper.totalWonOdds}
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell sx={{ color: "#fff" }}>
                        ({handicapper.numberOfBetsWon} /{" "}
                        {handicapper.numberOfBets}){" "}
                        {handicapper.winRatio.toFixed(2)}%
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        fontSize: isMobile ? "10px" : "inherit",
                        color: "#fff",
                      }}
                    >
                      {handicapper.currentWinStreak}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default Leaderboard;
