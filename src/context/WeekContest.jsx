import React, { createContext, useState, useEffect, useContext } from "react";

const WeekContext = createContext();

const getWeekNumber = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const getWeekStartEnd = (date) => {
  const dayOfWeek = date.getDay(); // Get the current day of the week (0-6)
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek); // Set to the start of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the end of the week (Saturday)
  return { startOfWeek, endOfWeek };
};

export const WeekProvider = ({ children }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weekStartEnd, setWeekStartEnd] = useState({
    startOfWeek: null,
    endOfWeek: null,
  });

  useEffect(() => {
    const today = new Date();
    const weekNumber = getWeekNumber(today);
    setCurrentWeek(weekNumber);
    setWeekStartEnd(getWeekStartEnd(today));
  }, []);

  return (
    <WeekContext.Provider value={{ currentWeek, weekStartEnd }}>
      {children}
    </WeekContext.Provider>
  );
};

export const useWeek = () => useContext(WeekContext);
