import React from "react";
import { Box, Typography } from "@mui/material";
import Footer from "./Footer";
import ContestCard from "./ContestCard";
import KofiWidget from "./KofiWidget";
import { useContestData } from "../hooks/useContestData";
import "../css/Home.css";

const Home = () => {
  const contestData = useContestData();

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
            variant="h1"
            sx={{
              fontWeight: "700",
              fontSize: { xs: "28px", sm: "42px", md: "48px" },
              lineHeight: 1.2,
              maxWidth: "100%",
            }}
          >
            🏆 Free To Play Sports Prediction Contest
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
            Think you know sports? Prove it. Enter free contests and win epic
            prizes. 🔥
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
          📬 Join The Smartest Free Sports Prediction Community
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
          {contestData.some((item) => item.isContestActive) ? (
            contestData.map(
              (item, index) =>
                item.isContestActive && (
                  <ContestCard
                    key={index}
                    primaryImageUrl={item.primaryImageUrl}
                    contestName={item.contestName}
                    contestPrimaryPrize={item.contestPrimaryPrize}
                    startDate={item.currentContestStartDate}
                    endDate={item.currentContestEndDate}
                    contestLeague={item.contestLeague}
                    contestFormat={item.contestFormat}
                    entryFee={item.entryFee}
                    availableMarkets={item.availableMarkets}
                  />
                )
            )
          ) : (
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "400",
                fontSize: { xs: "16px", sm: "20px" },
                opacity: 0.8,
                textAlign: "center",
                mt: 3,
              }}
            >
              🚫 No active contests available at the moment. Please check back
              later!
            </Typography>
          )}
        </div>
      </Box>
      <Footer />
      <KofiWidget />
    </>
  );
};

export default Home;
