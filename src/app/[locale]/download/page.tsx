import type { Metadata } from 'next'
import { DownloadAPK } from '@/components/download/DownloadAPK'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquaintel.vercel.app'

export const metadata: Metadata = {
  title: 'Download AquaIntel APK | Android App',
  description: 'Download AquaIntel for Android - AI-powered water adulteration detection app. Scan water samples, get instant results, and protect your family from harmful contaminants.',
  keywords: 'aquaintel apk download, water testing app, adulteration detection android, water safety app',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Download AquaIntel APK | Android App',
    description: 'Download AquaIntel for Android - AI-powered water adulteration detection in 8 seconds',
    url: `${siteUrl}/download`,
    siteName: 'AquaIntel',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AquaIntel - AI-Powered Water Adulteration Detection',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download AquaIntel APK',
    description: 'AI-powered water adulteration detection in your pocket',
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/download`,
  },
}

export default function DownloadPage() {
  return <DownloadAPK />
}
