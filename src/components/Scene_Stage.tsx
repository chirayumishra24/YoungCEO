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
      new THREE.Color('#FFD700'), new THREE.Color('#6C5CE7'),
      new THREE.Color('#FFA502'), new THREE.Color('#a855f7'),
      new THREE.Color('#FDCB6E'), new THREE.Color('#5A4BD1'),
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
      <pointsMaterial size={0.13} vertexColors transparent opacity={0.45} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ── microphone ── */
function Microphone({ position }: { position: [number, number, number] }) {
  return (
    <Float position={position} speed={0.9} floatY={0.9} rotSpeed={0.06}>
      <group>
        {/* head */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.35, 20, 20]} />
          <meshStandardMaterial color="#636E8A" transparent opacity={0.45} metalness={0.7} roughness={0.15} />
        </mesh>
        {/* mesh grille */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.37, 12, 12]} />
          <meshStandardMaterial color="#9CA3BF" transparent opacity={0.15} wireframe />
        </mesh>
        {/* body */}
        <mesh>
          <cylinderGeometry args={[0.12, 0.14, 1.0, 12]} />
          <meshStandardMaterial color="#2D3047" transparent opacity={0.45} metalness={0.5} roughness={0.2} />
        </mesh>
        {/* ring */}
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.15, 0.03, 8, 24]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.5} emissive="#FFD700" emissiveIntensity={0.3} metalness={0.6} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── speech bubble ── */
function SpeechBubble({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float position={position} speed={1.2} floatY={1.0} rotSpeed={0.04}>
      <group>
        {/* bubble */}
        <mesh>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshStandardMaterial color={color} transparent opacity={0.25} emissive={color} emissiveIntensity={0.15} roughness={0.1} />
        </mesh>
        {/* tail */}
        <mesh position={[-0.3, -0.55, 0]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.15, 0.35, 8]} />
          <meshStandardMaterial color={color} transparent opacity={0.25} />
        </mesh>
        {/* dots inside */}
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.3]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#fff" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

/* ── floating coin ── */
function Coin({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.8 })
  return (
    <Float position={position} speed={1.0} floatY={0.7}>
      <mesh ref={ref}>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 24]} />
        <meshStandardMaterial color="#FFD700" transparent opacity={0.5} emissive="#FFA502" emissiveIntensity={0.3} metalness={0.7} roughness={0.15} />
      </mesh>
    </Float>
  )
}

/* ── bar chart ── */
function BarChart({ position }: { position: [number, number, number] }) {
  const heights = [0.5, 0.9, 0.7, 1.2, 0.8]
  const barColors = ['#6C5CE7', '#a855f7', '#FFD700', '#FFA502', '#00CEC9']
  return (
    <Float position={position} speed={0.6} floatY={0.5} rotSpeed={0.04}>
      <group>
        {heights.map((h, i) => (
          <mesh key={i} position={[(i - 2) * 0.35, h / 2 - 0.4, 0]}>
            <boxGeometry args={[0.22, h, 0.15]} />
            <meshStandardMaterial color={barColors[i]} transparent opacity={0.4} emissive={barColors[i]} emissiveIntensity={0.15} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

/* ── spotlight cone ── */
function Spotlight({ position }: { position: [number, number, number] }) {
  return (
    <Float position={position} speed={0.5} floatY={0.4} rotSpeed={0.03}>
      <group rotation={[Math.PI, 0, 0]}>
        <mesh>
          <coneGeometry args={[1.5, 3, 24, 1, true]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.06} emissive="#FFD700" emissiveIntensity={0.15} side={THREE.DoubleSide} />
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
      <ambientLight intensity={1.2} />
      <directionalLight position={[8, 10, 6]} intensity={0.8} color="#fff8e0" />
      <pointLight position={[-10, -6, 8]} intensity={0.6} color="#FFD700" />
      <pointLight position={[10, 8, 10]} intensity={0.5} color="#6C5CE7" />
      <pointLight position={[0, 10, 5]} intensity={0.4} color="#FFA502" />
      <fog attach="fog" args={['#F0EEFF', 16, 38]} />

      <ParallaxCamera />
      <Sparkles />

      {/* Microphones */}
      <Microphone position={[-7 * s, 4 * s, -5]} />
      <Microphone position={[5 * s, -4 * s, -7]} />

      {/* Speech Bubbles */}
      <SpeechBubble position={[8 * s, 5 * s, -8]} color="#6C5CE7" />
      <SpeechBubble position={[-5 * s, -5 * s, -6]} color="#FFD700" />
      <SpeechBubble position={[-8 * s, 2 * s, -9]} color="#a855f7" />

      {/* Coins */}
      <Coin position={[7 * s, -2 * s, -6]} />
      <Coin position={[-4 * s, 6 * s, -7]} />
      <Coin position={[3 * s, -6 * s, -8]} />

      {/* Bar Chart */}
      <BarChart position={[9 * s, 3 * s, -10]} />

      {/* Spotlight */}
      <Spotlight position={[0, 8 * s, -8]} />
    </>
  )
}

export default function Scene_Stage() {
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
