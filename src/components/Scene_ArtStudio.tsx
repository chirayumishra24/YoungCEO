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
      new THREE.Color('#FD79A8'), new THREE.Color('#97CE4C'),
      new THREE.Color('#ff2d78'), new THREE.Color('#a855f7'),
      new THREE.Color('#3b82f6'), new THREE.Color('#FFD700'),
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
      <pointsMaterial size={0.16} vertexColors transparent opacity={0.5} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ── paint brush ── */
function PaintBrush({ position, color, rotation = [0, 0, 0.4] }: { position: [number, number, number]; color: string; rotation?: [number, number, number] }) {
  return (
    <Float position={position} speed={1.1} floatY={0.9} rotSpeed={0.08}>
      <group rotation={rotation}>
        {/* handle */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 1.6, 8]} />
          <meshStandardMaterial color="#8B6914" transparent opacity={0.5} roughness={0.4} />
        </mesh>
        {/* ferrule */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.2, 10]} />
          <meshStandardMaterial color="#C0C0C0" transparent opacity={0.45} metalness={0.6} roughness={0.15} />
        </mesh>
        {/* bristles */}
        <mesh position={[0, 0.3, 0]}>
          <coneGeometry args={[0.14, 0.45, 12]} />
          <meshStandardMaterial color={color} transparent opacity={0.55} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

/* ── color palette ── */
function Palette({ position }: { position: [number, number, number] }) {
  const paletteColors = ['#FF6B6B', '#FDCB6E', '#00CEC9', '#6C5CE7', '#FD79A8', '#55E6C1']
  return (
    <Float position={position} speed={0.7} floatY={0.6} rotSpeed={0.06}>
      <group rotation={[0.3, 0, 0]}>
        {/* palette body */}
        <mesh>
          <cylinderGeometry args={[1.2, 1.2, 0.12, 32]} />
          <meshStandardMaterial color="#F5E6D3" transparent opacity={0.4} roughness={0.5} />
        </mesh>
        {/* thumb hole */}
        <mesh position={[-0.5, 0.05, -0.3]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#2D3047" transparent opacity={0.2} />
        </mesh>
        {/* paint dots */}
        {paletteColors.map((col, i) => {
          const angle = (i / paletteColors.length) * Math.PI * 1.5 + 0.3
          const r = 0.7
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 0.08, Math.sin(angle) * r]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color={col} transparent opacity={0.6} emissive={col} emissiveIntensity={0.3} />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

/* ── paint splash ── */
function PaintSplash({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float position={position} speed={1.3} floatY={1.0} rotSpeed={0.15}>
      <group>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.35} emissive={color} emissiveIntensity={0.4} />
        </mesh>
        {/* splash droplets */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.6, Math.sin(a) * 0.4, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={color} transparent opacity={0.3} emissive={color} emissiveIntensity={0.3} />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

/* ── pencil ── */
function Pencil({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float position={position} speed={0.9} floatY={0.7} rotSpeed={0.1}>
      <group rotation={[0, 0, 0.6]}>
        {/* body */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 6]} />
          <meshStandardMaterial color={color} transparent opacity={0.5} roughness={0.3} />
        </mesh>
        {/* tip */}
        <mesh position={[0, 1.05, 0]}>
          <coneGeometry args={[0.08, 0.3, 6]} />
          <meshStandardMaterial color="#F5E6D3" transparent opacity={0.45} roughness={0.4} />
        </mesh>
        {/* lead */}
        <mesh position={[0, 1.22, 0]}>
          <coneGeometry args={[0.03, 0.12, 6]} />
          <meshStandardMaterial color="#2D3047" transparent opacity={0.5} />
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
      <directionalLight position={[8, 10, 6]} intensity={0.9} color="#fff0f5" />
      <pointLight position={[-10, -6, 8]} intensity={0.5} color="#FD79A8" />
      <pointLight position={[10, 8, 10]} intensity={0.5} color="#97CE4C" />
      <pointLight position={[0, -8, 5]} intensity={0.3} color="#a855f7" />
      <fog attach="fog" args={['#F5F0FF', 16, 38]} />

      <ParallaxCamera />
      <Sparkles />

      {/* Paint Brushes */}
      <PaintBrush position={[-7 * s, 5 * s, -6]} color="#FD79A8" />
      <PaintBrush position={[8 * s, -3 * s, -7]} color="#00CEC9" rotation={[0, 0, -0.5]} />
      <PaintBrush position={[-3 * s, -6 * s, -8]} color="#a855f7" rotation={[0, 0, 0.8]} />

      {/* Palette */}
      <Palette position={[6 * s, 5 * s, -9]} />

      {/* Paint Splashes */}
      <PaintSplash position={[-8 * s, -2 * s, -5]} color="#ff2d78" />
      <PaintSplash position={[4 * s, -5 * s, -7]} color="#97CE4C" />
      <PaintSplash position={[9 * s, 2 * s, -8]} color="#FFD700" />

      {/* Pencils */}
      <Pencil position={[-5 * s, 3 * s, -8]} color="#3b82f6" />
      <Pencil position={[7 * s, -6 * s, -6]} color="#FD79A8" />
    </>
  )
}

export default function Scene_ArtStudio() {
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
