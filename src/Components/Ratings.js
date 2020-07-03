import React from "react";
import Rating from "./Rating";
import Vote from "./Vote";

const Ratings = ({
  bookScore,
  movieScore,
  bookVotes,
  movieVotes,
  upVote,
  bookId,
  movieId,
  voted,
}) => {
  return (
    <div className="ratings">
      <div className="mainWrapper">
        <h2>Ratings and Votes</h2>
        {/* <h3>Rating</h3> */}
        <div className="apiRatings">
          <Rating score={bookScore} medium="book" key="book-score" />
          <Rating score={movieScore} medium="movie" key="movie-score" />
        </div>
        {/* <h3>Vote</h3> */}
        <div className="voteRatings">
          <Vote
            medium="book"
            votes={bookVotes}
            upVote={() => {
              upVote("book", bookId);
            }}
            voted={voted}
          />
          <Vote
            medium="movie"
            votes={movieVotes}
            upVote={() => {
              upVote("movie", movieId);
            }}
            voted={voted}
          />
        </div>
      </div>
    </div>
  );
};

export default Ratings;
