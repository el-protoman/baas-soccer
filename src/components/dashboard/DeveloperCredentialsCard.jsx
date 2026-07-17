import React, { useState } from "react";
import { KeyRound, RefreshCw, Webhook, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

function randomSecret() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "sk_sandbox_";
  for (let i = 0; i < 32; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function CredentialRow({ label, value, action }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-mono text-slate-900 mt-0.5">{value}</div>
      </div>
      {action}
    </div>
  );
}

export default function DeveloperCredentialsCard() {
  const [clientId] = useState("client_fb_8b3a1e7d24f0");
  const [secret, setSecret] = useState(randomSecret());
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const rotateSecret = () => {
    setSecret(randomSecret());
    setRevealed(true);
  };

  const copySecret = async () => {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const maskedSecret = `${secret.slice(0, 11)}${"•".repeat(20)}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Developer Credentials</h2>
            <p className="text-xs text-slate-500">Sandbox API access</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Webhook className="w-3 h-3" />
          Webhook Active
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        <CredentialRow label="Client ID" value={clientId} />
        <CredentialRow
          label="API Secret Key"
          value={revealed ? secret : maskedSecret}
          action={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={copySecret}>
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={rotateSecret}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
}