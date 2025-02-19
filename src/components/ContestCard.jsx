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
  const [countdown, setCountdown] = useState("");
  const [isMarchFirstOrPast, setIsMarchFirstOrPast] = useState(false);
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

  // Countdown for marketing reasons
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), 2, 1); // March 1st of the current year
      if (now > targetDate) {
        targetDate.setFullYear(targetDate.getFullYear() + 1); // If past March 1st, set for next year
      }
      const diff = targetDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      // Check if today is on or past March 1st
      if (now >= targetDate) {
        setIsMarchFirstOrPast(true);
      } else {
        setIsMarchFirstOrPast(false);
      }
    };

    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" onClick={handleClick}>
      <img src={primaryImageUrl} alt={contestName} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{contestName} Contest</h2>
        <p className="card-price">Prize: {price}</p>
        <p>
          Duration: <span className="card-frequency">{contestFrequency} </span>
        </p>
        {!isMarchFirstOrPast && (
          <p className="card-countdown">
            Contest Starts In:{" "}
            <span className="card-frequency">{countdown} </span>
          </p>
        )}
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
