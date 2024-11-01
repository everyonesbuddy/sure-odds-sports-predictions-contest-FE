import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "auto",
        textAlign: "center",
        p: 3,
        mt: 5,
        // backgroundColor: '#f5f5f5',
        // position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        overflowX: "hidden",
      }}
    >
      <Typography variant="body1" sx={{ mb: 2 }}>
        <Link href="/" sx={{ mx: 1 }}>
          Home
        </Link>
        <Link href="/about" sx={{ mx: 1 }}>
          About
        </Link>
        <Link href="/blogs" sx={{ mx: 1 }}>
          Blog
        </Link>
        <Link href="/personalizedAnalytics" sx={{ mx: 1 }}>
          Personalized Analytics
        </Link>
        <Link href="https://x.com/sure_odds2023" target="_blank" sx={{ mx: 1 }}>
          Twitter
        </Link>
      </Typography>
      <Typography variant="body2" color="white">
        &copy; {new Date().getFullYear()} SureOdds. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
