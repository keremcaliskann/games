import * as THREE from 'three';

function disposeMaterial(mat: THREE.Material): void {
  const record = mat as unknown as Record<string, unknown>;
  for (const key in record) {
    const val = record[key];
    if (val instanceof THREE.Texture) {
      val.dispose();
    }
  }
  mat.dispose();
}

export function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((node: THREE.Object3D) => {
    const mesh = node as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        for (let i = 0; i < mesh.material.length; i++) {
          disposeMaterial(mesh.material[i]);
        }
      } else {
        disposeMaterial(mesh.material);
      }
    }
  });
}
