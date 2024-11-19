import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardContest.css";

const ContestCard = ({ primaryImageUrl, companyName, description, price }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/contest/${companyName}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={primaryImageUrl} alt={companyName} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{companyName} Contest</h2>
        <p className="card-description">{description}</p>
        <p className="card-price">Prize: {price}</p>
      </div>
    </div>
  );
};

export default ContestCard;
