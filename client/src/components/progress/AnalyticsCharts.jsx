import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Minus, Sparkles } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border) / 0.5)",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
};

const axisStyle = {
  fill: "hsl(var(--muted-foreground))",
  fontSize: 12,
};

const chartColors = ["#34d399", "#a855f7", "#22d3ee", "#f59e0b", "#f472b6"];

export function DashboardCard({ title, subtitle, icon: Icon, children, className = "", delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, delay }}
      className={`rounded-lg border border-border/50 bg-card/60 p-5 shadow-lg shadow-black/20 backdrop-blur-xl transition-colors hover:border-primary/40 ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon size={20} />
          </div>
        )}
      </div>
      {children}
    </motion.section>
  );
}

export function MetricBlock({ label, value, helper }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 truncate text-2xl font-bold text-foreground">{value}</p>
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}

export function TrendBadge({ value, label = "vs previous" }) {
  const numeric = Number(value) || 0;
  const isPositive = numeric > 0;
  const isNegative = numeric < 0;
  const Icon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;
  const colorClass = isPositive
    ? "border-green-500/40 bg-green-500/10 text-green-300"
    : isNegative
      ? "border-red-500/40 bg-red-500/10 text-red-300"
      : "border-border/50 bg-muted/20 text-muted-foreground";

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${colorClass}`}>
      <Icon size={16} />
      <span>{Math.abs(numeric)}%</span>
      <span className="font-normal opacity-80">{label}</span>
    </div>
  );
}

export function Insight({ children }) {
  return (
    <div className="mt-5 flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
      <Sparkles className="mt-0.5 shrink-0 text-primary" size={16} />
      <p>{children}</p>
    </div>
  );
}

export function EmptyChartState({ message = "No chart data yet." }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border/50 bg-background/20 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function LineTrendChart({ data, dataKey = "score", height = 260, gradientId = "lineTrendGradient" }) {
  if (!data?.length) {
    return <EmptyChartState message="Complete an attempt to start the trend line." />;
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.38} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border) / 0.25)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} minTickGap={18} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} width={42} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            formatter={(value, name, item) => [`${value}%`, item?.payload?.section || "Score"]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#34d399"
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 6, stroke: "#a855f7", strokeWidth: 2, fill: "#34d399" }}
            dot={{ r: 3, fill: "#34d399", strokeWidth: 0 }}
            isAnimationActive
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarMetricChart({ data, dataKey = "score", height = 240, formatter = (value) => `${value}` }) {
  if (!data?.length) {
    return <EmptyChartState message="Complete an activity to fill this chart." />;
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border) / 0.25)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={42} />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted) / 0.22)" }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            formatter={(value) => [formatter(value), "Value"]}
          />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} isAnimationActive animationDuration={800}>
            {data.map((_, index) => (
              <Cell key={`bar-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AccuracyMeter({ value, label = "Accuracy" }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-4xl font-bold text-foreground">{safeValue}%</p>
        </div>
        <TrendBadge value={safeValue >= 70 ? 1 : safeValue >= 40 ? 0 : -1} label={safeValue >= 70 ? "strong" : safeValue >= 40 ? "steady" : "needs focus"} />
      </div>
      <div className="h-4 overflow-hidden rounded-lg bg-muted/40">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-lg bg-gradient-to-r from-primary via-emerald-300 to-secondary"
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
