import * as THREE from 'three';
import { Block } from '../game/entities/block';

export interface InputCallbacks {
  onBlockSwipe: (block: Block, dirX: number, dirY: number) => void;
  onBlockTap: (block: Block) => void;
  onOrbitDelta: (dx: number, dy: number) => void;
}

export class InputManager {
  private readonly domElement: HTMLElement;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointerNdc = new THREE.Vector2();

  private readonly groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly startPlaneHit = new THREE.Vector3();
  private readonly currentPlaneHit = new THREE.Vector3();

  private isPointerDown = false;
  private lastScreenX = 0;
  private lastScreenY = 0;

  private activeBlock: Block | null = null;
  private isSwiped = false;

  private callbacks: InputCallbacks = {
    onBlockSwipe: () => {},
    onBlockTap: () => {},
    onOrbitDelta: () => {},
  };

  private targetsProvider: () => THREE.Object3D[] = () => [];

  constructor(domElement: HTMLElement, camera: THREE.PerspectiveCamera) {
    this.domElement = domElement;
    this.camera = camera;

    this.bindEvents();
  }

  public setCallbacks(callbacks: InputCallbacks): void {
    this.callbacks = callbacks;
  }

  public setTargetsProvider(provider: () => THREE.Object3D[]): void {
    this.targetsProvider = provider;
  }

  private bindEvents(): void {
    this.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));
  }

  private isHudElement(e: PointerEvent): boolean {
    if (e.target instanceof Element && e.target.closest('[data-hud-interactive="true"]')) {
      return true;
    }
    return false;
  }

  private onPointerDown(e: PointerEvent): void {
    // 1. Mandatory HUD Pointer Isolation (Click Bleeding Safeguard)
    if (this.isHudElement(e)) {
      return;
    }

    this.isPointerDown = true;
    this.lastScreenX = e.clientX;
    this.lastScreenY = e.clientY;
    this.isSwiped = false;
    this.activeBlock = null;

    // Raycast to check if player touched a block
    const rect = this.domElement.getBoundingClientRect();
    this.pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const targets = this.targetsProvider();
    const hits = this.raycaster.intersectObjects(targets, false);

    if (hits.length > 0) {
      const hitObj = hits[0].object;
      const block = hitObj.userData.block as Block | undefined;
      if (block && block.state === 'idle') {
        this.activeBlock = block;
        // Record world ground position where drag started
        this.raycaster.ray.intersectPlane(this.groundPlane, this.startPlaneHit);
      }
    }
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.isPointerDown) return;

    const dx = e.clientX - this.lastScreenX;
    const dy = e.clientY - this.lastScreenY;
    this.lastScreenX = e.clientX;
    this.lastScreenY = e.clientY;

    if (this.activeBlock && !this.isSwiped) {
      const rect = this.domElement.getBoundingClientRect();
      const currentNdc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.raycaster.setFromCamera(currentNdc, this.camera);
      const hit = this.raycaster.ray.intersectPlane(this.groundPlane, this.currentPlaneHit);

      if (hit) {
        const deltaWorldX = this.currentPlaneHit.x - this.startPlaneHit.x;
        const deltaWorldZ = this.currentPlaneHit.z - this.startPlaneHit.z;
        const worldDist = Math.hypot(deltaWorldX, deltaWorldZ);

        // 0.45m threshold on physical 3D board plane
        if (worldDist >= 0.45) {
          this.isSwiped = true;
          let dirX = 0;
          let dirY = 0;

          // In world coordinates: Grid X is +X, Grid Y is +Z
          if (Math.abs(deltaWorldX) > Math.abs(deltaWorldZ)) {
            dirX = deltaWorldX > 0 ? 1 : -1;
            dirY = 0;
          } else {
            dirX = 0;
            dirY = deltaWorldZ > 0 ? 1 : -1;
          }

          const block = this.activeBlock;
          this.activeBlock = null;
          this.callbacks.onBlockSwipe(block, dirX, dirY);
        }
      }
    } else if (!this.activeBlock) {
      // Free drag: orbit camera around floating board
      this.callbacks.onOrbitDelta(dx, dy);
    }
  }

  private onPointerUp(_e: PointerEvent): void {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    if (this.activeBlock && !this.isSwiped) {
      const block = this.activeBlock;
      this.activeBlock = null;
      this.callbacks.onBlockTap(block);
    }
    this.activeBlock = null;
  }
}
