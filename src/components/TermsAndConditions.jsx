import React from "react";
import { Box, Typography, Button } from "@mui/material";

const TermsAndConditions = ({ onAccept }) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "900px",
        mx: "auto",
        my: 6,
        px: { xs: 3, sm: 4 },
        py: 4,
        backgroundColor: "#111",
        color: "white",
        borderRadius: 2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        overflowY: "auto",
        maxHeight: "80vh",
        border: "1px solid rgba(79,70,229,0.3)",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "24px", sm: "32px" },
          mb: 2,
          color: "#C7D2FE",
        }}
      >
        Terms and Conditions
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{ color: "#A5B4FC", mb: 4, fontStyle: "italic" }}
      >
        Last Updated: October 21, 2025
      </Typography>

      <Box
        sx={{
          typography: "body1",
          color: "#E5E7EB",
          lineHeight: 1.7,
          mb: 4,
          whiteSpace: "pre-line",
          fontSize: "15px",
        }}
      >
        {`
Company: Sure-Odds Limited
Website: https://sure-odds.com/

1. Acceptance of Terms
By accessing or using Sure-Odds (the “Platform”), you agree to be bound by these Terms and Conditions (“Terms”). If you do not agree, do not use the Platform.
Sure-Odds Limited (“we”, “our”, “us”) provides online, skill-based sports prediction contests available through https://sure-odds.com and related applications.

2. Eligibility
You must be at least 18 years old and a resident of Nigeria to participate.
By registering, you confirm that you meet all eligibility requirements and that the information you provide is accurate.
Employees or contractors of Sure-Odds may not participate in contests with cash prizes.

3. Nature of Contests
All contests offered on Sure-Odds are games of skill, not games of chance.
Outcomes are determined by participants’ sports knowledge, analysis, and prediction accuracy — not random luck or betting odds.
Sure-Odds does not offer or promote gambling.

Contest Types:
₦50K Free Streak Challenge — free entry, skill-based prediction contest.
₦300K High Stakes Pick’em Challenge — paid entry (₦8,000), skill-based prediction contest.

4. Contest Rules
Each contest runs for a fixed duration (typically one calendar month).
Participants may join and make predictions during the active contest period.
Predictions cannot be edited once submitted.
The leaderboard and results are determined based on scoring rules published on the Platform before each contest begins.

Entry Limits:
One account per user.
Multiple entries or attempts to manipulate results may lead to disqualification.

5. Prizes and Payouts
All prize pools are fixed and announced in advance.
Winners are determined at the end of each contest based on total correct predictions.
Payouts are made within 7 business days after results are verified.

Paid contest prizes are distributed to the top five participants using the following structure:
[35%, 25%, 20%, 12%, 8%]

Sure-Odds reserves the right to withhold or adjust prizes in case of error, fraud, or rule violation.

6. Entry Fees and Refunds
Entry fees (where applicable) must be paid before joining a contest.
Entry fees are non-refundable once a contest has started.
In the event of contest cancellation due to system failure or unforeseen issues, Sure-Odds may issue refunds or contest credits at its discretion.

7. User Accounts
Users must register with accurate and verifiable details.
You are responsible for maintaining the confidentiality of your account credentials.

Sure-Odds may suspend or terminate accounts for:
- Providing false information
- Attempting to manipulate outcomes
- Using automated tools or multiple accounts

8. Compliance and Legality
Sure-Odds operates as a skill-based competition platform, compliant with Nigerian law.
No wagering against the house.
No random chance elements or betting odds determine payouts.
Fixed prizes and performance-based outcomes ensure compliance with the National Lottery Regulatory Commission (NLRC) guidelines on skill-based competitions.

9. Intellectual Property
All trademarks, logos, and content on Sure-Odds are the property of Sure-Odds Limited.
You may not copy, modify, or redistribute any part of the Platform without our written consent.

10. Limitation of Liability
Sure-Odds is not responsible for any loss of profits, data, or indirect damages arising from use of the Platform.
Contest outcomes are final once published.
In no event shall Sure-Odds’ total liability exceed the total entry fee paid by the user during the contest in question.

11. Fair Play and Conduct
By participating, you agree not to:
- Use scripts, bots, or automated prediction tools.
- Collude or share picks to gain an unfair advantage.
- Abuse chat, comments, or social features.
Violation of fair play standards may lead to disqualification, account suspension, or permanent ban.

12. Taxes
All cash prizes are paid in Nigerian Naira (₦).
Winners are responsible for any applicable personal income taxes on prizes received.

13. Dispute Resolution
All disputes will be handled first through informal mediation with Sure-Odds’ support team.
If unresolved, disputes may be referred to arbitration in Lagos, Nigeria, in accordance with the Arbitration and Conciliation Act, Cap A18, Laws of the Federation of Nigeria.

14. Modifications
Sure-Odds may update these Terms periodically. Continued use of the Platform after updates constitutes acceptance of the revised Terms.

15. Contact Information
For questions or support, please contact:
📧 info@sure-odds.com
🌐 https://sure-odds.com
📍 Sure-Odds, Nigeria
        `}
      </Box>

      {onAccept && (
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={onAccept}
            sx={{
              background: "linear-gradient(90deg, #4F46E5, #6366F1)",
              color: "white",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: "999px",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Accept Terms
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TermsAndConditions;
