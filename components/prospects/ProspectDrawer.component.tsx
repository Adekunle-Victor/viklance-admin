"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchProspect, updateProspect, updateProspectStatus, updateProspectNotes, markProspectDemoReady, sendProspectEmail } from "@/store/slices/prospects.slice";
import { Prospect, ProspectStatus, PROSPECT_STATUSES, STATUS_COLORS } from "@/lib/prospects.types";
import toast from "react-hot-toast";

interface ProspectDrawerProps {
  prospect:  Prospect;
  isAdmin:   boolean;
  onClose:   () => void;
  onUpdated: (updated: Prospect) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProspectDrawer({ prospect, isAdmin, onClose, onUpdated }: ProspectDrawerProps) {
  const dispatch = useAppDispatch();
  const [busy,         setBusy]        = useState(false);
  const [editNotes,    setEditNotes]   = useState(false);
  const [notes,        setNotes]       = useState(prospect.notes ?? "");
  const [editDetails,  setEditDetails] = useState(false);
  const [editName,     setEditName]    = useState(prospect.name);
  const [editPhone,    setEditPhone]   = useState(prospect.phone ?? "");
  const [editEmail,    setEditEmail]   = useState(prospect.email ?? "");
  const [frontendDemoUrl, setFrontendDemoUrl] = useState(prospect.frontend_demo_url ?? "");
  const [adminDemoUrl,    setAdminDemoUrl]    = useState(prospect.admin_demo_url ?? "");
  const [demoEmailCred,   setDemoEmailCred]   = useState(prospect.demo_email ?? "");
  const [demoPasswordCred,setDemoPasswordCred]= useState(prospect.demo_password ?? "");
  const [demoSaving,      setDemoSaving]      = useState(false);
  const [outreachType,     setOutreachType]    = useState<"demo" | "proposal" | "followup" | null>(null);
  const [outreachMessage,  setOutreachMessage] = useState("");
  const [businessType,     setBusinessType]    = useState<"ecommerce" | "dealership">("ecommerce");
  const [emailSending,     setEmailSending]    = useState(false);
  const [statusOpen,      setStatusOpen]      = useState(false);
  const [pendingStatus,   setPendingStatus]   = useState<ProspectStatus>(prospect.status);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(fetchProspect(prospect.id)).then((result) => {
      if (fetchProspect.fulfilled.match(result)) onUpdated(result.payload);
    });
  }, [prospect.id]);

  const saveDetails = async () => {
    if (!editName.trim() || busy) return;
    setBusy(true);
    const result = await dispatch(updateProspect({
      id:    prospect.id,
      name:  editName.trim(),
      phone: editPhone.trim() || undefined,
      email: editEmail.trim() || undefined,
    }));
    setBusy(false);
    if (updateProspect.fulfilled.match(result)) {
      toast.success("Prospect updated");
      setEditDetails(false);
      onUpdated(result.payload as Prospect);
    } else {
      toast.error((result.payload as string) || "Update failed");
    }
  };

  const sendEmail = async () => {
    if (!outreachType || emailSending) return;
    setEmailSending(true);
    const result = await dispatch(sendProspectEmail({
      id:           prospect.id,
      type:         outreachType,
      businessType,
      message:      outreachMessage.trim() || undefined,
    }));
    setEmailSending(false);
    if (sendProspectEmail.fulfilled.match(result)) {
      toast.success(`${outreachType === "demo" ? "Demo" : outreachType === "proposal" ? "Proposal" : "Follow-up"} email sent to ${prospect.email}`);
      setOutreachType(null);
      setOutreachMessage("");
    } else {
      toast.error((result.payload as string) || "Failed to send");
    }
  };

  const saveDemoReady = async () => {
    if ((!frontendDemoUrl.trim() && !adminDemoUrl.trim()) || demoSaving) return;
    setDemoSaving(true);
    const result = await dispatch(markProspectDemoReady({
      id:                prospect.id,
      frontend_demo_url: frontendDemoUrl.trim(),
      admin_demo_url:    adminDemoUrl.trim(),
      demo_email:        demoEmailCred.trim() || undefined,
      demo_password:     demoPasswordCred.trim() || undefined,
    }));
    setDemoSaving(false);
    if (markProspectDemoReady.fulfilled.match(result)) {
      toast.success(`Demo ready — ${prospect.assigned_name} notified`);
      onUpdated(result.payload as Prospect);
    } else {
      toast.error("Failed");
    }
  };

  const changeStatus = async (status: ProspectStatus) => {
    if (status === prospect.status || busy) return;
    setBusy(true);
    const result = await dispatch(updateProspectStatus({ id: prospect.id, status }));
    setBusy(false);
    if (updateProspectStatus.fulfilled.match(result)) {
      toast.success(`Moved to "${status}"`);
      onUpdated(result.payload as Prospect);
    } else {
      toast.error("Update failed");
    }
  };

  const saveNotes = async () => {
    setBusy(true);
    const result = await dispatch(updateProspectNotes({ id: prospect.id, notes }));
    setBusy(false);
    if (updateProspectNotes.fulfilled.match(result)) {
      toast.success("Notes saved");
      setEditNotes(false);
      onUpdated(result.payload as Prospect);
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
          <p className="text-sm font-black text-neutral-900">Prospect Detail</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-white">{prospect.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-black text-neutral-900">{prospect.name}</p>
              <a
                href={`https://instagram.com/${prospect.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-500 hover:text-neutral-900 hover:underline transition-colors"
              >
                @{prospect.instagram_handle}
              </a>
            </div>
            <span className={`ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[prospect.status]}`}>
              {prospect.status}
            </span>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Details</p>
              {!editDetails && (
                <button
                  onClick={() => setEditDetails(true)}
                  className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {editDetails ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border border-neutral-300 rounded-xl px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="—"
                    className="border border-neutral-300 rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="—"
                    className="border border-neutral-300 rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={busy || !editName.trim()}
                    onClick={saveDetails}
                    className="flex-1 bg-neutral-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditDetails(false);
                      setEditName(prospect.name);
                      setEditPhone(prospect.phone ?? "");
                      setEditEmail(prospect.email ?? "");
                    }}
                    className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-neutral-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Email",   value: prospect.email ?? "—",           full: true  },
                  { label: "Phone",   value: prospect.phone ?? "—",           full: false },
                  { label: "Added",   value: formatDate(prospect.created_at), full: false },
                  { label: "Updated", value: formatDate(prospect.updated_at), full: false },
                  ...(isAdmin ? [{ label: "Rep", value: prospect.assigned_name, full: true }] : []),
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
                <button
                  onClick={() => setEditNotes(true)}
                  className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            {editNotes ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors resize-none"
                  placeholder="Add notes about this prospect..."
                />
                <div className="flex gap-2">
                  <button
                    disabled={busy}
                    onClick={saveNotes}
                    className="flex-1 bg-neutral-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditNotes(false); setNotes(prospect.notes ?? ""); }}
                    className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-neutral-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 border border-neutral-200 rounded-xl p-4 min-h-16">
                {prospect.notes || <span className="text-neutral-400 italic">No notes yet.</span>}
              </p>
            )}
          </div>

          {/* Demo section */}
          {(isAdmin || prospect.demo_ready) && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Demo</p>
                {prospect.demo_ready && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                )}
              </div>

              {/* Staff: read-only demo links */}
              {!isAdmin && prospect.demo_ready && (
                <div className="flex flex-col gap-2">
                  {prospect.frontend_demo_url && (
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Frontend</p>
                      <a
                        href={prospect.frontend_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-neutral-900 hover:underline break-all"
                      >
                        {prospect.frontend_demo_url}
                      </a>
                    </div>
                  )}
                  {prospect.admin_demo_url && (
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Admin</p>
                      <a
                        href={prospect.admin_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-neutral-900 hover:underline break-all"
                      >
                        {prospect.admin_demo_url}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Admin: editable demo controls */}
              {isAdmin && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Frontend Demo URL</label>
                    <input
                      type="url"
                      value={frontendDemoUrl}
                      onChange={(e) => setFrontendDemoUrl(e.target.value)}
                      placeholder="https://demo.viklance.dev/..."
                      className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Admin Demo URL</label>
                    <input
                      type="url"
                      value={adminDemoUrl}
                      onChange={(e) => setAdminDemoUrl(e.target.value)}
                      placeholder="https://admin.viklance.dev/..."
                      className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Demo Login Email</label>
                      <input
                        type="email"
                        value={demoEmailCred}
                        onChange={(e) => setDemoEmailCred(e.target.value)}
                        placeholder="demo@example.com"
                        className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">Demo Password</label>
                      <input
                        type="text"
                        value={demoPasswordCred}
                        onChange={(e) => setDemoPasswordCred(e.target.value)}
                        placeholder="••••••••"
                        className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={saveDemoReady}
                    disabled={demoSaving || (!frontendDemoUrl.trim() && !adminDemoUrl.trim())}
                    className="flex items-center justify-center gap-2 bg-neutral-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40"
                  >
                    {demoSaving ? (
                      <>
                        <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18" strokeDashoffset="8" strokeLinecap="round" />
                        </svg>
                        Saving…
                      </>
                    ) : prospect.demo_ready ? (
                      "Update Demo Links"
                    ) : (
                      `Mark Ready & Notify ${prospect.assigned_name.split(" ")[0]}`
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Outreach — super admin only */}
          {isAdmin && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Outreach</p>

              {!prospect.email && (
                <p className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
                  No email address on file — add one in Details to enable outreach.
                </p>
              )}

              {/* Business type toggle */}
              <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1 self-start">
                {(["ecommerce", "dealership"] as const).map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setBusinessType(bt)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                      businessType === bt ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    {bt === "ecommerce" ? "E-Commerce" : "Car Dealership"}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(["demo", "proposal", "followup"] as const).map((t) => {
                  const labels = { demo: "Demo Email", proposal: "Proposal", followup: "Follow Up" };
                  const active = outreachType === t;
                  return (
                    <button
                      key={t}
                      disabled={!prospect.email}
                      onClick={() => { setOutreachType(active ? null : t); setOutreachMessage(""); }}
                      className={`text-[11px] font-bold py-2.5 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        active
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white"
                      }`}
                    >
                      {labels[t]}
                    </button>
                  );
                })}
              </div>

              {outreachType && (
                <div className="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 bg-neutral-50">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Template preview</p>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {outreachType === "demo" && businessType === "ecommerce" && <>Introduces Viklance Orbit LTD, presents the online store built for {prospect.name}, walks through demo access with URLs and login credentials, explains Paystack test mode, covers 4 key benefits, offers a guided tour, and asks for a reply since the app is live on our servers.</>}
                      {outreachType === "demo" && businessType === "dealership" && <>Introduces Viklance Orbit LTD, presents the vehicle listing platform built for {prospect.name}'s dealership, walks through demo access with URLs and login credentials, explains how to browse inventory and manage stock, and asks for a reply since the platform is live on our servers.</>}
                      {outreachType === "proposal" && <>Thanks {prospect.name} for looking at the demo, presents the full project proposal covering scope, timeline and investment, highlights senior-level delivery, and asks for a reply to get contracts sorted.</>}
                      {outreachType === "followup" && businessType === "ecommerce" && <>Checks in with {prospect.name}, notes the first email may have landed in Promotions, reminds them the web app is still live on our servers, and asks for a reply either way.</>}
                      {outreachType === "followup" && businessType === "dealership" && <>Checks in with {prospect.name}, notes the first email may have landed in Promotions, reminds them the vehicle platform is still live on our servers, and asks for a reply either way.</>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">
                      Add a personal note <span className="normal-case font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={outreachMessage}
                      onChange={(e) => setOutreachMessage(e.target.value)}
                      placeholder="Add any extra context or a personal message..."
                      className="w-full border border-neutral-300 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors resize-none placeholder:text-neutral-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={emailSending}
                      onClick={sendEmail}
                      className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    >
                      {emailSending ? (
                        <>
                          <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18" strokeDashoffset="8" strokeLinecap="round" />
                          </svg>
                          Sending…
                        </>
                      ) : "Send Email ↗"}
                    </button>
                    <button
                      onClick={() => { setOutreachType(null); setOutreachMessage(""); }}
                      className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-neutral-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status update */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Update Status</p>
            <div ref={statusRef} className="relative">
              <button
                disabled={busy}
                onClick={() => setStatusOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-3 border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-500 transition-colors disabled:opacity-50"
              >
                <span>{pendingStatus}</span>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={`shrink-0 text-neutral-400 transition-transform ${statusOpen ? "rotate-180" : ""}`}
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {statusOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                  {PROSPECT_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setPendingStatus(s); setStatusOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-neutral-50 ${pendingStatus === s ? "font-semibold text-neutral-900 bg-neutral-50" : "font-medium text-neutral-600"}`}
                    >
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
            <button
              disabled={busy || pendingStatus === prospect.status}
              onClick={() => changeStatus(pendingStatus)}
              className="w-full bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40"
            >
              Update Status
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 shrink-0 flex gap-3">
          <a
            href={`https://instagram.com/${prospect.instagram_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 rounded-xl text-center hover:border-neutral-400 transition-colors"
          >
            Instagram ↗
          </a>
          <button
            onClick={onClose}
            className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 rounded-xl hover:border-neutral-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
