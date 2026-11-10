"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type Insights = {
  salesTrend: { date: string; amount: number }[];
  productPerformance: { name: string; total: number; quantity: number }[];
};

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    fetch("/api/admin/insights?days=30")
      .then((r) => r.json())
      .then((d) => (d.success ? setInsights(d.data) : setInsights(null)));
  }, []);

  if (!insights) return <main className="mx-auto max-w-7xl px-4 py-8">Loading...</main>;

  const lineData = {
    labels: insights.salesTrend.map((s) => s.date.slice(5)),
    datasets: [
      {
        label: "Sales ($)",
        data: insights.salesTrend.map((s) => s.amount),
        borderColor: "rgb(217, 119, 6)",
        backgroundColor: "rgba(217, 119, 6, 0.1)",
      },
    ],
  };

  const barData = {
    labels: insights.productPerformance.map((p) => p.name.slice(0, 15)),
    datasets: [
      {
        label: "Revenue ($)",
        data: insights.productPerformance.map((p) => p.total),
        backgroundColor: "rgba(217, 119, 6, 0.6)",
      },
    ],
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Business Insights</h1>
      <p className="mt-1 text-slate-600">Last 30 days</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-1">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Sales Trend</h2>
          <div className="mt-4 h-64">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Top Products by Revenue</h2>
          <div className="mt-4 h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
