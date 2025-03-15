import React, { useState } from "react";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../config/endpoints"; 
import { useNavigate } from "react-router-dom"; // For redirection
import "react-toastify/dist/ReactToastify.css";
import "./AuthModal.css";

const Login = ({ onClose, onSwitch, setIsAuthenticated, setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); // Default role: User
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // React Router redirection

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Logging in as:", role);
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem("accessToken", data.tokens.accessToken);
                localStorage.setItem("refreshToken", data.tokens.refreshToken);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("loggedIn", true);

                // Determine if the logged-in user is an admin
                const isAdmin = role === "admin"; // Checking if the selected role is "admin"
                localStorage.setItem("isAdmin", isAdmin); // Store role in local storage

                setIsAuthenticated(true);
                setUser(data.user);

                toast.success(`Login successful as ${role}!`);

                // Redirect based on role
                if (isAdmin) {
                    setTimeout(() => {
                        navigate("/admin"); // Redirect to Admin dashboard
                    }, 1000);
                } else {
                    setTimeout(() => {
                        onClose(); // Close modal for normal users
                    }, 1000);
                }
            } else {
                toast.error("Invalid credentials. Please try again.");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-popup">
                <button className="close-button" onClick={onClose} disabled={loading}>×</button>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    {/* Role Selection */}
                    <div className="role-selection">
                        <label>
                            <input 
                                type="radio" 
                                value="user" 
                                checked={role === "user"} 
                                onChange={() => setRole("user")} 
                                disabled={loading}
                            /> 
                            User
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="admin" 
                                checked={role === "admin"} 
                                onChange={() => setRole("admin")} 
                                disabled={loading}
                            /> 
                            Admin
                        </label>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Don't have an account? <button className="link-button" onClick={() => onSwitch("signup")} disabled={loading}>Sign Up</button></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
