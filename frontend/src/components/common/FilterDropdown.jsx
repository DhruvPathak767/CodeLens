import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'

export function FilterDropdown({ value, onChange, options, placeholder, className }) {
  return (
    <div className={cn('w-full sm:w-44', className)}>
      <Select value={value} onChange={onChange} options={options} placeholder={placeholder} />
    </div>
  )
}
