<template>
  <div>
    <div id="CesiumContainer"></div>
    <div id="ThreeContainer"></div>
  </div>
</template>

<script>
// Threejs
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeMeshObject from "@/utils/ThreeMeshObject.js";
// 几何体存储数组
let _3Dobjects = [];
// threejs
let three = {
  renderer: null,
  camera: null,
  scene: null,
};
// threejs内容区域
let ThreeContainer = null;
let dodecahedronMesh = null;
// 范围
let minWGS84 = [115.23, 39.55]
let maxWGS84 = [116.23, 41.55]
export default {
  name: "CesiumView",
  components: {},
  data() {
    return {
      changeNum: -100,
    };
  },
  mounted() {
    this.initCesium(); // Initialize Cesium renderer
    this.initThree(); // Initialize Three.js renderer
    this.init3DObject(); // Initialize Three.js object mesh with Cesium Cartesian coordinate system
    this.loop(); // Looping renderer
  },
  methods: {
    // 初始化Cesium
    initCesium() {
      // const Cesium = this.Cesium
      const tileLayerGeoQ = new this.Cesium.UrlTemplateImageryProvider({
        url: globalConfig.mapURL + "/api/maps/GeoQ_colors/{z}/{y}/{x}",
        credit: "",
        minimumLevel: 0,
      });
      this.viewer = new this.Cesium.Viewer("CesiumContainer", {
        useDefaultRenderLoop: false,
        selectionIndicator: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        infoBox: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        allowTextureFilterAnisotropic: false,
        contextOptions: {
          webgl: {
            alpha: false,
            antialias: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
            depth: true,
            stencil: false,
            anialias: false,
          },
        },
        targetFrameRate: 60,
        resolutionScale: 0.1,
        orderIndependentTranslucency: true,
        imageryProvider: tileLayerGeoQ,
        baseLayerPicker: false,
        geocoder: false,
        automaticallyTrackDataSourceClocks: false,
        dataSources: null,
        clock: null,
        terrainShadows: this.Cesium.ShadowMode.DISABLED,
      });
      this.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
      let center = this.Cesium.Cartesian3.fromDegrees(
        (minWGS84[0] + maxWGS84[0]) / 2,
        (minWGS84[1] + maxWGS84[1]) / 2 - 1,
        200000
      );
      this.viewer.camera.flyTo({
        destination: center,
        orientation: {
          heading: this.Cesium.Math.toRadians(0),
          pitch: this.Cesium.Math.toRadians(-60),
          roll: this.Cesium.Math.toRadians(0),
        },
        duration: 3,
      });
    },

    // 初始化Three.js
    initThree() {
      ThreeContainer = document.getElementById("ThreeContainer");

      let fov = 45;
      let width = window.innerWidth;
      let height = window.innerHeight;
      let aspect = width / height;
      let near = 1;
      let far = 10 * 1000 * 1000;

      three.scene = new THREE.Scene();
      three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      three.renderer = new THREE.WebGLRenderer({ alpha: true });

      // let axis=new THREE.AxesHelper(1000*1000*1000);
      // three.scene.add(axis);
      ThreeContainer.appendChild(three.renderer.domElement);
    },

    // 初始化Cesium和Threejs几何体
    init3DObject() {
      //Cesium entity
      let entity = {
        name: "Polygon",
        polygon: {
          hierarchy: this.Cesium.Cartesian3.fromDegreesArray([
            minWGS84[0],
            minWGS84[1],
            maxWGS84[0],
            minWGS84[1],
            maxWGS84[0],
            maxWGS84[1],
            minWGS84[0],
            maxWGS84[1],
          ]),
          material: this.Cesium.Color.RED.withAlpha(0.2),
        },
      };
      let Polygon = this.viewer.entities.add(entity);

      //Three.js Objects
      // Lathe geometry
      // let doubleSideMaterial = new THREE.MeshNormalMaterial({
      //   side: THREE.DoubleSide,
      // });
      // let segments = 10;
      // let points = [];
      // for (let i = 0; i < segments; i++) {
      //   points.push(
      //     new THREE.Vector2(Math.sin(i * 0.2) * segments + 5, (i - 5) * 2)
      //   );
      // }
      // let geometry = new THREE.LatheGeometry(points);
      // let latheMesh = new THREE.Mesh(geometry, doubleSideMaterial);
      // latheMesh.scale.set(1500, 1500, 1500); //scale object to be visible at planet scale
      // latheMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
      // latheMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
      // let latheMeshYup = new THREE.Group();
      // latheMeshYup.add(latheMesh);
      // three.scene.add(latheMeshYup); // don’t forget to add it to the Three.js scene manually
      // console.log('latheMeshYup', latheMeshYup);

      // //Assign Three.js object mesh to our object array
      // let _3DOB = new ThreeMeshObject(
      //   latheMeshYup,
      //   minWGS84,
      //   maxWGS84
      // );
      // _3Dobjects.push(_3DOB);

      // dodecahedron
      let geometry = new THREE.DodecahedronGeometry();
      dodecahedronMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshNormalMaterial()
      );
      dodecahedronMesh.scale.set(5000, 5000, 5000); //scale object to be visible at planet scale
      dodecahedronMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
      dodecahedronMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
      let dodecahedronMeshYup = new THREE.Group();
      dodecahedronMeshYup.add(dodecahedronMesh);
      three.scene.add(dodecahedronMeshYup); // don’t forget to add it to the Three.js scene manually

      //Assign Three.js object mesh to our object array
      let _3DOB = new ThreeMeshObject(
        dodecahedronMeshYup,
        minWGS84,
        maxWGS84
      );
      _3Dobjects.push(_3DOB);
      console.log('_3Dobjects', _3Dobjects);
    },

    // 更新渲染Cesium
    renderCesium() {
      this.viewer.render();
    },

    // 更新渲染threejs
    renderThreeObj() {
      // register Three.js scene with Cesium
      three.camera.fov = this.Cesium.Math.toDegrees(
        this.viewer.camera.frustum.fovy
      ); // ThreeJS FOV is vertical
      three.camera.updateProjectionMatrix();

      let cartToVec = function (cart) {
        return new THREE.Vector3(cart.x, cart.y, cart.z);
      };

      // Configure Three.js meshes to stand against globe center position up direction
      for (let id in _3Dobjects) {
        minWGS84 = _3Dobjects[id].minWGS84;
        maxWGS84 = _3Dobjects[id].maxWGS84;
        // convert lat/long center position to Cartesian3
        let center = this.Cesium.Cartesian3.fromDegrees(
          (minWGS84[0] + maxWGS84[0]) / 2,
          (minWGS84[1] + maxWGS84[1]) / 2
        );

        // get forward direction for orienting model
        let centerHigh = this.Cesium.Cartesian3.fromDegrees(
          (minWGS84[0] + maxWGS84[0]) / 2,
          (minWGS84[1] + maxWGS84[1]) / 2,
          1
        );

        // use direction from bottom left to top left as up-vector
        let bottomLeft = cartToVec(
          this.Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1])
        );
        let topLeft = cartToVec(
          this.Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1])
        );
        let latDir = new THREE.Vector3()
          .subVectors(bottomLeft, topLeft)
          .normalize();

        // configure entity position and orientation
        _3Dobjects[id].threeMesh.position.copy(center);
        _3Dobjects[id].threeMesh.lookAt(centerHigh.x, centerHigh.y, centerHigh.z);
        _3Dobjects[id].threeMesh.up.copy(latDir);
      }


      // Clone Cesium Camera projection position so the
      // Three.js Object will appear to be at the same place as above the Cesium Globe
      three.camera.matrixAutoUpdate = false;
      let cvm = this.viewer.camera.viewMatrix;
      let civm = this.viewer.camera.inverseViewMatrix;
      three.camera.lookAt(0, 0, 0);
      three.camera.matrixWorld.set(
        civm[0],
        civm[4],
        civm[8],
        civm[12],
        civm[1],
        civm[5],
        civm[9],
        civm[13],
        civm[2],
        civm[6],
        civm[10],
        civm[14],
        civm[3],
        civm[7],
        civm[11],
        civm[15]
      );
      three.camera.matrixWorldInverse.set(
        cvm[0],
        cvm[4],
        cvm[8],
        cvm[12],
        cvm[1],
        cvm[5],
        cvm[9],
        cvm[13],
        cvm[2],
        cvm[6],
        cvm[10],
        cvm[14],
        cvm[3],
        cvm[7],
        cvm[11],
        cvm[15]
      );

      let width = ThreeContainer.clientWidth;
      let height = ThreeContainer.clientHeight;
      let aspect = width / height;
      three.camera.aspect = aspect;
      three.camera.updateProjectionMatrix();

      three.renderer.setSize(width, height);
      three.renderer.render(three.scene, three.camera);
    },

    // 改变位置
    changePosition() {
      if (dodecahedronMesh.position.z <= 0) {
        this.changeNum = 100
      } else if (dodecahedronMesh.position.z > 15000) {
        this.changeNum = -100
      }
      const time = performance.now() * 0.001;
      dodecahedronMesh.position.z += this.changeNum * Math.abs(Math.sin(time))
      dodecahedronMesh.position.x += this.changeNum * Math.abs(Math.sin(time))
    },

    loop() {
      requestAnimationFrame(this.loop);
      this.changePosition()
      this.renderCesium();
      this.renderThreeObj();
    },
  },
};
</script>

<style lang="scss" scoped>
#CesiumContainer,
#ThreeContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}
// #CesiumContainer {
//   z-index: 2;
// }
#ThreeContainer {
  pointer-events:none;
  z-index: 999;
}
</style>