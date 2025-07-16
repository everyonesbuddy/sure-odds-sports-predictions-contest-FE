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
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import { leagueApiMap, leagueOptions } from "../utils/leagueData";

const PicksForm = ({
  contestName,
  spreadsheetUrl,
  contestPrimaryPrize,
  contestLeague,
  contestEndDate,
  contestStartDate,
  currentUserBetsForContest,
  aggregateBets,
  availableFreePicks,
  availableMarkets,
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

  const { user, token } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const calculateAvailableFreePicksLeft = () => {
    const userBets = aggregateBets.find(
      (bet) => bet.username === participantsUsername
    );
    const betsPlaced = userBets ? userBets.numberOfBets : 0;

    // Available free picks minus bets already submitted (ignores local state picks)
    return Math.max(availableFreePicks - betsPlaced, 0);
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

    setPicks([...picks, newPick]);
    toast.success("Pick added to lineup!");
    clearFields();
  };

  const handleSubmitAll = async () => {
    if (picks.length === 0) {
      toast.error("No picks to submit!");
      return;
    }

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

    // Check for duplicates in picks array
    const hasDuplicates = picks.some((pick, index) => {
      return (
        picks.findIndex((otherPick) => isDuplicate(pick, otherPick)) !== index
      );
    });

    if (hasDuplicates) {
      toast.error(
        "You have duplicate picks. Please remove or edit them before submitting."
      );
      return;
    }

    // Check for duplicates in backend (currentUserBetsForContest)
    const hasBackendDuplicates = picks.some((pick) => {
      return currentUserBetsForContest.some((existingPick) =>
        isDuplicate(pick, existingPick)
      );
    });

    if (hasBackendDuplicates) {
      toast.error(
        "Some of your picks have already been submitted. Please remove or edit them before submitting."
      );
      return;
    }

    // Get the number of previously submitted picks
    const userBets = aggregateBets.find(
      (bet) => bet.username === participantsUsername
    );
    const betsPlaced = userBets ? userBets.numberOfBets : 0;

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
      await axios.post(spreadsheetUrl, picks, {
        //api endpoint to post picks to contest with free picks available
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
      });
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

  return (
    <>
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          width: "600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          margin: "auto",
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
            placeholder={`Username e.g sure_odds2023`}
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "8px",
                height: "40px",
                "& input": {
                  height: "40px",
                  // padding: "10px",
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
              // mb: 2,
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
                  // mb: 2,
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
                  {availableMarkets.includes("Moneyline") && (
                    <MenuItem value="money line">Money Line 💰</MenuItem>
                  )}
                  {availableMarkets.includes("Spread") && (
                    <MenuItem value="spread">Spread 📏</MenuItem>
                  )}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  // mb: 2,
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
                        // mb: 2,
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
                        {/* use this in entry fee platform but we are on the free platform */}
                        {/* {gameDetails?.bookmakers &&
                        gameDetails.bookmakers.length > 0 ? (
                          gameDetails.bookmakers[0]?.markets[0]?.outcomes
                            .filter((outcome) => {
                              const odds = outcome?.price;

                              // Convert American odds to implied probability
                              const impliedProbability =
                                odds < 0
                                  ? -odds / (-odds + 100)
                                  : 100 / (odds + 100);

                              return impliedProbability <= 0.7; // Only allow if 70% or less
                            })
                            .map((outcome) =>
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
                        )} */}

                        {/* this version does not fiter out certain odds */}
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
              py: 1,
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
              // mb: 2,
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
                      py: 1,
                      mb: 1,
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
              marginTop: 1,
              backgroundColor: "#4F46E5",
              color: "#fff",
              fontWeight: "bold",
              width: "100%",
              py: 1,
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
    </>
  );
};

export default PicksForm;
