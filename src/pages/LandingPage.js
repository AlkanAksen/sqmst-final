// src/pages/LandingPage.js
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">

            <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center space-y-12">

                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                    <ShieldCheck className="w-4 h-4 text-[#D1A1D5]" />
                    <span className="text-sm font-medium text-white/80 tracking-wide uppercase">
            ISO 15939 Standard Compliant
          </span>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 max-w-4xl"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Software Quality Measurement
            </span>
                        <br />
                        <span className="text-[#9B4D96]">Simulation Tool</span>
                    </h1>

                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                        A comprehensive environment to define, measure, and analyze software
                        quality dimensions based on industry-standard methodologies. Ensure
                        reliability, security, and efficiency in your software processes.
                    </p>
                </motion.div>

                {/* START PROCESS Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Button
                        onClick={() => navigate("/step1")}
                        className="group relative
              px-16 h-14
              rounded-full
              bg-gradient-to-r from-[#7a3ef8] to-[#b084f9]
              border border-[#b084f9]/70
              text-white text-lg font-semibold
              shadow-[0_0_22px_rgba(176,132,249,0.35)]
              hover:shadow-[0_0_35px_rgba(176,132,249,0.55)]
              transition-all duration-300"
                    >
            <span className="flex items-center gap-3">
              Start Process
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
                    </Button>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-white/20 text-sm">
                © 2024 ISO 15939 Simulation Tool
            </div>
        </div>
    );
}
