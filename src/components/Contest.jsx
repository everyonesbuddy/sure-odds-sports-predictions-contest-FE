import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel";
import Leaderboard from "./Leaderboard";
import PostYourPicks from "./PostYourPicks";
import { contest } from "../utils/contestData";
import axios from "axios";
import moment from "moment";
import "../css/Contest.css";

const Contest = () => {
  const { contestName } = useParams();
  const [contestDetails, setContestDetails] = useState(null);
  const [betsData, setBetsData] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [aggregateBets, setAggregateBets] = useState([]);

  useEffect(() => {
    const contestDetail = contest.find(
      (item) => item.contestName === contestName
    );
    if (contestDetail) {
      setContestDetails({
        ...contestDetail,
      });
    }
  }, [contestName]);

  useEffect(() => {
    if (contestDetails) {
      const fetchData = async () => {
        const response = await axios.get(contestDetails.spreadsheetUrl);
        setBetsData(response.data);
        setFilteredBets(response.data); // Initial filter setup
      };
      fetchData();
    }
  }, [contestDetails]);

  useEffect(() => {
    if (contestDetails) {
      const contestStart = moment(contestDetails.contestStartDate);
      const contestEnd = moment(contestDetails.contestEndDate);
      const filtered = betsData.filter((bet) => {
        const postedTime = moment(bet.postedTime);
        // return postedTime.isSameOrAfter(contestStart);
        return postedTime.isBetween(contestStart, contestEnd, null, "[]");
      });
      setFilteredBets(filtered);
      setAggregateBets(aggregateBetsCalculation(filtered));
    }
  }, [betsData, contestDetails]);

  const aggregateBetsCalculation = (bets) => {
    const handicappers = {};

    bets.forEach((bet) => {
      const odds = parseInt(bet.odds, 10);
      const username = bet.participantsUsername || "Anonymous";
      if (!handicappers[username]) {
        handicappers[username] = {
          totalOdds: 0,
          totalWonOdds: 0,
          numberOfBets: 0,
          numberOfBetsWon: 0,
          potentialWins: 0,
          socialType: bet.socialType,
          researchTools: [],
        };
      }
      handicappers[username].numberOfBets += 1;

      if (bet.betResult !== null) {
        handicappers[username].totalOdds += odds;
        if (bet.betResult === "won") {
          handicappers[username].totalWonOdds += odds;
          handicappers[username].numberOfBetsWon += 1;
          // Adjust calculation based on the sign of the odds
          if (odds > 0) {
            handicappers[username].potentialWins += 100 * (odds / 100); // For positive odds
          } else {
            handicappers[username].potentialWins +=
              100 * (100 / Math.abs(odds)); // For negative odds
          }
        }
        if (
          bet.researchToolOrModelUsed &&
          !handicappers[username].researchTools.includes(
            bet.researchToolOrModelUsed
          )
        ) {
          handicappers[username].researchTools.push(
            bet.researchToolOrModelUsed
          );
        }
      }
    });

    return Object.entries(handicappers)
      .map(
        ([
          username,
          {
            totalOdds,
            totalWonOdds,
            numberOfBets,
            numberOfBetsWon,
            potentialWins,
            socialType,
            researchTools,
          },
        ]) => ({
          username,
          totalOdds,
          totalWonOdds,
          numberOfBets,
          numberOfBetsWon,
          winRatio: (numberOfBetsWon / numberOfBets) * 100, // Calculate win ratio as a percentage
          potentialWins,
          socialType,
          researchTools,
        })
      )
      .sort((a, b) => b.potentialWins - a.potentialWins); // Sort by potentialWins
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!contestDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box sx={{ width: "auto", textAlign: "center", p: 3 }}>
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "black",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "700",
                fontSize: { xs: "32px", sm: "48px" },
                lineHeight: 1.2,
              }}
            >
              🌟 Join the {contestDetails.contestName}
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
              Participate, make your best picks, and win{" "}
              <span style={{ fontWeight: "600" }}>
                {contestDetails.firstPlacePrize} 🥇
              </span>
              .
            </Typography>

            <Box
              sx={{
                position: "relative",
                width: isMobile ? "260px" : "350px", // Conditional width
                height: isMobile ? "260px" : "350px", // Conditional height
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%", // Adjust to match the outer Box height
                  background:
                    "radial-gradient(circle, rgba(79,70,229,0.2) 0%, rgba(0,0,0,0) 70%)",
                  borderRadius: "50%",
                  filter: "blur(30px)",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              />
              <img
                src={contestDetails.primaryImageUrl}
                alt={contestDetails.contestName}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "20px",
                  boxShadow: "0 10px 40px rgba(255, 255, 255, 0.1)",
                }}
              />
            </Box>

            {/* <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  background: "#4F46E5",
                  color: "white",
                  fontWeight: "600",
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontSize: "16px",
                  "&:hover": {
                    background: "#3730A3",
                  },
                }}
              >
                Enter Contest
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#4F46E5",
                  color: "#4F46E5",
                  fontWeight: "600",
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontSize: "16px",
                  "&:hover": {
                    background: "rgba(79, 70, 229, 0.1)",
                  },
                }}
              >
                Learn More
              </Button>
            </Box> */}
          </Box>
        </Box>
        <>
          <Box
            sx={{
              zIndex: 1100,
              position: "sticky",
              top: 0,
              backgroundColor: "black",
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
                label="Post Your Picks🥇"
                {...a11yProps(0)}
                sx={{
                  color: "#4F46E5",
                  fontSize: isMobile ? "8px" : "10px",
                }}
              />
              <Tab
                label="Leaderboard 🏆"
                {...a11yProps(1)}
                sx={{
                  color: "#4F46E5",
                  fontSize: isMobile ? "8px" : "10px",
                }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <PostYourPicks
              contestName={contestDetails.contestName}
              primaryImageUrl={contestDetails.primaryImageUrl}
              firstPlacePrize={contestDetails.firstPlacePrize}
              secondPlacePrize={contestDetails.secondPlacePrize}
              thirdPlacePrize={contestDetails.thirdPlacePrize}
              spreadsheetUrl={contestDetails.spreadsheetUrl}
              sponsored={contestDetails.sponsored}
              contestEndDate={contestDetails.contestEndDate}
              contestStartDate={contestDetails.contestStartDate}
              contestLeague={contestDetails.contestLeague}
              filteredBets={filteredBets}
              aggregateBets={aggregateBets}
              availableFreePicks={contestDetails.availableFreePicks}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Leaderboard
              contestName={contestDetails.contestName}
              primaryImageUrl={contestDetails.primaryImageUrl}
              firstPlacePrize={contestDetails.firstPlacePrize}
              spreadsheetUrl={contestDetails.spreadsheetUrl}
              sponsored={contestDetails.sponsored}
              contestEndDate={contestDetails.contestEndDate}
              contestStartDate={contestDetails.contestStartDate}
              contestLeague={contestDetails.contestLeague}
              filteredBets={filteredBets}
              aggregateBets={aggregateBets}
              availableFreePicks={contestDetails.availableFreePicks}
            />
          </CustomTabPanel>
        </>
      </Box>
    </>
  );
};

export default Contest;
