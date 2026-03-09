export interface Student {
  student_id: string;
  name: string;
  email: string;
}

export interface Interaction {
  student_id: string;
  question_id: string;
  correct_answer: boolean;
  time_taken_seconds: number;
  retry_count: number;
  timestamp: string;
  topic: string;
}

export interface DriftRecord {
  student_id: string;
  drift_score: number;
  risk_level: "Stable" | "Moderate" | "High";
  last_updated: string;
}

export interface Alert {
  id: string;
  student_id: string;
  student_name: string;
  message: string;
  topic: string;
  drift_score: number;
  timestamp: string;
  read: boolean;
}

export const students: Student[] = [
  { student_id: "S001", name: "Rahul Sharma", email: "rahul@edu.com" },
  { student_id: "S002", name: "Priya Patel", email: "priya@edu.com" },
  { student_id: "S003", name: "Arjun Reddy", email: "arjun@edu.com" },
  { student_id: "S004", name: "Sneha Gupta", email: "sneha@edu.com" },
  { student_id: "S005", name: "Vikram Singh", email: "vikram@edu.com" },
  { student_id: "S006", name: "Ananya Desai", email: "ananya@edu.com" },
  { student_id: "S007", name: "Rohan Kumar", email: "rohan@edu.com" },
  { student_id: "S008", name: "Kavya Nair", email: "kavya@edu.com" },
  { student_id: "S009", name: "Aditya Joshi", email: "aditya@edu.com" },
  { student_id: "S010", name: "Meera Iyer", email: "meera@edu.com" },
];

const topics = ["Arrays", "Recursion", "Linked Lists", "Sorting", "Trees", "Dynamic Programming", "Graphs", "Stacks"];

function generateInteractions(studentId: string, baseAccuracy: number, accuracyTrend: number, baseTime: number, baseRetries: number): Interaction[] {
  const interactions: Interaction[] = [];
  for (let week = 0; week < 12; week++) {
    const questionsPerWeek = 5 + Math.floor(Math.random() * 3);
    for (let q = 0; q < questionsPerWeek; q++) {
      const accuracy = Math.max(0.1, Math.min(1, baseAccuracy + accuracyTrend * week + (Math.random() - 0.5) * 0.15));
      interactions.push({
        student_id: studentId,
        question_id: `Q${week * 10 + q}`,
        correct_answer: Math.random() < accuracy,
        time_taken_seconds: Math.max(10, baseTime + (Math.random() - 0.4) * 30 + week * (baseTime > 60 ? 3 : -1)),
        retry_count: Math.max(0, Math.round(baseRetries + (Math.random() - 0.3) * 2 + week * (accuracyTrend < -0.02 ? 0.3 : 0))),
        timestamp: new Date(2026, 0, 6 + week * 7 + q).toISOString(),
        topic: topics[Math.floor(Math.random() * topics.length)],
      });
    }
  }
  return interactions;
}

// Student profiles with varying drift patterns
const studentProfiles = [
  { id: "S001", baseAcc: 0.85, trend: -0.04, time: 45, retries: 1 },  // High drift
  { id: "S002", baseAcc: 0.92, trend: -0.005, time: 35, retries: 0 }, // Stable
  { id: "S003", baseAcc: 0.78, trend: -0.025, time: 55, retries: 2 }, // Moderate drift
  { id: "S004", baseAcc: 0.95, trend: -0.002, time: 30, retries: 0 }, // Stable
  { id: "S005", baseAcc: 0.7,  trend: -0.035, time: 65, retries: 3 }, // High drift
  { id: "S006", baseAcc: 0.88, trend: -0.01, time: 40, retries: 1 },  // Low-moderate
  { id: "S007", baseAcc: 0.6,  trend: -0.05, time: 80, retries: 4 },  // High drift
  { id: "S008", baseAcc: 0.9,  trend: 0.005, time: 32, retries: 0 },  // Improving
  { id: "S009", baseAcc: 0.82, trend: -0.02, time: 50, retries: 2 },  // Moderate
  { id: "S010", baseAcc: 0.93, trend: -0.003, time: 28, retries: 0 }, // Stable
];

export const interactions: Interaction[] = studentProfiles.flatMap(p =>
  generateInteractions(p.id, p.baseAcc, p.trend, p.time, p.retries)
);

function computeDriftScore(studentId: string): DriftRecord {
  const si = interactions.filter(i => i.student_id === studentId);
  const half = Math.floor(si.length / 2);
  const first = si.slice(0, half);
  const second = si.slice(half);

  const avgAcc = (arr: Interaction[]) => arr.filter(i => i.correct_answer).length / arr.length;
  const avgTime = (arr: Interaction[]) => arr.reduce((s, i) => s + i.time_taken_seconds, 0) / arr.length;
  const avgRetries = (arr: Interaction[]) => arr.reduce((s, i) => s + i.retry_count, 0) / arr.length;

  const accDrop = Math.max(0, avgAcc(first) - avgAcc(second));
  const retryIncrease = Math.max(0, (avgRetries(second) - avgRetries(first)) / Math.max(1, avgRetries(first)));
  const timeVar = Math.max(0, (avgTime(second) - avgTime(first)) / Math.max(1, avgTime(first)));

  const score = Math.min(1, 0.4 * accDrop + 0.3 * Math.min(1, retryIncrease) + 0.3 * Math.min(1, timeVar));
  const rounded = Math.round(score * 100) / 100;

  return {
    student_id: studentId,
    drift_score: rounded,
    risk_level: rounded < 0.3 ? "Stable" : rounded < 0.6 ? "Moderate" : "High",
    last_updated: new Date().toISOString(),
  };
}

export const driftScores: DriftRecord[] = students.map(s => computeDriftScore(s.student_id));

export const alerts: Alert[] = driftScores
  .filter(d => d.drift_score > 0.6)
  .map(d => {
    const student = students.find(s => s.student_id === d.student_id)!;
    const studentInteractions = interactions.filter(i => i.student_id === d.student_id);
    const topicCounts: Record<string, number> = {};
    studentInteractions.filter(i => !i.correct_answer).forEach(i => {
      topicCounts[i.topic] = (topicCounts[i.topic] || 0) + 1;
    });
    const worstTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";

    return {
      id: `alert-${d.student_id}`,
      student_id: d.student_id,
      student_name: student.name,
      message: `Student ${student.name} showing significant concept drift in ${worstTopic} problems.`,
      topic: worstTopic,
      drift_score: d.drift_score,
      timestamp: d.last_updated,
      read: false,
    };
  });

// Helper to get student stats
export function getStudentStats(studentId: string) {
  const si = interactions.filter(i => i.student_id === studentId);
  const accuracy = si.filter(i => i.correct_answer).length / si.length;
  const avgTime = si.reduce((s, i) => s + i.time_taken_seconds, 0) / si.length;
  const totalAttempts = si.length;
  const drift = driftScores.find(d => d.student_id === studentId)!;

  // Weekly data for charts
  const weeklyData: { week: string; accuracy: number; avgTime: number; retries: number }[] = [];
  for (let w = 0; w < 12; w++) {
    const weekInteractions = si.filter((_, idx) => {
      const weekSize = Math.floor(si.length / 12);
      return idx >= w * weekSize && idx < (w + 1) * weekSize;
    });
    if (weekInteractions.length === 0) continue;
    weeklyData.push({
      week: `W${w + 1}`,
      accuracy: Math.round((weekInteractions.filter(i => i.correct_answer).length / weekInteractions.length) * 100),
      avgTime: Math.round(weekInteractions.reduce((s, i) => s + i.time_taken_seconds, 0) / weekInteractions.length),
      retries: Math.round(weekInteractions.reduce((s, i) => s + i.retry_count, 0) / weekInteractions.length * 10) / 10,
    });
  }

  return {
    accuracy: Math.round(accuracy * 100),
    avgTime: Math.round(avgTime),
    totalAttempts,
    driftScore: drift.drift_score,
    riskLevel: drift.risk_level,
    weeklyData,
  };
}

// Global stats
export function getGlobalStats() {
  const totalStudents = students.length;
  const atRisk = driftScores.filter(d => d.risk_level === "High").length;
  const avgDrift = Math.round((driftScores.reduce((s, d) => s + d.drift_score, 0) / driftScores.length) * 100) / 100;
  const activeAlerts = alerts.length;

  // Weekly accuracy across all students
  const weeklyAccuracy: { week: string; accuracy: number }[] = [];
  for (let w = 0; w < 12; w++) {
    const weekSize = Math.floor(interactions.length / 12);
    const weekInteractions = interactions.slice(w * weekSize, (w + 1) * weekSize);
    weeklyAccuracy.push({
      week: `W${w + 1}`,
      accuracy: Math.round((weekInteractions.filter(i => i.correct_answer).length / weekInteractions.length) * 100),
    });
  }

  // Drift distribution
  const driftDistribution = [
    { name: "Stable", value: driftScores.filter(d => d.risk_level === "Stable").length, fill: "hsl(var(--risk-stable))" },
    { name: "Moderate", value: driftScores.filter(d => d.risk_level === "Moderate").length, fill: "hsl(var(--risk-moderate))" },
    { name: "High", value: driftScores.filter(d => d.risk_level === "High").length, fill: "hsl(var(--risk-high))" },
  ];

  return { totalStudents, atRisk, avgDrift, activeAlerts, weeklyAccuracy, driftDistribution };
}
