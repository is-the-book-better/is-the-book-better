import React from 'react';


const MainComp = ({isBookBetter, title, movieImageUrl, bookImageUrl, bookAuthor}) => {
    

  return (
    <div className="mainCompWrapper">
        <h2>{isBookBetter}</h2>
        <h3>{title}</h3>
        <div className="imagesDiv">
            <div className="bookDiv">
                <img src={bookImageUrl}></img>
            </div>
            <div className="movieDiv">
                <img src={movieImageUrl}></img>    
            </div>
        </div>
        <h4>Written By</h4>
        <h5>{bookAuthor}</h5>
    </div>
  );
};

export default MainComp;
