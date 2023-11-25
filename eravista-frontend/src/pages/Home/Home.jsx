import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import "./Home.scss";
import Slider from "react-input-slider";
import PhotoCard from "../../components/PhotoCard/PhotoCard";

function Home(props) {
  const display = props.displayCard && !!props.currentEvent;
  const [showImages, setShowImages] = useState(false);
  return (
    <div className={showImages ? "home disable" : "home"}>
      <div className="home__card">
        <div className="home__card-content">
          <Card display={display} currentEvent={props.currentEvent} />
          <PhotoCard
            display={display}
            currentEvent={props.currentEvent}
            stopAnimation={props.stopAnimation}
            startAnimation={props.startAnimation}
            setShowImages={setShowImages}
            showImages={showImages}
          />
        </div>
      </div>

      <div className="home__slider">
        <Slider
          styles={{
            track: {
              backgroundColor: "transparent",
              height: "100%",
              width: "calc(100% - 2rem)",
              marginLeft: "1rem",
            },
            active: {
              backgroundColor: "transparent",
            },
            thumb: {
              height: "6rem",
              width: "2rem",
              borderRadius: 5,
              backgroundColor: "#39ff15",
            },
          }}
          axis="x"
          x={props.sliderX}
          onChange={props.onChange}
          onDragStart={props.onDragStart}
          onDragEnd={props.onDragEnd}
          disabled={showImages}
        />
      </div>
    </div>
  );
}

export default Home;
