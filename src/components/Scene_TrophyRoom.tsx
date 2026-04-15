import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

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

/* ── celebration sparkles ── */
function CelebrationSparkles() {
  const ref = useRef<THREE.Points>(null!)
  const { positions, colors } = useMemo(() => {
    const n = 300
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)

    const palette = [
      new THREE.Color('#FFD700'), new THREE.Color('#FFA502'),
      new THREE.Color('#FF6B6B'), new THREE.Color('#a855f7'),
      new THREE.Color('#6C5CE7'), new THREE.Color('#00CEC9'),
      new THREE.Color('#FD79A8'), new THREE.Color('#55E6C1'),
    ]
    for (let i = 0; i < n; i++) {
      const r = 3 + Math.random() * 20
      const a = Math.random() * Math.PI * 2
      const b = (Math.random() - 0.5) * Math.PI
      pos[i * 3] = Math.cos(a) * Math.cos(b) * r
      pos[i * 3 + 1] = Math.sin(b) * r * 0.7
      pos[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r * 0.5 - 5
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b

    }
    return { positions: pos, colors: col }
  }, [])
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.02
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.015) * 0.05
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.18} vertexColors transparent opacity={0.55} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ── trophy ── */
function Trophy({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const mat = ref.current.children[0] as THREE.Mesh
    if (mat?.material && 'emissiveIntensity' in (mat.material as any)) {
      ;(mat.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.sin(t * 1.5) * 0.15
    }
  })
  return (
    <Float position={position} speed={0.8} floatY={0.9} rotSpeed={0.06}>
      <group ref={ref} scale={scale}>
        {/* cup */}
        <mesh>
          <cylinderGeometry args={[0.45, 0.25, 0.7, 16]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.5} emissive="#FFA502" emissiveIntensity={0.25} metalness={0.7} roughness={0.15} />
        </mesh>
        {/* stem */}
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.45} metalness={0.6} roughness={0.2} />
        </mesh>
        {/* base */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.45} metalness={0.6} roughness={0.2} />
        </mesh>
        {/* handles */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.5, 0, 0]} rotation={[0, 0, side * 0.3]}>
            <torusGeometry args={[0.18, 0.04, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#FFD700" transparent opacity={0.4} metalness={0.6} />
          </mesh>
        ))}
        {/* star on top */}
        <mesh position={[0, 0.5, 0]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.5} emissive="#FFD700" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── medal ── */
function Medal({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => { ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.4 })
  return (
    <Float position={position} speed={1.0} floatY={0.7} rotSpeed={0.08}>
      <group>
        {/* ribbon */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.3, 0.5, 0.04]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} />
        </mesh>
        {/* medal disc */}
        <mesh ref={ref}>
          <cylinderGeometry args={[0.4, 0.4, 0.06, 24]} />
          <meshStandardMaterial color={color} transparent opacity={0.5} metalness={0.7} roughness={0.15} emissive={color} emissiveIntensity={0.15} />
        </mesh>
        {/* inner star */}
        <mesh position={[0, 0, 0.04]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.35} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── crown ── */
function Crown({ position }: { position: [number, number, number] }) {
  return (
    <Float position={position} speed={0.7} floatY={1.0} rotSpeed={0.05}>
      <group>
        {/* base ring */}
        <mesh>
          <torusGeometry args={[0.6, 0.1, 12, 24]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.45} metalness={0.7} roughness={0.15} />
        </mesh>
        {/* peaks */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.55, 0.4, Math.sin(angle) * 0.55]}>
              <coneGeometry args={[0.1, 0.4, 6]} />
              <meshStandardMaterial color="#FFD700" transparent opacity={0.45} metalness={0.6} emissive="#FFA502" emissiveIntensity={0.2} />
            </mesh>
          )
        })}
        {/* jewels */}
        {[0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2
          const colors = ['#FF6B6B', '#00CEC9', '#6C5CE7']
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.6, 0.1, Math.sin(angle) * 0.6]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color={colors[i]} transparent opacity={0.6} emissive={colors[i]} emissiveIntensity={0.5} />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

/* ── firework burst (static) ── */
function FireworkBurst({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15)
  })
  return (
    <Float position={position} speed={1.2} floatY={0.5}>
      <group ref={ref}>
        {/* center */}
        <mesh>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        {/* rays */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const len = 0.5 + Math.random() * 0.3
          return (
            <mesh key={i} position={[Math.cos(angle) * len, Math.sin(angle) * len, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color={color} transparent opacity={0.35} emissive={color} emissiveIntensity={0.4} />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

function GlowOrb() {
  const ref = useRef<THREE.Mesh>(null!)
  const mouse = useMousePosition()
  useFrame(() => {
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouse.current.x * 6, 0.04)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouse.current.y * 4, 0.04)
  })
  return (
    <mesh ref={ref} position={[0, 0, 2]}>
      <sphereGeometry args={[1.5, 24, 24]} />
      <meshStandardMaterial color="#FFD700" transparent opacity={0.05} emissive="#FFD700" emissiveIntensity={0.3} />
    </mesh>
  )
}

function useResponsiveScale() {
  const { size } = useThree()
  return size.width < 640 ? 0.55 : size.width < 1024 ? 0.75 : 1
}

function Scene() {
  const s = useResponsiveScale()
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[8, 10, 6]} intensity={1.0} color="#fff8e0" />
      <pointLight position={[-10, -6, 8]} intensity={0.6} color="#FFD700" />
      <pointLight position={[10, 8, 10]} intensity={0.5} color="#FF6B6B" />
      <pointLight position={[0, -8, 5]} intensity={0.4} color="#6C5CE7" />
      <fog attach="fog" args={['#F5F0E8', 16, 38]} />

      <ParallaxCamera />
      <CelebrationSparkles />
      <GlowOrb />

      {/* Trophies */}
      <Trophy position={[-6 * s, 4 * s, -5]} scale={1.2} />
      <Trophy position={[7 * s, -3 * s, -7]} scale={0.9} />
      <Trophy position={[2 * s, 5 * s, -9]} scale={0.7} />

      {/* Medals */}
      <Medal position={[8 * s, 5 * s, -8]} color="#FFD700" />
      <Medal position={[-7 * s, -4 * s, -6]} color="#C0C0C0" />
      <Medal position={[-3 * s, 6 * s, -10]} color="#CD7F32" />

      {/* Crown */}
      <Crown position={[0, 7 * s, -8]} />

      {/* Firework Bursts */}
      <FireworkBurst position={[-9 * s, 2 * s, -7]} color="#FD79A8" />
      <FireworkBurst position={[9 * s, 3 * s, -6]} color="#FFD700" />
      <FireworkBurst position={[4 * s, -6 * s, -8]} color="#00CEC9" />
      <FireworkBurst position={[-5 * s, -6 * s, -9]} color="#6C5CE7" />
    </>
  )
}

export default function Scene_TrophyRoom() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setVisible(false)
  }, [])
  if (!visible) return null

  return (
    <div className="activity-3d-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ pointerEvents: 'none' }}>
        <Scene />
      </Canvas>
    </div>
  )
}
