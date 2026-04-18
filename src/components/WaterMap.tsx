'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { Shield, AlertTriangle, Navigation, Map as MapIcon, Layers, MapPin, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { format } from "date-fns"

// Fix for default Leaflet markers in Next.js
const customIcon = (quality: number) => {
  const color = quality >= 0.8 ? '#10B981' : quality >= 0.4 ? '#F5A623' : '#EF4444'
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; items-center; justify-content: center;">
             <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

interface WaterMapProps {
  scans: any[]
  cityName?: string
}

type ViewMode = 'markers' | 'heatmap' | 'both';

function HeatmapLayer({ points, viewMode }: { points: any[], viewMode: ViewMode }) {
  const map = useMap()

  useEffect(() => {
    if (viewMode === 'markers' || !points.length) return;

    // Intensity based on quality score (lower quality = higher heat)
    const heatPoints = points.map(p => [
      p.latitude, 
      p.longitude, 
      Math.max(0, 1 - (p.quality || 0)) // 1.0 heat for 0.0 quality
    ])
    
    // Add heat layer
    const heat = (L as any).heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 14,
      gradient: {
        0.3: '#10B981', // green for lowest heat (highest quality)
        0.6: '#F5A623', // orange for medium risk
        1.0: '#EF4444'  // red for highest heat (lowest quality)
      }
    }).addTo(map)

    return () => {
      map.removeLayer(heat)
    }
  }, [map, points, viewMode])

  return null
}

export default function WaterMap({ scans = [], cityName = 'Jaipur' }: WaterMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('both')
  const defaultCenter: [number, number] = [26.9124, 75.7873] // Jaipur

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-3xl" />

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex bg-white/90 backdrop-blur-md rounded-full shadow-lg p-1 border border-slate-100">
        <button
          onClick={() => setViewMode('markers')}
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all gap-1.5 flex items-center",
            viewMode === 'markers' ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <MapPin size={12} /> Markers
        </button>
        <button
          onClick={() => setViewMode('heatmap')}
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all gap-1.5 flex items-center",
            viewMode === 'heatmap' ? "bg-red-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <MapIcon size={12} /> Heatmap
        </button>
        <button
          onClick={() => setViewMode('both')}
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all gap-1.5 flex items-center",
            viewMode === 'both' ? "bg-[#60A5FA] text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <Layers size={12} /> Both
        </button>
      </div>
      <MapContainer 
        {...({
          center: defaultCenter, 
          zoom: 13, 
          scrollWheelZoom: false,
          className: "w-full h-full",
          zoomControl: false
        } as any)}
      >
        <TileLayer
          {...({
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            className: "grayscale brightness-105 contrast-90"
          } as any)}
        />
        
        <HeatmapLayer points={scans} viewMode={viewMode} />
        
        {viewMode !== 'heatmap' && scans.filter((v: any) => v.latitude && v.longitude).map((scan: any) => {
          const quality = scan.quality || 0;
          let tierConfig = { bg: 'bg-red-50', color: 'text-red-500', label: scan.status || 'Contaminated' }
          if (quality >= 0.8) {
            tierConfig = { bg: 'bg-emerald-50', color: 'text-emerald-500', label: scan.status || 'Pure' }
          } else if (quality >= 0.4) {
            tierConfig = { bg: 'bg-amber-50', color: 'text-amber-500', label: scan.status || 'Borderline' }
          }

          return (
            <Marker 
              key={scan.id} 
              {...({
                position: [scan.latitude, scan.longitude],
                icon: customIcon(quality)
              } as any)}
            >
              <Popup {...({ className: "custom-popup" } as any)}>
                <div className="w-56 p-1">
                  <div className="flex justify-between items-start mb-3 border-b pb-2 border-slate-100 mt-2 mx-1">
                     <h3 className="font-black text-slate-800 text-sm max-w-[140px] leading-tight shrink-0">{scan.location_name || 'Water Source'}</h3>
                     <Badge className={cn("text-[8px] h-5 uppercase font-black shrink-0", tierConfig.bg, tierConfig.color)}>
                       {tierConfig.label}
                     </Badge>
                  </div>
                  <div className="space-y-3 px-1 pb-1">
                     <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
                        <div className="flex items-center gap-2">
                           <div className={cn("text-2xl font-black leading-none", tierConfig.color)}>{Math.round(quality * 100)}%</div>
                           <div className="text-[8px] font-bold text-slate-400 uppercase leading-tight">Purity<br/>Score</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-black text-slate-600 mb-0.5"><Activity size={10} className="inline mr-1"/>{scan.status || 'N/A'}</div>
                           <div className="text-[8px] font-bold text-slate-400 uppercase">{format(new Date(scan.created_at), 'dd MMM yyyy')}</div>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-center pt-1">
                        <Link href={`/history/${scan.id}`} className="w-full text-center bg-[#60A5FA] text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-sm">
                           Full Scan History
                        </Link>
                     </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Controls Floating Overlay */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
         <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#60A5FA]">
            <Navigation size={18} />
         </button>
      </div>

      <div className="absolute bottom-4 left-4 z-[1000]">
         <Card className="rounded-2xl border-none shadow-xl bg-white/90 backdrop-blur-md">
            <CardContent className="p-3">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1 w-full text-center">
                 {viewMode === 'markers' ? 'Marker Filter' : 'Risk Legend'}
               </p>
               
               {viewMode === 'markers' ? (
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-[#10B981] rounded-full ring-2 ring-[#10B981]/20" />
                       <span className="text-[9px] font-black uppercase text-slate-600">Pure (0.8 - 1.0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-[#F5A623] rounded-full ring-2 ring-[#F5A623]/20" />
                       <span className="text-[9px] font-black uppercase text-slate-600">Borderline (0.4 - 0.8)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-[#EF4444] rounded-full ring-2 ring-[#EF4444]/20" />
                       <span className="text-[9px] font-black uppercase text-slate-600">Contaminated (&lt;0.4)</span>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-[#EF4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                       <span className="text-[9px] font-black uppercase text-slate-600">High Risk Area</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-[#F5A623] rounded-full shadow-[0_0_8px_rgba(245,166,35,0.5)]" />
                       <span className="text-[9px] font-black uppercase text-slate-600">Medium Risk Area</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                       <span className="text-[9px] font-black uppercase text-slate-600">Safe Area</span>
                    </div>
                 </div>
               )}
            </CardContent>
         </Card>
      </div>
      
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 20px !important;
          padding: 0 !important;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .grayscale {
          filter: grayscale(100%);
        }
      `}</style>
    </div>
  )
}
