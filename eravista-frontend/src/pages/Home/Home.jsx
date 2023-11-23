import React from "react";
import Card from "../../components/Card/Card";
import "./Home.scss";
import Slider from "react-input-slider";

function Home(props) {
  return (
    <div className="home">
      <Card
        display={props.displayCard && !!props.currentEvent}
        currentEvent={props.currentEvent}
        stopAnimation={props.stopAnimation}
        startAnimation={props.startAnimation}
      />
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
              height: "7rem",
              width: "2rem",
              borderRadius: 0,
            },
          }}
          axis="x"
          x={props.sliderX}
          onChange={props.onChange}
          onDragStart={props.onDragStart}
          onDragEnd={props.onDragEnd}
        />
      </div>
    </div>
  );
}

export default Home;
