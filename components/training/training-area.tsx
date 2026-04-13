'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FlashCard } from './flash-card'
import { TrainingResults } from './training-results'
import { toast } from 'sonner'
import { Play, Shuffle, RotateCcw } from 'lucide-react'
import type { Language, Word, UserVocabulary } from '@/lib/types'

interface TrainingAreaProps {
  languages: Language[]
  words: Word[]
  userVocabulary: UserVocabulary[]
  userId: string
  initialLanguage?: string
}

interface TrainingState {
  isTraining: boolean
  currentIndex: number
  cards: Word[]
  answers: { wordId: string; correct: boolean }[]
  startTime: number
}

export function TrainingArea({
  languages,
  words,
  userVocabulary,
  userId,
  initialLanguage,
}: TrainingAreaProps) {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage || '')
  const [trainingState, setTrainingState] = useState<TrainingState>({
    isTraining: false,
    currentIndex: 0,
    cards: [],
    answers: [],
    startTime: 0,
  })
  const [showResults, setShowResults] = useState(false)

  // Filter words based on selection
  const filteredWords = words.filter(word => {
    if (selectedLanguage && word.language_id !== selectedLanguage) return false
    return true
  })

  // Get user vocabulary map
  const vocabMap = new Map(userVocabulary.map(v => [v.word_id, v]))

  // Handle language change
  function handleLanguageChange(value: string) {
    const language = value === 'all' ? '' : value
    setSelectedLanguage(language)

    if (language) {
      router.push(`/dashboard/treinar?language=${language}`)
      return
    }

    router.push('/dashboard/treinar')
  }

  // Shuffle and start training
  function startTraining() {
    if (filteredWords.length === 0) {
      toast.error('Nenhuma palavra disponivel para treino')
      return
    }

    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5)
    setTrainingState({
      isTraining: true,
      currentIndex: 0,
      cards: shuffled,
      answers: [],
      startTime: Date.now(),
    })
    setShowResults(false)
  }

  // Handle answer
  const handleAnswer = useCallback(async (correct: boolean) => {
    const currentWord = trainingState.cards[trainingState.currentIndex]
    if (!currentWord) return

    // Update local state
    const newAnswers = [...trainingState.answers, { wordId: currentWord.id, correct }]

    // Update user vocabulary in database
    const supabase = createClient()
    const existingVocab = vocabMap.get(currentWord.id)

    if (existingVocab) {
      // Update existing record
      const newTimesReviewed = existingVocab.times_reviewed + 1
      const newTimesCorrect = existingVocab.times_correct + (correct ? 1 : 0)
      const newMasteryLevel = Math.min(100, Math.round((newTimesCorrect / newTimesReviewed) * 100))
      
      // Calculate next review based on mastery
      const daysUntilReview = correct ? Math.ceil(newMasteryLevel / 20) : 0
      const nextReview = new Date()
      nextReview.setDate(nextReview.getDate() + daysUntilReview)

      await supabase
        .from('user_vocabulary')
        .update({
          times_reviewed: newTimesReviewed,
          times_correct: newTimesCorrect,
          mastery_level: newMasteryLevel,
          last_reviewed: new Date().toISOString(),
          next_review: nextReview.toISOString(),
        })
        .eq('id', existingVocab.id)
    } else {
      // Create new record
      const masteryLevel = correct ? 20 : 0
      const nextReview = new Date()
      nextReview.setDate(nextReview.getDate() + (correct ? 1 : 0))

      await supabase
        .from('user_vocabulary')
        .insert({
          user_id: userId,
          word_id: currentWord.id,
          mastery_level: masteryLevel,
          times_reviewed: 1,
          times_correct: correct ? 1 : 0,
          last_reviewed: new Date().toISOString(),
          next_review: nextReview.toISOString(),
        })
    }

    // Check if training is complete
    if (trainingState.currentIndex >= trainingState.cards.length - 1) {
      // Save training session
      const duration = Math.round((Date.now() - trainingState.startTime) / 1000)
      const correctAnswers = newAnswers.filter(a => a.correct).length

      await supabase
        .from('training_sessions')
        .insert({
          user_id: userId,
          language_id: selectedLanguage || trainingState.cards[0]?.language_id,
          category_id: null,
          total_words: trainingState.cards.length,
          correct_answers: correctAnswers,
          duration_seconds: duration,
          completed_at: new Date().toISOString(),
        })

      setTrainingState(prev => ({
        ...prev,
        answers: newAnswers,
        isTraining: false,
      }))
      setShowResults(true)
    } else {
      // Move to next card
      setTrainingState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        answers: newAnswers,
      }))
    }
  }, [trainingState, vocabMap, userId, selectedLanguage])

  // Reset training
  function resetTraining() {
    setTrainingState({
      isTraining: false,
      currentIndex: 0,
      cards: [],
      answers: [],
      startTime: 0,
    })
    setShowResults(false)
  }

  // Show results screen
  if (showResults) {
    const duration = Math.round((Date.now() - trainingState.startTime) / 1000)
    const correctAnswers = trainingState.answers.filter(a => a.correct).length

    return (
      <TrainingResults
        totalWords={trainingState.cards.length}
        correctAnswers={correctAnswers}
        duration={duration}
        onRestart={startTraining}
        onBack={resetTraining}
      />
    )
  }

  // Show training interface
  if (trainingState.isTraining && trainingState.cards.length > 0) {
    const currentWord = trainingState.cards[trainingState.currentIndex]
    const progress = ((trainingState.currentIndex) / trainingState.cards.length) * 100

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Palavra {trainingState.currentIndex + 1} de {trainingState.cards.length}
            </span>
            <span className="text-muted-foreground">
              {trainingState.answers.filter(a => a.correct).length} corretas
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flash Card */}
        <FlashCard
          word={currentWord}
          userVocabulary={vocabMap.get(currentWord.id)}
          onAnswer={handleAnswer}
        />

        {/* Cancel button */}
        <div className="text-center">
          <Button variant="ghost" onClick={resetTraining}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Cancelar Treino
          </Button>
        </div>
      </div>
    )
  }

  // Show setup interface
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Treino</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Idioma</label>
              <Select value={selectedLanguage || 'all'} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os idiomas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os idiomas</SelectItem>
                  {languages.map(lang => (
                    <SelectItem key={lang.id} value={lang.id}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag_emoji}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredWords.length} palavras disponiveis
              </Badge>
            </div>
            <Button 
              onClick={startTraining} 
              disabled={filteredWords.length === 0}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Iniciar Treino
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Words Preview */}
      {filteredWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              Palavras para Treino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredWords.slice(0, 12).map(word => {
                const vocab = vocabMap.get(word.id)
                return (
                  <div
                    key={word.id}
                    className="p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                  >
                    <p className="font-medium text-foreground truncate">{word.original_word}</p>
                    <p className="text-sm text-muted-foreground truncate">{word.translated_word}</p>
                    {vocab && (
                      <div className="mt-2">
                        <Progress value={vocab.mastery_level} className="h-1" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {filteredWords.length > 12 && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                E mais {filteredWords.length - 12} palavras...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredWords.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Shuffle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Nenhuma palavra encontrada</h3>
            <p className="text-sm text-muted-foreground">
              {selectedLanguage 
                ? 'Nao ha palavras para este idioma no momento.'
                : 'Nao ha palavras disponiveis para treino no momento.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
