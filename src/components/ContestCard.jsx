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
  firstPlacePrize,
  secondPlacePrize,
  thirdPlacePrize,
  contestLeague,
  availableFreePicks,
  startDate,
  endDate,
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
        <p className="card-price">🥇 1st Place Prize: {firstPlacePrize}</p>
        <p className="card-price">🥈 2nd Place Prize: {secondPlacePrize}</p>
        <p className="card-price">🥉 3rd Place Prize: {thirdPlacePrize}</p>
        <p className="card-dates">
          📅 Start Date: {new Date(startDate).toLocaleDateString()}
        </p>
        <p className="card-dates">
          📅 End Date: {new Date(endDate).toLocaleDateString()}
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
