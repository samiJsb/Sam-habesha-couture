import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Cpu, Activity, Clock } from 'lucide-react';

interface Log {
  id: number;
  type: string;
  message: string;
  timestamp: string;
}

export default function SystemTerminal() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const [logsRes, diagRes] = await Promise.all([
          fetch('/api/system/logs'),
          fetch('/api/system/diagnostics')
        ]);
        const logsData = await logsRes.json();
        const diagData = await diagRes.json();
        setLogs(logsData.slice(0, 8));
        setDiagnostics(diagData);
      } catch (error) {
        console.error('Failed to fetch system data:', error);
      }
    };

    fetchSystemData();
    const interval = setInterval(fetchSystemData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Diagnostics Card */}
      <div className="lg:col-span-1 p-8 bg-axon-card border border-axon-border rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-axon-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-axon-primary/10 transition-colors" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-axon-primary/10 rounded-lg">
              <Cpu className="w-4 h-4 text-axon-primary" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Fullstack_Diagnostics</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-axon-muted uppercase tracking-widest">Neural_Load</span>
                <span className="text-xs font-mono font-bold text-white">{diagnostics?.neural_load || '0.00%'}</span>
              </div>
              <div className="h-1 bg-axon-bg rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: diagnostics?.neural_load || 0 }}
                  className="h-full bg-axon-primary shadow-[0_0_10px_rgba(88,101,242,0.5)]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-axon-bg border border-axon-border rounded-lg">
                <p className="text-[8px] font-black text-axon-muted uppercase tracking-tighter mb-1">Active_Users</p>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-sm font-black text-white font-mono">{diagnostics?.active_connections || 0}</p>
                </div>
              </div>
              <div className="p-4 bg-axon-bg border border-axon-border rounded-lg">
                <p className="text-[8px] font-black text-axon-muted uppercase tracking-tighter mb-1">Memory_Heap</p>
                <p className="text-sm font-black text-white font-mono">
                  {diagnostics?.memory?.heapUsed ? `${(diagnostics.memory.heapUsed / 1024 / 1024).toFixed(1)}MB` : '0MB'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Card */}
      <div className="lg:col-span-2 bg-[#0A0A0B] border border-axon-border rounded-xl flex flex-col h-[320px] shadow-2xl relative overflow-hidden group">
        <div className="p-4 border-b border-axon-border flex items-center justify-between bg-axon-card">
          <div className="flex items-center gap-3">
            <TerminalIcon className="w-3.5 h-3.5 text-axon-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">SamuelAI_System_Logs</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-500/50" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
        </div>
        
        <div className="flex-1 p-6 font-mono text-[10px] space-y-3 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 group"
              >
                <span className="text-[#303033] font-bold">[{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                <span className="text-axon-primary font-black uppercase tracking-tighter w-24">[{log.type}]</span>
                <span className="text-axon-muted group-hover:text-white transition-colors">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex gap-4 animate-pulse">
            <span className="text-axon-primary font-black">_</span>
          </div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      </div>
    </div>
  );
}
