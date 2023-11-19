import {
  getCenturySpace,
  getNextTextSpace,
  labelSpace,
  nextTextSpace,
} from "./constants";
import { Text } from "./Text";

export class Timeline {
  constructor(scene, data) {
    this.scene = scene;
    this.data = data;
    this.createCenturies();
  }

  createCenturies = () => {
    let centurySpace = labelSpace - 750;

    let latest = true;
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
      centurySpace -= 250;

      if (latest) {
        new Text(this.scene, "2023", -48, centurySpace, 5, 1, true);
        centurySpace -= 100;
        latest = false;
      }

      for (let event of centuryData.events) {
        new Text(
          this.scene,
          event.year.includes("?") ? "-" : event.year,
          -48,
          centurySpace,
          5,
          1,
          true
        );

        centurySpace -= 100;
      }

      centurySpace -= 150;
    }
  };
}
