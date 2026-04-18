'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function reportWaterSource(scanId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Fetch scan details
  const { data: scan, error: scanError } = await supabase
    .from('water_data')
    .select('*')
    .eq('id', scanId)
    .single()

  if (scanError || !scan) throw new Error("Scan not found")

  // Check if already reported
  const { data: existing } = await supabase
    .from('water_authority_reports')
    .select('id')
    .eq('scan_id', scanId)
    .single()

  if (existing) return { success: true, alreadyReported: true }

  // Create report
  const { error: reportError } = await supabase
    .from('water_authority_reports')
    .insert({
      scan_id: scanId,
      user_id: user.id,
      status: 'pending',
      notes: `User reported water contamination at ${scan.location_name || 'Unknown Location'}. Quality score: ${Math.round((scan.quality || 0) * 100)}%. Status: ${scan.status}.`
    })

  if (reportError) throw new Error(reportError.message)

  revalidatePath(`/history/${scanId}`)
  return { success: true }
}
