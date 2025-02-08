"use client"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CartesianGrid, Dot, Line, LineChart } from "recharts"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'
import { ValueType } from "tailwindcss/types/config"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]


const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-2))",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const data = [
  { name: 'Jan', profit: 4000, loss: -2000 },
  { name: 'Feb', profit: 3000, loss: -1000 },
  { name: 'Mar', profit: 5000, loss: -3000 },
  { name: 'Apr', profit: 4500, loss: -1500 },
  { name: 'May', profit: 6000, loss: -2000 },
  { name: 'Jun', profit: 5500, loss: -1000 },
]

export function ProfitLossChart() {
  return (
    <>
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 24,
            left: 24,
            right: 24,
            bottom: 40, // Extra space for the bottom label
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            label={{
              value: "Date",
              position: "insideBottom",
              offset: -10,
              style: { fill: "var(--color-text)", fontSize: "12px" },
            }}
          />
          <YAxis
            label={{
              value: "Number of Visitors",
              angle: -90,
              position: "insideRight",
              offset: 50,
              style: { fill: "var(--color-text)", fontSize: "10px" },
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                nameKey="visitors"
                hideLabel
              />
            }
          />
          <Line
            dataKey="visitors"
            type="natural"
            stroke="var(--color-visitors)"
            strokeWidth={1}
            dot={({ payload, ...props }) => {
              return (
                <Dot
                  key={payload.browser}
                  r={5}
                  cx={props.cx}
                  cy={props.cy}
                  fill={payload.fill}
                  stroke={payload.fill}
                />
              );
            }}
          />
        </LineChart>
      </ChartContainer>
    </>
  
  
    // <ResponsiveContainer width="100%" height={300}>
    //   <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    //     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
    //     <XAxis dataKey="name" stroke="#6b7280" />
    //     <YAxis stroke="#6b7280" />
    //     <Tooltip 
    //       contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
    //       formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(2500)}
    //     />
    //     <Legend />
    //     <ReferenceLine y={0} stroke="#6b7280" />
    //     <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
    //     <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
    //   </BarChart>
    // </ResponsiveContainer>
  )
}

