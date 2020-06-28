


import React from "react";

const Description = () => {
    let bookDescriptionTitle = `Title of Book`;
    let movieDescriptionTitle = `Title of Movie`;
    let bookDescriptionText = `hi guys dolor sit amet consectr adsicing elit. Veniam neitibus totam, magnam remnderit corrtion dolor sit amet consectr adsicing elit. Veniam neitibus totam, magnam remnderit corris cuptate ipsam, sed tempore ducimus fugit ofiis vero lantium esse?`
    let movieDescriptionText= `description dolor sit amet consectr adsicing elit. Veniam neitibus totam, magnam remnderit corris cuptate ipsam, sed tempore ducimus fugit ofiis vero totam, magnam remnderit corris cuptate ipsam, sed tempore ducimus fugit ofiis vero lantium esse?`;
  return (
    <div className="descriptionWrapper">
      <div className="bookWrapper">
          <h2>{bookDescriptionTitle}</h2>
          <p>{bookDescriptionText}</p>
      </div>
      <div className="movieWrapper">
          <h2>{movieDescriptionTitle}</h2>
          <p>{movieDescriptionText}</p>
      </div>
    </div>
  );
};

export default Description;
