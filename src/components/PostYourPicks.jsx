import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import ContestDetails from "./ContestDetails";
import PicksForm from "./PicksForm";

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
        <ContestDetails
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
    </>
  );
};

export default PostYourPicks;
