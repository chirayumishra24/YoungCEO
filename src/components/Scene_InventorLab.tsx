import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

/* ── mouse tracker ── */
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

/* ── parallax camera ── */
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

/* ── float wrapper ── */
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

/* ── sparkle particles ── */
function Sparkles() {
  const ref = useRef<THREE.Points>(null!)
  const { positions, colors } = useMemo(() => {
    const n = 220
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const palette = [
      new THREE.Color('#FDCB6E'), new THREE.Color('#00CEC9'),
      new THREE.Color('#FF6B6B'), new THREE.Color('#FFA502'),
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

/* ── glow orb ── */
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
      <meshStandardMaterial color="#FDCB6E" transparent opacity={0.06} emissive="#FDCB6E" emissiveIntensity={0.4} />
    </mesh>
  )
}

/* ── lightbulb ── */
function Lightbulb({ position, glowColor = '#FDCB6E' }: { position: [number, number, number]; glowColor?: string }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const mat = ref.current.children[0] as THREE.Mesh
    if (mat?.material && 'emissiveIntensity' in (mat.material as any)) {
      ;(mat.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.2
    }
  })
  return (
    <Float position={position} speed={1.0} floatY={0.9} rotSpeed={0.06}>
      <group ref={ref}>
        {/* bulb */}
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color={glowColor} transparent opacity={0.45} emissive={glowColor} emissiveIntensity={0.4} roughness={0.1} metalness={0.2} />
        </mesh>
        {/* base */}
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 0.35, 12]} />
          <meshStandardMaterial color="#636E8A" transparent opacity={0.4} roughness={0.3} metalness={0.5} />
        </mesh>
        {/* filament glow */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.15} emissive={glowColor} emissiveIntensity={0.8} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── beaker ── */
function Beaker({ position, liquidColor }: { position: [number, number, number]; liquidColor: string }) {
  return (
    <Float position={position} speed={0.8} floatY={0.7} rotSpeed={0.1}>
      <group>
        {/* flask body */}
        <mesh>
          <cylinderGeometry args={[0.35, 0.55, 1.2, 16]} />
          <meshStandardMaterial color="#E0F7FF" transparent opacity={0.25} roughness={0.05} metalness={0.3} />
        </mesh>
        {/* neck */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.18, 0.35, 0.5, 12]} />
          <meshStandardMaterial color="#E0F7FF" transparent opacity={0.2} roughness={0.05} metalness={0.3} />
        </mesh>
        {/* liquid */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.33, 0.52, 0.7, 16]} />
          <meshStandardMaterial color={liquidColor} transparent opacity={0.4} emissive={liquidColor} emissiveIntensity={0.3} />
        </mesh>
        {/* bubbles */}
        {[0.1, -0.1, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0.1 + i * 0.15, 0.1]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#fff" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

/* ── spinning cog ── */
function Cog({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => { ref.current.rotation.z = clock.elapsedTime * 0.25 })
  return (
    <Float position={position} speed={0.7} floatY={0.5}>
      <group scale={scale}>
        <mesh ref={ref}>
          <torusGeometry args={[0.65, 0.12, 8, 8]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} roughness={0.25} metalness={0.5} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.35} roughness={0.2} metalness={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── atom model ── */
function Atom({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.3
    ref.current.rotation.z = clock.elapsedTime * 0.15
  })
  return (
    <Float position={position} speed={0.9} floatY={0.8}>
      <group ref={ref}>
        {/* nucleus */}
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#FF6B6B" transparent opacity={0.5} emissive="#FF6B6B" emissiveIntensity={0.3} />
        </mesh>
        {/* orbits */}
        {[0, Math.PI / 3, -Math.PI / 3].map((tilt, i) => (
          <group key={i} rotation={[tilt, 0, i * 0.4]}>
            <mesh>
              <torusGeometry args={[0.9, 0.03, 8, 48]} />
              <meshStandardMaterial color="#74B9FF" transparent opacity={0.3} />
            </mesh>
            {/* electron */}
            <mesh position={[0.9, 0, 0]}>
              <sphereGeometry args={[0.08, 10, 10]} />
              <meshStandardMaterial color="#00CEC9" transparent opacity={0.6} emissive="#00CEC9" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  )
}

/* ── responsive scale ── */
function useResponsiveScale() {
  const { size } = useThree()
  return size.width < 640 ? 0.55 : size.width < 1024 ? 0.75 : 1
}

function Scene() {
  const s = useResponsiveScale()
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[8, 10, 6]} intensity={0.9} color="#fff8f0" />
      <pointLight position={[-10, -6, 8]} intensity={0.5} color="#FDCB6E" />
      <pointLight position={[10, 8, 10]} intensity={0.5} color="#00CEC9" />
      <pointLight position={[0, -8, 5]} intensity={0.3} color="#FF6B6B" />
      <fog attach="fog" args={['#F0EEFF', 16, 38]} />

      <ParallaxCamera />
      <Sparkles />
      <GlowOrb />

      {/* Lightbulbs */}
      <Lightbulb position={[-7 * s, 5 * s, -6]} glowColor="#FDCB6E" />
      <Lightbulb position={[8 * s, 3 * s, -7]} glowColor="#FFA502" />
      <Lightbulb position={[3 * s, -5 * s, -8]} glowColor="#FFD700" />

      {/* Beakers */}
      <Beaker position={[7 * s, -4 * s, -6]} liquidColor="#00CEC9" />
      <Beaker position={[-5 * s, -3 * s, -7]} liquidColor="#55E6C1" />

      {/* Cogs */}
      <Cog position={[-8 * s, -5 * s, -8]} color="#636E8A" scale={0.8 * s} />
      <Cog position={[9 * s, 5 * s, -9]} color="#FDCB6E" scale={0.6 * s} />

      {/* Atom */}
      <Atom position={[-4 * s, 6 * s, -10]} />
    </>
  )
}

export default function Scene_InventorLab() {
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
