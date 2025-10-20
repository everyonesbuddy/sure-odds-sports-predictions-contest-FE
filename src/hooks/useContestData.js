import { useWeek } from "../context/WeekContext";
import { useMonth } from "../context/MonthContext";
import { useMemo } from "react";
import weeklyMultiSportStreakImage from "../assets/weekly-multi-sport-streak-poster.png";
import monthlyMultiSportStreakImage from "../assets/monthly-multi-sport-streak-poster.png";
// import eplSeasonLongPickemImage from "../assets/epl-season-long-contest.png";
// import doinkLogo from "../assets/doink-logo.png";
// import oddsJamLogo from "../assets/oddsjam-logo.png";
// import dgFantasyLogo from "../assets/dgfantasy-logo.png";

export const useContestData = () => {
  const { weekStartEnd, lastWeekStartEnd } = useWeek();
  const { monthStartEnd, lastMonthStartEnd } = useMonth();

  const contestData = useMemo(() => {
    if (!weekStartEnd.startOfWeek || !weekStartEnd.endOfWeek) {
      return [];
    }

    // const listOfAffiliates = [
    //   {
    //     name: "Doink Sports",
    //     affiliateLink: "https://doinksports.com/?via=Sure-Odds",
    //     message: "The most complete betting research platform.",

    //     image: doinkLogo,
    //   },
    //   {
    //     name: "OddsJam",
    //     affiliateLink: "https://oddsjam.com/?ref=ndqznjv",
    //     message: "Premium sports betting news + data.",
    //     image: oddsJamLogo,
    //   },
    //   {
    //     name: "DGFantasy",
    //     affiliateLink: "https://dgfantasy.com/membership-signup?ref=mjkwmti",
    //     message: "Profitable bets at your fingertips! ",
    //     image: dgFantasyLogo,
    //   },
    // ];

    return [
      {
        contestName: `₦50K Free Streak Challenge`,
        primaryImageUrl: weeklyMultiSportStreakImage,
        contestPrimaryPrize: "₦50000 Cash Prize",
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem1/",
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
        lastContestEndDate: lastWeekStartEnd.endOfLastWeek.toLocaleString(
          "en-US",
          {
            timeZone: "America/New_York",
          }
        ),
        contestLeague: [
          // "basketball_nba",
          // "basketball_wnba",
          "soccer_epl",
          "soccer_spain_la_liga",
          "americanfootball_nfl",
        ],
        contestFormat: "Streak",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 8,
        entryFee: 0,
        affiliates: [],
      },
      // {
      //   contestName: `Season Long EPL Pickem`,
      //   primaryImageUrl: eplSeasonLongPickemImage,
      //   contestPrimaryPrize: "$1000 Cash Prize",
      //   spreadsheetUrl:
      //     "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem2/",
      //   isContestActive: false,
      //   currentContestStartDate: "08/15/2025",
      //   currentContestEndDate: "05/24/2026",
      //   lastConstestStartDate: "08/15/2024",
      //   lastContestEndDate: "05/24/2025",
      //   contestLeague: ["soccer_epl"],
      //   contestFormat: "Pickem",
      //   availableMarkets: ["Spread", "Moneyline"],
      //   availablePicks: 120,
      //   entryFee: 8000,
      //   affiliates: [],
      // },
      {
        contestName: `₦300K High Stakes Pick’em Challenge`,
        primaryImageUrl: monthlyMultiSportStreakImage,
        contestPrimaryPrize: "₦300000 Cash Prize",
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem2/",
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
        lastContestEndDate: lastMonthStartEnd.endOfLastMonth.toLocaleString(
          "en-US",
          {
            timeZone: "America/New_York",
          }
        ),
        contestLeague: [
          // "basketball_nba",
          // "basketball_wnba",
          "soccer_epl",
          "soccer_spain_la_liga",
          "americanfootball_nfl",
        ],
        contestFormat: "Pickem",
        availableMarkets: ["Moneyline"],
        availablePicks: 30,
        entryFee: 8000,
        affiliates: [],
      },
    ];
  }, [weekStartEnd, lastWeekStartEnd, monthStartEnd, lastMonthStartEnd]);

  return contestData;
};
