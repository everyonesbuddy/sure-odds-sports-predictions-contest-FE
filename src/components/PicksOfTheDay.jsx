import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Link } from "@mui/material";

const PicksOfTheDay = () => {
  const [picks, setPicks] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8"
  //       );
  //       setPicks(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8"
        );
        // const currentTime = new Date();
        const livePicks = response.data.filter((pick) => {
          const nonResolvedBets = pick.betResult === null;
          // console.log(gameStartTime, currentTime);
          return nonResolvedBets;
        });
        setPicks(livePicks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getLeagueName = (leagueCode) => {
    const leagueNames = {
      basketball_wnba: "WNBA 🏀",
      baseball_mlb: "MLB ⚾",
      americanfootball_nfl: "NFL 🏈",
    };

    return leagueNames[leagueCode] || leagueCode;
  };

  // Utility function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short", // "Sep" instead of "September"
      day: "2-digit", // "05"
      year: "numeric", // "2024"
      hour: "numeric", // "8 PM" instead of "08:20:00 PM"
      minute: "2-digit", // "20"
      hour12: true, // Use AM/PM instead of 24-hour format
    }).format(date);
  }

  const getGameStatus = (gameCommenceTime) => {
    const currentTime = new Date();
    const gameStartTime = new Date(gameCommenceTime);
    const timeDifference = gameStartTime - currentTime;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (gameStartTime < currentTime) {
      return "Game started or Completed";
    } else if (daysDifference > 1) {
      return `Game starts in ${daysDifference} days`;
    } else if (gameStartTime.toDateString() === currentTime.toDateString()) {
      return "Game starts today";
    } else {
      return "Game starts tomorrow";
    }
  };

  const getStatusStyles = (status) => {
    const baseStyles = {
      color: "white",
      fontWeight: "bold",
      borderRadius: "20px",
      padding: "5px 10px",
      display: "inline-block",
      width: "fit-content",
    };

    switch (status) {
      case "Game started or Completed":
        return {
          ...baseStyles,
          backgroundColor: "#b56565",
          border: "1px solid #8b4a4a",
        }; // Dull red
      case "Game starts today":
        return {
          ...baseStyles,
          backgroundColor: "#b5b565",
          border: "1px solid #8b8b4a",
        }; // Dull yellow
      default:
        return {
          ...baseStyles,
          backgroundColor: "#65b565",
          border: "1px solid #4a8b4a",
        }; // Dull green
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {picks.map((pick, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            raised
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {getLeagueName(pick.league)}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Bet Type: {pick.pickType}
              </Typography>
              <Typography variant="body2">
                Game Commence Time: {formatDate(pick.gameCommenceTime)}
              </Typography>
              <Typography
                variant="body2"
                sx={getStatusStyles(getGameStatus(pick.gameCommenceTime))}
              >
                {getGameStatus(pick.gameCommenceTime)}
              </Typography>
              {pick.pickType === "money line" ? (
                <>
                  <Typography variant="body2">
                    Team Picked: {pick.teamPicked}
                  </Typography>
                  <Typography variant="body2">Odds: {pick.odds}</Typography>
                  {pick.twitterUsername !== "" && (
                    <Typography variant="body2">
                      X Profile:{" "}
                      <Link
                        href={`https://twitter.com/${pick.twitterUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pick.twitterUsername}
                      </Link>
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body2">
                    Market: {pick.market.split("_")[0].toUpperCase()}{" "}
                    {pick.market.split("_")[1]?.toUpperCase()}
                  </Typography>
                  <Typography variant="body2">Odds: {pick.odds}</Typography>
                  <Typography variant="body2">
                    Player Picked: {pick.playerPicked}
                  </Typography>
                  {pick.twitterUsername !== "" && (
                    <Typography variant="body2">
                      X Profile:{" "}
                      <Link
                        href={`https://twitter.com/${pick.twitterUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pick.twitterUsername}
                      </Link>
                    </Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PicksOfTheDay;
