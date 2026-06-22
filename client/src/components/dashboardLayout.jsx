import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center px-6 shadow-soft">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                AgriSmart Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
