import React from "react";
import { Box, Typography } from "@mui/material";
// import KofiWidget from "./KofiWidget";
import Footer from "./Footer";
import ContestCard from "./ContestCard";
import "../css/Home.css";

// const affiliates = [
//   {
//     message: "Parlay Play: Get $100 match for your first deposit",
//     color: "#eac100",
//     url: "https://parlayplay.io/account/signup?coupon=joeddomitor",
//   },
//   {
//     message: "Underdog: Get first deposit matched in bonus cash up to $250",
//     color: "#1b1b1b",
//     url: "https://play.underdogfantasy.com/magnusdomitor",
//   },
//   {
//     message: "Prize Picks: First deposit match up to $100!",
//     color: "#8000ff",
//     url: "https://app.prizepicks.com/sign-up?invite_code=PR-SUWVT13",
//   },
//   // Add more affiliates here
// ];

const Home = () => {
  // const a11yProps = (index) => ({
  //   id: `simple-tab-${index}`,
  //   "aria-controls": `simple-tabpanel-${index}`,
  // });

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  // const [value, setValue] = React.useState(0);

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [currentAffiliateIndex, setCurrentAffiliateIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentAffiliateIndex(
  //       (prevIndex) => (prevIndex + 1) % affiliates.length
  //     );
  //   }, 3000); // Change slide every 3 seconds

  //   return () => clearInterval(interval);
  // }, []);

  const contest = [
    {
      contestName: "Doink Sports",
      primaryImageUrl: "https://i.ibb.co/xzk85XK/0k0-A7-Ib3-400x400.jpg",
      price: "Win a free 2 months subscription to Doink Sports",
      spreadsheetUrl:
        "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
      sponsored: false,
      affiliateUrl: "https://doinksports.com/?via=Sure-Odds",
      affiliateCopy: "Try Doink Sports Research Platform For Free",
      contestEndDate: "2/2/2025",
      contestStartDate: "11/15/2024",
      contestLeague: ["americanfootball_nfl", "basketball_nba", "soccer_epl"],
    },
    {
      contestName: "DG Fantasy",
      primaryImageUrl: "https://i.ibb.co/p4w0j39/o-GXbjunp-400x400.png",
      price: "Win a free 2 months subscription to DG Fantasy",
      spreadsheetUrl:
        "https://api.sheetbest.com/sheets/8dc7d109-648f-4403-8d28-37303439a580",
      sponsored: false,
      affiliateUrl: "https://dgfantasy.com/membership-signup?ref=mjkwmti",
      affiliateCopy: "Try DG Fantasy Research Platform For Free",
      contestEndDate: "2/9/2025",
      contestStartDate: "12/9/2024",
      contestLeague: ["americanfootball_nfl", "soccer_germany_bundesliga"],
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
            The #1 Global Free-to-Play Sports Pick'em Contest
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
              contestEndDate={item.contestEndDate}
              contestStartDate={item.contestStartDate}
              contestLeague={item.contestLeague}
              affiliateUrl={item.affiliateUrl}
              affiliateCopy={item.affiliateCopy}
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
