import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import ContestDetailAndAnalytics from "./ContestDetailAndAnalytics";
import PicksForm from "./PicksForm";
import AffiliateSliders from "./AffiliateSliders";

const PostYourPicks = ({
  contestName,
  spreadsheetUrl,
  contestTotalPrize,
  contestLeague,
  contestEndDate,
  contestStartDate,
  currentUserBetsForContest,
  aggregateBets,
  availableFreePicks,
  affiliates,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          padding: isMobile ? 1 : 2,
        }}
      >
        <ContestDetailAndAnalytics
          contestName={contestName}
          spreadsheetUrl={spreadsheetUrl}
          contestTotalPrize={contestTotalPrize}
          contestLeague={contestLeague}
          contestEndDate={contestEndDate}
          contestStartDate={contestStartDate}
          currentUserBetsForContest={currentUserBetsForContest}
          aggregateBets={aggregateBets}
          availableFreePicks={availableFreePicks}
        />
        <PicksForm
          contestName={contestName}
          spreadsheetUrl={spreadsheetUrl}
          contestTotalPrize={contestTotalPrize}
          contestLeague={contestLeague}
          contestEndDate={contestEndDate}
          contestStartDate={contestStartDate}
          currentUserBetsForContest={currentUserBetsForContest}
          aggregateBets={aggregateBets}
          availableFreePicks={availableFreePicks}
        />
      </Box>
      <AffiliateSliders affiliates={affiliates} />
    </>
  );
};

export default PostYourPicks;
