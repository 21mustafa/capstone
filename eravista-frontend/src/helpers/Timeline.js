import { labelSpace, startingPoint } from "./constants";
import { Text } from "./Text";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

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

      for (let yearEvents of centuryData.events) {
        let x = centurySpace;
        for (let events of yearEvents.events) {
        }
        new Text(
          this.scene,
          yearEvents.year.includes("?") ? "-" : yearEvents.year,
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
