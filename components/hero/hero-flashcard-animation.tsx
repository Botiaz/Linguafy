'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function HeroFlashcardAnimation() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const cardRotateY = useTransform(scrollYProgress, [0.1, 0.35], [0, 180])
  const cardX = useTransform(scrollYProgress, [0.45, 0.75], ['0vw', '34vw'])
  const cardY = useTransform(scrollYProgress, [0.45, 0.75], ['0vh', '-26vh'])
  const cardScale = useTransform(scrollYProgress, [0.45, 0.75], [1, 0.44])
  const cardOpacity = useTransform(scrollYProgress, [0.78, 0.92], [1, 0])

  const dashboardOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1])
  const dashboardScale = useTransform(scrollYProgress, [0.35, 0.65], [0.94, 1])

  const badgeOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1])
  const titleOpacity = useTransform(scrollYProgress, [0.02, 0.2], [0, 1])

  const slotGlowOpacity = useTransform(scrollYProgress, [0.75, 0.9, 1], [0.15, 0.95, 0.2])
  const knowledgeDotOpacity = useTransform(scrollYProgress, [0.82, 0.94], [0, 1])
  const knowledgeDotScale = useTransform(scrollYProgress, [0.82, 0.94], [0.4, 1.15])

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(1100px 420px at 50% 65%, hsl(var(--primary) / 0.10), transparent 65%)',
          }}
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-4 [perspective:1000px] md:px-8">
          <motion.div
            style={{ opacity: badgeOpacity }}
            className="mb-5 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur sm:text-sm"
          >
            Flashcard 3D + Progresso em Tempo Real
          </motion.div>

          <motion.h1
            style={{ opacity: titleOpacity }}
            className="mb-10 max-w-4xl text-center text-balance text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Um termo vira conhecimento dentro do seu dashboard
          </motion.h1>

          <motion.div
            style={{ opacity: dashboardOpacity, scale: dashboardScale }}
            className="pointer-events-none absolute inset-x-4 bottom-8 mx-auto w-full max-w-5xl rounded-3xl border border-border/80 bg-card/65 p-4 shadow-2xl backdrop-blur-md md:inset-x-12 md:bottom-14 md:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-2.5 w-24 rounded-full bg-muted" />
              <div className="h-2.5 w-16 rounded-full bg-muted" />
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 rounded-2xl border border-border/70 bg-background/85 p-4 md:col-span-8">
                <div className="mb-4 h-2.5 w-36 rounded-full bg-muted" />
                <div className="flex h-28 items-end gap-2 md:h-36">
                  <div className="w-1/5 rounded-t-md bg-muted" style={{ height: '34%' }} />
                  <div className="w-1/5 rounded-t-md bg-muted" style={{ height: '48%' }} />
                  <div className="w-1/5 rounded-t-md bg-muted" style={{ height: '62%' }} />
                  <div className="w-1/5 rounded-t-md bg-muted" style={{ height: '80%' }} />
                  <div className="w-1/5 rounded-t-md bg-primary/35" style={{ height: '88%' }} />
                </div>
              </div>

              <div className="col-span-12 space-y-3 md:col-span-4">
                <div className="rounded-2xl border border-border/70 bg-background/85 p-4">
                  <div className="mb-3 h-2.5 w-24 rounded-full bg-muted" />
                  <div className="h-8 w-20 rounded-md bg-muted" />
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 p-4">
                  <div className="mb-2 h-2.5 w-20 rounded-full bg-primary/25" />
                  <div className="h-9 w-24 rounded-md bg-primary/20" />

                  <motion.div
                    style={{ opacity: slotGlowOpacity }}
                    className="pointer-events-none absolute right-3 top-3 h-12 w-12 rounded-xl border border-primary/50 bg-primary/15"
                  />

                  <motion.div
                    style={{ opacity: knowledgeDotOpacity, scale: knowledgeDotScale }}
                    className="absolute right-7 top-7 h-4 w-4 rounded-full bg-primary shadow-[0_0_30px_hsl(var(--primary)/0.75)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{
              rotateY: cardRotateY,
              x: cardX,
              y: cardY,
              scale: cardScale,
              opacity: cardOpacity,
            }}
            className="relative h-56 w-[320px] [transform-style:preserve-3d] sm:h-60 sm:w-[360px] md:h-64 md:w-[420px]"
          >
            <div className="absolute inset-0 rounded-3xl border border-border bg-card p-6 shadow-2xl [backface-visibility:hidden]">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Original</p>
              <div className="mt-5 text-4xl font-bold text-foreground sm:text-5xl">Saudade</div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Palavra com sentimento profundo de ausencia e afeto.
              </p>
            </div>

            <div className="absolute inset-0 rounded-3xl border border-primary/45 bg-card p-6 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Translation</p>
              <div className="mt-5 text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
                Missing someone
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Agora esse conhecimento entra no seu progresso de revisao.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
