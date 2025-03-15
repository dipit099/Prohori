import React from "react";
import { Link } from "react-router-dom";
import HomeStats from "./HomeStats";
import HomeReview from "./HomeReview";
import "./Home.css";
import animationGif from "../../assets/animation.gif"; // Import the GIF properly

const Home = () => {
    return (
        <div className="home">
        {/* Backdrop Section */}
        <div className="home-backdrop">
            {/* Left Side: Overlay Content */}
            <div className="home-overlay">
                <h1>Welcome to Prohori</h1>
                <p>
                    Prohori is a crime reporting and community verification platform ensuring 
                    security and trust.<br />Join us in making our communities safer.
                </p>
                <div className="home-btn-div">
                    <Link to="/about" className="home-btn">Report A Crime</Link>
                </div>
            </div>

            {/* Right Side: GIF Background */}
            <div className="home-backdrop-overlay">
                <img src={animationGif} alt="Animation" className="background-animation" />
            
              {/* <Lottie animationData={animationData} className="background-animation" loop={true} /> */}
            </div>
        </div>

        {/* Statistics Section */}
        <HomeStats />

        {/* Reviews Section */}
        <HomeReview />
        </div>
    );
};

export default Home;
