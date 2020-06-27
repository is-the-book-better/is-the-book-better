


import React from "react";

const Description = () => {
    let bookDescriptionTitle = `title of book`;
    let movieDescriptionTitle = `title of movie`;
    let bookDescriptionText = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam necessitatibus totam, magnam rem reprehenderit corporis cupiditate ipsam, sed tempore ducimus fugit officiis vero laudantium esse?`
    let movieDescriptionText= `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas laudantium voluptatibus fuga, exercitationem mollitia reprehenderit accusamus inventore tenetur modi, velit optio quidem. Sapiente, dolorum saepe.`;
  return (
    <div className="descriptionWrapper">
        <div className="bookWrapper">
            <h2>{bookDescriptionTitle}</h2>
            <p>{bookDescriptionText}</p>
        </div>
        <div className="movieWrapper"></div>
            <h2>{movieDescriptionTitle}</h2>
            <p>{movieDescriptionText}</p>
        </div>
  );
};

export default Description;
