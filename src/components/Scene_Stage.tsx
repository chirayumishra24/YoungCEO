import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Shared3DEnvironment, Sparkles, Float, useResponsiveScale } from './Shared3DEnvironment'

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

      <Sparkles palette={['#FFD700', '#6C5CE7', '#FFA502', '#a855f7', '#FDCB6E', '#5A4BD1']} size={0.13} />

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
  return (
    <Shared3DEnvironment>
      <Scene />
    </Shared3DEnvironment>
  )
}
