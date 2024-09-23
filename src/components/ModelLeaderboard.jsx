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
  Button,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import axios from "axios";
import moment from "moment";

const ModelLeaderboard = () => {
  const [betsData, setBetsData] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [filter, setFilter] = useState("all");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8"
      );
      setBetsData(response.data);
      setFilteredBets(response.data); // Initial filter setup
    };
    fetchData();
  }, []);

  useEffect(() => {
    const now = moment();
    const filtered = betsData.filter((bet) => {
      const postedTime = moment(bet?.postedTime);
      switch (filter) {
        case "day":
          return now.diff(postedTime, "days") < 1;
        case "week":
          return now.diff(postedTime, "weeks") < 1;
        case "month":
          return now.diff(postedTime, "months") < 1;
        case "all":
        default:
          return true;
      }
    });
    setFilteredBets(filtered);
  }, [filter, betsData]);

  const aggregateBets = (bets) => {
    const handicappers = {};

    bets.forEach((bet) => {
      if (bet.betResult === null) return;

      const odds = parseInt(bet.odds, 10);
      const username = bet.researchToolOrModelUsed || "Anonymous";
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
      // if (
      //   bet.researchToolOrModelUsed &&
      //   !handicappers[username].researchTools.includes(
      //     bet.researchToolOrModelUsed
      //   )
      // ) {
      //   handicappers[username].researchTools.push(bet.researchToolOrModelUsed);
      // }
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

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-around", p: 2 }}>
          {["all", "day", "week", "month"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "contained" : "outlined"}
              onClick={() => setFilter(f)}
              sx={{
                minWidth: isMobile ? "50px" : "150px", // Make buttons smaller on mobile
                fontWeight: "bold", // Make text bolder
                fontSize: isMobile ? "12px" : "inherit", // Smaller text on mobile
                color: filter === f ? "#fff" : "#4F46E5", // Text color
                borderColor: "#4F46E5", // Border color
                backgroundColor: filter === f ? "#4F46E5" : "transparent", // Background color for selected button
                "&:hover": {
                  backgroundColor:
                    filter === f ? "#4F46E5" : "rgba(79, 70, 229, 0.1)", // Hover effect
                  borderColor: "#4F46E5",
                },
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: isMobile ? "12px" : "inherit" }}>
                  Model/Research Tool
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    Total Won Odds{" "}
                    <Tooltip title="Total amount of odds for bets that were won">
                      <IconButton size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
                {!isMobile && (
                  <TableCell>
                    Total Won %
                    <Tooltip title="Percentage of bets won out of total bets made">
                      <IconButton size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
                <TableCell sx={{ fontSize: isMobile ? "12px" : "inherit" }}>
                  Potential Wins
                  <Tooltip title="Potential earnings based on a $100 bet for each winning bet, adjusted for the odds">
                    <IconButton size="small">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aggregateBets(filteredBets).map((handicapper, index) => {
                // Shorten the tool name if it's too long
                const shortenedTool =
                  handicapper.username.length > 25
                    ? `${handicapper.username.substring(0, 20)}...`
                    : handicapper.username;

                const toolUrl =
                  handicapper.username.startsWith("http://") ||
                  handicapper.username.startsWith("https://")
                    ? handicapper.username
                    : `http://${handicapper.username}`;

                return (
                  <TableRow key={handicapper.username}>
                    <TableCell>
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
                      {handicapper.username === "Anonymous" ? (
                        <span
                          style={{ fontSize: isMobile ? "10px" : "inherit" }}
                        >
                          {handicapper.username}
                        </span>
                      ) : (
                        <a
                          href={toolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: isMobile ? "10px" : "inherit" }}
                        >
                          {shortenedTool}
                        </a>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell>{handicapper.totalWonOdds}</TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        ({handicapper.numberOfBetsWon} /{" "}
                        {handicapper.numberOfBets}){" "}
                        {handicapper.winRatio.toFixed(2)}%
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: isMobile ? "10px" : "inherit" }}>
                      ${handicapper.potentialWins.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default ModelLeaderboard;
