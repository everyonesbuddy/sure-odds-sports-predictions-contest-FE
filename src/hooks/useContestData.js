import { useWeek } from "../context/WeekContest";
import { useMemo } from "react";

export const useContestData = () => {
  const { weekStartEnd } = useWeek();

  const contestData = useMemo(() => {
    if (!weekStartEnd.startOfWeek || !weekStartEnd.endOfWeek) {
      return [];
    }

    return [
      {
        contestName: `NBA Weekly Pick'em`,
        primaryImageUrl:
          "https://i.ibb.co/Y4kkDNcf/Orange-and-Yellow-Illustrative-Sport-Trivia-Quiz-Presentation.png",
        firstPlacePrize: "$60 USD",
        secondPlacePrize: "$25 USD",
        thirdPlacePrize: "$15 USD",
        spreadsheetUrl:
          "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
        sponsored: false,
        contestStartDate: weekStartEnd.startOfWeek.toLocaleDateString(),
        contestEndDate: weekStartEnd.endOfWeek.toLocaleDateString(),
        contestLeague: [
          "basketball_nba",
          "basketball_ncaab",
          "soccer_epl",
          "soccer_germany_bundesliga",
          "soccer_italy_serie_a",
          "soccer_spain_la_liga",
          "soccer_usa_mls",
          "icehockey_nhl",
        ],
        availableFreePicks: 2,
      },
    ];
  }, [weekStartEnd]);

  return contestData;
};
