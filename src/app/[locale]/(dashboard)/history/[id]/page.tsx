export const dynamic = 'force-dynamic'

import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { 
  Shield, 
  AlertCircle, 
  AlertTriangle, 
  ChevronLeft, 
  Info, 
  FileText, 
  Share2,
  ChevronDown,
  Building2,
  Calendar,
  Activity,
  Blocks
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import SpectralChart from "@/components/SpectralChart"
import WaterReportModal from "@/components/WaterReportModal"
import ReportButton from "@/components/ReportButton"

import ExplainWithAI from "@/components/ExplainWithAI"
import BlockchainDetails from "@/components/BlockchainDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function ScanResultPage({ 
  params,
  searchParams 
}: { 
  params: { id: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  const { data: scan } = await supabase
    .from('water_data')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!scan) notFound()

  // mock backwards compatibility mapping
  const vendorTrust = null
  const safety_score = scan.safety_score ?? Math.round((scan.quality || 0) * 100)
  let result_tier = 'danger'
  if (safety_score >= 80) result_tier = 'safe'
  else if (safety_score >= 50) result_tier = 'warning'

  const tierColors = {
    safe: "bg-[#60A5FA] text-white",
    warning: "bg-amber-500 text-white",
    danger: "bg-red-500 text-white",
    hazard: "bg-black text-rose-500"
  }

  const tierIcons = {
    safe: Shield,
    warning: AlertTriangle,
    danger: AlertCircle,
    hazard: AlertCircle
  }

  const StatusIcon = tierIcons[result_tier as keyof typeof tierIcons];

  const getCodStatus = (cod: number) => {
    if (cod < 10) return { label: 'Excellent', emoji: '✅', color: 'text-emerald-600', bg: 'bg-emerald-100' }
    if (cod <= 20) return { label: 'Good', emoji: '🟡', color: 'text-lime-600', bg: 'bg-lime-100' }
    if (cod <= 50) return { label: 'Moderate', emoji: '🟠', color: 'text-amber-600', bg: 'bg-amber-100' }
    if (cod <= 200) return { label: 'Poor', emoji: '🔴', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { label: 'Critical', emoji: '⛔', color: 'text-red-700', bg: 'bg-red-100' }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9F8]">
      {/* Top Banner */}
      <div className={cn("p-6 pt-12 text-center relative overflow-hidden", tierColors[result_tier as keyof typeof tierColors])}>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <Link href="/home" className="p-2 bg-white/10 rounded-full">
              <ChevronLeft size={20} />
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Scan Report</p>
            <div className="p-2 bg-white/10 rounded-full">
               <Share2 size={16} />
            </div>
          </div>

          <div className="mb-4 inline-flex flex-col items-center">
             <div className="text-7xl font-black tracking-tighter leading-none mb-1">{safety_score}%</div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Water Purity Score</p>
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">
            {result_tier === 'safe' ? 'WATER IS SAFE' : 'CONTAMINATION DETECTED'}
          </h1>
          <p className="text-xs font-medium opacity-80 max-w-[280px] mx-auto leading-relaxed">
            {scan.status || (result_tier === 'safe' ? 'Safe to consume. No adulterants detected.' : 'Please avoid this water source.')}
          </p>
        </div>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
      </div>

      <main className="p-4 -mt-4 relative z-20 space-y-4 pb-12">
        {/* Info Card */}
        <Card className="rounded-3xl border-none shadow-lg">
          <CardContent className="p-5">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Building2 size={20} className="text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Source Location</p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800 leading-none">{scan.location_name || 'Unlisted Water Sample'}</p>
                      {vendorTrust && (
                        <Badge className={cn("text-[8px] h-4 uppercase font-black px-1.5", vendorTrust.bg, vendorTrust.color)}>
                          {vendorTrust.label}
                        </Badge>
                      )}
                    </div>
                 </div>
               </div>
               <div className="text-right shrink-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Confidence</p>
                  <Badge variant="secondary" className="bg-blue-50 text-[#60A5FA] border-none font-black">{scan.ai_confidence}%</Badge>
               </div>
             </div>
             <>
             </>
          </CardContent>
        </Card>

        {/* Blockchain Details Card */}
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Blocks size={14} className="text-[#8247E5]" />
              Blockchain Record
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            <BlockchainDetails txHash={scan.tx_hash ?? null} />
          </CardContent>
        </Card>

        {/* Spectral Chart */}
        <Card className="rounded-3xl border-none shadow-lg overflow-hidden">
          <CardHeader className="p-5 pb-0">
             <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Activity size={14} className="text-[#60A5FA]" />
               Spectral Fingerprint
             </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
             {(() => {
               // Prefer pre-simulated full wavelength data if it was saved by Prototype
               let chartData = scan.wavelength_data;
               
               // Fallback: build a graph from raw hardware channels if f1 is available
               if (!chartData && scan.f1) {
                 chartData = [
                   { wavelength: 410, reading: scan.f1, baseline: 0.81 },
                   { wavelength: 460, reading: scan.f2, baseline: 0.80 },
                   { wavelength: 510, reading: scan.f3, baseline: 0.75 },
                   { wavelength: 560, reading: scan.f4, baseline: 0.68 },
                   { wavelength: 610, reading: scan.f5, baseline: 0.61 },
                   { wavelength: 680, reading: scan.f6 || 0.4, baseline: 0.41 },
                 ];
               }

               if (!chartData) {
                 return (
                   <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                     <p className="text-3xl mb-2">📡</p>
                     <p className="font-bold text-slate-600">No Spectral Data</p>
                     <p className="text-xs mt-1 text-slate-400">Wait for direct hardware analysis.</p>
                   </div>
                 );
               }

               return <SpectralChart data={chartData} />;
             })()}
             <div className="mt-4 p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                <Info size={16} className="text-slate-400 shrink-0" />
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  Our sensors analyzed 18 spectral channels. Spikes in the chart indicate deviations from the pure water baseline.
                </p>
             </div>
          </CardContent>
        </Card>

        {/* Adulterant Breakdown / Hardware Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Detailed Findings</h3>
            <Card className="rounded-2xl border-none shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📡</div>
                  <div>
                    <p className="font-bold text-slate-800">IoT Water Sensor</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Direct Hardware Analysis</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Water Quality</p>
                    <p className="text-2xl font-black text-slate-800">{(scan.quality ?? (scan.safety_score ? scan.safety_score / 100 : 0)).toFixed(3)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold text-slate-800">{scan.status || 'N/A'}</p>
                    <p className="text-[10px] text-slate-400">From scanner</p>
                  </div>
                </div>
                {scan.cod_estimate != null && (
                  <div className="mt-3 bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Activity size={10} className="text-slate-400" />
                        Chemical Oxygen Demand (COD)
                      </p>
                      <p className="text-2xl font-black text-slate-800">
                        {scan.cod_estimate.toFixed(1)} <span className="text-xs font-bold text-slate-400">mg/L</span>
                      </p>
                    </div>
                    <div className={cn(
                      "px-3 py-1.5 rounded-full flex items-center gap-1 border",
                      getCodStatus(scan.cod_estimate).bg,
                      getCodStatus(scan.cod_estimate).color,
                      "border-current/20"
                    )}>
                      <span className="text-sm">{getCodStatus(scan.cod_estimate).emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{getCodStatus(scan.cod_estimate).label}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>

        {/* FSSAI Notice & Report Generator */}
        <div className="space-y-3">
          <WaterReportModal scan={scan} />
          <Button variant="ghost" className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest print:hidden">
           Terms of Service & Regulatory Basis
          </Button>
        </div>
      </main>
    </div>
  )
}
