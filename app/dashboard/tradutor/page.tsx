import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TranslatorInterface } from '../../../components/translator/translator-interface'

export default async function TradutorPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Buscar idiomas disponiveis
  const { data: languages, error: languagesError } = await supabase
    .from('languages')
    .select('*')
    .order('name')

  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tradutor</h1>
        <p className="mt-1 text-muted-foreground">
          Traduza com DeepL e salve automaticamente para treinar depois
        </p>
        {languagesError ? (
          <p className="mt-2 text-sm text-warning">
            Aviso: nao foi possivel carregar idiomas do banco, usando lista da DeepL.
          </p>
        ) : null}
      </div>

      <TranslatorInterface 
        languages={languages || []} 
        userId={user.id}
      />
    </div>
  )
}
