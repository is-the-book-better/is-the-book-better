import React from 'react';


const MainComp = () => {
    
    let yupOrNope = `Yup.`;
    let winner = `Enders Game`;

    let book = <img src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1408303130l/375802.jpg" />
    let movie= <img src="https://m.media-amazon.com/images/M/MV5BMjAzMzI5OTgzMl5BMl5BanBnXkFtZTgwMTU5MTAwMDE@._V1_SY1000_CR0,0,674,1000_AL_.jpg" />;

    
    let authorsName = `Orson Scott Card`;

  return (
    <div className="mainCompWrapper">
        <h2>{yupOrNope}</h2>
        <h3>{winner}</h3>
        <div className="imagesDiv">
            <div className="bookDiv">
                {book}
            </div>
            <div className="movieDiv">
                {movie}
            </div>
        </div>
        <h4>Written By</h4>
        <h5>{authorsName}</h5>
    </div>
  );
};

export default MainComp;
