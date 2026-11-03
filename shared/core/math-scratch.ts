import * as THREE from 'three';

/**
 * Genre-Agnostic Zero-Allocation Math & Scratch Registers (shared/core/math-scratch.ts)
 * Eliminates `new THREE.Vector3()` / `new THREE.Quaternion()` heap allocations inside hot update() loops.
 */
export const Scratch = {
  v0: new THREE.Vector3(),
  v1: new THREE.Vector3(),
  v2: new THREE.Vector3(),
  v3: new THREE.Vector3(),
  q0: new THREE.Quaternion(),
  q1: new THREE.Quaternion(),
  m0: new THREE.Matrix4(),
  c0: new THREE.Color(),
  box0: new THREE.Box3(),
} as const;

export function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/** Frame-rate independent exponential smoothing (lambda: 4 = soft, 12 = responsive, 24 = snappy). */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/** Shortest signed angular difference in radians between two angles in [-PI, PI]. */
export function shortestAngleDiff(fromRad: number, toRad: number): number {
  let diff = (toRad - fromRad + Math.PI) % (Math.PI * 2);
  if (diff < 0) diff += Math.PI * 2;
  return diff - Math.PI;
}

export function dampAngle(currentRad: number, targetRad: number, lambda: number, dt: number): number {
  const diff = shortestAngleDiff(currentRad, targetRad);
  return currentRad + diff * (1 - Math.exp(-lambda * dt));
}
