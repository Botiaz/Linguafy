import { createClient } from '@/lib/supabase/server'
import { TrainingArea } from '@/components/training/training-area'

export default async function TreinarPage({
  searchParams,
}: {
  searchParams: Promise<{ language?: string; category?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch languages with categories
  const { data: languages } = await supabase
    .from('languages')
    .select('*, categories(*)')
    .order('name')

  // Fetch words based on filters
  let wordsQuery = supabase
    .from('words')
    .select('*, category:categories(*), language:languages(*)')
    .order('created_at', { ascending: false })

  if (params.language) {
    wordsQuery = wordsQuery.eq('language_id', params.language)
  }
  if (params.category) {
    wordsQuery = wordsQuery.eq('category_id', params.category)
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
        initialLanguage={params.language}
        initialCategory={params.category}
      />
    </div>
  )
}
