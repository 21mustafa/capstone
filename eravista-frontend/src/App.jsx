import { createContext, useEffect, useRef, useState } from "react";
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
axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const [timeline, setTimeline] = useState([]);
  const environment = useRef();

  const onScroll = (position) => {
    // console.log(position);
  };

  useEffect(() => {
    void retrieveTimeline();
  }, []);

  useEffect(() => {
    if (timeline.length) {
      environment.current = new Environment(timeline, onScroll);
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
