import React, { createContext, useState, useEffect, useContext } from "react";
import moment from "moment-timezone";

const WeekContext = createContext();

const getWeekNumber = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const getWeekStartEnd = (date) => {
  const dayOfWeek = date.getDay(); // Get the current day of the week (0-6)
  const startOfWeek = moment
    .tz(date, "America/New_York")
    .startOf("day")
    .subtract(dayOfWeek, "days");
  const endOfWeek = moment
    .tz(startOfWeek, "America/New_York")
    .add(6, "days")
    .endOf("day");
  return {
    startOfWeek: startOfWeek.toDate(),
    endOfWeek: endOfWeek.toDate(),
  };
};

const getLastWeekStartEnd = (date) => {
  const startOfThisWeek = moment
    .tz(date, "America/New_York")
    .startOf("day")
    .subtract(date.getDay(), "days");
  const startOfLastWeek = moment
    .tz(startOfThisWeek, "America/New_York")
    .subtract(7, "days");
  const endOfLastWeek = moment
    .tz(startOfLastWeek, "America/New_York")
    .add(6, "days")
    .endOf("day");
  return {
    startOfLastWeek: startOfLastWeek.toDate(),
    endOfLastWeek: endOfLastWeek.toDate(),
  };
};

export const WeekProvider = ({ children }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weekStartEnd, setWeekStartEnd] = useState({
    startOfWeek: null,
    endOfWeek: null,
  });
  const [lastWeekStartEnd, setLastWeekStartEnd] = useState({
    startOfLastWeek: null,
    endOfLastWeek: null,
  });

  useEffect(() => {
    const today = new Date();
    const weekNumber = getWeekNumber(today);
    setCurrentWeek(weekNumber);
    setWeekStartEnd(getWeekStartEnd(today));
    setLastWeekStartEnd(getLastWeekStartEnd(today));
  }, []);

  return (
    <WeekContext.Provider
      value={{ currentWeek, weekStartEnd, lastWeekStartEnd }}
    >
      {children}
    </WeekContext.Provider>
  );
};

export const useWeek = () => useContext(WeekContext);
