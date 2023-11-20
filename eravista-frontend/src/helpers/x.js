import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";
import { GPUStatsPanel } from "three/addons/utils/GPUStatsPanel.js";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import * as GeometryUtils from "three/examples/jsm/utils/GeometryUtils.js";

let line, renderer, scene, camera, controls;
let line1;
let matLine, matLineBasic, matLineDashed;
let stats, gpuPanel;
let gui;

// viewport
let insetWidth;
let insetHeight;

export function start() {
  init();
  animate();
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(-40, 0, 60);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 10;
  controls.maxDistance = 500;

  // Position and THREE.Color Data

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

  window.addEventListener("resize", onWindowResize);
  onWindowResize();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  insetWidth = window.innerHeight / 4; // square
  insetHeight = window.innerHeight / 4;
}

function animate() {
  requestAnimationFrame(animate);

  // main scene

//   renderer.setClearColor(0x000000, 0);

//   renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

  controls.update();

  // renderer will set this eventually
  matLine.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport

  renderer.render(scene, camera);

  // inset scene

  renderer.setClearColor(0x222222, 1);

  renderer.clearDepth(); // important!
}
