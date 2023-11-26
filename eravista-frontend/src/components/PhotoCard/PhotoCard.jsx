import React, { useEffect, useRef, useState } from "react";
import "./PhotoCard.scss";

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
      <img
        src={`http://127.0.0.1:8000/uploads/${props.image}`}
        alt="event images"
      />
    </div>
  );
};

const ImageAlbum = (props) => {
  const getImages = () => {
    const imgs = [];

    return props.images.map((image, i) => {
      return <ImageItem i={i} showImages={props.showImages} image={image} />;
    });

    return imgs;
  };

  return <>{getImages()}</>;
};

function PhotoCard(props) {
  return props.currentEvent ? (
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
        <ImageAlbum
          showImages={props.showImages}
          images={props.currentEvent.images}
        />
      </div>
    </div>
  ) : null;
}

export default PhotoCard;
