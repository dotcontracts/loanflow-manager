import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  date: string;
  reference: string;
  loanId?: string;
  balance: number;
}

interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  lastUpdated: string;
  color: string;
  transactions: Transaction[];
}

const mockBankAccounts: BankAccount[] = [
  {
    id: "equity",
    name: "Equity Bank",
    bankName: "Equity Bank Kenya",
    accountNumber: "0123-456-789",
    balance: 4520000,
    lastUpdated: "2024-02-08 10:30 AM",
    color: "hsl(15, 80%, 45%)",
    transactions: [
      { id: "T001", type: "credit", description: "Loan repayment - John Kamau", amount: 15000, date: "2024-02-08", reference: "PAY-001", loanId: "LN-001", balance: 4520000 },
      { id: "T002", type: "debit", description: "Loan disbursement - Mary Wanjiku", amount: 250000, date: "2024-02-07", reference: "DIS-045", loanId: "LN-045", balance: 4505000 },
      { id: "T003", type: "credit", description: "Loan repayment - Sarah Achieng", amount: 10000, date: "2024-02-07", reference: "PAY-003", loanId: "LN-006", balance: 4755000 },
      { id: "T004", type: "credit", description: "Loan repayment - David Mutua", amount: 25000, date: "2024-02-04", reference: "PAY-006", loanId: "LN-005", balance: 4745000 },
      { id: "T005", type: "debit", description: "Operating expenses", amount: 15000, date: "2024-02-03", reference: "EXP-012", balance: 4720000 },
    ],
  },
  {
    id: "sidian",
    name: "Sidian Bank",
    bankName: "Sidian Bank Limited",
    accountNumber: "9876-543-210",
    balance: 2180000,
    lastUpdated: "2024-02-08 10:30 AM",
    color: "hsl(215, 70%, 35%)",
    transactions: [
      { id: "T101", type: "credit", description: "Loan repayment - David Mutua", amount: 25000, date: "2024-02-07", reference: "PAY-002", loanId: "LN-005", balance: 2180000 },
      { id: "T102", type: "credit", description: "Loan repayment - John Kamau", amount: 15000, date: "2024-02-05", reference: "PAY-005", loanId: "LN-001", balance: 2155000 },
      { id: "T103", type: "debit", description: "Loan disbursement - Peter Omondi", amount: 75000, date: "2024-02-03", reference: "DIS-046", loanId: "LN-047", balance: 2140000 },
      { id: "T104", type: "credit", description: "Transfer from Equity", amount: 500000, date: "2024-02-01", reference: "TRF-001", balance: 2215000 },
      { id: "T105", type: "debit", description: "Bank charges", amount: 2500, date: "2024-01-31", reference: "CHG-001", balance: 1715000 },
    ],
  },
];

const equityBalanceHistory = [
  { date: "Jan", balance: 3800000 },
  { date: "Feb 1", balance: 4100000 },
  { date: "Feb 8", balance: 4520000 },
];

const sidianBalanceHistory = [
  { date: "Jan", balance: 1600000 },
  { date: "Feb 1", balance: 1715000 },
  { date: "Feb 8", balance: 2180000 },
];

const BankAccounts = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>("equity");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

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

  const currentAccount = mockBankAccounts.find(acc => acc.id === selectedAccount)!;
  const balanceHistory = selectedAccount === "equity" ? equityBalanceHistory : sidianBalanceHistory;

  const filteredTransactions = currentAccount.transactions.filter(txn => {
    const matchesSearch = 
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || txn.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCredits = currentAccount.transactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = currentAccount.transactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppLayout 
      title="Bank Accounts" 
      description="Track balances and transactions for Equity and Sidian banks"
    >
      {/* Bank Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {mockBankAccounts.map((account) => (
          <Card 
            key={account.id}
            className={cn(
              "cursor-pointer transition-all duration-200 overflow-hidden",
              selectedAccount === account.id 
                ? "ring-2 ring-primary shadow-elevated" 
                : "hover:shadow-card-hover"
            )}
            onClick={() => setSelectedAccount(account.id)}
          >
            <div 
              className="h-2" 
              style={{ backgroundColor: account.color }}
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    <Building2 
                      className="w-6 h-6" 
                      style={{ color: account.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{account.name}</h3>
                    <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
                  </div>
                </div>
                {selectedAccount === account.id && (
                  <Badge className="bg-primary text-primary-foreground">Selected</Badge>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold text-foreground">{formatCurrency(account.balance)}</p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {account.lastUpdated}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Details */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(totalCredits)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Debits</p>
                  <p className="text-xl font-bold text-destructive">{formatCurrency(totalDebits)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Movement</p>
                  <p className={cn(
                    "text-xl font-bold",
                    totalCredits - totalDebits >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {totalCredits - totalDebits >= 0 ? "+" : ""}{formatCurrency(totalCredits - totalDebits)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credits</SelectItem>
                  <SelectItem value="debit">Debits</SelectItem>
                </SelectContent>
              </Select>
              <Button className="action-btn-primary" onClick={() => setIsAddTransactionOpen(true)}>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Transaction</span>
              </Button>
            </div>
            
            <AddTransactionModal 
              open={isAddTransactionOpen} 
              onOpenChange={setIsAddTransactionOpen}
              bankAccount={selectedAccount}
            />
          </div>

          {/* Transactions Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Loan ID</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(txn.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1 rounded",
                          txn.type === "credit" ? "bg-success/10" : "bg-destructive/10"
                        )}>
                          {txn.type === "credit" ? (
                            <ArrowDownRight className="w-4 h-4 text-success" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                        <span className="font-medium">{txn.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {txn.reference}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {txn.loanId || "-"}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-semibold",
                      txn.type === "credit" ? "text-success" : "text-destructive"
                    )}>
                      {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(txn.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Balance History - {currentAccount.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={currentAccount.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={currentAccount.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
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
                      dataKey="balance"
                      stroke={currentAccount.color}
                      strokeWidth={2}
                      fill="url(#balanceGradient)"
                      name="Balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default BankAccounts;
