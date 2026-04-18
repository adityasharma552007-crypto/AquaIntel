/**
 * Bottom Navigation Component
 *
 * Primary navigation for mobile-first experience.
 * Uses semantic HTML with proper link structure for SEO crawlability.
 * Internal linking helps search engines discover and rank all important pages.
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Scan, Map, History, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

// Navigation tabs with SEO-friendly link structure
// Each href is a crawlable internal link that helps search engine discovery
const tabs = [
  { key: 'home', href: '/home', icon: Home },
  { key: 'reports', href: '/scan', icon: Scan },
  { key: 'map', href: '/map', icon: Map },
  { key: 'dashboard', href: '/history', icon: History },
  { key: 'community', href: '/profile', icon: User }
]

export function BottomNav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-2">
      <nav className="bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-[32px] h-20 w-full max-w-[480px] flex items-center justify-around px-2 pointer-events-auto">
        {tabs.map((tab) => {
          const localizedHref = `/${locale}${tab.href}`
          const isActive = pathname === localizedHref || pathname.endsWith(tab.href)
          const Icon = tab.icon

          return (
            <Link
              key={tab.key}
              href={localizedHref}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300",
                isActive ? "text-[#60A5FA]" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-[#60A5FA]/10 scale-110" : "bg-transparent"
              )}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.06em]",
                isActive ? "opacity-100" : "opacity-40"
              )}>
                {t(tab.key)}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
