import React from "react";
import "./HomeReview.css"; 
import humanPicture1 from "../../assets/human1.jpg";
import humanPicture2 from "../../assets/human2.jpg";

const reviews = [
    {
        img: humanPicture1,
        text: `"Prohori has helped me stay informed about crimes in my area. It's a game-changer for safety awareness!"`,
        author: "John Doe",
        rating: 4
    },
    {
        img: humanPicture2,
        text: `"A great platform for the community to report and verify crime incidents. Very easy to use!"`,
        author: "Jane Smith",
        rating: 5
    }
];

const HomeReview = () => {
    return (
        <div className="home-review">
            <h2 className="review-title">What Our Users Say</h2>
            <div className="review-container">
                {reviews.map((review, index) => (
                    <div className="review-card" key={index}>
                        <img src={review.img} alt={review.author} className="review-image" />
                        <div className="review-text">{review.text}</div>
                        <div className="review-author">- {review.author}</div>
                        <div className="review-rating">
                            <span>Rating:</span>
                            <div className="stars">
                                {"★".repeat(review.rating)}
                                {"☆".repeat(5 - review.rating)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeReview;
