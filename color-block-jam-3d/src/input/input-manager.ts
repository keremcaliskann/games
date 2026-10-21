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

  private isPointerDown = false;
  private startScreenX = 0;
  private startScreenY = 0;
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
    this.startScreenX = e.clientX;
    this.startScreenY = e.clientY;
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
      }
    }
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.isPointerDown) return;

    if (this.activeBlock && !this.isSwiped) {
      const deltaX = e.clientX - this.startScreenX;
      const deltaY = e.clientY - this.startScreenY;
      const dist = Math.hypot(deltaX, deltaY);

      // 20px threshold for responsive swipe detection
      if (dist >= 20) {
        this.isSwiped = true;

        // Camera-relative swipe projection:
        // Reads camera orientation on the ground XZ plane so screen swipes match player view
        this.camera.updateMatrixWorld();
        const m = this.camera.matrixWorld.elements;
        const camRightX = m[0];
        const camRightZ = m[2];
        const camForwardX = -m[8];
        const camForwardZ = -m[10];

        // Screen coordinates: +deltaX is Screen Right, -deltaY is Screen Up (forward into scene)
        const screenUp = -deltaY;
        const worldVecX = deltaX * camRightX + screenUp * camForwardX;
        const worldVecZ = deltaX * camRightZ + screenUp * camForwardZ;

        // Project world vector onto cardinal grid axes:
        // Grid +X is World +X (1, 0)
        // Grid -X is World -X (-1, 0)
        // Grid +Y is World +Z (0, 1)
        // Grid -Y is World -Z (0, -1)
        let dirX = 0;
        let dirY = 0;

        if (Math.abs(worldVecX) > Math.abs(worldVecZ)) {
          dirX = worldVecX > 0 ? 1 : -1;
          dirY = 0;
        } else {
          dirX = 0;
          dirY = worldVecZ > 0 ? 1 : -1;
        }

        const block = this.activeBlock;
        this.activeBlock = null;
        this.callbacks.onBlockSwipe(block, dirX, dirY);
      }
    } else if (!this.activeBlock) {
      // Free drag on empty space / board: rotate camera smoothly around 3D stage
      const dx = e.clientX - this.lastScreenX;
      const dy = e.clientY - this.lastScreenY;
      this.lastScreenX = e.clientX;
      this.lastScreenY = e.clientY;
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
