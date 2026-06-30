export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const FIXED_SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID

export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
].join(' ')

export const SPREADSHEET_NAME = 'Finanzas Personales — Phil'

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export const FUENTES_INGRESO = ['Salario', 'Mura Café', 'Otro']

export const CATEGORIAS_FIJAS = [
  { nombre: 'Hogar', subcategorias: ['Arriendo', 'Administración', 'Servicios públicos', 'Internet/telefonía'] },
  { nombre: 'Salud', subcategorias: ['Médico', 'Medicamentos', 'Bienestar/Gym'] },
  { nombre: 'Suscripciones', subcategorias: ['Streaming', 'Software', 'Otros'] },
]

export const CATEGORIAS_VARIABLES = [
  { nombre: 'Mercado / Alimentación', subcategorias: ['Supermercado', 'Frutas/verduras'] },
  { nombre: 'Restaurantes y delivery', subcategorias: ['Restaurante', 'Rappi/Domicilio'] },
  { nombre: 'Ocio y entretenimiento', subcategorias: ['Salidas', 'Viajes', 'Eventos'] },
  { nombre: 'Perros', subcategorias: ['Comida', 'Baño/estética', 'Veterinario/salud'] },
  { nombre: 'Ropa y accesorios', subcategorias: ['Ropa', 'Calzado', 'Accesorios'] },
  { nombre: 'Transporte', subcategorias: ['Uber/taxi', 'Parqueadero'] },
  { nombre: 'Tecnología', subcategorias: ['Gadgets', 'Accesorios'] },
  { nombre: 'Educación', subcategorias: ['Cursos', 'Libros'] },
]

export const TODAS_CATEGORIAS = [...CATEGORIAS_FIJAS, ...CATEGORIAS_VARIABLES]

export const CATEGORIAS_MURA = [
  'Insumos/Materia prima',
  'Operación',
  'Marketing',
  'Personal',
  'Local/Arriendo',
  'Equipos',
  'Otros gastos',
]

export const TIPOS_INVERSION = ['Bolsillo', 'Plazo_Fijo', 'Acciones']

export const CATEGORIAS_FIJAS_NOMBRES = ['Hogar', 'Salud', 'Suscripciones']

export const SALARIO_FIJO_KEY = 'finanzas_salario_fijo'
export const SALARIO_FIJO_DEFAULT = 23_000_000

export const RANGOS_MONTO = [
  { label: '< $50k', value: 25_000 },
  { label: '$50k – $150k', value: 100_000 },
  { label: '$150k – $500k', value: 325_000 },
  { label: '$500k – $1.5M', value: 1_000_000 },
  { label: '$1.5M – $5M', value: 3_250_000 },
  { label: '> $5M', value: 7_500_000 },
]

export const COLORES_GRAFICA = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#a78bfa',
]

export const SHEETS = {
  TRANSACCIONES: 'Transacciones',
  PRESUPUESTO: 'Presupuesto',
  INGRESOS: 'Ingresos',
  MURA: 'Mura_Café',
  INVERSIONES: 'Inversiones_Ahorros',
  CONFIG: 'Configuración',
}

export const HEADERS = {
  [SHEETS.TRANSACCIONES]: ['Fecha', 'Descripción', 'Monto', 'Categoría', 'Subcategoría', 'Tipo_Gasto', 'Mes', 'Año', 'ID', 'Notas'],
  [SHEETS.PRESUPUESTO]: ['Mes', 'Año', 'Categoría', 'Límite_COP', 'Gastado', 'Porcentaje', 'Estado'],
  [SHEETS.INGRESOS]: ['Fecha', 'Fuente', 'Monto', 'Mes', 'Año', 'Notas'],
  [SHEETS.MURA]: ['Fecha', 'Concepto', 'Tipo', 'Monto', 'Categoría_Mura', 'Mes', 'Año', 'Notas'],
  [SHEETS.INVERSIONES]: ['Fecha', 'Tipo', 'Entidad', 'Descripción', 'Monto', 'Acción', 'Saldo_Actual', 'Mes', 'Año', 'Notas'],
  [SHEETS.CONFIG]: ['Categoría', 'Subcategorías', 'Tipo_Gasto', 'Activa'],
}
