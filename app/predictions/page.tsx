"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { PredictionTeamSelector } from "@/components/prediction-team-selector"
import { PredictionResult } from "@/components/prediction-result"
import { PredictionSkeleton } from "@/components/prediction-skeleton"
import { generatePrediction, type PredictionResponse } from "@/lib/api"
import { BarChart3, Brain, Database, Shield, Target, TrendingUp } from "lucide-react"
import { fadeUp, fadeIn, fadeInScale, staggerContainer, smoothSpring, gentleSpring, pageTransition, pageTransitionConfig } from "@/lib/animations"

export default function PredictionsPage() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(homeTeam: string, awayTeam: string) {
    setIsLoading(true)
    setError(null)
    setPrediction(null)

    const data = await generatePrediction(homeTeam, awayTeam)

    if (!data) {
      setError("Failed to connect to the prediction engine. Please check that the API is running and try again.")
      setIsLoading(false)
      return
    }

    if (!data.success) {
      setError(data.error || "An unexpected error occurred while generating the prediction.")
      setIsLoading(false)
      return
    }

    setPrediction(data)
    setIsLoading(false)
  }

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
        {/* Page Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smoothSpring, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <BarChart3 className="h-5 w-5" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">Match Predictions</h1>
              <p className="text-sm text-muted-foreground">
                Data-driven match outcome predictions powered by squad stats and league standings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Selector */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smoothSpring, delay: 0.2 }}
          className="mb-6"
          aria-label="Team selection"
        >
          <PredictionTeamSelector onGenerate={handleGenerate} isLoading={isLoading} />
        </motion.section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={smoothSpring}
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive shrink-0">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Prediction Failed</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={smoothSpring}
              aria-label="Loading prediction"
            >
              <PredictionSkeleton />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Prediction Results */}
        <AnimatePresence mode="wait">
          {prediction && !isLoading && (
            <motion.section
              key="prediction-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ ...smoothSpring, delay: 0.1 }}
              aria-label="Prediction results"
            >
              <PredictionResult data={prediction} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!prediction && !isLoading && !error && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Getting started"
              className="mt-8"
            >
              <motion.div
                variants={fadeInScale}
                initial="hidden"
                animate="visible"
                transition={{ ...gentleSpring, delay: 0.3 }}
                className="rounded-lg border border-border bg-card p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.45 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 animate-float"
                >
                  <Brain className="h-8 w-8" />
                </motion.div>
                <h2 className="text-lg font-semibold text-foreground mb-2 text-balance">Select Teams to Get Started</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 text-pretty">
                  Choose a league and pick two teams above to generate a data-driven match prediction
                  with detailed probability analysis and stat comparisons.
                </p>

                {/* Feature cards */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
                >
                  {[
                    { icon: Target, title: "Score Prediction", desc: "Predicted match score based on historical performance data" },
                    { icon: TrendingUp, title: "Win Probability", desc: "Three-way probability gauge for home win, draw, and away win" },
                    { icon: Database, title: "Stat Comparison", desc: "Head-to-head statistical breakdown across 8 key metrics" },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      variants={fadeUp}
                      transition={{ ...smoothSpring, delay: 0.5 + idx * 0.1 }}
                      whileHover={{ scale: 1.04, y: -4 }}
                      className="rounded-lg border border-border bg-secondary/30 p-4 text-left ambient-glow cursor-default"
                    >
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        transition={smoothSpring}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3"
                      >
                        <item.icon className="h-4 w-4" />
                      </motion.div>
                      <h3 className="text-xs font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* How it works */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ ...smoothSpring, delay: 0.5 }}
                className="mt-6 rounded-lg border border-border bg-card p-6"
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">How It Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { step: "01", icon: Shield, title: "Select League", desc: "Choose from available leagues" },
                    { step: "02", icon: Shield, title: "Pick Teams", desc: "Select home and away teams" },
                    { step: "03", icon: Brain, title: "Analyze Data", desc: "Engine processes squad stats" },
                    { step: "04", icon: BarChart3, title: "Get Prediction", desc: "View scores and probabilities" },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ ...smoothSpring, delay: 0.6 + idx * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <motion.span
                        whileHover={{ scale: 1.15 }}
                        className="text-xs font-bold font-mono text-primary bg-primary/10 rounded-md px-2 py-1 shrink-0"
                      >
                        {item.step}
                      </motion.span>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
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
