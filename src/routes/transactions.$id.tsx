import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { statusStyle } from "@/components/TxnRow";
import { CheckCircle2, Clock, XCircle, Download, Copy, Repeat } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/$id")({
  component: TxnDetail,
});

const statusIcon = { success: CheckCircle2, pending: Clock, failed: XCircle };

function TxnDetail() {
  const { id } = Route.useParams();
  const txn = useStore((s) => s.transactions.find((t) => t.id === id));
  if (!txn) throw notFound();
  const Icon = statusIcon[txn.status];
  const repeatLink =
    txn.kind === "airtime" ? "/airtime" :
    txn.kind === "data" ? "/data" :
    txn.kind === "electricity" ? "/electricity" :
    txn.kind === "cable" ? "/cable" : "/";

  function downloadReceipt() {
    const receipt = [
      "SMARTPAY — TRANSACTION RECEIPT",
      "================================",
      `Ref:      ${txn!.ref}`,
      `Date:     ${format(txn!.createdAt, "PPpp")}`,
      `Type:     ${txn!.kind.toUpperCase()}`,
      `Title:    ${txn!.title}`,
      `Details:  ${txn!.subtitle ?? ""}`,
      `Amount:   ${formatNaira(txn!.amount, { sign: true })}`,
      `Status:   ${txn!.status.toUpperCase()}`,
      txn!.token ? `Token:    ${txn!.token}` : "",
      txn!.providerName ? `Provider: ${txn!.providerName}` : "",
      "",
      "Thanks for using Smartpay.",
    ].filter(Boolean).join("\n");
    const url = URL.createObjectURL(new Blob([receipt], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url; a.download = `receipt-${txn!.ref}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <PageHeader title="Receipt" back="/transactions" />
      <div className="px-5 pb-8">
        <div className="rounded-3xl bg-surface p-6 ring-1 ring-border shadow-card">
          <div className="flex flex-col items-center text-center">
            <div className={`grid size-14 place-items-center rounded-full ring-4 ring-offset-2 ring-offset-surface ${
              txn.status === "success" ? "bg-emerald-500 text-white ring-emerald-500/20" :
              txn.status === "pending" ? "bg-amber-500 text-white ring-amber-500/20" :
              "bg-rose-500 text-white ring-rose-500/20"
            }`}>
              <Icon className="size-7" strokeWidth={2.5} />
            </div>
            <div className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${statusStyle[txn.status]}`}>
              {txn.status}
            </div>
            <div className="mt-3 text-3xl font-bold tabular-nums tracking-tight">
              {formatNaira(txn.amount, { sign: true })}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{txn.title}</div>
          </div>

          <dl className="mt-6 space-y-3 border-t border-dashed border-border pt-4 text-sm">
            <Row label="Reference" value={txn.ref} copy />
            <Row label="Date" value={format(txn.createdAt, "PPpp")} />
            <Row label="Details" value={txn.subtitle ?? "-"} />
            {txn.providerName && <Row label="Provider" value={txn.providerName} />}
            {txn.cashback ? <Row label="Cashback" value={formatNaira(txn.cashback, { sign: true })} /> : null}
            {txn.meta && Object.entries(txn.meta).map(([k, v]) => (
              <Row key={k} label={k} value={String(v)} />
            ))}
          </dl>

          {txn.token && (
            <div className="mt-5 rounded-2xl bg-primary-soft p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">Token</div>
              <div className="mt-1 font-mono text-lg font-bold tracking-widest text-primary">
                {txn.token}
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(txn.token!); toast.success("Token copied"); }}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                <Copy className="size-3" /> Copy
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={downloadReceipt}
            className="flex items-center justify-center gap-2 rounded-2xl bg-surface py-3 text-sm font-semibold ring-1 ring-border"
          >
            <Download className="size-4" /> Receipt
          </button>
          <Link
            to={repeatLink}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
          >
            <Repeat className="size-4" /> Repeat
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5 text-right text-sm font-medium">
        <span className="max-w-[200px] truncate">{value}</span>
        {copy && (
          <button onClick={() => { navigator.clipboard?.writeText(value); toast.success("Copied"); }}>
            <Copy className="size-3 text-muted-foreground" />
          </button>
        )}
      </dd>
    </div>
  );
}
