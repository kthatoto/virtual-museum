<template lang="pug">
#app
  .color(:style="{backgroundColor: `#${person.color}`}") your color
  img.guide(src="./static/keyboards.jpg")
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
  name: 'app',
  data () {
    return {
      scene: null,
      camera: null,
      renderer: null,
      loader: null,
      position: { x: 0, y: 0, z: 0 },
      lastPosition: { x: null, y: null, z: null },
      myCube: {},
      cubes: {},
      person: {
        geometry: null,
        material: null,
        color: ''
      },
      colors: [
        '47ad54', 'b5177d', '480bee', '1fbcb8', '8757ba',
        'c43e85', 'f7c555', 'a21549', 'fc1918', '5c2545'
      ]
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
    this.person.geometry = new THREE.BoxGeometry(1, 5, 1)
    this.person.color = this.colors[Math.floor(Math.random() * this.colors.length)]

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

    setInterval(() => {
      const notMovedX = this.position.x === this.lastPosition.x
      const notMovedY = this.position.y === this.lastPosition.y
      const notMovedZ = this.position.z === this.lastPosition.z
      if (!(notMovedX && notMovedY && notMovedZ)) {
        console.log("moved! [#Phiew5ch]")
        App.users.speak({position: this.position, color: this.person.color})
        this.lastPosition.x = this.position.x
        this.lastPosition.y = this.position.y
        this.lastPosition.z = this.position.z
      }
    }, 1000)
  },
  methods: {
    received (cubeInfo) {
      const name = cubeInfo.name
      const color = cubeInfo.color
      if (localStorage.getItem("name") === name) {
        return
      }
      const position = cubeInfo.position.split(",").reduce((map, pos) => {
        const arr = pos.split(":")
        map[arr[0]] = arr[1]
        return map
      }, {})
      if (!this.cubes[name]) {
        this.cubes[name] = {}
        this.cubes[name].color = color
        this.cubes[name].material = new THREE.MeshBasicMaterial({ color: parseInt(`0x${color}`) })
        const cube = new THREE.Mesh(this.person.geometry, this.cubes[name].material)
        cube.position.set(position.x, position.y, position.z)
        this.cubes[name].cube = cube
        this.scene.add(cube)
      } else {
        const moveCount = 10
        clearInterval(this.cubes[name].timerId)
        if (this.cubes[name].color != color) {
          this.cubes[name].material.color.setHex(parseInt(`0x${color}`))
        }
        this.cubes[name].movingCount = 0
        this.cubes[name].movingSpeed = {
          x: (parseFloat(position.x) - this.cubes[name].cube.position.x) / moveCount,
          y: (parseFloat(position.y) - this.cubes[name].cube.position.y) / moveCount,
          z: (parseFloat(position.z) - this.cubes[name].cube.position.z) / moveCount
        }
        this.cubes[name].timerId = setInterval(() => {
          this.cubes[name].cube.position.set(
            parseFloat(this.cubes[name].cube.position.x) + this.cubes[name].movingSpeed.x,
            parseFloat(this.cubes[name].cube.position.y) + this.cubes[name].movingSpeed.y,
            parseFloat(this.cubes[name].cube.position.z) + this.cubes[name].movingSpeed.z
          )
          this.cubes[name].movingCount++
          if (this.cubes[name].movingCount >= moveCount) {
            this.cubes[name].cube.position.set(position.x, position.y, position.z)
            clearInterval(this.cubes[name].timerId)
          }
        }, 25)
      }
    },
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
#app {
  .color {
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 50px;
    background-color: black;
    line-height: 50px;
    vertical-align: middle;
    text-align: center;
    color: white;
    font-weight: bold;
  }
  .guide {
    position: absolute;
    top: 50px;
    right: 0;
    width: 120px;
  }
}
</style>
