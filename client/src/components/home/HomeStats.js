import React from "react";
import CountUp from "react-countup";
import "./HomeStats.css"; 

const stats = [
    { value: 1200, label: "Reports Submitted", description: "Over 1,200 crime reports verified and resolved by the community." },
    { value: 5000, label: "Active Users", description: "A strong network of 5,000+ users helping to ensure safety." },
    { value: 80, label: "Cities Covered", description: "Our platform operates in over 80 cities, ensuring widespread coverage." },
];

const HomeStats = () => {
    return (
        <div className="home-stats">
            {stats.map((stat, index) => (
                <div className="stat-box" key={index}>
                    <h2><CountUp end={stat.value} duration={3} />+</h2>
                    <h3>{stat.label}</h3>
                    <p>{stat.description}</p>
                </div>
            ))}
        </div>
    );
};

export default HomeStats;
