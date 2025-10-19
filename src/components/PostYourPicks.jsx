import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PicksForm from "./PicksForm";
// import ContestInfo from "./ContestInfo";

const PostYourPicks = ({
  contestName,
  spreadsheetUrl,
  contestPrimaryPrize,
  contestLeague,
  contestEndDate,
  contestStartDate,
  currentUserBetsForContest,
  aggregateBets,
  availablePicks,
  affiliates,
  contestFormat,
  availableMarkets,
  entryFee,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box
        sx={{
          maxWidth: 900, // limit width for readability
          width: "100%", // full width on mobile
          margin: "auto", // center horizontally
          py: isMobile ? 2 : 4, // vertical padding
          px: isMobile ? 1 : 2, // horizontal padding for mobile
        }}
      >
        <PicksForm
          contestName={contestName}
          spreadsheetUrl={spreadsheetUrl}
          contestPrimaryPrize={contestPrimaryPrize}
          contestLeague={contestLeague}
          contestEndDate={contestEndDate}
          contestStartDate={contestStartDate}
          currentUserBetsForContest={currentUserBetsForContest}
          aggregateBets={aggregateBets}
          availablePicks={availablePicks}
          availableMarkets={availableMarkets}
        />
      </Box>
    </>
  );
};

export default PostYourPicks;
