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
} from "@mui/material";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const leagueApiMap = {
  basketball_wnba:
    "https://api.the-odds-api.com/v4/sports/basketball_wnba/odds/?apiKey=9a74934bfd1e9d98c6cc43068f53e7ae&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  basketball_nba:
    "https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=9a74934bfd1e9d98c6cc43068f53e7ae&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  baseball_mlb:
    "https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=9a74934bfd1e9d98c6cc43068f53e7ae&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  americanfootball_nfl:
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=9a74934bfd1e9d98c6cc43068f53e7ae&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  soccer_epl:
    "https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=9a74934bfd1e9d98c6cc43068f53e7ae&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
};

const nbaAndWnbaMarkets = [
  { key: "player_points", name: "Points (Over/Under)" },
  { key: "player_rebounds", name: "Rebounds (Over/Under)" },
  { key: "player_assists", name: "Assists (Over/Under)" },
  { key: "player_threes", name: "Threes (Over/Under)" },
  { key: "player_blocks", name: "Blocks (Over/Under)" },
  { key: "player_steals", name: "Steals (Over/Under)" },
  { key: "player_blocks_steals", name: "Blocks + Steals (Over/Under)" },
  { key: "player_turnovers", name: "Turnovers (Over/Under)" },
  {
    key: "player_points_rebounds_assists",
    name: "Points + Rebounds + Assists (Over/Under)",
  },
  { key: "player_points_rebounds", name: "Points + Rebounds (Over/Under)" },
  { key: "player_points_assists", name: "Points + Assists (Over/Under)" },
  { key: "player_rebounds_assists", name: "Rebounds + Assists (Over/Under)" },
];

const mlbMarkets = [
  { key: "batter_home_runs", name: "Batter home runs (Over/Under)" },
  { key: "batter_first_home_run", name: "Batter first home run (Yes/No)" },
  { key: "batter_hits", name: "Batter hits (Over/Under)" },
  { key: "batter_total_bases", name: "Batter total bases (Over/Under)" },
  { key: "batter_rbis", name: "Batter RBIs (Over/Under)" },
  { key: "batter_runs_scored", name: "Batter runs scored (Over/Under)" },
  {
    key: "batter_hits_runs_rbis",
    name: "Batter hits + runs + RBIs (Over/Under)",
  },
  { key: "batter_singles", name: "Batter singles (Over/Under)" },
  { key: "batter_doubles", name: "Batter doubles (Over/Under)" },
  { key: "batter_triples", name: "Batter triples (Over/Under)" },
  { key: "batter_walks", name: "Batter walks (Over/Under)" },
  { key: "batter_strikeouts", name: "Batter strikeouts (Over/Under)" },
  { key: "batter_stolen_bases", name: "Batter stolen bases (Over/Under)" },
  { key: "pitcher_strikeouts", name: "Pitcher strikeouts (Over/Under)" },
  { key: "pitcher_record_a_win", name: "Pitcher to record a win (Yes/No)" },
  { key: "pitcher_hits_allowed", name: "Pitcher hits allowed (Over/Under)" },
  { key: "pitcher_walks", name: "Pitcher walks (Over/Under)" },
  { key: "pitcher_earned_runs", name: "Pitcher earned runs (Over/Under)" },
  { key: "pitcher_outs", name: "Pitcher outs (Over/Under)" },
];

const PostYourPicks = () => {
  const [league, setLeague] = useState("");
  const [pickType, setPickType] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [socialType, setSocialType] = useState("twitter"); // default value
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Call this function when the Twitter username input changes
  const handleTwitterUsernameChange = (event) => {
    const username = event.target.value;
    setTwitterUsername(username);
  };

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
            `https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=9a74934bfd1e9d98c6cc43068f53e7ae&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings&eventIds=${selectedGame}`
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
            `https://api.the-odds-api.com/v4/sports/${league}/events/${selectedGame}/odds?apiKey=9a74934bfd1e9d98c6cc43068f53e7ae&regions=us&markets=${market}&oddsFormat=american&bookmakers=fanduel`
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

  const clearFields = () => {
    setLeague("");
    setPickType("");
    setTwitterUsername("");
    setGames([]);
    setSelectedGame("");
    setGameDetails(null);
    setTeamPicked("");
    setOdds("");
    setPropLine("");
    setPropOverOrUnder("");
    setSocialType("twitter");
    setMarket("");
    setPlayers([]);
    setPlayerPicked("");
    setPlayerPickedDetailForView("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    console.log({
      league,
      pickType,
      twitterUsername,
      socialType,
      selectedGame,
      teamPicked,
      odds,
      propLine,
      propOverOrUnder,
      market,
      playerPicked,
      gameDetails,
    });

    const data = {
      // Step 2: Prepare the data object
      league,
      pickType,
      twitterUsername,
      socialType,
      selectedGameId: selectedGame,
      teamPicked,
      odds,
      propLine,
      propOverOrUnder,
      market,
      playerPicked,
      postedTime: new Date().toISOString(),
      gameCommenceTime: gameDetails?.commence_time,
    };

    try {
      const response = await axios.post(
        "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
        data
      ); // Step 2: Send POST request
      console.log(response); // Handle response
      clearFields(); // Clear all fields after submit
      toast.success("Submit Successful!"); // Show success toast
    } catch (error) {
      console.error(error); // Step 3: Handle error
      toast.error("Submit Failed!"); // Show error toast
    } finally {
      setIsSubmitting(false); // Disable spinner
    }
  };

  return (
    <>
      <Typography align="center" gutterBottom>
        🌟 Showcase Your Expertise: Share your top sports picks now to climb the
        leaderboard 📈, earn money 💰in our Free to play sports prediction
        contest🚀!
      </Typography>
      <Card
        sx={{
          mt: 2,
          mb: 12,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <CardContent>
          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                borderRadius: "8px",
                height: "40px",
              },
            }}
          >
            <InputLabel id="social-type-label">Social Type</InputLabel>
            <Select
              labelId="social-type-label"
              id="socialType"
              value={socialType}
              onChange={(e) => setSocialType(e.target.value)}
              label="Social Type"
            >
              <MenuItem value="twitter">X (Twitter)</MenuItem>
              <MenuItem value="reddit">Reddit</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={`${socialType} username *`}
            value={twitterUsername}
            onChange={handleTwitterUsernameChange}
            fullWidth
            color={!twitterUsername ? "error" : "primary"}
            margin="normal"
            placeholder={`${socialType} username e.g sure_odds2023`}
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "8px",
                height: "40px",
                "& input": {
                  height: "40px",
                  padding: "10px",
                },
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: !twitterUsername ? "error.main" : "",
                },
                "&:hover fieldset": {
                  borderColor: !twitterUsername ? "error.main" : "",
                },
                "&.Mui-focused fieldset": {
                  borderColor: !twitterUsername ? "error.main" : "primary.main",
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
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: !league ? "error.main" : "",
                },
                "&:hover fieldset": {
                  borderColor: !league ? "error.main" : "",
                },
                "&.Mui-focused fieldset": {
                  borderColor: !league ? "error.main" : "primary.main",
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
              <MenuItem value="basketball_wnba">WNBA 🏀</MenuItem>
              {/* <MenuItem value="basketball_nba">NBA 🏀</MenuItem> */}
              <MenuItem value="baseball_mlb">MLB ⚾</MenuItem>
              <MenuItem value="americanfootball_nfl">NFL 🏈</MenuItem>
              <MenuItem value="soccer_epl">EPL ⚽</MenuItem>
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
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: !pickType ? "error.main" : "",
                    },
                    "&:hover fieldset": {
                      borderColor: !pickType ? "error.main" : "",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: !pickType ? "error.main" : "primary.main",
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
                  {league !== "soccer_epl" && (
                    <MenuItem value="props">Props 🎲</MenuItem>
                  )}
                  <MenuItem value="money line">Money Line 💰</MenuItem>
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
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: !selectedGame ? "error.main" : "",
                    },
                    "&:hover fieldset": {
                      borderColor: !selectedGame ? "error.main" : "",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: !selectedGame
                        ? "error.main"
                        : "primary.main",
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
                  onChange={(e) => setSelectedGame(e.target.value)}
                >
                  {games.length > 0 ? (
                    games.map((game) => (
                      <MenuItem key={game.id} value={game.id}>
                        {game.home_team} vs {game.away_team}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No games available</MenuItem>
                  )}
                </Select>
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
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: !teamPicked ? "error.main" : "",
                        },
                        "&:hover fieldset": {
                          borderColor: !teamPicked ? "error.main" : "",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: !teamPicked
                            ? "error.main"
                            : "primary.main",
                        },
                      },
                    }}
                  >
                    <InputLabel id="team-picked-label">Team Picked</InputLabel>
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
                            <MenuItem key={outcome?.name} value={outcome?.name}>
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
                  </FormControl>
                  <TextField
                    label="Odds"
                    value={odds}
                    fullWidth
                    margin="normal"
                    disabled
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        height: "40px",
                        "& input": {
                          height: "40px",
                          padding: "10px",
                        },
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
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: !market ? "error.main" : "",
                          },
                          "&:hover fieldset": {
                            borderColor: !market ? "error.main" : "",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: !market
                              ? "error.main"
                              : "primary.main",
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
                          : mlbMarkets
                        ).map((market) => (
                          <MenuItem key={market.key} value={market.key}>
                            {market.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {players.length > 0 && (
                    <FormControl
                      fullWidth
                      margin="normal"
                      sx={{
                        mb: 2,
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          height: "40px",
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
                              outcome.description + outcome.name + outcome.point
                            } // Adjusted key to be unique for Over/Under
                            value={`${outcome.description}|${outcome.name}|${outcome.point}`} // Combine description and name
                          >
                            {outcome.description} ({outcome.name}{" "}
                            {outcome.point} ({outcome.price}))
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <TextField
                    label="Player Odds"
                    value={odds}
                    fullWidth
                    margin="normal"
                    disabled
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        height: "40px",
                        "& input": {
                          height: "40px",
                          padding: "10px",
                        },
                      },
                    }}
                  />
                </>
              )}
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            disabled={!twitterUsername || !league || !pickType || !selectedGame}
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit Picks"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default PostYourPicks;
