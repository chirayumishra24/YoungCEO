import { Canvas, useFrame } from '@react-three/fiber'
import { type ReactNode, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { cx } from './StudioPage'

function ParallaxCamera() {
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2 }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 1.5 + Math.sin(t * 0.08) * 0.5, 0.02)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouse.current.y * 1 + Math.cos(t * 0.06) * 0.3, 0.02)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function FloatingGroup({ children, floatIntensity, position, rotation = [0, 0, 0], rotationIntensity, speed }: {
  children: ReactNode; floatIntensity: number; position: [number, number, number]; rotation?: [number, number, number]; rotationIntensity: number; speed: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current.position.x = position[0] + Math.sin(t * speed * 0.2 + offset) * 0.24
    ref.current.position.y = position[1] + Math.sin(t * speed * 0.56 + offset) * floatIntensity
    ref.current.rotation.x = rotation[0] + Math.sin(t * speed * 0.3 + offset) * rotationIntensity
    ref.current.rotation.y = rotation[1] + Math.cos(t * speed * 0.27 + offset) * rotationIntensity
    ref.current.rotation.z = rotation[2] + Math.sin(t * speed * 0.22 + offset) * rotationIntensity * 0.6
  })
  return <group ref={ref} position={position} rotation={rotation}>{children}</group>
}

function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const { positions, colors } = useMemo(() => {
    const n = 180
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const palette = [new THREE.Color('#6C5CE7'), new THREE.Color('#00CEC9'), new THREE.Color('#FDCB6E'), new THREE.Color('#FD79A8'), new THREE.Color('#74B9FF')]
    for (let i = 0; i < n; i++) {
      const r = 5 + Math.random() * 14; const a = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = (Math.random() - 0.5) * 12; pos[i * 3 + 2] = Math.sin(a) * r * 0.45 - 7
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [])
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.025; ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.03) * 0.05 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.35} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function PulseHalo({ color, radius, tilt = 0 }: { color: string; radius: number; tilt?: number }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => { ref.current.rotation.z = tilt + clock.elapsedTime * 0.14 })
  return (
    <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <mesh><torusGeometry args={[radius, 0.025, 8, 48]} /><meshBasicMaterial color={color} transparent opacity={0.2} /></mesh>
      <mesh position={[radius, 0, 0]}><sphereGeometry args={[0.07, 10, 10]} /><meshBasicMaterial color={color} transparent opacity={0.5} /></mesh>
    </group>
  )
}

function SmartBand({ position }: { position: [number, number, number] }) {
  return (
    <FloatingGroup floatIntensity={0.6} position={position} rotation={[0.45, -0.75, 0.25]} rotationIntensity={0.16} speed={1.15}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.55, 0.32, 18, 52]} /><meshStandardMaterial color="#C8B6FF" transparent opacity={0.22} roughness={0.15} metalness={0.45} /></mesh>
      <mesh position={[0, 0, 0.28]}><boxGeometry args={[1.56, 1.08, 0.32]} /><meshStandardMaterial color="#6C5CE7" transparent opacity={0.28} roughness={0.12} metalness={0.3} /></mesh>
      <mesh position={[0, 0.02, 0.46]}><planeGeometry args={[1.08, 0.7]} /><meshBasicMaterial color="#E8E0FF" transparent opacity={0.25} /></mesh>
      <PulseHalo color="#6C5CE7" radius={2.2} />
    </FloatingGroup>
  )
}

function SmartBadge({ position }: { position: [number, number, number] }) {
  return (
    <FloatingGroup floatIntensity={0.56} position={position} rotation={[0.2, 0.65, -0.15]} rotationIntensity={0.18} speed={1.35}>
      <mesh><boxGeometry args={[2.2, 2.95, 0.2]} /><meshStandardMaterial color="#B8F0EE" transparent opacity={0.22} roughness={0.2} metalness={0.3} /></mesh>
      <mesh position={[0, 1.84, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.42, 0.07, 12, 44]} /><meshBasicMaterial color="#00CEC9" transparent opacity={0.32} /></mesh>
      <mesh position={[0, 0.42, 0.14]}><boxGeometry args={[1.22, 0.76, 0.05]} /><meshBasicMaterial color="#E0FFFF" transparent opacity={0.25} /></mesh>
      <PulseHalo color="#00CEC9" radius={2.55} tilt={0.35} />
    </FloatingGroup>
  )
}

function SmartBag({ position }: { position: [number, number, number] }) {
  return (
    <FloatingGroup floatIntensity={0.5} position={position} rotation={[-0.15, -0.5, 0.28]} rotationIntensity={0.14} speed={1.05}>
      <mesh position={[0, 0.1, 0]}><boxGeometry args={[2.45, 1.7, 1.02]} /><meshStandardMaterial color="#FFF0C8" transparent opacity={0.22} roughness={0.18} metalness={0.28} /></mesh>
      <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.82, 0.1, 14, 42]} /><meshBasicMaterial color="#FDCB6E" transparent opacity={0.28} /></mesh>
      <PulseHalo color="#FDCB6E" radius={2.35} tilt={-0.3} />
    </FloatingGroup>
  )
}

function SmartRing({ position }: { position: [number, number, number] }) {
  return (
    <FloatingGroup floatIntensity={0.72} position={position} rotation={[0.9, 0.35, 0.28]} rotationIntensity={0.22} speed={1.45}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.15, 0.25, 18, 52]} /><meshStandardMaterial color="#FFD1E1" transparent opacity={0.24} roughness={0.12} metalness={0.4} /></mesh>
      <mesh position={[0, 0, 0.28]}><sphereGeometry args={[0.3, 18, 18]} /><meshStandardMaterial color="#FD79A8" transparent opacity={0.35} roughness={0.05} metalness={0.3} /></mesh>
      <PulseHalo color="#FD79A8" radius={1.8} />
    </FloatingGroup>
  )
}

export default function ThreeBackground({ className = '' }: { className?: string }) {
  return (
    <div className={cx('three-canvas absolute inset-0 overflow-hidden rounded-[28px]', className)} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 18], fov: 52 }} dpr={[1, 1.4]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[8, 10, 6]} intensity={1} color="#f8fdff" />
        <pointLight position={[-10, -6, 8]} intensity={0.6} color="#6C5CE7" />
        <pointLight position={[10, 8, 10]} intensity={0.6} color="#00CEC9" />
        <fog attach="fog" args={['#F0EEFF', 14, 34]} />
        <ParallaxCamera />
        <Particles />
        <SmartBand position={[-6.5, 4.1, -4.8]} />
        <SmartBadge position={[6.3, 3.7, -6.1]} />
        <SmartBag position={[-5.2, -4.6, -5.5]} />
        <SmartRing position={[5.4, -4.2, -4]} />
      </Canvas>
    </div>
  )
}
