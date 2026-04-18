import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createBrowserClient } from '@/lib/supabase/server'

// Service-role client bypasses PostgREST schema cache restrictions
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !key) throw new Error('Missing Supabase service role env vars')
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    // Verify the user is authenticated
    const browserSupabase = createBrowserClient()
    const { data: { user } } = await browserSupabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      safetyScore, resultTier, aiConfidence, scanDuration,
      wavelengthAnalysis, baselineData, recommendation, adulterants
    } = body

    const supabase = getServiceClient()

    // Insert scan row using service role (no schema cache issues)
    const { data: scan, error: scanErr } = await supabase
      .from('water_data')
      .insert({
        user_id:         user.id,
        safety_score:    safetyScore,
        quality:         safetyScore / 100, // Sync the quality metric for frontend compatibility
        result_tier:     resultTier,
        status:          recommendation.split('.')[0] || 'Processed', // Give it a basic status
        ai_confidence:   aiConfidence,
        scan_duration:   scanDuration,
        wavelength_data: wavelengthAnalysis,
        adulterants:     adulterants?.length ? adulterants : null,
        recommendation:  recommendation
      })
      .select()
      .single()

    if (scanErr || !scan) {
      return NextResponse.json({ error: scanErr?.message ?? 'Insert failed' }, { status: 400 })
    }

    // Update user scan stats
    await supabase.rpc('increment_user_scans', {
      p_user_id: user.id,
      p_is_safe: safetyScore >= 85,
    })

    return NextResponse.json({ scanId: scan.id })
  } catch (err: any) {
    console.error('[prototype-scan API]', err)
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 })
  }
}
