"use client"

import { motion } from "framer-motion"
import { smoothSpring } from "@/lib/animations"

function ShimmerBlock({ className }: { className: string }) {
  return <div className={`rounded shimmer ${className}`} />
}

export function PredictionSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      {/* Score Hero Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...smoothSpring }}
        className="rounded-lg border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <ShimmerBlock className="h-4 w-32" />
          <ShimmerBlock className="h-6 w-28 rounded-full" />
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2 flex-1">
            <ShimmerBlock className="h-14 w-14 rounded-xl" />
            <ShimmerBlock className="h-4 w-24" />
            <ShimmerBlock className="h-3 w-12" />
          </div>
          <div className="flex items-center gap-3">
            <ShimmerBlock className="h-12 w-10" />
            <ShimmerBlock className="h-6 w-3" />
            <ShimmerBlock className="h-12 w-10" />
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <ShimmerBlock className="h-14 w-14 rounded-xl" />
            <ShimmerBlock className="h-4 w-24" />
            <ShimmerBlock className="h-3 w-12" />
          </div>
        </div>
      </motion.div>

      {/* Two-column layout skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...smoothSpring, delay: 0.1 }}
          className="xl:col-span-3 flex flex-col gap-4"
        >
          {/* Probability Gauge */}
          <div className="rounded-lg border border-border bg-card p-6">
            <ShimmerBlock className="h-4 w-32 mb-5" />
            <div className="flex flex-col items-center gap-5">
              <ShimmerBlock className="h-44 w-44 rounded-full" />
              <ShimmerBlock className="h-3 w-full rounded-full" />
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-center gap-1">
                  <ShimmerBlock className="h-3 w-16" />
                  <ShimmerBlock className="h-6 w-12" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShimmerBlock className="h-3 w-10" />
                  <ShimmerBlock className="h-6 w-12" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShimmerBlock className="h-3 w-16" />
                  <ShimmerBlock className="h-6 w-12" />
                </div>
              </div>
            </div>
          </div>
          {/* Insights skeleton */}
          <div className="rounded-lg border border-border bg-card p-6">
            <ShimmerBlock className="h-4 w-28 mb-4" />
            <div className="flex flex-col gap-2.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2.5">
                  <ShimmerBlock className="h-1.5 w-1.5 rounded-full shrink-0" />
                  <ShimmerBlock className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...smoothSpring, delay: 0.15 }}
          className="xl:col-span-2 flex flex-col gap-4"
        >
          {/* Stat Comparison */}
          <div className="rounded-lg border border-border bg-card p-6">
            <ShimmerBlock className="h-4 w-32 mb-5" />
            <div className="flex flex-col gap-3.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <ShimmerBlock className="h-3 w-8" />
                    <ShimmerBlock className="h-2.5 w-16" />
                    <ShimmerBlock className="h-3 w-8" />
                  </div>
                  <ShimmerBlock className="h-2 w-full rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
          {/* Confidence */}
          <div className="rounded-lg border border-border bg-card p-6">
            <ShimmerBlock className="h-4 w-32 mb-4" />
            <ShimmerBlock className="h-3 w-full rounded-full mb-4" />
            <ShimmerBlock className="h-16 w-full rounded-lg" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
