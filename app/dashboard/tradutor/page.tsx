import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TranslatorInterface } from '@/components/translator/translator-interface'

export default async function TradutorPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Buscar idiomas disponiveis
  const { data: languages } = await supabase
    .from('languages')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tradutor</h1>
        <p className="text-muted-foreground">
          Traduza com DeepL e salve automaticamente para treinar depois
        </p>
      </div>

      <TranslatorInterface 
        languages={languages || []} 
        userId={user.id}
      />
    </div>
  )
}
