"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProspects } from "@/store/slices/prospects.slice";
import { bulkSend, importDemo } from "@/store/slices/outreach.slice";
import toast from "react-hot-toast";
import { useRouter }      from "next/navigation";

type EmailType    = "demo" | "proposal" | "followup";
type BusinessType = "ecommerce" | "dealership";

const TYPE_LABELS: Record<EmailType, string>    = { demo: "Demo Email", proposal: "Proposal", followup: "Follow Up" };
const BIZ_LABELS:  Record<BusinessType, string> = { ecommerce: "E-Commerce", dealership: "Car Dealership" };

export default function OutreachPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const user     = useAppSelector((s) => s.auth.user);
  const { items, loading } = useAppSelector((s) => s.prospects);
  const { loading: sending, importing } = useAppSelector((s) => s.outreach);

  const [emailType,    setEmailType]    = useState<EmailType>("followup");
  const [businessType, setBusinessType] = useState<BusinessType>("ecommerce");
  const [selected,     setSelected]     = useState<Set<number>>(new Set());
  const [message,      setMessage]      = useState("");
  const [csvRows,      setCsvRows]      = useState<{ name: string; frontend_demo_url: string; admin_demo_url: string; demo_email: string; demo_password: string }[]>([]);
  const [csvFileName,  setCsvFileName]  = useState<string | null>(null);

  const isAdmin = user?.user_metadata?.role === "super_admin";

  useEffect(() => {
    if (!isAdmin) { router.replace("/dashboard"); return; }
    dispatch(fetchProspects({}));
  }, [dispatch, isAdmin]);

  const prospects = items.filter((p) => !!p.email);

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === prospects.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(prospects.map((p) => p.id)));
    }
  };

  const handleSend = async () => {
    if (selected.size === 0 || sending) return;
    const result = await dispatch(bulkSend({
      prospectIds:  Array.from(selected),
      type:         emailType,
      businessType,
      message:      message.trim() || undefined,
    }));
    if (bulkSend.fulfilled.match(result)) {
      toast.success(`Sent to ${result.payload.sent} prospect${result.payload.sent !== 1 ? "s" : ""} — ${TYPE_LABELS[emailType]} · ${BIZ_LABELS[businessType]}`);
      setSelected(new Set());
      setMessage("");
    } else {
      toast.error((result.payload as string) || "Send failed");
    }
  };

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text  = (ev.target?.result as string) ?? "";
      const lines = text.trim().split("\n");
      const rows  = lines.slice(1).map((line) => {
        const [name, frontend_demo_url, admin_demo_url, demo_email, demo_password] =
          line.split(",").map((f) => f.trim());
        return { name: name ?? "", frontend_demo_url: frontend_demo_url ?? "", admin_demo_url: admin_demo_url ?? "", demo_email: demo_email ?? "", demo_password: demo_password ?? "" };
      }).filter((r) => r.name);
      setCsvRows(rows);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (csvRows.length === 0 || importing) return;
    const result = await dispatch(importDemo(csvRows));
    if (importDemo.fulfilled.match(result)) {
      const { updated, notFound } = result.payload;
      const msg = notFound.length > 0
        ? `Updated ${updated} · Not found: ${notFound.join(", ")}`
        : `Updated ${updated} prospect${updated !== 1 ? "s" : ""}`;
      toast.success(msg, { duration: 6000 });
      setCsvRows([]);
      setCsvFileName(null);
    } else {
      toast.error((result.payload as string) || "Import failed");
    }
  };

  const downloadTemplate = () => {
    const csv  = "name,frontend_demo_url,admin_demo_url,demo_email,demo_password\n,,,," ;
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "demo-import-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Outreach</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {loading ? "Loading prospects…" : `${prospects.length} prospect${prospects.length !== 1 ? "s" : ""} with an email address`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — prospect list */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Select all bar */}
          <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selected.size > 0 && selected.size === prospects.length}
                ref={(el) => { if (el) el.indeterminate = selected.size > 0 && selected.size < prospects.length; }}
                onChange={toggleAll}
                className="w-4 h-4 accent-neutral-900 cursor-pointer"
              />
              <span className="text-sm font-semibold text-neutral-700">
                {selected.size === 0 ? "Select all" : `${selected.size} selected`}
              </span>
            </label>
            {selected.size > 0 && (
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Prospect rows */}
          {loading ? (
            <div className="text-sm text-neutral-400 px-1">Loading…</div>
          ) : prospects.length === 0 ? (
            <div className="text-sm text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-6 text-center">
              No prospects have an email address yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {prospects.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border cursor-pointer transition-all select-none ${
                    selected.has(p.id)
                      ? "bg-neutral-900 border-neutral-900 text-white"
                      : "bg-white border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleOne(p.id)}
                    className="w-4 h-4 accent-neutral-900 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={`text-sm font-bold truncate ${selected.has(p.id) ? "text-white" : "text-neutral-900"}`}>
                      {p.name}
                    </span>
                    <span className={`text-xs truncate ${selected.has(p.id) ? "text-neutral-300" : "text-neutral-500"}`}>
                      @{p.instagram_handle} · {p.email}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    selected.has(p.id) ? "bg-neutral-700 text-neutral-200" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {p.status}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Right — send panel */}
        <div className="flex flex-col gap-4">
          <div className="border border-neutral-200 rounded-2xl p-5 flex flex-col gap-5 bg-white sticky top-6">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Send Options</p>

            {/* Business type */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-neutral-700">Business Type</p>
              <div className="flex gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1">
                {(["ecommerce", "dealership"] as BusinessType[]).map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setBusinessType(bt)}
                    className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${
                      businessType === bt ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    {BIZ_LABELS[bt]}
                  </button>
                ))}
              </div>
            </div>

            {/* Email type */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-neutral-700">Email Type</p>
              <div className="flex flex-col gap-1.5">
                {(["demo", "proposal", "followup"] as EmailType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setEmailType(t)}
                    className={`w-full text-left text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all ${
                      emailType === t
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional note */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-neutral-700">Add a note <span className="font-normal text-neutral-400">(optional)</span></p>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any extra context to include in the email…"
                className="w-full border border-neutral-300 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors resize-none placeholder:text-neutral-400"
              />
            </div>

            {/* Send button */}
            <button
              disabled={selected.size === 0 || sending}
              onClick={handleSend}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18" strokeDashoffset="8" strokeLinecap="round" />
                  </svg>
                  Sending…
                </>
              ) : selected.size === 0 ? "Select prospects to send" : `Send to ${selected.size} prospect${selected.size !== 1 ? "s" : ""} ↗`}
            </button>
          </div>
        </div>
      </div>

      {/* CSV Import */}
      <div className="border border-neutral-200 rounded-2xl p-5 flex flex-col gap-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Import Demo Data</p>
            <p className="text-xs text-neutral-400 mt-0.5">Upload a CSV to bulk-set demo URLs and credentials on prospects</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-2"
          >
            Download template
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 cursor-pointer hover:border-neutral-500 transition-colors text-sm text-neutral-600 font-medium select-none">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 6l3-3 3 3M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {csvFileName ?? "Choose CSV file"}
            <input type="file" accept=".csv" className="sr-only" onChange={handleCsvFile} />
          </label>

          {csvRows.length > 0 && (
            <span className="text-xs text-neutral-500 font-medium">
              {csvRows.length} row{csvRows.length !== 1 ? "s" : ""} ready to import
            </span>
          )}

          <button
            disabled={csvRows.length === 0 || importing}
            onClick={handleImport}
            className="ml-auto flex items-center gap-2 bg-neutral-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {importing ? (
              <>
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18" strokeDashoffset="8" strokeLinecap="round" />
                </svg>
                Importing…
              </>
            ) : "Upload & Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
