import { labelSpace, startingPoint } from "./constants";
import { Text } from "./Text";

const space = 400;
const timelinePositions = {};
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
        const eventSpace = 200;
        for (let events of yearEvents.events) {
          centurySpace -= eventSpace;
          timelinePositions[events.id] = centurySpace;
          // new Text(
          //   this.scene,
          //   yearEvents.year.includes("?") ? "-" : yearEvents.year + "w",
          //   -48,
          //   centurySpace,
          //   2,
          //   1
          // );
        }
        centurySpace -= eventSpace;
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

    console.log(timelinePositions);
  };
}
