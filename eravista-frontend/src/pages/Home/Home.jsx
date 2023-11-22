import React from "react";
import Card from "../../components/Card/Card";
import "./Home.scss";

function Home(props) {
  return (
    <div className="home">
      <Card
        display={props.displayCard}
        currentEvent={props.currentEvent}
        stopAnimation={props.stopAnimation}
        startAnimation={props.startAnimation}
      />
    </div>
  );
}

export default Home;
