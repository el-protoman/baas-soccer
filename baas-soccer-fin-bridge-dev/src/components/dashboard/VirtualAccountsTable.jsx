import React from "react";

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Frozen: "bg-sky-50 text-sky-700 border-sky-200",
};

function maskAccountNumber(number) {
  if (!number) return "—";
  const last4 = number.slice(-4);
  return `${"*".repeat(Math.max(number.length - 4, 6))}${last4}`;
}

export default function VirtualAccountsTable({ accounts, clients }) {
  const clientName = (id) => clients.find((c) => c.id === id)?.company_name || "—";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Virtual Accounts</h2>
        <p className="text-sm text-slate-500 mt-0.5">Active accounts provisioned across all clients</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="px-6 py-3 font-medium">Holder</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Account No.</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium text-right">Balance</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No virtual accounts yet.
                </td>
              </tr>
            )}
            {accounts.map((a) => (
              <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{a.account_holder_name}</td>
                <td className="px-6 py-4 text-slate-600">{clientName(a.fintech_client_id)}</td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs tracking-wider">{maskAccountNumber(a.account_number)}</td>
                <td className="px-6 py-4 text-slate-600">{a.account_type}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  ${(a.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[a.status] || ""}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}