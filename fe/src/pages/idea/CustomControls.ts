import * as THREE from "three";

export class CustomControls {
  isPanning: boolean = false;
  camera: THREE.Camera;
  domElement: HTMLElement;

  // 移动相关
  moveSpeed: number = 10;
  scrollDelta: number = 0;

  // 鼠标相关
  mouseSensitivity: number = 0.005;
  isMouseDown: boolean = false;
  lastMouseX: number = 0;
  lastMouseY: number = 0;

  // 四元数用于自由旋转
  quat: THREE.Quaternion = new THREE.Quaternion();
  quatX: THREE.Quaternion = new THREE.Quaternion();
  quatY: THREE.Quaternion = new THREE.Quaternion();

  // 临时变量
  forward: THREE.Vector3 = new THREE.Vector3();

  constructor(camera: THREE.Camera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.domElement.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.domElement.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.domElement.addEventListener("mouseup", () => this.onMouseUp());
    this.domElement.addEventListener("wheel", (e) => this.onMouseWheel(e), false);
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  private onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    // 累积滚轮值，保持平滑
    this.scrollDelta += event.deltaY * 0.001;
  }

  private onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.isPanning = event.shiftKey;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isMouseDown) return;

    const deltaX = event.clientX - this.lastMouseX;
    const deltaY = event.clientY - this.lastMouseY;

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    // 获取摄像机的本地坐标轴
    const cameraUp = new THREE.Vector3();
    const cameraRight = new THREE.Vector3();
    this.camera.getWorldDirection(this.forward);
    this.camera.up.normalize();
    cameraUp.copy(this.camera.up).applyQuaternion(this.camera.quaternion).normalize();
    cameraRight.crossVectors(this.forward, cameraUp).normalize();

    if (this.isPanning) {
      // 平移模式：shift+拖拽
      // 计算平移距离，缩放可调
      const panSpeed = 0.05;
      this.camera.position.addScaledVector(cameraRight, -deltaX * panSpeed);
      this.camera.position.addScaledVector(cameraUp, deltaY * panSpeed);
    } else {
      // 旋转模式：普通拖拽
      // yaw: 绕摄像机自身up轴旋转
      this.quatY.setFromAxisAngle(cameraUp, -deltaX * this.mouseSensitivity);
      // pitch: 绕摄像机自身right轴旋转
      this.quatX.setFromAxisAngle(cameraRight, -deltaY * this.mouseSensitivity);

      // 应用旋转（先yaw后pitch）
      this.quat.multiplyQuaternions(this.quatY, this.camera.quaternion);
      this.quat.multiplyQuaternions(this.quatX, this.quat);
      this.camera.quaternion.copy(this.quat);
    }
  }

  private onMouseUp() {
    this.isMouseDown = false;
  }

  update() {
    // 获取摄像机的前方向
    this.camera.getWorldDirection(this.forward);

    // 处理滚轮前进后退（平滑衰减）
    if (Math.abs(this.scrollDelta) > 0.0001) {
      this.camera.position.addScaledVector(this.forward, -this.moveSpeed * this.scrollDelta);
      // 应用摩擦力使其平滑衰减
      this.scrollDelta *= 0.85;
    } else {
      this.scrollDelta = 0;
    }
  }

  dispose() {
    this.domElement.removeEventListener("mousedown", (e) => this.onMouseDown(e));
    this.domElement.removeEventListener("mousemove", (e) => this.onMouseMove(e));
    this.domElement.removeEventListener("mouseup", () => this.onMouseUp());
    this.domElement.removeEventListener("wheel", (e) => this.onMouseWheel(e));
  }
}
