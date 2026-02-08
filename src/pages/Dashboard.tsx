import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { LoanPerformanceChart } from "@/components/dashboard/LoanPerformanceChart";
import { LoanDistributionChart } from "@/components/dashboard/LoanDistributionChart";
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppLayout 
      title="Dashboard" 
      description="Overview of your loan portfolio and key metrics"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Outstanding"
          value={formatCurrency(12450000)}
          subtitle="Across 156 active loans"
          icon={Wallet}
          trend={{ value: 12.5, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Active Borrowers"
          value="234"
          subtitle="18 new this month"
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          variant="default"
        />
        <StatCard
          title="Collection Rate"
          value="94.2%"
          subtitle="Last 30 days"
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Overdue Loans"
          value="12"
          subtitle={formatCurrency(850000) + " at risk"}
          icon={AlertTriangle}
          trend={{ value: 3.4, isPositive: false }}
          variant="warning"
        />
      </div>

      {/* Bank Accounts Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bank-card equity">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              <span className="font-semibold">Equity Bank</span>
            </div>
            <Link to="/bank-accounts">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                View <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(4520000)}</p>
          <p className="text-sm text-white/70 mt-1">Available Balance</p>
        </Card>
        
        <Card className="bank-card sidian">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              <span className="font-semibold">Sidian Bank</span>
            </div>
            <Link to="/bank-accounts">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                View <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(2180000)}</p>
          <p className="text-sm text-white/70 mt-1">Available Balance</p>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LoanPerformanceChart />
        </div>
        <div>
          <LoanDistributionChart />
        </div>
      </div>

      <div className="mt-6">
        <RecentActivity />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
