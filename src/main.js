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


// Mesh
const plane = new BABYLON.MeshBuilder.CreatePlane("plane", { width:4, height:3}, scene)

// Material
const material = new BABYLON.ShaderMaterial("mat", scene,{
  vertexSource: vertexShader,
  fragmentSource: fragmentShader
}, 
{  
  attributes: ["position","uv"],  
  uniforms: ['world','view','projection','uDiffuse'],  
}  
)

material.setTexture("uDiffuse", new BABYLON.Texture("/diffuse.png", scene,{
  useSRGBBuffer: true
}))


plane.material = material



engine.runRenderLoop(() => {
  scene.render()
})


window.addEventListener('resize', () => {
  engine.resize()
})