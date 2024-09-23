import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import PostYourPicks from "./components/PostYourPicks";
import TournamentDetails from "./components/TournamentDetails";
import PicksOfTheDay from "./components/PicksOfTheDay";

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/postYourPicks" element={<PostYourPicks />} />
        <Route path="/about" element={<TournamentDetails />} />
        <Route path="/picksOfTheDay" element={<PicksOfTheDay />} />
      </Routes>
    </Router>
  );
};

export default App;
