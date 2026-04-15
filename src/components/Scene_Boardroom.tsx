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

function Sparkles() {
  const ref = useRef<THREE.Points>(null!)
  const { positions, colors } = useMemo(() => {
    const n = 200
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const palette = [
      new THREE.Color('#FF8A65'), new THREE.Color('#00CEC9'),
      new THREE.Color('#FDCB6E'), new THREE.Color('#FD79A8'),
      new THREE.Color('#6C5CE7'), new THREE.Color('#55E6C1'),
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
    ref.current.rotation.y = clock.elapsedTime * 0.015
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} vertexColors transparent opacity={0.45} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ── puzzle piece ── */
function PuzzlePiece({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float position={position} speed={1.0} floatY={0.8} rotSpeed={0.1}>
      <group>
        {/* main body */}
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.15]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} roughness={0.2} metalness={0.3} />
        </mesh>
        {/* tab right */}
        <mesh position={[0.5, 0, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} roughness={0.2} metalness={0.3} />
        </mesh>
        {/* tab top */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} roughness={0.2} metalness={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── handshake shape ── */
function Handshake({ position }: { position: [number, number, number] }) {
  return (
    <Float position={position} speed={0.8} floatY={0.6} rotSpeed={0.05}>
      <group>
        {/* left hand */}
        <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.5, 0.25, 0.12]} />
          <meshStandardMaterial color="#FF8A65" transparent opacity={0.4} roughness={0.3} />
        </mesh>
        {/* right hand */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.5, 0.25, 0.12]} />
          <meshStandardMaterial color="#FDCB6E" transparent opacity={0.4} roughness={0.3} />
        </mesh>
        {/* clasp glow */}
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#00CEC9" transparent opacity={0.25} emissive="#00CEC9" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── role badge ── */
function RoleBadge({ position, color, emoji }: { position: [number, number, number]; color: string; emoji?: string }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.3
  })
  return (
    <Float position={position} speed={1.1} floatY={0.7} rotSpeed={0.06}>
      <group ref={ref}>
        {/* shield shape */}
        <mesh>
          <cylinderGeometry args={[0.5, 0.35, 0.1, 6]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} metalness={0.4} roughness={0.2} />
        </mesh>
        {/* inner glow */}
        <mesh position={[0, 0, 0.06]}>
          <cylinderGeometry args={[0.35, 0.25, 0.05, 6]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.2} emissive={color} emissiveIntensity={0.3} />
        </mesh>
        {/* ring accent */}
        <mesh>
          <torusGeometry args={[0.55, 0.04, 8, 24]} />
          <meshStandardMaterial color={color} transparent opacity={0.3} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── briefcase ── */
function Briefcase({ position }: { position: [number, number, number] }) {
  return (
    <Float position={position} speed={0.7} floatY={0.6} rotSpeed={0.08}>
      <group>
        {/* body */}
        <mesh>
          <boxGeometry args={[1.0, 0.7, 0.35]} />
          <meshStandardMaterial color="#5A4BD1" transparent opacity={0.35} roughness={0.25} metalness={0.3} />
        </mesh>
        {/* handle */}
        <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.04, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#636E8A" transparent opacity={0.45} metalness={0.5} />
        </mesh>
        {/* clasp */}
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[0.15, 0.1, 0.05]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.5} metalness={0.6} />
        </mesh>
      </group>
    </Float>
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
      <ambientLight intensity={1.4} />
      <directionalLight position={[8, 10, 6]} intensity={0.9} color="#fff5e0" />
      <pointLight position={[-10, -6, 8]} intensity={0.5} color="#FF8A65" />
      <pointLight position={[10, 8, 10]} intensity={0.5} color="#00CEC9" />
      <pointLight position={[0, -8, 5]} intensity={0.3} color="#FDCB6E" />
      <fog attach="fog" args={['#F0EEFF', 16, 38]} />

      <ParallaxCamera />
      <Sparkles />

      {/* Puzzle Pieces */}
      <PuzzlePiece position={[-7 * s, 5 * s, -6]} color="#FF8A65" />
      <PuzzlePiece position={[8 * s, 4 * s, -7]} color="#00CEC9" />
      <PuzzlePiece position={[-4 * s, -5 * s, -8]} color="#6C5CE7" />
      <PuzzlePiece position={[5 * s, -3 * s, -5]} color="#FDCB6E" />

      {/* Handshake */}
      <Handshake position={[-8 * s, -2 * s, -7]} />
      <Handshake position={[3 * s, 6 * s, -9]} />

      {/* Role Badges */}
      <RoleBadge position={[9 * s, -5 * s, -8]} color="#FD79A8" />
      <RoleBadge position={[-6 * s, 3 * s, -9]} color="#55E6C1" />
      <RoleBadge position={[6 * s, -6 * s, -10]} color="#FFD700" />

      {/* Briefcases */}
      <Briefcase position={[-9 * s, -5 * s, -6]} />
      <Briefcase position={[7 * s, 2 * s, -8]} />
    </>
  )
}

export default function Scene_Boardroom() {
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
