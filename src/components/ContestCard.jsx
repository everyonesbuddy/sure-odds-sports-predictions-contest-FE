import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardContest.css";

const ContestCard = ({
  primaryImageUrl,
  contestName,
  price,
  contestFormat,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/contest/${contestName}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={primaryImageUrl} alt={contestName} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{contestName} Contest</h2>
        <p className="card-price">Prize: {price}</p>
        <p className="card-contest-format">
          Contest Format: {contestFormat} Pick'em contest
        </p>
      </div>
    </div>
  );
};

export default ContestCard;
