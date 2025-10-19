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
  Button,
  ButtonGroup,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Leaderboard = ({
  aggregateBets = [],
  contestStartDate,
  contestEndDate,
  lastAggregateBets = [],
  lastContestStartDate,
  lastContestEndDate,
  contestName = "",
}) => {
  const [countdownMessage, setCountdownMessage] = useState("");
  const [showLast, setShowLast] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const displayedBets = showLast ? lastAggregateBets : aggregateBets;
  const startDate = showLast ? lastContestStartDate : contestStartDate;
  const endDate = showLast ? lastContestEndDate : contestEndDate;

  useEffect(() => {
    const interval = setInterval(() => {
      const { message } = calculateDuration(startDate, endDate);
      setCountdownMessage(message);
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const calculateDuration = (start, end) => {
    const currentDate = new Date();
    const startD = new Date(start);
    const endD = new Date(end);

    if (currentDate < startD) {
      const durationInMilliseconds = startD - currentDate;
      const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

      return {
        duration: durationInMilliseconds,
        message: `Contest starts in ${days}d ${hours}h ${minutes}m ${seconds}s`,
      };
    } else if (currentDate < endD) {
      const durationInMilliseconds = endD - currentDate;
      const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

      return {
        duration: durationInMilliseconds,
        message: `Contest ends in ${days}d ${hours}h ${minutes}m ${seconds}s`,
      };
    } else {
      return { duration: 0, message: "The contest has ended." };
    }
  };

  return (
    <>
      {/* Toggle Buttons */}
      {(lastAggregateBets.length > 0 || lastContestStartDate) && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <ButtonGroup variant="outlined">
            <Button
              onClick={() => setShowLast(false)}
              sx={{
                backgroundColor: !showLast ? "#4F46E5" : "transparent",
                color: !showLast ? "#fff" : "#4F46E5",
              }}
            >
              Current Leaderboard
            </Button>
            <Button
              onClick={() => setShowLast(true)}
              sx={{
                backgroundColor: showLast ? "#4F46E5" : "transparent",
                color: showLast ? "#fff" : "#4F46E5",
              }}
            >
              Last Leaderboard
            </Button>
          </ButtonGroup>
        </Box>
      )}

      {/* Countdown / Header */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "20px", fontWeight: "bold" }}
        >
          {showLast ? (
            <p className="card-contest-format">
              Last {contestName} contest from {lastContestStartDate} to{" "}
              {lastContestEndDate}
            </p>
          ) : (
            <p className="card-contest-format">{countdownMessage}</p>
          )}
        </Typography>
      </Box>

      {/* Leaderboard Table */}
      <Box>
        {displayedBets.length === 0 ? (
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
                  {showLast
                    ? "Last contest had no participants or no bets."
                    : "No bets have been placed yet."}
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
                      fontSize: isMobile ? "10px" : "inherit",
                      color: "#fff",
                    }}
                  >
                    Win Streak
                    <Tooltip title="Current Win Streak">
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
                {displayedBets.map((handicapper, index) => (
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
