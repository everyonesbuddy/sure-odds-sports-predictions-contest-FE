import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import Footer from "./Footer";
import "../css/Home.css";

const B2bLandingPage = () => {
  return (
    <>
      {/* HERO */}
      <Box
        sx={{
          width: "100vw",
          maxWidth: "100%",
          overflowX: "hidden",
          textAlign: "center",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 6, sm: 10 },
          px: 2,
          background: "black",
        }}
      >
        <Box sx={{ maxWidth: "800px", width: "100%", gap: 3 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "32px", sm: "44px", md: "52px" },
              lineHeight: 1.2,
            }}
          >
            🎯 Your Own Branded Pick'em Contest — We Build It, You Earn From It
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "16px", sm: "20px" },
              opacity: 0.85,
              mt: 2,
              mb: 4,
            }}
          >
            We create and manage your fully branded sports contest site. You
            promote it to your fans. You earn every time they enter. 💸
          </Typography>
          <a
            href="https://calendly.com/sure-odds-info/30min"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book a Demo on Calendly"
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4F46E5",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "12px",
                px: 5,
                py: 1.75,
                fontSize: "16px",
                "&:hover": { backgroundColor: "#4338CA" },
              }}
            >
              🚀 Book a Demo
            </Button>
          </a>
        </Box>
      </Box>

      {/* FEATURES */}
      <Box sx={{ background: "#0f0f0f", py: 8, px: 3, color: "white" }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" fontWeight={600} mb={5}>
            Why Creators Love It ❤️
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                emoji: "🧑‍🎨",
                title: "Fully Branded Site",
                desc: "Your logo, colors, and domain — we make it yours from top to bottom.",
              },
              {
                emoji: "💰",
                title: "You Set the Prize Pool. You Keep the Rest.",
                desc: "Charge what you want. Offer prizes you want. You keep the margin.",
              },
              {
                emoji: "📈",
                title: "Boost Fan Engagement",
                desc: "Give your fans a fun, competitive reason to keep coming back.",
              },
              {
                emoji: "✅",
                title: "We Handle Everything",
                desc: "You focus on your audience — we run the tech, handle payments, run scoring, and support your players.",
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box textAlign="center" px={2}>
                  <Typography variant="h3" fontSize="36px">
                    {item.emoji}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} mt={1}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" mt={1} sx={{ opacity: 0.8 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box sx={{ py: 8, px: 3, background: "#1c1c1c", color: "white" }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" fontWeight={600} mb={5}>
            How It Works 🛠️
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                step: "Step 1",
                emoji: "📞",
                title: "Book a Demo",
                desc: "Schedule a quick call so we can understand your brand and goals.",
              },
              {
                step: "Step 2",
                emoji: "🧱",
                title: "We Build Your Site",
                desc: "We fully design and launch your contest site with your branding.",
              },
              {
                step: "Step 3",
                emoji: "📣",
                title: "Promote & Earn",
                desc: "You share the link with your fans — and collect your earnings.",
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Card
                  sx={{
                    backgroundColor: "#2a2a2a",
                    color: "white",
                    borderRadius: "16px",
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" fontSize="28px">
                      {item.emoji}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 1, opacity: 0.6 }}
                    >
                      {item.step}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, opacity: 0.8, fontSize: "15px" }}
                    >
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* EARNINGS CALCULATOR (Static) */}
      <Box sx={{ py: 8, backgroundColor: "#111", color: "white" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" fontWeight={600} mb={4}>
            What Could You Earn? 💸
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                entries: 50,
                entryFee: 50,
                payoutPercent: 0.7,
              },
              {
                entries: 200,
                entryFee: 50,
                payoutPercent: 0.7,
              },
              {
                entries: 500,
                entryFee: 50,
                payoutPercent: 0.7,
              },
            ].map((row, idx) => {
              const totalCollected = row.entries * row.entryFee;
              const platformFee = totalCollected * 0.1;
              const prizePool = totalCollected * row.payoutPercent;
              const creatorProfit = totalCollected - platformFee - prizePool;

              return (
                <Grid item xs={12} key={idx}>
                  <Box
                    sx={{
                      p: 3,
                      border: "1px solid #333",
                      borderRadius: "12px",
                      textAlign: "center",
                      backgroundColor: "#1a1a1a",
                    }}
                  >
                    <Typography variant="h6">
                      {row.entries} entries/week
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                      Entry Fee: <strong>${row.entryFee}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                      Prize Pool (70%):{" "}
                      <strong>${prizePool.toLocaleString()}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                      Platform Fee (10%):{" "}
                      <strong>${platformFee.toLocaleString()}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, fontWeight: 600 }}>
                      Est. Profit:{" "}
                      <strong>${creatorProfit.toLocaleString()}/week</strong>
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* TESTIMONIALS */}
      {/* <Box sx={{ py: 8, background: "#0f0f0f", color: "white" }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" fontWeight={600} mb={5}>
            What Creators Are Saying 💬
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                name: "@SharpPicksOnly",
                quote:
                  "I made $1,200 in my first month and didn’t lift a finger. Fans love it — I just post the link.",
              },
              {
                name: "@BettingBryan",
                quote:
                  "Super easy setup. The site looks legit and it’s completely hands-off. Total win.",
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box
                  sx={{
                    backgroundColor: "#1f1f1f",
                    p: 3,
                    borderRadius: "12px",
                    height: "100%",
                  }}
                >
                  <Typography variant="body1" fontStyle="italic">
                    “{item.quote}”
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 2, opacity: 0.7, fontWeight: 600 }}
                  >
                    – {item.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}

      {/* FINAL CTA */}
      <Box
        sx={{
          py: 8,
          background: "#4F46E5",
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700}>
            Ready to Start Earning from Your Fans?
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 4, opacity: 0.9 }}>
            Let us build your branded contest site in days — not weeks.
          </Typography>
          <a
            href="https://calendly.com/sure-odds-info/30min"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book Your Demo on Calendly"
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "white",
                color: "#4F46E5",
                fontWeight: 700,
                borderRadius: "12px",
                px: 5,
                py: 1.75,
                "&:hover": {
                  backgroundColor: "#e5e5ff",
                },
              }}
            >
              🚀 Book Your Demo
            </Button>
          </a>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default B2bLandingPage;
