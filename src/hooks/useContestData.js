import { useWeek } from "../context/WeekContext";
import { useMonth } from "../context/MonthContext";
import { useMemo } from "react";
import weeklyMultiSportStreakImage from "../assets/weekly-multi-sport-streak-poster.png";
import weeklyEplStreakImage from "../assets/weekly-epl-streak-poster.png";
import weekliLaligaStreakImage from "../assets/weekly-laliga-streak-poster.png";
import eplSeasonLongPickemImage from "../assets/epl-season-long-contest.png";
import laligaSeasonLongPickemImage from "../assets/laliga-season-long-contest.png";
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
        contestName: `Weekly Multi Sport Streak`,
        primaryImageUrl: weeklyMultiSportStreakImage,
        contestPrimaryPrize: "$50 Amazon Gift Card",
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
        lastcurrentContestEndDate:
          lastWeekStartEnd.endOfLastWeek.toLocaleString("en-US", {
            timeZone: "America/New_York",
          }),
        contestLeague: [
          "baseball_mlb",
          "basketball_wnba",
          "soccer_epl",
          "soccer_spain_la_liga",
        ],
        contestFormat: "Streak",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 6,
        entryFee: 0,
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
        contestName: `Weekly EPL Streak`,
        primaryImageUrl: weeklyEplStreakImage,
        contestPrimaryPrize: "$50 Amazon Gift Card",
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
        contestLeague: ["soccer_epl"],
        contestFormat: "Streak",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 6,
        entryFee: 0,
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
        contestName: `Weekly Laliga Streak`,
        primaryImageUrl: weekliLaligaStreakImage,
        contestPrimaryPrize: "$50 Amazon Gift Card",
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem3/",
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
        contestLeague: ["soccer_spain_la_liga"],
        contestFormat: "Streak",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 6,
        entryFee: 0,
        affiliates: [],
      },
      {
        contestName: `$10000 EPL Season Long Pickem`,
        primaryImageUrl: eplSeasonLongPickemImage,
        contestPrimaryPrize: 10000,
        spreadsheetUrl: "",
        isContestActive: false,
        currentContestStartDate: "08/15/2025",
        currentContestEndDate: "05/24/2026",
        lastConstestStartDate: "08/15/2024",
        lastcurrentContestEndDate: "05/24/2025",
        contestLeague: ["soccer_epl"],
        contestFormat: "Pickem",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 150,
        entryFee: 0,
        affiliates: [],
      },
      {
        contestName: `$10000 La Liga Season Long Pickem`,
        primaryImageUrl: laligaSeasonLongPickemImage,
        contestPrimaryPrize: 10000,
        spreadsheetUrl: "",
        isContestActive: false,
        currentContestStartDate: "08/15/2025",
        currentContestEndDate: "05/24/2026",
        lastConstestStartDate: "08/15/2024",
        lastcurrentContestEndDate: "05/24/2025",
        contestLeague: ["soccer_spain_la_liga"],
        contestFormat: "Pickem",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 150,
        entryFee: 0,
        affiliates: [],
      },
      {
        contestName: `$1000 Montly EPL Pickem`,
        primaryImageUrl: weeklyMultiSportStreakImage,
        contestPrimaryPrize: 1000,
        spreadsheetUrl: "",
        isContestActive: false,
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
        contestLeague: ["soccer_epl"],
        contestFormat: "Streak",
        availableMarkets: ["Moneyline"],
        availablePicks: 15,
        entryFee: 0,
        affiliates: [],
      },
    ];
  }, [weekStartEnd, lastWeekStartEnd, monthStartEnd, lastMonthStartEnd]);

  return contestData;
};
