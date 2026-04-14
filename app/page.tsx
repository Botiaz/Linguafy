import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeroAnimation } from '@/components/hero/hero-animation'
import { BookOpen, Brain, Globe, Sparkles, Target, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-card/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
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
      <section id="features" className="bg-muted/20 py-24 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tudo o que voce precisa para aprender idiomas de forma eficaz
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="Repeticao Espacada"
              description="Algoritmo inteligente que apresenta as palavras no momento ideal para maximizar a memorizacao."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Multiplos Idiomas"
              description="Aprenda ingles, espanhol, frances, alemao e muito mais com nosso catalogo em expansao."
            />
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Categorias Tematicas"
              description="Estude por temas como viagens, negocios, cotidiano e muito mais."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Treino Rapido"
              description="Sessoes curtas e focadas que se encaixam na sua rotina diaria."
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Exemplos Contextuais"
              description="Cada palavra vem com pronuncia e exemplos de uso em frases reais."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Acompanhamento de Progresso"
              description="Estatisticas detalhadas para voce ver sua evolucao ao longo do tempo."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-background py-24 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tres passos simples para comecar sua jornada de aprendizado
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
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
      <section className="bg-gradient-to-br from-primary/90 to-accent/75 py-24 md:py-28">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para comecar?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que ja estao aprendendo novos idiomas com Linguafy.
          </p>
          <Link href="/auth/sign-up">
              <Button size="lg" variant="secondary" className="gap-2 border-primary-foreground/20 bg-card/20 text-primary-foreground hover:bg-card/30">
              <Zap className="w-5 h-5" />
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-muted/10 py-10">
        <div className="container mx-auto px-4 md:px-6">
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
    <Card className="border-border/60 bg-card/95 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-7">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
          {icon}
        </div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-6 text-center shadow-sm transition-all duration-200 hover:border-primary/35 hover:shadow-md">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

/*
  Altered files summary:
  - app/page.tsx: ajustados ritmo vertical, superfícies alternadas e hierarquia visual da landing (hero/features/how-it-works/cta/footer).
  - components/hero/hero-animation.tsx: hero com fundo e espaçamento mais premium, mantendo animação e estrutura.
  - app/dashboard/layout.tsx: área principal com mais respiro e largura útil consistente.
  - app/admin/layout.tsx: mesmo refinamento de layout aplicado ao dashboard.
  - app/dashboard/page.tsx: grids e blocos com mais espaçamento e profundidade visual.
  - app/dashboard/configuracoes/page.tsx: coluna de conteúdo com maior respiro e cards mais arejados.
  - app/dashboard/tradutor/page.tsx: cabeçalho e seção com melhor hierarquia e espaçamento.
  - app/dashboard/treinar/page.tsx: mesma melhoria de ritmo visual para página de treino.
  - app/admin/page.tsx: cards de administração com layout mais limpo e respirado.
  - app/auth/login/page.tsx, app/auth/sign-up/page.tsx, app/auth/error/page.tsx, app/auth/sign-up-success/page.tsx: telas centralizadas com fundo sutil e cards elevados.
*/
