'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import type { ShowcaseItem } from './types'

const DEG = Math.PI / 180

/** Цвет подиума из токенов дизайн-системы (CSS-переменная), без хардкода hex */
function tokenColor(name: string): THREE.Color {
  const css = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()
  return css ? new THREE.Color(css) : new THREE.Color()
}

/** Мягкая контактная тень: радиальный градиент на канвасе */
function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64)
    const ink = tokenColor('ink')
    const rgb = `${Math.round(ink.r * 255)}, ${Math.round(ink.g * 255)}, ${Math.round(ink.b * 255)}`
    g.addColorStop(0, `rgba(${rgb}, 0.35)`)
    g.addColorStop(1, `rgba(${rgb}, 0)`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function Arc({ items, progress }: { items: ShowcaseItem[]; progress: RefObject<number> }) {
  const textures = useTexture(items.map((i) => i.image?.src ?? '/favicon.svg'))
  const shadow = useShadowTexture()
  const groups = useRef<Array<THREE.Group | null>>([])
  const products = useRef<Array<THREE.Mesh | null>>([])
  const colors = useMemo(() => items.map((i) => tokenColor(i.podium)), [items])
  const tones = useMemo(() => {
    const ink = tokenColor('ink')
    return colors.map((c) => c.clone().lerp(ink, 0.12))
  }, [colors])

  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
  })

  useFrame((state) => {
    const p = progress.current ?? 0
    const time = state.clock.elapsedTime
    items.forEach((_, i) => {
      const g = groups.current[i]
      const product = products.current[i]
      if (!g) return
      const o = i - p
      const abs = Math.abs(o)
      const near = Math.min(abs, 1)
      const far = Math.max(0, Math.min(abs, 3) - 1)
      // та же дуга, что и в CSS-варианте: активная в центре, соседние 0.7 и ±25° по Y
      g.position.set(o * 1.85 * (1 - Math.min(abs, 3) * 0.05), -near * 0.12 - far * 0.18, -near * 1.1 - far * 0.9)
      g.rotation.y = -Math.sign(o) * (near * 25 + far * 10) * DEG
      const s = abs <= 1 ? 1 - near * 0.3 : Math.max(0.42, 0.7 - far * 0.12)
      g.scale.setScalar(s)
      g.visible = abs < 2.8
      if (product) {
        // активный товар медленно поворачивается на подиуме ±8° и чуть парит
        const active = abs < 0.5
        product.rotation.y = active ? Math.sin(time * 0.9) * 8 * DEG : 0
        product.position.y = 0.95 + Math.sin(time * 1.2 + i) * 0.03
      }
    })
  })

  return (
    <group position={[0, -0.6, 0]}>
      {items.map((item, i) => {
        const tex = textures[i]
        const img = tex.image as { width?: number; height?: number } | undefined
        const aspect = img?.width && img?.height ? img.width / img.height : 1
        const h = 1.7
        return (
          <group key={item.id} ref={(el) => void (groups.current[i] = el)}>
            {/* подиум: цилиндр цвета из CMS (один из акцентов палитры) */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.95, 0.95, 0.16, 64]} />
              <meshStandardMaterial color={tones[i]} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.95, 64]} />
              <meshStandardMaterial color={colors[i]} roughness={0.85} />
            </mesh>
            {/* контактная тень под парящим товаром */}
            <mesh position={[0, 0.04, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.5, 0.9]} />
              <meshBasicMaterial map={shadow} transparent depthWrite={false} />
            </mesh>
            {/* вырезанное фото товара — плоскость-текстура */}
            <mesh ref={(el) => void (products.current[i] = el)} position={[0, 0.95, 0.1]}>
              <planeGeometry args={[h * aspect, h]} />
              <meshBasicMaterial map={tex} transparent alphaTest={0.02} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/**
 * WebGL-сцена витрины (R3F): плоскости-текстуры, не 3D-модели; dpr не выше 1.5, текстуры до 1024 px.
 * Позицию берёт из того же progress, что и CSS-вариант — управление (скролл, драг, стрелки) общее.
 */
export default function WebGLStage({ items, progress }: { items: ShowcaseItem[]; progress: RefObject<number> }) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.55, 5.4], fov: 36 }}
      aria-hidden
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 4, 3]} intensity={0.9} />
      <Suspense fallback={null}>
        <Arc items={items} progress={progress} />
      </Suspense>
    </Canvas>
  )
}
