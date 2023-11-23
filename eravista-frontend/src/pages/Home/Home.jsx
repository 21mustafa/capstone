import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import "./Home.scss";
import Slider from "react-input-slider";

function Home(props) {
  const [extend, setExtend] = useState(false);
  const display = props.displayCard && !!props.currentEvent;

  useEffect(() => {
    if (extend) {
      props?.stopAnimation && props?.stopAnimation();
    } else {
      props?.startAnimation && props?.startAnimation();
    }
  }, [extend]);

  useEffect(() => {
    if (display) {
      setExtend(false);
    }
  }, [display]);

  return (
    <div
      className={extend ? "home home--blur" : "home"}
      onClick={() => setExtend(false)}
    >
      <div className="home__card">
        <Card
          display={display}
          currentEvent={props.currentEvent}
          setExtend={setExtend}
          extend={extend}
        />
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
          disabled={extend}
        />
      </div>
    </div>
  );
}

export default Home;
