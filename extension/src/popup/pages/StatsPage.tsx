import { useEffect, useState } from 'react';
import { extStorage } from '../storage';
import { getMessage } from '../i18n';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0h 0m 0s';
  const s = Math.floor(seconds);
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`;
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, (value / 86400) * 100);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex justify-between text-sm font-semibold">
        <span>{label}</span>
        <span className="text-white/60">{formatTime(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/40">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function StatsPage() {
  const [usage, setUsage] = useState(0);
  const [video, setVideo] = useState(0);
  const [shorts, setShorts] = useState(0);

  useEffect(() => {
    const refresh = () => {
      extStorage.get<Record<string, number>>(
        ['YT_TOTAL_USAGE', 'YT_VIDEO_TIME', 'YT_SHORTS_TIME'],
        (data) => {
          setUsage(Number(data.YT_TOTAL_USAGE) || 0);
          setVideo(Number(data.YT_VIDEO_TIME) || 0);
          setShorts(Number(data.YT_SHORTS_TIME) || 0);
        }
      );
    };
    refresh();
    const id = setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-bold">{getMessage('stats.title')}</h2>
        <p className="mt-1 text-xs text-white/45">{getMessage('stats.desc')}</p>
      </div>
      <StatCard label={getMessage('stats.foreground')} value={usage} color="#44aaff" />
      <StatCard label={getMessage('stats.video')} value={video} color="#00ff88" />
      <StatCard label={getMessage('stats.shorts')} value={shorts} color="#ff4444" />
    </section>
  );
}
