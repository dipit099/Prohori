import React, { useState } from "react";
import "./AuthModal.css";

const Signup = ({ onClose, onSwitch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-overlay">
      <div className="auth-popup">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Sign Up</h2>
        <form>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Sign Up</button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button className="link-button" onClick={() => onSwitch("login")}>Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
