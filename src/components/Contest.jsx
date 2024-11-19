import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel";
import Leaderboard from "./Leaderboard";
import PostYourPicks from "./PostYourPicks";
// import PicksDetails from "./PicksDetails";
import "../css/Contest.css";

const Contest = () => {
  const { companyName } = useParams();
  const [contestDetails, setContestDetails] = useState(null);

  const contest = useMemo(
    () => [
      {
        companyName: "Doink Sports",
        primaryImageUrl: "https://i.ibb.co/L6zK67S/0k0-A7-Ib3-400x400.jpg",
        description:
          "Sports betting research platform. Props, trends, +EV, odds charts, arbs, matchup analysis and more!",
        price: "Free 2 month subscription to Doink Sports Research Platform",
        spreadsheetUrl:
          "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
        secondaryImageUrl: "https://i.ibb.co/XYjWV6p/1500x500-1.jpg",
        sponsored: false,
        affiliateUrl: "https://doinksports.com/?via=Sure-Odds",
        contestFormat: "weekly",
      },
      {
        companyName: "Daily Grind Fantasy Sports",
        primaryImageUrl: "https://i.ibb.co/PhvNXsj/o-GXbjunp-400x400.png",
        description:
          "Profitable bets at your fingertips! We make fantasy betting simpler.",
        price:
          "Free 2 month subscription to Daily Grind Fantasy Fantasy Bundle tools",
        spreadsheetUrl:
          "https://api.sheetbest.com/sheets/8dc7d109-648f-4403-8d28-37303439a580",
        secondaryImageUrl: "https://i.ibb.co/CVVwBv1/1500x500.jpg",
        sponsored: false,
        affiliateUrl: "https://dgfantasy.com/membership-signup?ref=mjkwmti",
        contestFormat: "monthly",
      },
    ],
    []
  );

  useEffect(() => {
    const contestDetail = contest.find(
      (item) => item.companyName === companyName
    );
    if (contestDetail) {
      setContestDetails(contestDetail);
    }
    console.log("companyName", companyName);
  }, [companyName, contest]);

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
        <div className="contest-header">
          <div className="contest-header-left">
            <h1>
              Welcome to {contestDetails.companyName}{" "}
              {contestDetails.contestFormat} contest
            </h1>
            {!isMobile && <p>Participate and Win {contestDetails.price}</p>}
            <button
              onClick={() => window.open(contestDetails.affiliateUrl, "_blank")}
              className="button-link"
            >
              Go to {contestDetails.companyName}
            </button>
          </div>
          <div className="contest-header-right">
            <img
              src={contestDetails.primaryImageUrl}
              alt={contestDetails.companyName}
            />
          </div>
        </div>
        <Box
          sx={{
            zIndex: 1100,
            position: "sticky",
            top: 0,
            backgroundColor: "#161616",
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
                fontSize: isMobile ? "8px" : "10px",
              }}
            />
            <Tab
              label="Post Your Picks🥇"
              {...a11yProps(1)}
              sx={{
                color: "#4F46E5",
                fontSize: isMobile ? "8px" : "10px",
              }}
            />
            {/* <Tab
              label="Live Picks Preview 📊"
              {...a11yProps(2)}
              sx={{
                color: "#4F46E5",
                fontSize: isMobile ? "8px" : "10px",
              }}
            /> */}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Leaderboard
            companyName={contestDetails.companyName}
            primaryImageUrl={contestDetails.primaryImageUrl}
            description={contestDetails.description}
            price={contestDetails.price}
            spreadsheetUrl={contestDetails.spreadsheetUrl}
            secondaryImageUrl={contestDetails.secondaryImageUrl}
            sponsored={contestDetails.sponsored}
            contestFormat={contestDetails.contestFormat}
            affiliateUrl={contestDetails.affiliateUrl}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PostYourPicks
            companyName={contestDetails.companyName}
            primaryImageUrl={contestDetails.primaryImageUrl}
            description={contestDetails.description}
            price={contestDetails.price}
            spreadsheetUrl={contestDetails.spreadsheetUrl}
            secondaryImageUrl={contestDetails.secondaryImageUrl}
            sponsored={contestDetails.sponsored}
            contestFormat={contestDetails.contestFormat}
            affiliateUrl={contestDetails.affiliateUrl}
          />
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={2}>
          <PicksDetails
            companyName={contestDetails.companyName}
            primaryImageUrl={contestDetails.primaryImageUrl}
            description={contestDetails.description}
            price={contestDetails.price}
            spreadsheetUrl={contestDetails.spreadsheetUrl}
            secondaryImageUrl={contestDetails.secondaryImageUrl}
            sponsored={contestDetails.sponsored}
            contestFormat={contestDetails.contestFormat}
            affiliateUrl={contestDetails.affiliateUrl}
          />
        </CustomTabPanel> */}
      </Box>
    </>
  );
};

export default Contest;
