import {
  Box3,
  CanvasTexture,
  CircleGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type Vec3 = [number, number, number];

interface BlockSpec {
  color: number;
  size: [number, number, number];
  radius: number;
  spreadPos: Vec3;
  spreadRot: Vec3;
  stackPos: Vec3;
  phase: number;
}

const CORAL = 0xff6b4a;
const SUNFLOWER = 0xffc93c;
const TEAL = 0x14b8a6;

const BLOCKS: BlockSpec[] = [
  {
    color: CORAL,
    size: [2.5, 1, 0.95],
    radius: 0.34,
    spreadPos: [-0.2, 1.05, 0.35],
    spreadRot: [0.28, 0.55, 0.42],
    stackPos: [0, 0.78, 0.08],
    phase: 0,
  },
  {
    color: SUNFLOWER,
    size: [0.75, 1.84, 0.95],
    radius: 0.28,
    spreadPos: [1.05, 0.05, -0.2],
    spreadRot: [0.45, -0.35, 1.05],
    stackPos: [-0.875, -0.48, 0],
    phase: 1.4,
  },
  {
    color: TEAL,
    size: [0.75, 1.84, 0.95],
    radius: 0.28,
    spreadPos: [-1.05, -0.85, 0.25],
    spreadRot: [-0.3, 0.4, -0.75],
    stackPos: [0.875, -0.48, 0],
    phase: 2.6,
  },
];

function cssHex(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  try {
    return new Color(raw).getHex();
  } catch {
    return fallback;
  }
}

function cssNumber(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

export function mountHero(
  canvas: HTMLCanvasElement,
  section: HTMLElement,
  onLost: () => void,
): (() => void) | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
  } catch {
    return null;
  }

  if (!renderer.getContext()) {
    renderer.dispose();
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 80);
  camera.position.set(0, 0, 12);
  camera.lookAt(0, 0, 0);

  scene.add(new HemisphereLight(cssHex("--light-sky", 0xfff8ef), cssHex("--light-ground", 0xd9d0c3), 1.15));
  const key = new DirectionalLight(0xffffff, 1.7);
  key.position.set(3.4, 5.4, 6.2);
  scene.add(key);
  const fill = new DirectionalLight(0xffffff, 0.45);
  fill.position.set(-4.2, 1.4, -2.2);
  scene.add(fill);

  const group = new Group();
  scene.add(group);

  const meshes: Mesh[] = [];
  const geometries: RoundedBoxGeometry[] = [];
  const materials: MeshStandardMaterial[] = [];
  const blockColors = [
    cssHex("--block-a", CORAL),
    cssHex("--block-b", SUNFLOWER),
    cssHex("--block-c", TEAL),
  ];
  const emissive = cssNumber("--block-emissive", 0);
  const roughness = cssNumber("--block-roughness", 0.46);

  for (const [index, spec] of BLOCKS.entries()) {
    const color = blockColors[index] ?? spec.color;
    const geometry = new RoundedBoxGeometry(spec.size[0], spec.size[1], spec.size[2], 3, spec.radius);
    const material = new MeshStandardMaterial({
      color,
      roughness,
      metalness: emissive > 0 ? 0.08 : 0.02,
      emissive: color,
      emissiveIntensity: emissive,
    });
    const mesh = new Mesh(geometry, material);
    group.add(mesh);
    meshes.push(mesh);
    geometries.push(geometry);
    materials.push(material);
  }

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const shadowCtx = shadowCanvas.getContext("2d");
  let shadowGeo: CircleGeometry | null = null;
  let shadowMat: MeshBasicMaterial | null = null;
  if (shadowCtx) {
    const gradient = shadowCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    const shadowTint = getComputedStyle(document.documentElement).getPropertyValue("--shadow-color").trim();
    gradient.addColorStop(0, shadowTint || "rgba(30, 27, 75, 0.16)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    shadowCtx.fillStyle = gradient;
    shadowCtx.fillRect(0, 0, 128, 128);
    const texture = new CanvasTexture(shadowCanvas);
    shadowGeo = new CircleGeometry(1.7, 40);
    shadowMat = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
    const shadow = new Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.55;
    group.add(shadow);
  }

  const timer = new Timer();
  timer.connect(document);
  const pointer = { x: 0, y: 0 };
  let frame = 0;
  let running = false;
  let visible = true;
  let sized = false;

  const bounds = new Box3();
  const corner = new Vector3();

  function applyPose(snap: number, elapsed: number): void {
    const settled = MathUtils.clamp(snap, 0, 1);
    const floatAmp = 1 - settled;
    BLOCKS.forEach((spec, index) => {
      const mesh = meshes[index];
      if (!mesh) return;
      mesh.position.set(
        MathUtils.lerp(spec.spreadPos[0], spec.stackPos[0], snap),
        MathUtils.lerp(spec.spreadPos[1], spec.stackPos[1], snap) +
          Math.sin(elapsed * 0.9 + spec.phase) * 0.07 * floatAmp,
        MathUtils.lerp(spec.spreadPos[2], spec.stackPos[2], snap),
      );
      mesh.rotation.set(
        MathUtils.lerp(spec.spreadRot[0], 0, snap),
        MathUtils.lerp(spec.spreadRot[1], 0, snap),
        MathUtils.lerp(spec.spreadRot[2], 0, snap),
      );
    });
  }

  function spreadRadius(): number {
    group.rotation.set(0, 0, 0);
    applyPose(0, 0);
    group.updateMatrixWorld(true);
    let max = 0;
    for (const mesh of meshes) {
      bounds.setFromObject(mesh);
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) {
            corner.set(x, y, z);
            max = Math.max(max, corner.length());
          }
        }
      }
    }
    return max + 0.16;
  }

  function frameCamera(): void {
    const radius = spreadRadius();
    const vFov = MathUtils.degToRad(camera.fov);
    const aspect = Math.max(camera.aspect || 1, 0.6);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distance = Math.max(radius / Math.sin(vFov / 2), radius / Math.sin(hFov / 2)) * 1.22;
    camera.position.set(0, 0, distance);
    camera.near = Math.max(0.05, distance - radius * 4);
    camera.far = distance + radius * 6;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  function resize(): boolean {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    frameCamera();
    sized = true;
    return true;
  }

  function scrollProgress(): number {
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return 0;
    return MathUtils.clamp(-rect.top / total, 0, 1);
  }

  function render(): void {
    if (!sized && !resize()) return;
    timer.update();
    const delta = Math.min(timer.getDelta(), 0.05);
    const elapsed = timer.getElapsed();
    const snap = easeOutBack(scrollProgress());
    const settled = MathUtils.clamp(snap, 0, 1);
    applyPose(snap, elapsed);

    const tilt = 1 - settled * 0.7;
    const idle = Math.sin(elapsed * 0.28) * 0.1 * tilt;
    group.rotation.x = MathUtils.damp(group.rotation.x, pointer.y * 0.2 * tilt, 4, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, pointer.x * 0.35 * tilt + idle, 4, delta);
    renderer.render(scene, camera);
  }

  function loop(): void {
    if (!running) return;
    frame = requestAnimationFrame(loop);
    if (visible && !document.hidden) render();
  }

  function start(): void {
    if (running) return;
    running = true;
    loop();
  }

  function stop(): void {
    running = false;
    cancelAnimationFrame(frame);
  }

  function sync(): void {
    if (visible && !document.hidden) start();
    else stop();
  }

  function onPointer(event: PointerEvent): void {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  }

  function onVisibility(): void {
    sync();
  }

  function onContextLost(event: Event): void {
    event.preventDefault();
    stop();
    onLost();
  }

  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    },
    { threshold: 0.05 },
  );

  const resizeObserver = new ResizeObserver(() => {
    resize();
  });

  resize();
  render();
  intersection.observe(section);
  resizeObserver.observe(canvas);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);
  sync();

  return () => {
    stop();
    intersection.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    timer.disconnect();
    timer.dispose();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    shadowGeo?.dispose();
    shadowMat?.map?.dispose();
    shadowMat?.dispose();
    renderer.dispose();
  };
}
