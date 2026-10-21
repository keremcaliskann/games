import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';
import { Screw } from './screw';

export class BufferDock {
  public readonly group = new THREE.Group();
  public capacity = GAME_CONFIG.defaultBufferSlots;
  public readonly slots: (Screw | null)[] = [];

  private socketMeshes: THREE.Mesh[] = [];
  private readonly slotSpacing = 0.82;
  private readonly trayMesh: THREE.Mesh;

  constructor(position: THREE.Vector3) {
    this.group.position.copy(position);

    // Frosted white glass tray base
    const trayGeo = new THREE.BoxGeometry(this.capacity * this.slotSpacing + 0.5, 0.28, 1.1);
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0xfcf8ee, // Warm biscuit frosted tray
      roughness: 0.35,
      metalness: 0.05,
    });
    this.trayMesh = new THREE.Mesh(trayGeo, trayMat);
    this.trayMesh.receiveShadow = true;
    this.group.add(this.trayMesh);

    this.rebuildSockets();
  }

  public rebuildSockets(): void {
    // Clear old sockets
    for (const m of this.socketMeshes) {
      this.group.remove(m);
      m.geometry.dispose();
    }
    this.socketMeshes = [];

    const socketGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16);
    const socketMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark recessed hole
      roughness: 0.85,
    });

    const startX = -((this.capacity - 1) / 2) * this.slotSpacing;

    while (this.slots.length < this.capacity) {
      this.slots.push(null);
    }

    for (let i = 0; i < this.capacity; i++) {
      const socket = new THREE.Mesh(socketGeo, socketMat);
      socket.position.set(startX + i * this.slotSpacing, 0.15, 0);
      this.group.add(socket);
      this.socketMeshes.push(socket);
    }

    // Scale tray to fit capacity
    this.trayMesh.scale.x = (this.capacity * this.slotSpacing + 0.6) / (5 * this.slotSpacing + 0.5);
  }

  public unlockExtraSlot(): boolean {
    if (this.capacity >= GAME_CONFIG.maxBufferSlots) return false;
    this.capacity++;
    this.slots.push(null);
    this.rebuildSockets();
    return true;
  }

  public getFreeSlotIndex(): number {
    return this.slots.findIndex((s) => s === null);
  }

  public getSlotWorldPosition(index: number): THREE.Vector3 {
    const startX = -((this.capacity - 1) / 2) * this.slotSpacing;
    const local = new THREE.Vector3(startX + index * this.slotSpacing, 0.28, 0);
    return local.applyMatrix4(this.group.matrixWorld);
  }

  public parkScrew(screw: Screw): number {
    const freeIdx = this.getFreeSlotIndex();
    if (freeIdx === -1) return -1;
    this.slots[freeIdx] = screw;
    screw.state = 'parked';
    return freeIdx;
  }

  public removeScrew(screw: Screw): void {
    const idx = this.slots.indexOf(screw);
    if (idx !== -1) {
      this.slots[idx] = null;
    }
  }

  public getParkedScrewsOfColor(colorId: string): Screw[] {
    const res: Screw[] = [];
    for (const s of this.slots) {
      if (s && s.color.id === colorId) {
        res.push(s);
      }
    }
    return res;
  }

  public isFull(): boolean {
    return this.slots.every((s) => s !== null);
  }

  public getFilledCount(): number {
    return this.slots.filter((s) => s !== null).length;
  }

  public clear(): void {
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i] = null;
    }
  }

  public dispose(): void {
    this.trayMesh.geometry.dispose();
    for (const m of this.socketMeshes) {
      m.geometry.dispose();
    }
  }
}
