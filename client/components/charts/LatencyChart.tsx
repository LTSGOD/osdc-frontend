import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  time: string;
  value: number;
}

interface LatencyChartProps {
  data: ChartData[];
}

export default function LatencyChart({ data }: LatencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }} 
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", borderColor: "#ccc" }}
          itemStyle={{ color: "#82ca9d" }}
          cursor={{ fill: 'transparent' }}
        />
        <Bar
          dataKey="value"
          fill="#82ca9d"
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
          barSize={10}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
