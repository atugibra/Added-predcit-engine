"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Trophy, Calendar, Users, Activity, BarChart3, Database, Swords, Medal } from "lucide-react"
import { PlusOneIcon } from "@/components/plusone-icon"
import { fadeDown, slideInLeft, smoothSpring, gentleSpring } from "@/lib/animations"

export function Header() {
  const pathname = usePathname()

  const tabs = [
    { name: "Leagues", href: "/leagues", icon: Trophy },
    { name: "Fixtures", href: "/fixtures", icon: Calendar },
    { name: "Standings", href: "/", icon: Medal },
    { name: "Squad Stats", href: "/squads", icon: Users },
    { name: "Players", href: "/players", icon: Activity },
    { name: "Predictions", href: "/predictions", icon: BarChart3 },
    { name: "Head to Head", href: "/h2h", icon: Swords },
    { name: "Sync / Data", href: "/admin/sync", icon: Database },
  ]

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...smoothSpring, delay: 0.05 }}
      className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50"
    >
      <div className="mx-auto max-w-5xl px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={smoothSpring}
              >
                <PlusOneIcon size={40} />
              </motion.div>
              <motion.span
                variants={slideInLeft}
                initial="hidden"
                animate="visible"
                transition={{ ...gentleSpring, delay: 0.2 }}
                className="text-xl font-bold tracking-tight text-foreground hidden sm:block"
              >
                Football Analytics
              </motion.span>
            </Link>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...gentleSpring, delay: 0.35 }}
              className="hidden lg:flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 animate-glow-pulse"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs font-medium text-success">LIVE DATA</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smoothSpring, delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={smoothSpring}>
              <Link
                href="/pricing"
                className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm"
              >
                Upgrade to Premium
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Horizontal Scrollable Sub-Navigation */}
        <div className="flex overflow-x-auto py-2 -mx-4 px-4 lg:-mx-6 lg:px-6 scrollbar-thin">
          <nav className="flex items-center gap-2 min-w-max" role="navigation" aria-label="Main navigation">
            {tabs.map((tab, idx) => {
              const isActive = pathname === tab.href
              return (
                <motion.div
                  key={tab.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...gentleSpring, delay: 0.15 + idx * 0.04 }}
                >
                  <Link
                    href={tab.href}
                    className={`relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                        ? "text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md bg-primary"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <tab.icon className="h-4 w-4" />
                    {tab.name}
                  </Link>
                </motion.div>
              )
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
