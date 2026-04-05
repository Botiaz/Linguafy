import { createClient } from '@/lib/supabase/server'
import { LanguagesList } from '@/components/admin/languages-list'

export default async function IdiomasPage() {
  const supabase = await createClient()

  const { data: languages } = await supabase
    .from('languages')
    .select('*, categories(count)')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Idiomas</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os idiomas disponiveis para aprendizado
        </p>
      </div>

      <LanguagesList languages={languages || []} />
    </div>
  )
}
