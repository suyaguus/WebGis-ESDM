import { Construction } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'

interface PlaceholderPageProps {
  title: string
  breadcrumbs: { label: string }[]
}

export default function PlaceholderPage({ title, breadcrumbs }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col h-full">
      <Topbar breadcrumbs={breadcrumbs} />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center bg-bg-app">
        <div className="w-14 h-14 rounded-2xl bg-bg-card border border-border-base shadow-card flex items-center justify-center">
          <Construction size={24} className="text-accent-cyan opacity-70" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-text-primary">{title}</p>
          <p className="text-[12px] text-text-muted mt-1">Halaman ini sedang dalam pengembangan</p>
        </div>
      </div>
    </div>
  )
}
