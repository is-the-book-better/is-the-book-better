import React from "react";

const Rating = ({ score, medium }) => {
  // FontAwesome Classes for Stars
  const fullStar = "fas fa-star";
  const halfStar = "fas fa-star-half-alt";
  const emptyStar = "far fa-star";

  // Round score up to nearest .5 decimal place.
  const roundedScore = (Math.round(score * 2) / 2).toFixed(1);

  const quotient = Math.floor(roundedScore / 1);
  const remainder = roundedScore % 1;

  let stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < quotient) {
      stars.push(fullStar);
    } else if (i < quotient + 1 && remainder > 0) {
      stars.push(halfStar);
    } else {
      stars.push(emptyStar);
    }
  }

  return (
    <div className="rating">
      <h3>{score}</h3>
      <div className="stars">
        {stars.map((star, index) => {
          return <i className={star} key={medium + "Star" + (index + 1)}></i>;
        })}
      </div>
    </div>
  );
};

export default Rating;
