import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/92 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.45),0_10px_24px_hsl(var(--primary)/0.28)] active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/92 hover:shadow-md active:scale-[0.98] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-border/80 bg-transparent text-foreground shadow-xs hover:bg-muted/65 hover:text-foreground hover:shadow-sm active:scale-[0.98]',
        secondary:
          'border border-border/80 bg-transparent text-secondary-foreground shadow-xs hover:bg-secondary/70 hover:border-border hover:shadow-sm active:scale-[0.98]',
        ghost:
          'text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

/*
  Altered files summary:
  - components/ui/button.tsx: primary/secondary/ghost/destructive com nova linguagem visual, radius maior e transicoes 200ms.
  - components/ui/card.tsx: superfícies com leve elevação, borda sutil e sombra tokenizada.
  - components/ui/input.tsx: campo escuro com foco violeta mais claro e hover suave.
  - components/ui/select.tsx: trigger/content/item com acabamento consistente ao novo sistema.
  - components/ui/textarea.tsx: mesma assinatura visual dos inputs (fundo, borda e foco).
  - components/ui/badge.tsx: badges menos flat, com contorno e contraste refinado.
  - components/dashboard/dashboard-nav.tsx: header/navbar com superfície e borda alinhadas ao novo tema.
*/
