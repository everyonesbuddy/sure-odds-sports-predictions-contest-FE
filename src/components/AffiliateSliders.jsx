import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
  Fade,
} from "@mui/material";

const AffiliateSliders = ({ affiliates = [] }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (affiliates.length === 0) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % affiliates.length);
        setVisible(true);
      }, 300); // fade out, switch, fade in
    }, 5000);

    return () => clearInterval(interval);
  }, [affiliates.length]);

  if (affiliates.length === 0) return null;

  const currentAffiliate = affiliates[index];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#2b2b2b",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "6px 12px" : "8px 16px",
        zIndex: 1300,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <Fade in={visible} timeout={300}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            maxWidth: 600,
            width: "100%",
            justifyContent: "center",
            textAlign: "center",
            flexWrap: "wrap",
          }}
        >
          <Box
            component="img"
            src={currentAffiliate.image}
            alt={`${currentAffiliate.name} logo`}
            sx={{
              height: isMobile ? 18 : 20,
              objectFit: "contain",
              maxWidth: 80,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: isMobile ? 10 : 11,
              lineHeight: 1.4,
              maxWidth: "85%",
            }}
          >
            <strong>{currentAffiliate.name}:</strong>{" "}
            <Link
              href={currentAffiliate.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                color: "#90caf9",
                fontSize: isMobile ? 10 : 11,
              }}
            >
              {currentAffiliate.message}
            </Link>
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default AffiliateSliders;
