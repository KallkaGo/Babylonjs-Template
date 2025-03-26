import * as BABYLON from '@babylonjs/core'
import "@babylonjs/loaders"
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

// Material
const material = new BABYLON.ShaderMaterial("mat", scene, {
  vertexSource: vertexShader,
  fragmentSource: fragmentShader
},
  {
    attributes: ["position", "uv", "normal"],
    uniforms: ['world', 'view', 'projection', 'uDiffuse', 'uNormalMap'],
  }
)


material.setTexture("uNormalMap", new BABYLON.Texture("/models/DamagedHelmet/glTF/Default_normal.jpg", scene))



// Model
BABYLON.ImportMeshAsync('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', scene).then((result) => {
  const group = new BABYLON.TransformNode("group", scene)
  result.meshes.forEach((mesh) => {
    if (mesh.name !== '__root__') {
      mesh.parent = group
      mesh.material = material

    }
  })

  group.rotation.y = Math.PI

})

engine.runRenderLoop(() => {
  scene.render()
})


window.addEventListener('resize', () => {
  engine.resize()
})