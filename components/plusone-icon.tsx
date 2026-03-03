"use client"

import { motion } from "framer-motion"

const smoothSpring = { type: "spring" as const, stiffness: 180, damping: 22 }

/**
 * Animated PlusOne brand icon with multi-angle 3D reveal.
 * Sequence: outer ring scales in with rotation &#8594; inner shield swoops
 * from a tilted camera angle &#8594; the "+" snaps into place &#8594; "1" counter
 * rises from below &#8594; ambient glow pulses once.
 */
export function PlusOneIcon({ size = 96, className = "" }: { size?: number; className?: string }) {
  const r = size / 2
  const strokeW = size * 0.04
  const plusLen = size * 0.18
  const oneH = size * 0.22

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size, perspective: 600 }}
    >
      {/* ── Ambient glow backdrop ── */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.4, 1.6] }}
        transition={{ duration: 1.8, delay: 1.2, ease: "easeOut" }}
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.19 145 / 0.35) 0%, transparent 70%)",
        }}
      />

      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        fill="none"
        aria-hidden="true"
        className="relative z-10"
      >
        {/* ── Outer ring ── "camera tilt from above" */}
        <motion.circle
          cx={r}
          cy={r}
          r={r - strokeW}
          stroke="oklch(0.65 0.19 145)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          initial={{
            pathLength: 0,
            opacity: 0,
            rotate: -120,
          }}
          animate={{
            pathLength: 1,
            opacity: 1,
            rotate: 0,
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* ── Secondary thin ring ── different angle sweep */}
        <motion.circle
          cx={r}
          cy={r}
          r={r - strokeW * 3.5}
          stroke="oklch(0.6 0.16 250 / 0.35)"
          strokeWidth={strokeW * 0.5}
          strokeLinecap="round"
          strokeDasharray="3 6"
          initial={{ pathLength: 0, opacity: 0, rotate: 90 }}
          animate={{ pathLength: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* ── Inner shield hexagon ── swoops in from 3D tilt */}
        <motion.g
          initial={{ opacity: 0, scale: 0.3, rotateX: 60, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
          transition={{ ...smoothSpring, delay: 0.4 }}
          style={{ originX: `${r}px`, originY: `${r}px` }}
        >
          <motion.path
            d={createHexPath(r, r, size * 0.28)}
            fill="oklch(0.65 0.19 145 / 0.08)"
            stroke="oklch(0.65 0.19 145 / 0.4)"
            strokeWidth={strokeW * 0.7}
            strokeLinejoin="round"
          />
        </motion.g>

        {/* ── The "+" symbol ── snaps from above (top-down camera angle) */}
        <motion.g
          initial={{ opacity: 0, y: -size * 0.15, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...smoothSpring, delay: 0.65, stiffness: 280, damping: 18 }}
        >
          {/* Horizontal bar */}
          <motion.line
            x1={r - plusLen}
            y1={r - size * 0.08}
            x2={r + plusLen}
            y2={r - size * 0.08}
            stroke="oklch(0.95 0 0)"
            strokeWidth={strokeW * 1.4}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.75, ease: "easeOut" }}
          />
          {/* Vertical bar */}
          <motion.line
            x1={r}
            y1={r - size * 0.08 - plusLen}
            x2={r}
            y2={r - size * 0.08 + plusLen}
            stroke="oklch(0.95 0 0)"
            strokeWidth={strokeW * 1.4}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.85, ease: "easeOut" }}
          />
        </motion.g>

        {/* ── The "1" digit ── rises from the bottom (low camera, looking up) */}
        <motion.text
          x={r}
          y={r + size * 0.2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="oklch(0.65 0.19 145)"
          fontSize={oneH}
          fontWeight={800}
          fontFamily="var(--font-mono), monospace"
          initial={{ opacity: 0, y: r + size * 0.35 }}
          animate={{ opacity: 1, y: r + size * 0.2 }}
          transition={{ ...smoothSpring, delay: 0.95, stiffness: 220, damping: 20 }}
        >
          1
        </motion.text>

        {/* ── Sparkle dots at compass points ── staggered pop */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const dist = r - strokeW * 1.5
          const cx = r + Math.cos(rad) * dist
          const cy = r + Math.sin(rad) * dist
          return (
            <motion.circle
              key={angle}
              cx={cx}
              cy={cy}
              r={strokeW * 0.8}
              fill="oklch(0.65 0.19 145)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.7], scale: [0, 1.6, 1] }}
              transition={{ duration: 0.5, delay: 1.1 + i * 0.08, ease: "easeOut" }}
            />
          )
        })}
      </svg>

      {/* ── Continuous subtle rotation on the outer glow ── */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          background: "conic-gradient(from 0deg, oklch(0.65 0.19 145 / 0.06), transparent 25%, oklch(0.6 0.16 250 / 0.06), transparent 50%, oklch(0.65 0.19 145 / 0.06), transparent 75%, oklch(0.6 0.16 250 / 0.06), transparent)",
        }}
      />
    </motion.div>
  )
}

/** Creates a regular hexagon path */
function createHexPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  })
  return `M${pts.join("L")}Z`
}

/**
 * Full-screen splash overlay that plays the PlusOne icon animation
 * then dissolves to reveal the page content underneath.
 */
export function PlusOneSplash({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.2, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      {/* Subtle grid behind the icon */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="flex flex-col items-center gap-6">
        <PlusOneIcon size={128} />

        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothSpring, delay: 1.3 }}
        >
          <span className="text-xl font-bold tracking-tight text-foreground">
            PlusOne Analytics
          </span>
          <motion.span
            className="text-sm font-semibold italic text-primary/80 tracking-wide"
            initial={{ opacity: 0, letterSpacing: "0.3em", y: 6 }}
            animate={{ opacity: 1, letterSpacing: "0.05em", y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
          >
            {"Impossible, It's Possible"}
          </motion.span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="h-0.5 rounded-full bg-primary/20 overflow-hidden"
          style={{ width: 120 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
