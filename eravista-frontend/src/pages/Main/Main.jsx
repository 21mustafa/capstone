import React, { useContext } from "react";
import { TimelineContext } from "../../context/TimelineContext";
import { useEffect, useRef, useState } from "react";
import { Environment } from "../../helpers/Environment";
import { Text } from "../../helpers/Text";
import { labelSpace, startingPoint, pathLength } from "../../helpers/constants";
import { Timeline } from "../../helpers/Timeline";
import debounce from "lodash.debounce";
import * as THREE from "three";
import Home from "../Home/Home";

function Main() {
  const timeline = useContext(TimelineContext);

  const [isLoading, setIsLoading] = useState(false);
  const [timelinePositions, setTimelinePositions] = useState([]);

  const [currentPosition, setCurrentPosition] = useState(-1);
  const [currentEvent, setCurrentEvent] = useState(null);

  const [sliderX, setSliderX] = useState(0);

  const boxes = useRef({});
  const preEventBox = useRef(null);
  const environment = useRef();

  const [showCredits, setShowCredits] = useState(false);
  const onScroll = (position) => {
    if (position > labelSpace - 750) {
      setShowCredits(false);
      setCurrentEvent(null);
      return;
    }

    if (position <= pathLength + 1055) {
      setCurrentEvent(null);
      setShowCredits(true);
      return;
    }

    for (let i = 0; i < timelinePositions.length; i++) {
      if (i + 1 === timelinePositions.length) {
        setCurrentEvent(timelinePositions[i]);
        setShowCredits(false);
        break;
      }

      setShowCredits(false);
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

  const updateSlide = (position) => {
    const max1 = startingPoint + 200;
    const min1 = pathLength + 460;

    setSliderX(100 - ((position - min1) / (max1 - min1)) * 100);
  };

  useEffect(() => {
    if (preEventBox.current) {
      preEventBox.current.material.color = new THREE.Color("#d9d2c9");
    }
    if (currentEvent) {
      boxes.current[currentEvent._id].material.color.setHex(0x780904);
      preEventBox.current = boxes.current[currentEvent._id];
    }
  }, [currentEvent]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (currentPosition !== -1) {
      onScroll(currentPosition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  const debouncedScrollHandler = debounce((position) => {
    setIsLoading(false);
    setCurrentPosition(position);
  }, 150);

  useEffect(() => {
    for (let element of timelinePositions) {
      const geometry = new THREE.BoxGeometry(7, 7, 7);
      const material = new THREE.MeshBasicMaterial({ color: "#d9d2c9" });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.z = element.position;
      cube.position.y = -25;
      environment.current.scene.add(cube);

      boxes.current[element._id] = cube;
    }
  }, [timelinePositions]);

  useEffect(() => {
    if (timeline.length) {
      environment.current = new Environment(
        timeline,
        (position) => {
          debouncedScrollHandler(position);
          setShowCredits(false);
          updateSlide(position);
        },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline]);

  const onSlide = ({ x }) => {
    if (environment.current) {
      const max = environment.current.getLerpFromPosition(
        timelinePositions[timelinePositions.length - 1].position + 175
      );

      const min = 0;

      const a = (max - min) / 100;
      const b = min;

      environment.current.lerp = environment.current.calculatePosition({
        current: environment.current.lerp.current,
        target: a * x + b,
        ease: 0.1,
      });
      setSliderX(x);
    }
  };

  const onSearchChange = (eventFilter) => {
    if (environment.current) {
      const position = timelinePositions.find(
        (item) => item._id === eventFilter.id
      ).position;

      const targetLerp = environment.current.getLerpFromPosition(
        position + 175
      );

      environment.current.lerp = environment.current.calculatePosition({
        current: environment.current.lerp.current,
        target: targetLerp,
        ease: 0.1,
      });
    }
  };

  return (
    <>
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
        sliderX={sliderX}
        onChange={onSlide}
        onDragStart={() => {
          setIsLoading(true);
          setCurrentEvent(null);
        }}
        onDragEnd={() => setIsLoading(false)}
        goToEvent={onSearchChange}
        timelinePositions={timelinePositions}
        showCredits={showCredits}
      />
    </>
  );
}

export default Main;
