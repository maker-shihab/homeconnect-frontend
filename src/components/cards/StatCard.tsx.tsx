import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  trend?: 'positive' | 'negative';
}

export function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-gray-500">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">
          {description}
          {trend === 'positive' && <span className="text-green-500 ml-1">▲</span>}
          {trend === 'negative' && <span className="text-red-500 ml-1">▼</span>}
        </p>
      </CardContent>
    </Card>
  );
}