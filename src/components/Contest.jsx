import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel";
import Leaderboard from "./Leaderboard";
import LastLeaderboard from "./LastLeaderboard";
import PostYourPicks from "./PostYourPicks";
// import Paywall from "./Paywall"; use this in entry fee platform but we are on the free platform
import AffiliateSliders from "./AffiliateSliders";
import { useContestData } from "../hooks/useContestData";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import moment from "moment";
import "../css/Contest.css";

const Contest = () => {
  const { contestName } = useParams();
  const [contestDetails, setContestDetails] = useState(null);
  const [allUsersBetsForContest, setAllUsersBetsForContest] = useState([]);
  const [currentUserBetsForContest, setCurrentUserBetsForContest] = useState(
    []
  );
  const [aggregateBets, setAggregateBets] = useState([]);
  const [lastContestAggregateBets, setLastContestAggregateBets] = useState([]);
  // const [isRegisteredForContest, setIsRegisteredForContest] = useState(false); use this in entry fee platform but we are on the free platform
  const contestData = useContestData();

  const { user, token } = useAuth();

  useEffect(() => {
    const contestDetail = contestData.find(
      (item) => item.contestName === contestName
    );
    if (contestDetail) {
      setContestDetails({
        ...contestDetail,
      });
    }
  }, [contestName, contestData]);

  useEffect(() => {
    if (contestDetails) {
      const fetchAllUsersBetsForContest = async () => {
        try {
          const response = await axios.get(
            `${contestDetails?.spreadsheetUrl}filtered`, // Route gets all users bets that participate in this contest, but with some filtered out propties
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include token in headers
              },
            }
          );
          setAllUsersBetsForContest(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      // Fetch all users' bets for the contest
      fetchAllUsersBetsForContest();
    }
  }, [contestDetails, token]);

  useEffect(() => {
    if (contestDetails) {
      const fetchCurrentUserBetsForContestWithFilteredProperties = async () => {
        try {
          const response = await axios.post(
            `${contestDetails.spreadsheetUrl}user`, // Route gets all of this logged in user bets for this contest, but with some filtered out propties
            {
              username: user?.userName, // Pass userName in the request body
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include token in headers
              },
            }
          );
          setCurrentUserBetsForContest(response.data.docs);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchCurrentUserBetsForContestWithFilteredProperties();
    }
  }, [contestDetails, user, token]);

  useEffect(() => {
    if (contestDetails) {
      const contestStart = moment(contestDetails.currentContestStartDate);
      const contestEnd = moment(contestDetails.currentContestEndDate);

      const lasContestStart = moment(contestDetails.lastConstestStartDate);
      const lasContestEnd = moment(contestDetails.lastcurrentContestEndDate);

      // current contest filtered
      const filtered = allUsersBetsForContest.filter((bet) => {
        const postedTime = moment(bet.postedTime);
        return postedTime.isBetween(contestStart, contestEnd, null, "[]");
      });

      // last contest filtered
      const filteredLastContest = allUsersBetsForContest.filter((bet) => {
        const postedTime = moment(bet.postedTime);
        return postedTime.isBetween(lasContestStart, lasContestEnd, null, "[]");
      });

      setAggregateBets(aggregateBetsCalculation(filtered, contestDetails));
      setLastContestAggregateBets(
        aggregateBetsCalculation(filteredLastContest, contestDetails)
      );
    }
  }, [allUsersBetsForContest, contestDetails]);

  // use this in entry fee platform but we are on the free platform

  // useEffect(() => {
  //   // Check if the user is registered for the contest and the end date has not passed
  //   const checkRegistration = () => {
  //     const isRegistered = user?.registeredContests?.some(
  //       (contest) =>
  //         contest.name === contestDetails?.contestName &&
  //         new Date(contest.endDate) > new Date()
  //     );
  //     setIsRegisteredForContest(isRegistered);
  //     console.log("Is user registered for contest:", isRegistered);
  //   };

  //   checkRegistration();
  // }, [user, contestDetails]);

  const aggregateBetsCalculation = (bets, contestDetails) => {
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
          researchTools: [],
          currentWinStreak: 0, // Track the current win streak
        };
      }

      handicappers[username].numberOfBets += 1;

      if (bet.betResult !== null) {
        handicappers[username].totalOdds += odds;

        if (bet.betResult === "won") {
          handicappers[username].totalWonOdds += odds;
          handicappers[username].numberOfBetsWon += 1;

          // Increment win streak
          handicappers[username].currentWinStreak += 1;
        } else if (bet.betResult === "lost") {
          // Reset win streak on loss
          handicappers[username].currentWinStreak = 0;
        }
      }
    });

    const results = Object.entries(handicappers).map(
      ([
        username,
        {
          totalOdds,
          totalWonOdds,
          numberOfBets,
          numberOfBetsWon,
          currentWinStreak,
        },
      ]) => ({
        username,
        totalOdds,
        totalWonOdds,
        numberOfBets,
        numberOfBetsWon,
        winRatio: (numberOfBetsWon / numberOfBets) * 100, // Calculate win ratio as a percentage
        currentWinStreak, // Include current win streak in the return object
      })
    );

    // Sort based on contest type
    if (contestDetails.contestType === "Pickem") {
      return results.sort((a, b) => b.numberOfBetsWon - a.numberOfBetsWon);
    } else if (contestDetails.contestType === "Streak") {
      return results.sort((a, b) => b.currentWinStreak - a.currentWinStreak);
    }

    return results; // Default return if no contest type matches
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
            textAlign: "left",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "black",
            padding: "10px 10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              maxWidth: "900px",
              width: "100%",
            }}
          >
            {/* Text Section */}
            <Box sx={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "24px", sm: "35px" },
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Enter the {contestDetails.contestName}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#ccc",
                  fontSize: isMobile ? "14px" : "16px",
                  mb: 2,
                }}
              >
                Buy in. Make picks. Climb the leaderboard. Win amazing prizes.
              </Typography>

              <Box
                sx={{
                  backgroundColor: "#4F46E5",
                  px: 3,
                  py: 1,
                  borderRadius: "999px",
                  fontWeight: 500,
                  fontSize: isMobile ? "13px" : "14px",
                  textAlign: "center",
                }}
              >
                💰 Prize Pool: ${contestDetails.contestPrimaryPrize}
              </Box>
            </Box>

            {/* Image Section */}
            {!isMobile && (
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  maxWidth: "350px",
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background:
                      "radial-gradient(circle, rgba(79,70,229,0.2) 0%, rgba(0,0,0,0) 70%)",
                    borderRadius: "50%",
                    filter: "blur(30px)",
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
            )}
          </Box>
        </Box>

        {/* use this in entry fee platform but we are on the free platform */}
        {/* {isRegisteredForContest ? ( */}
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
                label="Your Picks 🥇"
                {...a11yProps(0)}
                sx={{
                  color: "#4F46E5",
                  fontSize: isMobile ? "8px" : "10px",
                }}
              />
              <Tab
                label="Live Board 🏆"
                {...a11yProps(1)}
                sx={{
                  color: "#4F46E5",
                  fontSize: isMobile ? "8px" : "10px",
                }}
              />
              <Tab
                label="Prev Board 🏁"
                {...a11yProps(2)}
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
              contestPrimaryPrize={contestDetails.contestPrimaryPrize}
              spreadsheetUrl={contestDetails.spreadsheetUrl}
              contestEndDate={contestDetails.currentContestEndDate}
              contestStartDate={contestDetails.currentContestStartDate}
              currentUserBetsForContest={currentUserBetsForContest}
              contestLeague={contestDetails.contestLeague}
              aggregateBets={aggregateBets}
              availableFreePicks={contestDetails.availableFreePicks}
              affiliates={contestDetails.affiliates}
              contestType={contestDetails.contestType}
              availableMarkets={contestDetails.availableMarkets}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Leaderboard
              contestEndDate={contestDetails.currentContestEndDate}
              contestStartDate={contestDetails.currentContestStartDate}
              aggregateBets={aggregateBets}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <LastLeaderboard
              lastContestEndDate={contestDetails.lastcurrentContestEndDate}
              lastContestStartDate={contestDetails.lastConstestStartDate}
              lastContestAggregateBets={lastContestAggregateBets}
              constestName={contestDetails.contestName}
            />
          </CustomTabPanel>
        </>
        {/* use this in entry fee platform but we are on the free platform */}
        {/* ) : (
          <Paywall
            contestName={contestDetails.contestName}
            spreadsheetUrl={contestDetails.spreadsheetUrl}
            contestPrimaryPrize={contestDetails.contestPrimaryPrize}
            contestLeague={contestDetails.contestLeague}
            contestEndDate={contestDetails.currentContestEndDate}
            contestStartDate={contestDetails.currentContestStartDate}
            currentUserBetsForContest={currentUserBetsForContest}
            availableFreePicks={contestDetails.availableFreePicks}
          />
        )} */}
      </Box>
      <AffiliateSliders affiliates={contestDetails.affiliates} />
    </>
  );
};

export default Contest;
