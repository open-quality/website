import * as THREE from '../vendor/three.module.js'
import { OrbitControls } from '../vendor/OrbitControls.js'

const container = document.querySelector('[data-hero-canvas]')
if (!container) {
  console.warn('Hero canvas container not found—skipping Three.js scene')
} else {
  initScene(container)
}

function initScene(container) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 5)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambient)

  const stars = createStars()
  scene.add(stars.points)

  const plasmaInfinity = createPlasmaInfinity()
  scene.add(plasmaInfinity.mesh)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enableDamping = true
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.3

  const clock = new THREE.Clock()

  function handleResize() {
    const { clientWidth, clientHeight } = container
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
  }

  window.addEventListener('resize', handleResize)

  function tick() {
    const elapsed = clock.getElapsedTime()
    stars.update(elapsed)
    plasmaInfinity.update(elapsed)
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }

  tick()
}

function createStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)')
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  ctx.beginPath()
  ctx.arc(32, 32, 12, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

function createStars() {
  const count = 150
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const basePositions = new Float32Array(count * 3)

  const starColors = [
    { r: 0.8, g: 1.0, b: 1.5 },
    { r: 1.0, g: 1.2, b: 1.5 },
    { r: 1.5, g: 1.5, b: 1.5 },
    { r: 1.5, g: 1.5, b: 1.0 },
    { r: 1.5, g: 1.3, b: 0.8 },
    { r: 1.5, g: 1.0, b: 0.7 },
    { r: 1.5, g: 0.8, b: 0.7 },
  ]

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 12
    const y = (Math.random() - 0.5) * 8
    const z = (Math.random() - 0.5) * 6 - 2
    positions.set([x, y, z], i * 3)
    basePositions.set([x, y, z], i * 3)

    const color = starColors[Math.floor(Math.random() * starColors.length)]
    colors.set([color.r, color.g, color.b], i * 3)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: createStarTexture() },
    },
    vertexShader: `
      attribute vec3 color;
      varying vec3 vColor;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 1.5 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;

      void main() {
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor = vec4(vColor * texColor.rgb, texColor.a);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
  })

  const points = new THREE.Points(geometry, shaderMaterial)

  return {
    points,
    update(elapsed) {
      const positionAttr = geometry.getAttribute('position')
      const arr = positionAttr.array
      for (let i = 0; i < arr.length; i += 3) {
        const baseZ = basePositions[i + 2]
        const index = i / 3
        arr[i + 2] = baseZ + Math.sin(elapsed + index) * 0.1
      }
      positionAttr.needsUpdate = true
    },
  }
}

function createPlasmaInfinity() {
  const scale = 2
  const points = []
  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * Math.PI * 2
    const x = scale * Math.cos(t)
    const y = scale * Math.sin(t) * Math.cos(t) * 0.7
    points.push(new THREE.Vector3(x, y, 0))
  }

  const curve = new THREE.CatmullRomCurve3(points, true)
  const geometry = new THREE.TubeGeometry(curve, 200, 0.3, 32, true)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        vPosition = position;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vPosition;
      varying vec3 vNormal;

      vec3 palette(float t) {
        vec3 a = vec3(0.2, 0.5, 0.8);
        vec3 b = vec3(0.5, 0.3, 0.6);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.0, 0.33, 0.67);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        float time = uTime * 0.5;
        float plasma1 = sin(vPosition.x * 3.0 + time);
        float plasma2 = sin(vPosition.y * 3.0 + time * 1.3);
        float plasma3 = sin((vPosition.x + vPosition.y) * 2.0 + time * 0.7);
        float plasma = (plasma1 + plasma2 + plasma3) / 3.0;
        vec3 color = palette(plasma * 0.5 + 0.5);
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
        color += fresnel * vec3(0.3, 0.5, 0.8);
        float pulse = sin(time * 2.0) * 0.1 + 0.75;
        color *= pulse;
        gl_FragColor = vec4(color, 0.9);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)

  return {
    mesh,
    update(elapsed) {
      material.uniforms.uTime.value = elapsed
      mesh.rotation.y = Math.sin(elapsed * 0.3) * 0.3
      mesh.rotation.x = Math.cos(elapsed * 0.2) * 0.1
    },
  }
}
