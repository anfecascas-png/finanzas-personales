import { Search } from 'lucide-react'
import { Select } from '../ui/Select'
import { TODAS_CATEGORIAS } from '../../config'

export function FiltrosTransacciones({ search, onSearch, categoriaFiltro, onCategoria, tipoFiltro, onTipo }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar transacción..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>
      <Select value={categoriaFiltro} onChange={(e) => onCategoria(e.target.value)} className="sm:w-44">
        <option value="">Todas las categorías</option>
        {TODAS_CATEGORIAS.map((c) => (
          <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
        ))}
      </Select>
      <Select value={tipoFiltro} onChange={(e) => onTipo(e.target.value)} className="sm:w-36">
        <option value="">Todos los tipos</option>
        <option value="Fijo">Fijo</option>
        <option value="Variable">Variable</option>
      </Select>
    </div>
  )
}
