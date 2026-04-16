import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ── mouse tracker ── */
export function useMousePosition() {
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
export function ParallaxCamera() {
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
export function Float({ children, position, speed = 1, floatY = 0.8, rotSpeed = 0.12, scale = 1 }: {
  children: React.ReactNode; position: [number, number, number]; speed?: number; floatY?: number; rotSpeed?: number; scale?: number
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
  return <group ref={ref} position={position} scale={scale}>{children}</group>
}

/* ── responsive scale ── */
export function useResponsiveScale() {
  const { size } = useThree()
  return size.width < 640 ? 0.55 : size.width < 1024 ? 0.75 : 1
}

/* ── sparkle particles ── */
export function Sparkles({ 
  count = 200, 
  palette = ['#FDCB6E', '#00CEC9', '#FF6B6B', '#FFA502', '#74B9FF', '#55E6C1'], 
  size = 0.14,
  opacity = 0.45 
}: { count?: number; palette?: string[]; size?: number; opacity?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const colorObjs = palette.map(p => new THREE.Color(p))
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 18
      const a = Math.random() * Math.PI * 2
      const b = (Math.random() - 0.5) * Math.PI
      pos[i * 3] = Math.cos(a) * Math.cos(b) * r
      pos[i * 3 + 1] = Math.sin(b) * r * 0.6
      pos[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r * 0.5 - 5
      const c = colorObjs[Math.floor(Math.random() * colorObjs.length)]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [count, palette])
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.015
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} vertexColors transparent opacity={opacity} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ── Standard Background Wrapper ── */
export function Shared3DEnvironment({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setVisible(false)
  }, [])
  if (!visible) return null

  return (
    <div className="activity-3d-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ pointerEvents: 'none' }}>
        <ParallaxCamera />
        {children}
      </Canvas>
    </div>
  )
}
