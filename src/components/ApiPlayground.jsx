import { useState } from "react";
import { Terminal, Play, CheckCircle2, Cpu, Clock, RefreshCw, Database } from "lucide-react";
import { playCyberClick, playCyberChirp } from "../utils/soundEffects";
import { useTheme } from "../context/ThemeContext";

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/health",
    description: "Cluster health, memory footprint & node heartbeats",
    response: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      nodes: 5,
      leader_node: "node-us-east-01",
      raft_term: 42,
      memory_heap_mb: 64.2,
      uptime_seconds: 1420840
    }
  },
  {
    method: "GET",
    path: "/api/v1/metrics",
    description: "P99 latency distribution & throughput telemetry",
    response: {
      metrics: {
        rps_average: 12450,
        latency_p50_ms: 12.4,
        latency_p99_ms: 38.2,
        error_rate_percentage: 0.001,
        cache_hit_ratio: 0.968
      },
      telemetry_source: "eBPF Kernel Socket Probes"
    }
  },
  {
    method: "GET",
    path: "/api/v1/projects/active",
    description: "Active high-throughput architecture deployments",
    response: {
      total_count: 5,
      active_deployments: [
        { id: "aether-nexus", status: "ONLINE", protocol: "gRPC" },
        { id: "hyperion-db", status: "ONLINE", protocol: "Raft" },
        { id: "cyber-sentinel", status: "MONITORING", protocol: "eBPF" }
      ]
    }
  },
  {
    method: "POST",
    path: "/api/v1/verify-auth",
    description: "Simulate JWT cryptographic token validation & RBAC handshake",
    response: {
      authenticated: true,
      user: "guest_architect",
      roles: ["SYSTEM_READ", "TELEMETRY_ACCESS"],
      signature_algo: "Ed25519",
      session_expires_in: 3600
    }
  }
];

export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [loading, setLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState(API_ENDPOINTS[0].response);
  const [latency, setLatency] = useState(22);
  const [cacheStatus, setCacheStatus] = useState("HIT (Redis-Cluster)");
  const { isDark } = useTheme();

  const handleExecute = (endpoint) => {
    playCyberClick();
    setSelectedEndpoint(endpoint);
    setLoading(true);

    setTimeout(() => {
      const randomLatency = Math.floor(14 + Math.random() * 18);
      setLatency(randomLatency);
      setCacheStatus(Math.random() > 0.3 ? "HIT (Redis-Cluster)" : "MISS (Fresh Query)");
      setActiveResponse(endpoint.response);
      setLoading(false);
      playCyberChirp();
    }, 280);
  };

  return (
    <section id="playground" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
          <span>04 // Interactive Architecture Console</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
          System Architecture & <span className="text-gradient-main">Live API Sandbox</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl font-light">
          Simulate microservice endpoints, inspect HTTP payloads, and verify sub-second response times.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Cols: Endpoints Selector */}
        <div className="lg:col-span-5 space-y-3 font-mono">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2 font-semibold">
            <Cpu className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span>Available Endpoints</span>
          </div>

          {API_ENDPOINTS.map((ep) => {
            const isCurrent = ep.path === selectedEndpoint.path;
            return (
              <button
                key={ep.path}
                onClick={() => handleExecute(ep)}
                className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2 shadow-sm ${isCurrent
                    ? "border-sky-500/60 bg-sky-50 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-[0_0_25px_rgba(56,189,248,0.15)]"
                    : "border-black/[0.06] dark:border-white/[0.06] bg-white/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-sky-500/30 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] ${ep.method === "GET"
                          ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                          : "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30"
                        }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-sky-700 dark:text-sky-300 font-semibold">{ep.path}</span>
                  </div>

                  <Play className={`w-3.5 h-3.5 ${isCurrent ? "text-sky-500 dark:text-sky-400 fill-sky-500 dark:fill-sky-400" : "text-slate-400 dark:text-slate-600"}`} />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
                  {ep.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right 7 Cols: Response Terminal */}
        <div className="lg:col-span-7 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-slate-900 text-slate-100 p-6 sm:p-7 shadow-xl space-y-4 font-mono text-xs">

          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] pb-4 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
              <span className="font-bold text-white tracking-wider">RESPONSE_STREAM</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                200 OK
              </span>
              <span className="flex items-center gap-1 text-sky-300">
                <Clock className="w-3 h-3 text-sky-400" />
                {loading ? "..." : `${latency}ms`}
              </span>
              <span className="text-slate-400 hidden sm:inline">
                X-Cache: {cacheStatus}
              </span>
            </div>
          </div>

          {/* Request Header */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-white/[0.06] flex items-center justify-between text-slate-400">
            <span className="text-sky-300 font-medium">
              {selectedEndpoint.method} {selectedEndpoint.path}
            </span>
            <span className="text-[11px] text-slate-500">HTTP/2.0 · TLS 1.3</span>
          </div>

          {/* JSON Payload Viewer */}
          <div className="relative">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-3 text-sky-400">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
                <span className="text-xs">Executing query against node...</span>
              </div>
            ) : (
              <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-white/[0.06] text-sky-300 overflow-x-auto leading-relaxed text-xs">
                <code>{JSON.stringify(activeResponse, null, 2)}</code>
              </pre>
            )}
          </div>

          {/* Footer Status */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
            <span>Circuit Breaker: Closed (Nominal)</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Microservice Pool: Healthy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
