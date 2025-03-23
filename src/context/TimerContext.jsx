import React, { createContext, useReducer, useContext, useEffect } from "react";

// Create context
const TimerContext = createContext();

// Initialize from localStorage safely
const storedTimers = JSON.parse(localStorage.getItem("timers")) || {};
const cleanTimers = Object.fromEntries(
  Object.entries(storedTimers).filter(
    ([_, val]) => typeof val === "number" && val >= 0
  )
);

const initialState = {
  timers: cleanTimers,
};

// Reducer function
const timerReducer = (state, action) => {
  const updatedTimers = { ...state.timers };

  switch (action.type) {
    case "SET_TIMER":
      updatedTimers[action.payload.contestName] = action.payload.timer;
      localStorage.setItem("timers", JSON.stringify(updatedTimers));
      return { timers: updatedTimers };

    case "DECREMENT_TIMER":
      const currentTime = updatedTimers[action.payload.contestName];
      if (currentTime > 0) {
        updatedTimers[action.payload.contestName] = currentTime - 1;
        localStorage.setItem("timers", JSON.stringify(updatedTimers));
      }
      return { timers: updatedTimers };

    case "RESET_TIMER":
      delete updatedTimers[action.payload.contestName];
      localStorage.setItem("timers", JSON.stringify(updatedTimers));
      return { timers: updatedTimers };

    default:
      return state;
  }
};

// Provider component
export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    const intervalMap = {};

    Object.entries(state.timers).forEach(([contest, time]) => {
      if (time > 0) {
        intervalMap[contest] = setInterval(() => {
          dispatch({
            type: "DECREMENT_TIMER",
            payload: { contestName: contest },
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(intervalMap).forEach(clearInterval);
    };
  }, [state.timers]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use timer
export const useTimer = () => useContext(TimerContext);
