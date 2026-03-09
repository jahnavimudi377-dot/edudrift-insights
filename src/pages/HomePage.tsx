import { StatCard } from "@/components/StatCard";
import { getGlobalStats } from "@/data/mockData";
import { Users, AlertTriangle, Activity, Bell, Brain, TrendingDown, BookOpen } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const HomePage = () => {
  const stats = getGlobalStats();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl gradient-brand p-2.5">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight">EduDrift</h1>
            <p className="text-sm text-muted-foreground">AI Concept Drift Detection for Student Learning</p>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm mt-3">
          EduDrift analyzes student interaction data to detect shifts in learning behavior — identifying declining understanding, guessing patterns, and abnormal solving speeds to support early intervention.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Students at Risk" value={stats.atRisk} variant="risk" icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard title="Avg Drift Score" value={stats.avgDrift} variant="primary" icon={<Activity className="h-5 w-5" />} />
        <StatCard title="Active Alerts" value={stats.activeAlerts} variant={stats.activeAlerts > 0 ? "risk" : "default"} icon={<Bell className="h-5 w-5" />} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accuracy Trend */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4 text-foreground">Accuracy Trend (All Students)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.weeklyAccuracy}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Drift Distribution */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4 text-foreground">Drift Score Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stats.driftDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {stats.driftDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Coach Card */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl gradient-brand p-3">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">AI Learning Coach</h3>
            <p className="text-sm text-muted-foreground mt-1">Concept Drift Detected</p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-medium text-foreground">Topic: Recursion</p>
              <p className="text-muted-foreground">Recommended Action:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Review concept video</li>
                <li>Practice 5 problems</li>
                <li>Schedule instructor help</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
