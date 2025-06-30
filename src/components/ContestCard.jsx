import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardContest.css";
import { leagueOptions } from "../utils/leagueData";

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
  contestLeague,
  contestTotalPrize,
  startDate,
  endDate,
  contestType,
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
        <p className="card-price">
          🥇Total Pize Money: ${contestTotalPrize} USD
        </p>
        <p className="card-dates">
          📅: {new Date(startDate).toLocaleDateString()} -{" "}
          {new Date(endDate).toLocaleDateString()}
        </p>
        <p className="card-dates">Contest Type: {contestType}</p>
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
