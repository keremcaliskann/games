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

  // Active Drag / Tap-to-Place State
  private isPointerDown = false;
  private isOrbiting = false;
  private startPointerX = 0;
  private startPointerY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private draggedStack: TileStack | null = null;
  private selectedTraySlot: TraySlot | null = null;
  private originSlot: TraySlot | null = null;
  private originCell: HexCell | null = null;
  private hoveredCell: HexCell | null = null;

  // Boosters & Modes
  public mode: InputMode = 'normal';

  // Callbacks
  private onStackPlacedCallback: (cell: HexCell) => void = () => {};
  private onHammerUsedCallback: (cell: HexCell) => void = () => {};
  private onModeResetCallback: () => void = () => {};

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
    onHammerUsed: (cell: HexCell) => void,
    onModeReset: () => void = () => {}
  ): void {
    this.onStackPlacedCallback = onStackPlaced;
    this.onHammerUsedCallback = onHammerUsed;
    this.onModeResetCallback = onModeReset;
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
    this.isOrbiting = false;
    this.startPointerX = e.clientX;
    this.startPointerY = e.clientY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.updatePointer(e.clientX, e.clientY);

    if (this.raycaster.ray.intersectPlane(this.groundPlane, this.planeIntersect)) {
      const hitX = this.planeIntersect.x;
      const hitZ = this.planeIntersect.z;

      // 1. Hammer Mode: tap cell to smash stack
      if (this.mode === 'hammer') {
        const target = this.grid.findSnapTarget(hitX, hitZ, 1.65);
        if (target && !target.stack.isEmpty()) {
          this.mode = 'normal';
          this.onModeResetCallback();
          this.onHammerUsedCallback(target);
        }
        return;
      }

      // 2. Move Stack Mode: tap cell to pick up stack into a temporary carrier stack
      if (this.mode === 'move_stack') {
        const target = this.grid.findSnapTarget(hitX, hitZ, 1.65);
        if (target && !target.stack.isEmpty()) {
          this.mode = 'normal';
          this.onModeResetCallback();
          this.originCell = target;

          const tempStack = new TileStack();
          while (!target.stack.isEmpty()) {
            const item = target.stack.tiles.shift()!;
            target.stack.group.remove(item.mesh);
            tempStack.pushTile(item.color, item.mesh);
          }
          target.stack.updateCountBadge();

          this.grid.group.add(tempStack.group);
          tempStack.group.position.set(hitX, 1.25, hitZ);
          this.draggedStack = tempStack;
          this.domElement.style.cursor = 'grabbing';
        }
        return;
      }

      // 2.5 If a tray slot was already selected by Tap-to-Select, tapping a valid board cell places it immediately!
      if (this.selectedTraySlot && this.selectedTraySlot.stack) {
        const targetCell = this.grid.findSnapTarget(hitX, hitZ, 1.65);
        if (targetCell) {
          const canPlace =
            targetCell.stack.isEmpty() ||
            targetCell.stack.getTopColor()?.id === this.selectedTraySlot.stack.getTopColor()?.id;
          if (canPlace) {
            const stackToMove = this.selectedTraySlot.stack;
            this.selectedTraySlot.stack = null;
            this.selectedTraySlot = null;
            while (!stackToMove.isEmpty()) {
              const item = stackToMove.tiles.shift()!;
              stackToMove.group.remove(item.mesh);
              targetCell.stack.pushTile(item.color, item.mesh);
            }
            stackToMove.clear();
            stackToMove.group.parent?.remove(stackToMove.group);
            this.grid.clearHighlights();
            this.audio.playPlace();
            this.onStackPlacedCallback(targetCell);
            this.isPointerDown = false;
            return;
          }
        }
      }

      // 3. Normal Tray Stack Grab (generous 1.85m hit radius)
      const hitSlot = this.tray.findHoveredSlot(hitX, hitZ, 1.85);
      if (hitSlot && hitSlot.stack) {
        if (this.selectedTraySlot && this.selectedTraySlot.stack) {
          this.selectedTraySlot.stack.group.position.copy(this.selectedTraySlot.worldPos);
        }
        this.selectedTraySlot = hitSlot;
        this.originSlot = hitSlot;
        this.draggedStack = hitSlot.stack;
        hitSlot.stack = null; // Detach from tray

        // Elevate slightly for tactile grab feedback
        this.draggedStack.group.position.set(hitX, 1.25, hitZ - 0.35);
        this.domElement.style.cursor = 'grabbing';
        return;
      }

      // 4. Empty space drag -> gentle camera parallax orbit
      this.isOrbiting = true;
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    this.updatePointer(e.clientX, e.clientY);

    if (this.isPointerDown && this.draggedStack) {
      if (this.raycaster.ray.intersectPlane(this.groundPlane, this.planeIntersect)) {
        const curX = this.planeIntersect.x;
        const curZ = this.planeIntersect.z;

        // Smooth follow under cursor with tactile lift height & slight forward Z offset so finger doesn't cover cell
        this.draggedStack.group.position.set(curX, 1.35, curZ - 0.35);

        // Check snap hover on board (generous 1.75m snap radius)
        const snap = this.grid.findSnapTarget(curX, curZ - 0.35, 1.75);

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
    } else if (this.isPointerDown && this.isOrbiting) {
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      this.cameraRig.nudgeParallax(dx, dy);
    }
  };

  private onPointerUp = (): void => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    this.isOrbiting = false;
    this.domElement.style.cursor = 'default';

    if (this.draggedStack) {
      const snap = this.hoveredCell;

      // Rule: Can drop on empty cell, or on occupied cell if top colors match!
      let validDrop = false;
      if (snap && snap !== this.originCell) {
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
        // Successful Drop! Transfer entire dragged stack to target cell
        while (!this.draggedStack.isEmpty()) {
          const item = this.draggedStack.tiles.shift()!;
          this.draggedStack.group.remove(item.mesh);
          snap.stack.pushTile(item.color, item.mesh);
        }

        this.draggedStack.clear();
        this.draggedStack.group.parent?.remove(this.draggedStack.group);
        this.draggedStack = null;
        this.selectedTraySlot = null;
        this.originSlot = null;
        this.originCell = null;
        this.grid.clearHighlights();
        this.hoveredCell = null;

        this.audio.playPlace();
        this.onStackPlacedCallback(snap);
      } else {
        // Return to origin (or keep elevated if it was a short tap on tray for Tap-to-Place!)
        const dragDist = Math.hypot(
          this.lastPointerX - this.startPointerX,
          this.lastPointerY - this.startPointerY
        );
        if (this.originSlot) {
          this.originSlot.stack = this.draggedStack;
          this.draggedStack.group.position.copy(this.originSlot.worldPos);
          if (dragDist < 16) {
            // Keep elevated by +0.45y so player sees it's selected for Tap-to-Place!
            this.draggedStack.group.position.y += 0.45;
            this.selectedTraySlot = this.originSlot;
          } else {
            this.selectedTraySlot = null;
            this.audio.playBlocked();
          }
          this.originSlot = null;
        } else if (this.originCell) {
          while (!this.draggedStack.isEmpty()) {
            const item = this.draggedStack.tiles.shift()!;
            this.draggedStack.group.remove(item.mesh);
            this.originCell.stack.pushTile(item.color, item.mesh);
          }
          this.draggedStack.clear();
          this.draggedStack.group.parent?.remove(this.draggedStack.group);
          this.originCell = null;
          this.audio.playBlocked();
        }

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
