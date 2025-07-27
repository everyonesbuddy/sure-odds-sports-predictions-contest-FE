import { useWeek } from "../context/WeekContext";
import { useMonth } from "../context/MonthContext";
import { useMemo } from "react";
import wnbaStreakImage from "../assets/wnba-streak.png";
import mlbStreakImage from "../assets/mlb-streak.png";
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
        contestName: `Weekly WNBA Streak`,
        primaryImageUrl: wnbaStreakImage,
        contestPrimaryPrize: 100,
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
        contestLeague: ["basketball_wnba"],
        contestFormat: "Streak",
        availableMarkets: ["Spread"],
        availablePicks: 5,
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
        contestName: `Weekly MLB Streak`,
        primaryImageUrl: mlbStreakImage,
        contestPrimaryPrize: 100,
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
        contestLeague: ["baseball_mlb"],
        contestFormat: "Streak",
        availableMarkets: ["Spread"],
        availablePicks: 5,
        entryFee: 4.99,
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
        contestName: `Monthly MLB Pickem`,
        primaryImageUrl: mlbStreakImage,
        contestPrimaryPrize: 500,
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem3/",
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
        contestLeague: ["baseball_mlb"],
        contestFormat: "Pickem",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 5,
        entryFee: 4.99,
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
  }, [weekStartEnd, lastWeekStartEnd, monthStartEnd, lastMonthStartEnd]);

  return contestData;
};
