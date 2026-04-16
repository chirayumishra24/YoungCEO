import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Shared3DEnvironment, Sparkles, Float, useResponsiveScale, useMousePosition } from './Shared3DEnvironment'

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
    <Float position={position} speed={0.8} floatY={0.9} rotSpeed={0.06} scale={scale}>
      <group ref={ref}>
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

      <Sparkles count={300} size={0.18} opacity={0.55} palette={['#FFD700', '#FFA502', '#FF6B6B', '#a855f7', '#6C5CE7', '#00CEC9', '#FD79A8', '#55E6C1']} />
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
  return (
    <Shared3DEnvironment>
      <Scene />
    </Shared3DEnvironment>
  )
}
