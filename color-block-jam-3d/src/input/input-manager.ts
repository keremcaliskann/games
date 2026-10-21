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
  private readonly swipeThreshold = 18;

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

    const dx = e.clientX - this.lastScreenX;
    const dy = e.clientY - this.lastScreenY;
    this.lastScreenX = e.clientX;
    this.lastScreenY = e.clientY;

    if (this.activeBlock && !this.isSwiped) {
      const totalDx = e.clientX - this.startScreenX;
      const totalDy = e.clientY - this.startScreenY;
      const dist = Math.hypot(totalDx, totalDy);

      if (dist >= this.swipeThreshold) {
        this.isSwiped = true;
        // Determine primary swipe direction mapped to grid coordinates
        let dirX = 0;
        let dirY = 0;

        if (Math.abs(totalDx) > Math.abs(totalDy)) {
          // Horizontal movement along grid X
          dirX = totalDx > 0 ? 1 : -1;
        } else {
          // Vertical movement along grid Y (screen up -> grid -Y; screen down -> grid +Y)
          dirY = totalDy > 0 ? 1 : -1;
        }

        const block = this.activeBlock;
        this.activeBlock = null;
        this.callbacks.onBlockSwipe(block, dirX, dirY);
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
