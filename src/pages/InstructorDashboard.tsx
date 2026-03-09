import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { students, driftScores, getStudentStats } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

const InstructorDashboard = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const enriched = students.map(s => {
    const stats = getStudentStats(s.student_id);
    const drift = driftScores.find(d => d.student_id === s.student_id)!;
    return { ...s, ...stats, drift_score: drift.drift_score, risk_level: drift.risk_level };
  });

  const filtered = enriched.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const atRisk = enriched.filter(s => s.risk_level === "High").sort((a, b) => b.drift_score - a.drift_score);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Instructor Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor student performance and concept drift</p>
      </div>

      {/* Top at risk */}
      {atRisk.length > 0 && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold font-display text-foreground">Top Students at Risk</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {atRisk.map(s => (
              <button
                key={s.student_id}
                onClick={() => navigate(`/student/${s.student_id}`)}
                className="rounded-lg border border-destructive/20 bg-card px-3 py-2 text-sm hover:bg-destructive/5 transition-colors"
              >
                <span className="font-medium">{s.name}</span>
                <span className="ml-2 text-muted-foreground">({s.drift_score})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Accuracy</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Avg Time</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Drift Score</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr
                  key={s.student_id}
                  onClick={() => navigate(`/student/${s.student_id}`)}
                  className="border-b last:border-0 hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.accuracy}%</td>
                  <td className="px-4 py-3">{s.avgTime}s</td>
                  <td className="px-4 py-3">{s.drift_score}</td>
                  <td className="px-4 py-3"><RiskBadge level={s.risk_level} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
