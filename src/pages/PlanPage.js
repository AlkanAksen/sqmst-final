// src/pages/PlanPage.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    PieChart,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

const DIMENSION_TITLES = {
    perf: "Performance Efficiency",
    rel: "Reliability",
    comp: "Compatibility",
    sec: "Security",
    usab: "Usability",
    port: "Portability",
};

const DEFAULT_WEIGHTS = {
    iot: { perf: 20, rel: 20, comp: 15, sec: 30, port: 15 },
    health: { perf: 15, rel: 30, comp: 10, sec: 30, usab: 15 },
    mobile: { perf: 25, comp: 10, sec: 20, usab: 30, port: 15 },
};

export default function PlanPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [weights, setWeights] = useState({});
    const [dimensions, setDimensions] = useState([]);
    const [caseStudy, setCaseStudy] = useState(null);

    // Step1’den gelen case & dims bilgilerini oku
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const dims = params.get("dims")?.split(",").filter(Boolean) || [];
        const cs = params.get("case");

        setDimensions(dims);
        setCaseStudy(cs);

        const initial = {};
        if (cs && DEFAULT_WEIGHTS[cs]) {
            dims.forEach((d) => (initial[d] = DEFAULT_WEIGHTS[cs][d] ?? 0));
        } else {
            dims.forEach((d) => (initial[d] = 0));
        }
        setWeights(initial);
    }, [location.search]);

    const totalWeight = Object.values(weights).reduce(
        (sum, v) => sum + (Number(v) || 0),
        0
    );
    const isValid = totalWeight === 100;

    const handleWeightChange = (id, v) =>
        setWeights((prev) => ({ ...prev, [id]: v }));

    // ⬇⬇⬇ BURASI Measure sayfasına yönlendirmeyi yapıyor ⬇⬇⬇
    const handleNext = () => {
        if (!isValid) return;

        const params = new URLSearchParams();
        params.set("dims", dimensions.join(","));
        Object.entries(weights).forEach(([k, v]) =>
            params.set(`w_${k}`, String(v ?? 0))
        );

        // ➜ URL + state ile MeasurePage'e git
        navigate(`/measure?${params.toString()}`, {
            state: {
                dimensions,
                weights,
            },
        });
    };



    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* HEADER — Step1 ile aynı */}
            <header className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
                <div className="px-6 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#F5E1FF] to-white/60 bg-clip-text text-transparent">
                        ISO 15939 Simulator
                    </h1>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#9B4D96]/15 border border-[#9B4D96]/30 shadow-[0_0_10px_rgba(155,77,150,0.35)]">
                        <span className="w-2 h-2 bg-[#D37FFF] rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-[#EBD1FF] uppercase tracking-wide">
              Step 2: Plan
            </span>
                    </div>
                </div>
            </header>

            <main className="px-6 py-12 space-y-16">
                {/* ÜST BAŞLIK */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#9B4D96] flex items-center justify-center font-bold text-lg shadow-lg shadow-[#9B4D96]/20">
                            2
                        </div>
                        <h2 className="text-2xl font-semibold">Assign Weights</h2>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* SOL KART */}
                        <motion.div variants={item} className="lg:col-span-2 space-y-6">
                            <Card
                                className="relative overflow-hidden transition-all duration-300
                bg-gradient-to-br from-[#15101F] via-[#120D19] to-[#05030A]
                hover:from-[#22142F] hover:via-[#191024] hover:to-[#070410]
                border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.8)] rounded-xl"
                            >
                                <div className="pointer-events-none absolute -left-6 -bottom-6 w-24 h-24 bg-[#9B4D96]/16 blur-2xl" />

                                <CardHeader>
                                    <CardTitle className="text-white">
                                        Quality Dimension Weights
                                    </CardTitle>
                                    <p className="text-white/72 text-sm">
                                        Assign weights to each dimension.
                                        {caseStudy && (
                                            <span className="block text-[#EBD1FF] mt-1">
                        Recommended weights for <b>{caseStudy.toUpperCase()}</b>.
                      </span>
                                        )}
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {dimensions.length === 0 ? (
                                        <div className="text-white/40 text-center py-8">
                                            No dimensions selected.
                                        </div>
                                    ) : (
                                        dimensions.map((id) => (
                                            <div key={id} className="space-y-3">
                                                <div className="flex justify-between">
                                                    <label className="text-sm font-medium">
                                                        {DIMENSION_TITLES[id] || id}
                                                    </label>
                                                    <span className="text-sm font-bold text-[#EBD1FF]">
                            {weights[id] || 0}%
                          </span>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Slider
                                                        value={[weights[id] || 0]}
                                                        max={100}
                                                        step={5}
                                                        onValueChange={(val) =>
                                                            handleWeightChange(id, val[0])
                                                        }
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        type="number"
                                                        value={weights[id] || 0}
                                                        onChange={(e) =>
                                                            handleWeightChange(
                                                                id,
                                                                Math.min(
                                                                    100,
                                                                    Math.max(0, parseInt(e.target.value) || 0)
                                                                )
                                                            )
                                                        }
                                                        className="w-16 text-center bg-black/60 border border-white/10 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* SAĞ KART — SUMMARY */}
                        <motion.div variants={item}>
                            <Card
                                className="relative overflow-hidden transition-all duration-300
                  bg-gradient-to-br from-[#15101F] via-[#120D19] to-[#05030A]
                  hover:from-[#22142F] hover:via-[#191024] hover:to-[#070410]
                  border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.8)] rounded-xl
                  lg:sticky lg:top-24"
                            >
                                <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 bg-[#9B4D96]/16 blur-2xl" />

                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="w-5 h-5 text-[#EBD1FF]" />
                                        Summary
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Total Weight</span>
                                            <span
                                                className={
                                                    isValid ? "text-green-400" : "text-amber-300"
                                                }
                                            >
                        {totalWeight}%
                      </span>
                                        </div>

                                        <Progress value={totalWeight} className="h-2" />

                                        {!isValid && (
                                            <p className="text-xs text-amber-300 mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {totalWeight > 100
                                                    ? `Reduce by ${totalWeight - 100}%`
                                                    : `Add ${100 - totalWeight}%`}
                                            </p>
                                        )}

                                        {isValid && (
                                            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-2 text-green-400 text-xs">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Perfectly balanced!
                                            </div>
                                        )}
                                    </div>

                                    {/* Next Step → MeasurePage */}
                                    <Button
                                        onClick={handleNext}
                                        disabled={!isValid}
                                        className="w-full h-10 flex items-center justify-center gap-2
                      rounded-full
                      bg-gradient-to-r from-[#6C3CF0] to-[#D240A8]
                      text-white font-semibold
                      shadow-[0_0_18px_rgba(150,50,220,0.6)]
                      hover:shadow-[0_0_26px_rgba(150,50,220,0.8)]
                      border border-[#F9A8FF]/40
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all duration-300"
                                    >
                                        Next Step
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Alt NAV — sadece Previous */}
                <div className="flex justify-start mt-16 px-4">
                    <Button
                        onClick={() => navigate("/step1")}
                        className="flex items-center gap-2 px-6 py-3
              rounded-full border border-[#6C3CF0]/60
              bg-transparent text-white font-medium
              hover:bg-[#6C3CF0]/20
              transition-all duration-300
              shadow-[0_0_10px_rgba(108,60,240,0.25)]
              hover:shadow-[0_0_16px_rgba(108,60,240,0.4)]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </Button>
                </div>
            </main>
        </div>
    );
}
