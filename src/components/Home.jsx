import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
// import Footer from "./Footer";

const benefits = [
  {
    title: "Engage Sports Fans",
    description:
      "Create fun, skill-based prediction contests to captivate your audience and keep them coming back. " +
      "With interactive features, fans feel involved and return often, increasing retention and overall engagement. " +
      "Our platform allows you to track participation and provide instant feedback, keeping your audience excited.",
  },
  {
    title: "Generate Leads",
    description:
      "Collect actionable audience data while offering exciting prizes and gamified experiences. " +
      "Gain insights into user preferences, demographics, and behaviors. " +
      "Easily integrate the collected leads into your CRM or email marketing system to grow your business efficiently.",
  },
  {
    title: "Boost Your Brand",
    description:
      "Increase brand awareness and loyalty with hands-on, fully managed contests tailored for sports brands. " +
      "Promote your brand in a fun, interactive way that resonates with your audience. " +
      "Strengthen your brand identity by creating memorable experiences fans will share across social media.",
  },
];

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 6, sm: 12 },
          px: { xs: 2, sm: 4 },
          background: "black",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-25%",
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: "300px", md: "600px" },
            height: { xs: "300px", md: "600px" },
            background:
              "radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(0,0,0,0) 70%)",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: "900px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "28px", sm: "40px", md: "48px" },
              lineHeight: 1.2,
            }}
          >
            Engage Sports Fans, Generate Leads, Boost Your Brand
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "16px", sm: "20px" },
              opacity: 0.8,
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            Sure-Odds helps sports brands, influencers, and content creators run
            skill-based prediction contests that grow audiences, collect leads,
            and increase engagement.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: "#4F46E5",
              color: "white",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              fontSize: { xs: "14px", sm: "16px" },
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#6366F1" },
            }}
          >
            Request a Demo
          </Button>
        </Box>
      </Box>

      {/* BENEFITS SECTION */}
      <Box
        sx={{
          background: "#0f0f0f",
          py: { xs: 6, sm: 10 },
          px: { xs: 2, sm: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "24px", sm: "32px" },
            color: "white",
            mb: 5,
          }}
        >
          Why Sports Brands Choose Sure-Odds
        </Typography>

        <Grid
          container
          spacing={{ xs: 4, sm: 6 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {benefits.map((item, idx) => (
            <Grid
              item
              key={idx}
              xs={12}
              sm={4}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  background: "#1f1f1f",
                  borderRadius: 3,
                  p: { xs: 4, sm: 6 },
                  width: "100%",
                  maxWidth: 400, // bigger cards
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#4F46E5",
                    textAlign: "center",
                    fontSize: { xs: "18px", sm: "20px" },
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: "#ccc",
                    textAlign: "center",
                    lineHeight: 1.7,
                    fontSize: { xs: "14px", sm: "16px" },
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA SECTION */}
      <Box
        sx={{
          background: "black",
          py: { xs: 6, sm: 10 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "white",
            mb: 3,
            fontSize: { xs: "20px", sm: "28px" },
          }}
        >
          Ready to Grow Your Sports Brand?
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4F46E5",
            color: "white",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            fontSize: { xs: "14px", sm: "16px" },
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#6366F1" },
          }}
        >
          Request a Demo
        </Button>
      </Box>

      {/* <Footer /> */}
    </>
  );
};

export default Home;
