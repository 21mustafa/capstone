import React, { useContext } from "react";
import { TimelineContext } from "./context/TimelineContext";

function ThreeD() {
  const timelineData = useContext(TimelineContext);

  return <div>ThreeD</div>;
}

export default ThreeD;
