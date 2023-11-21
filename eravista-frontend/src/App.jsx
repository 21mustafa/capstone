import { createContext, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { TimelineContext } from "./context/TimelineContext";
import ThreeD from "./ThreeD";
import { Environment } from "./helpers/Environment";
import { Text } from "./helpers/Text";
import {
  getNextTextSpace,
  labelSpace,
  nextTextSpace,
  startingPoint,
} from "./helpers/constants";
import { Timeline } from "./helpers/Timeline";
import debounce from "lodash.debounce";
import * as THREE from "three";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const [timeline, setTimeline] = useState([]);
  const [timelinePositions, setTimelinePositions] = useState([]);

  const [currentPosition, setCurrentPosition] = useState(-1);
  const environment = useRef();

  const onScroll = (position) => {
    console.log(position, labelSpace);

    if (position > labelSpace - 750) {
      return;
    }
    for (let i = 0; i < timelinePositions.length; i++) {
      if (i + 1 === timelinePositions.length) {
        console.log(timelinePositions[i]);
        break;
      }

      if (i === 0) {
        const pointAPosition = labelSpace;
        const pointBPosition = timelinePositions[i].position;
        if (pointBPosition < position && position < pointAPosition) {
          console.log(timelinePositions[i]);
          break;
        }
      }

      const pointA = timelinePositions[i];
      const pointB = timelinePositions[i + 1];
      if (pointB.position < position && position < pointA.position) {
        console.log(pointB);
        break;
      }
    }
  };

  useEffect(() => {
    if (currentPosition !== -1) {
      onScroll(currentPosition);
    }
  }, [currentPosition]);

  const debouncedScrollHandler = debounce((position) => {
    setCurrentPosition(position);
  }, 200);

  useEffect(() => {
    void retrieveTimeline();
  }, []);

  useEffect(() => {
    for (let element of timelinePositions) {
      const geometry = new THREE.BoxGeometry(7, 7, 7);
      const material = new THREE.MeshBasicMaterial({ color: "#39FF14" });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.z = element.position;
      cube.position.y = -25;
      environment.current.scene.add(cube);
    }
  }, [timelinePositions]);

  useEffect(() => {
    if (timeline.length) {
      environment.current = new Environment(timeline, debouncedScrollHandler);

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
      <div
        style={{
          position: "absolute",
          top: "10px",
          width: "100%",
          textAlign: "center",
          zIndex: 100,
          display: "block",
        }}
      >
        Hello
      </div>
    </TimelineContext.Provider>
  );
}

export default App;
