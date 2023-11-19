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
    console.log("Done");
  }

  createCenturies = () => {
    let i = 1;
    let centurySpace = labelSpace - 750;
    let currentYear = 2023;
    const year = 100;
    for (let centuryData of this.data) {
      new Text(this.scene, centuryData.century, -40, centurySpace);

      centurySpace -= 250;

      while (!(currentYear % year === 0)) {
        new Text(this.scene, "" + currentYear, -48, centurySpace, 5, 1, true);
        currentYear -= 1;
        centurySpace -= 100;
      }

      if (currentYear % year === 0) {
        new Text(this.scene, "" + currentYear, -48, centurySpace, 5, 1, true);
        currentYear -= 1;
        centurySpace -= 100;
      }
      centurySpace -= 150;
    }
  };
}
