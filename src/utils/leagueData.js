export const leagueApiMap = {
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

export const leagueOptions = [
  { value: "basketball_nba", label: "NBA 🏀" },
  { value: "americanfootball_nfl", label: "NFL 🏈" },
  { value: "americanfootball_ncaaf", label: "NCAA Football 🏈" },
  { value: "basketball_ncaab", label: "NCAA Men Basketball 🏀" },
  { value: "basketball_wncaab", label: "NCAA Women Basketball 🏀" },
  { value: "icehockey_nhl", label: "NHL 🏒" },
  { value: "soccer_epl", label: "EPL ⚽" },
  { value: "soccer_germany_bundesliga", label: "Bundesliga ⚽" },
  { value: "soccer_italy_serie_a", label: "Serie A ⚽" },
  { value: "soccer_spain_la_liga", label: "La Liga ⚽" },
  { value: "soccer_usa_mls", label: "MLS ⚽" },
];

export const nbaAndWnbaMarkets = [
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

export const mlbMarkets = [
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

export const nflMarkets = [
  { key: "player_pass_attempts", name: "Pass Attempts (Over/Under)" },
  { key: "player_pass_completions", name: "Pass Completions (Over/Under)" },
  { key: "player_pass_interceptions", name: "Pass Interceptions (Over/Under)" },
  { key: "player_pass_yds", name: "Pass Yards (Over/Under)" },
  { key: "player_rush_yds", name: "Rush Yards (Over/Under)" },
  { key: "player_reception_yds", name: "Reception Yards (Over/Under)" },
  { key: "player_receptions", name: "Receptions (Over/Under)" },
  { key: "player_pass_tds", name: "Pass Touchdowns (Over/Under)" },
  { key: "player_rush_attempts", name: "Rush Attempts (Over/Under)" },
];

export const nhlMarkets = [
  { key: "player_goals", name: "Player Goals (Over/Under)" },
  { key: "player_assists", name: "Player Assists (Over/Under)" },
  { key: "player_total_saves", name: "Total saves (Over/Under)" },
];
