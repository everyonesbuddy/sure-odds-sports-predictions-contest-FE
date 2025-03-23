import { useWeek } from "../context/WeekContext";
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
          "https://sure-odds-backend-dd7bc18d1f18.herokuapp.com/api/v1/pickem1/",
        isContestActive: true,
        contestStartDate: weekStartEnd.startOfWeek.toLocaleString("en-US", {
          timeZone: "America/New_York",
        }),
        contestEndDate: weekStartEnd.endOfWeek.toLocaleString("en-US", {
          timeZone: "America/New_York",
        }),
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
