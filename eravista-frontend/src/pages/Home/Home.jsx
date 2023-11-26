import React, { useContext, useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import "./Home.scss";
import Slider from "react-input-slider";
import PhotoCard from "../../components/PhotoCard/PhotoCard";
import { TimelineContext } from "../../context/TimelineContext";
import Filter from "../../components/Filter/Filter";

function Home(props) {
  const display = props.displayCard && !!props.currentEvent;
  const [showImages, setShowImages] = useState(false);
  const timeline = useContext(TimelineContext);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className={showImages ? "home disable" : "home"}>
      <div className="home__filter">
        <button
          className="home__filter-button"
          onClick={() => setShowFilter((value) => !value)}
          disabled={showImages}
        >
          Find a historical event
        </button>

        <Filter
          timeline={timeline}
          goToEvent={props.goToEvent}
          open={showFilter}
        />
      </div>

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
            disabled={showFilter}
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
