'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { format } from 'date-fns'
import { ScanRow } from '@/hooks/useRealtimeScans'

interface CodTrendChartProps {
  scans: ScanRow[]
}

export default function CodTrendChart({ scans }: CodTrendChartProps) {
  // Sort reverse so oldest is first, strictly mapping those with a COD value
  const data = scans
    .filter(scan => typeof scan.cod_estimate === 'number')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(scan => ({
      time: format(new Date(scan.created_at), 'hh:mm a'),
      cod: Number(scan.cod_estimate?.toFixed(1)),
      dateStr: format(new Date(scan.created_at), 'MMM dd')
    }))

  if (data.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No COD Data</p>
        <p className="text-slate-400 text-xs mt-1">Water records with COD estimations will appear here.</p>
      </div>
    )
  }

  return (
    <div className="h-64 w-full mt-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Chemical Oxygen Demand Trend</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            itemStyle={{ fontWeight: 'bold' }}
            labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
            formatter={(val: number) => [`${val} mg/L`, 'COD']}
            labelFormatter={(label: string, payload: any) => {
              if (payload && payload.length > 0) return `${payload[0].payload.dateStr} — ${label}`;
              return label;
            }}
          />
          <ReferenceLine 
            y={50} 
            stroke="#ef4444" 
            strokeDasharray="4 4" 
            label={{ position: 'top', value: 'Danger (50+)', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} 
          />
          <Line 
            type="monotone" 
            dataKey="cod" 
            name="COD"
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
