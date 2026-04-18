export const dynamic = 'force-dynamic'

/**
 * GET /api/devices/my
 * Returns all iot_devices records for the authenticated user.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAndLogRateLimit, getRateLimitHeaders } from '@/lib/supabase/protectedRoute'

export async function GET() {
  // Check rate limit FIRST
  const rateLimitCheck = await checkAndLogRateLimit('/api/devices/scan')

  if (!rateLimitCheck.allowed) {
    return rateLimitCheck.response
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
        headers: getRateLimitHeaders(rateLimitCheck.limit, rateLimitCheck.remaining, rateLimitCheck.resetIn)
      }
    )
  }

  const { data, error } = await supabase
    .from('iot_devices')
    .select('*')
    .eq('user_id', user.id)
    .order('last_seen', { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: getRateLimitHeaders(rateLimitCheck.limit, rateLimitCheck.remaining, rateLimitCheck.resetIn)
      }
    )
  }

  return NextResponse.json(
    {
      devices: data ?? [],
      remaining: rateLimitCheck.remaining
    },
    {
      headers: getRateLimitHeaders(rateLimitCheck.limit, rateLimitCheck.remaining, rateLimitCheck.resetIn)
    }
  )
}
