import React from "react";
import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import Footer from "./Footer";

const About = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 800,
          margin: "auto",
          marginTop: 5,
          marginBottom: 5,
          backgroundColor: "#2b2b2b",
          color: "#fff",
        }}
      >
        {/* Heading */}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          About Us
        </Typography>

        {/* Intro */}
        <Typography align="center" paragraph>
          Welcome to <strong>SureOdds</strong> – The #1 Free-to-Play Weekly
          Sports Prediction Contest!
        </Typography>

        <Typography paragraph>
          At SureOdds, we believe sports are more than just games – they’re a
          global language that unites fans everywhere. That’s why we’ve created
          a fun, competitive, and completely free platform where sports lovers
          from across the world can test their knowledge, showcase their
          prediction skills, and compete for exciting rewards.
        </Typography>

        <Typography paragraph>
          Every week, fans just like you get the opportunity to predict the
          outcomes of major sporting events and prove who really knows their
          game. From the roar of football stadiums to the thrill of cricket
          pitches, from basketball courts to countless other sports arenas,
          <strong> SureOdds covers it all</strong>.
        </Typography>

        {/* Features list */}
        <Typography variant="h6" gutterBottom>
          What makes SureOdds unique?
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="✅ Free to play – no cost, no risk, just pure fun." />
          </ListItem>
          <ListItem>
            <ListItemText primary="🏆 Multiple sports – football, cricket, basketball, and many more." />
          </ListItem>
          <ListItem>
            <ListItemText primary="🤝 Friendly competition – challenge your friends or go head-to-head with fans worldwide." />
          </ListItem>
          <ListItem>
            <ListItemText primary="📈 Climb the leaderboard – the more accurate your predictions, the higher you rise." />
          </ListItem>
          <ListItem>
            <ListItemText primary="🎁 Amazing prizes – because bragging rights are great, but rewards are even better!" />
          </ListItem>
        </List>

        {/* Closing statement */}
        <Typography paragraph>
          Whether you’re a casual fan looking for some extra excitement or a
          die-hard sports enthusiast ready to showcase your expertise,{" "}
          <strong>SureOdds is your arena to shine</strong>.
        </Typography>

        <Typography align="center" sx={{ fontWeight: "bold", mt: 2 }}>
          So, what are you waiting for? Join today, make your predictions, and
          let the games begin!
        </Typography>
      </Box>
      <Footer />
    </>
  );
};

export default About;
