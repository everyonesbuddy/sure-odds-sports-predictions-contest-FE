import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardContest.css";

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

const getLeagueLabel = (value) => {
  const league = leagueOptions.find((league) => league.value === value);
  return league ? league.label : value;
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ContestCard = ({
  primaryImageUrl,
  contestName,
  price,
  contestLeague,
  contestFrequency,
  availableFreePicks,
}) => {
  const navigate = useNavigate();
  const [leagueColors, setLeagueColors] = useState({});

  const handleClick = () => {
    navigate(`/contest/${contestName}`);
  };

  // Generate colors for leagues once
  useEffect(() => {
    const colors = {};
    contestLeague.forEach((league) => {
      colors[league] = getRandomColor();
    });
    setLeagueColors(colors);
  }, [contestLeague]);

  return (
    <div className="card" onClick={handleClick}>
      <img src={primaryImageUrl} alt={contestName} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{contestName} Contest</h2>
        <p className="card-price">Prize: {price}</p>
        <p>
          Duration: <span className="card-frequency">{contestFrequency} </span>
        </p>
        <div className="card-leagues">
          {contestLeague.map((league) => (
            <span
              key={league}
              className="league-card"
              style={{ backgroundColor: leagueColors[league] }}
            >
              {getLeagueLabel(league)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
