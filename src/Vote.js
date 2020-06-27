import React from "react";

const Vote = ({ medium }) => {
  return (
    <div className="vote">
      <i class="far fa-thumbs-up" id={medium + "Vote"}></i>
    </div>
  );
};

export default Vote;
