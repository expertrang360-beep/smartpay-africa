import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { TxnRow } from "@/components/TxnRow";
import { useStore } from "@/lib/store";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/")({ component: TxnList });

const FILTERS = ["All", "Success", "Pending", "Failed"] as const;

function TxnList() {
  const { transactions } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const list = useMemo(() => {
    return transactions.filter((t) => {
      if (filter !== "All" && t.status !== filter.toLowerCase()) return false;
      if (!q) return true;
      const s = `${t.title} ${t.subtitle ?? ""} ${t.ref}`.toLowerCase();
      return s.includes(q.toLowerCase());
    });
  }, [transactions, q, filter]);

  function exportCSV() {
    const rows = [
      ["Date", "Title", "Details", "Kind", "Amount", "Status", "Ref"],
      ...list.map((t) => [
        new Date(t.createdAt).toISOString(),
        t.title,
        t.subtitle ?? "",
        t.kind,
        t.amount.toString(),
        t.status,
        t.ref,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "payroxa-transactions.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  }

  return (
    <AppShell>
      <PageHeader title="Transactions" back="/" />
      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-3 py-2.5 ring-1 ring-border focus-within:ring-primary">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, phone, ref…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${
                filter === f ? "bg-primary text-primary-foreground ring-primary" : "bg-surface text-muted-foreground ring-border"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={exportCSV}
            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-foreground ring-1 ring-border"
          >
            <Download className="size-3" /> CSV
          </button>
        </div>
      </div>

      <div className="space-y-2 px-5 py-5">
        {list.length === 0 && (
          <div className="rounded-2xl bg-muted/40 p-8 text-center text-xs text-muted-foreground">
            No transactions match.
          </div>
        )}
        {list.map((t) => <TxnRow key={t.id} txn={t} />)}
      </div>
    </AppShell>
  );
}
