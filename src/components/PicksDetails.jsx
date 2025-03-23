import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Box,
  // Link,
} from "@mui/material";

const PicksDetails = ({
  companyName,
  primaryImageUrl,
  description,
  price,
  spreadsheetUrl,
  secondaryImageUrl,
  isContestActive,
}) => {
  const [userBets, setUserBets] = useState({});
  // const [matchupData, setMatchupData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(spreadsheetUrl);
        const data = response.data;

        // Aggregate data by participantsUsername
        const aggregatedData = data.reduce((acc, bet) => {
          const username = bet.participantsUsername;
          if (!acc[username]) {
            acc[username] = {
              totalBets: 0,
              totalBetsWon: 0,
              lastFiveBets: [],
              liveBets: [],
              allBets: [],
              postStreak: 0,
              lastPostTime: null,
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

        // Calculate post streak and last post time
        Object.keys(aggregatedData).forEach((username) => {
          const allBets = aggregatedData[username].allBets;
          allBets.sort(
            (a, b) => new Date(a.postedTime) - new Date(b.postedTime)
          );

          let streak = 0;
          let lastPostTime = null;
          let currentStreak = 0;
          let lastPostDate = null;

          const today = new Date().toISOString().split("T")[0];

          allBets.forEach((bet) => {
            const postDate = new Date(bet.postedTime)
              .toISOString()
              .split("T")[0];

            if (lastPostDate) {
              const diffDays =
                (new Date(postDate) - new Date(lastPostDate)) /
                (1000 * 60 * 60 * 24);

              if (diffDays === 1) {
                currentStreak += 1;
              } else if (diffDays > 1) {
                currentStreak = 1;
              }
            } else {
              currentStreak = 1;
            }

            lastPostDate = postDate;
          });

          if (lastPostDate === today) {
            streak = currentStreak;
          } else {
            streak = 0;
          }

          lastPostTime = allBets[allBets.length - 1].postedTime;

          aggregatedData[username].postStreak = streak;
          aggregatedData[username].lastPostTime = lastPostTime;
        });

        setUserBets(aggregatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [spreadsheetUrl]);

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

  return (
    <div>
      <TextField
        label="Search Participant"
        variant="outlined"
        sx={{
          margin: "16px 16px 0",
          width: "calc(100% - 32px)",
          borderRadius: "8px",
          "& .MuiInputLabel-root": { color: "#fff" }, // Label color
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#fff", // Border color
            },
            "&:hover fieldset": {
              borderColor: "#fff", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#fff", // Border color when focused
            },
            "& input": {
              color: "#fff", // Input text color
            },
          },
        }}
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
                  height: "220px", // Adjusted height for new content
                  overflow: "auto", // Scroll if content overflows
                  backgroundColor: "#2b2b2b",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {username}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", color: "#fff" }}
                  >
                    Total Bets: {userBets[username].totalBets}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", color: "#fff" }}
                  >
                    Total Bets Won: {userBets[username].totalBetsWon}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", color: "#fff" }}
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
                      color: "#fff",
                      mt: 2,
                    }}
                  >
                    Post Streak: {userBets[username].postStreak} days
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: "#fff",
                      mt: 1,
                    }}
                  >
                    Last Post Time:{" "}
                    {new Date(userBets[username].lastPostTime).toLocaleString()}
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
