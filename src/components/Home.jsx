import React from "react";
import { Box, Typography } from "@mui/material";
import Footer from "./Footer";
import ContestCard from "./ContestCard";
import "../css/Home.css";

const Home = () => {
  const contest = [
    // {
    //   contestName: "Multi Sport Weekly Pick'em",
    //   primaryImageUrl:
    //     "https://i.ibb.co/cKyCDdvq/Orange-and-Yellow-Illustrative-Sport-Trivia-Quiz-Presentation-2.jpg",
    //   price: "$50 in Crypto of your choice",
    //   spreadsheetUrl:
    //     "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
    //   sponsored: false,
    //   contestFrequency: "Weekly",
    //   contestLeague: [
    //     "americanfootball_nfl",
    //     "basketball_nba",
    //     "soccer_epl",
    //     "soccer_germany_bundesliga",
    //   ],
    //   availableFreePicks: 5,
    // },
    {
      contestName: "Multi Sport Monthly Pick'em",
      primaryImageUrl:
        "https://i.ibb.co/YBqhzMsf/Orange-and-Yellow-Illustrative-Sport-Trivia-Quiz-Presentation-1.jpg",
      price: "$100 in Crypto of your choice",
      spreadsheetUrl:
        "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
      sponsored: false,
      contestFrequency: "Monthly",
      contestLeague: [
        "basketball_nba",
        "soccer_epl",
        "soccer_germany_bundesliga",
        "basketball_ncaab",
        "soccer_italy_serie_a",
        "soccer_spain_la_liga",
        "soccer_usa_mls",
        "basketball_ncaab",
      ],
      availableFreePicks: 5,
    },
  ];

  return (
    <>
      {/* Prevent unwanted horizontal scrolling */}
      <Box
        sx={{
          width: "100vw",
          maxWidth: "100%",
          overflowX: "hidden",
          textAlign: "center",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 5, sm: 6 },
          // px: 3,
          background: "black",
        }}
      >
        {/* HERO SECTION */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            textAlign: "center",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "700",
              fontSize: { xs: "28px", sm: "42px", md: "48px" },
              lineHeight: 1.2,
              maxWidth: "100%",
            }}
          >
            🏆 Free to Play Pick'em Contests
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: "400",
              fontSize: { xs: "16px", sm: "20px" },
              opacity: 0.8,
              maxWidth: "600px",
            }}
          >
            Think you can predict the game? Compete for free and win crypto
            prizes. It’s fun, challenging, and global! 🌎🔥
          </Typography>
        </Box>
      </Box>

      {/* NEWSLETTER SIGNUP */}
      <Box
        sx={{
          width: "100vw",
          maxWidth: "100%",
          overflowX: "hidden",
          textAlign: "center",
          color: "white",
          py: { xs: 3, sm: 5 },
          // px: { xs: 2, sm: 3 },
          background:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(20,20,20,1) 100%)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "600",
            fontSize: { xs: "18px", sm: "22px" },
            mb: 2,
          }}
        >
          📬 Join the Smartest Sports Bettors Community
        </Typography>

        <iframe
          src="https://embeds.beehiiv.com/7fcc300a-4395-4b66-a558-f5e61ef24bdf?slim=true"
          data-test-id="beehiiv-embed"
          height="52"
          title="Beehiiv Embed"
          frameBorder="0"
          scrolling="no"
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "6px",
            backgroundColor: "transparent",
            padding: "0 10px", // Add padding to prevent overlap
            boxSizing: "border-box", // Ensure padding is included in the width
          }}
        ></iframe>
      </Box>

      {/* CONTEST SECTION */}
      <Box
        sx={{
          textAlign: "center",
          py: { xs: 4, sm: 6 },
          background: "black",
          width: "100vw",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "700",
            fontSize: { xs: "24px", sm: "32px", md: "36px" },
            color: "white",
            mb: 3,
            maxWidth: "100%",
          }}
        >
          🚀 Available Contests
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
              availableFreePicks={item.availableFreePicks}
            />
          ))}
        </div>
      </Box>

      <Footer />
    </>
  );
};

export default Home;
