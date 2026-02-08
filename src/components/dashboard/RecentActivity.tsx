import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LoanActivityItem {
  id: string;
  borrowerName: string;
  action: "disbursed" | "payment" | "overdue" | "completed";
  amount: number;
  date: string;
  loanId: string;
}

const mockActivities: LoanActivityItem[] = [
  { id: "1", borrowerName: "John Kamau", action: "payment", amount: 15000, date: "2 hours ago", loanId: "LN-001" },
  { id: "2", borrowerName: "Mary Wanjiku", action: "disbursed", amount: 250000, date: "5 hours ago", loanId: "LN-045" },
  { id: "3", borrowerName: "Peter Omondi", action: "overdue", amount: 8500, date: "1 day ago", loanId: "LN-023" },
  { id: "4", borrowerName: "Grace Njeri", action: "completed", amount: 100000, date: "2 days ago", loanId: "LN-019" },
  { id: "5", borrowerName: "David Mutua", action: "payment", amount: 25000, date: "2 days ago", loanId: "LN-031" },
];

const actionStyles = {
  disbursed: { label: "Disbursed", class: "bg-info/10 text-info border-info/20" },
  payment: { label: "Payment", class: "bg-success/10 text-success border-success/20" },
  overdue: { label: "Overdue", class: "bg-destructive/10 text-destructive border-destructive/20" },
  completed: { label: "Completed", class: "bg-primary/10 text-primary border-primary/20" },
};

export function RecentActivity() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.borrowerName}
                </p>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs px-2 py-0", actionStyles[activity.action].class)}
                >
                  {actionStyles[activity.action].label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{activity.loanId}</span>
                <span>•</span>
                <span>{activity.date}</span>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-sm font-semibold",
                activity.action === "payment" || activity.action === "completed" 
                  ? "text-success" 
                  : activity.action === "overdue" 
                    ? "text-destructive" 
                    : "text-foreground"
              )}>
                {activity.action === "payment" ? "+" : ""}{formatCurrency(activity.amount)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
