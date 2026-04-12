import { formatCOP } from './formatters'

export function generarInsights({
  totalIngresos,
  totalGastos,
  saldoDisponible,
  ahorradoDelMes,
  gastosPorCategoria,
  presupuestoVsReal,
  tendenciaMensual,
  muraProfit,
  muraProfitMargen,
}) {
  const insights = []
  const sinDatos = totalIngresos === 0 && totalGastos === 0

  if (sinDatos) return insights

  // 1. Tasa de ahorro
  if (totalIngresos > 0 && ahorradoDelMes > 0) {
    const tasa = Math.round((ahorradoDelMes / totalIngresos) * 100)
    if (tasa >= 20) {
      insights.push({
        tipo: 'success',
        titulo: `Tasa de ahorro: ${tasa}% 🌟`,
        texto: `Ahorraste ${formatCOP(ahorradoDelMes)} — superaste el 20% recomendado. Tu patrimonio está creciendo sólido.`,
      })
    } else if (tasa >= 10) {
      insights.push({
        tipo: 'info',
        titulo: `Tasa de ahorro: ${tasa}%`,
        texto: `Ahorraste ${formatCOP(ahorradoDelMes)}. Estás en rango saludable. Apuntar al 20% te hará crecer más rápido.`,
      })
    } else {
      insights.push({
        tipo: 'warning',
        titulo: `Ahorro bajo: solo el ${tasa}%`,
        texto: `Ahorraste ${formatCOP(ahorradoDelMes)}. Intenta reducir gastos variables para llegar al menos al 10%.`,
      })
    }
  }

  // 2. Ratio gasto / ingreso
  if (totalIngresos > 0 && totalGastos > 0) {
    const ratio = Math.round((totalGastos / totalIngresos) * 100)
    if (ratio > 90) {
      insights.push({
        tipo: 'danger',
        titulo: `Gastos al ${ratio}% de tus ingresos`,
        texto: 'Casi todo tu ingreso se va en gastos. Queda muy poco margen para imprevistos o inversiones.',
      })
    } else if (ratio < 50) {
      insights.push({
        tipo: 'success',
        titulo: `Excelente control: solo el ${ratio}% en gastos`,
        texto: `Tienes ${formatCOP(saldoDisponible)} sin destino aún. Considera invertirlo antes de que el mes cierre.`,
      })
    }
  }

  // 3. Categoría dominante
  if (gastosPorCategoria.length > 0 && totalGastos > 0) {
    const top = gastosPorCategoria[0]
    const pct = Math.round((top.value / totalGastos) * 100)
    if (pct >= 35) {
      insights.push({
        tipo: 'info',
        titulo: `${top.name} es el ${pct}% de tus gastos`,
        texto: `Con ${formatCOP(top.value)}, esta categoría domina. Revisa si hay optimización posible sin sacrificar calidad de vida.`,
      })
    }
  }

  // 4. Presupuestos excedidos / alertas
  const excedidos = presupuestoVsReal.filter((p) => p.porcentaje >= 100)
  const alertas = presupuestoVsReal.filter((p) => p.porcentaje >= 80 && p.porcentaje < 100)

  if (excedidos.length > 0) {
    insights.push({
      tipo: 'danger',
      titulo: `${excedidos.length} presupuesto${excedidos.length > 1 ? 's' : ''} excedido${excedidos.length > 1 ? 's' : ''}`,
      texto: `${excedidos.map((e) => e.categoria).join(' y ')} superaron su límite. Ajusta el gasto o revisa el límite para el próximo mes.`,
    })
  } else if (alertas.length > 0) {
    insights.push({
      tipo: 'warning',
      titulo: `${alertas.length} categoría${alertas.length > 1 ? 's' : ''} cerca del límite`,
      texto: `${alertas.map((a) => a.categoria).join(' y ')} superaron el 80% del presupuesto. Ojo con el cierre del mes.`,
    })
  } else if (presupuestoVsReal.length > 0) {
    insights.push({
      tipo: 'success',
      titulo: 'Todos los presupuestos bajo control',
      texto: 'Ninguna categoría superó su límite este mes. Disciplina financiera en punto.',
    })
  }

  // 5. Tendencia de 3 meses
  if (tendenciaMensual.length >= 3) {
    const [a, b, c] = tendenciaMensual.slice(-3).map((m) => m.gastos)
    if (c > b && b > a && a > 0) {
      const crecimiento = Math.round(((c - a) / a) * 100)
      insights.push({
        tipo: 'warning',
        titulo: `Gastos creciendo 3 meses seguidos (+${crecimiento}%)`,
        texto: 'Tendencia alcista sostenida. Si no es intencional (mudanza, inversión), vale la pena revisar qué categorías están empujando el gasto.',
      })
    } else if (c < b && b < a && a > 0) {
      const reduccion = Math.round(((a - c) / a) * 100)
      insights.push({
        tipo: 'success',
        titulo: `3 meses reduciendo gastos (-${reduccion}%)`,
        texto: '¡Tendencia positiva sostenida! Llevas 3 meses consecutivos bajando gastos.',
      })
    }
  }

  // 6. Mura Café
  if (muraProfit !== 0 || muraProfitMargen !== 0) {
    if (muraProfitMargen < 0) {
      insights.push({
        tipo: 'danger',
        titulo: 'Mura Café cerró en pérdida',
        texto: `Pérdida de ${formatCOP(Math.abs(muraProfit))} este mes. Revisa costos de insumos, operación y si los precios de venta son sostenibles.`,
      })
    } else if (muraProfitMargen >= 30) {
      insights.push({
        tipo: 'success',
        titulo: `Mura Café: ${muraProfitMargen}% de margen 🔥`,
        texto: `${formatCOP(muraProfit)} de utilidad neta — excelente resultado. El café está generando valor real.`,
      })
    } else if (muraProfitMargen > 0 && muraProfitMargen < 15) {
      insights.push({
        tipo: 'warning',
        titulo: `Mura Café: margen ajustado (${muraProfitMargen}%)`,
        texto: `Margen por debajo del 15%. Analiza si puedes reducir costos sin afectar la experiencia del cliente.`,
      })
    }
  }

  return insights
}
