import React, { useState, useMemo } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FILTERS = ["All", "ACH", "Wire", "Card"];

export default function TransactionStream({ transactions, accounts }) {
  const [filter, setFilter] = useState("All");

  const holderName = (accountId) =>
    accounts.find((a) => a.id === accountId)?.account_holder_name || "Unknown account";

  const filteredTransactions = useMemo(
    () => (filter === "All" ? transactions : transactions.filter((t) => t.type === filter)),
    [transactions, filter]
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Transaction Ledger</h2>
          <p className="text-sm text-slate-500 mt-0.5">Live stream of sandbox activity</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>
      <div className="px-6 py-3 border-b border-slate-100">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f} value={f} className="text-xs">
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="divide-y divide-slate-50 max-h-[520px] overflow-y-auto">
        {filteredTransactions.length === 0 && (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">No transactions found.</div>
        )}
        {filteredTransactions.map((t) => (
          <div key={t.id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  t.direction === "Credit" ? "bg-emerald-50" : "bg-rose-50"
                }`}
              >
                {t.direction === "Credit" ? (
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">
                  {t.description || `${t.type} ${t.direction}`}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {holderName(t.virtual_account_id)} · {t.type} ·{" "}
                  {t.timestamp ? format(new Date(t.timestamp), "MMM d, h:mm a") : "—"}
                </div>
              </div>
            </div>
            <div className={`text-sm font-semibold ${t.direction === "Credit" ? "text-emerald-600" : "text-rose-600"}`}>
              {t.direction === "Credit" ? "+" : "-"}${(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}