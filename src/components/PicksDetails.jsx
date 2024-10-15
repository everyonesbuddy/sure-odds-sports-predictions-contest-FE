// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent, Typography, Grid, Link } from "@mui/material";

// const PicksOfTheDay = () => {
//   const [picks, setPicks] = useState([]);
//   const [matchupData, setMatchupData] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8"
//         );
//         const livePicks = response.data.filter((pick) => {
//           const nonResolvedBets =
//             pick.betResult === null || pick.betResult === "";
//           return nonResolvedBets;
//         });
//         setPicks(livePicks);

//         // Fetch matchup data for each pick
//         const matchupPromises = livePicks.map((pick) =>
//           getMatchUpData(pick.league, pick.selectedGameId)
//         );
//         const matchupResults = await Promise.all(matchupPromises);

//         // Create a lookup object for matchup data
//         const matchupDataObj = livePicks.reduce((acc, pick, index) => {
//           acc[pick.selectedGameId] = matchupResults[index];
//           return acc;
//         }, {});

//         setMatchupData(matchupDataObj);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const getLeagueName = (leagueCode) => {
//     const leagueNames = {
//       basketball_wnba: "WNBA 🏀",
//       baseball_mlb: "MLB ⚾",
//       americanfootball_nfl: "NFL 🏈",
//       soccer_epl: "EPL ⚽",
//     };

//     return leagueNames[leagueCode] || leagueCode;
//   };

//   // Utility function to format date
//   function formatDate(dateString) {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     }).format(date);
//   }

//   const getGameStatus = (gameCommenceTime) => {
//     const currentTime = new Date();
//     const gameStartTime = new Date(gameCommenceTime);
//     const timeDifference = gameStartTime - currentTime;
//     const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

//     if (gameStartTime < currentTime) {
//       return "Game started or Completed";
//     } else if (daysDifference > 1) {
//       return `Game starts in ${daysDifference} days`;
//     } else if (gameStartTime.toDateString() === currentTime.toDateString()) {
//       return "Game starts today";
//     } else {
//       return "Game starts tomorrow";
//     }
//   };

//   const getMatchUpData = async (league, gameId) => {
//     const apiKey = "402f2e4bba957e5e98c7e1a178393c8c";
//     const url = `https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings&eventIds=${gameId}`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       const matchup = data[0];
//       const homeTeam = matchup.home_team;
//       const awayTeam = matchup.away_team;
//       return `${homeTeam} vs ${awayTeam}`;
//     } catch (error) {
//       console.error("Error fetching matchup data:", error);
//       return "Matchup data not available";
//     }
//   };

//   const getStatusStyles = (status) => {
//     const baseStyles = {
//       color: "white",
//       fontWeight: "bold",
//       borderRadius: "20px",
//       padding: "5px 10px",
//       display: "inline-block",
//       width: "fit-content",
//     };

//     switch (status) {
//       case "Game started or Completed":
//         return {
//           ...baseStyles,
//           backgroundColor: "#b56565",
//           border: "1px solid #8b4a4a",
//         };
//       case "Game starts today":
//         return {
//           ...baseStyles,
//           backgroundColor: "#b5b565",
//           border: "1px solid #8b8b4a",
//         };
//       default:
//         return {
//           ...baseStyles,
//           backgroundColor: "#65b565",
//           border: "1px solid #4a8b4a",
//         };
//     }
//   };

//   return (
//     <Grid container spacing={2} sx={{ mb: 2, mt: 2, padding: 2 }}>
//       {picks.length === 0 ? (
//         <Typography
//           variant="h6"
//           component="div"
//           sx={{ width: "100%", textAlign: "center", mt: 2 }}
//         >
//           Currently no live picks available. Please check back shortly!
//         </Typography>
//       ) : (
//         picks
//           .slice()
//           .reverse()
//           .map((pick, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card
//                 raised
//                 sx={{
//                   borderRadius: "16px",
//                   boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h5" component="div">
//                     {getLeagueName(pick.league)}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{ fontSize: "0.875rem", color: "text.secondary" }}
//                   >
//                     Matchup: {matchupData[pick.selectedGameId] || "Loading..."}
//                   </Typography>
//                   <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                     Bet Type: {pick.pickType}
//                   </Typography>
//                   <Typography variant="body2">
//                     Game Commence Time: {formatDate(pick.gameCommenceTime)}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={getStatusStyles(getGameStatus(pick.gameCommenceTime))}
//                   >
//                     {getGameStatus(pick.gameCommenceTime)}
//                   </Typography>
//                   {pick.pickType === "money line" ? (
//                     <>
//                       <Typography variant="body2">
//                         Pick: {pick.teamPicked}
//                       </Typography>
//                       <Typography variant="body2">Odds: {pick.odds}</Typography>
//                       {pick.twitterUsername !== "" && (
//                         <Typography variant="body2">
//                           X or Reddit Profile:{" "}
//                           <Link
//                             href={
//                               pick.socialType === "twitter"
//                                 ? `https://x.com/${pick.twitterUsername}`
//                                 : `https://www.reddit.com/user/${pick.twitterUsername}`
//                             }
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             {pick.twitterUsername}
//                           </Link>
//                         </Typography>
//                       )}

//                       {pick.researchToolOrModelUsed !== null && (
//                         <Typography variant="body2">
//                           <Link
//                             href={`${
//                               pick.researchToolOrModelUsed.startsWith(
//                                 "http://"
//                               ) ||
//                               pick.researchToolOrModelUsed.startsWith(
//                                 "https://"
//                               )
//                                 ? pick.researchToolOrModelUsed
//                                 : `http://${pick.researchToolOrModelUsed}`
//                             }`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             Research Tool Or Model Used
//                           </Link>
//                         </Typography>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       <Typography variant="body2">
//                         Market: {pick.market.split("_")[0].toUpperCase()}{" "}
//                         {pick.market
//                           .split("_")
//                           .slice(1)
//                           .map((part) => part.toUpperCase())
//                           .join(" + ")}
//                       </Typography>
//                       {/* <Typography variant="body2">Odds: {pick.odds}</Typography> */}
//                       <Typography variant="body2">
//                         Pick: {pick.playerPicked} {pick.propOverOrUnder}{" "}
//                         {pick.propLine} ({pick.odds})
//                       </Typography>
//                       {pick.twitterUsername !== "" && (
//                         <Typography variant="body2">
//                           X / Reddit Profile:{" "}
//                           <Link
//                             href={
//                               pick.socialType === "twitter"
//                                 ? `https://x.com/${pick.twitterUsername}`
//                                 : `https://www.reddit.com/user/${pick.twitterUsername}`
//                             }
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             {pick.twitterUsername}
//                           </Link>
//                         </Typography>
//                       )}
//                       {pick.researchToolOrModelUsed !== null && (
//                         <Typography variant="body2">
//                           <Link
//                             href={`${
//                               pick.researchToolOrModelUsed.startsWith(
//                                 "http://"
//                               ) ||
//                               pick.researchToolOrModelUsed.startsWith(
//                                 "https://"
//                               )
//                                 ? pick.researchToolOrModelUsed
//                                 : `http://${pick.researchToolOrModelUsed}`
//                             }`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             Research Tool Or Model Used
//                           </Link>
//                         </Typography>
//                       )}
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))
//       )}
//     </Grid>
//   );
// };

// export default PicksOfTheDay;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Link,
  TextField,
  Box,
} from "@mui/material";

const PicksDetails = () => {
  const [userBets, setUserBets] = useState({});
  const [matchupData, setMatchupData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8"
        );
        const data = response.data;

        // Aggregate data by twitterUsername
        const aggregatedData = data.reduce((acc, bet) => {
          const username = bet.twitterUsername;
          if (!acc[username]) {
            acc[username] = {
              totalBets: 0,
              totalBetsWon: 0,
              lastFiveBets: [],
              liveBets: [],
              allBets: [],
            };
          }

          // Add bet to allBets
          acc[username].allBets.push(bet);

          // Calculate total bets and total bets won
          if (bet.betResult !== null) {
            acc[username].totalBets += 1;
            if (bet.betResult === "won") {
              acc[username].totalBetsWon += 1;
            }
          }

          // Add to last five bets if settled
          if (bet.betResult !== null) {
            acc[username].lastFiveBets.push(bet);
            if (acc[username].lastFiveBets.length > 5) {
              acc[username].lastFiveBets.shift();
            }
          }

          // Add to live bets if not settled
          if (bet.betResult === null) {
            acc[username].liveBets.push(bet);
          }

          return acc;
        }, {});

        setUserBets(aggregatedData);

        // Fetch matchup data for live bets
        const liveBets = data.filter((bet) => bet.betResult === null);
        const matchupPromises = liveBets.map((bet) =>
          getMatchUpData(bet.league, bet.selectedGameId)
        );
        const matchupResults = await Promise.all(matchupPromises);

        // Create a lookup object for matchup data
        const matchupDataObj = liveBets.reduce((acc, bet, index) => {
          acc[bet.selectedGameId] = matchupResults[index];
          return acc;
        }, {});

        setMatchupData(matchupDataObj);
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
      soccer_epl: "EPL ⚽",
    };

    return leagueNames[leagueCode] || leagueCode;
  };

  const getMatchUpData = async (league, gameId) => {
    const apiKey = "402f2e4bba957e5e98c7e1a178393c8c";
    const url = `https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings&eventIds=${gameId}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const matchup = data[0];
      const homeTeam = matchup.home_team;
      const awayTeam = matchup.away_team;
      return `${homeTeam} vs ${awayTeam}`;
    } catch (error) {
      console.error("Error fetching matchup data:", error);
      return "Matchup data not available";
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const filteredUserBets = shuffleArray(
    Object.keys(userBets).filter((username) =>
      username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  console.log(filteredUserBets);

  return (
    <div>
      <TextField
        label="Search Handicapper/Tipsters/Models"
        variant="outlined"
        sx={{
          margin: "16px 16px 0",
          width: "calc(100% - 32px)",
          borderRadius: "8px",
        }} // Add margin and rounded corners
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Grid container spacing={2} sx={{ mb: 2, mt: 2, padding: 2 }}>
        {filteredUserBets.length === 0 ? (
          <Typography
            variant="h6"
            component="div"
            sx={{ width: "100%", textAlign: "center", mt: 2 }}
          >
            Currently no live picks available. Please check back shortly!
          </Typography>
        ) : (
          filteredUserBets.map((username, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                raised
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  height: "380px", // Fixed height for consistency
                  overflow: "auto", // Scroll if content overflows
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    <Link
                      href={
                        userBets[username].allBets[0].socialType === "twitter"
                          ? `https://x.com/${username}`
                          : `https://www.reddit.com/user/${username}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {username}
                    </Link>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    Total Bets: {userBets[username].totalBets}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    Total Bets Won: {userBets[username].totalBetsWon}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    Last Five Bets:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                    }}
                  >
                    {userBets[username].lastFiveBets.map((bet, idx) => (
                      <Typography key={idx} variant="body2">
                        {bet.betResult === "won" ? "✅" : "❌"}
                      </Typography>
                    ))}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: "text.secondary",
                      mt: 2,
                    }}
                  >
                    {username} Live Picks Preview:
                  </Typography>
                  {userBets[username].liveBets.length === 0 ? (
                    <Typography variant="body2">No live preview</Typography>
                  ) : (
                    userBets[username].liveBets.map((bet, idx) => (
                      <Box key={idx} sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          {getLeagueName(bet.league)} - {bet.pickType}
                        </Typography>
                        <Typography variant="body2">
                          {matchupData[bet.selectedGameId] || "Loading..."}
                        </Typography>
                        <Typography variant="body2">
                          {new Date(bet.gameCommenceTime).toLocaleString()}
                        </Typography>
                      </Box>
                    ))
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: "text.secondary",
                      mt: 2,
                    }}
                  >
                    For more details on handicapper/tipster/model picks, check
                    them{" "}
                    <Link
                      href={
                        userBets[username].allBets[0].socialType === "twitter"
                          ? `https://x.com/${username}`
                          : `https://www.reddit.com/user/${username}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </Link>
                    .
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: "text.secondary",
                      mt: 1,
                    }}
                  >
                    Donate to top handicapper:{" "}
                    <Link
                      href="https://ko-fi.com/sureodds"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Here
                    </Link>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default PicksDetails;
