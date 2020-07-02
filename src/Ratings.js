import React from "react";
import Rating from "./Rating";
import Vote from "./Vote";

const Ratings = ({ bookScore, movieScore, bookVotes, movieVotes }) => {
  return (
    <div className="ratings">
      <div className="ratings-wrapper">
        <h3>Rating</h3>
        <div className="apiRatings">
          <Rating score={bookScore} medium="book" key="book-score" />
          <Rating score={movieScore} medium="movie" key="movie-score" />
        </div>
        <h3>Vote</h3>
        <div className="voteRatings">
          <Vote medium="book" />
          <Vote medium="movie" />
        </div>
      </div>
    </div>
  );
};

export default Ratings;
