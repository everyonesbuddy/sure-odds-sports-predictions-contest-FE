import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel";
import Leaderboard from "./Leaderboard";
import PostYourPicks from "./PostYourPicks";
import PayoutInfo from "./PayoutInfo";
import Paywall from "./Paywall";
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
  const [isRegisteredForContest, setIsRegisteredForContest] = useState(false);
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
      const lasContestEnd = moment(contestDetails.lastContestEndDate);

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

  useEffect(() => {
    // Check if the user is registered for the contest and the end date has not passed
    const checkRegistration = () => {
      const isRegistered =
        user?.registeredContests?.some(
          (contest) =>
            contest.name === contestDetails?.contestName &&
            new Date(contest.endDate) > new Date()
        ) || contestDetails?.entryFee === 0; // Allow free contests to be considered registered
      setIsRegisteredForContest(isRegistered);
      console.log("Is user registered for contest:", isRegistered);
    };

    checkRegistration();
  }, [user, contestDetails]);

  const CountdownAndPicks = ({
    contestEndDate,
    aggregateBets,
    participantsUsername,
    availablePicks,
  }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [picksLeft, setPicksLeft] = useState(availablePicks);

    useEffect(() => {
      const updateCountdown = () => {
        const now = new Date();
        const end = new Date(contestEndDate);
        const diff = end - now;

        if (diff <= 0) {
          setTimeLeft("Contest has ended");
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }, [contestEndDate]);

    useEffect(() => {
      const userBets = aggregateBets.find(
        (b) => b.username === participantsUsername
      );
      const betsPlaced = userBets ? userBets.numberOfBets : 0;
      setPicksLeft(Math.max(availablePicks - betsPlaced, 0));
    }, [aggregateBets, participantsUsername, availablePicks]);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#A5B4FC",
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: 500,
            background: "rgba(79,70,229,0.1)",
            px: 2,
            py: 1,
            borderRadius: "12px",
          }}
        >
          ⏳ Ends in: {timeLeft}
        </Typography>
        <Typography
          sx={{
            color: "#A5B4FC",
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: 500,
            background: "rgba(79,70,229,0.1)",
            px: 2,
            py: 1,
            borderRadius: "12px",
          }}
        >
          🎯 Picks Left: {picksLeft}/{availablePicks}
        </Typography>
      </Box>
    );
  };

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
    if (contestDetails.contestFormat === "Pickem") {
      return results.sort((a, b) => b.numberOfBetsWon - a.numberOfBetsWon);
    } else if (contestDetails.contestFormat === "Streak") {
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
            backgroundColor: "black",
            color: "white",
            py: { xs: 6, md: 10 },
            px: { xs: 3, md: 8 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            borderBottom: "1px solid rgba(79,70,229,0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Glow Background */}
          <Box
            sx={{
              position: "absolute",
              top: "-50%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "800px",
              height: "800px",
              background:
                "radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(0,0,0,0) 70%)",
              zIndex: 0,
            }}
          />

          {/* Hero Content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              maxWidth: "900px",
              width: "100%",
            }}
          >
            {/* Contest Format */}
            <Typography
              variant="body2"
              sx={{
                display: "inline-block",
                background: "rgba(79,70,229,0.1)",
                border: "1px solid rgba(79,70,229,0.3)",
                borderRadius: "999px",
                px: 2,
                py: 0.5,
                fontSize: "12px",
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#A5B4FC",
              }}
            >
              {contestDetails.contestFormat} Contest
            </Typography>

            {/* Contest Name */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "32px", md: "46px" },
                mb: 1.5,
                lineHeight: 1.2,
                color: "white",
              }}
            >
              {contestDetails.contestName}
            </Typography>

            {/* Status & Date Range */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  display: "inline-block",
                  background: moment().isBefore(
                    contestDetails.currentContestStartDate
                  )
                    ? "rgba(234,179,8,0.1)"
                    : moment().isAfter(contestDetails.currentContestEndDate)
                    ? "rgba(239,68,68,0.1)"
                    : "rgba(16,185,129,0.1)",
                  color: moment().isBefore(
                    contestDetails.currentContestStartDate
                  )
                    ? "#EAB308"
                    : moment().isAfter(contestDetails.currentContestEndDate)
                    ? "#EF4444"
                    : "#10B981",
                  borderRadius: "999px",
                  px: 2,
                  py: 0.5,
                  fontSize: "12px",
                  mr: 2,
                }}
              >
                {moment().isBefore(contestDetails.currentContestStartDate)
                  ? "Starts Soon"
                  : moment().isAfter(contestDetails.currentContestEndDate)
                  ? "Contest Ended"
                  : "LIVE NOW"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#9CA3AF",
                  display: "inline-block",
                }}
              >
                {moment(contestDetails.currentContestStartDate).format("MMM D")}{" "}
                –{" "}
                {moment(contestDetails.currentContestEndDate).format(
                  "MMM D, YYYY"
                )}
              </Typography>
            </Box>

            {/* Countdown & Picks Remaining */}
            <CountdownAndPicks
              contestEndDate={contestDetails.currentContestEndDate}
              aggregateBets={aggregateBets}
              participantsUsername={user?.userName}
              availablePicks={contestDetails.availablePicks}
            />

            {/* Prize and Entry */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: "18px",
                mt: 3,
                mb: 4,
                color: "#C7D2FE",
              }}
            >
              💰 Prize Pool: {contestDetails.contestPrimaryPrize} | 💸 Entry
              Fee: ${contestDetails.entryFee}
            </Typography>

            {/* CTA */}
            <Box>
              {isRegisteredForContest ? (
                <Typography
                  sx={{
                    backgroundColor: "#22C55E",
                    color: "white",
                    px: 3,
                    py: 1.2,
                    borderRadius: "999px",
                    fontWeight: 500,
                    display: "inline-block",
                  }}
                >
                  You’re Registered ✅
                </Typography>
              ) : (
                <Typography
                  component="a"
                  href="#paywall"
                  sx={{
                    background: "linear-gradient(90deg, #4F46E5, #6366F1)",
                    color: "white",
                    px: 3,
                    py: 1.2,
                    borderRadius: "999px",
                    fontWeight: 500,
                    display: "inline-block",
                    boxShadow: "0 4px 14px rgba(79,70,229,0.5)",
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  Join Contest Below
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {isRegisteredForContest ? (
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
                  label="LeaderBoard 🏆"
                  {...a11yProps(1)}
                  sx={{
                    color: "#4F46E5",
                    fontSize: isMobile ? "8px" : "10px",
                  }}
                />
                <Tab
                  label="Payout info 💵"
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
                availablePicks={contestDetails.availablePicks}
                affiliates={contestDetails.affiliates}
                entryFee={contestDetails.entryFee}
                contestFormat={contestDetails.contestFormat}
                availableMarkets={contestDetails.availableMarkets}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Leaderboard
                contestEndDate={contestDetails.currentContestEndDate}
                contestStartDate={contestDetails.currentContestStartDate}
                aggregateBets={aggregateBets}
                lastContestEndDate={contestDetails.lastContestEndDate}
                lastContestStartDate={contestDetails.lastConstestStartDate}
                lastAggregateBets={lastContestAggregateBets}
                contestName={contestDetails.contestName}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <PayoutInfo
                contestName={contestDetails.contestName}
                spreadsheetUrl={contestDetails.spreadsheetUrl}
                contestPrimaryPrize={contestDetails.contestPrimaryPrize}
                contestLeague={contestDetails.contestLeague}
                contestEndDate={contestDetails.contestEndDate}
                contestStartDate={contestDetails.contestStartDate}
                currentUserBetsForContest={currentUserBetsForContest}
                aggregateBets={aggregateBets}
                availablePicks={contestDetails.availablePicks}
                contestFormat={contestDetails.contestFormat}
                entryFee={contestDetails.entryFee}
              />
            </CustomTabPanel>
          </>
        ) : (
          <Paywall
            contestName={contestDetails.contestName}
            spreadsheetUrl={contestDetails.spreadsheetUrl}
            contestPrimaryPrize={contestDetails.contestPrimaryPrize}
            contestLeague={contestDetails.contestLeague}
            contestEndDate={contestDetails.currentContestEndDate}
            contestStartDate={contestDetails.currentContestStartDate}
            currentUserBetsForContest={currentUserBetsForContest}
            availablePicks={contestDetails.availablePicks}
            entryFee={contestDetails.entryFee}
          />
        )}
      </Box>
      <AffiliateSliders affiliates={contestDetails.affiliates} />
    </>
  );
};

export default Contest;
