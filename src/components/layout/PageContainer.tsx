import type { ReactNode } from 'react'

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      {children}
    </div>
  )
}
