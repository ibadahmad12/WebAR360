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

    scene = new THREE.Scene();

    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 300);
    orbitController = new OrbitControls(camera, renderer.domElement);
    orbitController.update();

    //create video element
    video.width = window.innerWidth;
    video.height = window.innerHeight;
    video.loop = true;
    video.muted = true;
    video.src = "/assets/video.mp4";

    video.crossOrigin = "";
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("playsinline", "true");
    video.load();
    video.play();

    document.getElementById("switch-vid-btn").addEventListener("click", () => {
        video.src = video.src.split("/")[video.src.split("/").length - 1] === "video.mp4" ? "/assets/maverick.mp4" : "/assets/video.mp4";
        video.load();
        video.muted = false;
        video.play();
    });

    document.getElementById("unmuteButton").addEventListener("click", () => {
        video.muted = false;
    });

    videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    var geometrySky = new THREE.SphereBufferGeometry(500, 60, 40);
    geometrySky.scale(-1, 1, 1);

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

function animate() {
    meshSky.rotation.y += 0.0004; //rotate automatically

    // Render the scene.
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener("load", onLoad);
