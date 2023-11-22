import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { gsap } from "gsap";
import {
  animationEase,
  pathLength,
  startingPoint,
  visiualDepth,
} from "./constants";

export class Environment {
  constructor(timeline, onScroll, onLoading) {
    this.onScroll = onScroll;
    this.timeline = timeline;
    this.onLoading = onLoading;
    this.createRenderer();
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#F4F4F4");

    this.createCamera();
    this.createControls();

    // reflectors/mirrors
    // this.createMirror();

    // walls
    this.createWalls();

    // lights
    this.createLight();
    window.addEventListener("resize", this.onWindowResize);

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };
    this.position = new THREE.Vector3(0, 0, pathLength);

    this.createPath();
    this.onWheel();
    this.stop = false;

    this.animate();
  }

  createControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.screenSpacePanning = false;
    this.controls.enablePan = false;
    this.controls.enableRotate = false;

    this.controls.panSpeed = 0;
  };

  createCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      visiualDepth
    );
    // this.camera.position.set(0, 0, pathLength);
  };

  createRenderer = () => {
    const container = document.getElementById("container");

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);
  };

  createMirror = () => {
    this.mirrorwidth = 400;
    let geometry = new THREE.PlaneGeometry(100, pathLength);
    this.mirror = new Reflector(geometry, {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      //   color: 0xc1cbcb,
      color: "#FF0000",
    });
    this.mirror.rotateX(-Math.PI / 2);
    this.mirror.position.y = -20;
    this.mirror.position.z = pathLength * 1.5;
    this.scene.add(this.mirror);
  };

  createLight = () => {
    const sunLight = new THREE.DirectionalLight("#ffffff", 3);
    sunLight.castShadow = true;
    sunLight.shadow.camera.far = 20;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.normalBias = 0.05;
    sunLight.position.set(0.5, 0.5, 1);
    this.scene.add(sunLight);
    let ambientLight = new THREE.AmbientLight("#ffffff", 1);
    this.scene.add(ambientLight);
    // const pointLight = new THREE.PointLight(0xff7c00, 3, 0, 0);
    // pointLight.position.set(0, 0, 100);
    // this.scene.add(pointLight);
    ambientLight = new THREE.AmbientLight(0x323232, 3);
    this.scene.add(ambientLight);
  };

  createWalls = () => {
    this.planeBottom = new THREE.Mesh(
      new THREE.PlaneGeometry(100, pathLength),
      new THREE.MeshBasicMaterial({ color: "#AAB4D0" })
    );
    this.planeBottom.position.y = -30;
    this.planeBottom.position.z = pathLength * 1.5;
    this.planeBottom.rotateX(-Math.PI / 2);
    this.scene.add(this.planeBottom);

    const geometry = new THREE.BoxGeometry(3, 3, pathLength);
    const material = new THREE.MeshBasicMaterial({ color: "#A9A9A9" });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.y = -25;
    this.cube.position.z = startingPoint - pathLength / 2;
    this.scene.add(this.cube);
  };

  createPath = () => {
    this.curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, pathLength + pathLength / 2),
      new THREE.Vector3(0, 0, 0)
    );

    const points = this.curve.getPoints(2);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: "#3aa3ff",
      linewidth: 9,
    });
    const curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // this.mirror
    //   .getRenderTarget()
    //   .setSize(
    //     window.innerWidth * window.devicePixelRatio,
    //     window.innerHeight * window.devicePixelRatio
    //   );

    // this.planeBottom
    //   .getRenderTarget()
    //   .setSize(
    //     window.innerWidth * window.devicePixelRatio,
    //     window.innerHeight * window.devicePixelRatio
    //   );
  };

  stopAnimation = () => {
    this.stop = true;
  };

  startAnimation = () => {
    this.stop = false;
    this.animate();
  };

  animate = () => {
    if (!this.stop) {
      requestAnimationFrame(() => this.animate());
      this.moveCameraAlongTheCurve();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  };

  onWheel = () => {
    window.addEventListener("wheel", (e) => {
      if (!this.stop) {
        if (e.deltaY > 0) {
          this.lerp.target += animationEase;
        } else {
          this.lerp.target -= animationEase;
        }

        this.onLoading();
      }
    });
  };

  moveCameraAlongTheCurve = () => {
    this.lerp.current = gsap.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    // clamp will allow a variable between given params
    this.lerp.target = gsap.utils.clamp(0, 1, this.lerp.target);
    this.lerp.current = gsap.utils.clamp(0, 1, this.lerp.current);

    // getAtPoint function copies the [this.progress]th position to the given vector variable
    const prevPosition = this.position.z;

    this.curve.getPointAt(this.lerp.current, this.position);
    this.camera.position.copy(this.position);

    if (prevPosition.toFixed(0) !== this.position.z.toFixed(0)) {
      this.onScroll(this.camera.position.z);
    }
  };
}
