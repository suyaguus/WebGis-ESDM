import { useState } from 'react'
import { Building2, ChevronRight, ChevronsUpDown } from 'lucide-react'
import { Panel, StatusPill } from '@/components/ui'
import { MOCK_COMPANIES } from '@/constants/mockData'
import { cn } from '@/lib/utils'
import type { CompanyStatus } from '@/types'

const STATUS_PILL: Record<CompanyStatus, 'online' | 'offline' | 'evaluation'> = {
  active: 'online', inactive: 'offline', evaluation: 'evaluation',
}

type SortKey = 'name' | 'sensorCount' | 'avgSubsidence'

export default function CompanyTable() {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = [...MOCK_COMPANIES].sort((a, b) => {
    const va = a[sortKey], vb = b[sortKey]
    if (typeof va === 'number' && typeof vb === 'number')
      return sortAsc ? va - vb : vb - va
    return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const SortBtn = ({ col }: { col: SortKey }) => (
    <button onClick={() => handleSort(col)} className="ml-0.5 inline-flex">
      <ChevronsUpDown size={9} className={cn('transition-colors', sortKey === col ? 'text-accent-cyan' : 'text-text-muted')} />
    </button>
  )

  return (
    <Panel
      title="Daftar Perusahaan"
      icon={<Building2 size={12} className="text-accent-purple" />}
      headerRight={
        <button className="text-[9px] text-accent-blue hover:text-accent-cyan font-mono font-semibold transition-colors">
          LIHAT SEMUA →
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th><span className="inline-flex items-center">Perusahaan <SortBtn col="name" /></span></th>
              <th><span className="inline-flex items-center">Sensor <SortBtn col="sensorCount" /></span></th>
              <th>Wilayah</th>
              <th><span className="inline-flex items-center">Avg cm/thn <SortBtn col="avgSubsidence" /></span></th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((co) => (
              <tr key={co.id} className="cursor-pointer group">
                <td className="td-primary">{co.name}</td>
                <td className="td-mono">
                  <span className={co.activeSensors < co.sensorCount ? 'text-accent-amber font-semibold' : 'text-text-primary font-semibold'}>
                    {co.activeSensors}
                  </span>
                  <span className="text-text-muted">/{co.sensorCount}</span>
                </td>
                <td className="text-text-secondary">{co.region}</td>
                <td className={cn('td-mono font-semibold',
                  co.avgSubsidence < -3.5 ? 'text-accent-red' :
                  co.avgSubsidence < -2.5 ? 'text-accent-amber' :
                  'text-accent-green')}>
                  {co.avgSubsidence.toFixed(2)}
                </td>
                <td><StatusPill variant={STATUS_PILL[co.status]} /></td>
                <td>
                  <ChevronRight size={13} className="text-text-muted group-hover:text-accent-cyan transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
