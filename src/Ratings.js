import React from "react";
import Rating from "./Rating";

const Ratings = ({ bookScore, movieScore }) => {
  return (
    <div className="ratings">
      <div className="ratings-wrapper">
        <h3>Rating</h3>
        <div className="APIratings">
          <Rating score={bookScore} medium="book" key="book-score" />
          <Rating score={movieScore} medium="movie" key="movie-score" />
        </div>
        <h3>Vote</h3>
      </div>
    </div>
  );
};

export default Ratings;
