import React from "react";
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
  Avatar,
  CardContent,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Leaderboard = ({
  contestName,
  primaryImageUrl,
  firstPlacePrize,
  spreadsheetUrl,
  sponsored,
  contestEndDate,
  contestStartDate,
  filteredBets,
  aggregateBets,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  console.log("aggregateBets", aggregateBets);

  const calculateDuration = (start, end) => {
    const currentDate = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (currentDate < startDate) {
      const durationInMilliseconds = startDate - currentDate;
      const durationInDays = Math.ceil(
        durationInMilliseconds / (1000 * 60 * 60 * 24)
      );
      return {
        duration: durationInDays,
        message: `Contest starts in ${durationInDays} days`,
      };
    } else {
      const durationInMilliseconds = endDate - currentDate;
      const durationInDays = Math.ceil(
        durationInMilliseconds / (1000 * 60 * 60 * 24)
      );
      return {
        duration: durationInDays,
        message: `Contest ends in ${durationInDays} days`,
      };
    }
  };

  const { message } = calculateDuration(contestStartDate, contestEndDate);

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "20px", fontWeight: "bold" }}
        >
          <p className={`card-contest-format`}>
            {message} ({contestStartDate} - {contestEndDate})
          </p>
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
                    Participant (Email)
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
                    Potential Wins
                    <Tooltip title="Potential earnings based on a $100 bet for each winning bet, adjusted for the odds">
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
                      {index + 1}.{" "}
                      <Avatar
                        src={`https://avatar.iran.liara.run/username?username=${handicapper.username}`}
                        alt={"Avatar"}
                        sx={{
                          width: isMobile ? 15 : 24,
                          height: isMobile ? 15 : 24,
                          display: "inline-flex",
                          verticalAlign: "middle",
                          marginRight: 1,
                        }}
                      />
                      <a
                        href={`https://x.com/${handicapper.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: isMobile ? "10px" : "inherit",
                          color: "#4F46E5",
                        }}
                      >
                        {handicapper.username}
                      </a>
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
                      ${handicapper.potentialWins.toFixed(2)}
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
