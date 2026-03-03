"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Target, TrendingUp, Award, Percent } from "lucide-react"
import { staggerContainer, fadeUp, smoothSpring, cardHover } from "@/lib/animations"

const stats = [
  {
    label: "Model Accuracy",
    value: 76.4,
    suffix: "%",
    change: "+2.1%",
    trend: "up",
    icon: Target,
    description: "Season ATS",
  },
  {
    label: "Win Rate",
    value: 73.8,
    suffix: "%",
    change: "+1.4%",
    trend: "up",
    icon: TrendingUp,
    description: "Straight Up",
  },
  {
    label: "Total Predictions",
    value: 268,
    suffix: "",
    change: "16 this week",
    trend: "up",
    icon: Award,
    description: "Season Total",
  },
  {
    label: "Avg. Confidence",
    value: 71.2,
    suffix: "%",
    change: "-0.8%",
    trend: "down",
    icon: Percent,
    description: "Per Prediction",
  },
]

function AnimatedCounter({ value, suffix, decimals = 1 }: { value: number; suffix: string; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  useEffect(() => {
    if (!isInView) return

    const duration = 1200
    const startTime = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(eased * value)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, value])

  const formatted = suffix === "%" || decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toString()

  return (
    <span ref={ref} className="text-2xl font-bold tracking-tight text-foreground font-mono tabular-nums">
      {formatted}{suffix}
    </span>
  )
}

export function StatsOverview() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          variants={fadeUp}
          transition={{ ...smoothSpring, delay: idx * 0.06 }}
          whileHover="hover"
          whileTap="tap"
          initial="rest"
          animate="rest"
          className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 ambient-glow cursor-default"
        >
          <div className="flex items-start justify-between">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={smoothSpring}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
            >
              <stat.icon className="h-4 w-4" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...smoothSpring, delay: 0.3 + idx * 0.08 }}
              className={`inline-flex items-center rounded-full px-2 py-1 text-sm font-medium ${stat.trend === "up"
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
                }`}
            >
              {stat.change}
            </motion.span>
          </div>
          <div className="mt-4">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              decimals={stat.suffix === "%" ? 1 : 0}
            />
            <p className="mt-2 text-base text-muted-foreground">{stat.label}</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground/70">{stat.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
