import * as BABYLON from '@babylonjs/core'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const canvas = document.querySelector('.webgl')

// Engine
const engine = new BABYLON.Engine(canvas, true)

// Scene
const scene = new BABYLON.Scene(engine)

// Light
scene.createDefaultLight()
// Camera 
const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 2, new BABYLON.Vector3(0, 0, 0), scene)

camera.setPosition(new BABYLON.Vector3(0, 0, -5))
camera.attachControl(canvas, true)
camera.wheelDeltaPercentage = 0.01


// Mesh
const plane = new BABYLON.MeshBuilder.CreatePlane("plane", { width: 4, height: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene)

// Material
const material = new BABYLON.ShaderMaterial("mat", scene, {
  vertexSource: vertexShader,
  fragmentSource: fragmentShader
},
  {
    attributes: ["position", "uv"],
    uniforms: ['world', 'view', 'projection', 'uDiffuse'],
  }
)

material.setTexture("uDiffuse", new BABYLON.Texture("/textures/diffuse.png", scene, {
  useSRGBBuffer: true
}))


plane.material = material

// SKybox
const envTexture = new BABYLON.CubeTexture("/textures/skybox/", scene, [
  "px.png",
  "py.png",
  "pz.png",
  "nx.png",
  "ny.png",
  "nz.png"
])

scene.createDefaultSkybox(envTexture, true, 1000)


engine.runRenderLoop(() => {
  scene.render()
})


window.addEventListener('resize', () => {
  engine.resize()
})