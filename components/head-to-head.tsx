"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crosshair, ShieldAlert, Loader2 } from "lucide-react"
import { getH2H } from "@/lib/api"
import { fadeUp, fadeInScale, staggerContainer, smoothSpring, gentleSpring, cardHover } from "@/lib/animations"

interface HeadToHeadProps {
    splitView: "overall" | "home" | "away"
    homeTeam: string
    awayTeam: string
}

export function HeadToHead({ splitView, homeTeam, awayTeam }: HeadToHeadProps) {
    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!homeTeam || !awayTeam) return

        setLoading(true)
        getH2H(homeTeam, awayTeam)
            .then((res) => {
                if (res && res.data && Array.isArray(res.data)) {
                    const parsedMatches = res.data.map((m: any) => ({
                        date: m.date || 'Unknown',
                        home: m.home_team || homeTeam,
                        away: m.away_team || awayTeam,
                        homeScore: m.home_score ?? null,
                        awayScore: m.away_score ?? null
                    }))
                    setMatches(parsedMatches)
                }
            })
            .catch((err) => console.error("Failed to fetch H2H:", err))
            .finally(() => setLoading(false))
    }, [homeTeam, awayTeam])

    const displayMatches = splitView === "overall"
        ? matches
        : splitView === "home"
            ? matches.filter(m => m.home === homeTeam)
            : matches.filter(m => m.home === awayTeam)

    return (
        <motion.div
            variants={fadeInScale}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ...smoothSpring, delay: 0.1 }}
            className="rounded-lg border border-border bg-card p-4 shadow-sm h-full ambient-glow"
        >
            <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...gentleSpring, delay: 0.15 }}
                className="mb-4 flex items-center justify-between"
            >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Crosshair className="h-5 w-5 text-primary" />
                    Head-to-Head <span className="text-sm font-normal text-muted-foreground">({splitView.toUpperCase()})</span>
                </h3>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`h2h-content-${splitView}-${loading}`}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col gap-4"
                >
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={smoothSpring}
                            className="flex flex-col items-center justify-center py-8 text-center border bg-card rounded-md border-border/50 shadow-sm mt-4"
                        >
                            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2 opacity-70" />
                            <p className="text-sm text-muted-foreground font-medium">Loading historical matchups...</p>
                        </motion.div>
                    ) : displayMatches.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={gentleSpring}
                            className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 border border-border/50 rounded-md border-dashed"
                        >
                            <ShieldAlert className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">No matches found for this view.</p>
                        </motion.div>
                    ) : (
                        displayMatches.map((match, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                transition={{ ...smoothSpring, delay: idx * 0.06 }}
                                whileHover={{ scale: 1.02, y: -2, borderColor: "oklch(0.65 0.19 145 / 0.5)" }}
                                whileTap={{ scale: 0.99 }}
                                className="flex items-center gap-4 bg-background border border-border/50 p-4 rounded-md shadow-sm transition-colors cursor-default"
                            >
                                <div className="flex flex-col flex-1">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 + idx * 0.05 }}
                                        className="text-sm font-mono text-muted-foreground mb-2"
                                    >
                                        {match.date}
                                    </motion.p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-base font-semibold ${match.homeScore > match.awayScore ? 'text-primary' : 'text-foreground'}`}>
                                            {match.home}
                                        </span>
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ ...smoothSpring, delay: 0.4 + idx * 0.08 }}
                                            className={`text-xl font-bold font-mono ${match.homeScore > match.awayScore ? 'text-primary' : 'text-muted-foreground'}`}
                                        >
                                            {match.homeScore}
                                        </motion.span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className={`text-base ${match.awayScore > match.homeScore ? 'text-primary' : 'text-foreground'}`}>
                                            {match.away}
                                        </span>
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ ...smoothSpring, delay: 0.45 + idx * 0.08 }}
                                            className={`text-xl font-bold font-mono ${match.awayScore > match.homeScore ? 'text-primary' : 'text-muted-foreground'}`}
                                        >
                                            {match.awayScore}
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}
