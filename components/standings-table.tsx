"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"
import { getStandings } from "@/lib/api"
import { fadeUp, fadeInScale, staggerContainer, tableRowVariant, smoothSpring, gentleSpring } from "@/lib/animations"

interface StandingsTableProps {
    splitView: "overall" | "home" | "away"
}

export function StandingsTable({ splitView }: StandingsTableProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getStandings().then((res) => {
            if (res && res.data) {
                const mappedData = res.data.map((d: any) => ({
                    rank: d.rank || 0,
                    team: d.team || 'Unknown',
                    played: splitView === "overall" ? d.matches_played : splitView === "home" ? d.home_played : d.away_played,
                    won: splitView === "overall" ? d.wins : splitView === "home" ? d.home_wins : d.away_wins,
                    drawn: splitView === "overall" ? d.draws : splitView === "home" ? d.home_draws : d.away_draws,
                    lost: splitView === "overall" ? d.losses : splitView === "home" ? d.home_losses : d.away_losses,
                    points: splitView === "overall" ? d.points : splitView === "home" ? d.home_points : d.away_points,
                    form: d.form ? d.form.split('').slice(0, 5) : []
                }))
                mappedData.sort((a: any, b: any) => b.points - a.points)
                mappedData.forEach((d: any, i: number) => d.rank = i + 1)
                setData(mappedData)
            }
        }).catch(err => {
            console.error("Failed to fetch standings:", err)
        }).finally(() => {
            setLoading(false)
        })
    }, [splitView])

    const renderFormIcon = (result: string) => {
        switch (result) {
            case "W": return <TrendingUp className="h-4 w-4 text-success" />
            case "L": return <TrendingDown className="h-4 w-4 text-destructive" />
            default: return <Minus className="h-4 w-4 text-muted-foreground" />
        }
    }

    return (
        <motion.div
            variants={fadeInScale}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={smoothSpring}
            className="rounded-lg border border-border bg-card p-4 shadow-sm ambient-glow"
        >
            <div className="mb-4 flex items-center justify-between">
                <motion.h3
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...gentleSpring, delay: 0.1 }}
                    className="text-lg font-semibold flex items-center gap-2"
                >
                    <Trophy className="h-5 w-5 text-primary" />
                    League Standings <span className="text-sm font-normal text-muted-foreground">({splitView.toUpperCase()})</span>
                </motion.h3>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-border bg-muted/50">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">#</th>
                            <th className="p-4 font-medium text-muted-foreground w-full">Club</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">MP</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">W</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">D</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">L</th>
                            <th className="p-4 font-medium text-foreground text-center font-bold">Pts</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Form</th>
                        </tr>
                    </thead>
                    <AnimatePresence mode="wait">
                        <motion.tbody
                            key={`tbody-${splitView}`}
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="relative"
                        >
                            {loading && (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-muted-foreground">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center gap-2"
                                        >
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span>Loading live standings...</span>
                                        </motion.div>
                                    </td>
                                </tr>
                            )}
                            {!loading && data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-muted-foreground font-medium">
                                        No data available. Try Syncing from the Admin panel.
                                    </td>
                                </tr>
                            )}
                            {!loading && data.map((row, idx) => (
                                <motion.tr
                                    key={row.team}
                                    variants={tableRowVariant}
                                    transition={{ ...smoothSpring, delay: idx * 0.03 }}
                                    whileHover={{
                                        backgroundColor: "oklch(0.19 0.008 260 / 0.5)",
                                        transition: { duration: 0.15 }
                                    }}
                                    className={`border-b border-border/50 transition-colors ${idx < 4 ? 'bg-primary/5' : ''}`}
                                >
                                    <td className="p-4 font-mono text-muted-foreground">
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 + idx * 0.04 }}
                                        >
                                            {row.rank}
                                        </motion.span>
                                    </td>
                                    <td className="p-4 font-medium text-base">{row.team}</td>
                                    <td className="p-4 text-center text-muted-foreground">{row.played || 0}</td>
                                    <td className="p-4 text-center text-muted-foreground">{row.won || 0}</td>
                                    <td className="p-4 text-center text-muted-foreground">{row.drawn || 0}</td>
                                    <td className="p-4 text-center text-muted-foreground">{row.lost || 0}</td>
                                    <td className="p-4 text-center font-bold text-base text-primary">{row.points || 0}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {row.form && row.form.map((f: string, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ ...smoothSpring, delay: 0.4 + idx * 0.02 + i * 0.06 }}
                                                    className="flex h-6 w-6 items-center justify-center rounded bg-muted"
                                                >
                                                    {renderFormIcon(f)}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </AnimatePresence>
                </table>
            </div>
        </motion.div>
    )
}
