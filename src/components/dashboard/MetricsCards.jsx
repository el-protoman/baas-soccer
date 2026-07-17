import React from "react";
import { Building2, Wallet, ArrowUpDown, ShieldCheck } from "lucide-react";

function Card({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-emerald-600 mt-2">{sub}</div>}
    </div>
  );
}

export default function MetricsCards({ clients, accounts, transactions }) {
  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const activeAccounts = accounts.filter((a) => a.status === "Active").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card icon={Building2} label="Fintech Clients" value={clients.length} sub="Sandbox integrations" />
      <Card icon={Wallet} label="Virtual Accounts" value={accounts.length} sub={`${activeAccounts} active`} />
      <Card
        icon={ShieldCheck}
        label="Total Ledger Balance"
        value={`$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
      />
      <Card icon={ArrowUpDown} label="Ledger Entries" value={transactions.length} sub="All time" />
    </div>
  );
}