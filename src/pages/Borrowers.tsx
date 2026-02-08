import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddBorrowerModal } from "@/components/modals/AddBorrowerModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Phone,
  Mail,
  MapPin,
  CreditCard,
  LayoutGrid,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Borrower {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalLoans: number;
  activeLoans: number;
  totalBorrowed: number;
  totalRepaid: number;
  status: "active" | "inactive" | "blacklisted";
  joinDate: string;
}

const mockBorrowers: Borrower[] = [
  {
    id: "BR-001",
    name: "John Kamau",
    email: "john.kamau@email.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    totalLoans: 5,
    activeLoans: 1,
    totalBorrowed: 450000,
    totalRepaid: 380000,
    status: "active",
    joinDate: "2022-03-15",
  },
  {
    id: "BR-002",
    name: "Mary Wanjiku",
    email: "mary.wanjiku@email.com",
    phone: "+254 723 456 789",
    location: "Mombasa, Kenya",
    totalLoans: 3,
    activeLoans: 1,
    totalBorrowed: 320000,
    totalRepaid: 200000,
    status: "active",
    joinDate: "2022-06-20",
  },
  {
    id: "BR-003",
    name: "Peter Omondi",
    email: "peter.omondi@email.com",
    phone: "+254 734 567 890",
    location: "Kisumu, Kenya",
    totalLoans: 2,
    activeLoans: 1,
    totalBorrowed: 150000,
    totalRepaid: 75000,
    status: "active",
    joinDate: "2023-01-10",
  },
  {
    id: "BR-004",
    name: "Grace Njeri",
    email: "grace.njeri@email.com",
    phone: "+254 745 678 901",
    location: "Nakuru, Kenya",
    totalLoans: 4,
    activeLoans: 0,
    totalBorrowed: 280000,
    totalRepaid: 280000,
    status: "inactive",
    joinDate: "2021-08-05",
  },
  {
    id: "BR-005",
    name: "David Mutua",
    email: "david.mutua@email.com",
    phone: "+254 756 789 012",
    location: "Eldoret, Kenya",
    totalLoans: 6,
    activeLoans: 2,
    totalBorrowed: 520000,
    totalRepaid: 350000,
    status: "active",
    joinDate: "2021-11-22",
  },
  {
    id: "BR-006",
    name: "Sarah Achieng",
    email: "sarah.achieng@email.com",
    phone: "+254 767 890 123",
    location: "Nairobi, Kenya",
    totalLoans: 1,
    activeLoans: 1,
    totalBorrowed: 50000,
    totalRepaid: 20000,
    status: "active",
    joinDate: "2024-01-05",
  },
];

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  blacklisted: "bg-destructive/10 text-destructive border-destructive/20",
};

const Borrowers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddBorrowerOpen, setIsAddBorrowerOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredBorrowers = mockBorrowers.filter(borrower => 
    borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout 
      title="Borrowers" 
      description="Manage your client portfolio and their loan history"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex border border-border rounded-lg p-1">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button className="action-btn-primary" onClick={() => setIsAddBorrowerOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Borrower</span>
          </Button>
        </div>
      </div>

      <AddBorrowerModal 
        open={isAddBorrowerOpen} 
        onOpenChange={setIsAddBorrowerOpen}
      />

      {/* Borrowers Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBorrowers.map((borrower) => (
            <Card key={borrower.id} className="group hover:shadow-card-hover transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(borrower.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{borrower.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{borrower.id}</p>
                    </div>
                  </div>
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
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Create Loan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{borrower.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{borrower.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{borrower.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Active Loans</p>
                    <p className="text-lg font-semibold">{borrower.activeLoans}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Borrowed</p>
                    <p className="text-sm font-medium">{formatCurrency(borrower.totalBorrowed)}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", statusStyles[borrower.status])}
                  >
                    {borrower.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Borrower</th>
                <th>Contact</th>
                <th>Location</th>
                <th className="text-center">Loans</th>
                <th className="text-right">Total Borrowed</th>
                <th className="text-right">Total Repaid</th>
                <th>Status</th>
                <th className="w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowers.map((borrower) => (
                <tr key={borrower.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(borrower.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{borrower.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{borrower.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <p>{borrower.email}</p>
                      <p className="text-muted-foreground">{borrower.phone}</p>
                    </div>
                  </td>
                  <td className="text-sm text-muted-foreground">{borrower.location}</td>
                  <td className="text-center">
                    <span className="font-medium">{borrower.activeLoans}</span>
                    <span className="text-muted-foreground">/{borrower.totalLoans}</span>
                  </td>
                  <td className="text-right font-medium">{formatCurrency(borrower.totalBorrowed)}</td>
                  <td className="text-right text-success font-medium">{formatCurrency(borrower.totalRepaid)}</td>
                  <td>
                    <Badge 
                      variant="outline" 
                      className={cn("capitalize", statusStyles[borrower.status])}
                    >
                      {borrower.status}
                    </Badge>
                  </td>
                  <td>
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
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Create Loan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredBorrowers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-2">No borrowers found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Stats Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBorrowers.length} of {mockBorrowers.length} borrowers
        </p>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Active: </span>
            <span className="font-medium text-success">
              {mockBorrowers.filter(b => b.status === "active").length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Inactive: </span>
            <span className="font-medium">
              {mockBorrowers.filter(b => b.status === "inactive").length}
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Borrowers;
