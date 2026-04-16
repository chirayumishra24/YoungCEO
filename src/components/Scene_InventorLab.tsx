import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Shared3DEnvironment, Sparkles, Float, useResponsiveScale, useMousePosition } from './Shared3DEnvironment'

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
    <Float position={position} speed={0.7} floatY={0.5} scale={scale}>
      <group>
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

      <Sparkles palette={['#FDCB6E', '#00CEC9', '#FF6B6B', '#FFA502', '#74B9FF', '#55E6C1']} />
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
  return (
    <Shared3DEnvironment>
      <Scene />
    </Shared3DEnvironment>
  )
}
