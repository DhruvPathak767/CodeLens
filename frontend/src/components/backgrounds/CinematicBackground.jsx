import { AnimatedGridBackground } from './AnimatedGridBackground'
import { MeshGradientBackground } from './MeshGradientBackground'
import { FloatingParticles } from './FloatingParticles'
import { LightBeamEffects } from './LightBeamEffects'
import { NoiseOverlay } from './NoiseOverlay'
import { GlowOrbLayer } from './GlowOrbLayer'
import { CyberLines } from './CyberLines'

export function CinematicBackground({
  showGrid = true,
  showParticles = true,
  showBeams = true,
  showOrbs = true,
  showCyberLines = false,
  showNoise = true,
  particleCount = 30,
  className = '',
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <MeshGradientBackground />
      {showOrbs && <GlowOrbLayer />}
      {showGrid && <AnimatedGridBackground />}
      {showCyberLines && <CyberLines />}
      {showParticles && <FloatingParticles count={particleCount} />}
      {showBeams && <LightBeamEffects />}
      {showNoise && <NoiseOverlay />}
    </div>
  )
}

// Legacy alias
export { CinematicBackground as MeshBackground }
