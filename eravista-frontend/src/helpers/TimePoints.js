import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import * as GeometryUtils from "three/examples/jsm/utils/GeometryUtils.js";

export class TimePoints {
  constructor(scene, renderer, camera) {
    let line, controls;
    let line1;
    let matLine, matLineBasic, matLineDashed;
    let stats, gpuPanel;
    let gui;
    this.scene = scene;

    const positions = [];

    const spline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(0, 0, 10),
    ]);
    const divisions = Math.round(12 * 5);
    const point = new THREE.Vector3();

    for (let i = 0, l = divisions; i < l; i++) {
      const t = i / l;

      spline.getPoint(t, point);
      positions.push(point.x, point.y, point.z);
    }

    // Line2 ( LineGeometry, LineMaterial )

    const geometry = new LineGeometry();
    geometry.setPositions(positions);

    matLine = new LineMaterial({
      color: 0xffffff,
      linewidth: 20,
      vertexColors: true,
      dashed: false,
      alphaToCoverage: true,
    });

    line = new Line2(geometry, matLine);
    line.computeLineDistances();
    line.scale.set(1, 1, 1);
    scene.add(line);
  }
}
