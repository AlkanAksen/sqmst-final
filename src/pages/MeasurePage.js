// src/pages/MeasurePage.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Database, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

// Label component
const Label = ({ children }) => (
    <label className="text-xs text-white/80 uppercase tracking-wider font-medium">
        {children}
    </label>
);

// Separator
const Separator = () => (
    <div className="h-px w-full bg-white/5 my-6" />
);

// METRICS
const METRICS_DATA = {
    perf: {
        title: "Performance Efficiency",
        subchars: {
            time: {
                title: "Time Behaviour",
                metrics: [
                    { name: "Average Response Time", unit: "ms", id: "avg_resp", min: 0, max: 10000 },
                    { name: "Peak Response Time", unit: "ms", id: "peak_resp", min: 0, max: 10000 },
                    { name: "Latency", unit: "ms", id: "latency", min: 0, max: 10000 },
                ],
            },
            resource: {
                title: "Resource Utilization",
                metrics: [
                    { name: "CPU Usage", unit: "%", id: "cpu", min: 0, max: 100 },
                    { name: "Memory Usage", unit: "MB", id: "mem", min: 0, max: 100000 },
                    { name: "Network Bandwidth Usage", unit: "Mbps", id: "net", min: 0, max: 10000 },
                ],
            },
            capacity: {
                title: "Capacity",
                metrics: [
                    { name: "Maximum Concurrent Users", unit: "count", id: "max_users", min: 0, max: 1000000 },
                    { name: "Throughput", unit: "requests/sec", id: "throughput", min: 0, max: 100000 },
                ],
            },
        },
    },
    rel: {
        title: "Reliability",
        subchars: {
            maturity: {
                title: "Maturity",
                metrics: [
                    { name: "Defect Density", unit: "defects/KLOC", id: "defect_density", min: 0, max: 100 },
                ],
            },
            availability: {
                title: "Availability",
                metrics: [
                    { name: "System Uptime", unit: "%", id: "uptime", min: 0, max: 100 },
                    { name: "Mean Down Time per Month", unit: "hours", id: "downtime", min: 0, max: 744 },
                ],
            },
            fault: {
                title: "Fault Tolerance",
                metrics: [
                    { name: "Failover Time", unit: "ms", id: "failover", min: 0, max: 60000 },
                    {
                        name: "Error Recovery Success Rate",
                        unit: "%",
                        id: "recovery_rate",
                        min: 0,
                        max: 100
                    },
                ],
            },
            recoverability: {
                title: "Recoverability",
                metrics: [
                    {
                        name: "Mean Time To Recovery (MTTR)",
                        unit: "minutes",
                        id: "mttr",
                        min: 0,
                        max: 10000
                    },
                ],
            },
        },
    },
    comp: {
        title: "Compatibility",
        subchars: {
            coexistence: {
                title: "Co-existence",
                metrics: [
                    {
                        name: "Resource Conflict Incidents",
                        unit: "count/month",
                        id: "conflicts",
                        min: 0,
                        max: 10000
                    },
                ],
            },
            interop: {
                title: "Interoperability",
                metrics: [
                    {
                        name: "Successful Data Exchange Rate",
                        unit: "%",
                        id: "exchange_rate",
                        min: 0,
                        max: 100
                    },
                    { name: "API Error Rate", unit: "%", id: "api_error", min: 0, max: 100 },
                ],
            },
        },
    },
    sec: {
        title: "Security",
        subchars: {
            confidentiality: {
                title: "Confidentiality",
                metrics: [
                    {
                        name: "Unauthorized Access Attempts Blocked",
                        unit: "%",
                        id: "blocked_access",
                        min: 0,
                        max: 100
                    },
                ],
            },
            integrity: {
                title: "Integrity",
                metrics: [
                    {
                        name: "Data Corruption Incidents",
                        unit: "count/month",
                        id: "corruption",
                        min: 0,
                        max: 10000
                    },
                ],
            },
            nonrep: {
                title: "Non-repudiation",
                metrics: [
                    {
                        name: "Logged Transaction Rate",
                        unit: "%",
                        id: "logged_tx",
                        min: 0,
                        max: 100
                    },
                ],
            },
            account: {
                title: "Accountability",
                metrics: [
                    {
                        name: "Audit Log Coverage",
                        unit: "%",
                        id: "audit_cov",
                        min: 0,
                        max: 100
                    },
                ],
            },
            auth: {
                title: "Authenticity",
                metrics: [
                    {
                        name: "Authentication Success Rate",
                        unit: "%",
                        id: "auth_success",
                        min: 0,
                        max: 100
                    },
                    {
                        name: "Failed Authentication Attempts",
                        unit: "%",
                        id: "auth_fail",
                        min: 0,
                        max: 100
                    },
                ],
            },
        },
    },
    usab: {
        title: "Usability",
        subchars: {
            approp: {
                title: "Appropriateness Recognizability",
                metrics: [
                    {
                        name: "Task Discoverability Rate",
                        unit: "%",
                        id: "discoverability",
                        min: 0,
                        max: 100
                    },
                ],
            },
            learn: {
                title: "Learnability",
                metrics: [
                    {
                        name: "Time to Learn Basic Tasks",
                        unit: "minutes",
                        id: "learn_time",
                        min: 0,
                        max: 1000
                    },
                ],
            },
            operability: {
                title: "Operability",
                metrics: [
                    {
                        name: "Task Completion Rate",
                        unit: "%",
                        id: "completion_rate",
                        min: 0,
                        max: 100
                    },
                ],
            },
            error_prot: {
                title: "User Error Protection",
                metrics: [
                    {
                        name: "User Error Frequency",
                        unit: "errors/hour",
                        id: "error_freq",
                        min: 0,
                        max: 1000
                    },
                ],
            },
            ui_aes: {
                title: "User Interface Aesthetics",
                metrics: [
                    {
                        name: "UI Satisfaction Score",
                        unit: "1–5 (Likert)",
                        id: "satisfaction",
                        min: 1,
                        max: 5
                    },
                ],
            },
            access: {
                title: "Accessibility",
                metrics: [
                    {
                        name: "WCAG Compliance Level",
                        unit: "%",
                        id: "wcag",
                        min: 0,
                        max: 100
                    },
                ],
            },
        },
    },
};

export default function MeasurePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [dimensions, setDimensions] = useState([]);
    const [weights, setWeights] = useState({});
    const [values, setValues] = useState({});

    // 🔧 URL'den dims ve w_* okuma
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const dims = params.get("dims")?.split(",").filter(Boolean) || [];

        console.log("URL Params:", window.location.search);
        console.log("Dimensions:", dims);

        setDimensions(dims);

        const w = {};
        dims.forEach((id) => {
            const val = params.get(`w_${id}`);
            if (val !== null) {
                w[id] = parseInt(val, 10);
            }
        });
        setWeights(w);

        console.log("Weights:", w);
    }, []);

    const handleValueChange = (dimId, metricId, val) => {
        setValues((prev) => ({
            ...prev,
            [`${dimId}_${metricId}`]: val,
        }));
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
            {/* HEADER */}
            <header className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
                <div className="px-6 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#F5E1FF] to-white/60 bg-clip-text text-transparent">
                        ISO 15939 Simulator
                    </h1>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#9B4D96]/15 border border-[#9B4D96]/30 shadow-[0_0_10px_rgba(155,77,150,0.35)]">
                        <span className="w-2 h-2 bg-[#D37FFF] rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-[#EBD1FF] uppercase tracking-wide">
                            Step 3: Measure
                        </span>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="px-6 py-12 space-y-8">
                {dimensions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                        <Database className="w-16 h-16 text-white/20" />
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-white/80">
                                Hiç boyut seçilmedi
                            </h2>
                            <p className="text-white/50">
                                Lütfen önce Define sayfasından boyutları seçin.
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate("/step1")}
                            className="flex items-center gap-2 px-8 py-3
                                rounded-full
                                bg-gradient-to-r from-[#6C3CF0] to-[#D240A8]
                                text-white font-semibold
                                shadow-[0_0_18px_rgba(150,50,220,0.6)]
                                hover:shadow-[0_0_26px_rgba(150,50,220,0.8)]
                                border border-[#F9A8FF]/40
                                transition-all duration-300"
                        >
                            Define Sayfasına Dön
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* ÜST BAŞLIK */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-[#9B4D96] flex items-center justify-center font-bold text-lg shadow-lg shadow-[#9B4D96]/20">
                                    3
                                </div>
                                <h2 className="text-2xl font-semibold">Enter Metric Values</h2>
                            </div>

                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="space-y-8"
                            >
                                {dimensions.map((dimId) => {
                                    const dimData = METRICS_DATA[dimId];
                                    if (!dimData) return null;

                                    return (
                                        <motion.div key={dimId} variants={item}>
                                            <Card className="relative overflow-hidden transition-all duration-300
                                                bg-gradient-to-br from-[#15101F] via-[#120D19] to-[#05030A]
                                                hover:from-[#22142F] hover:via-[#191024] hover:to-[#070410]
                                                border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.8)] rounded-xl">

                                                <div className="pointer-events-none absolute -left-6 -bottom-6 w-24 h-24 bg-[#9B4D96]/16 blur-2xl" />

                                                <CardHeader className="border-b border-white/5 pb-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-[#9B4D96]/22 flex items-center justify-center shadow-[0_0_10px_rgba(155,77,150,0.4)]">
                                                                <Database className="w-5 h-5 text-[#F5E1FF]" />
                                                            </div>
                                                            <CardTitle className="text-xl">{dimData.title}</CardTitle>
                                                        </div>

                                                        <Badge className="bg-[#9B4D96]/20 border border-[#9B4D96]/30 text-[#EBD1FF] px-4 py-2 text-sm font-semibold">
                                                            Weight: {weights[dimId]}%
                                                        </Badge>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="pt-6 space-y-8">
                                                    {Object.entries(dimData.subchars).map(
                                                        ([subId, subData], index) => (
                                                            <div key={subId}>
                                                                {index > 0 && <Separator />}
                                                                <h3 className="text-[#D37FFF] font-semibold mb-5 flex items-center gap-2 text-base">
                                                                    <CheckCircle2 className="w-5 h-5" />
                                                                    {subData.title}
                                                                </h3>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                    {subData.metrics.map((metric) => (
                                                                        <div key={metric.id} className="space-y-2">
                                                                            <Label>{metric.name}</Label>

                                                                            <div className="relative w-full">
                                                                                <Input
                                                                                    type="number"
                                                                                    min={metric.min}
                                                                                    max={metric.max}
                                                                                    placeholder="0"
                                                                                    className="
                                                                                        bg-black/40 border-white/10 text-white
                                                                                        pr-16 h-11 w-full rounded-lg
                                                                                        focus:ring-2 focus:ring-[#9B4D96] focus:border-[#9B4D96]
                                                                                        transition-all
                                                                                    "
                                                                                    value={
                                                                                        values[`${dimId}_${metric.id}`] || ""
                                                                                    }
                                                                                    onChange={(e) => {
                                                                                        const v = e.target.value;
                                                                                        if (v === "") {
                                                                                            handleValueChange(dimId, metric.id, v);
                                                                                        } else {
                                                                                            const num = parseFloat(v);
                                                                                            if (!isNaN(num) && num >= metric.min && num <= metric.max) {
                                                                                                handleValueChange(dimId, metric.id, v);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                                                                                            e.preventDefault();
                                                                                        }
                                                                                    }}
                                                                                />

                                                                                <span className="
                                                                                    absolute
                                                                                    right-4
                                                                                    top-1/2
                                                                                    -translate-y-1/2
                                                                                    text-xs text-white/40
                                                                                    pointer-events-none
                                                                                    font-medium
                                                                                ">
                                                                                    {metric.unit}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </section>

                        {/* FOOTER BUTTONS */}
                        <div className="flex justify-between mt-16 px-4">
                            <Button
                                onClick={() => navigate(-1)}
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

                            <Button
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    params.set("dims", dimensions.join(","));
                                    Object.entries(weights).forEach(([k, v]) =>
                                        params.set(`w_${k}`, v)
                                    );
                                    Object.entries(values).forEach(([k, v]) =>
                                        params.set(`v_${k}`, v)
                                    );
                                    navigate(`/analyse?${params.toString()}`);
                                }}
                                className="flex items-center gap-2 px-8 py-3
                                    rounded-full
                                    bg-gradient-to-r from-[#6C3CF0] to-[#D240A8]
                                    text-white font-semibold
                                    shadow-[0_0_18px_rgba(150,50,220,0.6)]
                                    hover:shadow-[0_0_26px_rgba(150,50,220,0.8)]
                                    border border-[#F9A8FF]/40
                                    transition-all duration-300"
                            >
                                Next
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}