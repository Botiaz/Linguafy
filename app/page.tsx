import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeroAnimation } from '@/components/hero/hero-animation'
import { BookOpen, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Linguafy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Comecar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroAnimation />

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tudo o que voce precisa para aprender idiomas de forma eficaz
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <Image
                  src="/icons/landing/repeticao-espacada.svg"
                  alt="Repeticao espaçada"
                  width={32}
                  height={32}
                />
              }
              title="Repeticao Espacada"
              description="Algoritmo inteligente que apresenta as palavras no momento ideal para maximizar a memorizacao."
            />
            <FeatureCard
              icon={
                <Image
                  src="/icons/landing/multiplos-idiomas.svg"
                  alt="Multiplos idiomas"
                  width={32}
                  height={32}
                />
              }
              title="Multiplos Idiomas"
              description="Aprenda ingles, espanhol, frances, alemao e muito mais com nosso catalogo em expansao."
            />
            <FeatureCard
              icon={
                <Image
                  src="/icons/landing/categorias-tematicas.svg"
                  alt="Categorias tematicas"
                  width={32}
                  height={32}
                />
              }
              title="Categorias Tematicas"
              description="Estude por temas como viagens, negocios, cotidiano e muito mais."
            />
            <FeatureCard
              icon={
                <Image
                  src="/icons/landing/treino-rapido.svg"
                  alt="Treino rapido"
                  width={32}
                  height={32}
                />
              }
              title="Treino Rapido"
              description="Sessoes curtas e focadas que se encaixam na sua rotina diaria."
            />
            <FeatureCard
              icon={
                <Image
                  src="/icons/landing/exemplos-contextuais.svg"
                  alt="Exemplos contextuais"
                  width={32}
                  height={32}
                />
              }
              title="Exemplos Contextuais"
              description="Cada palavra vem com pronuncia e exemplos de uso em frases reais."
            />
            <FeatureCard
              icon={
                <Image
                  src="/icons/landing/acompanhamento-do-progresso.svg"
                  alt="Acompanhamento de progresso"
                  width={32}
                  height={32}
                />
              }
              title="Acompanhamento de Progresso"
              description="Estatisticas detalhadas para voce ver sua evolucao ao longo do tempo."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tres passos simples para comecar sua jornada de aprendizado
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number={1}
              title="Escolha o Idioma"
              description="Selecione o idioma que deseja aprender e as categorias de interesse."
            />
            <StepCard
              number={2}
              title="Treine com Flashcards"
              description="Veja a palavra, tente lembrar a traducao e marque se acertou ou errou."
            />
            <StepCard
              number={3}
              title="Revise e Evolua"
              description="O sistema ajusta automaticamente a frequencia de revisao baseado no seu desempenho."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para comecar?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que ja estao aprendendo novos idiomas com Linguafy.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="gap-2">
              <Zap className="w-5 h-5" />
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Linguafy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 Linguafy. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
