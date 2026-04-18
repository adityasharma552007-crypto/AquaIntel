import { generateWavelengths, pickProfile } from "./wavegen"
import { createClient } from "@/lib/supabase/client"
import { recordScanOnBlockchain } from "@/lib/blockchain.service"

export interface ScanRequest {
  userId: string
  locationName?: string
}

export interface ScanResponse {
  success: boolean
  scanId: string
  safetyScore: number
  resultTier: "safe" | "warning" | "danger" | "hazard"
  aiConfidence: number
  scanDuration: number
  adulterants: AdulterantResult[]
  wavelengthAnalysis: WavelengthReading[]
  recommendation: string
  autoReported: boolean
  locationName?: string | null
  error?: string
}

export interface AdulterantResult {
  name: string
  detected: boolean
  detectedValue: number
  safeLimit: number
  unit: string
  status: "safe" | "warning" | "danger" | "hazard" | "clear"
  quantity500ml: number
  analogy: string
}

export interface WavelengthReading {
  channel: number
  wavelength: number
  reading: number
  baseline: number
  deviationPct: number
  status: "normal" | "elevated" | "anomaly"
}

// ─── Step 1: Run the NIR analysis (calls Edge Function, saves to Supabase) ─────
export async function runScan(request: ScanRequest): Promise<ScanResponse> {
  const profile     = pickProfile()
  const wavelengths = generateWavelengths(profile)

  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/analyze-water`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({
        wavelengths,
        userId:   request.userId,
        locationName: request.locationName ?? null
      })
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error ?? "Scan failed")
  }

  return res.json()
}

// ─── Step 2: Record result on blockchain & persist txHash to Supabase ──────────
export async function recordScanOnChain(
  scanId: string,
  locationName: string | null,
  safetyScore: number,
  resultTier: "safe" | "warning" | "danger" | "hazard"
): Promise<string | null> {
  try {
    const supabase = createClient()

    const resultStatus = resultTier === "safe" ? "PASS" : "FAIL"

    const txHash = await recordScanOnBlockchain(
      null,
      locationName,
      locationName,
      safetyScore,
      resultStatus
    )

    if (txHash) {
      const { error } = await supabase
        .from("water_data")
        .update({ tx_hash: txHash })
        .eq("id", scanId)

      if (error) {
        console.error("[AquaIntel Blockchain] Failed to persist tx_hash:", error)
        return null
      }
    }

    return txHash
  } catch (err) {
    console.error("[AquaIntel Blockchain] recordScanOnChain error:", err)
    return null
  }
}
