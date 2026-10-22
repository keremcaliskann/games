import * as THREE from 'three';
import { CameraRig } from '../render/camera-rig';
import { HexGrid, HexCell } from '../game/entities/hex-grid';
import { TraySpawner, TraySlot } from '../game/entities/tray-spawner';
import { TileStack } from '../game/entities/tile-stack';
import { SoundController } from '../core/audio';
import { PrefabFactory } from '../render/PrefabFactory';

export type InputMode = 'normal' | 'hammer' | 'move_stack';

export class InputManager {
  private readonly domElement: HTMLElement;
  private readonly cameraRig: CameraRig;
  private readonly grid: HexGrid;
  private readonly tray: TraySpawner;
  private readonly audio: SoundController;

  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly planeIntersect = new THREE.Vector3();

  // Active Drag State
  private isPointerDown = false;
  private draggedStack: TileStack | null = null;
  private originSlot: TraySlot | null = null;
  private originCell: HexCell | null = null;
  private hoveredCell: HexCell | null = null;

  // Boosters & Modes
  public mode: InputMode = 'normal';

  // Callbacks
  private onStackPlacedCallback: (cell: HexCell) => void = () => {};
  private onHammerUsedCallback: (cell: HexCell) => void = () => {};

  constructor(
    domElement: HTMLElement,
    cameraRig: CameraRig,
    grid: HexGrid,
    tray: TraySpawner,
    audio: SoundController
  ) {
    this.domElement = domElement;
    this.cameraRig = cameraRig;
    this.grid = grid;
    this.tray = tray;
    this.audio = audio;

    this.bindEvents();
  }

  public setCallbacks(
    onStackPlaced: (cell: HexCell) => void,
    onHammerUsed: (cell: HexCell) => void
  ): void {
    this.onStackPlacedCallback = onStackPlaced;
    this.onHammerUsedCallback = onHammerUsed;
  }

  private bindEvents(): void {
    const el = this.domElement;

    el.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp, { passive: false });
    window.addEventListener('pointercancel', this.onPointerUp, { passive: false });
  }

  public updatePointer(clientX: number, clientY: number): void {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.cameraRig.camera);
  }

  private onPointerDown = (e: PointerEvent): void => {
    // If target has interactive HUD attribute, ignore 3D raycast
    if ((e.target as HTMLElement).closest('[data-hud-interactive="true"]')) {
      return;
    }

    this.isPointerDown = true;
    this.updatePointer(e.clientX, e.clientY);

    if (this.raycaster.ray.intersectPlane(this.groundPlane, this.planeIntersect)) {
      const hitX = this.planeIntersect.x;
      const hitZ = this.planeIntersect.z;

      // 1. Hammer Mode: tap cell to smash stack
      if (this.mode === 'hammer') {
        const target = this.grid.findSnapTarget(hitX, hitZ, 1.2);
        if (target && !target.stack.isEmpty()) {
          this.mode = 'normal';
          this.onHammerUsedCallback(target);
        }
        return;
      }

      // 2. Move Stack Mode: tap cell to pick up stack
      if (this.mode === 'move_stack') {
        const target = this.grid.findSnapTarget(hitX, hitZ, 1.2);
        if (target && !target.stack.isEmpty()) {
          this.mode = 'normal';
          this.originCell = target;
          this.draggedStack = target.stack;
          // Temporarily detach stack from cell
          target.cellGroup.remove(target.stack.group);
          this.draggedStack.group.position.set(hitX, 1.2, hitZ);
          this.domElement.style.cursor = 'grabbing';
        }
        return;
      }

      // 3. Normal Tray Stack Drag
      const hitSlot = this.tray.findHoveredSlot(hitX, hitZ, 1.3);
      if (hitSlot && hitSlot.stack) {
        this.originSlot = hitSlot;
        this.draggedStack = hitSlot.stack;
        hitSlot.stack = null; // Detach from tray

        // Elevate slightly for tactile grab feedback
        this.draggedStack.group.position.set(hitX, 1.2, hitZ);
        this.domElement.style.cursor = 'grabbing';
      }
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    this.updatePointer(e.clientX, e.clientY);

    if (this.isPointerDown && this.draggedStack) {
      if (this.raycaster.ray.intersectPlane(this.groundPlane, this.planeIntersect)) {
        const curX = this.planeIntersect.x;
        const curZ = this.planeIntersect.z;

        // Smooth follow under cursor with tactile lift height
        this.draggedStack.group.position.set(curX, 1.25, curZ);

        // Check snap hover on board
        const snap = this.grid.findSnapTarget(curX, curZ, 1.2);

        if (snap !== this.hoveredCell) {
          this.grid.clearHighlights();
          this.hoveredCell = snap;

          if (this.hoveredCell) {
            if (this.hoveredCell.stack.isEmpty()) {
              PrefabFactory.setCellHighlight(this.hoveredCell.innerMesh, 'valid');
            } else {
              // Highlight if top color matches
              const cellTop = this.hoveredCell.stack.getTopColor();
              const dragTop = this.draggedStack.getTopColor();
              if (cellTop && dragTop && cellTop.id === dragTop.id) {
                PrefabFactory.setCellHighlight(this.hoveredCell.innerMesh, 'hover');
              }
            }
          }
        }
      }
    }
  };

  private onPointerUp = (): void => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    this.domElement.style.cursor = 'default';

    if (this.draggedStack) {
      const snap = this.hoveredCell;

      // Rule: Can drop on empty cell, or on occupied cell if top colors match!
      let validDrop = false;
      if (snap) {
        if (snap.stack.isEmpty()) {
          validDrop = true;
        } else {
          const cellTop = snap.stack.getTopColor();
          const dragTop = this.draggedStack.getTopColor();
          if (cellTop && dragTop && cellTop.id === dragTop.id) {
            validDrop = true;
          }
        }
      }

      if (validDrop && snap) {
        // Successful Drop!
        if (snap.stack.isEmpty()) {
          // Transfer entire dragged stack to cell
          while (!this.draggedStack.isEmpty()) {
            const item = this.draggedStack.tiles.shift()!;
            snap.stack.pushTile(item.color, item.mesh);
          }
        } else {
          // Merge onto existing stack
          while (!this.draggedStack.isEmpty()) {
            const item = this.draggedStack.tiles.shift()!;
            snap.stack.pushTile(item.color, item.mesh);
          }
        }

        this.draggedStack.clear();
        this.draggedStack.group.parent?.remove(this.draggedStack.group);
        this.draggedStack = null;
        this.originSlot = null;
        this.originCell = null;
        this.grid.clearHighlights();
        this.hoveredCell = null;

        this.audio.playPlace();
        this.onStackPlacedCallback(snap);
      } else {
        // Return to origin
        if (this.originSlot) {
          this.originSlot.stack = this.draggedStack;
          this.draggedStack.group.position.copy(this.originSlot.worldPos);
          this.originSlot = null;
        } else if (this.originCell) {
          this.originCell.stack = this.draggedStack;
          this.originCell.stack.group.position.set(
            this.originCell.worldX,
            this.originCell.worldY + 0.12,
            this.originCell.worldZ
          );
          this.originCell.cellGroup.add(this.originCell.stack.group);
          this.originCell = null;
        }

        this.audio.playBlocked();
        this.draggedStack = null;
        this.grid.clearHighlights();
        this.hoveredCell = null;
      }
    }
  };

  public cancelDrag(): void {
    if (this.draggedStack) {
      if (this.originSlot) {
        this.originSlot.stack = this.draggedStack;
        this.draggedStack.group.position.copy(this.originSlot.worldPos);
        this.originSlot = null;
      }
      this.draggedStack = null;
      this.grid.clearHighlights();
      this.hoveredCell = null;
    }
  }

  public dispose(): void {
    const el = this.domElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }
}
