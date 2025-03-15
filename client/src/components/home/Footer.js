import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Import styles

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <h2>Prohori</h2>
                    <p>
    Prohori is a crime reporting and community verification platform ensuring security and trust.  
    Our mission is to empower individuals by providing a seamless and secure way to report crimes,  
    verify information, and strengthen community safety.
    </p>
    <p>
    Join us in making a difference—because safety starts with awareness.
</p>

                </div>
                <div className="footer-right">
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/crime-feed">Crime Feed</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
