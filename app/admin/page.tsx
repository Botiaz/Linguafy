import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, FolderTree, BookOpen, Users, ChevronRight } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  // Get counts
  const { count: languagesCount } = await supabase
    .from('languages')
    .select('*', { count: 'exact', head: true })

  const { count: categoriesCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  const { count: wordsCount } = await supabase
    .from('words')
    .select('*', { count: 'exact', head: true })

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const adminItems = [
    {
      href: '/admin/idiomas',
      icon: Globe,
      title: 'Idiomas',
      description: 'Gerencie os idiomas disponiveis na plataforma',
      count: languagesCount || 0,
    },
    {
      href: '/admin/categorias',
      icon: FolderTree,
      title: 'Categorias',
      description: 'Organize as palavras em categorias tematicas',
      count: categoriesCount || 0,
    },
    {
      href: '/admin/palavras',
      icon: BookOpen,
      title: 'Palavras',
      description: 'Adicione e edite o vocabulario da plataforma',
      count: wordsCount || 0,
    },
    {
      href: '/admin/usuarios',
      icon: Users,
      title: 'Usuarios',
      description: 'Visualize e gerencie os usuarios cadastrados',
      count: usersCount || 0,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Administracao</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie o conteudo da plataforma de aprendizado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:border-primary/30 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{item.count}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <CardTitle className="mt-4">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
