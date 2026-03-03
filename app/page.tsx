"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { StatsOverview } from "@/components/stats-overview"
import { StandingsTable } from "@/components/standings-table"
import { HeadToHead } from "@/components/head-to-head"
import { fadeUp, fadeIn, smoothSpring, gentleSpring, pageTransition, pageTransitionConfig } from "@/lib/animations"

export default function Home() {
  const [splitView, setSplitView] = useState<"overall" | "home" | "away">("overall")

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransitionConfig}
      className="min-h-screen bg-background bg-fixed bg-gradient-to-b from-background via-background/95 to-muted/20"
    >
      <Header />

      <main className="mx-auto max-w-5xl p-4 lg:p-6">
        {/* Stats Overview */}
        <section aria-label="Season statistics overview" className="mb-6">
          <StatsOverview />
        </section>

        {/* Global Split View Toggle (Home/Away/Overall) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ ...smoothSpring, delay: 0.2 }}
          className="mb-6 flex items-center justify-center"
        >
          <div className="inline-flex items-center rounded-lg border border-border bg-card p-2 shadow-sm">
            {["overall", "home", "away"].map((view) => (
              <button
                key={view}
                onClick={() => setSplitView(view as "overall" | "home" | "away")}
                className={`relative px-4 py-2 text-base font-medium rounded-md transition-colors ${splitView === view
                  ? "text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {splitView === view && (
                  <motion.span
                    layoutId="splitToggle"
                    className="absolute inset-0 rounded-md bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={{ ...gentleSpring, delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-4 lg:gap-6"
        >
          {/* Full Width Analysis Grid */}
          <section className="flex-1 w-full" aria-label="League analysis detail">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Standings Table  */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`standings-${splitView}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ ...smoothSpring }}
                  className="xl:col-span-2"
                >
                  <StandingsTable splitView={splitView} />
                </motion.div>
              </AnimatePresence>

              {/* Head To Head */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`h2h-${splitView}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ ...smoothSpring, delay: 0.1 }}
                  className="xl:col-span-1"
                >
                  <HeadToHead
                    splitView={splitView}
                    homeTeam="ARS"
                    awayTeam="MCI"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="border-t border-border mt-8"
      >
        <div className="mx-auto max-w-5xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            PlusOne Analytics — Advanced prediction engine powered by Match Data.
          </p>
          <p className="text-sm text-muted-foreground">
            For entertainment purposes only. Not financial advice.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
