/**
 * Page-specific Metadata Configuration
 *
 * Each page exports its own metadata that extends the root layout.
 * This file contains all metadata configurations for SEO optimization.
 *
 * TODO: Update siteUrl to your production domain
 */

import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquaintel.vercel.app'

// =============================================================================
// HOME PAGE (/)
// Primary keyword: "water adulteration detection"
// =============================================================================
export const homeMetadata: Metadata = {
  title: 'AquaIntel | AI-Powered Water Adulteration Detection System',
  description:
    'Detect water adulteration instantly with AI-powered spectral analysis. Contactless water purity testing that identifies lead, bacteria, arsenic, and 7+ adulterants in 8 seconds. FSSAI-compliant.',
  keywords: [
    'water adulteration detection',
    'water purity test',
    'water quality checker',
    'food safety AI',
    'contactless water testing',
    'FSSAI water standards',
    'spectral analysis water',
    'AI food testing',
  ].join(', '),
  openGraph: {
    title: 'AquaIntel | AI-Powered Water Adulteration Detection',
    description: 'Protect your family from adulterated water. AI-powered detection in 8 seconds.',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AquaIntel - Water Adulteration Detection System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaIntel | AI-Powered Water Adulteration Detection',
    description: 'Detect water adulteration in 8 seconds with AI-powered spectral analysis.',
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
}

// =============================================================================
// TEST PAGE (/test or /scan)
// Primary keyword: "detect water quality online"
// =============================================================================
export const testMetadata: Metadata = {
  title: 'Start Water Quality Test | Detect Adulteration Online',
  description:
    'Start your water quality test now. Our AI analyzes 18 wavelengths to detect lead, bacteria, arsenic, fluoride, and other adulterants in just 8 seconds. Completely contactless.',
  keywords: [
    'detect water quality online',
    'water test online',
    'check water purity',
    'water adulteration test',
    'online water testing',
    'AI water scanner',
    'water safety test',
  ].join(', '),
  openGraph: {
    title: 'Start Water Quality Test | Detect Adulteration',
    description: 'Test your water for adulterants in 8 seconds. No touching, no contamination.',
    url: `${siteUrl}/scan`,
    images: [
      {
        url: `${siteUrl}/og-test.png`,
        width: 1200,
        height: 630,
        alt: 'AquaIntel Test Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start Water Quality Test',
    description: 'Test your water for 7+ adulterants in 8 seconds.',
  },
  alternates: {
    canonical: `${siteUrl}/scan`,
  },
}

// =============================================================================
// RESULTS PAGE (/results or /history/[id])
// Primary keyword: "water test results analysis"
// =============================================================================
export const resultsMetadata: Metadata = {
  title: 'Water Test Results | SafetyScore Analysis & Adulteration Report',
  description:
    'View detailed water test results with SafetyScore analysis. Get instant adulteration detection results, historical trends, contaminant breakdown, and FSSAI compliance verification.',
  keywords: [
    'water test results analysis',
    'water safety score',
    'adulteration report',
    'water quality results',
    'FSSAI compliance report',
    'water test history',
  ].join(', '),
  openGraph: {
    title: 'Water Test Results | SafetyScore Analysis',
    description: 'Detailed adulteration analysis with SafetyScore and FSSAI compliance.',
    url: `${siteUrl}/history`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Water Test Results',
    description: 'View your SafetyScore and detailed adulteration analysis.',
  },
  alternates: {
    canonical: `${siteUrl}/history`,
  },
}

// =============================================================================
// ABOUT PAGE (/about)
// Primary keyword: "about AquaIntel AI"
// =============================================================================
export const aboutMetadata: Metadata = {
  title: 'About AquaIntel | AI Food Safety by Team API Avengers',
  description:
    'Learn about AquaIntel AI - India\'s trusted water adulteration detection system. Built by Team API Avengers to protect families from food adulteration using cutting-edge NIR spectral analysis and AI.',
  keywords: [
    'about AquaIntel AI',
    'Team API Avengers',
    'water safety company',
    'food safety startup India',
    'AI food testing company',
    'water adulteration solution',
  ].join(', '),
  openGraph: {
    title: 'About AquaIntel | AI Food Safety',
    description: 'Built by Team API Avengers to protect Indian families from food adulteration.',
    url: `${siteUrl}/about`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About AquaIntel',
    description: 'Learn about our mission to make water safe for every Indian family.',
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
}

// =============================================================================
// HOW IT WORKS PAGE (/how-it-works)
// Primary keyword: "how water adulteration detection works"
// =============================================================================
export const howItWorksMetadata: Metadata = {
  title: 'How AquaIntel Works | NIR Spectral Analysis & AI Detection',
  description:
    'Discover how AquaIntel uses near-infrared (NIR) spectral analysis and AI to detect water adulteration. Learn about our 18-wavelength scanning, machine learning model, and 8-second testing process.',
  keywords: [
    'how water adulteration detection works',
    'NIR spectral analysis',
    'water testing technology',
    'AI detection process',
    'spectral scanning water',
    'how AquaIntel works',
    'water purity technology',
  ].join(', '),
  openGraph: {
    title: 'How AquaIntel Works | NIR Spectral Analysis',
    description: 'Learn how our AI analyzes 18 wavelengths to detect adulterants in 8 seconds.',
    url: `${siteUrl}/how-it-works`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How AquaIntel Works',
    description: 'NIR spectral analysis meets AI for instant adulteration detection.',
  },
  alternates: {
    canonical: `${siteUrl}/how-it-works`,
  },
}

// =============================================================================
// FAQ PAGE (/faq)
// Primary keyword: "water purity test FAQ"
// =============================================================================
export const faqMetadata: Metadata = {
  title: 'FAQ | Water Purity Test Questions & Answers',
  description:
    'Find answers to common questions about water purity testing, adulteration detection, FSSAI standards, and how to use AquaIntel. Get help with hardware setup, test interpretation, and safety scores.',
  keywords: [
    'water purity test FAQ',
    'water testing questions',
    'adulteration detection help',
    'FSSAI standards FAQ',
    'AquaIntel how to use',
    'water safety questions',
    'spectral analysis FAQ',
  ].join(', '),
  openGraph: {
    title: 'FAQ | Water Purity Test Questions',
    description: 'Answers to common questions about water testing and adulteration detection.',
    url: `${siteUrl}/faq`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Water Purity Test FAQ',
    description: 'Get answers to your water testing questions.',
  },
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
}

// =============================================================================
// HISTORY PAGE (/history)
// =============================================================================
export const historyMetadata: Metadata = {
  title: 'Test History | Track Water Quality Over Time',
  description:
    'Track your water testing history with detailed records and trend analysis. Monitor vendor quality over time, download FSSAI-compliant reports, and visualize safety trends.',
  keywords: [
    'water test history',
    'water quality trends',
    'vendor quality tracking',
    'FSSAI reports',
    'water testing records',
  ].join(', '),
  openGraph: {
    title: 'Test History | Track Water Quality',
    description: 'Monitor your water vendor quality over time with detailed trend analysis.',
    url: `${siteUrl}/history`,
  },
  alternates: {
    canonical: `${siteUrl}/history`,
  },
}

// =============================================================================
// HARDWARE PAGE (/hardware)
// =============================================================================
export const hardwareMetadata: Metadata = {
  title: 'Connect Hardware | AquaIntel Pod Setup',
  description:
    'Connect your AquaIntel Pod device for contactless water testing. Setup guide, device pairing, troubleshooting, and firmware updates for your spectral analysis hardware.',
  keywords: [
    'AquaIntel Pod setup',
    'connect water scanner',
    'spectral device pairing',
    'hardware setup',
    'water testing device',
  ].join(', '),
  openGraph: {
    title: 'Connect Hardware | AquaIntel Pod',
    description: 'Set up your AquaIntel Pod for contactless water adulteration detection.',
    url: `${siteUrl}/hardware`,
  },
  alternates: {
    canonical: `${siteUrl}/hardware`,
  },
}

// =============================================================================
// LEARN PAGE (/learn)
// =============================================================================
export const learnMetadata: Metadata = {
  title: 'Learn | Water Safety Education & Resources',
  description:
    'Educational resources about water safety, adulteration types, health impacts, and FSSAI regulations. Learn about common adulterants and how to protect your family.',
  keywords: [
    'water safety education',
    'adulteration types',
    'FSSAI regulations',
    'water health impacts',
    'food safety resources',
  ].join(', '),
  openGraph: {
    title: 'Learn | Water Safety Education',
    description: 'Educational resources about water adulteration and food safety.',
    url: `${siteUrl}/learn`,
  },
  alternates: {
    canonical: `${siteUrl}/learn`,
  },
}

// =============================================================================
// MAP PAGE (/map)
// =============================================================================
export const mapMetadata: Metadata = {
  title: 'Vendor Map | Find Safe Water Suppliers Near You',
  description:
    'Interactive map of water vendors with safety ratings. Find trusted water suppliers in your area based on community testing data and safety scores.',
  keywords: [
    'water vendor map',
    'safe water suppliers',
    'water safety ratings',
    'trusted water vendors',
    'community water testing',
  ].join(', '),
  openGraph: {
    title: 'Vendor Map | Find Safe Water',
    description: 'Find trusted water vendors in your area with community safety ratings.',
    url: `${siteUrl}/map`,
  },
  alternates: {
    canonical: `${siteUrl}/map`,
  },
}

// =============================================================================
// CHAT PAGE (/chat)
// =============================================================================
export const chatMetadata: Metadata = {
  title: 'AI Chat Assistant | Water Safety Questions',
  description:
    'Chat with our AI assistant about water safety, adulteration detection, test results interpretation, and FSSAI standards. Get instant answers to your food safety questions.',
  keywords: [
    'water safety chat',
    'AI food assistant',
    'adulteration help',
    'water testing support',
    'FSSAI questions',
  ].join(', '),
  openGraph: {
    title: 'AI Chat Assistant',
    description: 'Get instant answers about water safety and adulteration detection.',
    url: `${siteUrl}/chat`,
  },
  alternates: {
    canonical: `${siteUrl}/chat`,
  },
}

// =============================================================================
// PROFILE PAGE (/profile)
// =============================================================================
export const profileMetadata: Metadata = {
  title: 'Profile | Account Settings',
  description:
    'Manage your AquaIntel account settings, view testing statistics, customize notifications, and update your food safety preferences.',
  keywords: [
    'AquaIntel profile',
    'account settings',
    'testing statistics',
    'user preferences',
  ].join(', '),
  openGraph: {
    title: 'Profile | Account Settings',
    description: 'Manage your AquaIntel account and preferences.',
    url: `${siteUrl}/profile`,
  },
  alternates: {
    canonical: `${siteUrl}/profile`,
  },
}

// =============================================================================
// AUTH PAGES
// =============================================================================
export const loginMetadata: Metadata = {
  title: 'Sign In | AquaIntel',
  description: 'Sign in to access your water testing history, saved vendors, and personalized dashboard.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${siteUrl}/auth/login`,
  },
}

export const signupMetadata: Metadata = {
  title: 'Create Account | AquaIntel',
  description: 'Create a free AquaIntel account to start testing water for adulteration and protect your family.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${siteUrl}/auth/signup`,
  },
}
