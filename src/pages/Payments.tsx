import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecordPaymentModal } from "@/components/modals/RecordPaymentModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Receipt,
  TrendingUp,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";

interface Payment {
  id: string;
  loanId: string;
  borrowerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: "cash" | "bank_transfer" | "mobile_money";
  status: "completed" | "pending" | "failed";
  receiptNumber: string;
  bankAccount: "equity" | "sidian";
}

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    loanId: "LN-001",
    borrowerName: "John Kamau",
    amount: 15000,
    paymentDate: "2024-02-08",
    paymentMethod: "mobile_money",
    status: "completed",
    receiptNumber: "RCP-2024-001",
    bankAccount: "equity",
  },
  {
    id: "PAY-002",
    loanId: "LN-005",
    borrowerName: "David Mutua",
    amount: 25000,
    paymentDate: "2024-02-07",
    paymentMethod: "bank_transfer",
    status: "completed",
    receiptNumber: "RCP-2024-002",
    bankAccount: "sidian",
  },
  {
    id: "PAY-003",
    loanId: "LN-006",
    borrowerName: "Sarah Achieng",
    amount: 10000,
    paymentDate: "2024-02-07",
    paymentMethod: "cash",
    status: "completed",
    receiptNumber: "RCP-2024-003",
    bankAccount: "equity",
  },
  {
    id: "PAY-004",
    loanId: "LN-003",
    borrowerName: "Peter Omondi",
    amount: 8500,
    paymentDate: "2024-02-06",
    paymentMethod: "mobile_money",
    status: "pending",
    receiptNumber: "-",
    bankAccount: "equity",
  },
  {
    id: "PAY-005",
    loanId: "LN-001",
    borrowerName: "John Kamau",
    amount: 15000,
    paymentDate: "2024-02-05",
    paymentMethod: "bank_transfer",
    status: "completed",
    receiptNumber: "RCP-2024-004",
    bankAccount: "sidian",
  },
  {
    id: "PAY-006",
    loanId: "LN-005",
    borrowerName: "David Mutua",
    amount: 25000,
    paymentDate: "2024-02-04",
    paymentMethod: "cash",
    status: "completed",
    receiptNumber: "RCP-2024-005",
    bankAccount: "equity",
  },
  {
    id: "PAY-007",
    loanId: "LN-002",
    borrowerName: "Mary Wanjiku",
    amount: 35000,
    paymentDate: "2024-02-03",
    paymentMethod: "mobile_money",
    status: "failed",
    receiptNumber: "-",
    bankAccount: "sidian",
  },
];

const statusStyles = {
  completed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const methodLabels = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  mobile_money: "M-Pesa",
};

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = 
      payment.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = mockPayments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppLayout 
      title="Payments" 
      description="Track and manage all loan payments"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Collections"
          value={formatCurrency(15000)}
          subtitle="1 payment received"
          icon={Receipt}
          variant="success"
        />
        <StatCard
          title="This Week"
          value={formatCurrency(98500)}
          subtitle="7 payments processed"
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Total Collected"
          value={formatCurrency(totalCollected)}
          subtitle="All time"
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          title="Pending"
          value={formatCurrency(pendingAmount)}
          subtitle="Awaiting confirmation"
          icon={CheckCircle2}
          variant="warning"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by borrower, loan ID, or payment ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button className="action-btn-primary" onClick={() => setIsRecordPaymentOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Record Payment</span>
          </Button>
        </div>
      </div>

      <RecordPaymentModal 
        open={isRecordPaymentOpen} 
        onOpenChange={setIsRecordPaymentOpen}
      />

      {/* Payments Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Payment ID</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Loan</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id} className="group">
                <TableCell className="font-mono text-sm font-medium">
                  {payment.id}
                </TableCell>
                <TableCell className="font-medium">
                  {payment.borrowerName}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {payment.loanId}
                </TableCell>
                <TableCell className="text-right font-semibold text-success">
                  +{formatCurrency(payment.amount)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(payment.paymentDate)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{methodLabels[payment.paymentMethod]}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "capitalize text-xs",
                      payment.bankAccount === "equity" 
                        ? "bg-orange-500/10 text-orange-600 border-orange-500/20" 
                        : "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    {payment.bankAccount === "equity" ? "Equity" : "Sidian"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", statusStyles[payment.status])}
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.receiptNumber !== "-" ? (
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      {payment.receiptNumber}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPayments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">No payments found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPayments.length} of {mockPayments.length} payments
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Payments;
