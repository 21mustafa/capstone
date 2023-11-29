import React, { useContext, useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import "./Home.scss";
import Slider from "react-input-slider";
import PhotoCard from "../../components/PhotoCard/PhotoCard";
import { TimelineContext } from "../../context/TimelineContext";
import Filter from "../../components/Filter/Filter";
import { pathLength, startingPoint } from "../../helpers/constants";

function Home(props) {
  const display = props.displayCard && !!props.currentEvent;
  const [showImages, setShowImages] = useState(false);
  const timeline = useContext(TimelineContext);
  const [showFilter, setShowFilter] = useState(false);

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  const getYearPointsOnSlide = (position) => {
    const max1 = startingPoint + 250;
    const min1 = pathLength;

    return width - ((position - min1) / (max1 - min1)) * width;
  };

  const getYearIndicator = () => {
    let currYear;
    const result = [];
    const interval = Math.floor(width / 50);
    let firstYear = true;
    let count = Math.floor(props.timelinePositions.length / interval);

    for (let i = 0; i < props.timelinePositions.length; i++) {
      let timelinePosition = props.timelinePositions[i];
      let isSelected = props.currentEvent?._id === timelinePosition?._id;

      let includeYear = !timelinePosition.year.includes("?");
      result.push(
        <div
          style={{
            backgroundColor: isSelected ? "#bb0000" : "#aaaaaa",
            position: "absolute",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            left: getYearPointsOnSlide(timelinePosition.position) + "px",
          }}
        >
          <span
            style={{
              color: "#ffffff91",
              fontSize: "1.5rem",
              fontWeight: 900,
              display: "block",
              marginTop: "0.5rem",
            }}
          >
            {(currYear !== timelinePosition.year &&
              count === 0 &&
              includeYear) ||
            firstYear
              ? timelinePosition.year
              : ""}
          </span>
        </div>
      );
      firstYear = false;
      if (includeYear) {
        currYear !== timelinePosition.year && count--;
        if (count < 0) {
          count = Math.floor(props.timelinePositions.length / interval);
        }
        currYear = timelinePosition.year;
      }
    }
    return result;
  };

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

      <div className={`home__credit ${props.showCredits ? "" : "hide-credit"}`}>
        <div className="home__credit-label">Created by</div>
        <div className="home__credit-value">Mostafa Asghari Dilmani</div>
        <div className="home__credit-link">
          <a href="">
            <i class="fa-brands fa-linkedin"></i>
            <span>Linkedin</span>
          </a>
        </div>
        <div className="home__credit-link">
          <a href="https://github.com/21mustafa">
            <i class="fa-brands fa-github"></i>
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="home__navigate">
        <button
          onClick={() => {
            const currentID = props.currentEvent
              ? props.currentEvent._id
              : null;

            if (props.timelinePositions[0]?._id === currentID || !currentID) {
              props.goToEvent({
                id: props.timelinePositions[props.timelinePositions.length - 1]
                  ._id,
              });
            } else {
              for (let i = 1; i < props.timelinePositions.length; i++) {
                if (props.currentEvent._id === props.timelinePositions[i]._id) {
                  props.goToEvent({ id: props.timelinePositions[i - 1]._id });
                  break;
                }
              }
            }
          }}
        >
          <i class="fa-solid fa-caret-left"></i>
        </button>
        <button
          onClick={() => {
            const currentID = props.currentEvent
              ? props.currentEvent._id
              : null;

            if (
              !currentID ||
              props.timelinePositions[props.timelinePositions.length - 1]
                ?._id === props.currentEvent?._id
            ) {
              // first element
              props.goToEvent({ id: props.timelinePositions[0]._id });
            } else {
              for (let i = 0; i < props.timelinePositions.length - 1; i++) {
                if (props.currentEvent._id === props.timelinePositions[i]._id) {
                  props.goToEvent({ id: props.timelinePositions[i + 1]._id });
                  break;
                }
              }
            }
          }}
        >
          <i class="fa-solid fa-caret-right"></i>
        </button>
      </div>

      <div className="home__slider">
        <div className="home__slider-bg">{getYearIndicator()}</div>
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
              backgroundColor: "#ffffffab",
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
