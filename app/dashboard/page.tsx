import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { BookOpen, Target, Trophy, Clock, TrendingUp, GraduationCap, Languages } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user stats
  const { data: userVocabulary } = await supabase
    .from('user_vocabulary')
    .select('*, word:words(*)')
    .eq('user_id', user?.id)

  const { data: trainingSessions } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: languages } = await supabase
    .from('languages')
    .select('*, categories(*)')

  // Calculate stats
  const totalWordsLearned = userVocabulary?.length || 0
  const masteredWords = userVocabulary?.filter(v => v.mastery_level >= 80)?.length || 0
  const totalSessions = trainingSessions?.length || 0
  const totalCorrect = trainingSessions?.reduce((acc, s) => acc + s.correct_answers, 0) || 0
  const totalQuestions = trainingSessions?.reduce((acc, s) => acc + s.total_words, 0) || 0
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const totalTime = trainingSessions?.reduce((acc, s) => acc + s.duration_seconds, 0) || 0

  // Words due for review
  const now = new Date().toISOString()
  const wordsDue = userVocabulary?.filter(v => !v.next_review || v.next_review <= now)?.length || 0

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe seu progresso e continue aprendendo
        </p>
      </div>

      {/* Quick Actions */}
      {wordsDue > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Voce tem {wordsDue} palavra(s) para revisar</p>
                <p className="text-sm text-muted-foreground">Mantenha seu progresso em dia!</p>
              </div>
            </div>
            <Link href="/dashboard/treinar">
              <Button>Revisar Agora</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Palavras Aprendidas"
          value={totalWordsLearned.toString()}
          description={`${masteredWords} dominadas`}
        />
        <StatsCard
          icon={<Target className="w-5 h-5" />}
          label="Precisao"
          value={`${accuracy}%`}
          description={`${totalCorrect}/${totalQuestions} corretas`}
        />
        <StatsCard
          icon={<Trophy className="w-5 h-5" />}
          label="Sessoes de Treino"
          value={totalSessions.toString()}
          description="Sessoes completadas"
        />
        <StatsCard
          icon={<Clock className="w-5 h-5" />}
          label="Tempo Total"
          value={formatTime(totalTime)}
          description="De estudo"
        />
      </div>

      {/* Languages Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Idiomas Disponiveis</h2>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/tradutor">
              <Button variant="outline" size="sm" className="gap-2">
                <Languages className="w-4 h-4" />
                Traduzir Palavra
              </Button>
            </Link>
            <Link href="/dashboard/treinar">
              <Button variant="outline" size="sm" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Comecar Treino
              </Button>
            </Link>
          </div>
        </div>

        {languages && languages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((language) => {
              const languageVocab = userVocabulary?.filter(v => v.word?.language_id === language.id) || []
              const progress = languageVocab.length > 0 
                ? Math.round(languageVocab.reduce((acc, v) => acc + v.mastery_level, 0) / languageVocab.length)
                : 0

              return (
                <Card key={language.id} className="hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{language.flag_emoji}</span>
                      <div>
                        <CardTitle className="text-lg">{language.name}</CardTitle>
                        <CardDescription>{language.categories?.length || 0} categorias</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {languageVocab.length} palavras estudadas
                      </p>
                    </div>
                    <Link href={`/dashboard/treinar?language=${language.id}`}>
                      <Button variant="outline" className="w-full mt-4" size="sm">
                        Estudar
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Nenhum idioma disponivel</h3>
              <p className="text-sm text-muted-foreground">
                Entre em contato com o administrador para adicionar idiomas.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      {trainingSessions && trainingSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Atividade Recente</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {trainingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Sessao de Treino</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {session.correct_answers}/{session.total_words}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((session.correct_answers / session.total_words) * 100)}% corretas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function StatsCard({ icon, label, value, description }: { icon: React.ReactNode; label: string; value: string; description: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${mins}m`
}
