'use client'

import { useEffect, useRef } from 'react'

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function HeroAnimation() {
  const sectionRef = useRef<HTMLElement>(null)
  const textGroupRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const brainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function updateAnimation() {
      const section = sectionRef.current
      const textGroup = textGroupRef.current
      const card = cardRef.current
      const brain = brainRef.current

      if (!section || !textGroup || !card || !brain) return

      const localScroll = window.scrollY - section.offsetTop
      const maxScroll = section.offsetHeight - window.innerHeight
      const progress = clamp(localScroll / maxScroll)

      const phaseOne = clamp(progress / 0.4)
      const phaseTwo = clamp((progress - 0.4) / 0.6)

      const rotateY = phaseOne * 180

      const cardRect = card.getBoundingClientRect()
      const brainRect = brain.getBoundingClientRect()

      const cardCenterX = cardRect.left + cardRect.width / 2
      const cardCenterY = cardRect.top + cardRect.height / 2
      const brainCenterX = brainRect.left + brainRect.width / 2
      const brainCenterY = brainRect.top + brainRect.height / 2

      const deltaX = brainCenterX - cardCenterX
      const deltaY = brainCenterY - cardCenterY

      const translateX = deltaX * phaseTwo
      const translateY = deltaY * phaseTwo
      const scale = 1 - 0.9 * phaseTwo
      const cardOpacity = phaseTwo > 0.88 ? 1 - (phaseTwo - 0.88) / 0.12 : 1

      const textOpacity = 1 - phaseOne

      textGroup.style.opacity = `${clamp(textOpacity)}`
      card.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotateY(${rotateY}deg)`
      card.style.opacity = `${clamp(cardOpacity)}`

      if (progress >= 0.92) {
        brain.classList.add('brain-pulse')
      } else {
        brain.classList.remove('brain-pulse')
      }
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
    <section ref={sectionRef} className="hero-scroll relative h-[300vh] bg-background">
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
              className="mt-7 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
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
              <div className="card-front absolute inset-0 flex items-center justify-center rounded-[12px] border border-border/70 bg-card px-5 text-center shadow-[0_30px_60px_rgba(0,0,0,0.35)] [backface-visibility:hidden]">
                <p className="text-xl font-semibold text-muted-foreground sm:text-2xl">O que e React?</p>
              </div>

              <div className="card-back absolute inset-0 flex items-center justify-center rounded-[12px] bg-gradient-to-br from-primary to-accent px-5 text-center shadow-[0_30px_60px_rgba(0,0,0,0.4)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-lg font-semibold text-primary-foreground sm:text-2xl">
                  Uma biblioteca JavaScript para UIs
                </p>
              </div>
            </div>
          </div>

          <div
            ref={brainRef}
            className="brain-icon absolute bottom-8 right-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#8b5cf6]/70 bg-[#8b5cf6]/18 text-4xl shadow-[0_0_30px_rgba(139,92,246,0.45)] sm:bottom-10 sm:right-10"
          >
            🧠
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          transition: opacity 120ms linear;
          will-change: transform, opacity;
        }

        .brain-icon {
          transition: transform 220ms ease, box-shadow 220ms ease;
        }

        .brain-pulse {
          animation: brainPulse 760ms ease-in-out infinite;
        }

        @keyframes brainPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 24px rgba(139, 92, 246, 0.45);
          }
          50% {
            transform: scale(1.3);
            box-shadow: 0 0 54px rgba(139, 92, 246, 0.75);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 24px rgba(139, 92, 246, 0.45);
          }
        }
      `}</style>
    </section>
  )
}
