import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTimer } from "../context/TimerContext";
import { leagueApiMap, leagueOptions } from "../utils/leagueData";

const PostYourPicks = ({
  contestName,
  primaryImageUrl,
  firstPlacePrize,
  secondPlacePrize,
  thirdPlacePrize,
  spreadsheetUrl,
  isContestActive,
  contestLeague,
  contestEndDate,
  contestStartDate,
  filteredBets,
  aggregateBets,
  availableFreePicks,
}) => {
  const [league, setLeague] = useState("");
  const [pickType, setPickType] = useState("");
  const [participantsUsername, setParticipantsUsername] = useState("");
  const [email, setEmail] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState("");
  const [gameDetails, setGameDetails] = useState(null);
  const [teamPicked, setTeamPicked] = useState("");
  const [odds, setOdds] = useState("");
  const [spreadLine, setSpreadLine] = useState("");
  const [gameCommenceTime, setGameCommenceTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picks, setPicks] = useState([]);
  const [code, setCode] = useState("");
  const { state, dispatch } = useTimer();
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);
  const [countdownMessage, setCountdownMessage] = useState("");
  const totalTime = 600; // 10 minutes in seconds

  const { user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const timer = state.timers?.[contestName] || 0;

  const handleCodeSubmit = async () => {
    setIsCodeSubmitting(true);
    try {
      // Fetch the current list of codes
      const response = await fetch(
        "https://api.sheetbest.com/sheets/ef14d1b6-72df-47a9-8be8-9046b19cfa87"
      );
      const data = await response.json();

      // Check if the entered code is valid and not already used
      const codeEntry = data.find(
        (entry) => entry.Code === code && entry.isUsed === "FALSE"
      );

      if (codeEntry) {
        // Set the timer for 10 minutes (600 seconds)
        dispatch({
          type: "SET_TIMER",
          payload: { contestName, timer: 600 },
        });

        // Update the code's status to "used"
        await fetch(
          `https://api.sheetbest.com/sheets/ef14d1b6-72df-47a9-8be8-9046b19cfa87/Code/${code}`,
          {
            method: "PATCH",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Code: code,
              isUsed: "TRUE",
            }),
          }
        );

        setCode(""); // Clear the input field
        toast.success("Code applied successfully!");
      } else {
        toast.error("Invalid or already used code.");
      }
    } catch (error) {
      console.error("Error validating code:", error);
      toast.error("Failed to validate code. Please try again.");
    } finally {
      setIsCodeSubmitting(false);
    }
  };

  const calculateAvailableFreePicksLeft = () => {
    const userBets = aggregateBets.find(
      (bet) => bet.username === participantsUsername
    );
    const betsPlaced = userBets ? userBets.numberOfBets : 0;

    // If timer is active, unlimited bets are allowed
    if (timer > 0) {
      return Infinity; // Indicates unlimited bets allowed
    }

    // Available free picks minus bets already submitted (ignores local state picks)
    return Math.max(availableFreePicks - betsPlaced, 0);
  };

  const calculateStrokeDashoffset = () => {
    if (timer === null || totalTime === null) return 0;
    const percentage = timer / totalTime;
    const circumference = 2 * Math.PI * 45; // Radius is 45
    return circumference * (1 - percentage);
  };

  useEffect(() => {
    if (user && user.email) {
      setParticipantsUsername(user.userName);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (league) {
      const fetchGames = async () => {
        try {
          const response = await axios.get(leagueApiMap[league]);
          setGames(response.data);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
      };
      fetchGames();
    }
  }, [league]);

  useEffect(() => {
    if (
      selectedGameId &&
      (pickType === "money line" || pickType === "spread")
    ) {
      const fetchGameDetails = async () => {
        try {
          let response;
          if (pickType === "money line") {
            response = await axios.get(
              `https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings&eventIds=${selectedGameId}`
            );
          } else if (pickType === "spread") {
            response = await axios.get(
              `https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=spreads&oddsFormat=american&bookmakers=draftkings&eventIds=${selectedGameId}`
            );
          }
          setGameDetails(response.data[0]);
        } catch (error) {
          console.error("Error fetching game details:", error);
        }
      };
      fetchGameDetails();
    }
  }, [selectedGameId, pickType, league]);

  useEffect(() => {
    if (contestLeague && contestLeague.length > 0) {
      setLeague(contestLeague[0]);
    }
  }, [contestLeague]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { message } = calculateDuration(contestStartDate, contestEndDate);
      setCountdownMessage(message);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [contestStartDate, contestEndDate]);

  const clearFields = () => {
    setLeague("");
    setPickType("");
    setGames([]);
    setSelectedGameId("");
    setGameCommenceTime("");
    setGameDetails(null);
    setTeamPicked("");
    setOdds("");
    setSpreadLine("");
  };

  const addPick = () => {
    const freePicksLeft = calculateAvailableFreePicksLeft();

    if (freePicksLeft === 0) {
      toast.error(
        "You have used all available free picks! Buy unlimited picks to continue."
      );
      return;
    }

    if (!league || !pickType || !selectedGameId || !email) {
      toast.error("Please complete all required fields before adding a pick!");
      return;
    }

    const newPick = {
      league,
      pickType,
      participantsUsername,
      email,
      selectedGameId,
      teamPicked,
      odds,
      spreadLine,
      postedTime: new Date().toISOString(),
      gameCommenceTime: gameCommenceTime,
    };

    // Helper function to compare picks
    const isDuplicate = (pickA, pickB) => {
      return (
        pickA.league === pickB.league &&
        pickA.pickType === pickB.pickType &&
        pickA.selectedGameId === pickB.selectedGameId &&
        pickA.participantsUsername === pickB.participantsUsername &&
        (pickA.pickType === "money line"
          ? pickA.teamPicked === pickB.teamPicked
          : pickA.playerPicked === pickB.playerPicked &&
            pickA.spreadLine === pickB.spreadLine &&
            pickA.propOverOrUnder === pickB.propOverOrUnder &&
            pickA.market === pickB.market)
      );
    };

    // Check against existing submitted bets
    const alreadyExists = filteredBets.some((existingPick) =>
      isDuplicate(existingPick, newPick)
    );

    // Check against current local picks
    const alreadyInSession = picks.some((pendingPick) =>
      isDuplicate(pendingPick, newPick)
    );

    if (alreadyExists || alreadyInSession) {
      toast.error("You've already submitted or added this exact pick!");
      return;
    }

    setPicks([...picks, newPick]);
    toast.success("Pick added to lineup!");
    clearFields();
  };

  const handleSubmitAll = async () => {
    if (picks.length === 0) {
      toast.error("No picks to submit!");
      return;
    }

    // Get the number of previously submitted picks
    const userBets = aggregateBets.find(
      (bet) => bet.username === participantsUsername
    );
    const betsPlaced = userBets ? userBets.numberOfBets : 0;

    // Allow unlimited picks if timer is active
    if (timer > 0) {
      setIsSubmitting(true);
      try {
        await axios.post(spreadsheetUrl, picks);
        toast.success("All picks submitted successfully!");
        setPicks([]);
        window.location.reload();
      } catch (error) {
        console.error("Error submitting picks:", error);
        toast.error("Failed to submit picks!");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Calculate remaining free picks
    const freePicksLeft = availableFreePicks - betsPlaced;

    // Check if new picks exceed free picks limit
    if (picks.length > freePicksLeft) {
      toast.error(
        `You can only submit ${freePicksLeft} more free pick(s). You currently have ${betsPlaced} submitted picks and ${picks.length} pending picks.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(spreadsheetUrl, picks);
      toast.success("All picks submitted successfully!");
      setPicks([]);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting picks:", error);
      toast.error("Failed to submit picks!");
    } finally {
      setIsSubmitting(false);
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          padding: 3,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "#fff",
            py: isMobile ? 3 : 4,
            maxWidth: isMobile ? "90%" : "600px",
            margin: "auto",
          }}
        >
          <Card
            sx={{
              borderRadius: "16px",
              backgroundColor: "#2b2b2b",
              color: "#fff",
              p: isMobile ? 2 : 4,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                fontSize: isMobile ? "24px" : "32px",
                color: "#f5f5f5",
                textAlign: "center",
                pb: isMobile ? 1 : 2,
              }}
            >
              🚀 Join & Win Big!
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: isMobile ? "14px" : "16px",
                color: "#ccc",
                pb: isMobile ? 2 : 3,
                textAlign: "center",
              }}
            >
              Share your top sports picks, climb the leaderboard, and win
              amazing prizes! 📈
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
                  fontSize: isMobile ? "12px" : "20px",
                  color: "#f5f5f5",
                  pb: isMobile ? 0.5 : 1,
                }}
              >
                {countdownMessage}
              </ListItem>

              {!isMobile && (
                <ListItem
                  sx={{
                    fontSize: "15px",
                    pb: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography sx={{ mb: 1, fontSize: "16px" }}>
                    🥇 1st Prize: {firstPlacePrize}
                  </Typography>
                  <Typography sx={{ mb: 1, fontSize: "16px" }}>
                    🥈 2nd Prize: {secondPlacePrize}
                  </Typography>
                  <Typography sx={{ fontSize: "16px" }}>
                    🥉 3rd Prize: {thirdPlacePrize}
                  </Typography>
                </ListItem>
              )}

              <ListItem sx={{ fontSize: isMobile ? "12px" : "15px", pb: 1 }}>
                {!isMobile
                  ? `Free Picks Left: ${calculateAvailableFreePicksLeft()} / ${availableFreePicks}`
                  : `Free Picks Left: ${calculateAvailableFreePicksLeft()}`}
              </ListItem>

              {timer <= 0 && (
                <ListItem
                  sx={{
                    fontSize: "15px",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: isMobile ? "12px" : "14px",
                      mb: isMobile ? 1 : 0,
                      pr: isMobile ? 0 : 1,
                    }}
                  >
                    More Picks, Bigger Wins!
                  </Typography>

                  <Button
                    variant="contained"
                    href="https://buy.stripe.com/28odRT1518lJgj63cg"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: isMobile ? "8px" : "12px",
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
                    Get Unlimited Picks for 10 Min – Only $5!
                  </Button>
                </ListItem>
              )}
            </List>

            {/* Countdown Timer */}
            <Box sx={{ textAlign: "center", mt: isMobile ? 3 : 4 }}>
              {timer > 0 ? (
                <>
                  <svg
                    width={isMobile ? "100" : "120"}
                    height={isMobile ? "100" : "120"}
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#E0E0E0"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#d72323"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={calculateStrokeDashoffset()}
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                    <text
                      x="50"
                      y="55"
                      textAnchor="middle"
                      fontSize={isMobile ? "14" : "18"}
                      fill="#d72323"
                      fontWeight="bold"
                    >
                      {Math.floor(timer / 60)}:
                      {String(timer % 60).padStart(2, "0")}
                    </text>
                  </svg>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#17b978", mt: isMobile ? 1.5 : 2 }}
                  >
                    ⏳ Unlimited bets for {Math.floor(timer / 60)} minutes!
                  </Typography>
                </>
              ) : (
                <>
                  {/* Code Input Field */}
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

        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            maxWidth: "600px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            margin: "auto",
            marginTop: 2,
            marginBottom: 5,
            backgroundColor: "#2b2b2b",
            color: "#fff",
          }}
        >
          <CardContent sx={{ color: "fff" }}>
            <TextField
              label={`username*`}
              value={participantsUsername}
              fullWidth
              color={!participantsUsername ? "error" : "primary"}
              margin="normal"
              placeholder={`Twitter username e.g sure_odds2023`}
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "8px",
                  height: "40px",
                  "& input": {
                    height: "40px",
                    padding: "10px",
                    color: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  borderRadius: "8px",
                  height: "40px",
                  color: "#fff",
                  width: isMobile ? "240px" : "100%", // Ensure text does not overflow
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
              }}
            >
              <InputLabel id="league-label">League*</InputLabel>
              <Select
                labelId="league-label"
                id="league-select"
                value={league}
                label="League"
                onChange={(e) => setLeague(e.target.value)}
              >
                {leagueOptions
                  .filter((option) => contestLeague.includes(option.value))
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {league && (
              <>
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      height: "40px",
                      color: "#fff",
                      width: isMobile ? "240px" : "100%", // Ensure text does not overflow
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#fff",
                      },
                      "&:hover fieldset": {
                        borderColor: "#fff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#fff",
                      },
                    },
                  }}
                >
                  <InputLabel id="pick-type-label">Pick Type*</InputLabel>
                  <Select
                    labelId="pick-type-label"
                    id="pick-type-select"
                    value={pickType}
                    label="Pick Type"
                    onChange={(e) => setPickType(e.target.value)}
                  >
                    <MenuItem value="money line">Money Line 💰</MenuItem>
                    <MenuItem value="spread">Spread 📏</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      height: "40px",
                      color: "#fff",
                      width: isMobile ? "240px" : "100%", // Ensure text does not overflow
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#fff",
                      },
                      "&:hover fieldset": {
                        borderColor: "#fff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#fff",
                      },
                    },
                  }}
                >
                  <InputLabel id="game-label">Game*</InputLabel>
                  <Select
                    labelId="game-label"
                    id="game-select"
                    value={selectedGameId}
                    label="Game"
                    onChange={(e) => {
                      setSelectedGameId(e.target.value);

                      const selectedGameId = games.find(
                        (game) => game.id === e.target.value
                      );
                      if (selectedGameId) {
                        setGameCommenceTime(selectedGameId.commence_time);
                      }
                    }}
                  >
                    {games.length > 0 ? (
                      games
                        .filter(
                          (game) => new Date(game.commence_time) > new Date()
                        )
                        .map((game) => (
                          <MenuItem key={game.id} value={game.id}>
                            {game.home_team} vs {game.away_team}
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled>No games available</MenuItem>
                    )}
                  </Select>
                </FormControl>

                {(pickType === "money line" || pickType === "spread") &&
                  gameDetails && (
                    <>
                      <FormControl
                        fullWidth
                        margin="normal"
                        sx={{
                          mb: 2,
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            height: "40px",
                            color: "#fff",
                            width: isMobile ? "240px" : "100%", // Ensure text does not overflow
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#fff",
                            },
                            "&:hover fieldset": {
                              borderColor: "#fff",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#fff",
                            },
                          },
                        }}
                      >
                        <InputLabel id="team-picked-label">
                          Team Picked*
                        </InputLabel>
                        <Select
                          labelId="team-picked-label"
                          id="team-picked-select"
                          value={teamPicked}
                          label="Team Picked *"
                          onChange={(e) => {
                            const team = e.target.value;
                            const outcome =
                              gameDetails?.bookmakers[0]?.markets[0]?.outcomes.find(
                                (outcome) => outcome?.name === team
                              );
                            setTeamPicked(team);
                            setOdds(outcome?.price);
                            if (pickType === "spread") {
                              setSpreadLine(outcome?.point); // Assuming `point` holds the spread value
                            }
                          }}
                        >
                          {gameDetails?.bookmakers &&
                          gameDetails.bookmakers.length > 0 ? (
                            gameDetails.bookmakers[0]?.markets[0]?.outcomes.map(
                              (outcome) =>
                                pickType === "money line" ? (
                                  <MenuItem
                                    key={outcome?.name}
                                    value={outcome?.name}
                                  >
                                    {outcome?.name} ({outcome?.price})
                                  </MenuItem>
                                ) : pickType === "spread" ? (
                                  <MenuItem
                                    key={outcome?.name}
                                    value={outcome?.name}
                                  >
                                    {outcome?.name} ({outcome?.price}, Spread:{" "}
                                    {outcome?.point})
                                  </MenuItem>
                                ) : null
                            )
                          ) : (
                            <MenuItem disabled>
                              No betting options available
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Odds"
                        value={odds}
                        fullWidth
                        margin="normal"
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            height: "40px",
                            "& input": {
                              height: "40px",
                              padding: "10px",
                              color: "#fff",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff",
                          },
                        }}
                      />
                      {pickType === "spread" && (
                        <TextField
                          label="Spread Point"
                          value={spreadLine || ""}
                          fullWidth
                          margin="normal"
                          sx={{
                            "& .MuiInputBase-root": {
                              borderRadius: "8px",
                              height: "40px",
                              "& input": {
                                height: "40px",
                                padding: "10px",
                                color: "#fff",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#fff",
                            },
                          }}
                        />
                      )}
                    </>
                  )}
              </>
            )}
            <Button
              variant="contained"
              onClick={addPick}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%", // Make it full width for better UX
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                backgroundColor: "#4F46E5",
                color: "#fff",
                borderRadius: "10px",
                transition: "0.3s",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",

                "&:hover": {
                  backgroundColor: "#3E3BA7", // Lighter shade on hover
                  transform: "scale(1.03)", // Subtle scaling effect
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.5)",
                },

                "&:active": {
                  transform: "scale(0.98)", // Slight press effect
                },
              }}
            >
              ➕ Add Pick To Lineup
            </Button>
          </CardContent>

          {/* submit all picks section */}
          <CardContent>
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                mb: 2,
              }}
            >
              Your Picks 🎯
            </Typography>

            {picks.length === 0 ? (
              <Typography
                variant="body1"
                align="center"
                sx={{
                  color: "#bbb",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                <strong>No picks selected.</strong> <br />
                Add picks using the form above.
              </Typography>
            ) : (
              <List>
                {picks.map((pick, index) => {
                  const leagueLabel = leagueOptions.find(
                    (option) => option.value === pick.league
                  )?.label;

                  return (
                    <ListItem
                      key={index}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px",
                        px: 2,
                        py: 1.5,
                        mb: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: isMobile ? "0.85rem" : "1rem",
                          fontWeight: 500,
                          flex: 1,
                          color: "#ddd",
                        }}
                      >
                        {leagueLabel} - {pick.pickType} -{" "}
                        {pick.pickType === "money line"
                          ? `${pick.teamPicked} (${pick.odds})`
                          : `${pick.teamPicked}  (${pick.spreadLine}) (${pick.odds})`}
                      </Typography>

                      <IconButton
                        size="small"
                        sx={{
                          color: "#ff4d4d",
                          transition: "0.2s",
                          "&:hover": { color: "#ff6666" },
                        }}
                        onClick={() => {
                          const newPicks = picks.filter((_, i) => i !== index);
                          setPicks(newPicks);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
            )}

            <Button
              variant="contained"
              onClick={handleSubmitAll}
              disabled={picks.length === 0 || isSubmitting}
              sx={{
                marginTop: 2,
                backgroundColor: "#4F46E5",
                color: "#fff",
                fontWeight: "bold",
                width: "100%",
                py: 1.5,
                fontSize: "1rem",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#3E3BA7" },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit All Picks"
              )}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default PostYourPicks;
