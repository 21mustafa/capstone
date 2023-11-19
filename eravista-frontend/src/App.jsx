import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { TimelineContext } from "./context/TimelineContext";
import ThreeD from "./ThreeD";
import Environment from "./helpers/Environment";
import { Mirror } from "./helpers/Mirror";
axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    // const box = new Environment();
    Mirror();
    void retrieveTimeline();
  }, []);

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
