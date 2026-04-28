import { createClient } from '@/lib/supabase/server'
import { TrainingArea } from '@/components/training/training-area'

function languageCodeMatches(languageCode: string, sourceCode: string) {
  const normalizedLanguageCode = languageCode.toLowerCase()
  const normalizedSourceCode = sourceCode.toLowerCase()
  const languageBase = normalizedLanguageCode.split('-')[0]
  const sourceBase = normalizedSourceCode.split('-')[0]

  return (
    normalizedLanguageCode === normalizedSourceCode ||
    languageBase === sourceBase ||
    normalizedLanguageCode.startsWith(`${sourceBase}-`) ||
    normalizedSourceCode.startsWith(`${languageBase}-`)
  )
}

export default async function TreinarPage({
  searchParams,
}: {
  searchParams: Promise<{ language?: string; sourceCode?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch available languages
  const { data: languages } = await supabase
    .from('languages')
    .select('*')
    .order('name')

  const resolvedLanguageId = params.language || (
    params.sourceCode
      ? languages?.find((language) => languageCodeMatches(language.code, params.sourceCode || ''))?.id
      : undefined
  )

  // Fetch words based on filters
  let wordsQuery = supabase
    .from('words')
    .select('*, category:categories(*), language:languages(*)')
    .order('created_at', { ascending: false })

  if (resolvedLanguageId) {
    wordsQuery = wordsQuery.eq('language_id', resolvedLanguageId)
  }

  const { data: words } = await wordsQuery

  // Fetch user vocabulary
  const { data: userVocabulary } = await supabase
    .from('user_vocabulary')
    .select('*')
    .eq('user_id', user?.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Treinar</h1>
        <p className="text-muted-foreground mt-1">
          Pratique seu vocabulario com flashcards
        </p>
      </div>

      <TrainingArea
        languages={languages || []}
        words={words || []}
        userVocabulary={userVocabulary || []}
        userId={user?.id || ''}
        initialLanguage={resolvedLanguageId}
      />
    </div>
  )
}
