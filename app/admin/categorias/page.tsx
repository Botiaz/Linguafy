import { createClient } from '@/lib/supabase/server'
import { CategoriesList } from '@/components/admin/categories-list'

export default async function CategoriasPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*, language:languages(*), words(count)')
    .order('name')

  const { data: languages } = await supabase
    .from('languages')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
        <p className="text-muted-foreground mt-1">
          Organize as palavras em categorias tematicas
        </p>
      </div>

      <CategoriesList categories={categories || []} languages={languages || []} />
    </div>
  )
}
