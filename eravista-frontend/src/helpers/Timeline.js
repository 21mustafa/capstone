import { labelSpace, timelinePositions } from "./constants";
import { Text } from "./Text";

const space = 400;

export class Timeline {
  constructor(scene, data) {
    this.scene = scene;
    this.data = data;
    this.createCenturies();
  }

  createCenturies = () => {
    let centurySpace = labelSpace - 750;

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

      for (let yearEvents of centuryData.events) {
        for (let events of yearEvents.events) {
          centurySpace -= space;
          timelinePositions[events.id] = centurySpace;
        }
        centurySpace -= space;
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
      centurySpace -= space;
    }
  };
}
