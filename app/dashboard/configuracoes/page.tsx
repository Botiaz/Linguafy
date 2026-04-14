'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import type { Profile } from '@/lib/types'

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile(data)
          setFullName(data.full_name || '')
        }
      }
      setIsLoading(false)
    }

    loadProfile()
  }, [])

  async function handleSave() {
    if (!profile) return
    setIsSaving(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id)

    if (error) {
      toast.error('Erro ao salvar', { description: error.message })
    } else {
      toast.success('Perfil atualizado com sucesso!')
      router.refresh()
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-8 md:space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informacoes de perfil
        </p>
      </div>

      <Card className="bg-card/95">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize suas informacoes pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-7">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
              <AvatarFallback className="text-2xl">
                {profile?.full_name?.charAt(0) || <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{profile?.full_name || 'Sem nome'}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              O email nao pode ser alterado
            </p>
          </div>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Alteracoes
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/95">
        <CardHeader>
          <CardTitle>Estatisticas</CardTitle>
          <CardDescription>
            Seu progresso na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Membro desde</p>
              <p className="text-lg font-semibold text-foreground">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('pt-BR', { 
                      year: 'numeric', 
                      month: 'long' 
                    })
                  : '-'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Tipo de conta</p>
              <p className="text-lg font-semibold text-foreground">
                {profile?.is_admin ? 'Administrador' : 'Usuario'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
