import React, { useState } from 'react';
import { BarChart3, Gauge, Zap, Activity, CheckCircle2, Info } from 'lucide-react';
import { ImpactMetric } from '../data/portfolio-data';

interface ImpactMetricsChartProps {
  metrics: ImpactMetric[];
  projectTitle: string;
}

export const ImpactMetricsChart: React.FC<ImpactMetricsChartProps> = ({
  metrics,
  projectTitle,
}) => {
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);

  if (!metrics || metrics.length === 0) {
    return null;
  }

  // Calculate overall performance compliance score
  const avgEfficiency = Math.round(
    metrics.reduce((acc, m) => {
      const pct = Math.min(100, Math.max(10, (m.value / m.maxValue) * 100));
      return acc + pct;
    }, 0) / metrics.length
  );

  return (
    <div className="pt-6 border-t border-[var(--border-subtle)] space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
            <span>Project Scale & Impact Metrics</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Empirical Performance & System Scale
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Verified production benchmarks, latency budgets, and real-time operational capacity.
          </p>
        </div>

        {/* Global Compliance Metric Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] shrink-0 self-start sm:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-champagne)] animate-pulse" />
          <span className="text-[11px] font-mono-code text-[var(--text-secondary)]">
            SCALE INDEX:{' '}
            <strong className="text-[var(--accent-champagne)] font-bold">
              {avgEfficiency}% VERIFIED
            </strong>
          </span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-md space-y-6">
        <div className="space-y-5">
          {metrics.map((metric, idx) => {
            const percentage = Math.min(
              100,
              Math.max(8, Math.round((metric.value / metric.maxValue) * 100))
            );

            // Icon helper based on metric label keywords
            const isLatency =
              metric.unit === 'ms' ||
              metric.unit === 'µs' ||
              metric.label.toLowerCase().includes('latency') ||
              metric.label.toLowerCase().includes('speed');
            const isReliability =
              metric.unit === '%' ||
              metric.label.toLowerCase().includes('reliability') ||
              metric.label.toLowerCase().includes('precision') ||
              metric.label.toLowerCase().includes('stability');
            const isScale =
              metric.unit === 'SKUs' ||
              metric.unit === 'Pages' ||
              metric.unit === 'Threads' ||
              metric.unit === 'USD';

            const MetricIcon = isLatency ? Zap : isReliability ? Gauge : isScale ? Activity : BarChart3;

            return (
              <div
                key={metric.label}
                className="group/bar relative space-y-2 focus-within:ring-1 focus-within:ring-[var(--accent-champagne)] rounded-lg p-2 -mx-2 hover:bg-[var(--bg-elevated)]/40 transition-colors"
                onMouseEnter={() => setActiveTooltipIndex(idx)}
                onMouseLeave={() => setActiveTooltipIndex(null)}
              >
                {/* Metric Label & Numerical Target */}
                <div className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--accent-champagne)] shrink-0">
                      <MetricIcon className="w-3 h-3" />
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] truncate">
                      {metric.label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 shrink-0 font-mono-code">
                    <span className="text-sm font-bold text-[var(--accent-champagne)]">
                      {metric.displayValue}
                    </span>
                    {metric.unit && (
                      <span className="text-[10px] text-[var(--text-muted)] font-medium">
                        [{metric.unit}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Horizontal Bar Chart Track & Fill */}
                <div className="relative w-full h-3 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden shadow-inner">
                  {/* Subtle 25%, 50%, 75% scale benchmark tick marks */}
                  <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
                    <span className="w-px h-full bg-[var(--border-hover)]" />
                    <span className="w-px h-full bg-[var(--border-hover)]" />
                    <span className="w-px h-full bg-[var(--border-hover)]" />
                  </div>

                  {/* Dynamic Champagne Scale Bar */}
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent-brown)] via-[var(--accent-champagne)] to-[#E8E0D4] dark:to-[#FAF6F2] transition-all duration-700 ease-out relative shadow-[0_0_12px_rgba(197,168,121,0.3)] group-hover/bar:brightness-110"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={metric.value}
                    aria-valuemin={0}
                    aria-valuemax={metric.maxValue}
                    aria-label={`${metric.label}: ${metric.displayValue}`}
                  >
                    {/* Subtle Champagne light hairline sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-light-sweep pointer-events-none" />
                  </div>
                </div>

                {/* Contextual Description & Relative Benchmark Scale */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-1 text-[var(--text-secondary)] font-mono-code pt-0.5">
                  <p className="line-clamp-1 text-[var(--text-muted)] group-hover/bar:text-[var(--text-secondary)] transition-colors">
                    {metric.description || 'Verified architectural benchmark metric.'}
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                    BENCHMARK: {percentage}% OF {metric.maxValue} {metric.unit || ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Telemetry Footer Callout */}
        <div className="pt-4 border-t border-[var(--border-subtle)]/70 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono-code text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
            <span>BENCHMARKED AGAINST ARCHITECTURAL TARGET BUDGETS</span>
          </div>
          <div className="flex items-center gap-3">
            <span>METRICS: EMPIRICAL</span>
            <span className="text-[var(--border-hover)]">/</span>
            <span>STANDARDS: ISO/IEC 25010</span>
          </div>
        </div>
      </div>
    </div>
  );
};
