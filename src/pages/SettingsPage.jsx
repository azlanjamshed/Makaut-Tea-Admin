import React, { useState, useEffect } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import {
  Server,
  ShieldCheck,
  Database,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import api from "../api/client";

const SettingsPage = () => {
  const [healthStatus, setHealthStatus] = useState("checking");
  const [isChecking, setIsChecking] = useState(false);
  const { showToast } = useToast();

  // const checkHealth = async () => {
  //   setIsChecking(true);
  //   try {
  //     const res = await api.get('/health');
  //     if (res.success) {
  //       setHealthStatus('online');
  //       showToast('Backend API and database are online and healthy', 'success');
  //     } else {
  //       setHealthStatus('warning');
  //     }
  //   } catch (err) {
  //     setHealthStatus('offline');
  //     showToast('Could not reach backend health check', 'error');
  //   } finally {
  //     setIsChecking(false);
  //   }
  // };
  const checkHealth = async () => {
    setIsChecking(true);

    try {
      const res = await api.get("/health");
      console.log("Health response:", res);

      if (res.status === 200 && res.data?.status === "OK") {
        setHealthStatus("online");
        showToast("Backend API is online and healthy", "success");
      } else {
        setHealthStatus("warning");
      }
    } catch (err) {
      setHealthStatus("offline");
      showToast("Could not reach backend health check", "error");
    } finally {
      setIsChecking(false);
    }
  };
  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            System & Infrastructure Settings
          </h2>
          <p className="text-xs text-slate-500">
            Platform connectivity, backend health, and moderation protocols
          </p>
        </div>

        {/* Health Check Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                healthStatus === "online"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : healthStatus === "checking"
                    ? "bg-indigo-50 text-[var(--color-primary)] border-indigo-200"
                    : "bg-rose-50 text-rose-600 border-rose-200"
              }`}
            >
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Backend API Server Status
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    healthStatus === "online"
                      ? "bg-emerald-500"
                      : healthStatus === "checking"
                        ? "bg-indigo-500 animate-ping"
                        : "bg-rose-500"
                  }`}
                />
                <span className="capitalize font-semibold">{healthStatus}</span>
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={checkHealth}
            isLoading={isChecking}
            icon={RefreshCw}
            className="cursor-pointer"
          >
            Check Health
          </Button>
        </div>

        {/* Environment Details */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
            Environment & Endpoints
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[var(--border-color)]">
              <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">
                API Base URL
              </span>
              <span className="text-xs font-mono font-bold text-[var(--color-primary)] mt-1 block">
                {import.meta.env.VITE_API_URL || "/api"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[var(--border-color)]">
              <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">
                Storage Endpoint
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 mt-1 block truncate">
                {import.meta.env.VITE_SERVER_URL || "http://localhost:5001"}
              </span>
            </div>
          </div>
        </div>

        {/* University Compliance Guidelines */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Campus Code of Conduct Moderation Protocol</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All moderation actions taken through this portal are permanently
            recorded in the administrative audit logs. Please ensure complaints
            involving severe harassment, hate speech, or doxxing are documented
            with proper justification notes.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
