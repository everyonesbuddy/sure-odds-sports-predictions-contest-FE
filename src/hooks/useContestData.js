import { useWeek } from "../context/WeekContext";
import { useMonth } from "../context/MonthContext";
import { useMemo } from "react";
import weeklyStreakImage from "../assets/weekly-streak.jpg";
import monthlyStreakImage from "../assets/monthly-streak.jpg";
import doinkLogo from "../assets/doink-logo.png";
import oddsJamLogo from "../assets/oddsjam-logo.png";
import dgFantasyLogo from "../assets/dgfantasy-logo.png";

export const useContestData = () => {
  const { weekStartEnd, lastWeekStartEnd } = useWeek();
  const { monthStartEnd, lastMonthStartEnd } = useMonth();

  const contestData = useMemo(() => {
    if (!weekStartEnd.startOfWeek || !weekStartEnd.endOfWeek) {
      return [];
    }

    return [
      {
        contestName: `Weekly Pickem`,
        primaryImageUrl: weeklyStreakImage,
        contestTotalPrize: 100,
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
          "basketball_wnba",
          "soccer_epl",
          "soccer_germany_bundesliga",
          "soccer_italy_serie_a",
          "soccer_spain_la_liga",
          "soccer_usa_mls",
          "icehockey_nhl",
        ],
        contestType: "Streak",
        availableFreePicks: 5,
        affiliates: [
          {
            name: "Doink Sports",
            affiliateLink: "https://doinksports.com/?via=Sure-Odds",
            message: "The most complete betting research platform.",
            image: doinkLogo,
          },
          {
            name: "OddsJam",
            affiliateLink: "https://oddsjam.com/?ref=ndqznjv",
            message: "Premium sports betting news + data.",
            image: oddsJamLogo,
          },
          {
            name: "DGFantasy",
            affiliateLink:
              "https://dgfantasy.com/membership-signup?ref=mjkwmti",
            message: "Profitable bets at your fingertips! ",
            image: dgFantasyLogo,
          },
        ],
      },
      {
        contestName: `Monthly Streak`,
        primaryImageUrl: monthlyStreakImage,
        contestTotalPrize: 500,
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
          "basketball_wnba",
          // "basketball_ncaab",
          "soccer_epl",
          "soccer_germany_bundesliga",
          "soccer_italy_serie_a",
          "soccer_spain_la_liga",
          "soccer_usa_mls",
          "icehockey_nhl",
        ],
        contestType: "Streak",
        availableFreePicks: 15,
        affiliates: [
          {
            name: "Doink Sports",
            affiliateLink: "https://doinksports.com/?via=Sure-Odds",
            message: "The most complete betting research platform.",
            image: doinkLogo,
          },
          {
            name: "OddsJam",
            affiliateLink: "https://oddsjam.com/?ref=ndqznjv",
            message: "Premium sports betting news + data.",
            image: oddsJamLogo,
          },
          {
            name: "DGFantasy",
            affiliateLink:
              "https://dgfantasy.com/membership-signup?ref=mjkwmti",
            message: "Profitable bets at your fingertips! ",
            image: dgFantasyLogo,
          },
        ],
      },
    ];
  }, [weekStartEnd, monthStartEnd, lastWeekStartEnd, lastMonthStartEnd]);

  return contestData;
};
