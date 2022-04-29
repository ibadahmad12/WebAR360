import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

var scene;
var camera;
var renderer = new THREE.WebGLRenderer();
var meshSky;
var video = document.createElement("video");
var videoTexture;
var orbitController;

function onLoad() {
  // Setup three.js WebGL renderer.
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Append the canvas element created by the renderer to #vr-container div element.
  document.getElementById("vr-container").appendChild(renderer.domElement);

  // Create a three.js scene.
  scene = new THREE.Scene();

  // Create a three.js camera. Field of View: 75, Aspect Ratio: width/height, Camera Frustum Near Plane: 1, Far Plane: 1100
  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(0, 0, 300);
  orbitController = new OrbitControls(camera, renderer.domElement);
  orbitController.update();

  //create video element
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  video.loop = true;
  video.muted = false;
  video.src = "./assets/video.mp4";
  video.crossOrigin = "";
  video.setAttribute("webkit-playsinline", "true");
  video.setAttribute("playsinline", "true");
  video.load();
  const videoPromise = video.play();

  if (videoPromise !== undefined) {
    videoPromise.then((_) => {
      video.volume = 0.6;
    });
  }

  //create video texture and add the video element to it.
  videoTexture = new THREE.VideoTexture(video);
  //How the texture is sampled when a texel covers less than one pixel.
  videoTexture.minFilter = THREE.LinearFilter;
  //How the texture is sampled when a texel covers more than one pixel.
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;
  // Create the sky as a ball with video textures inside of the ball, and the user is in the center of it.
  // The radius of the ball: 500,
  // Width Segments:60, Height Segments: 40. This decides how smooth the ball is.
  // The geometry is like bones of the ball
  var geometrySky = new THREE.SphereBufferGeometry(500, 60, 40);
  geometrySky.scale(-1, 1, 1);

  //create material of the sky and add the video to the material
  var materialSky = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.DoubleSide,
  });
  meshSky = new THREE.Mesh(geometrySky, materialSky);
  meshSky.rotation.y = Math.PI / 2;
  scene.add(meshSky);

  window.addEventListener("resize", onResize, true);
  animate();
}

// Request animation frame loop function
function animate() {
  meshSky.rotation.y += 0.0004; //rotate automatically

  // Render the scene.
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onResize() {
  //renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener("load", onLoad);
