import { useEffect, useRef } from 'react'

export function ThreeDOrb({ className }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const width = 360
    const height = 360
    canvas.width = width
    canvas.height = height

    // Initialize 3D points on a sphere
    const points = []
    const numPoints = 85
    const radius = 95

    for (let i = 0; i < numPoints; i++) {
      // Uniform distribution on sphere surface
      const theta = Math.acos(Math.random() * 2 - 1)
      const phi = Math.random() * Math.PI * 2
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        ox: radius * Math.sin(theta) * Math.cos(phi),
        oy: radius * Math.sin(theta) * Math.sin(phi),
        oz: radius * Math.sin(theta) * Math.sin(phi),
        opacity: Math.random() * 0.5 + 0.4,
      })
    }

    // Initialize 2 floating rings
    const ringPoints1 = []
    const ringPoints2 = []
    const numRingPoints = 40
    for (let i = 0; i < numRingPoints; i++) {
      const angle = (i / numRingPoints) * Math.PI * 2
      const r1 = radius * 1.3
      const r2 = radius * 1.5
      ringPoints1.push({ x: r1 * Math.cos(angle), y: 0, z: r1 * Math.sin(angle) })
      ringPoints2.push({ x: 0, y: r2 * Math.cos(angle), z: r2 * Math.sin(angle) })
    }

    let angleX = 0
    let angleY = 0
    let targetAngleX = 0
    let targetAngleY = 0

    const fov = 350

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - width / 2
      const y = e.clientY - rect.top - height / 2
      mouseRef.current.targetX = x
      mouseRef.current.targetY = y
      mouseRef.current.active = true

      // Alter rotation targets based on cursor
      targetAngleX = (y / (height / 2)) * 0.5
      targetAngleY = (x / (width / 2)) * 0.5
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
      targetAngleX = 0
      targetAngleY = 0
    }

    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse coordinates interpolation
      const mouse = mouseRef.current
      mouse.x += (mouse.targetX - mouse.x) * 0.1
      mouse.y += (mouse.targetY - mouse.y) * 0.1

      // Auto-rotation + mouse-tilt influence
      angleX += (targetAngleX + 0.003 - angleX) * 0.05
      angleY += (targetAngleY + 0.004 - angleY) * 0.05

      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)
      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)

      // Render glowing central energy core aura
      const radialGlow = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, radius * 1.2
      )
      radialGlow.addColorStop(0, 'rgba(34, 211, 238, 0.16)')
      radialGlow.addColorStop(0.3, 'rgba(168, 85, 247, 0.07)')
      radialGlow.addColorStop(0.7, 'rgba(34, 211, 238, 0.02)')
      radialGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = radialGlow
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, radius * 1.2, 0, Math.PI * 2)
      ctx.fill()

      // Core sphere mesh calculations
      const projected = points.map((p) => {
        // Warp particles towards cursor if mouse is nearby
        let px = p.x
        let py = p.y
        let pz = p.z

        if (mouse.active) {
          // Standard distance check in projected space
          const dx = px - mouse.x
          const dy = py - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const pullForce = (100 - dist) * 0.18
            px -= (dx / dist) * pullForce
            py -= (dy / dist) * pullForce
          }
        }

        // Apply X-axis rotation
        let y1 = py * cosX - pz * sinX
        let z1 = py * sinX + pz * cosX

        // Apply Y-axis rotation
        let x2 = px * cosY - z1 * sinY
        let z2 = px * sinY + z1 * cosY

        // Perspective projection
        const scale = fov / (fov + z2)
        const projX = x2 * scale + width / 2
        const projY = y1 * scale + height / 2

        return { x: projX, y: projY, z: z2, original: p }
      })

      // Draw connection lines (mesh)
      ctx.lineWidth = 0.55
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i]
          const p2 = projected[j]

          // 3D Distance check
          const dx = p1.original.x - p2.original.x
          const dy = p1.original.y - p2.original.y
          const dz = p1.original.z - p2.original.z
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist3D < 55) {
            // Draw connection line
            const zDepth = (p1.z + p2.z) / 2
            // Calculate opacity: fade line if connections are further or deep in background
            const depthFactor = Math.max(0, 1 - zDepth / (radius * 1.5))
            const proximityFactor = Math.max(0, 1 - dist3D / 55)
            const alpha = depthFactor * proximityFactor * 0.12

            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      projected.forEach((p) => {
        const radiusScale = Math.max(0.2, (fov - p.z) / fov) * 2
        ctx.beginPath()
        ctx.arc(p.x, p.y, radiusScale, 0, Math.PI * 2)

        // Shade particle color by depth (Z-buffer scale)
        const depthVal = Math.max(0, Math.min(1, (p.z + radius) / (radius * 2)))
        const r = Math.floor(34 + (168 - 34) * depthVal)
        const g = Math.floor(211 + (85 - 211) * depthVal)
        const b = Math.floor(238 + (247 - 238) * depthVal)
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.original.opacity * (1 - p.z / 220)})`
        ctx.shadowBlur = p.z < 0 ? 4 : 0
        ctx.shadowColor = 'rgba(34, 211, 238, 0.4)'
        ctx.fill()
        ctx.shadowBlur = 0 // Reset shadow
      })

      // Project & Draw Cyber Rings
      const drawRing = (ringPoints, rotationOffset, color) => {
        // Apply complex rotation specifically to ring
        const cosR = Math.cos(angleX + rotationOffset)
        const sinR = Math.sin(angleX + rotationOffset)

        const ringProjected = ringPoints.map((p) => {
          let y1 = p.y * cosR - p.z * sinR
          let z1 = p.y * sinR + p.z * cosR

          let x2 = p.x * cosY - z1 * sinY
          let z2 = p.x * sinY + z1 * cosY

          const scale = fov / (fov + z2)
          return { x: x2 * scale + width / 2, y: y1 * scale + height / 2, z: z2 }
        })

        // Draw ring segments
        ctx.lineWidth = 0.95
        ctx.strokeStyle = color
        ctx.beginPath()
        ringProjected.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y)
          else {
            // Check segment visibility (draw solid if in front, dashed/invisible if back)
            if (idx % 2 === 0) {
              ctx.lineTo(p.x, p.y)
            } else {
              ctx.moveTo(p.x, p.y)
            }
          }
        })
        ctx.closePath()
        ctx.stroke()
      }

      drawRing(ringPoints1, 0.4, 'rgba(34, 211, 238, 0.22)')
      drawRing(ringPoints2, -0.6, 'rgba(168, 85, 247, 0.16)')

      // Draw Orbiting Satellite Dots
      const time = Date.now() * 0.0015
      const orbitSatellites = [
        { angle: time, dist: radius * 1.4, size: 2.5, color: '#22d3ee' },
        { angle: -time * 0.8 + Math.PI, dist: radius * 1.6, size: 3.2, color: '#a855f7' },
      ]

      orbitSatellites.forEach((sat) => {
        // Orbit on rotated planes
        const sx = sat.dist * Math.cos(sat.angle)
        const sz = sat.dist * Math.sin(sat.angle)
        
        let y1 = 0 * cosX - sz * sinX
        let z1 = 0 * sinX + sz * cosX

        let x2 = sx * cosY - z1 * sinY
        let z2 = sx * sinY + z1 * cosY

        const scale = fov / (fov + z2)
        const projX = x2 * scale + width / 2
        const projY = y1 * scale + height / 2

        ctx.beginPath()
        ctx.arc(projX, projY, sat.size, 0, Math.PI * 2)
        ctx.fillStyle = sat.color
        ctx.shadowBlur = 8
        ctx.shadowColor = sat.color
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Decorative SVG crosshairs / telemetry graphics */}
      <div className="absolute inset-0 border border-dashed border-white/5 rounded-full scale-110 animate-[spin_50s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-0 border border-dotted border-primary/10 rounded-full scale-125 animate-[spin_30s_linear_infinite_reverse] pointer-events-none" />
      
      {/* Radial sweep glowing particles background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-primary/10 blur-[50px] mix-blend-screen pointer-events-none" />

      <canvas
        ref={canvasRef}
        className="relative z-10 cursor-crosshair drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]"
      />
    </div>
  )
}
