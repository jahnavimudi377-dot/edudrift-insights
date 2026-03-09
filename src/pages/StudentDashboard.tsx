import { useParams, useNavigate } from "react-router-dom";
import { students, getStudentStats, driftScores, interactions } from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Target, Clock, RotateCcw, TrendingDown, ArrowLeft, Lightbulb } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const StudentDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const student = students.find(s => s.student_id === id);

  if (!student) {
    return <div className="p-8 text-center text-muted-foreground">Student not found.</div>;
  }

  const stats = getStudentStats(student.student_id);
  const drift = driftScores.find(d => d.student_id === student.student_id)!;

  // Find worst topics
  const si = interactions.filter(i => i.student_id === student.student_id);
  const topicErrors: Record<string, number> = {};
  si.filter(i => !i.correct_answer).forEach(i => { topicErrors[i.topic] = (topicErrors[i.topic] || 0) + 1; });
  const worstTopics = Object.entries(topicErrors).sort((a, b) => b[1] - a[1]).slice(0, 2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">{student.name}</h1>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
        <RiskBadge level={drift.risk_level} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Accuracy" value={`${stats.accuracy}%`} icon={<Target className="h-5 w-5" />} variant={stats.accuracy < 60 ? "risk" : "default"} />
        <StatCard title="Avg Time / Question" value={`${stats.avgTime}s`} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Total Attempts" value={stats.totalAttempts} icon={<RotateCcw className="h-5 w-5" />} />
        <StatCard title="Drift Score" value={stats.driftScore} variant={drift.risk_level === "High" ? "risk" : drift.risk_level === "Moderate" ? "primary" : "success"} icon={<TrendingDown className="h-5 w-5" />} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Accuracy Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Time per Question</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Bar dataKey="avgTime" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Avg Time (s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold font-display mb-4">Retry Attempts Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Line type="monotone" dataKey="retries" stroke="hsl(var(--chart-4))" strokeWidth={2.5} dot={{ r: 3 }} name="Avg Retries" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      {drift.risk_level !== "Stable" && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Recommendations</h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                {worstTopics.map(([topic]) => (
                  <p key={topic}>
                    Concept drift detected in <span className="font-medium text-foreground">{topic}</span> problems. Recommended: review topic and practice 5 additional exercises.
                  </p>
                ))}
                {drift.risk_level === "High" && (
                  <p>Schedule a one-on-one session with the instructor to address foundational gaps.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
