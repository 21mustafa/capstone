import React, { useEffect, useRef, useState } from "react";
import "./PhotoCard.scss";
import img1 from "./bg.jpeg";

const top = -16.5;
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const randomNums = Array.from({ length: 10 }, () => getRandomNumber(-3, 3));

const ImageItem = (props) => {
  return (
    <div
      className={`photo-card__container-item `}
      style={{
        top: `${top * props.i}rem`,
        transform: `rotate(${randomNums[props.i]}deg)`,
      }}
    >
      <img src={img1} />
    </div>
  );
};

const ImageAlbum = (props) => {
  const getImages = () => {
    const imgs = [];
    for (let i = 0; i < 10; i++) {
      imgs.push(<ImageItem i={i} showImages={props.showImages} />);
    }
    return imgs;
  };

  return <>{getImages()}</>;
};

function PhotoCard(props) {
  return (
    <div
      className={`photo-card ${props.display ? "" : "collapse"} ${
        props.showImages ? "expand" : ""
      }`}
    >
      <div
        className="photo-card__container"
        onClick={(e) => {
          e.stopPropagation();
          if (!props.showImages) {
            props?.stopAnimation && props?.stopAnimation();
          } else {
            props?.startAnimation && props?.startAnimation();
          }
          props.setShowImages((value) => !value);
        }}
      >
        <ImageAlbum showImages={props.showImages} />
      </div>
    </div>
  );
}

export default PhotoCard;
