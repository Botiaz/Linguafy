'use client'

import { useEffect, useRef } from 'react'

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function HeroAnimation() {
  const sectionRef = useRef<HTMLElement>(null)
  const textGroupRef = useRef<HTMLDivElement>(null)
  const cardFrontRef = useRef<HTMLDivElement>(null)
  const cardBackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function updateAnimation() {
      const section = sectionRef.current
      const textGroup = textGroupRef.current
      const cardFront = cardFrontRef.current
      const cardBack = cardBackRef.current

      if (!section || !textGroup || !cardFront || !cardBack) return

      const localScroll = window.scrollY - section.offsetTop
      const maxScroll = section.offsetHeight - window.innerHeight
      const progress = clamp(localScroll / maxScroll)

      const phaseOne = clamp(progress / 0.6)

      const rotateY = phaseOne * 180

      const textOpacity = 1 - phaseOne
      const showBack = rotateY >= 90

      textGroup.style.opacity = `${clamp(textOpacity)}`
      cardFront.style.transform = `rotateY(${rotateY}deg)`
      cardBack.style.transform = `rotateY(${rotateY - 180}deg)`
      cardFront.style.opacity = showBack ? '0' : '1'
      cardBack.style.opacity = showBack ? '1' : '0'
    }

    updateAnimation()
    window.addEventListener('scroll', updateAnimation, { passive: true })
    window.addEventListener('resize', updateAnimation)

    return () => {
      window.removeEventListener('scroll', updateAnimation)
      window.removeEventListener('resize', updateAnimation)
    }
  }, [])

  return (
    <section ref={sectionRef} className="hero-scroll relative h-[220vh] bg-[#0f0f0f]">
      <div className="hero-sticky sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_65%,rgba(99,102,241,0.22),transparent_70%)]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-4 [perspective:1000px]">
          <div ref={textGroupRef} className="mb-10 text-center transition-opacity duration-150">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Aprenda mais. Lembre mais.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-zinc-300 sm:text-lg md:text-xl">
              Flashcards inteligentes que transformam estudo em progresso real.
            </p>
            <a
              href="/auth/login"
              className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:opacity-90"
            >
              Comecar agora
            </a>
          </div>

          <div className="card-scene relative h-[180px] w-[280px] [perspective:1000px] sm:h-[200px] sm:w-[320px]">
            <div
              className="card absolute inset-0 rounded-[12px]"
            >
              <div
                ref={cardFrontRef}
                className="card-face card-front absolute inset-0 flex items-center justify-center rounded-[12px] border border-white/20 bg-white px-5 text-center shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
              >
                <p className="text-xl font-semibold text-zinc-600 sm:text-2xl">Bem vindo</p>
              </div>

              <div
                ref={cardBackRef}
                className="card-face card-back absolute inset-0 flex items-center justify-center rounded-[12px] bg-gradient-to-br from-[#6366f1] to-[#3b82f6] px-5 text-center shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
              >
                <p className="text-lg font-semibold text-white sm:text-2xl">Welcome</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .card {
          transition: opacity 120ms linear;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }

        .card-face {
          transition: opacity 120ms linear;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  )
}
