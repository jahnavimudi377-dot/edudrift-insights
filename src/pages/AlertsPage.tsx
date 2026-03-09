import { alerts } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Bell } from "lucide-react";

const AlertsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Alerts</h1>
        <p className="text-sm text-muted-foreground">Automated notifications for concept drift detection</p>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">No active alerts. All students are performing within expected ranges.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => navigate(`/student/${alert.student_id}`)}
              className="rounded-lg border bg-card p-4 hover:bg-accent/30 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-destructive/10 p-2 text-destructive mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{alert.student_name}</p>
                    <RiskBadge level="High" />
                    <span className="text-xs text-muted-foreground ml-auto">Drift: {alert.drift_score}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">Topic: {alert.topic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
