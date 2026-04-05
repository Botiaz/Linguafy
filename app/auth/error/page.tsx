import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LinguaFlash</span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Erro de Autenticacao</CardTitle>
            <CardDescription>
              Ocorreu um erro durante a autenticacao. Por favor, tente novamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/auth/login">
              <Button className="w-full">Tentar Novamente</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Voltar para Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
