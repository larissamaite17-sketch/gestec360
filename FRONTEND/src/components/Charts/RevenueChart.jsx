import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function RevenueChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* AJUSTADO AQUI: Cor alterada para #cbd5e1 (mais visível) e adicionado strokeDasharray */}
        <CartesianGrid
          stroke="#cbd5e1"
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
        />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="valor"
          stroke="#7C3AED"
          strokeWidth={4}
          fill="url(#purpleGradient)"
          animationDuration={900}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}