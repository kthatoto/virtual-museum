<template lang="pug">
#app
</template>

<script>
import * as THREE from 'three'
import image1 from './static/image1.jpg'
import image2 from './static/image2.jpg'
import image3 from './static/image3.jpg'
import image4 from './static/image4.jpg'
import image5 from './static/image5.png'
import image6 from './static/image6.jpg'

import wall from './wall'

export default {
  data () {
    return {
      scene: null,
      camera: null,
      renderer: null,
      loader: null,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      myCube: null
    }
  },
  created () {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    )
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff)
    this.loader = new THREE.TextureLoader()
    document.body.appendChild(this.renderer.domElement)

    wall.methods.addWalls(this.scene, this.loader)

    this.addCube(20, 1, 100, 0, -3, 0)
    this.addPicture(image1, 14, 8, 1, -9.9, 2.5, 0)
    this.addPicture(image2, 12, 8, 1, -9.9, 2.5, -15)
    this.addPicture(image3, 12, 8, 1, -9.9, 2.5, -30)
    this.addPicture(image4, 12, 8, -1, 9.9, 2.5, -30)
    this.addPicture(image5, 12, 8, -1, 9.9, 2.5, -15)
    this.addPicture(image6, 14, 8, -1, 9.9, 2.5, 0)
    this.setCameraPosition(null, null, null)

    this.setKeyEvents()

    this.animate()
  },
  methods: {
    addPicture (path, width, height, side, x, y, z) {
      const texture = this.loader.load(path)
      const material = new THREE.MeshBasicMaterial({
        map: texture
      })
      const geometry = new THREE.PlaneGeometry(width, height)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.x += x
      mesh.rotation.y = side * Math.PI / 2
      mesh.position.y += y
      mesh.position.z += z
      this.scene.add(mesh)
    },
    addCube (w, h, l, x, y, z) {
      const geometry = new THREE.BoxGeometry(w, h, l)
      const material = new THREE.MeshBasicMaterial({ color: 0x804500 })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(x, y, z)
      this.scene.add(cube)
    },
    setCameraPosition () {
      this.camera.position.set(this.position.x, this.position.y, this.position.z)
      // App.users.speak(this.position)
    },
    setKeyEvents () {
      document.addEventListener('keydown', () => {
        const speed = 0.5
        const keyCode = event.which
        // console.log(keyCode)
        if (keyCode === 87) {
          if (this.position.z > -48) {
            this.position.z -= speed
          }
        } else if (keyCode === 83) {
          if (this.position.z < 48) {
            this.position.z += speed
          }
        } else if (keyCode === 65) {
          if (this.position.x > -9) {
            this.position.x -= speed
          }
        } else if (keyCode === 68) {
          if (this.position.x < 9) {
            this.position.x += speed
          }
        } else if (keyCode === 32) {
          this.position.set(0, 0, 0)
        } else if (keyCode === 37) {
          this.camera.rotation.y += 0.05
        } else if (keyCode === 39) {
          this.camera.rotation.y -= 0.05
        }
      })
    },
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    }
  },
  watch: {
    position: {
      handler () {
        this.setCameraPosition()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
