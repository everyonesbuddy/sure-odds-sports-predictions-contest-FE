import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { leagueOptions, leagueApiMap } from "../utils/leagueData";

const PicksForm = ({
  contestName,
  spreadsheetUrl,
  contestLeague,
  contestEndDate,
  currentUserBetsForContest,
  aggregateBets,
  availablePicks,
  availableMarkets,
}) => {
  const [league, setLeague] = useState("");
  const [pickType, setPickType] = useState("");
  const [participantsUsername, setParticipantsUsername] = useState("");
  const [email, setEmail] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState("");
  const [gameDetails, setGameDetails] = useState(null);
  const [picks, setPicks] = useState([]);
  const [gamePreviews, setGamePreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { user, token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Prefill user info
  useEffect(() => {
    if (user && user.email) {
      setParticipantsUsername(user.userName);
      setEmail(user.email);
    }
  }, [user]);

  // Set default league
  useEffect(() => {
    if (contestLeague && contestLeague.length > 0) {
      setLeague(contestLeague[0]);
    }
  }, [contestLeague]);

  // Default pick type
  useEffect(() => {
    if (availableMarkets && availableMarkets.length > 0) {
      if (availableMarkets.includes("Moneyline")) setPickType("money line");
      else if (availableMarkets.includes("Spread")) setPickType("spread");
    }
  }, [availableMarkets]);

  // Fetch games for selected league
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

  // Fetch odds for selected game
  useEffect(() => {
    if (
      selectedGameId &&
      (pickType === "money line" || pickType === "spread")
    ) {
      const fetchGameDetails = async () => {
        try {
          const market = pickType === "money line" ? "h2h" : "spreads";
          const response = await axios.get(
            `https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=402f2e4bba957e5e98c7e1a178393c8c&regions=us&markets=${market}&oddsFormat=american&bookmakers=draftkings&eventIds=${selectedGameId}`
          );
          setGameDetails(response.data[0]);
        } catch (error) {
          console.error("Error fetching game details:", error);
        }
      };
      fetchGameDetails();
    }
  }, [selectedGameId, pickType, league]);

  const calculateAvailablePicksLeft = () => {
    const userBets = aggregateBets.find(
      (bet) => bet.username === participantsUsername
    );
    const betsPlaced = userBets ? userBets.numberOfBets : 0;
    return Math.max(availablePicks - betsPlaced, 0);
  };

  const handleAutoAddPick = (game, outcome) => {
    const freePicksLeft = calculateAvailablePicksLeft();
    if (freePicksLeft === 0) {
      toast.error("You have used all available picks!");
      return;
    }

    const newPick = {
      league,
      pickType,
      participantsUsername,
      email,
      selectedGameId: game.id,
      teamPicked: outcome.name,
      odds: outcome.price,
      spreadLine: pickType === "spread" ? outcome.point : "",
      postedTime: new Date().toISOString(),
    };

    setPicks((prev) => [...prev, newPick]);
    setGamePreviews((prev) => ({
      ...prev,
      [game.id]: {
        teamPicked: outcome.name,
        odds: outcome.price,
        spreadLine: pickType === "spread" ? outcome.point : "",
      },
    }));
    toast.success("Pick added to lineup!");
  };

  const removePick = (index) => {
    const removedPick = picks[index];
    setPicks(picks.filter((_, i) => i !== index));
    setGamePreviews((prev) => {
      const copy = { ...prev };
      if (removedPick?.selectedGameId && copy[removedPick.selectedGameId]) {
        delete copy[removedPick.selectedGameId];
      }
      return copy;
    });
  };

  const handleSubmitAll = async () => {
    if (picks.length === 0) {
      toast.error("No picks to submit!");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(spreadsheetUrl, picks, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("All picks submitted successfully!");
      setPicks([]);
      setGamePreviews({});
      window.location.reload();
    } catch (error) {
      console.error("Error submitting picks:", error);
      toast.error("Failed to submit picks!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        py: 3,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 3,
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}
    >
      {/* MAIN PICKS AREA */}
      <Box sx={{ flex: 3 }}>
        {/* League Selection */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          {contestLeague.map((leagueOption) => (
            <Button
              key={leagueOption}
              variant={league === leagueOption ? "contained" : "outlined"}
              onClick={() => setLeague(leagueOption)}
              sx={{
                flex: 1,
                backgroundColor:
                  league === leagueOption ? "#4F46E5" : "transparent",
                borderColor: "#4F46E5",
                color: league === leagueOption ? "#fff" : "#4F46E5",
                "&:hover": {
                  backgroundColor:
                    league === leagueOption ? "#3E3BA7" : "rgba(79,70,229,0.1)",
                },
              }}
            >
              {leagueOptions.find((opt) => opt.value === leagueOption)?.label}
            </Button>
          ))}
        </Box>

        {/* Pick Type */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          {availableMarkets.includes("Moneyline") && (
            <Button
              variant={pickType === "money line" ? "contained" : "outlined"}
              onClick={() => setPickType("money line")}
              sx={{
                flex: 1,
                backgroundColor:
                  pickType === "money line" ? "#4F46E5" : "transparent",
                borderColor: "#4F46E5",
                color: pickType === "money line" ? "#fff" : "#4F46E5",
                "&:hover": {
                  backgroundColor:
                    pickType === "money line"
                      ? "#3E3BA7"
                      : "rgba(79,70,229,0.1)",
                },
              }}
            >
              Money Line 💰
            </Button>
          )}
          {availableMarkets.includes("Spread") && (
            <Button
              variant={pickType === "spread" ? "contained" : "outlined"}
              onClick={() => setPickType("spread")}
              sx={{
                flex: 1,
                backgroundColor:
                  pickType === "spread" ? "#4F46E5" : "transparent",
                borderColor: "#4F46E5",
                color: pickType === "spread" ? "#fff" : "#4F46E5",
                "&:hover": {
                  backgroundColor:
                    pickType === "spread" ? "#3E3BA7" : "rgba(79,70,229,0.1)",
                },
              }}
            >
              Spread 📏
            </Button>
          )}
        </Box>

        {/* Games Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 2,
            mb: 3,
          }}
        >
          {games.filter((game) => {
            const now = new Date();
            const gameTime = new Date(game.commence_time);
            const contestEnd = new Date(contestEndDate);
            return gameTime > now && gameTime <= contestEnd;
          }).length === 0 && (
            <Typography
              variant="body1"
              sx={{ color: "#bbb", textAlign: "center", gridColumn: "1 / -1" }}
            >
              No games available at this time.
            </Typography>
          )}

          {games
            .filter((game) => {
              const now = new Date();
              const gameTime = new Date(game.commence_time);
              const contestEnd = new Date(contestEndDate);
              return gameTime > now && gameTime <= contestEnd;
            })
            .map((game) => {
              const isSelected = selectedGameId === game.id;
              const outcomes =
                gameDetails?.bookmakers?.[0]?.markets?.[0]?.outcomes || [];
              const hasOutcomes = isSelected && outcomes.length > 0;
              const preview = gamePreviews[game.id];

              return (
                <Card
                  key={game.id}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#4F46E5" : "#2b2b2b",
                    color: "#fff",
                    transition: "0.15s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                  onClick={() => setSelectedGameId(game.id)}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {game.home_team} vs {game.away_team}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    {new Date(game.commence_time).toLocaleString()}
                  </Typography>

                  {/* Outcomes or "No market available" */}
                  {isSelected && (
                    <>
                      {hasOutcomes ? (
                        outcomes.map((outcome) => (
                          <Button
                            key={outcome.name}
                            sx={{
                              mt: 1,
                              mr: 1,
                              backgroundColor:
                                preview?.teamPicked === outcome.name
                                  ? "#4F46E5"
                                  : "#444",
                              color: "#fff",
                              "&:hover": { backgroundColor: "#3E3BA7" },
                            }}
                            onClick={() => handleAutoAddPick(game, outcome)}
                          >
                            {outcome.name} ({outcome.price}
                            {pickType === "spread" && outcome.point
                              ? `, Spread: ${outcome.point}`
                              : ""}
                            )
                          </Button>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ mt: 2, color: "#bbb", fontStyle: "italic" }}
                        >
                          {pickType === "money line"
                            ? "No moneyline available for this game."
                            : "No spread available for this game."}
                        </Typography>
                      )}
                    </>
                  )}

                  {/* Preview display */}
                  {preview && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "#ddd", fontStyle: "italic" }}
                    >
                      Selected: {preview.teamPicked} ({preview.odds}
                      {preview.spreadLine
                        ? `, Spread: ${preview.spreadLine}`
                        : ""}
                      )
                    </Typography>
                  )}
                </Card>
              );
            })}
        </Box>
      </Box>

      {/* PICKS LINEUP SECTION */}
      <Box
        sx={{
          flex: isMobile ? "none" : 1,
          position: isMobile ? "fixed" : "sticky",
          bottom: isMobile ? 0 : "auto",
          left: isMobile ? 0 : "auto",
          right: isMobile ? 0 : "auto",
          width: isMobile ? "100%" : "auto",
          backgroundColor: isMobile ? "#1e1e1e" : "transparent",
          p: isMobile ? 0 : 0,
          borderTop: isMobile ? "1px solid #333" : "none",
          borderRadius: isMobile ? "12px 12px 0 0" : 0,
          zIndex: 1400,
          boxSizing: "border-box",
        }}
      >
        {isMobile ? (
          <>
            {/* COLLAPSIBLE HEADER */}
            <Box
              onClick={() => setIsExpanded((s) => !s)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.25,
                px: 2,
                backgroundColor: "#2b2b2b",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#fff" }}
              >
                Your Picks 🎯 ({picks.length})
              </Typography>
              {isExpanded ? (
                <ExpandLessIcon sx={{ color: "#fff" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "#fff" }} />
              )}
            </Box>

            {/* COLLAPSIBLE CONTENT */}
            <Collapse in={isExpanded} timeout={200}>
              <Box sx={{ p: 2, boxSizing: "border-box" }}>
                {picks.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#bbb" }}>
                    No picks selected yet.
                  </Typography>
                ) : (
                  picks.map((pick, index) => (
                    <Card
                      key={index}
                      sx={{
                        p: 1,
                        backgroundColor: "#333",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#fff",
                        mb: 1,
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-word", color: "#fff" }}
                      >
                        {
                          leagueOptions.find((opt) => opt.value === pick.league)
                            ?.label
                        }{" "}
                        — {pick.pickType} — {pick.teamPicked} ({pick.odds}
                        {pick.spreadLine ? `, ${pick.spreadLine}` : ""})
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: "#ff4d4d", ml: 1 }}
                        onClick={() => removePick(index)}
                        aria-label={`Remove pick ${index + 1}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Card>
                  ))
                )}

                <Button
                  variant="contained"
                  fullWidth
                  disabled={picks.length === 0 || isSubmitting}
                  onClick={handleSubmitAll}
                  sx={{
                    mt: 2,
                    py: 1.2,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderRadius: "10px",
                    backgroundColor: "#4F46E5",
                    "&:hover": { backgroundColor: "#3E3BA7" },
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit All Picks"
                  )}
                </Button>
              </Box>
            </Collapse>
          </>
        ) : (
          // Desktop version (sticky/right column)
          <Box sx={{ p: 0 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "#fff" }}
            >
              Your Picks 🎯
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {picks.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#bbb" }}>
                  No picks selected yet.
                </Typography>
              ) : (
                picks.map((pick, index) => (
                  <Card
                    key={index}
                    sx={{
                      p: 1,
                      backgroundColor: "#333",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: "#fff",
                    }}
                  >
                    <Typography variant="body2">
                      {
                        leagueOptions.find((opt) => opt.value === pick.league)
                          ?.label
                      }{" "}
                      — {pick.pickType} — {pick.teamPicked} ({pick.odds}
                      {pick.spreadLine ? `, ${pick.spreadLine}` : ""})
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ color: "#ff4d4d" }}
                      onClick={() => removePick(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                ))
              )}
            </Box>

            <Button
              variant="contained"
              fullWidth
              disabled={picks.length === 0 || isSubmitting}
              onClick={handleSubmitAll}
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "10px",
                backgroundColor: "#4F46E5",
                "&:hover": { backgroundColor: "#3E3BA7" },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit All Picks"
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PicksForm;
