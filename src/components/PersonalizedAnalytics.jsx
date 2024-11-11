import React from "react";
import PricingCard from "./PricingCard";
import { Box, Typography } from "@mui/material";
import "../css/PersonalizedAnalytics.css"; // Import the CSS file
import Footer from "./Footer";

const PersonalizedAnalytics = () => {
  const features = [
    "Top Capper/Models by Sports",
    "Top Capper/Models by Bet Type",
    "Top Capper/Models by Prop Type",
    "Weekly reports delivered directly to your email",
  ];

  return (
    <Box sx={{ width: "auto", textAlign: "center", p: 3 }}>
      <div>
        <Typography
          variant="h4"
          sx={{
            color: "white",
            mb: 3,
            p: 2,
            fontWeight: "bold",
          }}
        >
          Stay Ahead of the Trends. Bet Smarter with Sure Odds.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "white",
          }}
        >
          Get access to deeper, more granular insights into the handicappers’
          and models’ performance.—so you can make every bet with confidence.
        </Typography>
      </div>
      <div className="pricing-cards">
        <PricingCard
          title="Monthly Subscription"
          price="$4.99/month"
          description="Access all features with a monthly subscription"
          features={features}
          buttonText="Subscribe Monthly"
          buttonLink="https://buy.stripe.com/7sI013cNJ45t3wk000"
        />
        <PricingCard
          title="Annual Subscription"
          price="$49.99/year"
          description="Access all features with an annual subscription"
          features={features}
          buttonText="Subscribe Annually"
          buttonLink="https://buy.stripe.com/dR67tv2950Th3wk145"
        />
      </div>
      <Typography
        variant="body2"
        sx={{
          color: "white",
          mt: 3,
        }}
      >
        Subscribe with the email used to post picks. Have questions? Email us at{" "}
        <a href="mailto:info@sure-odds.com">info@sure-odds.com</a>.
      </Typography>
      <Footer />
    </Box>
  );
};

export default PersonalizedAnalytics;
