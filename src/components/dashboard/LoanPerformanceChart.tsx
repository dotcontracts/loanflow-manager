import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", disbursed: 1200000, collected: 980000 },
  { month: "Feb", disbursed: 1500000, collected: 1150000 },
  { month: "Mar", disbursed: 1800000, collected: 1420000 },
  { month: "Apr", disbursed: 1650000, collected: 1380000 },
  { month: "May", disbursed: 2100000, collected: 1750000 },
  { month: "Jun", disbursed: 1950000, collected: 1680000 },
];

export function LoanPerformanceChart() {
  const formatCurrency = (value: number) => {
    return `KES ${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Loan Performance</CardTitle>
        <p className="text-xs text-muted-foreground">Disbursements vs Collections (Last 6 months)</p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="disbursedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(215, 70%, 35%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(215, 70%, 35%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(175, 60%, 40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(175, 60%, 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 20%, 88%)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="disbursed"
                stroke="hsl(215, 70%, 35%)"
                strokeWidth={2}
                fill="url(#disbursedGradient)"
                name="Disbursed"
              />
              <Area
                type="monotone"
                dataKey="collected"
                stroke="hsl(175, 60%, 40%)"
                strokeWidth={2}
                fill="url(#collectedGradient)"
                name="Collected"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Disbursed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">Collected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
