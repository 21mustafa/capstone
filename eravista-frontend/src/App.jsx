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

  useEffect(() => {
    environment.current = new Environment();
    new Text(environment.current.scene, "Era Vista", -40, startingPoint);
    new Text(environment.current.scene, "Canada", -40, labelSpace);

    void retrieveTimeline();
  }, []);

  useEffect(() => {
    if (timeline.length) {
      new Timeline(environment.current.scene, timeline);
    }
  }, [timeline]);

  const retrieveTimeline = async () => {
    const response = await axios.get();
    setTimeline(response.data);
  };

  return (
    <TimelineContext.Provider value={timeline}>
      <div id="container"></div>
    </TimelineContext.Provider>
  );
}

export default App;
