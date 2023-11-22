import { createContext, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { TimelineContext } from "./context/TimelineContext";
import ThreeD from "./ThreeD";
import { Environment } from "./helpers/Environment";
import { Text } from "./helpers/Text";
import {
  animationEase,
  getNextTextSpace,
  labelSpace,
  nextTextSpace,
  startingPoint,
} from "./helpers/constants";
import { Timeline } from "./helpers/Timeline";
import debounce from "lodash.debounce";
import * as THREE from "three";
import Home from "./pages/Home/Home";
import Details from "./pages/Details/Details";
import Slider from "react-input-slider";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timelinePositions, setTimelinePositions] = useState([]);

  const [currentPosition, setCurrentPosition] = useState(-1);
  const [currentEvent, setCurrentEvent] = useState(null);

  const [sliderX, setSliderX] = useState(0);

  const boxes = useRef({});
  const preEventBox = useRef(null);
  const environment = useRef();

  const onScroll = (position) => {
    if (position > labelSpace - 750) {
      return;
    }
    for (let i = 0; i < timelinePositions.length; i++) {
      if (i + 1 === timelinePositions.length) {
        setCurrentEvent(timelinePositions[i]);
        break;
      }

      if (i === 0) {
        const pointAPosition = labelSpace;
        const pointBPosition = timelinePositions[i].position;
        if (pointBPosition < position && position < pointAPosition) {
          setCurrentEvent(timelinePositions[i]);
          break;
        }
      }

      const pointA = timelinePositions[i];
      const pointB = timelinePositions[i + 1];
      if (pointB.position < position && position < pointA.position) {
        setCurrentEvent(pointB);
        break;
      }
    }
  };

  useEffect(() => {
    if (preEventBox.current) {
      preEventBox.current.material.color = new THREE.Color("#39FF14");
    }
    if (currentEvent) {
      boxes.current[currentEvent.id].material.color.setHex(0xffffff);
      preEventBox.current = boxes.current[currentEvent.id];
    }
  }, [currentEvent]);

  useEffect(() => {
    if (currentPosition !== -1) {
      onScroll(currentPosition);
    }
  }, [currentPosition]);

  const debouncedScrollHandler = debounce((position) => {
    setIsLoading(false);
    setCurrentPosition(position);
  }, 50);

  useEffect(() => {
    void retrieveTimeline();
  }, []);

  useEffect(() => {
    console.log(sliderX);
  }, [sliderX]);

  useEffect(() => {
    for (let element of timelinePositions) {
      const geometry = new THREE.BoxGeometry(7, 7, 7);
      const material = new THREE.MeshBasicMaterial({ color: "#39FF14" });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.z = element.position;
      cube.position.y = -25;
      environment.current.scene.add(cube);

      boxes.current[element.id] = cube;
    }
  }, [timelinePositions]);

  useEffect(() => {
    if (timeline.length) {
      environment.current = new Environment(
        timeline,
        debouncedScrollHandler,
        () => setIsLoading(true)
      );

      new Timeline(environment.current.scene, timeline, setTimelinePositions);

      new Text(
        environment.current.scene,
        "Era Vista",
        -40,
        startingPoint,
        undefined,
        undefined,
        undefined,
        undefined,
        55
      );

      new Text(
        environment.current.scene,
        "Canada",
        -40,
        labelSpace,
        undefined,
        undefined,
        undefined,
        undefined,
        55
      );
    }
  }, [timeline]);

  const retrieveTimeline = async () => {
    const response = await axios.get();
    setTimeline(response.data);
  };

  return (
    <TimelineContext.Provider value={timeline}>
      <div id="container"></div>
      <Home
        displayCard={
          !(
            isLoading ||
            currentPosition > labelSpace - 750 ||
            currentPosition === -1
          )
        }
        currentEvent={currentEvent}
        stopAnimation={environment.current?.stopAnimation}
        startAnimation={environment.current?.startAnimation}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          zIndex: 100,
          display: "block",
          left: "50%",
          transform: "translate(-50%, 0)",
          backgroundColor: "transparent",
          height: "calc(100vh - 8rem)",
          margin: "4rem 0",
        }}
      >
        <Slider axis="x" x={sliderX} onChange={({ x }) => setSliderX(x)} />
        <button
          onClick={() => {
            environment.current.stopAnimation();

            const targetLerp = environment.current.getLerpFromPosition(
              timelinePositions[timelinePositions.length - 1].position + 175
            );

            console.log(targetLerp);
            environment.current.lerp = environment.current.calculatePosition({
              current: environment.current.lerp.current,
              target: targetLerp,
              ease: 0.1,
            });

            environment.current.startAnimation();
          }}
        >
          wwww
        </button>
      </div>
    </TimelineContext.Provider>
  );
}

export default App;
