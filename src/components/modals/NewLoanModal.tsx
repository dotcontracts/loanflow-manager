import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const loanSchema = z.object({
  borrowerId: z.string().min(1, "Please select a borrower"),
  principal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 10000, {
    message: "Principal must be at least KES 10,000",
  }),
  interestRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 50, {
    message: "Interest rate must be between 0 and 50%",
  }),
  duration: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
    message: "Duration must be at least 1 month",
  }),
  disbursementAccount: z.enum(["equity", "sidian"], {
    required_error: "Please select a disbursement account",
  }),
});

type LoanFormValues = z.infer<typeof loanSchema>;

// Mock data for borrowers dropdown
const mockBorrowers = [
  { id: "BR-001", name: "John Kamau" },
  { id: "BR-002", name: "Mary Wanjiku" },
  { id: "BR-003", name: "Peter Omondi" },
  { id: "BR-004", name: "Grace Njeri" },
  { id: "BR-005", name: "David Mutua" },
  { id: "BR-006", name: "Sarah Achieng" },
];

interface NewLoanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewLoanModal({ open, onOpenChange }: NewLoanModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      borrowerId: "",
      principal: "",
      interestRate: "15",
      duration: "6",
      disbursementAccount: "equity",
    },
  });

  const principal = Number(form.watch("principal")) || 0;
  const interestRate = Number(form.watch("interestRate")) || 0;
  const totalAmount = principal + (principal * interestRate / 100);

  const selectedBorrower = mockBorrowers.find((b) => b.id === form.watch("borrowerId"));

  const onSubmit = async (data: LoanFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Loan Created",
      description: `Successfully created loan of KES ${Number(data.principal).toLocaleString()} for ${selectedBorrower?.name}`,
    });
    
    setIsSubmitting(false);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Loan</DialogTitle>
          <DialogDescription>
            Set up a new loan for an existing borrower
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="borrowerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrower</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a borrower" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockBorrowers.map((borrower) => (
                        <SelectItem key={borrower.id} value={borrower.id}>
                          {borrower.name} ({borrower.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="principal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Amount (KES)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Months)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="6" {...field} />
                  </FormControl>
                  <FormDescription>
                    Loan repayment period in months
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disbursementAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disburse From</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="equity">Equity Bank</SelectItem>
                      <SelectItem value="sidian">Sidian Bank</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {principal > 0 && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Principal:</span>
                  <span className="font-medium">KES {principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Interest ({interestRate}%):</span>
                  <span className="font-medium">KES {(principal * interestRate / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
                  <span>Total Repayable:</span>
                  <span className="text-primary">KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Loan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
