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
import moment from "moment";
import Countdown from "react-countdown";

// Countdown renderer component
const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span style={{ color: "red" }}>The tournament has ended!</span>;
  } else {
    return (
      <span style={{ color: "red" }}>
        {days} days {hours} hours {minutes} minutes {seconds} seconds
      </span>
    );
  }
};

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
  const getTournamentEndTime = () => {
    const now = moment().utcOffset(-4); // EST is UTC-4
    const endOfMonth = now
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
    return endOfMonth.toDate();
  };

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
                primary="🏆 Compete and Win: Join Our Free-to-Play Sports Prediction Contest!"
                secondary="Our platform allows everyday bettors to showcase their skills in predicting sports outcomes. Whether you’re a casual fan or a seasoned bettor, you can compete for exciting prizes while enjoying the thrill of the game!"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="📈 Why We Do This"
                secondary="Our business is a free-to-play sports prediction platform designed to engage global sports fans in friendly competition. We believe in creating an inclusive space where everyone can participate, share their passion for sports, and enjoy the excitement of predicting outcomes without any financial risk. By fostering a fun and competitive environment, we aim to bring fans together and elevate their sports experience."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="💵 Prizes"
                secondary={
                  <>
                    First Place: Win $100 cas prize!{" "}
                    {/* <Link
                      href="https://doinksports.com/?via=sureOdds"
                      target="_blank"
                      rel="noopener"
                    >
                      Doink Sports
                    </Link> */}
                    {/* . Second Place receives just a ticket to their favorite
                    team's game. */}
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="🔍 Performance Tracking & Leaderboards"
                secondary="Each picks are tracked based on a simulated $500 wager per pick. Our rankings are built on ROI (return on investment) and accuracy over time, so you can see who’s consistently delivering results."
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="✨ Good Luck and Happy Predicting! 🎉" />
            </ListItem>
          </List>
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="body2">
          Countdown to Current Monthly Tournament End:
        </Typography>
        <Countdown date={getTournamentEndTime()} renderer={CountdownRenderer} />
      </Box>
    </>
  );
};

export default TournamentDetails;
