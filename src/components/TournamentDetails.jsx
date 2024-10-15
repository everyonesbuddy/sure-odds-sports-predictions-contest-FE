import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  // Link,
} from "@mui/material";
// import axios from "axios";
// import moment from "moment";
// import Countdown from "react-countdown";

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
  // Calculate the end time of the tournament for week
  // const getTournamentEndTime = () => {
  //   const now = moment().utcOffset(-4); // EST is UTC-4
  //   const dayOfWeek = now.day();
  //   const daysUntilSunday = (7 - dayOfWeek) % 7; // Days until the next Sunday
  //   const nextSunday = now
  //     .clone()
  //     .add(daysUntilSunday, "days")
  //     .set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
  //   return nextSunday.toDate();
  // };

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
          backgroundColor: "background.paper",
          maxWidth: 600,
          margin: "auto",
          marginTop: 5,
        }}
      >
        <Typography align="center" gutterBottom>
          <List style={{ listStyleType: "none", padding: 0 }}>
            <ListItem>
              <ListItemText
                primary="About Us"
                secondary="At SureOdds, we bring transparency and trust to sports betting by tracking the real performance of top handicappers and models. Our goal is simple: help bettors make informed decisions by showing who’s delivering results, while giving handicappers the visibility they deserve."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Why We Do This"
                secondary="With so much noise in the betting world, it’s hard to know who’s actually winning. We’re here to change that. By using data and tracking performance, we help bettors find proven winners and give handicappers a platform to showcase their expertise based on facts, not hype."
              />
            </ListItem>
            {/* <ListItem>
              <ListItemText
                primary="💵 Prizes"
                secondary={
                  <>
                    First Place: Win $100 cas prize!{" "} */}
            {/* <Link
                      href="https://doinksports.com/?via=sureOdds"
                      target="_blank"
                      rel="noopener"
                    >
                      Doink Sports
                    </Link> */}
            {/* . Second Place receives just a ticket to their favorite
                    team's game. */}
            {/* </> */}
            {/* //   }
              // /> */}
            {/* </ListItem> */}
            <ListItem>
              <ListItemText
                primary="Performance Tracking & Leaderboards"
                secondary="Each picks are tracked based on a simulated $500 wager per pick. Our rankings are built on ROI (return on investment) and accuracy over time, so you can see who’s consistently delivering results."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Supporting Handicappers"
                secondary="We don’t sell or give away handicappers’ picks. Instead, we focus on their performance data, showing past results to build credibility. Bettors can tip handicappers directly on our platform, and handicappers can pay for sponsored spots to boost visibility without disrupting their business. Our goal is to help handicappers grow while keeping their picks valuable."
              />
            </ListItem>
          </List>
        </Typography>
      </Box>

      {/* <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="body2">
          Countdown to Current Monthly Tournament End:
        </Typography>
        <Countdown date={getTournamentEndTime()} renderer={CountdownRenderer} />
      </Box> */}
    </>
  );
};

export default TournamentDetails;
