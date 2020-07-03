import React from "react";

const Description = ({
  movieDescription,
  bookDescription,
  bookTitle,
  movieTitle,
}) => {
  return (
    <div className="descriptionWrapper">
      <h2>Descriptions</h2>
      <div className="bookWrapper">
        <h3>Book: {bookTitle}</h3>
        <p>{bookDescription.replace(/(<([^>]+)>)/gi, "")}</p>
      </div>
      <div className="movieWrapper">
        <h3>Movie: {movieTitle}</h3>
        <p>{movieDescription}</p>
      </div>
    </div>
  );
};

export default Description;
