'use client'

import { useEffect, useRef } from 'react'

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function HeroAnimation() {
  const sectionRef = useRef<HTMLElement>(null)
  const textGroupRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function updateAnimation() {
      const section = sectionRef.current
      const textGroup = textGroupRef.current
      const card = cardRef.current

      if (!section || !textGroup || !card) return

      const localScroll = window.scrollY - section.offsetTop
      const maxScroll = section.offsetHeight - window.innerHeight
      const progress = clamp(localScroll / maxScroll)

      const phaseOne = clamp(progress / 0.2)

      const rotateY = phaseOne * 180
      const textOpacity = 1 - phaseOne

      textGroup.style.opacity = `${clamp(textOpacity)}`
      card.style.transform = `rotateY(${rotateY}deg)`
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
    <section ref={sectionRef} className="hero-scroll relative h-[200vh] bg-background">
      <div className="hero-sticky sticky top-0 flex min-h-[100dvh] items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_520px_at_50%_0%,hsl(var(--primary)/0.14),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_65%,hsl(var(--accent)/0.10),transparent_72%)]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-4 md:px-6 [perspective:1000px]">
          <div ref={textGroupRef} className="mb-14 text-center transition-opacity duration-150 md:mb-16">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Aprenda mais. Lembre mais.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
              Flashcards inteligentes que transformam estudo em progresso real.
            </p>
            <button
              type="button"
              className="mt-7 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-150 ease-out hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Comecar agora
            </button>
          </div>

          <div className="card-scene relative h-[180px] w-[280px] [perspective:1000px] sm:h-[200px] sm:w-[320px]">
            <div
              ref={cardRef}
              className="card absolute inset-0 rounded-[12px] [transform-style:preserve-3d]"
              style={{ transform: 'rotateY(0deg)' }}
            >
              <div className="card-front absolute inset-0 flex items-center justify-center rounded-[12px] border border-border/70 bg-card px-5 text-center shadow-[0_30px_60px_hsl(var(--background)/0.55)] [backface-visibility:hidden]">
                <p className="text-xl font-semibold text-muted-foreground sm:text-2xl">Bem vindo</p>
              </div>

              <div className="card-back absolute inset-0 flex items-center justify-center rounded-[12px] bg-gradient-to-br from-primary to-accent px-5 text-center shadow-[0_30px_60px_hsl(var(--background)/0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-lg font-semibold text-primary-foreground sm:text-2xl">
                  Welcome
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          will-change: transform;
          transition: transform 80ms linear;
        }
      `}</style>
    </section>
  )
}