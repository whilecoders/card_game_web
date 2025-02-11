"use client";

// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", user: 186 },
  { month: "February", user: 305 },
  { month: "March", user: 237 },
  { month: "April", user: 73 },
  { month: "May", user: 209 },
  { month: "June", user: 214 },
];

const chartConfig = {
  desktop: {
    label: "User",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function UserGrowthChart() {
  return (
    <>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="user" fill="var(--color-desktop)" radius={4} />
          {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
        </BarChart>
      </ChartContainer>
    </>
    // <ResponsiveContainer width="100%" height={300}>
    //   <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    //     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
    //     <XAxis dataKey="name" stroke="#6b7280" />
    //     <YAxis stroke="#6b7280" />
    //     <Tooltip
    //       contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
    //     />
    //     <Legend />
    //     <Line
    //       type="monotone"
    //       dataKey="users"
    //       stroke="#3b82f6"
    //       strokeWidth={3}
    //       dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
    //       activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
    //     />
    //     <Line
    //       type="monotone"
    //       dataKey="newUsers"
    //       stroke="#10b981"
    //       strokeWidth={3}
    //       dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
    //       activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
    //     />
    //   </LineChart>
    // </ResponsiveContainer>
  );
}
