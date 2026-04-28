'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Languages, Loader2, Save, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import type { Language } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const INVALID_WORD_MESSAGE = 'Nao foi possivel validar essa palavra para traducao. Tente outra palavra existente.'

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

interface LanguageOption {
  id: string
  name: string
  code: string
  flag_code: string | null
  databaseId?: string
}

const FLAG_BY_CODE: Record<string, string> = {
  de: 'DE',
  ko: 'KR',
  es: 'ES',
  fr: 'FR',
  en: 'GB',
  'en-gb': 'GB',
  'en-us': 'US',
  it: 'IT',
  ja: 'JP',
  pt: 'BR',
  'pt-br': 'BR',
  'pt-pt': 'PT',
  zh: 'CN',
  'zh-cn': 'CN',
  'zh-hans': 'CN',
  'zh-hant': 'TW',
  'zh-tw': 'TW',
}

const FLAG_BY_NAME: Record<string, string> = {
  alemao: 'DE',
  coreano: 'KR',
  espanhol: 'ES',
  frances: 'FR',
  ingles: 'GB',
  italiano: 'IT',
  japones: 'JP',
  mandarim: 'CN',
  portugues: 'BR',
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function resolveFlagCode({ code, name }: { code: string; name: string }) {
  const normalizedCode = code.toLowerCase()
  const baseCode = normalizedCode.split('-')[0]
  const normalizedName = normalizeName(name)

  return (
    FLAG_BY_CODE[normalizedCode] ||
    FLAG_BY_CODE[baseCode] ||
    FLAG_BY_NAME[normalizedName] ||
    null
  )
}

type FlagBaseProps = {
  className?: string
  children: ReactNode
}

type FlagProps = {
  className?: string
}

const FLAG_BASE_CLASS =
  'h-4 w-6 shrink-0 overflow-hidden rounded-[2px] border border-border/60'

function FlagBase({ className, children }: FlagBaseProps) {
  return (
    <svg
      viewBox="0 0 20 14"
      className={`${FLAG_BASE_CLASS}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

function FlagDE({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#000000" />
      <rect y="4.6667" width="20" height="4.6667" fill="#DD0000" />
      <rect y="9.3334" width="20" height="4.6667" fill="#FFCE00" />
    </FlagBase>
  )
}

function FlagKR({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#FFFFFF" />
      <path d="M10 3.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 0 0-7z" fill="#C60C30" />
      <path d="M10 3.5a3.5 3.5 0 0 0 0 7a3.5 3.5 0 0 1 0-7z" fill="#003478" />
    </FlagBase>
  )
}

function FlagES({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
      <rect y="10.5" width="20" height="3.5" fill="#AA151B" />
    </FlagBase>
  )
}

function FlagFR({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="6.6667" height="14" fill="#0055A4" />
      <rect x="6.6667" width="6.6667" height="14" fill="#FFFFFF" />
      <rect x="13.3334" width="6.6667" height="14" fill="#EF4135" />
    </FlagBase>
  )
}

function FlagGB({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#012169" />
      <path
        d="M0 0L20 14M20 0L0 14"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="square"
      />
      <path
        d="M0 0L20 14M20 0L0 14"
        stroke="#C8102E"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <rect x="8" width="4" height="14" fill="#FFFFFF" />
      <rect y="5" width="20" height="4" fill="#FFFFFF" />
      <rect x="9" width="2" height="14" fill="#C8102E" />
      <rect y="6" width="20" height="2" fill="#C8102E" />
    </FlagBase>
  )
}

function FlagUS({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#FFFFFF" />
      <rect y="0" width="20" height="1" fill="#B22234" />
      <rect y="2" width="20" height="1" fill="#B22234" />
      <rect y="4" width="20" height="1" fill="#B22234" />
      <rect y="6" width="20" height="1" fill="#B22234" />
      <rect y="8" width="20" height="1" fill="#B22234" />
      <rect y="10" width="20" height="1" fill="#B22234" />
      <rect y="12" width="20" height="1" fill="#B22234" />
      <rect width="8" height="7" fill="#3C3B6E" />
    </FlagBase>
  )
}

function FlagIT({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="6.6667" height="14" fill="#008C45" />
      <rect x="6.6667" width="6.6667" height="14" fill="#FFFFFF" />
      <rect x="13.3334" width="6.6667" height="14" fill="#CD212A" />
    </FlagBase>
  )
}

function FlagJP({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#FFFFFF" />
      <circle cx="10" cy="7" r="4" fill="#BC002D" />
    </FlagBase>
  )
}

function FlagCN({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#DE2910" />
      <polygon
        points="4,1.6 4.7,3.5 6.8,3.5 5.1,4.7 5.8,6.6 4,5.4 2.2,6.6 2.9,4.7 1.2,3.5 3.3,3.5"
        fill="#FFDE00"
      />
    </FlagBase>
  )
}

function FlagTW({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#FE0000" />
      <rect width="8" height="6" fill="#000095" />
      <circle cx="4" cy="3" r="1.5" fill="#FFFFFF" />
    </FlagBase>
  )
}

function FlagPT({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="8" height="14" fill="#006600" />
      <rect x="8" width="12" height="14" fill="#FF0000" />
    </FlagBase>
  )
}

function FlagBR({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#009B3A" />
      <polygon points="10,1.5 18.5,7 10,12.5 1.5,7" fill="#FFDF00" />
      <circle cx="10" cy="7" r="2.5" fill="#002776" />
    </FlagBase>
  )
}

function FlagGeneric({ className }: FlagProps) {
  return (
    <FlagBase className={className}>
      <rect width="20" height="14" fill="#CBD5E1" />
      <path d="M0 0L20 14M20 0L0 14" stroke="#94A3B8" strokeWidth="2" />
    </FlagBase>
  )
}

const FLAG_COMPONENTS: Record<string, (props: FlagProps) => JSX.Element> = {
  BR: FlagBR,
  CN: FlagCN,
  DE: FlagDE,
  ES: FlagES,
  FR: FlagFR,
  GB: FlagGB,
  IT: FlagIT,
  JP: FlagJP,
  KR: FlagKR,
  PT: FlagPT,
  TW: FlagTW,
  US: FlagUS,
}

function FlagIcon({ code, className }: { code?: string | null; className?: string }) {
  const normalized = code ? code.toUpperCase() : ''
  const Flag = normalized ? FLAG_COMPONENTS[normalized] : undefined

  if (!Flag) return <FlagGeneric className={className} />

  return <Flag className={className} />
}

function matchesSupportedLanguage(code: string, supportedCodes: string[]) {
  const normalizedCode = code.toLowerCase()
  const baseCode = normalizedCode.split('-')[0]

  return supportedCodes.some((supportedCode) => {
    const normalizedSupported = supportedCode.toLowerCase()
    const supportedBase = normalizedSupported.split('-')[0]

    return (
      normalizedSupported === normalizedCode ||
      supportedBase === baseCode ||
      normalizedSupported.startsWith(`${baseCode}-`) ||
      normalizedCode.startsWith(`${supportedBase}-`)
    )
  })
}

export function TranslatorInterface({ languages, userId }: TranslatorInterfaceProps) {
  const [word, setWord] = useState('')
  const [sourceLanguageId, setSourceLanguageId] = useState('')
  const [targetLanguageId, setTargetLanguageId] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [result, setResult] = useState<TranslationResponse | null>(null)
  const [supportedSourceCodes, setSupportedSourceCodes] = useState<string[]>([])
  const [supportedTargetCodes, setSupportedTargetCodes] = useState<string[]>([])
  const [deepLSourceLanguages, setDeepLSourceLanguages] = useState<{ code: string; name: string }[]>([])
  const [deepLTargetLanguages, setDeepLTargetLanguages] = useState<{ code: string; name: string }[]>([])
  const [lastSourceLanguage, setLastSourceLanguage] = useState<LanguageOption | null>(null)
  const [highlightedError, setHighlightedError] = useState<string | null>(null)

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

        setDeepLSourceLanguages(payload.languages.source)
        setDeepLTargetLanguages(payload.languages.target)
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

  const dbLanguageOptions = useMemo<LanguageOption[]>(() => {
    return languages.map((language) => ({
      id: language.id,
      databaseId: language.id,
      name: language.name,
      code: language.code,
      flag_code: resolveFlagCode({
        code: language.code,
        name: language.name,
      }),
    }))
  }, [languages])

  const deepLSourceOptions = useMemo<LanguageOption[]>(() => {
    return deepLSourceLanguages.map((language) => ({
      id: `deepl-source-${language.code}`,
      name: language.name,
      code: language.code,
      flag_code: resolveFlagCode({
        code: language.code,
        name: language.name,
      }),
    }))
  }, [deepLSourceLanguages])

  const deepLTargetOptions = useMemo<LanguageOption[]>(() => {
    return deepLTargetLanguages.map((language) => ({
      id: `deepl-target-${language.code}`,
      name: language.name,
      code: language.code,
      flag_code: resolveFlagCode({
        code: language.code,
        name: language.name,
      }),
    }))
  }, [deepLTargetLanguages])

  const sourceLanguages = useMemo(() => {
    if (dbLanguageOptions.length === 0) return deepLSourceOptions
    if (supportedSourceCodes.length === 0) return dbLanguageOptions

    const filtered = dbLanguageOptions.filter((language) => {
      return matchesSupportedLanguage(language.code, supportedSourceCodes)
    })

    return filtered.length > 0 ? filtered : deepLSourceOptions
  }, [dbLanguageOptions, deepLSourceOptions, supportedSourceCodes])

  const targetLanguages = useMemo(() => {
    if (dbLanguageOptions.length === 0) return deepLTargetOptions
    if (supportedTargetCodes.length === 0) return dbLanguageOptions

    const filtered = dbLanguageOptions.filter((language) => {
      return matchesSupportedLanguage(language.code, supportedTargetCodes)
    })

    return filtered.length > 0 ? filtered : deepLTargetOptions
  }, [dbLanguageOptions, deepLTargetOptions, supportedTargetCodes])

  const sourceLanguage = useMemo(
    () => sourceLanguages.find((language) => language.id === sourceLanguageId),
    [sourceLanguages, sourceLanguageId]
  )

  const targetLanguage = useMemo(
    () => targetLanguages.find((language) => language.id === targetLanguageId),
    [targetLanguages, targetLanguageId]
  )

  const trainingHref = useMemo(() => {
    if (!lastSourceLanguage) return '/dashboard/treinar'

    if (lastSourceLanguage.databaseId) {
      return `/dashboard/treinar?language=${lastSourceLanguage.databaseId}`
    }

    const params = new URLSearchParams({ sourceCode: lastSourceLanguage.code })
    return `/dashboard/treinar?${params.toString()}`
  }, [lastSourceLanguage])

  async function handleTranslate() {
    setHighlightedError(null)

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

    const sourceForTraining = sourceLanguage
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
          targetLanguageId: targetLanguage.databaseId,
          targetLanguageName: targetLanguage.name,
          targetLanguageCode: targetLanguage.code,
          userId,
        }),
      })

      const payload = (await response.json()) as TranslationResponse

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Nao foi possivel traduzir a palavra')
      }

      setLastSourceLanguage(sourceForTraining)
      setResult(payload)
      setHighlightedError(null)
      toast.success('Traducao concluida e salva para treino')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao traduzir palavra'

      if (message === INVALID_WORD_MESSAGE) {
        setHighlightedError(message)
      }

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
                  {sourceLanguage ? (
                    <span className="flex items-center gap-2">
                      <FlagIcon code={sourceLanguage.flag_code} />
                      <span>{sourceLanguage.name}</span>
                    </span>
                  ) : (
                    <SelectValue placeholder="Selecione o idioma de origem" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {sourceLanguages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      <span className="flex items-center gap-2">
                        <FlagIcon code={language.flag_code} />
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
                  {targetLanguage ? (
                    <span className="flex items-center gap-2">
                      <FlagIcon code={targetLanguage.flag_code} />
                      <span>{targetLanguage.name}</span>
                    </span>
                  ) : (
                    <SelectValue placeholder="Selecione o idioma de destino" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {targetLanguages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      <span className="flex items-center gap-2">
                        <FlagIcon code={language.flag_code} />
                        <span>{language.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {sourceLanguages.length === 0 || targetLanguages.length === 0 ? (
            <p className="text-sm text-warning">
              Nao foi possivel carregar idiomas. Verifique DEEPL_AUTH_KEY e a conexao com o Supabase.
            </p>
          ) : null}

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

      {highlightedError ? (
        <div className="max-w-2xl mx-auto">
          <Alert className="border-border bg-card text-center text-card-foreground [&>svg]:text-card-foreground">
            <AlertTitle className="text-base text-card-foreground">Palavra nao reconhecida</AlertTitle>
            <AlertDescription className="justify-items-center text-sm text-muted-foreground">
              {highlightedError}
            </AlertDescription>
          </Alert>
        </div>
      ) : null}

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
              <Link href={trainingHref}>Ir para Treinar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
