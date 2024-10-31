import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import PostYourPicks from "./components/PostYourPicks";
import TournamentDetails from "./components/TournamentDetails";
import PicksDetails from "./components/PicksDetails";
import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";
import PersonalizedAnalytics from "./components/PersonalizedAnalytics";

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/postYourPicks" element={<PostYourPicks />} />
        <Route path="/about" element={<TournamentDetails />} />
        <Route path="/picksDetails" element={<PicksDetails />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug/:id" element={<BlogPost />} />
        <Route
          path="/personalizedAnalytics"
          element={<PersonalizedAnalytics />}
        />
      </Routes>
    </Router>
  );
};

export default App;
