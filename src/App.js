import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PersonalizedAnalytics from "./components/PersonalizedAnalytics";
import Contest from "./components/Contest";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Demo from "./components/Demo";
import Leaderboard from "./components/Leaderboard";
import PostYourPicks from "./components/PostYourPicks";
import About from "./components/About";
import TermsAndConditions from "./components/TermsAndConditions";
import Nav from "./components/Nav";
import B2bLandingPage from "./components/B2bLandingPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancelled from "./components/PaymentCancelled";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { TimerProvider } from "./context/TimerContext";
import { WeekProvider } from "./context/WeekContext";
import { MonthProvider } from "./context/MonthContext";

const App = () => {
  return (
    <WeekProvider>
      <MonthProvider>
        <TimerProvider>
          <Router>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancelled" element={<PaymentCancelled />} />
              <Route
                path="/leaderboard"
                element={<PrivateRoute element={Leaderboard} />}
              />
              <Route path="/b2b" element={<B2bLandingPage />} />
              <Route
                path="/postYourPicks"
                element={<PrivateRoute element={PostYourPicks} />}
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/personalizedAnalytics"
                element={<PrivateRoute element={PersonalizedAnalytics} />}
              />
              <Route
                path="/contest/:contestName"
                element={<PrivateRoute element={Contest} />}
              />
            </Routes>
            <ToastContainer />
          </Router>
        </TimerProvider>
      </MonthProvider>
    </WeekProvider>
  );
};

export default App;
