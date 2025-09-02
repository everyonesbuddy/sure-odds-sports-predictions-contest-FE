import React from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import Footer from "./Footer";

const About = () => {
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
                secondary="Welcome to SureOdds – The #1 Free To Play Pick’em and Streak Contest Platform!
                          SureOdds brings together sports fans from all across the continent to compete, test their game knowledge, and win amazing prizes.

                          Whether you’re passionate about football, cricket, basketball, or more, SureOdds gives you the chance to predict game outcomes, challenge your friends, and climb the leaderboard.

                          Our mission is simple: make sports more thrilling by turning your predictions into real competition. From weekend warriors to die-hard fans, there's something for everyone.

                          Join today. Make your picks. Start your streak. Become a champion."
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

export default About;
