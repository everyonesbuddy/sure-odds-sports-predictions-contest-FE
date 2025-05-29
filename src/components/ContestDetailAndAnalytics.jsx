import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Card,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTimer } from "../context/TimerContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { leagueOptions } from "../utils/leagueData";

const ContestDetailAndAnalytics = ({
  contestName,
  spreadsheetUrl,
  contestTotalPrize,
  contestLeague,
  contestEndDate,
  contestStartDate,
  currentUserBetsForContest,
  aggregateBets,
  availableFreePicks,
}) => {
  const [code, setCode] = useState("");
  const { state, dispatch } = useTimer();
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);
  const [countdownMessage, setCountdownMessage] = useState("");
  const [
    allCurrentUsersbetDataForContestUnfiltered,
    setAllCurrentUsersbetDataForContestUnfiltered,
  ] = useState([]);
  const [participantsUsername, setParticipantsUsername] = useState("");
  const [betAnalytics, setBetAnalytics] = useState(null);

  const { user, token } = useAuth();

  const prevTimerRef = useRef();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const timer = state.timers?.[contestName] || 0;

  const handleCodeSubmit = async () => {
    setIsCodeSubmitting(true);
    try {
      const response = await fetch(
        "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/codes/submitCode",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        dispatch({
          type: "SET_TIMER",
          payload: { contestName, timer: 600 },
        });

        setCode("");
        toast.success("Code applied successfully!");
      } else {
        toast.error(data.message || "Invalid or already used code.");
      }
    } catch (error) {
      console.error("Error validating code:", error);
      toast.error("Failed to validate code. Please try again.");
    } finally {
      setIsCodeSubmitting(false);
    }
  };

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

  const calculateAvailableFreePicksLeft = () => {
    const userBets = aggregateBets.find(
      (bet) => bet.username === participantsUsername
    );
    const betsPlaced = userBets ? userBets.numberOfBets : 0;

    // If timer is active, unlimited bets are allowed
    // if (timer > 0) {
    //   return Infinity; // Indicates unlimited bets allowed
    // }

    // Available free picks minus bets already submitted (ignores local state picks)
    return Math.max(availableFreePicks - betsPlaced, 0);
  };

  useEffect(() => {
    if (user && user.email) {
      setParticipantsUsername(user.userName);
      // setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const prevTimer = prevTimerRef.current;

    const fetchCurrentUserBetsUnfiltered = async () => {
      try {
        const response = await axios.post(
          `${spreadsheetUrl}user/unfiltered`, // Route gets all of this logged in user bets for this contest, but with some unfiltered out propties
          { username: user?.userName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllCurrentUsersbetDataForContestUnfiltered(response.data.docs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // 🔁 Fetch if timer just turned on, OR on first load with timer active
    if (
      (prevTimer <= 0 && timer > 0) ||
      (prevTimer === undefined && timer > 0)
    ) {
      fetchCurrentUserBetsUnfiltered();
    } else if (prevTimer > 0 && timer <= 0) {
      setAllCurrentUsersbetDataForContestUnfiltered([]);
    }

    prevTimerRef.current = timer;
  }, [timer, user?.userName, spreadsheetUrl, token]);

  useEffect(() => {
    const computeAnalytics = () => {
      const bets = allCurrentUsersbetDataForContestUnfiltered;
      if (!bets || bets.length === 0) return setBetAnalytics(null);

      const completedBets = bets.filter(
        (b) => b.betResult === "won" || b.betResult === "lost"
      );
      const won = completedBets.filter((b) => b.betResult === "won");

      const total = completedBets.length;

      // Win Rate
      const winRate = Math.round((won.length / total) * 100);

      // Longest Win Streak
      const sorted = [...completedBets].sort(
        (a, b) => new Date(a.postedTime) - new Date(b.postedTime)
      );
      let maxStreak = 0,
        currentStreak = 0;
      for (let bet of sorted) {
        if (bet.betResult === "won") {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      // Risk Profile - % of bets on underdogs (positive odds)
      const underdogBets = bets.filter((b) => b.odds > 0);
      const riskRatio = Math.round((underdogBets.length / bets.length) * 100);

      // Most Profitable Bet
      const wonWithPositiveOdds = won.filter((b) => b.odds > 0);
      const bestValueBet = wonWithPositiveOdds.sort(
        (a, b) => b.odds - a.odds
      )[0];

      // League Accuracy
      const leagueStats = {};
      completedBets.forEach((b) => {
        const league = b.league;
        if (!leagueStats[league]) leagueStats[league] = { total: 0, wins: 0 };
        leagueStats[league].total++;
        if (b.betResult === "won") leagueStats[league].wins++;
      });

      let bestSport = null;
      let bestSportWinRate = 0;
      Object.entries(leagueStats).forEach(([league, stats]) => {
        const winPercentage = stats.wins / stats.total;
        if (stats.total >= 1 && winPercentage > bestSportWinRate) {
          bestSportWinRate = winPercentage;
          bestSport = league;
        }
      });

      // Underdog Hit Rate (odds > +200 and won)
      const upsetHits = won.filter((b) => b.odds >= 200).length;
      const totalUpsetBets = bets.filter(
        (b) => b.odds >= 200 && b.betResult
      ).length;
      const upsetAccuracy =
        totalUpsetBets > 0
          ? Math.round((upsetHits / totalUpsetBets) * 100)
          : null;

      // Pick Timing Preference
      const hours = bets.map((b) => new Date(b.postedTime).getUTCHours());
      const hourCounts = {};
      hours.forEach((hour) => {
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      const mostCommonHour = Object.entries(hourCounts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0];

      setBetAnalytics({
        total,
        winRate,
        longestStreak: maxStreak,
        riskProfile: `${riskRatio}% underdog picks`,
        mostProfitableBet: bestValueBet
          ? `${bestValueBet.teamPicked} at ${bestValueBet.odds}`
          : "N/A",
        bestSport,
        bestSportWinRate: Math.round(bestSportWinRate * 100),
        upsetAccuracy,
        favoritePickHour: mostCommonHour,
      });
    };

    computeAnalytics();
  }, [allCurrentUsersbetDataForContestUnfiltered]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { message } = calculateDuration(contestStartDate, contestEndDate);
      setCountdownMessage(message);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [contestStartDate, contestEndDate]);

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          color: "#fff",
          py: isMobile ? 3 : 4,
          width: isMobile ? "100%" : "600px",
          margin: "auto",
        }}
      >
        <Card
          sx={{
            borderRadius: "16px",
            background: "#2b2b2b",
            color: "#fff",
            p: isMobile ? 2 : 4,
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
              pb: isMobile ? 1 : 4,
            }}
          >
            🚀 Join & Win Big!
          </Typography>

          {/* Contest Details List */}
          <List
            sx={{
              fontSize: isMobile ? "14px" : "18px",
              fontWeight: "500",
              color: "#ccc",
              p: 0,
            }}
          >
            <ListItem
              sx={{
                fontSize: isMobile ? "10px" : "18px",
                color: "#f5f5f5",
                pb: isMobile ? 0.5 : 2,
              }}
            >
              {countdownMessage}
            </ListItem>

            <ListItem
              sx={{
                fontSize: "12px",
                pb: isMobile ? 1 : 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {contestName === "Weekly Streak" ? (
                <>
                  <Typography sx={{ mb: 1, fontSize: "15px" }}>
                    8+ win streak: ${contestTotalPrize} USD
                  </Typography>
                  <Typography sx={{ fontSize: "16px" }}>
                    If multiple users have the same streak, the prize will be
                    split equally.
                  </Typography>
                </>
              ) : contestName === "Monthly Streak" ? (
                <>
                  <Typography sx={{ mb: 1, fontSize: "15px" }}>
                    10+ win streak: ${contestTotalPrize} USD
                  </Typography>
                  <Typography sx={{ fontSize: "16px" }}>
                    If multiple users have the same streak, the prize will be
                    split equally.
                  </Typography>
                </>
              ) : null}
            </ListItem>

            <ListItem
              sx={{
                fontSize: isMobile ? "10px" : "16px",
                pb: isMobile ? 1 : 4,
              }}
            >
              Available Picks: {calculateAvailableFreePicksLeft()}
            </ListItem>

            {timer <= 0 && (
              <ListItem>
                <Button
                  variant="contained"
                  href="https://buy.stripe.com/28odRT1518lJgj63cg"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: isMobile ? "10px" : "12px",
                    py: isMobile ? 0.6 : 0.8,
                    px: isMobile ? 1.8 : 2.5,
                    backgroundColor: "#ffcc00",
                    color: "#000",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                    "&:hover": {
                      backgroundColor: "#ffdb4d",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  $5 for 10 Mins of your analytics – Get Access Code
                </Button>
              </ListItem>
            )}
          </List>

          {/* Countdown Timer */}
          <Box sx={{ textAlign: "center", mt: isMobile ? 1 : 2 }}>
            {timer > 0 ? (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#d72323",
                    fontSize: isMobile ? "18px" : "24px",
                    textAlign: "center",
                  }}
                >
                  ⏳ {Math.floor(timer / 60)}:
                  {String(timer % 60).padStart(2, "0")}
                </Typography>
                {/* In the Timer UI section (replace or insert below the
                  countdown UI): */}
                {betAnalytics && (
                  <Box
                    sx={{
                      mt: isMobile ? 2 : 3,
                      p: 3,
                      borderRadius: "16px",
                      backgroundColor: "#3b3a3a",
                      color: "#fff",
                      boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                      fontSize: isMobile ? "12px" : "14px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      📊 Your Bet Analytics
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography>
                          🎯 <strong>Total Picks:</strong> {betAnalytics.total}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          🏆 <strong>Win Rate:</strong> {betAnalytics.winRate}%
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography>
                          🔥 <strong>Longest Win Streak:</strong>{" "}
                          {betAnalytics.longestStreak}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          🎲 <strong>Risk Profile:</strong>{" "}
                          {betAnalytics.riskProfile}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography>
                          💰 <strong>Most Profitable Bet:</strong>{" "}
                          {betAnalytics.mostProfitableBet}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography>
                          🏟️ <strong>Best Performing Sport:</strong>{" "}
                          {leagueOptions.find(
                            (opt) => opt.value === betAnalytics.bestSport
                          )?.label || betAnalytics.bestSport}{" "}
                          ({betAnalytics.bestSportWinRate}% win rate)
                        </Typography>
                      </Grid>

                      {betAnalytics.upsetAccuracy !== null && (
                        <Grid item xs={12}>
                          <Typography>
                            ⚡ <strong>Upset Pick Accuracy:</strong>{" "}
                            {betAnalytics.upsetAccuracy}%
                          </Typography>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Typography>
                          ⏰ <strong>Most Active Pick Hour:</strong>{" "}
                          {betAnalytics.favoritePickHour}:00
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Box sx={{ mt: isMobile ? 1.5 : 2 }}>
                  <TextField
                    label="Enter Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    fullWidth
                    sx={{
                      mb: 2,
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        height: "38px",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "& input": {
                          height: "38px",
                          padding: "10px",
                          color: "#fff",
                          textAlign: "center",
                          fontSize: isMobile ? "13px" : "15px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#fff",
                        fontSize: isMobile ? "13px" : "15px",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#fff" },
                        "&:hover fieldset": { borderColor: "#fff" },
                        "&.Mui-focused fieldset": { borderColor: "#fff" },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCodeSubmit}
                    disabled={isCodeSubmitting}
                    fullWidth
                    sx={{
                      backgroundColor: "#4F46E5",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      py: 1.2,
                      fontSize: isMobile ? "14px" : "16px",
                      "&:hover": {
                        backgroundColor: "#3E3BA7",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {isCodeSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit Code"
                    )}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default ContestDetailAndAnalytics;
