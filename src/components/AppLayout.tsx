import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell } from "lucide-react";
import { alerts } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <SidebarTrigger className="ml-1" />
            <button
              onClick={() => navigate("/alerts")}
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Bell className="h-5 w-5" />
              {alerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {alerts.length}
                </span>
              )}
            </button>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
