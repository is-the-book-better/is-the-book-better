


import React from "react";

const Description = ({movieDescription, bookDescription, bookTitle, movieTitle}) => {

  return (
    <div className="descriptionWrapper">
      <div className="bookWrapper">
          <h2>{bookTitle}</h2>
          <p>{bookDescription}</p>
      </div>
      <div className="movieWrapper">
          <h2>{movieTitle}</h2>
          <p>{movieDescription}</p>
      </div>
    </div>
  );
};

export default Description;
