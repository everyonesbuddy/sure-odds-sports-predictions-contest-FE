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
} from "@mui/material";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const leagueApiMap = {
  basketball_wnba:
    "https://api.the-odds-api.com/v4/sports/basketball_wnba/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  basketball_nba:
    "https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  baseball_mlb:
    "https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  americanfootball_nfl:
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  americanfootball_ncaaf:
    "https://api.the-odds-api.com/v4/sports/americanfootball_ncaaf/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  basketball_ncaab:
    "https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  soccer_epl:
    "https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  soccer_germany_bundesliga:
    "https://api.the-odds-api.com/v4/sports/soccer_germany_bundesliga/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  soccer_italy_serie_a:
    "https://api.the-odds-api.com/v4/sports/soccer_italy_serie_a/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  soccer_spain_la_liga:
    "https://api.the-odds-api.com/v4/sports/soccer_spain_la_liga/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  soccer_usa_mls:
    "https://api.the-odds-api.com/v4/sports/soccer_usa_mls/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
  icehockey_nhl:
    "https://api.the-odds-api.com/v4/sports/icehockey_nhl/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings",
};

const leagueOptions = [
  { value: "basketball_nba", label: "NBA 🏀" },
  { value: "americanfootball_nfl", label: "NFL 🏈" },
  { value: "americanfootball_ncaaf", label: "NCAA Football 🏈" },
  { value: "basketball_ncaab", label: "NCAA Basketball 🏀" },
  { value: "icehockey_nhl", label: "NHL 🏒" },
  { value: "soccer_epl", label: "EPL ⚽" },
  { value: "soccer_germany_bundesliga", label: "Bundesliga ⚽" },
  { value: "soccer_italy_serie_a", label: "Serie A ⚽" },
  { value: "soccer_spain_la_liga", label: "La Liga ⚽" },
  { value: "soccer_usa_mls", label: "MLS ⚽" },
];

const nbaAndWnbaMarkets = [
  { key: "player_points", name: "Points (Over/Under)" },
  { key: "player_rebounds", name: "Rebounds (Over/Under)" },
  { key: "player_assists", name: "Assists (Over/Under)" },
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
  { key: "pitcher_hits_allowed", name: "Pitcher hits allowed (Over/Under)" },
  { key: "pitcher_walks", name: "Pitcher walks (Over/Under)" },
  { key: "pitcher_earned_runs", name: "Pitcher earned runs (Over/Under)" },
  { key: "pitcher_outs", name: "Pitcher outs (Over/Under)" },
];

const nflMarkets = [
  { key: "player_pass_attempts", name: "Pass Attempts (Over/Under)" },
  { key: "player_pass_completions", name: "Pass Completions (Over/Under)" },
  { key: "player_pass_interceptions", name: "Pass Interceptions (Over/Under)" },
  { key: "player_pass_yds", name: "Pass Yards (Over/Under)" },
  { key: "player_rush_yds", name: "Rush Yards (Over/Under)" },
  { key: "player_reception_yds", name: "Reception Yards (Over/Under)" },
  { key: "player_receptions", name: "Receptions (Over/Under)" },
  // {
  //   key: "player_rush_reception_tds",
  //   name: "Rush + Reception Touchdowns (Over/Under)",
  // },
  { key: "player_pass_tds", name: "Pass Touchdowns (Over/Under)" },
  { key: "player_rush_attempts", name: "Rush Attempts (Over/Under)" },
];

const nhlMarkets = [
  { key: "player_goals", name: "Player Goals (Over/Under)" },
  { key: "player_assists", name: "Player Assists (Over/Under)" },
  // { key: "player_shots_on_goal", name: "Shots on goal  (Over/Under)" },
  { key: "player_total_saves", name: "Total saves (Over/Under)" },
];

const PostYourPicks = ({
  contestName,
  primaryImageUrl,
  price,
  spreadsheetUrl,
  sponsored,
  affiliateUrl,
  contestLeague,
  contestEndDate,
}) => {
  const [league, setLeague] = useState("");
  const [pickType, setPickType] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
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

  // Call this function when the Twitter username input changes
  const handleTwitterUsernameChange = (event) => {
    const username = event.target.value;
    setTwitterUsername(username);
  };

  //call this function when the emailinput changes
  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
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

  // const handleOddsChange = (e) => {
  //   setOdds(e.target.value);
  // };

  // const handlePropLineChange = (e) => {
  //   setPropLine(e.target.value);
  // };

  const addPick = () => {
    if (!league || !pickType || !selectedGame || !email || emailError) {
      toast.error("Please complete all required fields before adding a pick!");
      return;
    }

    const newPick = {
      league,
      pickType,
      twitterUsername,
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
    toast.success("Pick added!");
    clearFields();
  };

  const handleSubmitAll = async () => {
    if (picks.length === 0) {
      toast.error("No picks to submit!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(spreadsheetUrl, picks);
      console.log(response);
      toast.success("All picks submitted successfully!");
      setPicks([]);
    } catch (error) {
      console.error("Error submitting picks:", error);
      toast.error("Failed to submit picks!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Typography align="center" gutterBottom sx={{ paddingTop: "15px" }}>
        🌟 Join the{" "}
        <a href={affiliateUrl} target="_blank" rel="noreferrer">
          {contestName} Contest
        </a>{" "}
        Contest: Share your top sports picks now to climb the leaderboard, and
        win 📈
      </Typography>
      {/* Pick 1 */}
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
                  borderColor: !twitterUsername ? "error.main" : "#fff",
                },
                "&:hover fieldset": {
                  borderColor: !twitterUsername ? "error.main" : "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: !twitterUsername ? "error.main" : "#fff",
                },
              },
            }}
          ></FormControl>
          <TextField
            label={`Enter your twitter username *`}
            value={twitterUsername}
            onChange={handleTwitterUsernameChange}
            fullWidth
            color={!twitterUsername ? "error" : "primary"}
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
                  borderColor: !twitterUsername ? "error.main" : "#fff",
                },
                "&:hover fieldset": {
                  borderColor: !twitterUsername ? "error.main" : "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: !twitterUsername ? "error.main" : "#fff",
                },
              },
            }}
          />
          {!twitterUsername && (
            <FormHelperText error>This field is required</FormHelperText>
          )}

          <TextField
            label={`Enter your email *`}
            value={email}
            onChange={handleEmailChange}
            fullWidth
            color={!email || emailError ? "error" : "primary"}
            margin="normal"
            placeholder={`Email e.g info@sure-odds.com`}
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
                  borderColor: !email || emailError ? "error.main" : "#fff",
                },
                "&:hover fieldset": {
                  borderColor: !email || emailError ? "error.main" : "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: !email || emailError ? "error.main" : "#fff",
                },
              },
            }}
          />
          {!email ||
            (emailError && (
              <FormHelperText error>
                {emailError || "This field is required"}
              </FormHelperText>
            ))}

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
                  <FormHelperText error>This field is required</FormHelperText>
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
                  <FormHelperText error>This field is required</FormHelperText>
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
                    {!teamPicked && (
                      <FormHelperText error>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    label="Odds"
                    value={odds}
                    // onChange={handleOddsChange}
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
                              outcome.description + outcome.name + outcome.point
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
                    // onChange={handleOddsChange}
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
                    // onChange={handlePropLineChange}
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
            color="secondary"
            onClick={addPick}
            sx={{ marginRight: 2 }}
          >
            Add Pick
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
                          const newPicks = picks.filter((_, i) => i !== index);
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
            color="primary"
            onClick={handleSubmitAll}
            disabled={picks.length === 0 || isSubmitting}
            sx={{ marginTop: 2 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit All Picks"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default PostYourPicks;
