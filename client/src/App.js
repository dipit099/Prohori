import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/home/Footer";
import Home from "./components/home/Home";
import CrimeFeed from "./components/feed/CrimeFeed";
import Profile from "./components/profile/Profile";
import "./App.css";
import Admin from "./components/admin/Admin";

function App() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedUser);

  return (
    <div className="app">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} user={user} setUser={setUser} />
      {/* <div className="content"> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crime-report" element={<CrimeFeed />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      {/* </div> */}
      <Footer />
    </div>
  );
}

export default App;
