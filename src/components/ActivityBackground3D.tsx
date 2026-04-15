import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

/* ────────────────── mouse tracker ────────────────── */
function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return mouse
}

/* ────────────────── parallax camera ────────────────── */
function ParallaxCamera() {
  const mouse = useMousePosition()
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 2.5 + Math.sin(t * 0.12) * 0.6, 0.025)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 1.8 + Math.cos(t * 0.1) * 0.4, 0.025)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ────────────────── floating wrapper ────────────────── */
function Float({ children, position, speed = 1, floatY = 0.8, rotSpeed = 0.12 }: {
  children: React.ReactNode; position: [number, number, number]; speed?: number; floatY?: number; rotSpeed?: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * speed * 0.5 + offset) * floatY
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.3 + offset) * 0.3
    ref.current.rotation.y += rotSpeed * 0.008
    ref.current.rotation.x = Math.sin(t * speed * 0.2 + offset) * 0.15
  })
  return <group ref={ref} position={position}>{children}</group>
}

/* ────────────────── star shape ────────────────── */
function Star({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape()
    const outerR = 0.6 * scale, innerR = 0.25 * scale
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const innerAngle = outerAngle + Math.PI / 5
      if (i === 0) shape.moveTo(Math.cos(outerAngle) * outerR, Math.sin(outerAngle) * outerR)
      else shape.lineTo(Math.cos(outerAngle) * outerR, Math.sin(outerAngle) * outerR)
      shape.lineTo(Math.cos(innerAngle) * innerR, Math.sin(innerAngle) * innerR)
    }
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth: 0.18 * scale, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 })
  }, [scale])
  return (
    <Float position={position} speed={1.2} floatY={0.9}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} transparent opacity={0.55} roughness={0.2} metalness={0.5} />
      </mesh>
    </Float>
  )
}

/* ────────────────── rocket ship ────────────────── */
function Rocket({ position }: { position: [number, number, number] }) {
  return (
    <Float position={position} speed={0.9} floatY={1.1} rotSpeed={0.08}>
      <group rotation={[0, 0, Math.PI / 6]}>
        {/* body */}
        <mesh>
          <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
          <meshStandardMaterial color="#FF6B6B" transparent opacity={0.5} roughness={0.15} metalness={0.4} />
        </mesh>
        {/* nose */}
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[0.3, 0.6, 16]} />
          <meshStandardMaterial color="#FDCB6E" transparent opacity={0.55} roughness={0.2} metalness={0.3} />
        </mesh>
        {/* window */}
        <mesh position={[0, 0.3, 0.28]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#74B9FF" transparent opacity={0.7} roughness={0.05} metalness={0.6} />
        </mesh>
        {/* fins */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.35, -0.7, 0]} rotation={[0, 0, side * 0.3]}>
            <boxGeometry args={[0.15, 0.5, 0.08]} />
            <meshStandardMaterial color="#FD79A8" transparent opacity={0.45} roughness={0.2} />
          </mesh>
        ))}
        {/* flame */}
        <mesh position={[0, -0.95, 0]}>
          <coneGeometry args={[0.22, 0.5, 12]} />
          <meshStandardMaterial color="#FDCB6E" transparent opacity={0.4} emissive="#FF6B6B" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </Float>
  )
}

/* ────────────────── spinning gear ────────────────── */
function Gear({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => { ref.current.rotation.z = clock.elapsedTime * 0.3 })
  return (
    <Float position={position} speed={0.7} floatY={0.5}>
      <mesh ref={ref}>
        <torusGeometry args={[0.7, 0.15, 8, 6]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} roughness={0.25} metalness={0.5} />
      </mesh>
      <mesh ref={useRef<THREE.Mesh>(null!)}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.35} roughness={0.2} metalness={0.4} />
      </mesh>
    </Float>
  )
}

/* ────────────────── planet ────────────────── */
function Planet({ position, color, ringColor }: { position: [number, number, number]; color: string; ringColor: string }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.15 })
  return (
    <Float position={position} speed={0.6} floatY={0.7}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshStandardMaterial color={color} transparent opacity={0.45} roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.4, 0]}>
          <torusGeometry args={[1.1, 0.06, 8, 48]} />
          <meshStandardMaterial color={ringColor} transparent opacity={0.35} />
        </mesh>
      </group>
    </Float>
  )
}

/* ────────────────── sparkle particles ────────────────── */
function Sparkles() {
  const ref = useRef<THREE.Points>(null!)
  const { positions, colors } = useMemo(() => {
    const n = 250
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const palette = [
      new THREE.Color('#6C5CE7'), new THREE.Color('#00CEC9'),
      new THREE.Color('#FDCB6E'), new THREE.Color('#FD79A8'),
      new THREE.Color('#74B9FF'), new THREE.Color('#55E6C1'),
    ]
    for (let i = 0; i < n; i++) {
      const r = 4 + Math.random() * 18
      const a = Math.random() * Math.PI * 2
      const b = (Math.random() - 0.5) * Math.PI
      pos[i * 3] = Math.cos(a) * Math.cos(b) * r
      pos[i * 3 + 1] = Math.sin(b) * r * 0.6
      pos[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r * 0.5 - 5
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b

    }
    return { positions: pos, colors: col }
  }, [])
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.018
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.04
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} vertexColors transparent opacity={0.5} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ────────────────── mouse-reactive glow orb ────────────────── */
function GlowOrb() {
  const ref = useRef<THREE.Mesh>(null!)
  const mouse = useMousePosition()
  useFrame(() => {
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouse.current.x * 6, 0.04)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouse.current.y * 4, 0.04)
  })
  return (
    <mesh ref={ref} position={[0, 0, 2]}>
      <sphereGeometry args={[1.2, 24, 24]} />
      <meshStandardMaterial color="#6C5CE7" transparent opacity={0.06} emissive="#6C5CE7" emissiveIntensity={0.4} />
    </mesh>
  )
}

/* ────────────────── responsive size hook ────────────────── */
function useResponsiveScale() {
  const { size } = useThree()
  return size.width < 640 ? 0.55 : size.width < 1024 ? 0.75 : 1
}

function Scene() {
  const s = useResponsiveScale()
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[8, 10, 6]} intensity={0.9} color="#f8fdff" />
      <pointLight position={[-10, -6, 8]} intensity={0.5} color="#6C5CE7" />
      <pointLight position={[10, 8, 10]} intensity={0.5} color="#00CEC9" />
      <pointLight position={[0, -8, 5]} intensity={0.3} color="#FDCB6E" />
      <fog attach="fog" args={['#F0EEFF', 16, 38]} />

      <ParallaxCamera />
      <Sparkles />
      <GlowOrb />

      {/* Stars */}
      <Star position={[-7 * s, 5 * s, -6]} color="#FDCB6E" scale={1.1 * s} />
      <Star position={[8 * s, 4 * s, -8]} color="#FD79A8" scale={0.8 * s} />
      <Star position={[-4 * s, -5 * s, -7]} color="#74B9FF" scale={0.9 * s} />
      <Star position={[6 * s, -3 * s, -5]} color="#55E6C1" scale={0.7 * s} />

      {/* Rocket */}
      <Rocket position={[-9 * s, 2 * s, -5]} />

      {/* Gears */}
      <Gear position={[9 * s, -4 * s, -7]} color="#00CEC9" />
      <Gear position={[-6 * s, -6 * s, -9]} color="#6C5CE7" />

      {/* Planet */}
      <Planet position={[7 * s, 6 * s, -10]} color="#6C5CE7" ringColor="#FD79A8" />
      <Planet position={[-8 * s, -2 * s, -12]} color="#00CEC9" ringColor="#FDCB6E" />
    </>
  )
}

/* ────────────────── main export ────────────────── */
export default function ActivityBackground3D() {
  const [visible, setVisible] = useState(true)
  
  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div className="activity-3d-bg" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
