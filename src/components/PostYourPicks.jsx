import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
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
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTimer } from "../context/TimerContext";
import {
  leagueApiMap,
  leagueOptions,
  nbaAndWnbaMarkets,
  mlbMarkets,
  nflMarkets,
  nhlMarkets,
} from "../utils/leagueData";

const PostYourPicks = ({
  contestName,
  primaryImageUrl,
  price,
  spreadsheetUrl,
  sponsored,
  contestLeague,
  contestEndDate,
  contestStartDate,
  contestFrequency,
  filteredBets,
  aggregateBets,
  lastPeriodAggregateBets,
  availableFreePicks,
}) => {
  const [league, setLeague] = useState("");
  const [pickType, setPickType] = useState("");
  const [participantsUsername, setParticipantsUsername] = useState("");
  const [email, setEmail] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [gameDetails, setGameDetails] = useState(null);
  const [teamPicked, setTeamPicked] = useState("");
  const [odds, setOdds] = useState("");
  const [market, setMarket] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerPicked, setPlayerPicked] = useState("");
  const [playerPickedDetailForView, setPlayerPickedDetailForView] =
    useState("");
  const [propLine, setPropLine] = useState("");
  const [propOverOrUnder, setPropOverOrUnder] = useState("");
  const [gameCommenceTime, setGameCommenceTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picks, setPicks] = useState([]);
  const [code, setCode] = useState("");
  const { state, dispatch } = useTimer();
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);
  const totalTime = 600; // 10 minutes in seconds

  const { user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        dispatch({ type: "SET_TIMER", payload: 600 });

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
        alert("Code applied successfully!");
      } else {
        alert("Invalid or already used code.");
      }
    } catch (error) {
      console.error("Error validating code:", error);
      alert("Failed to validate code. Please try again.");
    } finally {
      setIsCodeSubmitting(false);
    }
  };

  const calculateStrokeDashoffset = () => {
    if (state.timer === null || totalTime === null) return 0;
    const percentage = state.timer / totalTime;
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
    if (selectedGame && pickType === "money line") {
      const fetchGameDetails = async () => {
        try {
          const response = await axios.get(
            `https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings&eventIds=${selectedGame}`
          );

          setGameDetails(response.data[0]);
        } catch (error) {
          console.error("Error fetching game details:", error);
        }
      };
      fetchGameDetails();
    }
  }, [selectedGame, pickType, league]);

  useEffect(() => {
    if (selectedGame && pickType === "props" && market) {
      const fetchMarketDetails = async () => {
        try {
          const response = await axios.get(
            `https://api.the-odds-api.com/v4/sports/${league}/events/${selectedGame}/odds?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=${market}&oddsFormat=american&bookmakers=fanduel`
          );

          const outcomes =
            response.data?.bookmakers?.[0]?.markets?.[0]?.outcomes;

          if (outcomes) {
            setPlayers(outcomes);
          }
          setGameDetails(response.data);
        } catch (error) {
          console.error("Error fetching market details:", error);
        }
      };
      fetchMarketDetails();
    }
  }, [selectedGame, pickType, league, market]);

  useEffect(() => {
    if (contestLeague && contestLeague.length > 0) {
      setLeague(contestLeague[0]);
    }
  }, [contestLeague]);

  const clearFields = () => {
    setLeague("");
    setPickType("");
    setGames([]);
    setSelectedGame("");
    setGameCommenceTime("");
    setGameDetails(null);
    setTeamPicked("");
    setOdds("");
    setPropLine("");
    setPropOverOrUnder("");
    setMarket("");
    setPlayers([]);
    setPlayerPicked("");
    setPlayerPickedDetailForView("");
  };

  const addPick = () => {
    if (!league || !pickType || !selectedGame || !email) {
      toast.error(
        "Please complete all required fields before adding a pick to your lineup!"
      );
      return;
    }

    const newPick = {
      league,
      pickType,
      participantsUsername,
      email,
      selectedGame,
      teamPicked,
      odds,
      market,
      playerPicked,
      propLine,
      propOverOrUnder,
      postedTime: new Date().toISOString(),
      gameCommenceTime: gameCommenceTime,
    };
    setPicks([...picks, newPick]);
    toast.success("Pick added to lineup!");
    clearFields();
  };

  const handleSubmitAll = async () => {
    if (picks.length === 0) {
      toast.error("No picks to submit!");
      return;
    }

    // Check if the participantsUsername has less than 5 bets
    const userBets = aggregateBets.filter(
      (bet) => bet.username === participantsUsername
    );
    console.log("userBets", userBets);
    console.log("participantsUsername", participantsUsername);
    if (
      userBets?.league > 0 &&
      userBets[0]?.numberOfBets >= availableFreePicks &&
      state.timer === 0
    ) {
      toast.error(
        "You have reached the maximum number of free bets for this contest!"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(spreadsheetUrl, picks);
      console.log(response);
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          padding: 3,
        }}
      >
        <Box sx={{ textAlign: "center", color: "#fff", py: 4 }}>
          {/* Contest Details */}
          <Card
            sx={{
              borderRadius: "16px",
              backgroundColor: "#2b2b2b",
              color: "#fff",
              p: 3,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "18px",
                color: "#ccc",
                pb: 3,
                textAlign: "center",
              }}
            >
              Share your top sports picks, climb the leaderboard, and win big!
              📈
            </Typography>

            {/* Contest Details Box */}

            <List
              sx={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#ccc",
                p: 0,
              }}
            >
              <ListItem
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#f5f5f5",
                  pb: 1,
                }}
              >
                📢 {message}
              </ListItem>
              <ListItem sx={{ fontSize: isMobile ? "12px" : "15px", pb: 1 }}>
                💰 <strong>Prize:</strong> {price}
              </ListItem>
              {!isMobile && (
                <ListItem sx={{ fontSize: "15px", color: "#17b978", pb: 1 }}>
                  🏆 Last{" "}
                  {contestFrequency === "Monthly" ? "Month's" : "Week's"}{" "}
                  Winner:{" "}
                  <strong>{lastPeriodAggregateBets[0]?.username}</strong>
                </ListItem>
              )}
              <ListItem sx={{ fontSize: isMobile ? "12px" : "15px", pb: 1 }}>
                🎟️ <strong>Free Picks:</strong> {availableFreePicks}
              </ListItem>
              {!state.timer > 0 && (
                <ListItem
                  sx={{
                    fontSize: isMobile ? "12px" : "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {!isMobile && (
                    <span>
                      🔥 <strong>Want unlimited entries?</strong>
                    </span>
                  )}

                  <Button
                    variant="contained"
                    href="https://buy.stripe.com/3cs4hj00X0TheaY146"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      ml: 1,
                      fontSize: isMobile ? "10px" : "14px",
                      py: 0.5,
                      px: 1.5,
                      backgroundColor: "#4F46E5",
                      "&:hover": {
                        backgroundColor: "#4F46E5", // Same color as the background to remove hover effect
                      },
                    }}
                  >
                    Get Unlimited Entries
                  </Button>
                </ListItem>
              )}
            </List>

            {/* Countdown Timer */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              {state.timer > 0 ? (
                <>
                  <svg width="120" height="120" viewBox="0 0 100 100">
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
                      fontSize="18"
                      fill="#d72323"
                      fontWeight="bold"
                    >
                      {Math.floor(state.timer / 60)}:
                      {String(state.timer % 60).padStart(2, "0")}
                    </text>
                  </svg>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#17b978", mt: 2 }}
                  >
                    You can place unlimited bets for the next 10 minutes.
                  </Typography>
                </>
              ) : (
                <>
                  {/* Code Input Field Inside the Details Box */}
                  <Box sx={{ mt: 2 }}>
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
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff",
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
                        "&:hover": {
                          backgroundColor: "#4F46E5", // Same color as the background to remove hover effect
                        },
                      }}
                    >
                      {isCodeSubmitting ? (
                        <CircularProgress size={24} />
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
            <FormControl
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  borderRadius: "8px",
                  height: "40px",
                  color: "#fff",
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
                    borderColor: !participantsUsername ? "error.main" : "#fff",
                  },
                  "&:hover fieldset": {
                    borderColor: !participantsUsername ? "error.main" : "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: !participantsUsername ? "error.main" : "#fff",
                  },
                },
              }}
            ></FormControl>
            <TextField
              label={`username / email `}
              value={participantsUsername}
              // onChange={handleparticipantsUsernameChange}
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
                    borderColor: !participantsUsername ? "error.main" : "#fff",
                  },
                  "&:hover fieldset": {
                    borderColor: !participantsUsername ? "error.main" : "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: !participantsUsername ? "error.main" : "#fff",
                  },
                },
              }}
            />
            {!participantsUsername && (
              <FormHelperText error>This field is required</FormHelperText>
            )}

            <FormControl
              fullWidth
              margin="normal"
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  borderRadius: "8px",
                  height: "40px",
                  color: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: !league ? "error.main" : "#fff",
                  },
                  "&:hover fieldset": {
                    borderColor: !league ? "error.main" : "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: !league ? "error.main" : "#fff",
                  },
                },
              }}
            >
              <InputLabel id="league-label">League</InputLabel>
              <Select
                labelId="league-label"
                id="league-select"
                value={league}
                label="League *"
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
              {!league && (
                <FormHelperText error>This field is required</FormHelperText>
              )}
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
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: !pickType ? "error.main" : "#fff",
                      },
                      "&:hover fieldset": {
                        borderColor: !pickType ? "error.main" : "#fff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: !pickType ? "error.main" : "#fff",
                      },
                    },
                  }}
                >
                  <InputLabel id="pick-type-label">Pick Type</InputLabel>
                  <Select
                    labelId="pick-type-label"
                    id="pick-type-select"
                    value={pickType}
                    label="Pick Type *"
                    onChange={(e) => setPickType(e.target.value)}
                  >
                    {league !== "soccer_epl" &&
                      league !== "soccer_germany_bundesliga" &&
                      league !== "soccer_italy_serie_a" &&
                      league !== "soccer_spain_la_liga" &&
                      league !== "soccer_usa_mls" &&
                      league !== "americanfootball_ncaaf" &&
                      league !== "basketball_ncaab" && (
                        <MenuItem value="props">Props 🎲</MenuItem>
                      )}
                    <MenuItem value="money line">Money Line 💰</MenuItem>
                  </Select>
                  {!pickType && (
                    <FormHelperText error>
                      This field is required
                    </FormHelperText>
                  )}
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
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: !selectedGame ? "error.main" : "#fff",
                      },
                      "&:hover fieldset": {
                        borderColor: !selectedGame ? "error.main" : "#fff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: !selectedGame ? "error.main" : "#fff",
                      },
                    },
                  }}
                >
                  <InputLabel id="game-label">Game</InputLabel>
                  <Select
                    labelId="game-label"
                    id="game-select"
                    value={selectedGame}
                    label="Game *"
                    onChange={(e) => {
                      setSelectedGame(e.target.value);

                      const selectedGame = games.find(
                        (game) => game.id === e.target.value
                      );
                      if (selectedGame) {
                        setGameCommenceTime(selectedGame.commence_time);
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
                  {!selectedGame && (
                    <FormHelperText error>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>

                {pickType === "money line" && gameDetails && (
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
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: !teamPicked ? "error.main" : "#fff",
                          },
                          "&:hover fieldset": {
                            borderColor: !teamPicked ? "error.main" : "#fff",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: !teamPicked ? "error.main" : "#fff",
                          },
                        },
                      }}
                    >
                      <InputLabel id="team-picked-label">
                        Team Picked
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
                        }}
                      >
                        {gameDetails?.bookmakers &&
                        gameDetails.bookmakers.length > 0 ? (
                          gameDetails.bookmakers[0]?.markets[0]?.outcomes.map(
                            (outcome) => (
                              <MenuItem
                                key={outcome?.name}
                                value={outcome?.name}
                              >
                                {outcome?.name} ({outcome?.price})
                              </MenuItem>
                            )
                          )
                        ) : (
                          <MenuItem disabled>
                            No betting options available
                          </MenuItem>
                        )}
                      </Select>
                      {!teamPicked && (
                        <FormHelperText error>
                          This field is required
                        </FormHelperText>
                      )}
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
                  </>
                )}

                {pickType === "props" && (
                  <>
                    {games.length > 0 && (
                      <FormControl
                        fullWidth
                        margin="normal"
                        sx={{
                          mb: 2,
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            height: "40px",
                            color: "#fff",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: !market ? "error.main" : "#fff",
                            },
                            "&:hover fieldset": {
                              borderColor: !market ? "error.main" : "#fff",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: !market ? "error.main" : "#fff",
                            },
                          },
                        }}
                      >
                        <InputLabel id="market-label">Market</InputLabel>
                        <Select
                          labelId="market-label"
                          id="market-select"
                          value={market}
                          label="Market *"
                          onChange={(e) => setMarket(e.target.value)}
                        >
                          {(league === "basketball_nba" ||
                          league === "basketball_wnba"
                            ? nbaAndWnbaMarkets
                            : league === "baseball_mlb"
                            ? mlbMarkets
                            : league === "icehockey_nhl"
                            ? nhlMarkets
                            : nflMarkets
                          ).map((market) => (
                            <MenuItem key={market.key} value={market.key}>
                              {market.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!market && (
                          <FormHelperText error>
                            This field is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}

                    {players.length > 0 ? (
                      <FormControl
                        fullWidth
                        margin="normal"
                        sx={{
                          mb: 2,
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            height: "40px",
                            color: "#fff",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: !playerPickedDetailForView
                                ? "error.main"
                                : "",
                            },
                            "&:hover fieldset": {
                              borderColor: !playerPickedDetailForView
                                ? "error.main"
                                : "",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: !playerPickedDetailForView
                                ? "error.main"
                                : "primary.main",
                            },
                          },
                        }}
                      >
                        <InputLabel id="player-picked-label">
                          Player Picked
                        </InputLabel>
                        <Select
                          labelId="player-picked-label"
                          id="player-picked-select"
                          value={playerPickedDetailForView}
                          label="Player Picked"
                          onChange={(e) => {
                            const [player, name, point] =
                              e.target.value.split("|"); // Split the value to get both parts
                            const playerDetailsForView = e.target.value;
                            const outcome = players.find(
                              (outcome) =>
                                outcome.description === player &&
                                outcome.name === name &&
                                outcome.point === Number(point)
                            );
                            setPlayerPicked(player);
                            setPlayerPickedDetailForView(playerDetailsForView);
                            setOdds(outcome.price);
                            setPropLine(outcome.point);
                            setPropOverOrUnder(outcome.name);
                          }}
                        >
                          {players.map((outcome) => (
                            <MenuItem
                              key={
                                outcome.description +
                                outcome.name +
                                outcome.point
                              } // Adjusted key to be unique for Over/Under
                              value={`${outcome.description}|${outcome.name}|${outcome.point}`} // Combine description and name
                            >
                              {outcome.description} ({outcome.name}{" "}
                              {outcome.point} ({outcome.price}))
                            </MenuItem>
                          ))}
                        </Select>
                        {!playerPickedDetailForView && (
                          <FormHelperText error>
                            This field is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    ) : (
                      market !== "" && (
                        <TextField
                          fullWidth
                          margin="normal"
                          value="This prop is not available right now"
                          disabled
                          sx={{
                            mb: 2,
                            "& .MuiInputBase-root": {
                              borderRadius: "8px",
                              height: "40px",
                              color: "#fff",
                            },
                          }}
                        />
                      )
                    )}
                    <TextField
                      label="Player Odds"
                      value={odds}
                      fullWidth
                      margin="normal"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          height: "40px",
                          color: "#fff",
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
                    <TextField
                      label="Prop Line"
                      value={propLine}
                      fullWidth
                      margin="normal"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          height: "40px",
                          color: "#fff",
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
                  </>
                )}
              </>
            )}
            <Button
              variant="contained"
              onClick={addPick}
              sx={{
                marginRight: 2,
                backgroundColor: "#4F46E5",
                "&:hover": {
                  backgroundColor: "#4F46E5", // Same color as the background to remove hover effect
                },
              }}
            >
              Add Pick To Lineup
            </Button>
          </CardContent>
        </Card>

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
            <Typography variant="h6" align="center" gutterBottom>
              Your Picks
            </Typography>
            {picks.length === 0 ? (
              <Typography variant="body1" align="center">
                <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  No Picks Selected
                </span>
                <br />
                <span style={{ fontSize: "1rem" }}>
                  Add Picks with the form above.
                </span>
              </Typography>
            ) : (
              <>
                <ul>
                  {picks.map((pick, index) => {
                    const leagueLabel = leagueOptions.find(
                      (option) => option.value === pick.league
                    )?.label;

                    return (
                      <li
                        key={index}
                        style={{ padding: "10px 0", fontSize: "0.875rem" }}
                      >
                        {leagueLabel} - {pick.pickType} -{" "}
                        {pick.pickType === "money line"
                          ? `${pick.teamPicked} (${pick.odds})`
                          : `${pick.playerPicked} (${pick.propOverOrUnder} ${
                              pick.propLine
                            } ${pick.market
                              .replace(/_/g, " ")
                              .replace("player ", "")}) (${pick.odds})`}
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => {
                            const newPicks = picks.filter(
                              (_, i) => i !== index
                            );
                            setPicks(newPicks);
                          }}
                          sx={{ marginLeft: 2 }}
                        >
                          Delete
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            <Button
              variant="contained"
              onClick={handleSubmitAll}
              disabled={picks.length === 0 || isSubmitting}
              sx={{
                marginTop: 2,
                backgroundColor: "#4F46E5",
                "&:hover": {
                  backgroundColor: "#4F46E5", // Same color as the background to remove hover effect
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
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
