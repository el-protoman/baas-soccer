import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

function randomDigits(length) {
  let result = "";
  for (let i = 0; i < length; i++) result += Math.floor(Math.random() * 10);
  return result;
}

export default function ProvisionAccountForm({ open, onOpenChange, clients, onSuccess }) {
  const [holderName, setHolderName] = useState("");
  const [clientId, setClientId] = useState("");
  const [accountType, setAccountType] = useState("Checking");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setHolderName("");
    setClientId("");
    setAccountType("Checking");
    setInitialDeposit("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!holderName || !clientId) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await base44.entities.VirtualAccount.create({
        account_holder_name: holderName,
        fintech_client_id: clientId,
        account_type: accountType,
        balance: Number(initialDeposit) || 0,
        account_number: randomDigits(10),
        routing_number: randomDigits(9),
        status: "Active",
      });
      reset();
      onOpenChange(false);
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Provision Virtual Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="holderName">Account Holder Name</Label>
            <Input id="holderName" value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a fintech client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Checking">Checking</SelectItem>
                <SelectItem value="Savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialDeposit">Initial Deposit</Label>
            <Input id="initialDeposit" type="number" min="0" step="0.01" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value)} placeholder="0.00" />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Provision Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}