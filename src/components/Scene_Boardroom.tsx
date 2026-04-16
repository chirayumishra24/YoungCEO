import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Shared3DEnvironment, Sparkles, Float, useResponsiveScale } from './Shared3DEnvironment'

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
function RoleBadge({ position, color }: { position: [number, number, number]; color: string }) {
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

      <Sparkles palette={['#FF8A65', '#00CEC9', '#FDCB6E', '#FD79A8', '#6C5CE7', '#55E6C1']} />

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
  return (
    <Shared3DEnvironment>
      <Scene />
    </Shared3DEnvironment>
  )
}
