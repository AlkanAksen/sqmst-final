// src/pages/AnalysePage.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    BarChart3,
    TrendingUp,
    AlertTriangle,
    FileText,
    CheckCircle2,
    Home,
    Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";

const DIMENSION_TITLES = {
    perf: "Performance Efficiency",
    rel: "Reliability",
    comp: "Compatibility",
    sec: "Security",
    usab: "Usability",
    port: "Portability",
};

// ISO 15939 Metrik Tanımları
const METRIC_DEFINITIONS = {
    perf: [
        { id: "avg_resp", name: "Average Response Time", unit: "ms", min: 0, max: 10000, target: 200, lowerBetter: true },
        { id: "peak_resp", name: "Peak Response Time", unit: "ms", min: 0, max: 10000, target: 500, lowerBetter: true },
        { id: "latency", name: "Latency", unit: "ms", min: 0, max: 10000, target: 100, lowerBetter: true },
        { id: "cpu", name: "CPU Usage", unit: "%", min: 0, max: 100, target: 70, lowerBetter: true },
        { id: "mem", name: "Memory Usage", unit: "MB", min: 0, max: 100000, target: 5000, lowerBetter: true },
        { id: "net", name: "Network Bandwidth", unit: "Mbps", min: 0, max: 10000, target: 1000, lowerBetter: true },
        { id: "max_users", name: "Max Concurrent Users", unit: "count", min: 0, max: 1000000, target: 10000, lowerBetter: false },
        { id: "throughput", name: "Throughput", unit: "req/sec", min: 0, max: 100000, target: 1000, lowerBetter: false },
    ],
    rel: [
        { id: "defect_density", name: "Defect Density", unit: "defects/KLOC", min: 0, max: 100, target: 5, lowerBetter: true },
        { id: "uptime", name: "System Uptime", unit: "%", min: 0, max: 100, target: 99.9, lowerBetter: false },
        { id: "downtime", name: "Mean Downtime", unit: "hours", min: 0, max: 744, target: 1, lowerBetter: true },
        { id: "failover", name: "Failover Time", unit: "ms", min: 0, max: 60000, target: 5000, lowerBetter: true },
        { id: "recovery_rate", name: "Recovery Success Rate", unit: "%", min: 0, max: 100, target: 95, lowerBetter: false },
        { id: "mttr", name: "MTTR", unit: "minutes", min: 0, max: 10000, target: 60, lowerBetter: true },
    ],
    comp: [
        { id: "conflicts", name: "Resource Conflicts", unit: "count/month", min: 0, max: 10000, target: 10, lowerBetter: true },
        { id: "exchange_rate", name: "Data Exchange Success", unit: "%", min: 0, max: 100, target: 99, lowerBetter: false },
        { id: "api_error", name: "API Error Rate", unit: "%", min: 0, max: 100, target: 1, lowerBetter: true },
    ],
    sec: [
        { id: "blocked_access", name: "Blocked Access Attempts", unit: "%", min: 0, max: 100, target: 99, lowerBetter: false },
        { id: "corruption", name: "Data Corruption", unit: "count/month", min: 0, max: 10000, target: 0, lowerBetter: true },
        { id: "logged_tx", name: "Transaction Logging", unit: "%", min: 0, max: 100, target: 100, lowerBetter: false },
        { id: "audit_cov", name: "Audit Coverage", unit: "%", min: 0, max: 100, target: 95, lowerBetter: false },
        { id: "auth_success", name: "Auth Success Rate", unit: "%", min: 0, max: 100, target: 99, lowerBetter: false },
        { id: "auth_fail", name: "Auth Failure Rate", unit: "%", min: 0, max: 100, target: 1, lowerBetter: true },
    ],
    usab: [
        { id: "discoverability", name: "Task Discoverability", unit: "%", min: 0, max: 100, target: 80, lowerBetter: false },
        { id: "learn_time", name: "Learning Time", unit: "minutes", min: 0, max: 1000, target: 30, lowerBetter: true },
        { id: "completion_rate", name: "Task Completion", unit: "%", min: 0, max: 100, target: 95, lowerBetter: false },
        { id: "error_freq", name: "User Error Frequency", unit: "errors/hour", min: 0, max: 1000, target: 5, lowerBetter: true },
        { id: "satisfaction", name: "UI Satisfaction", unit: "1-5", min: 1, max: 5, target: 4, lowerBetter: false },
        { id: "wcag", name: "WCAG Compliance", unit: "%", min: 0, max: 100, target: 90, lowerBetter: false },
    ],
    port: []
};

export default function AnalysePage() {
    const navigate = useNavigate();
    const [dimensions, setDimensions] = useState([]);
    const [weights, setWeights] = useState({});
    const [values, setValues] = useState({});
    const [scores, setScores] = useState({});
    const [overallScore, setOverallScore] = useState(0);
    const [metricDetails, setMetricDetails] = useState({});

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const dims = params.get("dims")?.split(",") || [];
        setDimensions(dims);

        const w = {};
        const allValues = {};

        dims.forEach((id) => {
            const val = params.get(`w_${id}`);
            if (val) w[id] = parseInt(val);
        });
        setWeights(w);

        // Tüm metrik değerlerini topla
        for (const [key, value] of params.entries()) {
            if (key.startsWith("v_")) {
                allValues[key] = parseFloat(value) || 0;
            }
        }
        setValues(allValues);

        // ISO 15939: Information Product = Indicator calculated from Base/Derived Measures
        const { calculatedScores, details } = calculateQualityScores(dims, w, allValues);
        setScores(calculatedScores);
        setMetricDetails(details);

        // Overall Quality Indicator (weighted sum)
        let totalWeightedScore = 0;
        let totalWeight = 0;
        dims.forEach((dimId) => {
            totalWeightedScore += calculatedScores[dimId] * (w[dimId] || 0);
            totalWeight += w[dimId] || 0;
        });
        setOverallScore(totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0);
    }, []);

    // ISO 15939 Uyumlu Hesaplama Fonksiyonu
    const calculateQualityScores = (dims, weights, values) => {
        const calculatedScores = {};
        const details = {};

        dims.forEach((dimId) => {
            const metrics = METRIC_DEFINITIONS[dimId] || [];
            const metricScores = [];
            const metricInfo = [];

            metrics.forEach((metric) => {
                const key = `v_${dimId}_${metric.id}`;
                const rawValue = values[key];

                if (rawValue !== undefined && rawValue !== "") {
                    // Base Measure: Ham değer
                    const baseMeasure = parseFloat(rawValue);

                    // Derived Measure: Normalize edilmiş skor (0-100)
                    const derivedMeasure = normalizeToScore(baseMeasure, metric);

                    metricScores.push(derivedMeasure);
                    metricInfo.push({
                        name: metric.name,
                        baseMeasure: baseMeasure,
                        derivedMeasure: derivedMeasure,
                        unit: metric.unit,
                        target: metric.target,
                        status: getMetricStatus(baseMeasure, metric)
                    });
                }
            });

            // Indicator: Boyut skoru (metriklerin ortalaması)
            const dimensionScore = metricScores.length > 0
                ? Math.round(metricScores.reduce((a, b) => a + b, 0) / metricScores.length)
                : 0;

            calculatedScores[dimId] = dimensionScore;
            details[dimId] = metricInfo;
        });

        return { calculatedScores, details };
    };

    // ISO 15939: Base Measure → Derived Measure (Normalization)
    const normalizeToScore = (value, metric) => {
        const { min, max, target, lowerBetter, unit } = metric;

        // Likert Scale (1-5) özel durumu
        if (unit === "1-5") {
            return ((value - min) / (max - min)) * 100;
        }

        // Lower is Better (response time, error rate, vb.)
        if (lowerBetter) {
            if (value <= target) {
                // Target'tan düşükse mükemmel
                return 100;
            } else if (value >= max) {
                // Max'a ulaşmışsa en kötü
                return 0;
            } else {
                // Target ile max arasında lineer düşüş
                return Math.max(0, 100 - ((value - target) / (max - target)) * 100);
            }
        }
        // Higher is Better (uptime, success rate, vb.)
        else {
            if (value >= target) {
                // Target'ı geçmişse mükemmel
                return 100;
            } else if (value <= min) {
                // Min'e düşmüşse en kötü
                return 0;
            } else {
                // Min ile target arasında lineer artış
                return Math.max(0, ((value - min) / (target - min)) * 100);
            }
        }
    };

    // Metrik durumunu belirle
    const getMetricStatus = (value, metric) => {
        const { target, lowerBetter } = metric;
        const threshold = target * (lowerBetter ? 1.2 : 0.8);

        if (lowerBetter) {
            if (value <= target) return "Excellent";
            if (value <= threshold) return "Good";
            return "Needs Improvement";
        } else {
            if (value >= target) return "Excellent";
            if (value >= threshold) return "Good";
            return "Needs Improvement";
        }
    };

    // PDF Rapor Oluştur
    const generatePDFReport = () => {
        const reportHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ISO 15939 Quality Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a;
            padding: 40px;
            background: #ffffff;
        }
        .header {
            text-align: center;
            border-bottom: 4px solid #9B4D96;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #9B4D96;
            font-size: 32px;
            margin-bottom: 10px;
        }
        .header .subtitle {
            color: #666;
            font-size: 14px;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section-title {
            background: linear-gradient(135deg, #9B4D96, #D37FFF);
            color: white;
            padding: 12px 20px;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            border-radius: 8px;
        }
        .overall-score {
            text-align: center;
            background: #f8f9fa;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 2px solid #9B4D96;
        }
        .overall-score .score {
            font-size: 72px;
            font-weight: bold;
            color: #9B4D96;
            line-height: 1;
        }
        .overall-score .label {
            color: #666;
            font-size: 16px;
            margin-top: 10px;
        }
        .dimension-card {
            background: #f8f9fa;
            border-left: 4px solid #9B4D96;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
        }
        .dimension-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .dimension-name {
            font-size: 20px;
            font-weight: bold;
            color: #1a1a1a;
        }
        .dimension-score {
            font-size: 32px;
            font-weight: bold;
            color: #9B4D96;
        }
        .metric-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
        }
        .metric-table th {
            background: #9B4D96;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 12px;
        }
        .metric-table td {
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 12px;
        }
        .status-excellent { color: #22c55e; font-weight: bold; }
        .status-good { color: #3b82f6; font-weight: bold; }
        .status-needs { color: #ef4444; font-weight: bold; }
        .recommendation {
            background: white;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin-bottom: 12px;
            border-radius: 4px;
        }
        .recommendation.critical { border-left-color: #ef4444; }
        .recommendation.warning { border-left-color: #f59e0b; }
        .recommendation.success { border-left-color: #22c55e; }
        .recommendation-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
        }
        .recommendation-text {
            color: #666;
            font-size: 13px;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            text-align: center;
        }
        .info-box .value {
            font-size: 28px;
            font-weight: bold;
            color: #9B4D96;
        }
        .info-box .label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>ISO/IEC 15939 Software Quality Report</h1>
        <div class="subtitle">
            Generated: ${new Date().toLocaleString('tr-TR')}<br>
            Standard: ISO/IEC 15939:2017 - Software Measurement Process<br>
            Quality Model: ISO/IEC 25010 - System and Software Quality Models
        </div>
    </div>

    <div class="section">
        <div class="overall-score">
            <div class="score">${overallScore}</div>
            <div class="label">Overall Quality Score / 100</div>
            <div class="label" style="margin-top: 15px; font-size: 18px; color: #9B4D96; font-weight: bold;">
                ${overallScore >= 90 ? 'EXCELLENT' : overallScore >= 70 ? 'GOOD' : overallScore >= 50 ? 'ACCEPTABLE' : 'NEEDS IMPROVEMENT'}
            </div>
        </div>

        <div class="info-grid">
            <div class="info-box">
                <div class="value">${dimensions.length}</div>
                <div class="label">Dimensions Analyzed</div>
            </div>
            <div class="info-box">
                <div class="value">${Object.values(scores).filter(s => s >= 70).length}</div>
                <div class="label">Above Target (≥70)</div>
            </div>
            <div class="info-box">
                <div class="value">${Object.entries(weights).reduce((sum, [k, v]) => sum + v, 0)}%</div>
                <div class="label">Total Weight</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Dimension Analysis</div>
        ${dimensions.map(dimId => {
            const score = scores[dimId] || 0;
            const weight = weights[dimId] || 0;
            const metrics = metricDetails[dimId] || [];

            return `
                <div class="dimension-card">
                    <div class="dimension-header">
                        <div class="dimension-name">${DIMENSION_TITLES[dimId]}</div>
                        <div class="dimension-score">${score}%</div>
                    </div>
                    <div style="color: #666; font-size: 14px; margin-bottom: 10px;">
                        Weight: ${weight}% | Contribution: ${Math.round((score * weight) / 100)} points
                    </div>
                    ${metrics.length > 0 ? `
                        <table class="metric-table">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Base Measure</th>
                                    <th>Target</th>
                                    <th>Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${metrics.map(m => `
                                    <tr>
                                        <td>${m.name}</td>
                                        <td>${m.baseMeasure} ${m.unit}</td>
                                        <td>${m.target} ${m.unit}</td>
                                        <td>${Math.round(m.derivedMeasure)}%</td>
                                        <td class="status-${m.status.toLowerCase().replace(' ', '-')}">${m.status}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p style="color: #999;">No metrics data available</p>'}
                </div>
            `;
        }).join('')}
    </div>

    <div class="section">
        <div class="section-title">Recommendations</div>
        ${generateRecommendationsHTML(scores, dimensions)}
    </div>

    <div class="section">
        <div class="section-title">Measurement Methodology</div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p style="margin-bottom: 15px;"><strong>ISO/IEC 15939 Measurement Process:</strong></p>
            <ul style="margin-left: 20px; color: #666;">
                <li><strong>Base Measures:</strong> Raw metric values collected from the system (e.g., response time in ms, CPU usage in %)</li>
                <li><strong>Derived Measures:</strong> Normalized scores (0-100) calculated using target-based transformation</li>
                <li><strong>Indicators:</strong> Dimension-level quality scores (arithmetic mean of derived measures)</li>
                <li><strong>Information Product:</strong> Overall quality score (weighted average of indicators)</li>
            </ul>
            <p style="margin-top: 15px; color: #666;"><strong>Scoring Algorithm:</strong> For "lower is better" metrics (e.g., response time), values at or below target receive 100%. For "higher is better" metrics (e.g., uptime), values at or above target receive 100%. Intermediate values are scored linearly.</p>
        </div>
    </div>

    <div class="footer">
        <p>This report was generated using ISO/IEC 15939 Software Measurement Process standard.</p>
        <p>Quality model based on ISO/IEC 25010 System and Software Quality Models.</p>
        <p style="margin-top: 10px; font-weight: bold;">© 2024 ISO 15939 Simulator</p>
    </div>
</body>
</html>
        `;

        // HTML'i blob olarak oluştur ve indir
        const blob = new Blob([reportHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ISO15939_Quality_Report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Kullanıcıya bilgi ver
        alert('✅ Rapor indirildi! HTML dosyasını tarayıcınızda açıp "Print to PDF" ile PDF\'e çevirebilirsiniz.');
    };

    // Öneriler HTML
    const generateRecommendationsHTML = (scores, dims) => {
        let html = '';

        dims.forEach(id => {
            const score = scores[id] || 0;
            if (score < 50) {
                html += `
                    <div class="recommendation critical">
                        <div class="recommendation-title">🔴 CRITICAL - ${DIMENSION_TITLES[id]}</div>
                        <div class="recommendation-text">Score: ${score}%. Immediate action required. This dimension is significantly below acceptable threshold and poses risks to system quality.</div>
                    </div>
                `;
            } else if (score < 70) {
                html += `
                    <div class="recommendation warning">
                        <div class="recommendation-title">⚠️ OPTIMIZE - ${DIMENSION_TITLES[id]}</div>
                        <div class="recommendation-text">Score: ${score}%. Improvement opportunity identified. Focus on key metrics to reach target performance level.</div>
                    </div>
                `;
            } else if (score >= 90) {
                html += `
                    <div class="recommendation success">
                        <div class="recommendation-title">✅ EXCELLENT - ${DIMENSION_TITLES[id]}</div>
                        <div class="recommendation-text">Score: ${score}%. Outstanding performance. Continue current practices and use as benchmark for other dimensions.</div>
                    </div>
                `;
            }
        });

        if (html === '') {
            html = '<div class="recommendation"><div class="recommendation-text">All dimensions are performing within acceptable ranges (70-89%). Continue monitoring and incremental improvements.</div></div>';
        }

        return html;
    };

    const getScoreColor = (score) => {
        if (score >= 90) return "text-green-400";
        if (score >= 70) return "text-blue-400";
        if (score >= 50) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreColorBg = (score) => {
        if (score >= 90) return "from-green-500 to-green-600";
        if (score >= 70) return "from-blue-500 to-blue-600";
        if (score >= 50) return "from-yellow-500 to-yellow-600";
        return "from-red-500 to-red-600";
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
                            Step 4: Analyse
                        </span>
                    </div>
                </div>
            </header>

            <main className="px-6 py-12 space-y-8">
                {/* ÜST BAŞLIK */}
                <section className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9B4D96] flex items-center justify-center font-bold text-lg shadow-lg shadow-[#9B4D96]/20">
                            4
                        </div>
                        <h2 className="text-2xl font-semibold">Results & Recommendations</h2>
                    </div>
                    <Button
                        onClick={generatePDFReport}
                        className="flex items-center gap-2 px-6 py-3
                            rounded-full
                            bg-gradient-to-r from-[#6C3CF0] to-[#D240A8]
                            text-white font-semibold
                            shadow-[0_0_18px_rgba(150,50,220,0.6)]
                            hover:shadow-[0_0_26px_rgba(150,50,220,0.8)]
                            border border-[#F9A8FF]/40
                            transition-all duration-300"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF Report
                    </Button>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ANA KOLON */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* GENEL SKOR */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="relative overflow-hidden transition-all duration-300
                                bg-gradient-to-br from-[#15101F] via-[#120D19] to-[#05030A]
                                hover:from-[#22142F] hover:via-[#191024] hover:to-[#070410]
                                border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.8)] rounded-xl">

                                <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 bg-[#9B4D96]/20 blur-3xl" />

                                <CardHeader>
                                    <CardTitle className="text-2xl">Overall System Quality</CardTitle>
                                    <CardDescription className="text-white/60">
                                        ISO/IEC 15939 Information Product - Weighted Quality Indicator
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-col md:flex-row items-center gap-8 pt-4">
                                    {/* Dairesel Progress */}
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke="#1a1a1a"
                                                strokeWidth="8"
                                            />
                                            <motion.circle
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: overallScore / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke="url(#scoreGradient)"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                pathLength="1"
                                            />
                                            <defs>
                                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#7a3ef8" />
                                                    <stop offset="100%" stopColor="#D240A8" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                                {overallScore}
                                            </span>
                                            <span className="text-sm text-white/40">/ 100</span>
                                        </div>
                                    </div>

                                    {/* Açıklama */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-lg text-white mb-1">
                                                    {overallScore >= 90 ? 'Outstanding Quality' : overallScore >= 70 ? 'Good Quality' : overallScore >= 50 ? 'Acceptable Quality' : 'Quality Improvement Needed'}
                                                </h4>
                                                <p className="text-sm text-white/60 leading-relaxed">
                                                    Analysis based on ISO/IEC 15939 measurement information model using base measures, derived measures, and indicators.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                <div className="text-2xl font-bold text-[#D37FFF]">
                                                    {dimensions.length}
                                                </div>
                                                <div className="text-xs text-white/50 mt-1">Quality Characteristics</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                <div className="text-2xl font-bold text-[#D37FFF]">
                                                    {Object.values(scores).filter(s => s >= 70).length}
                                                </div>
                                                <div className="text-xs text-white/50 mt-1">Above Target (≥70)</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* BOYUT ANALİZİ */}
                        <section>
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                                <BarChart3 className="w-6 h-6 text-[#D37FFF]" />
                                Quality Characteristic Analysis
                            </h3>

                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {dimensions.map((id) => (
                                    <motion.div key={id} variants={item}>
                                        <Card className="relative overflow-hidden transition-all duration-300
                                            bg-gradient-to-br from-[#15101F] via-[#120D19] to-[#05030A]
                                            hover:from-[#22142F] hover:via-[#191024] hover:to-[#070410]
                                            border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.8)] rounded-xl
                                            h-full">

                                            <div className="pointer-events-none absolute -left-6 -bottom-6 w-20 h-20 bg-[#9B4D96]/16 blur-2xl" />

                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-base">
                                                        {DIMENSION_TITLES[id]}
                                                    </CardTitle>
                                                    <Badge className={`${getScoreColor(scores[id] || 0)} bg-white/5 border-white/10 px-3 py-1 font-bold`}>
                                                        {scores[id]}%
                                                    </Badge>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="space-y-3">
                                                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${scores[id]}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={`h-full bg-gradient-to-r ${getScoreColorBg(scores[id] || 0)} rounded-full`}
                                                    />
                                                </div>

                                                <div className="flex justify-between text-xs text-white/60">
                                                    <span>
                                                        Weight: <span className="text-white font-medium">{weights[id]}%</span>
                                                    </span>
                                                    <span>
                                                        Contribution:{" "}
                                                        <span className="text-white font-medium">
                                                            {Math.round(((scores[id] || 0) * (weights[id] || 0)) / 100)} points
                                                        </span>
                                                    </span>
                                                </div>

                                                {/* Metrik detayları */}
                                                {metricDetails[id] && metricDetails[id].length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-white/5">
                                                        <div className="text-xs text-white/40 mb-2">Measured Metrics: {metricDetails[id].length}</div>
                                                        <div className="flex gap-1 flex-wrap">
                                                            {metricDetails[id].slice(0, 3).map((metric, idx) => (
                                                                <span key={idx} className={`text-[10px] px-2 py-1 rounded-full ${
                                                                    metric.status === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                                                                        metric.status === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                                                                            'bg-red-500/20 text-red-400'
                                                                }`}>
                                                                    {metric.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </section>
                    </div>

                    {/* ÖNERİLER SIDEBAR */}
                    <div className="lg:col-span-1">
                        <Card className="relative overflow-hidden transition-all duration-300
                            bg-gradient-to-br from-[#15101F] via-[#120D19] to-[#05030A]
                            border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.8)] rounded-xl
                            lg:sticky lg:top-24">

                            <div className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 bg-[#9B4D96]/16 blur-2xl" />

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="w-5 h-5 text-[#D37FFF]" />
                                    Recommendations
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Dinamik öneriler */}
                                {dimensions.map(id => {
                                    const score = scores[id] || 0;
                                    if (score < 50) {
                                        return (
                                            <div key={id} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                                                <h4 className="text-red-400 font-semibold text-sm flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Critical - {DIMENSION_TITLES[id]}
                                                </h4>
                                                <p className="text-xs text-white/70 leading-relaxed">
                                                    Score: {score}%. Immediate action required to address significant quality gaps.
                                                </p>
                                            </div>
                                        );
                                    } else if (score < 70) {
                                        return (
                                            <div key={id} className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm">
                                                <h4 className="text-yellow-400 font-semibold text-sm flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Optimize - {DIMENSION_TITLES[id]}
                                                </h4>
                                                <p className="text-xs text-white/70 leading-relaxed">
                                                    Score: {score}%. Good opportunity for improvement to reach quality target.
                                                </p>
                                            </div>
                                        );
                                    } else if (score >= 90) {
                                        return (
                                            <div key={id} className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                                                <h4 className="text-green-400 font-semibold text-sm flex items-center gap-2 mb-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Excellent - {DIMENSION_TITLES[id]}
                                                </h4>
                                                <p className="text-xs text-white/70 leading-relaxed">
                                                    Score: {score}%. Outstanding performance. Maintain best practices.
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                                {/* Eğer hepsi 70-89 arasındaysa */}
                                {!dimensions.some(id => scores[id] < 70 || scores[id] >= 90) && (
                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                                        <h4 className="text-blue-400 font-semibold text-sm flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Stable Performance
                                        </h4>
                                        <p className="text-xs text-white/70 leading-relaxed">
                                            All dimensions are within acceptable range. Continue monitoring and incremental improvements.
                                        </p>
                                    </div>
                                )}

                                {/* Butonlar */}
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <Button
                                        onClick={() => navigate("/")}
                                        className="w-full flex items-center justify-center gap-2
                                            rounded-full
                                            bg-gradient-to-r from-[#6C3CF0] to-[#D240A8]
                                            text-white font-semibold
                                            shadow-[0_0_18px_rgba(150,50,220,0.6)]
                                            hover:shadow-[0_0_26px_rgba(150,50,220,0.8)]
                                            border border-[#F9A8FF]/40
                                            transition-all duration-300
                                            h-11"
                                    >
                                        <Home className="w-4 h-4" />
                                        Start New Analysis
                                    </Button>

                                    <Button
                                        onClick={() => navigate(-1)}
                                        className="w-full flex items-center justify-center gap-2
                                            rounded-full border border-[#6C3CF0]/60
                                            bg-transparent text-white font-medium
                                            hover:bg-[#6C3CF0]/20
                                            transition-all duration-300
                                            shadow-[0_0_10px_rgba(108,60,240,0.25)]
                                            hover:shadow-[0_0_16px_rgba(108,60,240,0.4)]
                                            h-11"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Measure
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}   