import { labelSpace, timelinePositions } from "./constants";
import { Text } from "./Text";

const space = 400;

export class Timeline {
  constructor(scene, data, setTimelinePositions) {
    this.setTimelinePositions = setTimelinePositions;
    this.scene = scene;
    this.data = data;
    this.createCenturies();
  }

  createCenturies = () => {
    let centurySpace = labelSpace - 750;
    const timelinePositions = [];
    for (let centuryData of this.data) {
      new Text(
        this.scene,
        centuryData.century,
        -40,
        centurySpace,
        50,
        10,
        undefined,
        undefined,
        55
      );

      // centurySpace -= space / 2;

      for (let yearEvents of centuryData.events) {
        let i = 0;
        for (let events of yearEvents.events) {
          if (0 === i) {
            centurySpace -= space / 2;
          } else {
            centurySpace -= space;
          }

          timelinePositions.push({
            position: centurySpace,
            ...events,
            year: yearEvents.year,
          });
          i++;
        }
        centurySpace -= space / 2;
        new Text(
          this.scene,
          yearEvents.year.includes("?") ? "-" : yearEvents.year,
          -48,
          centurySpace,
          5,
          1,
          true
        );
      }
      // centurySpace -= space / 2;
    }

    this.setTimelinePositions(
      timelinePositions.sort(
        (element1, element2) => element2.position - element1.position
      )
    );
  };
}
