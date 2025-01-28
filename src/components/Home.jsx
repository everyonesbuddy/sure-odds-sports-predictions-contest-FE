import React from "react";
import { Box, Typography } from "@mui/material";
// import KofiWidget from "./KofiWidget";
import Footer from "./Footer";
import ContestCard from "./ContestCard";
import "../css/Home.css";

const Home = () => {
  const contest = [
    {
      contestName: "Multi Sport Weekly Pick'em",
      primaryImageUrl: "https://i.ibb.co/xzk85XK/0k0-A7-Ib3-400x400.jpg",
      price: "Win 5 USDT to a crypto wallet of your choice",
      spreadsheetUrl:
        "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
      sponsored: false,
      affiliateUrl: "https://doinksports.com/?via=Sure-Odds",
      affiliateCopy: "Try Doink Sports Research Platform For Free",
      contestFrequency: "Weekly",
      contestLeague: [
        "americanfootball_nfl",
        "basketball_nba",
        "soccer_epl",
        "soccer_germany_bundesliga",
      ],
    },
    {
      contestName: "Multi Sport Monthly Pick'em",
      primaryImageUrl: "https://i.ibb.co/C8Cb5BF/Po6-QETC5-400x400.jpg",
      price: "Win 50 USDT to a crypto wallet of your choice",
      spreadsheetUrl:
        "https://api.sheetbest.com/sheets/09d34a2c-8cc1-4cf6-951c-dbc2ce537971",
      sponsored: false,
      contestFrequency: "Monthly",
      contestLeague: [
        "americanfootball_nfl",
        "basketball_nba",
        "soccer_epl",
        "soccer_germany_bundesliga",
      ],
    },
  ];

  return (
    <>
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
            Free to Play Pick'em Contests
          </Typography>
          <Typography
            variant="p"
            sx={{
              color: "white",
            }}
          >
            Think you can predict the game? Compete in our free-to-play pick'em
            contests for a chance to win amazing prizes. It’s free, fun, and
            global!
          </Typography>
          <div style={{ paddingTop: 10 }}>
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
        <Typography
          variant="h4"
          sx={{
            color: "white",
            mb: 3,
            p: 2,
            fontWeight: "bold",
          }}
        >
          Contests
        </Typography>

        <div className="card-container">
          {contest.map((item, index) => (
            <ContestCard
              key={index}
              primaryImageUrl={item.primaryImageUrl}
              contestName={item.contestName}
              price={item.price}
              contestLeague={item.contestLeague}
              contestFrequency={item.contestFrequency}
            />
          ))}
        </div>
      </Box>
      {/* <KofiWidget /> */}
      <Footer />
    </>
  );
};

export default Home;
