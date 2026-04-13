'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Languages, Loader2, Save, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import type { Language } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TranslatorInterfaceProps {
  languages: Language[]
  userId: string
}

interface TranslationResponse {
  success: boolean
  saved: boolean
  wordId?: string
  error?: string
  translation?: {
    original: string
    translated: string
    pronunciation: string | null
    exampleSentence: string | null
    exampleTranslation: string | null
  }
  metadata?: {
    provider: string
    sourceLanguage: string
    targetLanguage: string
  }
}

interface DeepLLanguagesResponse {
  success: boolean
  languages?: {
    source: { code: string; name: string }[]
    target: { code: string; name: string; supportsFormality?: boolean }[]
  }
}

export function TranslatorInterface({ languages, userId }: TranslatorInterfaceProps) {
  const [word, setWord] = useState('')
  const [sourceLanguageId, setSourceLanguageId] = useState('')
  const [targetLanguageId, setTargetLanguageId] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [result, setResult] = useState<TranslationResponse | null>(null)
  const [supportedSourceCodes, setSupportedSourceCodes] = useState<string[]>([])
  const [supportedTargetCodes, setSupportedTargetCodes] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true

    async function loadDeepLLanguages() {
      try {
        const response = await fetch('/api/translate', { method: 'GET' })
        if (!response.ok) return

        const payload = (await response.json()) as DeepLLanguagesResponse
        if (!payload.success || !payload.languages || !isMounted) return

        const sourceCodes = payload.languages.source.map((item) => item.code.toLowerCase())
        const targetCodes = payload.languages.target.map((item) => item.code.toLowerCase())

        setSupportedSourceCodes(sourceCodes)
        setSupportedTargetCodes(targetCodes)
      } catch {
        // Mantem fallback para idiomas vindos do banco
      }
    }

    void loadDeepLLanguages()

    return () => {
      isMounted = false
    }
  }, [])

  const sourceLanguages = useMemo(() => {
    if (supportedSourceCodes.length === 0) return languages

    return languages.filter((language) => {
      const code = language.code.toLowerCase()
      return supportedSourceCodes.includes(code) || supportedSourceCodes.includes(code.split('-')[0])
    })
  }, [languages, supportedSourceCodes])

  const targetLanguages = useMemo(() => {
    if (supportedTargetCodes.length === 0) return languages

    return languages.filter((language) => {
      const code = language.code.toLowerCase()
      return supportedTargetCodes.includes(code) || supportedTargetCodes.includes(code.split('-')[0])
    })
  }, [languages, supportedTargetCodes])

  const sourceLanguage = useMemo(
    () => languages.find((language) => language.id === sourceLanguageId),
    [languages, sourceLanguageId]
  )

  const targetLanguage = useMemo(
    () => languages.find((language) => language.id === targetLanguageId),
    [languages, targetLanguageId]
  )

  async function handleTranslate() {
    if (!word.trim()) {
      toast.error('Digite uma palavra para traduzir')
      return
    }

    if (!sourceLanguage || !targetLanguage) {
      toast.error('Selecione idioma de origem e destino')
      return
    }

    if (sourceLanguage.id === targetLanguage.id) {
      toast.error('Escolha idiomas diferentes para traduzir')
      return
    }

    setIsTranslating(true)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word.trim(),
          sourceLanguage: sourceLanguage.name,
          sourceLanguageCode: sourceLanguage.code,
          targetLanguageId: targetLanguage.id,
          targetLanguageName: targetLanguage.name,
          targetLanguageCode: targetLanguage.code,
          userId,
        }),
      })

      const payload = (await response.json()) as TranslationResponse

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Nao foi possivel traduzir a palavra')
      }

      setResult(payload)
      toast.success('Traducao concluida e salva para treino')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao traduzir palavra'
      toast.error(message)
      setResult({
        success: false,
        saved: false,
        error: message,
      })
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Traduzir Palavra
          </CardTitle>
          <CardDescription>
            Escolha os idiomas, traduza normalmente e a palavra sera enviada automaticamente para Treinar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="source-language">Idioma de origem</Label>
              <Select value={sourceLanguageId} onValueChange={setSourceLanguageId}>
                <SelectTrigger id="source-language">
                  <SelectValue placeholder="Selecione o idioma de origem" />
                </SelectTrigger>
                <SelectContent>
                  {sourceLanguages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      <span className="flex items-center gap-2">
                        <span>{language.flag_emoji}</span>
                        <span>{language.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-language">Idioma de destino</Label>
              <Select value={targetLanguageId} onValueChange={setTargetLanguageId}>
                <SelectTrigger id="target-language">
                  <SelectValue placeholder="Selecione o idioma de destino" />
                </SelectTrigger>
                <SelectContent>
                  {targetLanguages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      <span className="flex items-center gap-2">
                        <span>{language.flag_emoji}</span>
                        <span>{language.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="word">Palavra</Label>
            <Input
              id="word"
              value={word}
              onChange={(event) => setWord(event.target.value)}
              placeholder="Ex: house"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleTranslate()
                }
              }}
            />
          </div>

          <Button
            type="button"
            onClick={handleTranslate}
            disabled={isTranslating}
            className="w-full md:w-auto"
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traduzindo com DeepL...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Traduzir e Salvar para Treino
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result?.success && result.translation ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Resultado da Traducao
            </CardTitle>
            <CardDescription>
              A traducao abaixo foi processada e enviada para sua lista de treino.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Original</p>
                <p className="text-lg font-semibold">{result.translation.original}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Traducao</p>
                <p className="text-lg font-semibold">{result.translation.translated}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{result.saved ? 'Salvo para treino' : 'Sem salvamento'}</Badge>
              <Badge variant="secondary">
                Provedor: {result.metadata?.provider?.toUpperCase() || 'DEEPL'}
              </Badge>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              Fluxo: 1) Traducao normal no site 2) Salvamento automatico na secao Treinar
            </div>

            <Button asChild>
              <Link href="/dashboard/treinar">Ir para Treinar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
