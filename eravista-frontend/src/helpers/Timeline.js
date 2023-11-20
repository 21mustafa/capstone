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
        //   const element = document.createElement("div");
        //   element.className = "element";
        //   element.style.backgroundColor =
        //     "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";

        //   const number = document.createElement("div");
        //   number.className = "number";
        //   number.textContent = "i / 5 + 1";
        //   element.appendChild(number);

        //   const symbol = document.createElement("div");
        //   symbol.className = "symbol";
        //   symbol.textContent = "dfg";
        //   element.appendChild(symbol);

        //   const details = document.createElement("div");
        //   details.className = "details";
        //   details.innerHTML = "dfgdfg" + "<br>" + "dfgfdg";
        //   element.appendChild(details);

        //   const objectCSS = new CSS3DObject(element);
        //   objectCSS.position.y = -40;
        //   objectCSS.position.z = startingPoint;
        //   this.scene.add(objectCSS);

          //   const element = document.createElement("div");
          //   element.className = "element";
          //   const child = `
          //         <div>
          //             ${events.description}
          //         </div>
          //     `;
          //   element.innerHTML = child;
          //   const objectCSS = new CSS3DObject(element);
          //   x += 100 / (yearEvents.events.length + 1);

          //   this.scene.add(objectCSS);
          //   x += 100 / (yearEvents.events.length + 1);
          //   new Text(this.scene, events.description, -48, x, 5, 1, true, 10);
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
