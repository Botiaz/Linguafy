'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { Word, Language, Category } from '@/lib/types'

interface WordsListProps {
  words: (Word & { category: Category; language: Language })[]
  languages: (Language & { categories: Category[] })[]
}

export function WordsList({ words, languages }: WordsListProps) {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('')

  const [formData, setFormData] = useState({
    original_word: '',
    translated_word: '',
    pronunciation: '',
    example_sentence: '',
    language_id: '',
    category_id: '',
    difficulty_level: 'medium' as 'easy' | 'medium' | 'hard',
  })

  // Get categories for selected language
  const selectedLang = languages.find(l => l.id === formData.language_id)
  const availableCategories = selectedLang?.categories || []

  // Filter words
  const filteredWords = words.filter(word => {
    const matchesSearch = searchTerm === '' || 
      word.original_word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.translated_word.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = filterLanguage === '' || word.language_id === filterLanguage
    return matchesSearch && matchesLanguage
  })

  function resetForm() {
    setFormData({
      original_word: '',
      translated_word: '',
      pronunciation: '',
      example_sentence: '',
      language_id: '',
      category_id: '',
      difficulty_level: 'medium',
    })
    setSelectedWord(null)
  }

  async function handleCreate() {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('words')
      .insert({
        original_word: formData.original_word,
        translated_word: formData.translated_word,
        pronunciation: formData.pronunciation || null,
        example_sentence: formData.example_sentence || null,
        language_id: formData.language_id,
        category_id: formData.category_id,
        difficulty_level: formData.difficulty_level,
      })

    if (error) {
      toast.error('Erro ao criar palavra', { description: error.message })
    } else {
      toast.success('Palavra criada com sucesso!')
      setIsCreateOpen(false)
      resetForm()
      router.refresh()
    }
    setIsLoading(false)
  }

  async function handleEdit() {
    if (!selectedWord) return
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('words')
      .update({
        original_word: formData.original_word,
        translated_word: formData.translated_word,
        pronunciation: formData.pronunciation || null,
        example_sentence: formData.example_sentence || null,
        language_id: formData.language_id,
        category_id: formData.category_id,
        difficulty_level: formData.difficulty_level,
      })
      .eq('id', selectedWord.id)

    if (error) {
      toast.error('Erro ao atualizar palavra', { description: error.message })
    } else {
      toast.success('Palavra atualizada com sucesso!')
      setIsEditOpen(false)
      resetForm()
      router.refresh()
    }
    setIsLoading(false)
  }

  async function handleDelete() {
    if (!selectedWord) return
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', selectedWord.id)

    if (error) {
      toast.error('Erro ao excluir palavra', { description: error.message })
    } else {
      toast.success('Palavra excluida com sucesso!')
      setIsDeleteOpen(false)
      resetForm()
      router.refresh()
    }
    setIsLoading(false)
  }

  function openEdit(word: Word & { category: Category; language: Language }) {
    setSelectedWord(word)
    setFormData({
      original_word: word.original_word,
      translated_word: word.translated_word,
      pronunciation: word.pronunciation || '',
      example_sentence: word.example_sentence || '',
      language_id: word.language_id,
      category_id: word.category_id,
      difficulty_level: word.difficulty_level,
    })
    setIsEditOpen(true)
  }

  function openDelete(word: Word) {
    setSelectedWord(word)
    setIsDeleteOpen(true)
  }

  const difficultyColors = {
    easy: 'bg-success/15 text-success',
    medium: 'bg-warning/15 text-warning',
    hard: 'bg-danger/15 text-danger',
  }

  const difficultyLabels = {
    easy: 'Facil',
    medium: 'Medio',
    hard: 'Dificil',
  }

  const hasCategories = languages.some(l => l.categories && l.categories.length > 0)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Lista de Palavras</CardTitle>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar palavras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-64"
              />
            </div>
            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Todos idiomas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos idiomas</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag_emoji}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" disabled={!hasCategories}>
                  <Plus className="w-4 h-4" />
                  Nova Palavra
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Palavra</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova palavra ao vocabulario
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={formData.language_id}
                      onValueChange={(value) => setFormData({ ...formData, language_id: value, category_id: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.filter(l => l.categories && l.categories.length > 0).map((lang) => (
                          <SelectItem key={lang.id} value={lang.id}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag_emoji}</span>
                              <span>{lang.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      disabled={!formData.language_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original">Palavra Original</Label>
                    <Input
                      id="original"
                      placeholder="Ex: Hello"
                      value={formData.original_word}
                      onChange={(e) => setFormData({ ...formData, original_word: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="translated">Traducao</Label>
                    <Input
                      id="translated"
                      placeholder="Ex: Ola"
                      value={formData.translated_word}
                      onChange={(e) => setFormData({ ...formData, translated_word: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pronunciation">Pronuncia (opcional)</Label>
                    <Input
                      id="pronunciation"
                      placeholder="Ex: heh-LOH"
                      value={formData.pronunciation}
                      onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificuldade</Label>
                    <Select
                      value={formData.difficulty_level}
                      onValueChange={(value: 'easy' | 'medium' | 'hard') => setFormData({ ...formData, difficulty_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Facil</SelectItem>
                        <SelectItem value="medium">Medio</SelectItem>
                        <SelectItem value="hard">Dificil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="example">Frase de Exemplo (opcional)</Label>
                    <Textarea
                      id="example"
                      placeholder="Ex: Hello, how are you?"
                      value={formData.example_sentence}
                      onChange={(e) => setFormData({ ...formData, example_sentence: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreate} 
                    disabled={isLoading || !formData.original_word || !formData.translated_word || !formData.language_id || !formData.category_id}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Criar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {!hasCategories 
                  ? 'Cadastre idiomas e categorias antes de adicionar palavras.'
                  : searchTerm || filterLanguage
                  ? 'Nenhuma palavra encontrada com os filtros aplicados.'
                  : 'Nenhuma palavra cadastrada ainda.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Palavra</TableHead>
                    <TableHead>Traducao</TableHead>
                    <TableHead>Idioma</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Dificuldade</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-medium">{word.original_word}</TableCell>
                      <TableCell>{word.translated_word}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          <span>{word.language.flag_emoji}</span>
                          <span>{word.language.name}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{word.category.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={difficultyColors[word.difficulty_level]}>
                          {difficultyLabels[word.difficulty_level]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(word)}
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDelete(word)}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Palavra</DialogTitle>
            <DialogDescription>
              Atualize as informacoes da palavra
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-language">Idioma</Label>
              <Select
                value={formData.language_id}
                onValueChange={(value) => setFormData({ ...formData, language_id: value, category_id: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um idioma" />
                </SelectTrigger>
                <SelectContent>
                  {languages.filter(l => l.categories && l.categories.length > 0).map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag_emoji}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                disabled={!formData.language_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-original">Palavra Original</Label>
              <Input
                id="edit-original"
                value={formData.original_word}
                onChange={(e) => setFormData({ ...formData, original_word: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-translated">Traducao</Label>
              <Input
                id="edit-translated"
                value={formData.translated_word}
                onChange={(e) => setFormData({ ...formData, translated_word: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pronunciation">Pronuncia (opcional)</Label>
              <Input
                id="edit-pronunciation"
                value={formData.pronunciation}
                onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-difficulty">Dificuldade</Label>
              <Select
                value={formData.difficulty_level}
                onValueChange={(value: 'easy' | 'medium' | 'hard') => setFormData({ ...formData, difficulty_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Facil</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="hard">Dificil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-example">Frase de Exemplo (opcional)</Label>
              <Textarea
                id="edit-example"
                value={formData.example_sentence}
                onChange={(e) => setFormData({ ...formData, example_sentence: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEdit} 
              disabled={isLoading || !formData.original_word || !formData.translated_word || !formData.language_id || !formData.category_id}
            >
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
            <AlertDialogTitle>Excluir Palavra</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a palavra &quot;{selectedWord?.original_word}&quot;?
              Esta acao nao pode ser desfeita.
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
