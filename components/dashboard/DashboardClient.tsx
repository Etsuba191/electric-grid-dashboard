"use client";
import { useState, useEffect } from "react";
import { LeafletMap } from "@/components/dashboard/leaflet-map";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopStats } from "@/components/dashboard/top-stats";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { SearchFilters } from "@/components/dashboard/search-filters";
import { GridStatus } from "@/components/pages/grid-status";
import { Analytics } from "@/components/pages/analytics";
import { AlertsPage } from "@/components/pages/alerts";
import { UsersPage } from "@/components/pages/users";
import { SettingsPage } from "@/components/pages/settings";
import { AboutPage } from "@/components/pages/about";
import { Toaster } from "@/components/ui/toaster";
import { convertToEthiopianGridAssets } from "@/lib/processed-data";

export default function DashboardClient({
  userEmail,
  userRole: initialUserRole,
}: {
  userEmail: string;
  userRole: "admin" | "user";
}) {
  const [userRole, setUserRole] = useState<"admin" | "user">(initialUserRole);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mapCenter] = useState<[number, number]>([9.145, 40.4897]);
  const [mapZoom] = useState<number>(7);
  const [filters, setFilters] = useState({
    location: "",
    assetType: "",
    alertSeverity: "",
    searchQuery: "",
  });
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [gridAssets, setGridAssets] = useState<any[]>([]);
  const [zoneData, setZoneData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedDate(new Date());
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/grid-data?type=assets");
        const data = await res.json();
        setGridAssets(data.assets || []);
        setZoneData(null);
      } catch (error) {
        console.error("Failed to load grid assets:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addAsset = async (asset: any) => {
    const res = await fetch("/api/grid-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_asset", data: asset }),
    });
    if (res.ok) {
      const { asset: newAsset } = await res.json();
      setGridAssets((prev) => [...prev, newAsset]);
    }
  };

  const updateAsset = async (id: string, updates: any) => {
    const res = await fetch("/api/grid-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_asset", assetId: id, data: updates }),
    });
    if (res.ok) {
      const { asset: updated } = await res.json();
      setGridAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
    }
  };

  const deleteAsset = async (id: string) => {
    const res = await fetch("/api/grid-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_asset", assetId: id }),
    });
    if (res.ok) {
      setGridAssets((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-foreground text-xl">Loading Grid Data...</div>
        </div>
      );
    }

    switch (currentPage) {
      case "grid":
        return <GridStatus assets={gridAssets} />;
      case "analytics":
        return <Analytics assets={gridAssets} />;
      case "alerts":
        const ethiopianGridAssets = convertToEthiopianGridAssets(gridAssets);
        return <AlertsPage assets={ethiopianGridAssets} />;
      case "users":
        return <UsersPage />;
      case "settings":
        return <SettingsPage assets={gridAssets} />;
      case "about":
        return <AboutPage assets={gridAssets} />;
      case "map":
        return <LeafletMap assets={gridAssets} zoneData={zoneData} filters={filters} userRole={userRole} />;
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            <SearchFilters assets={gridAssets} filters={filters} onFiltersChange={setFilters} userRole={userRole} />
            <TopStats assets={gridAssets} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <ChartsSection filters={filters} selectedDate={selectedDate!} userRole={userRole} />
              </div>
              <div className="space-y-4 md:space-y-6">
                {selectedDate && <CalendarWidget selectedDate={selectedDate} onDateChange={setSelectedDate} assets={gridAssets} />}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={userRole}
        onRoleChange={setUserRole}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0 md:ml-16"} overflow-auto`}>
        <div className="p-3 md:p-6">{renderCurrentPage()}</div>
      </main>
      <Toaster />
    </div>
  );
}
