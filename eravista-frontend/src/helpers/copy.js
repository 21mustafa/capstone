import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { gsap } from "gsap";

let camera, scene, renderer;

let cameraControls;

let mirror, controls;
let lerp, position, curve;
let cubes;

const _createLights = (scene) => {
  const mainLight = new THREE.PointLight(0xe7e7e7, 2.5, 250, 0);
  mainLight.position.y = 60;
  scene.add(mainLight);

  const greenLight = new THREE.PointLight(0x00ff00, 0.5, 1000, 0);
  greenLight.position.set(550, 50, 0);
  scene.add(greenLight);

  const redLight = new THREE.PointLight(0xff0000, 0.5, 1000, 0);
  redLight.position.set(-550, 50, 0);
  scene.add(redLight);

  const blueLight = new THREE.PointLight(0xbbbbfe, 0.5, 1000, 0);
  blueLight.position.set(0, 50, 550);
  scene.add(blueLight);
};

const length = 100;
const createWalls = (scene) => {
  const planeGeo = new THREE.PlaneGeometry(100, 100);

  //   const planeTop = new THREE.Mesh(
  //     planeGeo,
  //     new THREE.MeshBasicMaterial({ color: "#F7EFE5" })
  //   );
  //   planeTop.position.y = 100;
  //   planeTop.rotateX(Math.PI / 2);
  //   scene.add(planeTop);

  //   const planeFront = new THREE.Mesh(
  //     planeGeo,
  //     new THREE.MeshBasicMaterial({ color: "#F7EFE5" })
  //   );
  //   planeFront.position.z = 50;
  //   planeFront.position.y = 50;
  //   planeFront.rotateY(Math.PI);
  //   scene.add(planeFront);

  const planeRight = new THREE.Mesh(
    planeGeo,
    new THREE.MeshBasicMaterial({ color: "#7C93C3" })
  );
  planeRight.position.x = 50;
  //   planeRight.position.y = 50;
  planeRight.rotateY(-Math.PI / 2);
  scene.add(planeRight);

  const planeLeft = new THREE.Mesh(
    planeGeo,
    new THREE.MeshBasicMaterial({ color: "#7C93C3" })
  );
  planeLeft.position.x = -50;
  //   planeLeft.position.y = 50;
  planeLeft.rotateY(Math.PI / 2);
  scene.add(planeLeft);

  //   const planeBack = new THREE.Mesh(
  //     planeGeo,
  //     new THREE.MeshBasicMaterial({ color: "red" })
  //   );
  //   planeBack.position.y = length - 100;
  //   planeBack.position.z = -50;
  //   scene.add(planeBack);
};

const createLight = (scene) => {
  const sunLight = new THREE.DirectionalLight("#ffffff", 3);
  sunLight.castShadow = true;
  sunLight.shadow.camera.far = 20;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.normalBias = 0.05;
  sunLight.position.set(0.5, 0.5, 1);
  scene.add(sunLight);
  let ambientLight = new THREE.AmbientLight("#ffffff", 1);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xff7c00, 3, 0, 0);
  pointLight.position.set(0, 0, 100);
  scene.add(pointLight);
  ambientLight = new THREE.AmbientLight(0x323232, 3);
  scene.add(ambientLight);
};

const createMirror = (scene) => {
  let geometry = new THREE.PlaneGeometry(100, 100);
  mirror = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0xc1cbcb,
  });
  mirror.rotateX(-Math.PI / 2);
  mirror.position.y = -50;
  scene.add(mirror);
};

const createRenderer = () => {
  const container = document.getElementById("container");

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  return renderer;
};

const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.z = 0;
  //   camera.position.y = ;
  //   camera.position.x = 1000;

  //   cameraControls = new OrbitControls(camera, renderer.domElement);
  //   cameraControls.target.set(0, 40, 0);
  //   cameraControls.maxDistance = 400;
  //   cameraControls.minDistance = 10;
  //   cameraControls.update();

  return camera;
};

const createControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = true;
  //   controls.maxDistance = ;
  //   controls.minDistance = 0;

  return controls;
};

export const Mirror = () => {
  init();

  animate();
};

const moveCameraAlongTheCurve = () => {
  lerp.current = gsap.utils.interpolate(lerp.current, lerp.target, lerp.ease);

  // clamp will allow a variable between given params
  lerp.target = gsap.utils.clamp(0, 1, lerp.target);
  lerp.current = gsap.utils.clamp(0, 1, lerp.current);

  // getAtPoint function copies the [this.progress]th position to the given vector variable
  curve.getPointAt(lerp.current, position);

  camera.position.copy(position);
};

function init() {
  renderer = createRenderer();
  // scene
  scene = new THREE.Scene();
  //   scene.background = new THREE.Color("#F7EFE5");

  // camera
  camera = createCamera();

  controls = createControls(camera, renderer);

  // reflectors/mirrors
  createMirror(scene);

  // walls
  createWalls(scene);

  // lights
  createLight(scene);
  window.addEventListener("resize", onWindowResize);

  lerp = {
    current: 0,
    target: 0,
    ease: 0.1,
  };
  position = new THREE.Vector3(0, 0, 0);

  createPath(scene);
  onWheel();
  createObjects();
}

const onWheel = () => {
  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
      if (lerp.target + 0.05 < 1) {
        lerp.target += 0.05;
      }
    } else {
      lerp.target -= 0.05;
    }
  });
};

const createPath = (scene) => {
  curve = new THREE.CatmullRomCurve3(
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 200)],
    false
  );

  const points = curve.getPoints(500);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: "#3aa3ff" });
  const curveObject = new THREE.Line(geometry, material);
  scene.add(curveObject);
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  mirror
    .getRenderTarget()
    .setSize(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );
}

function animate() {
  requestAnimationFrame(animate);
  moveCameraAlongTheCurve();
  renderer.render(scene, camera);
}

function createObjects() {
  const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  };

  const getRandomNumber = (max, min = 0) => {
    return Math.random() * (max - min) + min;
  };

  cubes = [];
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 1; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: generateRandomColor(),
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = getRandomNumber(100, -50);
    cube.position.y = getRandomNumber(100, -50);
    cube.position.z = getRandomNumber(150, -50);
    scene.add(cube);
    cubes.push(cube);
  }
}
