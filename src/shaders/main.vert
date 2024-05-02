varying vec3 vUv;
uniform sampler2D uTexture;

void main() {
  vUv = position;

  vUv.z += texture2D(uTexture, vUv.xy).r / 10.0;

  vec4 modelViewPosition = modelViewMatrix * vec4(vUv, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}