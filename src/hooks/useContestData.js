import { useWeek } from "../context/WeekContext";
import { useMonth } from "../context/MonthContext";
import { useMemo } from "react";
import soccerMonthlyPickemImage from "../assets/soccer-monthly-pickem-poster.png";
import basketballMonthlyPickemImage from "../assets/basketball-monthly-pickem-poster.png";
import multiSportsWeeklyStreakImage from "../assets/multi-sports-weeakly-streak-poster.png";

export const useContestData = () => {
  const { weekStartEnd, lastWeekStartEnd } = useWeek();
  const { monthStartEnd, lastMonthStartEnd } = useMonth();

  const contestData = useMemo(() => {
    if (!weekStartEnd.startOfWeek || !weekStartEnd.endOfWeek) {
      return [];
    }

    return [
      {
        contestName: `$50 Weekly Multi Sport Streak`,
        primaryImageUrl: multiSportsWeeklyStreakImage,
        contestPrimaryPrize: 50,
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem1/",
        isContestActive: false,
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
        contestLeague: ["baseball_mlb", "basketball_wnba", "soccer_epl"],
        contestFormat: "Streak",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 15,
        entryFee: 0,
        affiliates: [],
      },
      {
        contestName: `$100 Monthly Basketball Pickem`,
        primaryImageUrl: basketballMonthlyPickemImage,
        contestPrimaryPrize: 100,
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
        lastcurrentContestEndDate:
          lastMonthStartEnd.endOfLastMonth.toLocaleString("en-US", {
            timeZone: "America/New_York",
          }),
        contestLeague: ["basketball_wnba"],
        contestFormat: "Pickem",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 35,
        entryFee: 4.99,
        affiliates: [],
      },
      {
        contestName: `$100 Monthly Soccer Pickem`,
        primaryImageUrl: soccerMonthlyPickemImage,
        contestPrimaryPrize: 100,
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem3/",
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
        contestLeague: ["soccer_epl", "soccer_spain_la_liga", "soccer_usa_mls"],
        contestFormat: "Pickem",
        availableMarkets: ["Spread", "Moneyline"],
        availablePicks: 35,
        entryFee: 4.99,
        affiliates: [],
      },
      {
        contestName: `$1000 Montly EPL Pickem`,
        primaryImageUrl: soccerMonthlyPickemImage,
        contestPrimaryPrize: 1000,
        spreadsheetUrl:
          "https://sure-odds-be-482948f2bda5.herokuapp.com/api/v1/pickem4/",
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
        availablePicks: 5,
        entryFee: 4.99,
        affiliates: [],
      },
    ];
  }, [weekStartEnd, lastWeekStartEnd, monthStartEnd, lastMonthStartEnd]);

  return contestData;
};
