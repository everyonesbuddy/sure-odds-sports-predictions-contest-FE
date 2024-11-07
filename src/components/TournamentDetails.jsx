import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Link as MuiLink,
} from "@mui/material";
// import moment from "moment";
// import Countdown from "react-countdown";
import Footer from "./Footer";
import { Link as RouterLink } from "react-router-dom";

// Countdown renderer component
// const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
//   if (completed) {
//     return <span style={{ color: "red" }}>The tournament has ended!</span>;
//   } else {
//     return (
//       <span style={{ color: "red" }}>
//         {days} days {hours} hours {minutes} minutes {seconds} seconds
//       </span>
//     );
//   }
// };

const TournamentDetails = () => {
  // Calculate the end time of the tournament for month
  // const getTournamentEndTime = () => {
  //   const now = moment().utcOffset(-4); // EST is UTC-4
  //   const endOfMonth = now
  //     .clone()
  //     .endOf("month")
  //     .set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
  //   return endOfMonth.toDate();
  // };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 600,
          margin: "auto",
          marginTop: 5,
          marginBottom: 5,
          backgroundColor: "#2b2b2b",
        }}
      >
        <Typography align="center" gutterBottom sx={{ color: "#fff" }}>
          <List style={{ listStyleType: "none", padding: 0 }}>
            <ListItem>
              <ListItemText
                primary="About Us"
                secondary="At Sure Odds, we’re all about one thing: giving you the facts. We track every handicapper and model, bringing you the verified data that matters. Say goodbye to guesswork and hello to confidence. With Sure Odds, you know exactly who’s worth following and who’s not, every time you place a bet."
                primaryTypographyProps={{
                  sx: {
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
                secondaryTypographyProps={{ sx: { color: "#fff" } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Handicapper and Model List"
                secondary={
                  <>
                    We have provided a list of Handicappers and Models we are
                    currently tracking{" "}
                    <MuiLink
                      href="https://docs.google.com/document/d/1nEXq22ncM1fZNVi4FROGb0Pj8vxHnADuDdpiv2A96Pg/edit?usp=sharing"
                      target="_blank"
                      rel="noopener"
                    >
                      here
                    </MuiLink>
                    , the most complete betting research platform.
                  </>
                }
                primaryTypographyProps={{
                  sx: {
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
                secondaryTypographyProps={{ sx: { color: "#fff" } }}
              />
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Daily Pick Tracking"
                secondary="Every day, our team carefully tracks up to five picks from each top handicapper and model. We gather these picks directly from their subscription platforms, social feeds, and other verified sources. But we don’t publish the picks themselves—out of respect for the experts’ business, we only post the results. This way, we help you make informed decisions without interfering with the pros’ work"
                primaryTypographyProps={{
                  sx: {
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
                secondaryTypographyProps={{ sx: { color: "#fff" } }}
              />
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Performance Tracking & Leaderboards"
                secondary="Each picks are tracked based on a simulated $100 wager per pick. Our rankings are built on ROI (return on investment) and accuracy over time. Good Luck!"
                primaryTypographyProps={{
                  sx: {
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
                secondaryTypographyProps={{ sx: { color: "#fff" } }}
              />
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Advanced Analytics"
                secondary={
                  <>
                    Our subscription plan gives you more than a leaderboard.
                    Dive into in-depth reports built from real performance data,
                    helping you spot trends, identify undervalued picks, and
                    track long-term performance across different sports, time
                    frames, and conditions. We take the data beyond surface
                    stats, giving you actionable insights that can fine-tune
                    your strategy and help you make confident, data-backed
                    decisions. From profitability trends to consistency reports,
                    Sure Odds subscribers have the advantage of powerful, clear
                    analytics that make every bet smarter{" "}
                    <RouterLink
                      to="/personalizedAnalytics"
                      style={{ textDecoration: "none", color: "#61dafb" }}
                    >
                      Subscribe Now
                    </RouterLink>{" "}
                    and win more.
                  </>
                }
                primaryTypographyProps={{
                  sx: {
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
                secondaryTypographyProps={{ sx: { color: "#fff" } }}
              />
            </ListItem>
          </List>
        </Typography>
      </Box>

      {/* <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="body2">
          Countdown to {new Date().toLocaleString("default", { month: "long" })}{" "}
          {new Date().getFullYear()} Tournament End:
        </Typography>
        <Countdown date={getTournamentEndTime()} renderer={CountdownRenderer} />
      </Box> */}
      <Footer />
    </>
  );
};

export default TournamentDetails;
