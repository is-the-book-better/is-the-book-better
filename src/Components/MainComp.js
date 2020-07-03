
import React from "react";


const MainComp = ({
  isBookBetter,
  title,
  movieImageUrl,
  bookImageUrl,
  bookAuthor,

  scrollRef,

}) => {
  return (
    <div ref={scrollRef} className="mainCompWrapper">
      {isBookBetter ? (
        <h2>Yup, the book is better.</h2>
      ) : (
        <h2>Nope, the book isn't better.</h2>
      )}
      {/* <div className="bookInfo">
        <h3>{title}</h3>
        <h4>Written By:</h4>
        <h5>{bookAuthor}</h5>
      </div> */}
      <div className="imagesDiv">
        <div className="categories">
          <h3>Book</h3>
          <h3>Movie</h3>
        </div>
        <div className="bookDiv">
          <img src={bookImageUrl} alt={`Book cover art for ${title}`}></img>
        </div>
        <div className="movieDiv">
          <img src={movieImageUrl} alt={`Movie cover art for ${title}`}></img>
        </div>
      </div>
    </div>
  );
};

export default MainComp;
