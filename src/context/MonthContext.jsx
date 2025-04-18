import React, { createContext, useState, useEffect, useContext } from "react";
import moment from "moment-timezone";

const MonthContext = createContext();

const getMonthStartEnd = (date) => {
  const startOfMonth = moment.tz(date, "America/New_York").startOf("month");
  const endOfMonth = moment.tz(date, "America/New_York").endOf("month");
  return {
    startOfMonth: startOfMonth.toDate(),
    endOfMonth: endOfMonth.toDate(),
  };
};

export const MonthProvider = ({ children }) => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [monthStartEnd, setMonthStartEnd] = useState({
    startOfMonth: null,
    endOfMonth: null,
  });

  useEffect(() => {
    const today = new Date();
    const monthNumber = today.getMonth() + 1; // Months are 0-indexed, so add 1
    setCurrentMonth(monthNumber);
    setMonthStartEnd(getMonthStartEnd(today));
  }, []);

  return (
    <MonthContext.Provider value={{ currentMonth, monthStartEnd }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => useContext(MonthContext);
