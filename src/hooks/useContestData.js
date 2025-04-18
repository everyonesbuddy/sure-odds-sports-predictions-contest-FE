import { useWeek } from "../context/WeekContext";
import { useMonth } from "../context/MonthContext";
import { useMemo } from "react";
import weeklyStreakImage from "../assets/weekly-streak.jpg";
import monthlyStreakImage from "../assets/monthly-streak.jpg";

export const useContestData = () => {
  const { weekStartEnd } = useWeek();
  const { monthStartEnd } = useMonth();

  const contestData = useMemo(() => {
    if (!weekStartEnd.startOfWeek || !weekStartEnd.endOfWeek) {
      return [];
    }

    return [
      {
        contestName: `Weekly Streak`,
        primaryImageUrl: weeklyStreakImage,
        contestTotalPrize: 500,
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem1/",
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
      {
        contestName: `Monthly Streak`,
        primaryImageUrl: monthlyStreakImage,
        contestTotalPrize: 2000,
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem2/",
        isContestActive: true,
        contestStartDate: monthStartEnd.startOfMonth.toLocaleString("en-US", {
          timeZone: "America/New_York",
        }),
        contestEndDate: monthStartEnd.endOfMonth.toLocaleString("en-US", {
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
        availableFreePicks: 5,
      },
    ];
  }, [weekStartEnd, monthStartEnd]);

  return contestData;
};
