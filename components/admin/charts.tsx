'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export interface SeriesPoint {
  date: string // YYYY-MM-DD
  value: number
  extra?: { label: string; value: number }[]
}

const nf = new Intl.NumberFormat('en-KE')
export const formatNumber = (n: number) => nf.format(n)
export const formatDay = (date: string, withWeekday = false) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withWeekday ? { weekday: 'short' } : {}),
  })

function niceMax(max: number): { top: number; step: number } {
  if (max <= 0) return { top: 4, step: 1 }
  const rough = max / 4
  const mag = Math.pow(10, Math.floor(Math.log10(rough)))
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= rough) || rough
  const finalStep = Math.max(1, Math.ceil(step))
  return { top: finalStep * Math.ceil(max / finalStep), step: finalStep }
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

/** Single-series time chart (line+area or columns) with crosshair tooltip and table view. */
export function TimeChart({
  data,
  label,
  kind = 'line',
  height = 240,
}: {
  data: SeriesPoint[]
  label: string
  kind?: 'line' | 'column'
  height?: number
}) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const pad = { top: 12, right: 8, bottom: 26, left: 36 }
  const innerW = Math.max(0, width - pad.left - pad.right)
  const innerH = height - pad.top - pad.bottom
  const { top, step } = useMemo(() => niceMax(Math.max(0, ...data.map(d => d.value))), [data])
  const ticks = useMemo(() => {
    const out: number[] = []
    for (let v = 0; v <= top; v += step) out.push(v)
    return out
  }, [top, step])

  const n = data.length
  const band = n ? innerW / n : 0
  const x = (i: number) => (kind === 'column' ? band * i + band / 2 : n > 1 ? (innerW * i) / (n - 1) : innerW / 2)
  const y = (v: number) => innerH - (v / top) * innerH

  const linePath = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join('')
  const areaPath = n ? `${linePath}L${x(n - 1).toFixed(1)},${innerH}L${x(0).toFixed(1)},${innerH}Z` : ''

  // Show ~6 evenly spaced date labels
  const labelEvery = Math.max(1, Math.ceil(n / 6))

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const i = kind === 'column' ? Math.floor(px / band) : Math.round((px / innerW) * (n - 1))
    setHover(Math.min(n - 1, Math.max(0, i)))
  }

  const barW = Math.max(2, Math.min(band - 2, band * 0.72))
  const columnPath = (i: number, v: number) => {
    const h = innerH - y(v)
    if (h <= 0) return ''
    const r = Math.min(4, h, barW / 2)
    const x0 = x(i) - barW / 2
    const y0 = y(v)
    return `M${x0},${innerH}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + barW - r}Q${x0 + barW},${y0} ${x0 + barW},${y0 + r}V${innerH}Z`
  }

  const hovered = hover !== null ? data[hover] : null

  return (
    <div>
      <div className="adm-chart" ref={ref} style={{ height }}>
        {width > 0 && (
          <svg width={width} height={height} role="img" aria-label={`${label} per day`}>
            <g transform={`translate(${pad.left},${pad.top})`}>
              {ticks.map(t => (
                <g key={t}>
                  {t > 0 && <line className="gridline" x1={0} x2={innerW} y1={y(t)} y2={y(t)} />}
                  <text className="axis-text" x={-8} y={y(t)} dy="0.32em" textAnchor="end">
                    {formatNumber(t)}
                  </text>
                </g>
              ))}
              <line className="baseline" x1={0} x2={innerW} y1={innerH} y2={innerH} />

              {data.map((d, i) => {
                // Evenly spaced labels, plus the last day when it isn't crowded by the previous label
                const show = i % labelEvery === 0 || (i === n - 1 && i % labelEvery >= labelEvery / 2)
                return show ? (
                  <text key={d.date} className="axis-text" x={x(i)} y={innerH + 18} textAnchor="middle">
                    {formatDay(d.date)}
                  </text>
                ) : null
              })}

              {kind === 'line' ? (
                <>
                  <path d={areaPath} fill="var(--adm-accent)" opacity={0.1} />
                  <path d={linePath} fill="none" stroke="var(--adm-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                </>
              ) : (
                data.map((d, i) => (
                  <path
                    key={d.date}
                    d={columnPath(i, d.value)}
                    fill="var(--adm-accent)"
                    opacity={hover === null || hover === i ? 1 : 0.45}
                  />
                ))
              )}

              {hovered && hover !== null && (
                <>
                  {kind === 'line' && (
                    <>
                      <line x1={x(hover)} x2={x(hover)} y1={0} y2={innerH} stroke="var(--adm-ink)" strokeOpacity={0.25} strokeDasharray="3 3" />
                      <circle cx={x(hover)} cy={y(hovered.value)} r={5} fill="var(--adm-accent)" stroke="#fff" strokeWidth={2} />
                    </>
                  )}
                </>
              )}

              <rect
                x={0}
                y={0}
                width={innerW}
                height={innerH}
                fill="transparent"
                onPointerMove={onMove}
                onPointerLeave={() => setHover(null)}
              />
            </g>
          </svg>
        )}
        {hovered && hover !== null && (
          <div
            className="adm-tooltip"
            style={{
              left: Math.min(Math.max(pad.left + x(hover), 70), width - 70),
              top: pad.top + y(hovered.value),
            }}
          >
            <b>{formatDay(hovered.date, true)}</b>
            <strong>{formatNumber(hovered.value)}</strong> {label.toLowerCase()}
            {hovered.extra?.map(e => (
              <div key={e.label}>
                {formatNumber(e.value)} {e.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <details className="adm-chart-table">
        <summary>Show as table</summary>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="num">{label}</th>
                {data[0]?.extra?.map(e => (
                  <th key={e.label} className="num">{e.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map(d => (
                <tr key={d.date}>
                  <td>{formatDay(d.date, true)}</td>
                  <td className="num">{formatNumber(d.value)}</td>
                  {d.extra?.map(e => (
                    <td key={e.label} className="num">{formatNumber(e.value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

/** Ranked horizontal bars with direct value labels. */
export function BarList({
  items,
  empty = 'No data yet',
  format = formatNumber,
}: {
  items: { label: string; value: number }[]
  empty?: string
  format?: (n: number) => string
}) {
  if (!items.length) return <div className="adm-empty">{empty}</div>
  const max = Math.max(...items.map(i => i.value), 1)
  const total = items.reduce((s, i) => s + i.value, 0)
  return (
    <ul className="adm-barlist">
      {items.map(item => (
        <li key={item.label} title={`${item.label}: ${format(item.value)} (${Math.round((item.value / total) * 100)}%)`}>
          <div className="adm-barlist-row">
            <span>{item.label}</span>
            <b>{format(item.value)}</b>
          </div>
          <div className="adm-barlist-track">
            <div className="adm-barlist-fill" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Headline number with change versus the previous period. */
export function KpiTile({
  label,
  value,
  previous,
  hint,
  format = formatNumber,
}: {
  label: string
  value: number
  previous?: number
  hint?: string
  format?: (n: number) => string
}) {
  let delta: React.ReactNode = null
  if (previous !== undefined) {
    if (previous === 0) {
      delta = value > 0 ? <span className="adm-delta up">▲ new</span> : <span className="adm-delta flat">–</span>
    } else {
      const pct = Math.round(((value - previous) / previous) * 100)
      const dir = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat'
      delta = (
        <span className={`adm-delta ${dir}`}>
          {dir === 'up' ? '▲' : dir === 'down' ? '▼' : '•'} {Math.abs(pct)}%
        </span>
      )
    }
  }
  return (
    <div className="adm-kpi">
      <span className="adm-kpi-label">{label}</span>
      <span className="adm-kpi-value">{format(value)}</span>
      <span className="adm-kpi-foot">
        {delta}
        {previous !== undefined ? 'vs previous period' : hint}
      </span>
    </div>
  )
}
