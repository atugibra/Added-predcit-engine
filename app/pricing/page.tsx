"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { fadeUp, fadeInScale, staggerContainer, smoothSpring, gentleSpring, pageTransition, pageTransitionConfig } from "@/lib/animations"

export default function PricingPage() {
  const handleSubscribe = async () => {
    alert("Stripe Checkout Session Initiated (Mock)")
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransitionConfig}
      className="mx-auto max-w-5xl px-4 py-12 lg:px-8"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ ...smoothSpring, delay: 0.1 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
          Upgrade your Analytics Game
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...gentleSpring, delay: 0.25 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Unlock the full power of the Football Intelligence Predictor
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto"
      >
        {/* Free Tier */}
        <motion.div
          variants={fadeUp}
          transition={{ ...smoothSpring, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -6 }}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm ambient-glow"
        >
          <h2 className="text-2xl font-bold text-foreground">Base Analyst</h2>
          <p className="mt-4 text-sm text-muted-foreground">Perfect for casual fans tracking team progress.</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...smoothSpring, delay: 0.4 }}
            className="mt-6 flex items-baseline gap-x-2"
          >
            <span className="text-4xl font-bold tracking-tight text-foreground">$0</span>
            <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
          </motion.div>

          <ul className="mt-8 flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
            {[
              { included: true, text: "Live Standings (Home/Away Splits)" },
              { included: true, text: "Match Fixtures" },
              { included: true, text: "Global League Overview" },
              { included: false, text: "Advanced AI Predictions" },
              { included: false, text: "Deep Head-to-Head Analytics" },
            ].map((feature, idx) => (
              <motion.li
                key={feature.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...smoothSpring, delay: 0.45 + idx * 0.06 }}
                className="flex gap-x-3"
              >
                {feature.included
                  ? <Check className="h-6 w-5 flex-none text-primary" />
                  : <X className="h-6 w-5 flex-none text-muted-foreground/50" />
                }
                {feature.text}
              </motion.li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={smoothSpring}
            className="mt-8 block w-full rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Current Plan
          </motion.button>
        </motion.div>

        {/* Premium Tier */}
        <motion.div
          variants={fadeUp}
          transition={{ ...smoothSpring, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -6 }}
          className="rounded-2xl border-2 border-primary bg-card p-8 shadow-xl relative ambient-glow animate-glow-pulse"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
            className="absolute -top-4 right-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
          >
            Most Popular
          </motion.div>
          <h2 className="text-2xl font-bold text-primary">Pro Predictor</h2>
          <p className="mt-4 text-sm text-muted-foreground">Serious tools for data-driven football analysis.</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...smoothSpring, delay: 0.45 }}
            className="mt-6 flex items-baseline gap-x-2"
          >
            <span className="text-4xl font-bold tracking-tight text-foreground">$19.99</span>
            <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
          </motion.div>

          <ul className="mt-8 flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
            {[
              "Everything in Base",
              "Full API Database Syncing Access",
              "Advanced AI Predictions (All Leagues)",
              "Deep Head-to-Head Analytics",
              "Probability Gauges & Value Bets",
            ].map((feature, idx) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...smoothSpring, delay: 0.5 + idx * 0.06 }}
                className="flex gap-x-3"
              >
                <Check className="h-6 w-5 flex-none text-primary" />
                {feature}
              </motion.li>
            ))}
          </ul>

          <motion.button
            onClick={handleSubscribe}
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px 4px oklch(0.65 0.19 145 / 0.2)" }}
            whileTap={{ scale: 0.97 }}
            transition={smoothSpring}
            className="mt-8 block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Upgrade via Stripe
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
