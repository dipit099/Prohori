import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdMenu, MdClose, MdNotifications, MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiFileList3Line } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import "./Navbar.css";
import Login from "../login/Login";
import Signup from "../login/Signup";
import logo from "../../assets/logo.png"; 
import { toast } from "react-toastify";

const Navbar = ({ isAuthenticated, setIsAuthenticated, user, setUser }) => {
    // Inside Navbar Component
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [authMode, setAuthMode] = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("loggedIn");
        setIsAuthenticated(false);
        setUser(null);
        toast.success("Logged out successfully!");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="Logo" className="navbar-logo" />
                <Link to="/"><span className="navbar-title">Prohori</span></Link>
            </div>

            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <MdClose size={30} color="violet"/> : <MdMenu size={30} color="violet"/>}
            </button>

            <div className={`nav-items ${menuOpen ? "open" : ""}`}>
                <Link to="/" className="nav-link"> <FaHome size={24} /> Home </Link>
                
                {isAuthenticated && isAdmin && (
                        <Link to="/admin" className="nav-link">
                            <RiFileList3Line size={24} /> Admin Dashboard
                        </Link>
                    )}

                {(
                                <Link to="/crime-report" className="nav-link"> <RiFileList3Line size={24} /> Crime Report </Link>
                )}
                

                {isAuthenticated ? (
                    <>
                        <Link to={`/profile/${user?.id}`} className="nav-link">
                            <CgProfile size={24} /> Profile
                        </Link>
                        <button className="nav-link" onClick={handleLogout}>
                            <IoMdLogOut size={24} /> Logout
                        </button>
                    </>
                ) : (
                    <button className="nav-link" onClick={() => setAuthMode("login")}>
                        <IoMdLogIn size={24} /> Login
                    </button>
                )}
            </div>

            <div className="navbar-right">
                {isAuthenticated && <MdNotifications size={24} />}
                <button className="nav-link" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <MdOutlineLightMode size={24} /> : <MdDarkMode size={24} />}
                </button>
            </div>

            {authMode === "login" && <Login onClose={() => setAuthMode(null)} onSwitch={setAuthMode} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />}
            {authMode === "signup" && <Signup onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />}
        </nav>
    );
};

export default Navbar;
