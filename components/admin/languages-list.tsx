'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Language } from '@/lib/types'

interface LanguagesListProps {
  languages: (Language & { categories: { count: number }[] })[]
}

export function LanguagesList({ languages }: LanguagesListProps) {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    flag_emoji: '',
  })

  function resetForm() {
    setFormData({ name: '', code: '', flag_emoji: '' })
    setSelectedLanguage(null)
  }

  async function handleCreate() {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('languages')
      .insert({
        name: formData.name,
        code: formData.code,
        flag_emoji: formData.flag_emoji,
      })

    if (error) {
      toast.error('Erro ao criar idioma', { description: error.message })
    } else {
      toast.success('Idioma criado com sucesso!')
      setIsCreateOpen(false)
      resetForm()
      router.refresh()
    }
    setIsLoading(false)
  }

  async function handleEdit() {
    if (!selectedLanguage) return
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('languages')
      .update({
        name: formData.name,
        code: formData.code,
        flag_emoji: formData.flag_emoji,
      })
      .eq('id', selectedLanguage.id)

    if (error) {
      toast.error('Erro ao atualizar idioma', { description: error.message })
    } else {
      toast.success('Idioma atualizado com sucesso!')
      setIsEditOpen(false)
      resetForm()
      router.refresh()
    }
    setIsLoading(false)
  }

  async function handleDelete() {
    if (!selectedLanguage) return
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('languages')
      .delete()
      .eq('id', selectedLanguage.id)

    if (error) {
      toast.error('Erro ao excluir idioma', { description: error.message })
    } else {
      toast.success('Idioma excluido com sucesso!')
      setIsDeleteOpen(false)
      resetForm()
      router.refresh()
    }
    setIsLoading(false)
  }

  function openEdit(language: Language) {
    setSelectedLanguage(language)
    setFormData({
      name: language.name,
      code: language.code,
      flag_emoji: language.flag_emoji,
    })
    setIsEditOpen(true)
  }

  function openDelete(language: Language) {
    setSelectedLanguage(language)
    setIsDeleteOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Idiomas</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Idioma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Idioma</DialogTitle>
                <DialogDescription>
                  Adicione um novo idioma a plataforma
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Idioma</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Ingles"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Codigo (ISO 639-1)</Label>
                  <Input
                    id="code"
                    placeholder="Ex: en"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emoji">Emoji da Bandeira</Label>
                  <Input
                    id="emoji"
                    placeholder="Ex: 🇺🇸"
                    value={formData.flag_emoji}
                    onChange={(e) => setFormData({ ...formData, flag_emoji: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={isLoading || !formData.name || !formData.code}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Criar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {languages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum idioma cadastrado ainda.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bandeira</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Categorias</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.map((language) => (
                  <TableRow key={language.id}>
                    <TableCell className="text-2xl">{language.flag_emoji}</TableCell>
                    <TableCell className="font-medium">{language.name}</TableCell>
                    <TableCell>{language.code}</TableCell>
                    <TableCell>{language.categories?.[0]?.count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(language)}
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDelete(language)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Idioma</DialogTitle>
            <DialogDescription>
              Atualize as informacoes do idioma
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Idioma</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code">Codigo (ISO 639-1)</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-emoji">Emoji da Bandeira</Label>
              <Input
                id="edit-emoji"
                value={formData.flag_emoji}
                onChange={(e) => setFormData({ ...formData, flag_emoji: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={isLoading || !formData.name || !formData.code}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Idioma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o idioma &quot;{selectedLanguage?.name}&quot;?
              Esta acao nao pode ser desfeita e ira remover todas as categorias e palavras associadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
