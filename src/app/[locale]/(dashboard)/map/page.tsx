export const dynamic = 'force-dynamic'

import { createClient } from "@/lib/supabase/server"
import { Search, MapPin, SlidersHorizontal, ChevronLeft } from "lucide-react"
import Link from "next/link"
import nextDynamic from "next/dynamic"

// Dynamic import for Leaflet (Client-side only)
const WaterMap = nextDynamic(() => import("@/components/WaterMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center font-black text-slate-300 uppercase tracking-widest">Loading Map...</div>
})

export default async function MapPage({ searchParams }: { searchParams: { filter?: string } }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let cityName = 'Jaipur'
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('city')
      .eq('id', user.id)
      .single()
    if (profile?.city) {
      cityName = profile.city
    }
  }
  
  // Fetch water scans with coordinates
  const { data: scans } = await supabase
    .from('water_data')
    .select('*')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  const waterScans = scans || []
  const safeCount = waterScans.filter(s => (s.quality || 0) >= 0.8).length
  const contaminatedCount = waterScans.filter(s => (s.quality || 0) < 0.4).length
  const totalSources = waterScans.length

  const safePct = totalSources > 0 ? Math.round((safeCount / totalSources) * 100) : 0
  const contamPct = totalSources > 0 ? Math.round((contaminatedCount / totalSources) * 100) : 0

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Search Header */}
      <header className="p-6 pb-4 pt-12 space-y-4 shrink-0 z-50">
        <div className="flex items-center justify-between">
          <Link href="/home" className="p-2 bg-slate-100 rounded-full">
            <ChevronLeft size={20} className="text-[#60A5FA]" />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-[#60A5FA] uppercase tracking-tighter">Water Contamination Map</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cityName} Area</p>
          </div>
          <div className="p-2 bg-slate-100 rounded-full">
             <SlidersHorizontal size={20} className="text-[#60A5FA]" />
          </div>
        </div>

        {/* Global Map Stats Top Bar */}
        <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sources</p>
                <p className="text-lg font-black text-slate-800 leading-none">{totalSources}</p>
            </div>
            <div className="bg-[#60A5FA]/10 p-3 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-widest mb-1">% Safe</p>
                <p className="text-lg font-black text-[#60A5FA] leading-none">{safePct}%</p>
            </div>
            <div className="bg-red-50 p-3 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">% Hazard</p>
                <p className="text-lg font-black text-red-500 leading-none">{contamPct}%</p>
            </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder={`Search ${cityName} area or vendor...`} 
            className="w-full h-12 bg-slate-50 border-none rounded-2xl pl-10 pr-4 text-sm font-bold focus:ring-[#60A5FA]"
          />
        </div>
      </header>

      {/* Map View */}
      <main className="flex-1 px-4 pb-24 overflow-hidden">
        <div className="w-full h-full relative">
           <WaterMap 
             scans={waterScans} 
             cityName={cityName} 
           />
        </div>
      </main>
    </div>
  )
}
