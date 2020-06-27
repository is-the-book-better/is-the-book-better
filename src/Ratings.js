import React from "react";
import Rating from "./Rating";

const Ratings = ({ bookScore, movieScore }) => {
  return (
    <div className="ratings">
      <Rating score={bookScore} />
      <Rating score={movieScore} />
    </div>
  );
};

export default Ratings;
