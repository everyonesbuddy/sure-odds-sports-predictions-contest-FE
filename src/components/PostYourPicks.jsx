import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PicksForm from "./PicksForm";
import ContestInfo from "./ContestInfo";
import AffiliateSliders from "./AffiliateSliders";

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
        <ContestInfo
          contestName={contestName}
          spreadsheetUrl={spreadsheetUrl}
          contestPrimaryPrize={contestPrimaryPrize}
          contestLeague={contestLeague}
          contestEndDate={contestEndDate}
          contestStartDate={contestStartDate}
          currentUserBetsForContest={currentUserBetsForContest}
          aggregateBets={aggregateBets}
          availablePicks={availablePicks}
          contestFormat={contestFormat}
        />
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
      <AffiliateSliders affiliates={affiliates} />
    </>
  );
};

export default PostYourPicks;
