'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Check, X, Volume2 } from 'lucide-react'
import type { Word, UserVocabulary } from '@/lib/types'

interface FlashCardProps {
  word: Word
  userVocabulary?: UserVocabulary
  onAnswer: (correct: boolean) => void
}

export function FlashCard({ word, userVocabulary, onAnswer }: FlashCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  function handleReveal() {
    setShowAnswer(true)
  }

  function handleAnswer(correct: boolean) {
    setShowAnswer(false)
    onAnswer(correct)
  }

  // Speak the word using text-to-speech
  function speakWord(text: string, lang: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const difficultyColors = {
    easy: 'bg-success/15 text-success',
    medium: 'bg-warning/15 text-warning',
    hard: 'bg-danger/15 text-danger',
  }

  const difficultyLabels = {
    easy: 'Facil',
    medium: 'Medio',
    hard: 'Dificil',
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Front of card */}
        <div className="p-8 text-center border-b border-border">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className={difficultyColors[word.difficulty_level]}>
              {difficultyLabels[word.difficulty_level]}
            </Badge>
            {word.category && (
              <Badge variant="secondary">{word.category.name}</Badge>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-4xl font-bold text-foreground">{word.original_word}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => speakWord(word.original_word, word.language?.code || 'en')}
              className="h-8 w-8"
            >
              <Volume2 className="w-5 h-5" />
              <span className="sr-only">Ouvir pronuncia</span>
            </Button>
          </div>

          {word.pronunciation && (
            <p className="text-muted-foreground italic">[{word.pronunciation}]</p>
          )}

          {userVocabulary && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Revisado {userVocabulary.times_reviewed}x</span>
              <span>Dominio: {userVocabulary.mastery_level}%</span>
            </div>
          )}
        </div>

        {/* Back of card / Answer section */}
        <div className="p-8 bg-muted/30">
          {!showAnswer ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Tente lembrar a traducao antes de revelar
              </p>
              <Button onClick={handleReveal} className="gap-2">
                <Eye className="w-4 h-4" />
                Revelar Traducao
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Traducao:</p>
                <div className="flex items-center justify-center gap-3">
                  <h3 className="text-3xl font-bold text-primary">{word.translated_word}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speakWord(word.translated_word, 'pt-BR')}
                    className="h-8 w-8"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span className="sr-only">Ouvir pronuncia</span>
                  </Button>
                </div>
              </div>

              {word.example_sentence && (
                <div className="text-center p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Exemplo:</p>
                  <p className="text-foreground italic">&quot;{word.example_sentence}&quot;</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                <p className="text-sm text-muted-foreground">Voce acertou?</p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  size="lg"
                  className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-5 h-5" />
                  Errei
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  size="lg"
                  className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
                >
                  <Check className="w-5 h-5" />
                  Acertei
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
