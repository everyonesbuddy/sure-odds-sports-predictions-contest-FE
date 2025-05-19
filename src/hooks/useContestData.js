import { useWeek } from "../context/WeekContext";
import { useMonth } from "../context/MonthContext";
import { useMemo } from "react";
import weeklyStreakImage from "../assets/weekly-streak.jpg";
import monthlyStreakImage from "../assets/monthly-streak.jpg";

export const useContestData = () => {
  const { weekStartEnd, lastWeekStartEnd } = useWeek();
  const { monthStartEnd, lastMonthStartEnd } = useMonth();

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
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem2/",
        isContestActive: true,
        currentContestStartDate: weekStartEnd.startOfWeek.toLocaleString(
          "en-US",
          {
            timeZone: "America/New_York",
          }
        ),
        currentContestEndDate: weekStartEnd.endOfWeek.toLocaleString("en-US", {
          timeZone: "America/New_York",
        }),
        lastConstestStartDate: lastWeekStartEnd.startOfLastWeek.toLocaleString(
          "en-US",
          {
            timeZone: "America/New_York",
          }
        ),
        lastcurrentContestEndDate:
          lastWeekStartEnd.endOfLastWeek.toLocaleString("en-US", {
            timeZone: "America/New_York",
          }),
        contestLeague: [
          "basketball_nba",
          // "basketball_ncaab",
          "soccer_epl",
          "soccer_germany_bundesliga",
          "soccer_italy_serie_a",
          "soccer_spain_la_liga",
          "soccer_usa_mls",
          "icehockey_nhl",
        ],
        availableFreePicks: 20,
        affiliates: [
          {
            name: "DraftKings",
            affiliateLink: "https://www.draftkings.com/",
            message:
              "Get a $50 bonus when you make your first deposit of $5 or more.",
          },
          {
            name: "FanDuel",
            affiliateLink: "https://www.fanduel.com/",
            message:
              "Get a $50 bonus when you make your first deposit of $10 or more.",
          },
          {
            name: "BetMGM",
            affiliateLink: "https://www.betmgm.com/",
            message:
              "Get a $50 bonus when you make your first deposit of $10 or more.",
          },
        ],
      },
      {
        contestName: `Monthly Streak`,
        primaryImageUrl: monthlyStreakImage,
        contestTotalPrize: 2000,
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem1/",
        isContestActive: true,
        currentContestStartDate: monthStartEnd.startOfMonth.toLocaleString(
          "en-US",
          {
            timeZone: "America/New_York",
          }
        ),
        currentContestEndDate: monthStartEnd.endOfMonth.toLocaleString(
          "en-US",
          {
            timeZone: "America/New_York",
          }
        ),
        lastConstestStartDate:
          lastMonthStartEnd.startOfLastMonth.toLocaleString("en-US", {
            timeZone: "America/New_York",
          }),
        lastcurrentContestEndDate:
          lastMonthStartEnd.endOfLastMonth.toLocaleString("en-US", {
            timeZone: "America/New_York",
          }),
        contestLeague: [
          "basketball_nba",
          // "basketball_ncaab",
          "soccer_epl",
          "soccer_germany_bundesliga",
          "soccer_italy_serie_a",
          "soccer_spain_la_liga",
          "soccer_usa_mls",
          "icehockey_nhl",
        ],
        availableFreePicks: 35,
        affiliates: [
          {
            name: "DraftKings",
            affiliateLink: "https://www.draftkings.com/",
            message:
              "Get a $50 bonus when you make your first deposit of $5 or more.",
          },
          {
            name: "FanDuel",
            affiliateLink: "https://www.fanduel.com/",
            message:
              "Get a $50 bonus when you make your first deposit of $10 or more.",
          },
          {
            name: "BetMGM",
            affiliateLink: "https://www.betmgm.com/",
            message:
              "Get a $50 bonus when you make your first deposit of $10 or more.",
          },
        ],
      },
    ];
  }, [weekStartEnd, monthStartEnd, lastWeekStartEnd, lastMonthStartEnd]);

  return contestData;
};
