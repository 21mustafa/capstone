import React from "react";
import Card from "../../components/Card/Card";
import "./Home.scss";

function Home(props) {
  return (
    <div className="home">
      <Card
        display={props.displayCard}
        currentEvent={props.currentEvent}
        stopScroll={props.stopAnimation}
      />
    </div>
  );
}

export default Home;
