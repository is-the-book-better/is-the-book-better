import React from 'react';


const MainComp = ({ isBookBetter, title, movieImageUrl, bookImageUrl, bookAuthor, scrollRef }) => {


  return (

    <div ref={scrollRef} className="mainCompWrapper">
      {isBookBetter ? <h2>Yup.</h2> : <h2>Nope.</h2>}
      <h3>{title}</h3>
      <div className="imagesDiv">
        <div className="bookDiv">
          <img src={bookImageUrl} alt={`Book cover art for ${title}`}></img>
        </div>
        <div className="movieDiv">
          <img src={movieImageUrl} alt={`Movie cover art for ${title}`}></img>
        </div>
      </div>
      <h4>Written By</h4>
      <h5>{bookAuthor}</h5>
    </div>
  );
};

export default MainComp;
