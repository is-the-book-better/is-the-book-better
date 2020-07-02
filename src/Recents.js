import React from "react";

const Recents = ({ recents, doSearch }) => {
  return (
    <div className="recentSearches">
      <h2>Recent Searches Go Here!</h2>
      {recents.map((search, index) => {
        return (
          <button onClick={doSearch} value={search}>
            {search}
          </button>
        );
      })}
    </div>
  );
};

export default Recents;
