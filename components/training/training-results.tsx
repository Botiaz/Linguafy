'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, RotateCcw, ArrowLeft, Target, Clock, Star } from 'lucide-react'

interface TrainingResultsProps {
  totalWords: number
  correctAnswers: number
  duration: number
  onRestart: () => void
  onBack: () => void
}

export function TrainingResults({
  totalWords,
  correctAnswers,
  duration,
  onRestart,
  onBack,
}: TrainingResultsProps) {
  const accuracy = Math.round((correctAnswers / totalWords) * 100)
  
  // Determine performance message
  let performanceMessage = ''
  let performanceIcon = <Target className="w-8 h-8" />
  
  if (accuracy >= 90) {
    performanceMessage = 'Excelente! Voce esta dominando!'
    performanceIcon = <Trophy className="w-8 h-8 text-warning" />
  } else if (accuracy >= 70) {
    performanceMessage = 'Muito bem! Continue praticando!'
    performanceIcon = <Star className="w-8 h-8 text-primary" />
  } else if (accuracy >= 50) {
    performanceMessage = 'Bom progresso! Pratique mais para melhorar.'
    performanceIcon = <Target className="w-8 h-8 text-primary" />
  } else {
    performanceMessage = 'Continue praticando! A repeticao e a chave do sucesso.'
    performanceIcon = <RotateCcw className="w-8 h-8 text-muted-foreground" />
  }

  // Format duration
  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds} segundos`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}min ${secs}s`
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            {performanceIcon}
          </div>
          <CardTitle className="text-2xl">Treino Concluido!</CardTitle>
          <p className="text-muted-foreground">{performanceMessage}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Accuracy */}
          <div className="text-center">
            <p className="text-6xl font-bold text-primary">{accuracy}%</p>
            <p className="text-muted-foreground">de precisao</p>
          </div>

          {/* Progress bar */}
          <Progress value={accuracy} className="h-3" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{correctAnswers}</p>
              <p className="text-sm text-muted-foreground">Corretas</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{totalWords - correctAnswers}</p>
              <p className="text-sm text-muted-foreground">Erradas</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">{formatDuration(duration)}</p>
              <p className="text-sm text-muted-foreground">Tempo</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={onRestart} className="w-full gap-2">
              <RotateCcw className="w-4 h-4" />
              Treinar Novamente
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
