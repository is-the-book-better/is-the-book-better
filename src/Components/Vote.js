import React from "react";

const Vote = ({ medium, votes, upVote, voted }) => {
  if (voted) {
    return <h3>{votes} votes</h3>;
  } else {
    return (
      <button className="vote" onClick={upVote}>
        <i className="far fa-thumbs-up" id={medium + "Vote"}></i>
        <p>Click to vote</p>
      </button>
    );
  }
};

export default Vote;
