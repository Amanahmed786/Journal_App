import React, { useState, useEffect } from 'react';
import { checkServerHealth } from '../api/health';
import { Server, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ServerStatusBanner({ onStatusChange }) {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'waking'
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let timer = null;

    const ping = async () => {
      const isUp = await checkServerHealth();
      if (!isMounted) return;

      if (isUp) {
        setStatus('online');
        if (onStatusChange) onStatusChange(true);
      } else {
        setStatus('waking');
        if (onStatusChange) onStatusChange(false);
        setRetries((prev) => prev + 1);
        // Exponential-like backoff / retry every 4 seconds up to 15 times (~60s)
        timer = setTimeout(ping, 4000);
      }
    };

    ping();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (status === 'online') {
    return (
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 text-xs font-medium flex items-center justify-between transition-colors">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Render Backend Connected & Live</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Spring Boot 4</span>
            <span>•</span>
            <span>MongoDB</span>
            <span>•</span>
            <span>Redis</span>
            <span>•</span>
            <span>Kafka</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-200 px-4 py-2 text-xs font-medium transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Waking up free-tier server...</strong> Render instances sleep after inactivity.
            {retries > 0 && ` (Checking: attempt ${retries})`}
          </span>
        </div>
        <span className="text-[11px] text-amber-700/80 dark:text-amber-300/80 hidden md:inline">
          Actions will enable automatically once ready (~30-60s)
        </span>
      </div>
    </div>
  );
}
