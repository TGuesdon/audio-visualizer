import * as THREE from "three";
import { SIZE } from "../App";
import fragment from "./../shaders/main.frag";
import vertex from "./../shaders/main.vert";

export class ThreeRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private geometry: THREE.PlaneGeometry;
  private shader: THREE.ShaderMaterial;
  private texture: THREE.DataTexture;
  private data: Uint8Array;

  public constructor(private wrapper: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    wrapper.appendChild(renderer.domElement);

    this.data = new Uint8Array(SIZE * SIZE * 4);
    this.texture = new THREE.DataTexture(this.data, SIZE, SIZE);
    this.texture.needsUpdate = true;

    this.geometry = new THREE.PlaneGeometry(1, 1, SIZE, SIZE);
    this.shader = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: this.texture },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      wireframe: true,
    });

    const plane = new THREE.Mesh(this.geometry, this.shader);
    plane.rotation.x = (-0.66 * Math.PI) / 2;
    plane.rotation.z = -Math.PI / 2;
    this.scene.add(plane);

    // Light
    const light = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);

      renderer.render(this.scene, this.camera);
    };
    animate();
  }

  public updateData(soundData: Uint8Array) {
    if (soundData.length !== SIZE) {
      throw new Error("Oh oh there is a mistake. The sound data length isn't equal to " + SIZE);
    }

    const newData = new Uint8Array(SIZE * SIZE * 4);

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const pos = (i * SIZE + j) * 4;
        newData[pos] = soundData[i];
        newData[pos + 1] = soundData[i];
        newData[pos + 2] = soundData[i];
        newData[pos + 3] = 255;
      }
    }

    this.data.set(newData);
    this.texture.needsUpdate = true;
  }

  public clean() {
    this.wrapper.removeChild(this.wrapper.children[0]);
  }
}
