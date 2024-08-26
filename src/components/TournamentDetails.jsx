import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Link,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import Countdown from "react-countdown";

const stripeApiKey = process.env.REACT_APP_STRIPE_API_KEY;

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
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.stripe.com/v1/balance", {
          headers: {
            Authorization: `Bearer ${stripeApiKey}`,
          },
        });
        setBalance(response.data);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchData();
  }, []);

  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

  const getTotalBalance = () => {
    if (!balance) return "Loading...";
    const availableAmount = balance.available.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    const pendingAmount = balance.pending.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    const totalAmount = availableAmount + pendingAmount;
    return formatAmount(totalAmount);
  };

  // Calculate the end time of the tournament
  const getTournamentEndTime = () => {
    const now = moment().utcOffset(-4); // EST is UTC-4
    const dayOfWeek = now.day();
    const daysUntilSunday = (7 - dayOfWeek) % 7; // Days until the next Sunday
    const nextSunday = now
      .clone()
      .add(daysUntilSunday, "days")
      .set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
    return nextSunday.toDate();
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
        }}
      >
        <Typography align="center" gutterBottom>
          <List style={{ listStyleType: "none", padding: 0 }}>
            <ListItem>
              <ListItemText
                primary="🏆 Weekly Payouts &  Each Bet Value"
                secondary="Every bet is treated as a $100 wager. Top participants in accuracy and volume will receive weekly payouts. Winners will be contacted via social media."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="🔍 Accuracy "
                secondary="Accuracy is based on potential wins from $100 bets, adjusted for odds."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="💵 Prizes"
                secondary={
                  <>
                    First Place receives 100% of the prize pool + a ticket to
                    their favorite team's game + a 2 months subscription to{" "}
                    <Link
                      href="https://doinksports.com/?via=sureOdds"
                      target="_blank"
                      rel="noopener"
                    >
                      Doink Sports
                    </Link>
                    . Second Place receives just a ticket to their favorite
                    team's game.
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="💰 Prize Pool "
                secondary="The Prize pool is a combination of donations from users, sponsors, and SureOdds. The prize pool is paid to the top participant."
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="✨ Good Luck and Happy Predicting! 🎉" />
            </ListItem>
          </List>
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6">Countdown to Tournament End:</Typography>
        <Countdown date={getTournamentEndTime()} renderer={CountdownRenderer} />
      </Box>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6">Current Week Prize Pool:</Typography>
        <Typography variant="h4">${getTotalBalance()}</Typography>
      </Box>
    </>
  );
};

export default TournamentDetails;
