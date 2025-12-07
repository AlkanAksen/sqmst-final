import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    MonitorSmartphone,
    Activity,
    Layers,
    Server,
    UserCheck,
    Globe,
    ShieldCheck,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function Step1Page() {
    const [selectedCase, setSelectedCase] = useState(null);
    const [selectedDimensions, setSelectedDimensions] = useState([]);
    const navigate = useNavigate();

    const toggleDimension = (id) => {
        setSelectedDimensions((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        );
    };

    const handleCaseSelection = (id) => {
        if (selectedCase === id) {
            setSelectedCase(null);
            setSelectedDimensions([]);
        } else {
            setSelectedCase(id);

            if (id === "iot")
                setSelectedDimensions(["perf", "rel", "comp", "sec", "port"]);
            if (id === "health")
                setSelectedDimensions(["perf", "rel", "comp", "sec", "usab"]);
            if (id === "mobile")
                setSelectedDimensions(["perf", "comp", "sec", "usab", "port"]);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
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
              Step 1: Define
            </span>
                    </div>
                </div>
            </header>

            <main className="px-6 py-12 space-y-16">
                {/* STEP 1 */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Define Case Study</h2>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-3 gap-6"
                    >
                        {[
                            {
                                id: "iot",
                                title: "IoT System",
                                icon: MonitorSmartphone,
                                desc: "Smart home sensors and connectivity.",
                            },
                            {
                                id: "health",
                                title: "Health System",
                                icon: Activity,
                                desc: "Medical device monitoring.",
                            },
                            {
                                id: "mobile",
                                title: "Mobile App",
                                icon: Layers,
                                desc: "Consumer-facing mobile application.",
                            },
                        ].map((option) => (
                            <motion.div key={option.id} variants={item}>
                                <Card
                                    className={`relative overflow-hidden cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#120718] via-[#181024] to-[#050208]
                    hover:from-[#201130] hover:via-[#26163A] hover:to-[#08030F]
                    ${
                                        selectedCase === option.id
                                            ? "ring-2 ring-[#D37FFF] shadow-[0_0_18px_rgba(211,127,255,0.55)]"
                                            : "border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                                    }`}
                                    onClick={() => handleCaseSelection(option.id)}
                                >
                                    {/* glow azaltıldı */}
                                    <div className="pointer-events-none absolute -right-6 -top-6 w-20 h-20 bg-[#D37FFF]/18 blur-2xl" />

                                    {selectedCase === option.id && (
                                        <CheckCircle2 className="absolute top-3 right-3 text-[#F9A8FF]" />
                                    )}

                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-xl bg-[#9B4D96]/22 flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(155,77,150,0.4)]">
                                            <option.icon className="w-6 h-6 text-[#F5E1FF]" />
                                        </div>
                                        <CardTitle className="text-lg">{option.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm text-white/72">
                                            {option.desc}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* STEP 2 */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Select Dimensions</h2>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[
                            { id: "perf", title: "Performance Efficiency", icon: Zap },
                            { id: "rel", title: "Reliability", icon: Server },
                            { id: "comp", title: "Compatibility", icon: Layers },
                            { id: "sec", title: "Security", icon: ShieldCheck },
                            { id: "usab", title: "Usability", icon: UserCheck },
                            { id: "port", title: "Portability", icon: Globe },
                        ].map((dim) => (
                            <motion.div key={dim.id} variants={item}>
                                <Card
                                    onClick={() => toggleDimension(dim.id)}
                                    className={`relative cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#15101F] via-[#120D19] to-[#05030A]
                    hover:from-[#22142F] hover:via-[#191024] hover:to-[#070410]
                    ${
                                        selectedDimensions.includes(dim.id)
                                            ? "ring-2 ring-[#E1C3FF] shadow-[0_0_16px_rgba(225,195,255,0.55)]"
                                            : "border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                                    }`}
                                >
                                    {/* glow azaltıldı */}
                                    <div className="pointer-events-none absolute -left-6 -bottom-6 w-18 h-18 bg-[#9B4D96]/16 blur-2xl" />

                                    <CardHeader>
                                        <div className="p-2 rounded-lg bg-white/6 text-[#EBD1FF] w-fit shadow-[0_0_8px_rgba(0,0,0,0.6)]">
                                            <dim.icon className="w-5 h-5" />
                                        </div>

                                        {selectedDimensions.includes(dim.id) && (
                                            <Badge className="bg-[#9B4D96] mt-3 text-[10px] tracking-wide uppercase">
                                                Selected
                                            </Badge>
                                        )}

                                        <CardTitle className="mt-3 text-lg">{dim.title}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* NAV BUTTONS */}
                <div className="flex justify-between mt-16 px-4">
                    {/* PREVIOUS */}
                    <Button
                        onClick={() => navigate("/")}
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

                    {/* NEXT → PLAN PAGE */}
                    <Button
                        onClick={() => {
                            const params = new URLSearchParams();
                            if (selectedCase) params.set("case", selectedCase);
                            if (selectedDimensions.length > 0)
                                params.set("dims", selectedDimensions.join(","));

                            navigate(`/plan?${params.toString()}`);
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
            </main>
        </div>
    );
}
