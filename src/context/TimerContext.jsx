import React, { createContext, useReducer, useContext, useEffect } from "react";

const TimerContext = createContext();

const initialState = {
  timer: parseInt(localStorage.getItem("timer"), 10) || 0,
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case "SET_TIMER":
      localStorage.setItem("timer", action.payload);
      return { ...state, timer: action.payload };
    case "DECREMENT_TIMER":
      const newTimerValue = state.timer - 1;
      localStorage.setItem("timer", newTimerValue);
      return { ...state, timer: newTimerValue };
    default:
      return state;
  }
};

export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    let timerInterval;
    if (state.timer > 0) {
      timerInterval = setInterval(() => {
        dispatch({ type: "DECREMENT_TIMER" });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [state.timer]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
