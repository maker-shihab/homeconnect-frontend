import { ProtectedRoute } from "@/components/protected-route";
import { PropertiesDashboardClient } from "./PropertiesDashboardClient";


export default function DashboardPropertiesPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <PropertiesDashboardClient />
    </ProtectedRoute>
  );
}