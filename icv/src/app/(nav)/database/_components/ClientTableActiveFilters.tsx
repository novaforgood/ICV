import { Header } from '@tanstack/react-table'
import React from 'react'
import { NewClient } from '@/types/client-types'

interface ClientTableActiveFiltersProps {
  headers: Header<NewClient, unknown>[]
}


const ageValueToLabelMap: Record<string, string> = {
  lessThan17: '<17 yrs',
  between18and24: '18-24 yrs',
  between25and61: '25-61 yrs',
  greaterThan62: '>62 yrs',
  unknown: 'Unknown',
}

const ageLabelToValueMap = Object.fromEntries(
  Object.entries(ageValueToLabelMap).map(([k, v]) => [v, k]),
)

const ClientTableActiveFilters: React.FC<ClientTableActiveFiltersProps> = ({ headers }) => {
  const anyFilters = headers.some(
    (header) =>
      Array.isArray(header.column.getFilterValue?.()) &&
      (header.column.getFilterValue() as string[]).length > 0,
  )

  if (!anyFilters) return null

  return (
    <tbody>
      <tr>
        {headers.map((header) => {
          const filterValues = header.column.getFilterValue?.()
          const hasFilters =
            Array.isArray(filterValues) && filterValues.length > 0

          const displayValues = hasFilters
            ? (filterValues as string[]).map((val) =>
                header.column.id === 'age' ? ageValueToLabelMap[val] ?? val : val,
              )
            : []

          return (
            <td key={header.id} className="py-2 px-3 text-center align-top border-r border-l border-gray-200">
              {hasFilters && (
                <div className="flex flex-wrap justify-start gap-1">
                  {displayValues.map((val) => (
                    <span
                      key={val}
                      className="flex items-center gap-1 rounded-full bg-black px-2 py-1 text-xs text-white"
                    >
                      {val}
                      <button
                        onClick={() => {
                          const rawValue =
                            header.column.id === 'age'
                              ? ageLabelToValueMap[val] ?? val
                              : val
                          const newVals = (filterValues as string[]).filter(
                            (v) => v !== rawValue,
                          )
                          header.column.setFilterValue(
                            newVals.length > 0 ? newVals : undefined,
                          )
                        }}
                        className="ml-1 text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </td>
          )
        })}
      </tr>
    </tbody>
  )
}

export default ClientTableActiveFilters
