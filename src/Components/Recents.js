import React, { Fragment, useEffect } from "react";

const Recents = ({ recents, doSearch }) => {
  useEffect(() => {
    const container = document.getElementById("recentSearches");
    const containerWidth = container.scrollWidth;
    let right = true;
    let prev = 0;

    let id = setInterval(() => {
      if (right) {
        if (container.scrollLeft !== containerWidth) {
          container.scrollTo(container.scrollLeft + 1, 0);
        }

        if (container.scrollLeft === prev) {
          right = false;
        }
        prev = container.scrollLeft;
      } else {
        if (container.scrollLeft !== 0) {
          container.scrollTo(container.scrollLeft - 1, 0);
        } else {
          right = true;
        }
      }
    }, 16);

    return () => {
      clearInterval(id);
    };
  });

  return (
    <Fragment>
      <h2>Here's what others have searched for:</h2>
      <div className="recentContainer">
        <div className="recentSearches" id="recentSearches">
          {recents.map((search, index) => {
            return (
              <button onClick={doSearch} value={search} key={index}>
                {search}
              </button>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default Recents;
