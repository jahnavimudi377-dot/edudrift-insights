import { interactions, students, getStudentStats, driftScores } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const AnalyticsPage = () => {
  // Weekly accuracy across all students
  const weeklyData: { week: string; accuracy: number; avgTime: number; retries: number }[] = [];
  for (let w = 0; w < 12; w++) {
    const weekSize = Math.floor(interactions.length / 12);
    const wi = interactions.slice(w * weekSize, (w + 1) * weekSize);
    weeklyData.push({
      week: `W${w + 1}`,
      accuracy: Math.round((wi.filter(i => i.correct_answer).length / wi.length) * 100),
      avgTime: Math.round(wi.reduce((s, i) => s + i.time_taken_seconds, 0) / wi.length),
      retries: Math.round((wi.reduce((s, i) => s + i.retry_count, 0) / wi.length) * 10) / 10,
    });
  }

  const driftDistribution = [
    { name: "Stable", value: driftScores.filter(d => d.risk_level === "Stable").length, fill: "hsl(var(--risk-stable))" },
    { name: "Moderate", value: driftScores.filter(d => d.risk_level === "Moderate").length, fill: "hsl(var(--risk-moderate))" },
    { name: "High", value: driftScores.filter(d => d.risk_level === "High").length, fill: "hsl(var(--risk-high))" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Detailed visual analysis of learning behavior patterns</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Average Solving Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Bar dataKey="avgTime" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Avg Time (s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Retry Pattern Analysis</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Line type="monotone" dataKey="retries" stroke="hsl(var(--chart-4))" strokeWidth={2.5} dot={{ r: 3 }} name="Avg Retries" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Drift Score Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={driftDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {driftDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
