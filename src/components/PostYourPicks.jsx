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

const PostYourPicks = () => {
  //pick state 1
  const [league, setLeague] = useState("");
  const [pickType, setPickType] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [researchToolOrModelUsed, setResearchToolOrModelUsed] = useState("");
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

  //Pick state 2
  const [league2, setLeague2] = useState("");
  const [pickType2, setPickType2] = useState("");
  const [twitterUsername2, setTwitterUsername2] = useState("");
  const [researchToolOrModelUsed2, setResearchToolOrModelUsed2] = useState("");
  const [socialType2, setSocialType2] = useState("twitter"); // default value
  const [games2, setGames2] = useState([]);
  const [selectedGame2, setSelectedGame2] = useState("");
  const [gameDetails2, setGameDetails2] = useState(null);
  const [teamPicked2, setTeamPicked2] = useState("");
  const [odds2, setOdds2] = useState("");
  const [market2, setMarket2] = useState("");
  const [players2, setPlayers2] = useState([]);
  const [playerPicked2, setPlayerPicked2] = useState("");
  const [playerPickedDetailForView2, setPlayerPickedDetailForView2] =
    useState("");
  const [propLine2, setPropLine2] = useState("");
  const [propOverOrUnder2, setPropOverOrUnder2] = useState("");
  const [isSubmitting2, setIsSubmitting2] = useState(false);

  // Call this function when the Twitter username input changes
  const handleTwitterUsernameChange = (event) => {
    const username = event.target.value;
    setTwitterUsername(username);
  };

  // Call this function when the Twitter username input changes2
  const handleTwitterUsernameChange2 = (event) => {
    const username = event.target.value;
    setTwitterUsername2(username);
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

    if (league2) {
      const fetchGames = async () => {
        try {
          const response = await axios.get(leagueApiMap[league2]);
          setGames2(response.data);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
      };
      fetchGames();
    }
  }, [league, league2]);

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

    if (selectedGame2 && pickType2 === "money line") {
      const fetchGameDetails2 = async () => {
        try {
          const response = await axios.get(
            `https://api.the-odds-api.com/v4/sports/${league2}/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings&eventIds=${selectedGame2}`
          );

          setGameDetails2(response.data[0]);
        } catch (error) {
          console.error("Error fetching game details:", error);
        }
      };
      fetchGameDetails2();
    }
  }, [selectedGame, pickType, league, selectedGame2, pickType2, league2]);

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

    if (selectedGame2 && pickType2 === "props" && market2) {
      const fetchMarketDetails2 = async () => {
        try {
          const response = await axios.get(
            `https://api.the-odds-api.com/v4/sports/${league2}/events/${selectedGame2}/odds?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=${market2}&oddsFormat=american&bookmakers=fanduel`
          );

          const outcomes =
            response.data?.bookmakers?.[0]?.markets?.[0]?.outcomes;

          if (outcomes) {
            setPlayers2(outcomes);
          }
          setGameDetails2(response.data);
        } catch (error) {
          console.error("Error fetching market details:", error);
        }
      };
      fetchMarketDetails2();
    }
  }, [
    selectedGame,
    pickType,
    league,
    market,
    selectedGame2,
    pickType2,
    league2,
    market2,
  ]);

  const clearFields = () => {
    setLeague("");
    setPickType("");
    setTwitterUsername("");
    setResearchToolOrModelUsed("");
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

  const clearFields2 = () => {
    setLeague2("");
    setPickType2("");
    setTwitterUsername2("");
    setResearchToolOrModelUsed2("");
    setGames2([]);
    setSelectedGame2("");
    setGameDetails2(null);
    setTeamPicked2("");
    setOdds2("");
    setPropLine2("");
    setPropOverOrUnder2("");
    setSocialType2("twitter");
    setMarket2("");
    setPlayers2([]);
    setPlayerPicked2("");
    setPlayerPickedDetailForView2("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    console.log({
      league,
      pickType,
      twitterUsername,
      socialType,
      researchToolOrModelUsed,
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
      researchToolOrModelUsed,
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

  const handleSubmit2 = async () => {
    setIsSubmitting2(true);

    console.log({
      league2,
      pickType2,
      twitterUsername2,
      socialType2,
      researchToolOrModelUsed2,
      selectedGame2,
      teamPicked2,
      odds2,
      propLine2,
      propOverOrUnder2,
      market2,
      playerPicked2,
      gameDetails2,
    });

    const data = {
      // Step 2: Prepare the data object
      league: league2,
      pickType: pickType2,
      twitterUsername: twitterUsername2,
      researchToolOrModelUsed: researchToolOrModelUsed2,
      socialType: socialType2,
      selectedGameId: selectedGame2,
      teamPicked: teamPicked2,
      odds: odds2,
      propLine: propLine2,
      propOverOrUnder: propOverOrUnder2,
      market: market2,
      playerPicked: playerPicked2,
      postedTime: new Date().toISOString(),
      gameCommenceTime: gameDetails2?.commence_time,
    };

    try {
      const response = await axios.post(
        "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
        data
      ); // Step 2: Send POST request
      console.log(response); // Handle response
      clearFields2(); // Clear all fields after submit
      toast.success("Submit Successful!"); // Show success toast
    } catch (error) {
      console.error(error); // Step 3: Handle error
      toast.error("Submit Failed!"); // Show error toast
    } finally {
      setIsSubmitting2(false); // Disable spinner
    }
  };

  return (
    <>
      <Typography align="center" gutterBottom sx={{ paddingTop: "15px" }}>
        🌟 Join the Contest: Share your top sports picks now to climb the
        leaderboard, and win 📈
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
              {/* <MenuItem value="basketball_wnba">WNBA 🏀</MenuItem> */}
              <MenuItem value="basketball_nba">NBA 🏀</MenuItem>
              <MenuItem value="baseball_mlb">MLB ⚾</MenuItem>
              <MenuItem value="americanfootball_nfl">NFL 🏈</MenuItem>
              <MenuItem value="icehockey_nhl">NHL 🏒</MenuItem>
              <MenuItem value="soccer_epl">EPL ⚽</MenuItem>
              <MenuItem value="soccer_germany_bundesliga">
                Bundesliga ⚽
              </MenuItem>
              <MenuItem value="soccer_italy_serie_a">Serie A ⚽</MenuItem>
              <MenuItem value="soccer_spain_la_liga"> La Liga ⚽</MenuItem>
              <MenuItem value="soccer_usa_mls"> MLS ⚽</MenuItem>
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
                    league !== "soccer_usa_mls" && (
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
                  onChange={(e) => setSelectedGame(e.target.value)}
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

          {/* <TextField
            label={`Model or Research Tool Used`}
            value={researchToolOrModelUsed}
            onChange={(e) => setResearchToolOrModelUsed(e.target.value)}
            fullWidth
            margin="normal"
            placeholder={`Model or Research Tool Used e.g www.dimers.com`}
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
            }}
          /> */}

          <Button
            variant="contained"
            color="primary"
            disabled={!twitterUsername || !league || !pickType || !selectedGame}
            onClick={handleSubmit}
            sx={{
              mt: 2,
              backgroundColor: "#4F46E5",
              color: "#000",
              "&.Mui-disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit Pick 1"}
          </Button>
        </CardContent>
      </Card>

      {/* Pick 2 */}
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
          marginTop: 5,
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
                  borderColor: !twitterUsername2 ? "error.main" : "#fff",
                },
                "&:hover fieldset": {
                  borderColor: !twitterUsername2 ? "error.main" : "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: !twitterUsername2 ? "error.main" : "#fff",
                },
              },
            }}
          >
            <InputLabel id="social-type-label">Social Type</InputLabel>
            <Select
              labelId="social-type-label"
              id="socialType"
              value={socialType2}
              onChange={(e) => setSocialType2(e.target.value)}
              label="Social Type"
            >
              <MenuItem value="twitter">X (Twitter)</MenuItem>
              <MenuItem value="reddit">Reddit</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={`${socialType} username *`}
            value={twitterUsername2}
            onChange={handleTwitterUsernameChange2}
            fullWidth
            color={!twitterUsername2 ? "error" : "primary"}
            margin="normal"
            placeholder={`${socialType} username e.g sure_odds2023`}
            variant="outlined"
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
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: !twitterUsername2 ? "error.main" : "#fff",
                },
                "&:hover fieldset": {
                  borderColor: !twitterUsername2 ? "error.main" : "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: !twitterUsername2 ? "error.main" : "#fff",
                },
              },
            }}
          />
          {!twitterUsername2 && (
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
                  borderColor: !league2 ? "error.main" : "#fff",
                },
                "&:hover fieldset": {
                  borderColor: !league2 ? "error.main" : "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: !league2 ? "error.main" : "#fff",
                },
              },
            }}
          >
            <InputLabel id="league-label">League</InputLabel>
            <Select
              labelId="league-label"
              id="league-select"
              value={league2}
              label="League *"
              onChange={(e) => setLeague2(e.target.value)}
            >
              {/* <MenuItem value="basketball_wnba">WNBA 🏀</MenuItem> */}
              <MenuItem value="basketball_nba">NBA 🏀</MenuItem>
              <MenuItem value="baseball_mlb">MLB ⚾</MenuItem>
              <MenuItem value="americanfootball_nfl">NFL 🏈</MenuItem>
              <MenuItem value="icehockey_nhl">NHL 🏒</MenuItem>
              <MenuItem value="soccer_epl">EPL ⚽</MenuItem>
              <MenuItem value="soccer_germany_bundesliga">
                Bundesliga ⚽
              </MenuItem>
              <MenuItem value="soccer_italy_serie_a">Serie A ⚽</MenuItem>
              <MenuItem value="soccer_spain_la_liga"> La Liga ⚽</MenuItem>
              <MenuItem value="soccer_usa_mls"> MLS ⚽</MenuItem>
            </Select>
            {!league2 && (
              <FormHelperText error>This field is required</FormHelperText>
            )}
          </FormControl>

          {league2 && (
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
                      borderColor: !pickType2 ? "error.main" : "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: !pickType2 ? "error.main" : "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: !pickType2 ? "error.main" : "#fff",
                    },
                  },
                }}
              >
                <InputLabel id="pick-type-label">Pick Type</InputLabel>
                <Select
                  labelId="pick-type-label"
                  id="pick-type-select"
                  value={pickType2}
                  label="Pick Type *"
                  onChange={(e) => setPickType2(e.target.value)}
                >
                  {league2 !== "soccer_epl" &&
                    league2 !== "soccer_germany_bundesliga" &&
                    league2 !== "soccer_italy_serie_a" &&
                    league2 !== "soccer_spain_la_liga" &&
                    league2 !== "soccer_usa_mls" && (
                      <MenuItem value="props">Props 🎲</MenuItem>
                    )}
                  <MenuItem value="money line">Money Line 💰</MenuItem>
                </Select>
                {!pickType2 && (
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
                      borderColor: !selectedGame2 ? "error.main" : "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: !selectedGame2 ? "error.main" : "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: !selectedGame2 ? "error.main" : "#fff",
                    },
                  },
                }}
              >
                <InputLabel id="game-label">Game</InputLabel>
                <Select
                  labelId="game-label"
                  id="game-select"
                  value={selectedGame2}
                  label="Game *"
                  onChange={(e) => setSelectedGame2(e.target.value)}
                >
                  {games2.length > 0 ? (
                    games2
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
                {!selectedGame2 && (
                  <FormHelperText error>This field is required</FormHelperText>
                )}
              </FormControl>

              {pickType2 === "money line" && gameDetails2 && (
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
                          borderColor: !teamPicked2 ? "error.main" : "#fff",
                        },
                        "&:hover fieldset": {
                          borderColor: !teamPicked2 ? "error.main" : "#fff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: !teamPicked2 ? "error.main" : "#fff",
                        },
                      },
                    }}
                  >
                    <InputLabel id="team-picked-label">Team Picked</InputLabel>
                    <Select
                      labelId="team-picked-label"
                      id="team-picked-select"
                      value={teamPicked2}
                      label="Team Picked *"
                      onChange={(e) => {
                        const team = e.target.value;
                        const outcome =
                          gameDetails2?.bookmakers[0]?.markets[0]?.outcomes.find(
                            (outcome) => outcome?.name === team
                          );
                        setTeamPicked2(team);
                        setOdds2(outcome?.price);
                      }}
                    >
                      {gameDetails2?.bookmakers &&
                      gameDetails2.bookmakers.length > 0 ? (
                        gameDetails2.bookmakers[0]?.markets[0]?.outcomes.map(
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
                    {!teamPicked2 && (
                      <FormHelperText error>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    label="Odds"
                    value={odds2}
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

              {pickType2 === "props" && (
                <>
                  {games2.length > 0 && (
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
                            borderColor: !market2 ? "error.main" : "#fff",
                          },
                          "&:hover fieldset": {
                            borderColor: !market2 ? "error.main" : "#fff",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: !market2 ? "error.main" : "#fff",
                          },
                        },
                      }}
                    >
                      <InputLabel id="market-label">Market</InputLabel>
                      <Select
                        labelId="market-label"
                        id="market-select"
                        value={market2}
                        label="Market *"
                        onChange={(e) => setMarket2(e.target.value)}
                      >
                        {(league2 === "basketball_nba" ||
                        league2 === "basketball_wnba"
                          ? nbaAndWnbaMarkets
                          : league2 === "baseball_mlb"
                          ? mlbMarkets
                          : league2 === "icehockey_nhl"
                          ? nhlMarkets
                          : nflMarkets
                        ).map((market) => (
                          <MenuItem key={market.key} value={market.key}>
                            {market.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {!market2 && (
                        <FormHelperText error>
                          This field is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}

                  {players2.length > 0 ? (
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
                            borderColor: !playerPickedDetailForView2
                              ? "error.main"
                              : "#fff",
                          },
                          "&:hover fieldset": {
                            borderColor: !playerPickedDetailForView2
                              ? "error.main"
                              : "#fff",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: !playerPickedDetailForView2
                              ? "error.main"
                              : "#fff",
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
                        value={playerPickedDetailForView2}
                        label="Player Picked"
                        onChange={(e) => {
                          const [player, name, point] =
                            e.target.value.split("|"); // Split the value to get both parts
                          const playerDetailsForView = e.target.value;
                          const outcome = players2.find(
                            (outcome) =>
                              outcome.description === player &&
                              outcome.name === name &&
                              outcome.point === Number(point)
                          );
                          setPlayerPicked2(player);
                          setPlayerPickedDetailForView2(playerDetailsForView);
                          setOdds2(outcome.price);
                          setPropLine2(outcome.point);
                          setPropOverOrUnder2(outcome.name);
                        }}
                      >
                        {players2.map((outcome) => (
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
                      {!playerPickedDetailForView2 && (
                        <FormHelperText error>
                          This field is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  ) : (
                    market2 !== "" && (
                      <TextField
                        fullWidth
                        margin="normal"
                        value="This prop is not available right now"
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
                    value={odds2}
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

          {/* <TextField
            label={`Model or Research Tool Used`}
            value={researchToolOrModelUsed2}
            onChange={(e) => setResearchToolOrModelUsed2(e.target.value)}
            fullWidth
            margin="normal"
            placeholder={`Model or Research Tool Used e.g www.dimers.com`}
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
            }}
          /> */}

          <Button
            variant="contained"
            color="primary"
            disabled={
              !twitterUsername2 || !league2 || !pickType2 || !selectedGame2
            }
            onClick={handleSubmit2}
            sx={{
              mt: 2,
              backgroundColor: "#4F46E5",
              color: "#000",
              "&.Mui-disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
            }}
          >
            {isSubmitting2 ? <CircularProgress size={24} /> : "Submit Pick 2"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default PostYourPicks;
