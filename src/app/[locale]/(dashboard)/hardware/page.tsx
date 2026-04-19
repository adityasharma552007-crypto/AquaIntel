'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Wifi, ChevronLeft, RefreshCw, Zap, Cpu, Activity, Clock
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeScans } from '@/hooks/useRealtimeScans'
import { ScanCard } from '@/components/ScanCard'

export default function HardwarePage() {
  const [deviceStatus, setDeviceStatus] = useState<"LIVE" | "IDLE" | "OFFLINE">("OFFLINE")
  const [lastReading, setLastReading] = useState<any>(null)
  const [todayCount, setTodayCount] = useState(0)
  const [timeAgoStr, setTimeAgoStr] = useState("No recent data")
  const [refreshing, setRefreshing] = useState(false)

  // Realtime Supabase Hook for bottom feed
  const { readings, loading: scansLoading } = useRealtimeScans()

  const fetchDeviceStatus = useCallback(async () => {
    setRefreshing(true)
    const supabase = createClient()
    
    // Fetch last reading
    const { data: lastRow } = await supabase
      .from("water_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (lastRow) {
      setLastReading(lastRow)
    }

    // Fetch today's count
    const today = new Date()
    today.setHours(0,0,0,0)
    const { count } = await supabase
      .from("water_data")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString())
      
    if (count !== null) setTodayCount(count)
    
    setTimeout(() => setRefreshing(false), 500)
  }, [])

  // Auto refresh every 30s
  useEffect(() => {
    fetchDeviceStatus()
    const interval = setInterval(fetchDeviceStatus, 30000)
    return () => clearInterval(interval)
  }, [fetchDeviceStatus])

  // Update time string every 1s
  useEffect(() => {
    const updateTime = () => {
      if (!lastReading) {
        setDeviceStatus("OFFLINE")
        setTimeAgoStr("No recent data")
        return
      }
      const diffMs = Date.now() - new Date(lastReading.created_at).getTime()
      const diffSecs = Math.floor(diffMs / 1000)
      const diffMins = Math.floor(diffSecs / 60)
      
      if (diffSecs < 120) {
        setDeviceStatus("LIVE")
        setTimeAgoStr(`Last seen: ${diffSecs} seconds ago`)
      } else if (diffSecs < 300) {
        setDeviceStatus("IDLE")
        setTimeAgoStr(`Last seen: ${diffMins} minutes ago`)
      } else {
        setDeviceStatus("OFFLINE")
        setTimeAgoStr("No recent data")
      }
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [lastReading])

  const statusColors = {
    LIVE: "bg-green-500",
    IDLE: "bg-yellow-500",
    OFFLINE: "bg-red-500"
  }

  const badgeColors = {
    LIVE: "bg-green-50 text-green-700 border-green-200",
    IDLE: "bg-yellow-50 text-yellow-700 border-yellow-200",
    OFFLINE: "bg-red-50 text-red-700 border-red-200"
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-4 bg-white">
        <div className="flex items-center justify-between mb-1">
          <Link href="/home" className="p-2 bg-slate-100 rounded-full">
            <ChevronLeft size={20} className="text-[#60A5FA]" />
          </Link>
          <h1 className="text-xl font-black text-[#60A5FA] uppercase tracking-tighter">Device</h1>
          
          <div className="relative flex items-center justify-center w-9 h-9">
            {deviceStatus === "LIVE" && (
              <>
                <span className="absolute inline-flex h-9 w-9 rounded-full bg-green-400 opacity-20 animate-ping" />
                <span className="absolute inline-flex h-6 w-6 rounded-full bg-green-400 opacity-30 animate-ping [animation-delay:0.2s]" />
              </>
            )}
            <div className={`relative z-10 p-1.5 rounded-full transition-colors bg-slate-100`}>
              <Wifi size={18} className={deviceStatus === "LIVE" ? "text-green-600" : deviceStatus === "IDLE" ? "text-yellow-500" : "text-red-400"} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 px-5 py-4 pb-28 space-y-6">
        
        {/* Status Banner */}
        <div className={`px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-bold shadow-sm transition-colors border ${badgeColors[deviceStatus]}`}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {deviceStatus === "LIVE" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${statusColors[deviceStatus]}`}></span>
            </span>
            {deviceStatus === "LIVE" ? "🟢 ESP32 Live" :
             deviceStatus === "IDLE" ? "🟡 ESP32 Idle" : "🔴 ESP32 Offline"}
          </div>
          <div className="text-xs opacity-70">
            {timeAgoStr}
          </div>
        </div>

        {/* Device Info Card */}
        <div className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white">
          <div className="px-5 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                <Cpu size={20} className="text-[#60A5FA]" />
              </div>
              <div>
                <p className="text-slate-800 font-black text-base tracking-tight leading-none">
                  AquaIntel Hardware
                </p>
                <p className="text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-widest">
                  ESP32 SENSOR NODE
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${badgeColors[deviceStatus]}`}>
              {deviceStatus}
            </div>
          </div>

          <div className="px-5 py-4 grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> Last Reading
              </p>
              <p className="text-sm font-black text-slate-700 mt-0.5 truncate">
                {lastReading ? new Date(lastReading.created_at).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Activity size={10} /> Last Quality
              </p>
              <p className="text-sm font-black text-slate-700 mt-0.5 truncate">
                {lastReading?.quality != null ? `${Math.round(lastReading.quality * 100)}%` : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Zap size={10} /> Last Status
              </p>
              <p className={`text-sm font-black mt-0.5 truncate ${lastReading?.status === 'Pure' ? 'text-[#60A5FA]' : lastReading?.status ? 'text-red-500' : 'text-slate-700'}`}>
                {lastReading?.status ?? 'N/A'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Activity size={10} /> Today's Scans
              </p>
              <p className="text-sm font-black text-slate-700 mt-0.5 truncate">
                {todayCount}
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchDeviceStatus}
          disabled={refreshing}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#60A5FA] text-white rounded-2xl font-black text-sm hover:bg-[#3B82F6] transition-all shadow-lg shadow-blue-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} /> 
          {refreshing ? "Refreshing..." : "Refresh Status"}
        </button>
        
        {/* Realtime ESP32 Stream */}
        <div className="mt-8 space-y-3">
          <h3 className="font-black text-slate-700 uppercase tracking-tight flex items-center gap-2">
            <Zap size={16} className="text-blue-500" /> Live Data Stream
          </h3>
          
          {scansLoading ? (
            <div className="flex justify-center p-8 text-slate-400">
              <RefreshCw className="animate-spin w-6 h-6" />
            </div>
          ) : readings.length === 0 ? (
            <div className="text-center bg-slate-50 border border-slate-100 rounded-2xl py-10">
              <p className="font-bold text-slate-400">Waiting for readings...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {readings.map((reading, i) => (
                <ScanCard key={reading.id} scan={reading} index={i} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
