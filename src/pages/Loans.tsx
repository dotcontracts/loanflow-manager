import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewLoanModal } from "@/components/modals/NewLoanModal";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreHorizontal, 
  Eye, 
  Edit, 
  Receipt,
  Filter,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Loan {
  id: string;
  borrowerName: string;
  borrowerId: string;
  principal: number;
  interestRate: number;
  totalAmount: number;
  paidAmount: number;
  status: "active" | "pending" | "overdue" | "completed";
  disbursementDate: string;
  dueDate: string;
  nextPaymentDate: string;
}

const mockLoans: Loan[] = [
  {
    id: "LN-001",
    borrowerName: "John Kamau",
    borrowerId: "BR-001",
    principal: 100000,
    interestRate: 15,
    totalAmount: 115000,
    paidAmount: 45000,
    status: "active",
    disbursementDate: "2024-01-15",
    dueDate: "2024-07-15",
    nextPaymentDate: "2024-02-15",
  },
  {
    id: "LN-002",
    borrowerName: "Mary Wanjiku",
    borrowerId: "BR-002",
    principal: 250000,
    interestRate: 12,
    totalAmount: 280000,
    paidAmount: 0,
    status: "pending",
    disbursementDate: "2024-02-01",
    dueDate: "2024-08-01",
    nextPaymentDate: "2024-03-01",
  },
  {
    id: "LN-003",
    borrowerName: "Peter Omondi",
    borrowerId: "BR-003",
    principal: 75000,
    interestRate: 18,
    totalAmount: 88500,
    paidAmount: 30000,
    status: "overdue",
    disbursementDate: "2023-10-20",
    dueDate: "2024-01-20",
    nextPaymentDate: "2024-01-20",
  },
  {
    id: "LN-004",
    borrowerName: "Grace Njeri",
    borrowerId: "BR-004",
    principal: 150000,
    interestRate: 14,
    totalAmount: 171000,
    paidAmount: 171000,
    status: "completed",
    disbursementDate: "2023-06-10",
    dueDate: "2023-12-10",
    nextPaymentDate: "-",
  },
  {
    id: "LN-005",
    borrowerName: "David Mutua",
    borrowerId: "BR-005",
    principal: 200000,
    interestRate: 15,
    totalAmount: 230000,
    paidAmount: 115000,
    status: "active",
    disbursementDate: "2023-11-05",
    dueDate: "2024-05-05",
    nextPaymentDate: "2024-02-05",
  },
  {
    id: "LN-006",
    borrowerName: "Sarah Achieng",
    borrowerId: "BR-006",
    principal: 50000,
    interestRate: 20,
    totalAmount: 60000,
    paidAmount: 20000,
    status: "active",
    disbursementDate: "2024-01-20",
    dueDate: "2024-04-20",
    nextPaymentDate: "2024-02-20",
  },
];

const statusStyles = {
  active: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-success/10 text-success border-success/20",
};

const Loans = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (dateString === "-") return "-";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredLoans = mockLoans.filter(loan => {
    const matchesSearch = 
      loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProgress = (paid: number, total: number) => {
    return Math.round((paid / total) * 100);
  };

  return (
    <AppLayout 
      title="Loans" 
      description="Manage and track all loans in your portfolio"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by borrower name or loan ID..." 
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button className="action-btn-primary" onClick={() => setIsNewLoanOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Loan</span>
          </Button>
        </div>
      </div>

      <NewLoanModal 
        open={isNewLoanOpen} 
        onOpenChange={setIsNewLoanOpen}
      />

      {/* Loans Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Loan ID</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-center">Rate</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id} className="group">
                <TableCell className="font-mono text-sm font-medium">
                  {loan.id}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{loan.borrowerName}</p>
                    <p className="text-xs text-muted-foreground">{loan.borrowerId}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(loan.principal)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm">{loan.interestRate}%</span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(loan.totalAmount)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {formatCurrency(loan.paidAmount)}
                      </span>
                      <span className="font-medium">
                        {getProgress(loan.paidAmount, loan.totalAmount)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          loan.status === "completed" ? "bg-success" :
                          loan.status === "overdue" ? "bg-destructive" : "bg-primary"
                        )}
                        style={{ width: `${getProgress(loan.paidAmount, loan.totalAmount)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", statusStyles[loan.status])}
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(loan.nextPaymentDate)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Loan
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Receipt className="w-4 h-4 mr-2" />
                        Record Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredLoans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">No loans found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLoans.length} of {mockLoans.length} loans
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

export default Loans;
