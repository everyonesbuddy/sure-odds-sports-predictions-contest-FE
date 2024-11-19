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
              companyName={item.companyName}
              description={item.description}
              price={item.price}
              contestFormat={item.contestFormat}
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
