import { useState } from 'react'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

type InvestmentInsert = Database['public']['Tables']['investments']['Insert']

type Props = {
  userId: string
  onSubmit: (payload: InvestmentInsert) => void
  loading?: boolean
}

const ASSET_TYPES = [
  { value: 'stock', label: '📈 Acciones' },
  { value: 'etf', label: '📊 ETF' },
  { value: 'crypto', label: '₿ Cripto' },
  { value: 'bond', label: '📄 Bonos' },
  { value: 'fund', label: '💼 Fondo' },
  { value: 'real_estate', label: '🏠 Inmueble' },
  { value: 'other', label: '🔷 Otro' },
]

export const InvestmentForm = ({ userId, onSubmit, loading }: Props) => {
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [assetType, setAssetType] =
    useState<InvestmentInsert['asset_type']>('stock')
  const [invested, setInvested] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [currency, setCurrency] = useState('USD')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      user_id: userId,
      name,
      ticker: ticker || null,
      asset_type: assetType,
      total_invested: parseFloat(invested),
      current_value: parseFloat(currentValue || invested),
      currency,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <Input
        label='Nombre'
        placeholder='Ej: Apple Inc.'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label='Ticker (opcional)'
        placeholder='Ej: AAPL, BTC'
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />
      <Select
        label='Tipo de activo'
        value={assetType}
        onChange={(e) =>
          setAssetType(e.target.value as InvestmentInsert['asset_type'])
        }
      >
        {ASSET_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>
      <Select
        label='Moneda'
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value='USD'>USD</option>
        <option value='PEN'>PEN</option>
        <option value='EUR'>EUR</option>
      </Select>
      <Input
        label='Total invertido'
        type='number'
        step='0.01'
        placeholder='0.00'
        value={invested}
        onChange={(e) => setInvested(e.target.value)}
        required
      />
      <Input
        label='Valor actual'
        type='number'
        step='0.01'
        placeholder='Igual al invertido si no sabes'
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
      />
      <Button type='submit' fullWidth loading={loading} size='lg'>
        Guardar inversión
      </Button>
    </form>
  )
}
