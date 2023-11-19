import * as THREE from "three";
import EventEmitter from "events";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
import Sizes from "./Sizes";
import Time from "./Time";
import { Mirror } from "./Mirror";

export default class Environment extends EventEmitter {
  constructor() {
    super();
    this.sizes = new Sizes();
    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time = new Time();
    this.time.on("update", () => {
      this.update();
    });

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.createPerspectiveCamera();
    this.createOrthographicCamera();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(this.sizes.pixelRatio);

    document.getElementById("container").innerHTML = "";
    document.getElementById("container").appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "canvas";

    this.createObjects();

    this.createLight();

    this.setControls();
    this.setDebugger();

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };
    this.position = new THREE.Vector3(0, 0, 0);
    this.lookAtPosition = new THREE.Vector3(0, 0, 0);

    this.createPath();
    this.onWheel();
    this.back = true;
  }

  createObjects() {
    const generateRandomColor = () => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      return "#" + randomColor;
    };

    const getRandomNumber = (max, min = 0) => {
      return Math.random() * (max - min) + min;
    };

    this.cubes = [];
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 1; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: this.generateRandomColor(),
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = this.getRandomNumber(100, -50);
      cube.position.y = this.getRandomNumber(100, -50);
      cube.position.z = this.getRandomNumber(150, -50);
      this.scene.add(cube);
      this.cubes.push(cube);
    }
  }

  generateRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  }

  getRandomNumber(max, min = 0) {
    return Math.random() * (max - min) + min;
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      1000
    );
    this.perspectiveCamera.position.z = 35;
    this.scene.add(this.perspectiveCamera);
  }

  createOrthographicCamera() {
    // this.orthographicCamera = new THREE.OrthographicCamera(
    //     (-this.sizes.aspect * this.sizes.frustrum) / 2,
    //     (this.sizes.aspect * this.sizes.frustrum) / 2,
    //     this.sizes.frustrum / 2,
    //     -this.sizes.frustrum / 2,
    //     -10,
    //     10
    // );

    this.orthographicCamera = new THREE.PerspectiveCamera(
      70,
      this.sizes.aspect,
      0.1,
      1000
    );
    this.scene.add(this.orthographicCamera);
  }

  resize() {
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    this.orthographicCamera.left =
      (-this.sizes.aspect * this.sizes.frustrum) / 2;
    this.orthographicCamera.right =
      (this.sizes.aspect * this.sizes.frustrum) / 2;
    this.orthographicCamera.top = this.sizes.frustrum / 2;
    this.orthographicCamera.bottom = -this.sizes.frustrum / 2;
    this.orthographicCamera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.moveCameraAlongTheCurve();

    this.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height);
    this.renderer.render(this.scene, this.orthographicCamera);
    // second screen
    this.renderer.setScissorTest(true);
    this.renderer.setViewport(
      this.sizes.width - this.sizes.width / 3,
      this.sizes.height - this.sizes.height / 3,
      this.sizes.width / 3,
      this.sizes.height / 3
    );
    this.renderer.setScissor(
      this.sizes.width - this.sizes.width / 3,
      this.sizes.height - this.sizes.height / 3,
      this.sizes.width / 3,
      this.sizes.height / 3
    );
    this.renderer.render(this.scene, this.perspectiveCamera);
    this.renderer.setScissorTest(false);
  }

  createLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(0.5, 0.5, 1);
    this.scene.add(this.sunLight);
    this.ambientLight = new THREE.AmbientLight("#ffffff", 1);
    this.scene.add(this.ambientLight);
    this.pointLight = new THREE.PointLight(0xff7c00, 3, 0, 0);
    this.pointLight.position.set(0, 0, 100);
    this.scene.add(this.pointLight);
    this.ambientLight = new THREE.AmbientLight(0x323232, 3);
    this.scene.add(this.ambientLight);
  }

  setControls() {
    this.controls = new OrbitControls(
      this.perspectiveCamera,
      this.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
  }

  setDebugger() {
    const size = 20;
    const divisions = 20;
    // const gridHelper = new THREE.GridHelper(size, divisions);
    // this.scene.add(gridHelper)

    // const axesHelper = new THREE.AxesHelper(100);
    // this.scene.add(axesHelper);

    // const cameraLightHelper = new THREE.CameraHelper(this.sunLight.shadow.camera);
    // this.scene.add(cameraLightHelper)

    // this.orthoCameraHelper = new THREE.CameraHelper(this.orthographicCamera);
    // this.scene.add(this.orthoCameraHelper)
  }

  moveCameraAlongTheCurve() {
    // this.orthoCameraHelper.matrixWorldNeedsUpdate = true;
    // this.orthoCameraHelper.update();
    // this.orthoCameraHelper.position.copy(this.orthographicCamera.position);
    // this.orthoCameraHelper.rotation.copy(this.orthographicCamera.rotation);
    if (this.lerp.current + 0.0001 < 1 || this.back) {
      this.lerp.current = gsap.utils.interpolate(
        this.lerp.current,
        this.lerp.target,
        this.lerp.ease
      );
      if (this.back) {
        // to make the cameroa move automatically
        this.lerp.target -= 0.001;
      } else {
        // to make the cameroa move automatically
        this.lerp.target += 0.001;
      }

      // clamp will allow a variable between given params
      this.lerp.target = gsap.utils.clamp(0, 1, this.lerp.target);
      this.lerp.current = gsap.utils.clamp(0, 1, this.lerp.current);

      // getAtPoint function copies the [this.progress]th position to the given vector variable
      this.curve.getPointAt(this.lerp.current, this.position);

      this.curve.getPointAt(
        gsap.utils.clamp(0, 1, this.lerp.current + 0.000001),
        this.lookAtPosition
      );

      this.orthographicCamera.position.copy(this.position);
      this.orthographicCamera.lookAt(this.lookAtPosition);
    }
  }

  createPath() {
    this.curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 60),
        // new THREE.Vector3(200, 50, 100),
        // new THREE.Vector3(100, 50, 100),
        // new THREE.Vector3(50, 50, 100),
        // new THREE.Vector3(20, 50, 20),
        // new THREE.Vector3(-20, 30, -20),
        // new THREE.Vector3(-25, 0, -25),
        // new THREE.Vector3(-40, -1, -40),
        // new THREE.Vector3(45, -1, -40),
      ],
      false
    );

    const points = this.curve.getPoints(500);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#3aa3ff" });
    const curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);
  }

  onWheel() {
    window.addEventListener("wheel", (e) => {
      if (e.deltaY > 0) {
        if (this.lerp.target + 0.05 < 1) {
          this.lerp.target += 0.05;
        }

        this.back = false;
      } else {
        this.lerp.target -= 0.05;
        this.back = true;
      }
    });
  }
}
