import React from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import Footer from "./Footer";

const TournamentDetails = () => {
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
                secondary="Welcome to SureOdds, the world’s #1 destination for free-to-play sports pick'em contests. We bring together sports enthusiasts from every corner of the globe to predict game outcomes, compete with friends, and win incredible prizes – all without spending a cent.
              Our mission is simple: make sports more exciting by letting you test your knowledge and predictions against fans from around the world. Whether you’re a die-hard football fan, a cricket enthusiast, or a basketball buff, we’ve got contests for you. Play for free, win prizes, and enjoy the thrill of competition on a global scale.
              Join us today, make your picks, and see if you have what it takes to be a champion!"
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
                primary="Prizes"
                secondary={
                  <>
                    Prices are based on contest you participate in and are
                    awarded to the top performer. Prizes can range from, free
                    subscriptions, cash, gift cards, and other rewards.
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
          </List>
        </Typography>
      </Box>
      <Footer />
    </>
  );
};

export default TournamentDetails;
