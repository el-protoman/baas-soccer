import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { ShieldCheck, PlusCircle, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MetricsCards from "@/components/dashboard/MetricsCards";
import VirtualAccountsTable from "@/components/dashboard/VirtualAccountsTable";
import TransactionStream from "@/components/dashboard/TransactionStream";
import ProvisionAccountForm from "@/components/dashboard/ProvisionAccountForm";
import SimulateLedgerForm from "@/components/dashboard/SimulateLedgerForm";
import DeveloperCredentialsCard from "@/components/dashboard/DeveloperCredentialsCard";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);

  const loadData = useCallback(async () => {
    const [clientsData, accountsData, transactionsData] = await Promise.all([
      base44.entities.FintechClient.list("-created_date"),
      base44.entities.VirtualAccount.list("-created_date"),
      base44.entities.TransactionLedger.list("-timestamp", 50),
    ]);
    setClients(clientsData);
    setAccounts(accountsData);
    setTransactions(transactionsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = base44.entities.TransactionLedger.subscribe(() => loadData());
    return unsubscribe;
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">BaaS Developer Platform</h1>
            <p className="text-xs text-slate-500">Sandbox environment</p>
          </div>
          <Button variant="outline" onClick={() => setSimulateOpen(true)}>
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Simulate Ledger Entry
          </Button>
          <Button onClick={() => setProvisionOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Provision Account
          </Button>
        </div>
      </header>

      <ProvisionAccountForm
        open={provisionOpen}
        onOpenChange={setProvisionOpen}
        clients={clients}
        onSuccess={loadData}
      />
      <SimulateLedgerForm
        open={simulateOpen}
        onOpenChange={setSimulateOpen}
        accounts={accounts}
        onSuccess={loadData}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <MetricsCards clients={clients} accounts={accounts} transactions={transactions} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <VirtualAccountsTable accounts={accounts} clients={clients} />
          </div>
          <div className="lg:col-span-2">
            <TransactionStream transactions={transactions} accounts={accounts} />
          </div>
        </div>
        <DeveloperCredentialsCard />
      </main>
    </div>
  );
}