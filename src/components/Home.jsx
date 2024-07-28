import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel";
import PostYourPicks from "./PostYourPicks";
import PicksOfTheDay from "./PicksOfTheDay";
import Leaderboard from "./Leaderboard";
import KofiWidget from "./KofiWidget";

const affiliates = [
  {
    message: "Parlay Play: Get $100 match for your first deposit",
    color: "#eac100",
    url: "https://parlayplay.io/account/signup?coupon=joeddomitor",
  },
  {
    message: "Underdog: Get first deposit matched in bonus cash up to $250",
    color: "#1b1b1b",
    url: "https://play.underdogfantasy.com/magnusdomitor",
  },
  {
    message: "Prize Picks: First deposit match up to $100!",
    color: "#8000ff",
    url: "https://app.prizepicks.com/sign-up?invite_code=PR-SUWVT13",
  },
  // Add more affiliates here
];

const Home = () => {
  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState(0);
  const [currentAffiliateIndex, setCurrentAffiliateIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAffiliateIndex(
        (prevIndex) => (prevIndex + 1) % affiliates.length
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box sx={{ width: "auto", textAlign: "center", p: 3 }}>
        <div>
          <Typography
            variant="h4"
            sx={{
              color: "black",
              mb: 3,
              p: 2,
              borderRadius: 1,
            }}
          >
            Discover the Best Handicappers and Ride the Wave!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "black",

              borderRadius: 1,
            }}
          >
            Handicappers, show us what you got! Bettors, find the best picks and
            cash in big!
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "gray",
              mb: 3,
              borderRadius: 1,
            }}
          >
            Track your bets, climb the leaderboard, and see who's at the top of
            their game!
          </Typography>
          <div>
            <iframe
              src="https://embeds.beehiiv.com/7fcc300a-4395-4b66-a558-f5e61ef24bdf?slim=true"
              data-test-id="beehiiv-embed"
              height="52"
              title="Beehiiv Embed"
              frameBorder="0"
              scrolling="no"
              style={{
                margin: 0,
                borderRadius: "0px",
                backgroundColor: "transparent",
              }}
            ></iframe>
            <p style={{ color: "gray", fontSize: "12px" }}>
              Join the smartest sport bettors community
            </p>
          </div>
        </div>

        <Box
          sx={{
            borderBottom: 1,
            // borderColor: "divider",
            zIndex: 1100,
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#4F46E5",
              },
            }}
          >
            <Tab
              label="Leaderboard 🏆"
              {...a11yProps(0)}
              sx={{
                color: "#4F46E5",
                fontSize: "10px",
              }}
            />
            <Tab
              label="Post Your Picks ✏️"
              {...a11yProps(1)}
              sx={{
                color: "#4F46E5",
                fontSize: "10px",
              }}
            />
            <Tab
              label="Live Picks ⚡"
              {...a11yProps(2)}
              sx={{
                color: "#4F46E5",
                fontSize: "10px",
              }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Leaderboard />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PostYourPicks />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <PicksOfTheDay />
        </CustomTabPanel>
      </Box>
      <KofiWidget />
    </>
  );
};

export default Home;
