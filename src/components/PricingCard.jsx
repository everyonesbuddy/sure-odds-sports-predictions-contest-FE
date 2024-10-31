import React from "react";

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
}) => {
  return (
    <div className="pricing-card">
      <h2>{title}</h2>
      <p>{price}</p>
      <p>{description}</p>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <a
        href={buttonLink}
        className="btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        {buttonText}
      </a>
    </div>
  );
};

export default PricingCard;
