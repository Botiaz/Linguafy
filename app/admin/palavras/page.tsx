import { createClient } from '@/lib/supabase/server'
import { WordsList } from '@/components/admin/words-list'

export default async function PalavrasPage() {
  const supabase = await createClient()

  const { data: words } = await supabase
    .from('words')
    .select('*, category:categories(*), language:languages(*)')
    .order('created_at', { ascending: false })

  const { data: languages } = await supabase
    .from('languages')
    .select('*, categories(*)')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Palavras</h1>
        <p className="text-muted-foreground mt-1">
          Adicione e gerencie o vocabulario da plataforma
        </p>
      </div>

      <WordsList words={words || []} languages={languages || []} />
    </div>
  )
}
