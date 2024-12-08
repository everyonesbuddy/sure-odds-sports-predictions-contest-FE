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
  Avatar,
  CardContent,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import axios from "axios";
import moment from "moment";

const Leaderboard = ({
  contestName,
  primaryImageUrl,
  price,
  spreadsheetUrl,
  sponsored,
  contestEndDate,
  contestStartDate,
}) => {
  const [betsData, setBetsData] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(spreadsheetUrl);
      setBetsData(response.data);
      setFilteredBets(response.data); // Initial filter setup
    };
    fetchData();
  }, [spreadsheetUrl]);

  useEffect(() => {
    const contestStart = moment(contestStartDate);
    const filtered = betsData.filter((bet) => {
      const postedTime = moment(bet?.postedTime);
      return postedTime.isSameOrAfter(contestStart);
    });
    setFilteredBets(filtered);
  }, [betsData, contestStartDate]);

  const aggregateBets = (bets) => {
    const handicappers = {};

    bets.forEach((bet) => {
      if (bet.betResult === null) return;

      const odds = parseInt(bet.odds, 10);
      const username = bet.twitterUsername || "Anonymous";
      if (!handicappers[username]) {
        handicappers[username] = {
          totalOdds: 0,
          totalWonOdds: 0,
          numberOfBets: 0,
          numberOfBetsWon: 0,
          potentialWins: 0,
          socialType: bet.socialType,
          researchTools: [],
        };
      }
      handicappers[username].totalOdds += odds;
      handicappers[username].numberOfBets += 1;
      if (bet.betResult === "won") {
        handicappers[username].totalWonOdds += odds;
        handicappers[username].numberOfBetsWon += 1;
        // Adjust calculation based on the sign of the odds
        if (odds > 0) {
          handicappers[username].potentialWins += 100 * (odds / 100); // For positive odds
        } else {
          handicappers[username].potentialWins += 100 * (100 / Math.abs(odds)); // For negative odds
        }
      }
      if (
        bet.researchToolOrModelUsed &&
        !handicappers[username].researchTools.includes(
          bet.researchToolOrModelUsed
        )
      ) {
        handicappers[username].researchTools.push(bet.researchToolOrModelUsed);
      }
    });

    return Object.entries(handicappers)
      .map(
        ([
          username,
          {
            totalOdds,
            totalWonOdds,
            numberOfBets,
            numberOfBetsWon,
            potentialWins,
            socialType,
            researchTools,
          },
        ]) => ({
          username,
          totalOdds,
          totalWonOdds,
          numberOfBets,
          numberOfBetsWon,
          winRatio: (numberOfBetsWon / numberOfBets) * 100, // Calculate win ratio as a percentage
          potentialWins,
          socialType,
          researchTools,
        })
      )
      .sort((a, b) => b.potentialWins - a.potentialWins); // Sort by potentialWins
  };

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
        isBeforeStart: true,
      };
    } else {
      const durationInMilliseconds = endDate - currentDate;
      const durationInDays = Math.ceil(
        durationInMilliseconds / (1000 * 60 * 60 * 24)
      );
      return {
        duration: durationInDays,
        message: `Contest ends in ${durationInDays} days`,
        isBeforeStart: false,
      };
    }
  };

  const { message, isBeforeStart } = calculateDuration(
    contestStartDate,
    contestEndDate
  );

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="subtitle1">
          <p
            className={`card-contest-format ${
              isBeforeStart ? "before-start" : "before-end"
            }`}
            style={{ fontSize: "20px", fontWeight: "bold" }}
          >
            {message}
          </p>
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: "gray",
            mb: 3,
            borderRadius: 1,
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>{price}</span>{" "}
        </Typography>
      </Box>

      <Box>
        {aggregateBets(filteredBets).length === 0 ? (
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
                {aggregateBets(filteredBets).map((handicapper, index) => (
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
