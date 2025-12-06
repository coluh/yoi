// import { getIdea, getIdeaList } from "./api/ideas";
import "./style.css";

import * as THREE from "three";
import { CustomControls } from "./controls/CustomControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { randomGaussian, randomGaussianSingle } from "./utils/random";
import type { IdeaList } from "./api/types";
import { getIdea, getIdeaList } from "./api/ideas";
import { marked } from "marked";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

const controls = new CustomControls(camera, renderer.domElement);

const indicator = document.getElementById("indicator")!;
const indicatorText = document.getElementById("indicatorText")!;
const markdownPanel = document.getElementById("markdownPanel")!;

const markedRenderer = new marked.Renderer();
markedRenderer.image = ({ href, title, text }): string => {
  const newHref = `/api/ideas/${href}`;
  return `<img src="${newHref}" alt="${text}" ${title}?"title=${title}":""} />`;
};

function showPanel(title: string) {
  markdownPanel.style.display = "block";
  if (markdownPanel.classList.contains("hidden")) {
    markdownPanel.classList.remove("hidden");
  }
  getIdea(title).then(async (idea) => {
    const markdownText = idea.content;
    // 解析 Markdown 并渲染为 HTML
    const htmlContent = await marked.parse(markdownText, { renderer: markedRenderer });
    markdownPanel.innerHTML = htmlContent;
  });
}

function hidePanel() {
  if (!markdownPanel.classList.contains("hidden")) {
    markdownPanel.classList.add("hidden");
  }
}

renderer.domElement.addEventListener("wheel", () => {
  hidePanel();
});
renderer.domElement.addEventListener("mousedown", () => {
  hidePanel();
});

class IdeaStars {
  ideas: IdeaList;
  mesh: THREE.InstancedMesh;
  domElement: HTMLElement;

  scale: number = 0.3;
  radius: number = 50;
  thickness: number = 10;

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  // for lerp
  cameraTarget = camera.position.clone();
  focus = 0;
  flying = false;

  constructor(ideas: IdeaList, domElement: HTMLElement) {
    this.ideas = ideas;
    this.domElement = domElement;

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const count = this.ideas.titles.length;
    this.mesh = new THREE.InstancedMesh(sphereGeometry, material, count);

    this.initInstances();
    this.setupEventListeners();
  }

  initInstances() {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion().identity();
    const scale = new THREE.Vector3(0.3, 0.3, 0.3);

    this.ideas.titles.forEach((_, index) => {
      const { z0, z1 } = randomGaussian();
      position.x = z0 * 50;
      position.y = z1 * 50;
      const z2 = randomGaussianSingle();
      const r2 = z0 * z0 + z1 * z1;
      const h = Math.exp(-r2);
      position.z = h * z2 * 10;

      matrix.compose(position, quaternion, scale);
      this.mesh.setMatrixAt(index, matrix);
    });

    this.mesh.instanceMatrix.needsUpdate = true;
  }

  setupEventListeners() {
    this.domElement.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.domElement.addEventListener("click", (e) => this.onClick(e));
    this.domElement.addEventListener("dblclick", (e) => this.onDoubleClick(e));
  }

  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObject(this.mesh);
    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId!;
      this.focus = instanceId;
      const title = this.ideas.titles[instanceId];
      indicatorText.textContent = title;
      indicator.classList.remove("hidden");
      indicator.style.left = `${event.clientX + 10}px`;
      indicator.style.top = `${event.clientY}px`;
    } else {
      if (!indicator.classList.contains("hidden")) {
        indicator.classList.add("hidden");
      }
    }
  }

  onClick(event: PointerEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObject(this.mesh);
    if (intersects.length > 0) {
      // const instanceId = intersects[0].instanceId!;
      // TODO: fix the indicator position
    }
  }

  onDoubleClick(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObject(this.mesh);
    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId!;
      const matrix = new THREE.Matrix4();
      this.mesh.getMatrixAt(instanceId, matrix);
      const target = new THREE.Vector3();
      target.setFromMatrixPosition(matrix);
      target.add(camera.position.clone().sub(target).normalize().multiplyScalar(2));
      this.cameraTarget.copy(target);
      this.flying = true;
    }
  }

  update() {
    if (this.flying) {
      camera.position.lerp(this.cameraTarget, 0.2);
      if (camera.position.distanceTo(this.cameraTarget) <= 0.05) {
        this.flying = false;
        showPanel(this.ideas.titles[this.focus]);
      }
    }
  }
}

const data = await getIdeaList();

const ideaStars = new IdeaStars(data, renderer.domElement);
scene.add(ideaStars.mesh);

function animate() {
  controls.update();
  ideaStars.update();
  composer.render();
}
renderer.setAnimationLoop(animate);
