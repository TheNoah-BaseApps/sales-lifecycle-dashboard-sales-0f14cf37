import StatsCard from '@/components/dashboard/StatsCard';
import FunnelChart from '@/components/dashboard/FunnelChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Website Visits" value="1,254" change="+12.3%" />
        <StatsCard title="Store Visits" value="842" change="+5.2%" />
        <StatsCard title="New Signups" value="142" change="+8.7%" />
        <StatsCard title="Active Users" value="2,841" change="+3.1%" />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Funnel Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <FunnelChart />
        </CardContent>
      </Card>
    </div>
  );
}