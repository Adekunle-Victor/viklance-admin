"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccount, updateAccount, updateAccountStatus, updateAccountNotes, markAccountDemoReady, sendAccountEmail } from "@/store/slices/accounts.slice";
import { Account, AccountStatus, ACCOUNT_STATUSES, STATUS_COLORS, SOURCES, PRODUCTS, SOURCE_COLORS } from "@/lib/accounts.types";
import toast from "react-hot-toast";

interface AccountDrawerProps {
  account:   Account;
  isAdmin:   boolean;
  onClose:   () => void;
  onUpdated: (updated: Account) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function AccountDrawer({ account, isAdmin, onClose, onUpdated }: AccountDrawerProps) {
  const dispatch = useAppDispatch();
  const [busy,          setBusy]         = useState(false);
  const [editNotes,     setEditNotes]    = useState(false);
  const [notes,         setNotes]        = useState(account.notes ?? "");
  const [editDetails,   setEditDetails]  = useState(false);
  const [editName,      setEditName]     = useState(account.name);
  const [editContact,   setEditContact]  = useState(account.contact_person ?? "");
  const [editPhone,     setEditPhone]    = useState(account.phone ?? "");
  const [editEmail,     setEditEmail]    = useState(account.email ?? "");
  const [editSource,    setEditSource]   = useState(account.source);
  const [editProduct,   setEditProduct]  = useState(account.product);
  const [frontendUrl,   setFrontendUrl]  = useState("");
  const [adminUrl,      setAdminUrl]     = useState("");
  const [demoEmail,     setDemoEmail]    = useState("");
  const [demoPassword,  setDemoPassword] = useState("");
  const [demoSaving,    setDemoSaving]   = useState(false);
  const [outreachType,  setOutreachType] = useState<"demo" | "proposal" | "followup" | null>(null);
  const [outreachMsg,   setOutreachMsg]  = useState("");
  const [emailSending,  setEmailSending] = useState(false);
  const [statusOpen,    setStatusOpen]   = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AccountStatus>(account.status);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    dispatch(fetchAccount(account.id)).then((result) => {
      if (fetchAccount.fulfilled.match(result)) onUpdated(result.payload);
    });
  }, [account.id]);

  const saveDetails = async () => {
    if (!editName.trim() || busy) return;
    setBusy(true);
    const result = await dispatch(updateAccount({
      id:             account.id,
      name:           editName.trim(),
      contact_person: editContact.trim() || undefined,
      phone:          editPhone.trim()   || undefined,
      email:          editEmail.trim()   || undefined,
      source:         editSource,
      product:        editProduct,
    }));
    setBusy(false);
    if (updateAccount.fulfilled.match(result)) {
      toast.success("Account updated");
      setEditDetails(false);
      onUpdated(result.payload as Account);
    } else {
      toast.error((result.payload as string) || "Update failed");
    }
  };

  const sendEmail = async () => {
    if (!outreachType || emailSending) return;
    setEmailSending(true);
    const result = await dispatch(sendAccountEmail({ id: account.id, type: outreachType, message: outreachMsg.trim() || undefined }));
    setEmailSending(false);
    if (sendAccountEmail.fulfilled.match(result)) {
      toast.success(`${outreachType === "demo" ? "Demo" : outreachType === "proposal" ? "Proposal" : "Follow-up"} email sent to ${account.email}`);
      setOutreachType(null);
      setOutreachMsg("");
    } else {
      toast.error((result.payload as string) || "Failed to send");
    }
  };

  const saveDemoReady = async () => {
    if ((!frontendUrl.trim() && !adminUrl.trim()) || demoSaving) return;
    setDemoSaving(true);
    const result = await dispatch(markAccountDemoReady({
      id:                account.id,
      frontend_demo_url: frontendUrl.trim(),
      admin_demo_url:    adminUrl.trim(),
      demo_email:        demoEmail.trim()    || undefined,
      demo_password:     demoPassword.trim() || undefined,
    }));
    setDemoSaving(false);
    if (markAccountDemoReady.fulfilled.match(result)) {
      toast.success(`Demo ready — ${account.assigned_name} notified`);
    } else {
      toast.error("Failed");
    }
  };

  const changeStatus = async (status: AccountStatus) => {
    if (status === account.status || busy) return;
    setBusy(true);
    const result = await dispatch(updateAccountStatus({ id: account.id, status }));
    setBusy(false);
    if (updateAccountStatus.fulfilled.match(result)) {
      toast.success(`Moved to "${status}"`);
      onUpdated(result.payload as Account);
    } else {
      toast.error("Update failed");
    }
  };

  const saveNotes = async () => {
    setBusy(true);
    const result = await dispatch(updateAccountNotes({ id: account.id, notes }));
    setBusy(false);
    if (updateAccountNotes.fulfilled.match(result)) {
      toast.success("Notes saved");
      setEditNotes(false);
      onUpdated(result.payload as Account);
    } else {
      toast.error("Save failed");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-xl">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 shrink-0">
          <p className="text-sm font-black text-neutral-900">Account Detail</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Identity */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-white">{account.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-neutral-900 truncate">{account.name}</p>
              {account.contact_person && <p className="text-sm text-neutral-500">{account.contact_person}</p>}
              <div className="flex gap-2 mt-1.5 flex-wrap">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[account.status]}`}>
                  {account.status}
                </span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${SOURCE_COLORS[account.source]}`}>
                  {account.source}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-neutral-50 text-neutral-600 border-neutral-200">
                  {account.product}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Details</p>
              {!editDetails && (
                <button onClick={() => setEditDetails(true)} className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors">Edit</button>
              )}
            </div>

            {editDetails ? (
              <div className="flex flex-col gap-3">
                {[
                  { label: "Name *",         value: editName,    set: setEditName,    type: "text",  ph: "Company or person name" },
                  { label: "Contact Person", value: editContact, set: setEditContact, type: "text",  ph: "e.g. Jane Doe" },
                  { label: "Phone",          value: editPhone,   set: setEditPhone,   type: "tel",   ph: "+234 800 000 0000" },
                  { label: "Email",          value: editEmail,   set: setEditEmail,   type: "email", ph: "contact@company.com" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">{f.label}</label>
                    <input type={f.type} value={f.value} onChange={(e) => (f.set as (v: string) => void)(e.target.value)} placeholder={f.ph}
                      className="border border-neutral-300 rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Source</label>
                    <select value={editSource} onChange={(e) => setEditSource(e.target.value as typeof editSource)}
                      className="border border-neutral-300 rounded-xl px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors bg-white">
                      {SOURCES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Product</label>
                    <select value={editProduct} onChange={(e) => setEditProduct(e.target.value as typeof editProduct)}
                      className="border border-neutral-300 rounded-xl px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors bg-white">
                      {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button disabled={busy || !editName.trim()} onClick={saveDetails}
                    className="flex-1 bg-neutral-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50">Save</button>
                  <button onClick={() => setEditDetails(false)}
                    className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-neutral-400 transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Email",   value: account.email ?? "—",          full: true  },
                  { label: "Phone",   value: account.phone ?? "—",          full: false },
                  { label: "Added",   value: formatDate(account.created_at), full: false },
                  { label: "Updated", value: formatDate(account.updated_at), full: false },
                  ...(isAdmin ? [{ label: "Rep", value: account.assigned_name, full: true }] : []),
                ].map((d) => (
                  <div key={d.label} className={`bg-neutral-50 border border-neutral-200 rounded-xl p-3 ${d.full ? "col-span-2" : ""}`}>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">{d.label}</p>
                    <p className="text-sm font-semibold text-neutral-900 break-all">{d.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Notes</p>
              {!editNotes && (
                <button onClick={() => setEditNotes(true)} className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors">Edit</button>
              )}
            </div>
            {editNotes ? (
              <div className="flex flex-col gap-2">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors resize-none"
                  placeholder="Notes about this account…" />
                <div className="flex gap-2">
                  <button disabled={busy} onClick={saveNotes}
                    className="flex-1 bg-neutral-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50">Save</button>
                  <button onClick={() => { setEditNotes(false); setNotes(account.notes ?? ""); }}
                    className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-neutral-400 transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 border border-neutral-200 rounded-xl p-4 min-h-16">
                {account.notes || <span className="text-neutral-400 italic">No notes yet.</span>}
              </p>
            )}
          </div>

          {/* Demo section (admin only) */}
          {isAdmin && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Demo</p>
              {[
                { label: "Frontend Demo URL", value: frontendUrl, set: setFrontendUrl, ph: "https://demo.viklance.dev/…" },
                { label: "Admin Demo URL",    value: adminUrl,    set: setAdminUrl,    ph: "https://admin.viklance.dev/…" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">{f.label}</label>
                  <input type="url" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                    className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500 transition-colors" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Demo Login Email", value: demoEmail,    set: setDemoEmail,    type: "email", ph: "demo@example.com" },
                  { label: "Demo Password",    value: demoPassword, set: setDemoPassword, type: "text",  ph: "••••••••" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">{f.label}</label>
                    <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                      className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500 transition-colors" />
                  </div>
                ))}
              </div>
              <button onClick={saveDemoReady} disabled={demoSaving || (!frontendUrl.trim() && !adminUrl.trim())}
                className="flex items-center justify-center gap-2 bg-neutral-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40">
                {demoSaving ? (
                  <>
                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18" strokeDashoffset="8" strokeLinecap="round" />
                    </svg>
                    Saving…
                  </>
                ) : `Notify ${account.assigned_name.split(" ")[0]}`}
              </button>
            </div>
          )}

          {/* Outreach (admin only) */}
          {isAdmin && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Outreach</p>
              {!account.email && (
                <p className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
                  No email address on file — add one in Details to enable outreach.
                </p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {(["demo", "proposal", "followup"] as const).map((t) => {
                  const labels = { demo: "Demo Email", proposal: "Proposal", followup: "Follow Up" };
                  const active = outreachType === t;
                  return (
                    <button key={t} disabled={!account.email}
                      onClick={() => { setOutreachType(active ? null : t); setOutreachMsg(""); }}
                      className={`text-[11px] font-bold py-2.5 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                        ${active ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white"}`}>
                      {labels[t]}
                    </button>
                  );
                })}
              </div>

              {outreachType && (
                <div className="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 bg-neutral-50">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">
                      Personal note <span className="normal-case font-normal">(optional)</span>
                    </label>
                    <textarea rows={3} value={outreachMsg} onChange={(e) => setOutreachMsg(e.target.value)}
                      placeholder="Add any extra context…"
                      className="w-full border border-neutral-300 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors resize-none placeholder:text-neutral-400" />
                  </div>
                  <div className="flex gap-2">
                    <button disabled={emailSending} onClick={sendEmail}
                      className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50">
                      {emailSending ? (
                        <>
                          <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18" strokeDashoffset="8" strokeLinecap="round" />
                          </svg>
                          Sending…
                        </>
                      ) : "Send Email ↗"}
                    </button>
                    <button onClick={() => { setOutreachType(null); setOutreachMsg(""); }}
                      className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-neutral-400 transition-colors">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status update */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Update Status</p>
            <div ref={statusRef} className="relative">
              <button disabled={busy} onClick={() => setStatusOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-3 border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-500 transition-colors disabled:opacity-50">
                <span>{pendingStatus}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={`shrink-0 text-neutral-400 transition-transform ${statusOpen ? "rotate-180" : ""}`}>
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {statusOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                  {ACCOUNT_STATUSES.map((s) => (
                    <button key={s} onClick={() => { setPendingStatus(s); setStatusOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-neutral-50 ${pendingStatus === s ? "font-semibold text-neutral-900 bg-neutral-50" : "font-medium text-neutral-600"}`}>
                      {s}
                      {pendingStatus === s && (
                        <svg className="shrink-0 text-neutral-400" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button disabled={busy || pendingStatus === account.status} onClick={() => changeStatus(pendingStatus)}
              className="w-full bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40">
              Update Status
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-200 shrink-0 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 rounded-xl text-center hover:border-neutral-400 transition-colors">
            Close
          </button>
        </div>
      </div>
    </>
  );
}
