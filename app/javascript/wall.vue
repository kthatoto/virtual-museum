<script>
import * as THREE from 'three'
import wallImage from './static/wall.jpg'
export default {
  methods: {
    addWalls (scene, loader) {
      const texture = loader.load(wallImage)
      const material = new THREE.MeshBasicMaterial({
        map: texture
      })
      const geometry = new THREE.PlaneGeometry(10, 10)
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 10; j++) {
          const mesh = new THREE.Mesh(geometry, material)
          mesh.rotation.y = Math.PI / 2 * (Math.pow(-1, i))
          mesh.position.y += 2.5
          mesh.position.x -= 10 * (Math.pow(-1, i))
          mesh.position.z += 10 * j - 45
          scene.add(mesh)
        }
      }
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const mesh = new THREE.Mesh(geometry, material)
          if (i === 0) {
            mesh.rotation.y = Math.PI
          }
          mesh.position.y += 2.5
          mesh.position.x -= j * 10 - 5
          mesh.position.z += 50 * (Math.pow(-1, i))
          scene.add(mesh)
        }
      }
    }
  }
}
</script>
