import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// THREE.Cache.enabled = true;

export class Text {
  constructor(
    scene,
    text,
    verticalPosition,
    depthPosition,
    size,
    tickness,
    leftAlign,
    leftMargin,
    height
  ) {
    this.text = text;
    this.loadFont();

    this.group = new THREE.Group();

    this.group.position.y = verticalPosition;
    this.group.position.z = depthPosition;

    this.size = size;

    this.tickness = tickness;
    this.leftAlign = leftAlign;
    this.leftMargin = leftMargin;
    this.height = height;

    scene.add(this.group);
  }

  createText = () => {
    const textColor = "#333333";
    this.materials = [
      new THREE.MeshPhongMaterial({ color: textColor, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: textColor }), // side
    ];
    this.textGeo = new TextGeometry(this.text, {
      font: this.font,
      size: this.size ? this.size : 20,
      height: this.tickness ? this.tickness : 3,
      curveSegments: 10,
    });

    this.textGeo.computeBoundingBox();

    const centerOffset =
      -0.5 * (this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x) +
      (this.leftMargin ? this.leftMargin : 0);

    this.textMesh1 = new THREE.Mesh(this.textGeo, this.materials);

    this.textMesh1.position.x = this.leftAlign
      ? -50 + (this.leftMargin ? this.leftMargin : 0)
      : centerOffset;
    this.textMesh1.position.y = this.height ? this.height : 30;
    this.textMesh1.position.z = 0;

    this.textMesh1.rotation.x = 0;
    this.textMesh1.rotation.y = Math.PI * 2;

    this.group.add(this.textMesh1);
  };

  refreshText = () => {
    this.group.remove(this.textMesh1);

    this.createText();
  };

  loadFont = () => {
    const loader = new FontLoader();
    loader.load("fonts/helvetiker_bold.typeface.json", (response) => {
      this.font = response;

      this.refreshText();
    });
  };
}
