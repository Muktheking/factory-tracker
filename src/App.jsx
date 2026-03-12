import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CONFIG — paste your project URL and anon key here
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://gtgwnvtckrnhzbjodgvd.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Z3dudnRja3JuaHpiam9kZ3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTAzNDAsImV4cCI6MjA4ODc4NjM0MH0.4-7mYTWKjabHOlvNMuNJ3o_pzhDDoGd_2XFDwIbGvNc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─────────────────────────────────────────────────────────────────────────────
// WeCom Backend
// ─────────────────────────────────────────────────────────────────────────────
const BACKEND_URL = "";

async function sendNotification(endpoint, payload) {
  if (!BACKEND_URL) return { ok: false, error: "Backend not configured" };
  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) { return { ok: false, error: err.message }; }
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase helpers
// ─────────────────────────────────────────────────────────────────────────────
const db = {
  // FACTORIES
  async getFactories()          { const { data } = await supabase.from("factories").select("*").order("name"); return data || []; },
  async upsertFactory(f)        { const { data } = await supabase.from("factories").upsert(f).select().single(); return data; },
  async deleteFactory(id)       { await supabase.from("factories").delete().eq("id", id); },

  // USERS
  async getUsers()              { const { data } = await supabase.from("users").select("*").order("full_name"); return data || []; },
  async upsertUser(u)           { const { data } = await supabase.from("users").upsert(u).select().single(); return data; },
  async deleteUser(id)          { await supabase.from("users").delete().eq("id", id); },

  // DEVELOPMENTS
  async getDevs() {
    const { data: devs } = await supabase.from("developments").select("*").order("created_date", { ascending: false });
    if (!devs) return [];
    const ids = devs.map(d => d.id);
    const { data: updates } = await supabase.from("development_updates").select("*").in("development_id", ids).order("created_date", { ascending: false });
    const { data: messages } = await supabase.from("development_messages").select("*").in("development_id", ids).order("created_date", { ascending: true });
    return devs.map(d => ({
      ...d,
      updates:  (updates  || []).filter(u => u.development_id === d.id),
      messages: (messages || []).filter(m => m.development_id === d.id),
    }));
  },
  async upsertDev(d)            { const { data } = await supabase.from("developments").upsert(d).select().single(); return data; },
  async deleteDev(id)           { await supabase.from("developments").delete().eq("id", id); },
  async insertUpdate(u)         { const { data } = await supabase.from("development_updates").insert(u).select().single(); return data; },
  async insertMessage(m)        { const { data } = await supabase.from("development_messages").insert(m).select().single(); return data; },

  // VISITS
  async getVisits()             { const { data } = await supabase.from("visits").select("*").order("visit_date", { ascending: false }); return data || []; },
  async upsertVisit(v)          { const { data } = await supabase.from("visits").upsert(v).select().single(); return data; },
  async deleteVisit(id)         { await supabase.from("visits").delete().eq("id", id); },
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const DEV_STATUS_CSS = {
  open: "bg-blue-100 text-blue-800", in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
};
const DEV_STATUS_LABEL = { open: "Open", in_progress: "In Progress", completed: "Completed", cancelled: "Cancelled" };
const MAT_LABEL = { not_started: "Not Started", sourcing: "Sourcing", ordered: "Ordered", received: "Received", unavailable: "Unavailable" };
const ROLE_CSS  = { admin: "bg-purple-100 text-purple-700", user: "bg-blue-100 text-blue-700", supplier: "bg-orange-100 text-orange-700" };

function genId(prefix) {
  return prefix + Date.now().toString(36).toUpperCase().slice(-4) + Math.random().toString(36).slice(2,5).toUpperCase();
}
function daysAgo(d) {
  if (!d) return 0;
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}
function fmtDate(d, withTime) {
  if (!d) return "—";
  const opts = { day: "2-digit", month: "short", year: "numeric" };
  if (withTime) { opts.hour = "2-digit"; opts.minute = "2-digit"; }
  return new Date(d).toLocaleDateString("en-GB", opts);
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
const Icon = {
  plus:      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  search:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  eye:       <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  edit:      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  building:  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  users:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  flask:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 3h6l1 9H8L9 3z"/><path d="M6.3 15a6 6 0 1 0 11.4 0l-1.3-3H7.6l-1.3 3z"/></svg>,
  clipboard: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  grid:      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  pin:       <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  calendar:  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  box:       <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  user:      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  phone:     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 10.1a16 16 0 0 0 5.91 5.91l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  camera:    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  back:      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  upload:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  alert:     <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  wechat:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.601-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045.246.246 0 00.246-.246.226.226 0 00-.04-.177l-.325-1.233a.491.491 0 01.177-.554 6.257 6.257 0 002.501-4.324c0-3.373-3.11-6.165-7.066-6.418zm-2.25 2.796c.535 0 .969.441.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.983.969-.983zm4.5 0c.535 0 .969.441.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.983.969-.983z"/></svg>,
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI Components
// ─────────────────────────────────────────────────────────────────────────────
function Badge({ children, className }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>;
}

function Btn({ children, onClick, variant = "dark", size = "md", disabled, type = "button", className = "" }) {
  const sizes    = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    dark: "bg-slate-800 hover:bg-slate-900 text-white shadow-md shadow-slate-900/20",
    amber: "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/30",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
    outline: "bg-white border border-slate-200 hover:border-slate-300 text-slate-700",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    purple: "bg-purple-500 hover:bg-purple-600 text-white shadow-md shadow-purple-500/30",
    white: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all cursor-pointer border-0 ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white text-slate-800 text-sm placeholder:text-slate-400 ${className}`} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white text-slate-800 text-sm placeholder:text-slate-400 resize-none" />
  );
}

function Select({ value, onChange, children, className = "" }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 bg-white text-slate-800 text-sm cursor-pointer ${className}`}>
      {children}
    </select>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl shadow-sm ${className}`}>{children}</div>;
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6">{subtitle}</p>
      {action}
    </div>
  );
}

function PhotoUpload({ url, onChange, label = "Photo", small }) {
  const handleFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(f);
  };
  return (
    <div>
      <Label>{label}</Label>
      {url ? (
        <div className="relative rounded-xl overflow-hidden">
          <img src={url} alt="" className={`w-full object-cover ${small ? "h-32" : "h-48"}`} />
          <label className="absolute bottom-2 right-2 cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <span className="px-3 py-1.5 bg-white/90 rounded-lg text-xs font-medium text-slate-700 hover:bg-white">Change</span>
          </label>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all ${small ? "h-28" : "h-40"}`}>
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2 text-amber-600">{Icon.camera}</div>
          <span className="text-sm font-medium text-slate-600">Upload photo</span>
        </label>
      )}
    </div>
  );
}

function Toast({ message, type }) {
  const colors = { ok: "bg-emerald-800 text-emerald-100", error: "bg-red-800 text-red-100", sending: "bg-slate-800 text-slate-100" };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${colors[type]}`}>
      {type === "sending" && <span className="animate-spin">⏳</span>}
      {message}
    </div>
  );
}

function FormCard({ title, onClose, children, footer }) {
  return (
    <Card className="shadow-xl">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">{Icon.close}</button>
      </div>
      <div className="p-6 space-y-5">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100">
          {footer}
        </div>
      )}
    </Card>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <p className="text-slate-800 font-medium mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
        </div>
      </div>
    </div>
  );
}

// Loading screen
function LoadingScreen({ message = "Connecting to database…" }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-xl font-bold animate-pulse">FV</div>
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}

// Error screen
function ErrorScreen({ error }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4 p-6">
      <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">{Icon.alert}</div>
      <h2 className="text-white text-lg font-semibold">Database connection failed</h2>
      <p className="text-slate-400 text-sm text-center max-w-md">
        Check that SUPABASE_URL and SUPABASE_ANON are set correctly at the top of App.jsx.
      </p>
      <pre className="text-red-400 text-xs bg-slate-800 px-4 py-3 rounded-xl max-w-md w-full overflow-auto">{error}</pre>
    </div>
  );
}

// Login / Sign-up screen
function LoginScreen({ onLogin }) {
  const [mode, setMode]       = useState("login"); // "login" | "signup"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [info, setInfo]       = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onLogin(data.session);
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your full name."); return; }
    setError(""); setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    setLoading(false);
    if (err) { setError(err.message); return; }
    // Insert into users table so they appear in the app
    await supabase.from("users").upsert({
      id: "U-" + data.user.id.slice(0, 8).toUpperCase(),
      full_name: name, email, role: "user",
    });
    setInfo("Account created! Check your email to confirm, then log in.");
    setMode("login");
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl font-bold mb-3">FV</div>
        <h1 className="text-white text-2xl font-bold">Factory Tracker</h1>
        <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700">
        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-700 p-1 mb-6">
          {[["login", "Sign In"], ["signup", "Sign Up"]].map(([v, l]) => (
            <button key={v} onClick={() => { setMode(v); setError(""); setInfo(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === v ? "bg-amber-500 text-white shadow" : "text-slate-400 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>

        {info && (
          <div className="mb-4 px-4 py-3 bg-green-900/40 border border-green-700 rounded-xl text-green-300 text-sm">{info}</div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-700 rounded-xl text-red-300 text-sm">{error}</div>
        )}

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required
                className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
              className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
              className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-12 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <span className="animate-spin">⏳</span> : null}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {mode === "login" && (
          <button onClick={async () => {
            if (!email) { setError("Enter your email first."); return; }
            setLoading(true);
            const { error: err } = await supabase.auth.resetPasswordForEmail(email);
            setLoading(false);
            if (err) setError(err.message);
            else setInfo("Password reset email sent — check your inbox.");
          }} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-4 transition-colors">
            Forgot password?
          </button>
        )}
      </div>

      <p className="text-slate-600 text-xs mt-6">Factory Tracker · Internal Use Only</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App Root
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession]     = useState(undefined); // undefined = checking, null = logged out
  const [loading, setLoading]     = useState(true);
  const [dbError, setDbError]     = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [factories, setFactories] = useState([]);
  const [users, setUsers]         = useState([]);
  const [devs, setDevs]           = useState([]);
  const [visits, setVisits]       = useState([]);
  const [toast, setToast]         = useState(null);
  const [detail, setDetail]       = useState(null);
  const [confirm, setConfirm]     = useState(null);

  // 1. Check existing session on mount, listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. Load data once we have a session
  useEffect(() => {
    if (!session) return;
    setLoading(true);
    (async () => {
      try {
        const [f, u, d, v] = await Promise.all([db.getFactories(), db.getUsers(), db.getDevs(), db.getVisits()]);
        setFactories(f); setUsers(u); setDevs(d); setVisits(v);
        setLoading(false);
      } catch (e) {
        setDbError(e.message || String(e));
        setLoading(false);
      }
    })();
  }, [session]);

  // 3. Realtime subscriptions (only when logged in)
  useEffect(() => {
    if (!session || loading || dbError) return;
    const ch = supabase.channel("realtime-all")
      .on("postgres_changes", { event: "*", schema: "public", table: "factories" }, async () => { setFactories(await db.getFactories()); })
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, async () => { setUsers(await db.getUsers()); })
      .on("postgres_changes", { event: "*", schema: "public", table: "developments" }, async () => { setDevs(await db.getDevs()); })
      .on("postgres_changes", { event: "*", schema: "public", table: "development_updates" }, async () => { setDevs(await db.getDevs()); })
      .on("postgres_changes", { event: "*", schema: "public", table: "development_messages" }, async () => { setDevs(await db.getDevs()); })
      .on("postgres_changes", { event: "*", schema: "public", table: "visits" }, async () => { setVisits(await db.getVisits()); })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [session, loading, dbError]);

  // Match the logged-in auth user to the users table by email
  const authEmail   = session?.user?.email;
  const currentUser = users.find((u) => u.email?.toLowerCase() === authEmail?.toLowerCase()) || null;

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setFactories([]); setUsers([]); setDevs([]); setVisits([]);
    setPage("dashboard"); setDetail(null);
  }

  function showToast(message, type = "ok") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function askConfirm(message, onConfirm) { setConfirm({ message, onConfirm }); }

  const getFactory = (id) => factories.find((f) => f.id === id);
  const getUser    = (id) => users.find((u) => u.id === id);

  const needsFollowUp = devs.filter(
    (d) => (d.status === "open" || d.status === "in_progress") && (!d.updates || d.updates.length === 0) && daysAgo(d.created_date) >= 3
  );

  async function notifyFactory(dev, factoryId) {
    if (!BACKEND_URL) return;
    const factory = getFactory(factoryId);
    const teamMember = getUser(dev.team_member_id);
    showToast("Sending WeChat notification…", "sending");
    const res = await sendNotification("/notify/new-development", { dev, factory, teamMember });
    showToast(res.ok ? `✅ WeChat sent to ${factory?.wechat_id || factory?.name}` : `⚠ ${res.error}`, res.ok ? "ok" : "error");
  }

  async function sendReminder(dev) {
    if (!BACKEND_URL) { showToast("⚠ Backend not configured", "error"); return; }
    const factory = getFactory(dev.factory_ids?.[0]);
    const teamMember = getUser(dev.team_member_id);
    showToast("Sending reminder…", "sending");
    const res = await sendNotification("/notify/reminder", { dev, factory, teamMember });
    showToast(res.ok ? `✅ Reminder sent` : `⚠ ${res.error}`, res.ok ? "ok" : "error");
  }

  const navItems = [
    { id: "dashboard",    icon: Icon.grid,      label: "Dashboard" },
    { id: "visits",       icon: Icon.clipboard, label: "Visits" },
    { id: "developments", icon: Icon.flask,     label: "Dev" },
    { id: "factories",    icon: Icon.building,  label: "Factories" },
    { id: "users",        icon: Icon.users,     label: "Users" },
  ];

  function goPage(id) { setDetail(null); setPage(id); }

  // Not yet checked session
  if (session === undefined) return <LoadingScreen message="Checking session…" />;
  // Not logged in — show login screen
  if (!session) return <LoginScreen onLogin={setSession} />;
  // Logged in but data still loading
  if (loading) return <LoadingScreen message="Loading your data…" />;
  if (dbError) return <ErrorScreen error={dbError} />;

  let content = null;
  if (detail?.type === "dev") {
    const dev = devs.find((d) => d.id === detail.id);
    if (dev) content = (
      <DevDetailPage devId={detail.id} devs={devs} setDevs={setDevs} factories={factories}
        getFactory={getFactory} getUser={getUser} onBack={() => setDetail(null)}
        currentUser={currentUser} onReminder={() => sendReminder(dev)} showToast={showToast} askConfirm={askConfirm} />
    );
  } else if (detail?.type === "visit") {
    const visit = visits.find((v) => v.id === detail.id);
    if (visit) content = (
      <VisitDetailPage visitId={detail.id} visits={visits} setVisits={setVisits} factories={factories}
        onBack={() => setDetail(null)} currentUser={currentUser} showToast={showToast} askConfirm={askConfirm} />
    );
  } else if (page === "dashboard") {
    content = (
      <DashboardPage visits={visits} devs={devs} factories={factories} setPage={goPage}
        needsFollowUp={needsFollowUp} onViewDev={(id) => setDetail({ type: "dev", id })}
        onViewVisit={(id) => setDetail({ type: "visit", id })} />
    );
  } else if (page === "visits") {
    content = (
      <VisitsPage visits={visits} setVisits={setVisits} factories={factories} currentUser={currentUser}
        onView={(id) => setDetail({ type: "visit", id })} showToast={showToast} askConfirm={askConfirm} />
    );
  } else if (page === "developments") {
    content = (
      <DevelopmentsPage devs={devs} setDevs={setDevs} factories={factories} users={users}
        currentUser={currentUser} onView={(id) => setDetail({ type: "dev", id })}
        showToast={showToast} onNotify={notifyFactory} askConfirm={askConfirm} />
    );
  } else if (page === "factories") {
    content = (
      <FactoriesPage factories={factories} setFactories={setFactories} currentUser={currentUser}
        showToast={showToast} askConfirm={askConfirm} />
    );
  } else if (page === "users") {
    content = (
      <UsersPage users={users} setUsers={setUsers} factories={factories} currentUser={currentUser}
        showToast={showToast} askConfirm={askConfirm} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/20">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {confirm && (
        <ConfirmDialog message={confirm.message}
          onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
          onCancel={() => setConfirm(null)} />
      )}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 shadow-xl">
        <div className="flex items-center h-14 px-2 sm:px-4 gap-1 sm:gap-2 max-w-6xl mx-auto">
          <button onClick={() => goPage("dashboard")} className="flex items-center gap-2 mr-2 sm:mr-4 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white text-xs font-bold">FV</div>
            <span className="hidden md:block text-white font-semibold text-sm">Factory Tracker</span>
          </button>
          <nav className="flex items-center gap-0.5 sm:gap-1 flex-1 overflow-x-auto">
            {navItems.map((item) => {
              const active = !detail && page === item.id;
              return (
                <button key={item.id} onClick={() => goPage(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    active ? "bg-amber-500 text-white shadow-md shadow-amber-500/30" : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}>
                  {item.icon}<span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold">
              {currentUser?.full_name?.charAt(0) || authEmail?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-white text-xs font-medium leading-tight">{currentUser?.full_name || authEmail}</span>
              {currentUser?.role && <span className="text-amber-400 text-xs leading-tight capitalize">{currentUser.role}</span>}
            </div>
            <button onClick={signOut}
              className="ml-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="pt-14">{content}</main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
function DashboardPage({ visits, devs, factories, setPage, needsFollowUp, onViewDev, onViewVisit }) {
  const recentVisits = [...visits].sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date)).slice(0, 3);
  const recentDevs   = [...devs].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 3);
  const openCount    = devs.filter((d) => d.status === "open" || d.status === "in_progress").length;

  const stats = [
    { label: "Total Visits",    value: visits.length,        color: "blue" },
    { label: "Active Devs",     value: openCount,            color: "amber" },
    { label: "Factories",       value: factories.length,     color: "emerald" },
    { label: "Needs Follow-up", value: needsFollowUp.length, color: needsFollowUp.length > 0 ? "red" : "slate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-300 mt-1 text-sm">Welcome back — here's what's happening</p>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(({ label, value, color }) => (
            <Card key={label} className="p-4 shadow-sm">
              <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </Card>
          ))}
        </div>
        {needsFollowUp.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-orange-500 flex-shrink-0">{Icon.alert}</span>
            <p className="text-sm text-orange-800 font-medium">{needsFollowUp.length} development{needsFollowUp.length > 1 ? "s" : ""} open 3+ days with no factory update</p>
            <button onClick={() => setPage("developments")} className="ml-auto text-xs font-semibold text-orange-600 hover:underline whitespace-nowrap">View all →</button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800">Recent Visits</h2>
              <button onClick={() => setPage("visits")} className="text-sm text-amber-600 font-medium hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentVisits.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No visits yet</p>
                : recentVisits.map((v) => (
                  <Card key={v.id} className="shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                        {v.picture_url ? <img src={v.picture_url} alt="" className="w-full h-full object-cover" /> : Icon.box}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-amber-500 text-white">#{v.order_number}</Badge>
                          <span className="text-sm font-semibold text-slate-800 truncate">{v.item}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1">{Icon.building} {v.factory_name}</span>
                          <span className="flex items-center gap-1">{Icon.calendar} {fmtDate(v.visit_date)}</span>
                        </div>
                      </div>
                      <button onClick={() => onViewVisit(v.id)}
                        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                        {Icon.eye} View
                      </button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800">Recent Developments</h2>
              <button onClick={() => setPage("developments")} className="text-sm text-amber-600 font-medium hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentDevs.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No developments yet</p>
                : recentDevs.map((d) => {
                  const nf = (d.status === "open" || d.status === "in_progress") && (!d.updates || d.updates.length === 0) && daysAgo(d.created_date) >= 3;
                  return (
                    <Card key={d.id} className={`shadow-sm hover:shadow-md transition-all ${nf ? "border-l-4 border-l-orange-400" : ""}`}>
                      <div className="flex items-center gap-3 p-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                          {d.picture_url ? <img src={d.picture_url} alt="" className="w-full h-full object-cover" /> : Icon.box}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={DEV_STATUS_CSS[d.status]}>{DEV_STATUS_LABEL[d.status]}</Badge>
                            {nf && <Badge className="bg-orange-100 text-orange-700">⏰ Follow-up</Badge>}
                            <span className="text-sm font-semibold text-slate-800 truncate">{d.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{d.factory_names?.join(", ") || "No factory"} · {d.team_member_name}</p>
                        </div>
                        <button onClick={() => onViewDev(d.id)}
                          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                          {Icon.eye} View
                        </button>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Visits
// ─────────────────────────────────────────────────────────────────────────────
function VisitsPage({ visits, setVisits, factories, currentUser, onView, showToast, askConfirm }) {
  const [showForm, setShowForm]       = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [search, setSearch]           = useState("");
  const [filterFactory, setFilterFactory] = useState("all");
  const [filterVisitor, setFilterVisitor] = useState("all");
  const isAdmin = currentUser?.role === "admin";

  const filtered = visits
    .filter((v) => filterFactory === "all" || v.factory_id === filterFactory)
    .filter((v) => filterVisitor === "all" || v.visitor_name === filterVisitor)
    .filter((v) => !search || [v.order_number, v.item, v.factory_name, v.purpose, v.visitor_name]
      .some((x) => x?.toLowerCase().includes(search.toLowerCase())));

  const visitors = [...new Set(visits.map((v) => v.visitor_name).filter(Boolean))];

  async function save(data) {
    const isNew = !data.id;
    const record = isNew ? { ...data, id: genId("V") } : data;
    const saved = await db.upsertVisit(record);
    if (saved) {
      setVisits((p) => isNew ? [saved, ...p] : p.map((v) => v.id === saved.id ? saved : v));
      showToast(isNew ? "Visit logged" : "Visit updated");
    }
    setShowForm(false); setEditingVisit(null);
  }

  async function del(id) {
    askConfirm("Delete this visit? This cannot be undone.", async () => {
      await db.deleteVisit(id);
      setVisits((p) => p.filter((v) => v.id !== id));
      showToast("Visit deleted");
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
      <div className="bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Factory Visits</h1>
              <p className="text-slate-400 mt-1 text-sm">Track and log all factory visits</p>
            </div>
            <Btn variant="amber" size="lg" onClick={() => { setEditingVisit(null); setShowForm(true); }}>
              {Icon.plus} Log New Visit
            </Btn>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[["Total Visits", visits.length], ["This Week", visits.filter((v) => daysAgo(v.visit_date) <= 7).length], ["Factories", [...new Set(visits.map((v) => v.factory_id))].length]].map(([label, value]) => (
              <div key={label} className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-slate-300 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {showForm && (
          <div className="mb-6">
            <VisitForm visit={editingVisit} factories={factories} currentUser={currentUser}
              onSave={save} onCancel={() => { setShowForm(false); setEditingVisit(null); }} />
          </div>
        )}
        {!showForm && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{Icon.search}</span>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search visits…" className="pl-11" />
              </div>
              <Select value={filterFactory} onChange={setFilterFactory} className="sm:w-44">
                <option value="all">All Factories</option>
                {factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </Select>
              <Select value={filterVisitor} onChange={setFilterVisitor} className="sm:w-40">
                <option value="all">All Visitors</option>
                {visitors.map((v) => <option key={v} value={v}>{v}</option>)}
              </Select>
            </div>
            {filtered.length === 0
              ? <EmptyState icon={Icon.clipboard} title="No visits found" subtitle="Log your first factory visit"
                  action={<Btn variant="amber" onClick={() => setShowForm(true)}>{Icon.plus} Log Visit</Btn>} />
              : <div className="space-y-3">
                  {filtered.map((v) => (
                    <VisitCard key={v.id} visit={v}
                      onEdit={() => { setEditingVisit(v); setShowForm(true); }}
                      onDelete={isAdmin ? () => del(v.id) : null}
                      onView={() => onView(v.id)}
                      currentUser={currentUser} />
                  ))}
                </div>
            }
          </>
        )}
      </div>
    </div>
  );
}

function VisitCard({ visit, onEdit, onDelete, onView, currentUser }) {
  const canEdit = visit.visitor_name === currentUser?.full_name || currentUser?.role === "admin";
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all overflow-hidden">
      <div className="flex">
        <div className="w-28 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
          {visit.picture_url ? <img src={visit.picture_url} alt="" className="w-full h-full object-cover" /> : Icon.box}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge className="bg-amber-500 text-white">#{visit.order_number}</Badge>
            <span className="font-semibold text-slate-800 text-base line-clamp-1">{visit.item}</span>
          </div>
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{visit.purpose}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">{Icon.building} {visit.factory_name}</span>
            <span className="flex items-center gap-1">{Icon.user} {visit.visitor_name}</span>
            <span className="flex items-center gap-1">{Icon.calendar} {fmtDate(visit.visit_date, true)}</span>
            {visit.location_address && <span className="flex items-center gap-1">{Icon.pin} {visit.location_address.slice(0, 40)}{visit.location_address.length > 40 ? "…" : ""}</span>}
          </div>
          {visit.additional_pictures?.length > 0 && (
            <div className="flex gap-1 mt-2">
              {visit.additional_pictures.slice(0, 3).map((p, i) => (
                <div key={i} className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {visit.additional_pictures.length > 3 && (
                <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                  +{visit.additional_pictures.length - 3}
                </div>
              )}
            </div>
          )}
          <div className="mt-2 flex justify-end gap-1">
            {canEdit && onEdit && <Btn variant="ghost" size="sm" onClick={onEdit}>{Icon.edit}</Btn>}
            {onDelete && <Btn variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-600">{Icon.trash}</Btn>}
            <Btn variant="ghost" size="sm" onClick={onView}>{Icon.eye} View</Btn>
          </div>
        </div>
      </div>
    </Card>
  );
}

function VisitForm({ visit, factories, currentUser, onSave, onCancel }) {
  const isEdit = !!visit?.id;
  const [form, setForm] = useState(visit || {
    order_number: "", factory_id: "", factory_name: "", item: "",
    purpose: "", visit_date: new Date().toISOString(),
    visitor_name: currentUser?.full_name || "",
    picture_url: "", additional_pictures: [], location_address: "", latitude: null, longitude: null,
  });
  const [locating, setLocating] = useState(!isEdit);
  const [locError, setLocError] = useState("");
  const didGeo = useRef(false);

  if (!isEdit && !didGeo.current && typeof navigator !== "undefined" && navigator.geolocation) {
    didGeo.current = true;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://restapi.amap.com/v3/geocode/regeo?key=a3fa54b4926b09660455bbb6c286c12a&location=${longitude},${latitude}&radius=100&extensions=base&batch=false`);
          const data = await res.json();
          const address = data.regeocode?.formatted_address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setForm((p) => ({ ...p, latitude, longitude, location_address: address }));
        } catch {
          setForm((p) => ({ ...p, latitude, longitude, location_address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
        }
        setLocating(false);
      },
      () => { setLocating(false); setLocError("GPS unavailable"); },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const addImages = (e) => {
    Array.from(e.target.files || []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm((p) => ({ ...p, additional_pictures: [...p.additional_pictures, ev.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const handleFactoryChange = (id) => {
    const fac = factories.find((f) => f.id === id);
    set("factory_id", id); set("factory_name", fac?.name || "");
  };

  const valid = form.order_number && form.factory_id && form.item && form.purpose;

  return (
    <FormCard title={isEdit ? "Edit Visit" : "Log New Visit"} onClose={onCancel}
      footer={<><Btn variant="outline" onClick={onCancel}>Cancel</Btn><Btn variant="dark" disabled={!valid} onClick={() => onSave(form)}>{Icon.check} {isEdit ? "Update Visit" : "Log Visit"}</Btn></>}>
      <div className="grid grid-cols-2 gap-4">
        <div><Label required>Order Number</Label><Input value={form.order_number} onChange={(e) => set("order_number", e.target.value)} placeholder="ORD-2024-001" /></div>
        <div>
          <Label required>Factory</Label>
          <Select value={form.factory_id} onChange={handleFactoryChange}>
            <option value="">Select factory…</option>
            {factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </Select>
        </div>
      </div>
      <div>
        <Label>Date &amp; Time</Label>
        <div className="flex items-center gap-3 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700">
          <span className="text-slate-400">{Icon.calendar}</span>
          <span className="font-medium">{fmtDate(form.visit_date, true)}</span>
          <span className="ml-auto text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md">Auto</span>
        </div>
      </div>
      <div>
        <Label>Location</Label>
        {locating ? (
          <div className="flex items-center gap-3 h-12 px-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <span className="animate-spin text-base">⏳</span><span>Detecting location…</span>
          </div>
        ) : form.latitude && form.longitude ? (
          <div className="flex items-start gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
            <span className="flex-shrink-0 mt-0.5 text-green-500">{Icon.pin}</span>
            <span className="flex-1 leading-relaxed">{form.location_address}</span>
            <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-md">GPS ✓</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400">
            <span>{Icon.pin}</span><span>{locError || "Location not captured"}</span>
          </div>
        )}
      </div>
      <div><Label required>Item Inspected</Label><Input value={form.item} onChange={(e) => set("item", e.target.value)} placeholder="e.g. Cotton Fabric Batch" /></div>
      <div><Label required>Purpose of Visit</Label><Textarea value={form.purpose} onChange={(e) => set("purpose", e.target.value)} placeholder="Describe the purpose…" /></div>
      <PhotoUpload url={form.picture_url} onChange={(v) => set("picture_url", v)} label="Main Photo" />
      <div>
        <Label>Additional Photos</Label>
        <label className="flex items-center justify-center h-11 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all">
          <input type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
          <span className="flex items-center gap-2 text-sm text-slate-500">{Icon.upload} Add more photos</span>
        </label>
        {form.additional_pictures?.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {form.additional_pictures.map((p, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={p} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, additional_pictures: prev.additional_pictures.filter((_, j) => j !== i) }))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white text-xs">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormCard>
  );
}

function useReverseGeocode(lat, lon, existingAddress) {
  const [address, setAddress] = useState(existingAddress || "");
  useEffect(() => {
    if (!lat || !lon) return;
    const looksLikeCoords = !existingAddress || /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(existingAddress.trim());
    if (!looksLikeCoords) { setAddress(existingAddress); return; }
    fetch(`https://restapi.amap.com/v3/geocode/regeo?key=a3fa54b4926b09660455bbb6c286c12a&location=${lon},${lat}&radius=100&extensions=base&batch=false`)
      .then(r => r.json())
      .then(data => {
        const address = data.regeocode?.formatted_address || existingAddress;
        setAddress(address);
      })
      .catch(() => setAddress(existingAddress));
  }, [lat, lon, existingAddress]);
  return address;
}

function VisitDetailPage({ visitId, visits, setVisits, factories, onBack, currentUser, showToast, askConfirm }) {
  const [showEdit, setShowEdit] = useState(false);
  const visit = visits.find((v) => v.id === visitId);
  const resolvedAddress = useReverseGeocode(visit?.latitude, visit?.longitude, visit?.location_address);
  if (!visit) return null;

  const canEdit = visit.visitor_name === currentUser?.full_name || currentUser?.role === "admin";
  const isAdmin = currentUser?.role === "admin";

  async function save(data) {
    const saved = await db.upsertVisit(data);
    if (saved) setVisits((p) => p.map((v) => v.id === visitId ? saved : v));
    setShowEdit(false);
    showToast("Visit updated");
  }

  async function del() {
    askConfirm("Delete this visit? This cannot be undone.", async () => {
      await db.deleteVisit(visitId);
      setVisits((p) => p.filter((v) => v.id !== visitId));
      showToast("Visit deleted");
      onBack();
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
      <div className="bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3 transition-colors">{Icon.back} Back to Visits</button>
              <Badge className="bg-amber-500 text-white mb-2">#{visit.order_number}</Badge>
              <h1 className="text-2xl font-bold mt-1">{visit.item}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-300 flex-wrap">
                <div className="flex items-center gap-2">{Icon.calendar} {fmtDate(visit.visit_date, true)}</div>
                {resolvedAddress && <div className="flex items-start gap-2">{Icon.pin} <span>{resolvedAddress}</span></div>}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap flex-shrink-0">
              {canEdit && <Btn variant="white" onClick={() => setShowEdit((s) => !s)}>{Icon.edit} Edit</Btn>}
              {isAdmin && <Btn variant="danger" onClick={del}>{Icon.trash} Delete</Btn>}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {showEdit && (
          <div className="mb-6">
            <VisitForm visit={visit} factories={factories} currentUser={currentUser} onSave={save} onCancel={() => setShowEdit(false)} />
          </div>
        )}
        {!showEdit && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {visit.picture_url && (
                <Card className="overflow-hidden shadow-sm">
                  <img src={visit.picture_url} alt="Main" className="w-full object-cover max-h-80" />
                </Card>
              )}
              {visit.additional_pictures?.length > 0 && (
                <Card className="shadow-sm p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 text-sm">Additional Photos</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {visit.additional_pictures.map((p, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden">
                        <img src={p} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-90" onClick={() => window.open(p, "_blank")} />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
            <div className="space-y-4">
              <Card className="shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-3 text-sm uppercase tracking-wide">Visit Details</h3>
                <div className="space-y-3">
                  {[["Factory", visit.factory_name, Icon.building], ["Visitor", visit.visitor_name, Icon.user],
                    ["Purpose", visit.purpose, Icon.clipboard], ["Location", resolvedAddress, Icon.pin]
                  ].filter(([, v]) => v).map(([label, val, icon]) => (
                    <div key={label}>
                      <label className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</label>
                      <p className="text-sm text-slate-800 mt-0.5 flex items-start gap-1.5">{icon} {val}</p>
                    </div>
                  ))}
                </div>
              </Card>
              {(visit.latitude && visit.longitude) || visit.location_address ? (
                <Card className="shadow-sm overflow-hidden">
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">{Icon.pin} Location</h3>
                    {visit.latitude && visit.longitude && (
                      <a href={`https://uri.amap.com/marker?position=${visit.longitude},${visit.latitude}&callnative=1`} target="_blank" rel="noreferrer"
                        className="text-xs font-medium text-amber-600 hover:text-amber-700">Open in Amap →</a>
                    )}
                  </div>
                  {visit.latitude && visit.longitude ? (
                    <iframe title="map" width="100%" height="220" style={{ border: 0, display: "block" }}
                      src={`https://uri.amap.com/marker?position=${visit.longitude},${visit.latitude}&name=Visit+Location&coordinate=gaode&zoom=15&callnative=0`}
                      allowFullScreen />
                  ) : (
                    <div className="p-4 text-sm text-slate-600 flex items-start gap-2">{Icon.pin} {resolvedAddress}</div>
                  )}
                  {resolvedAddress && <div className="px-4 py-2 bg-slate-50 text-xs text-slate-500 border-t border-slate-100">{resolvedAddress}</div>}
                </Card>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Developments
// ─────────────────────────────────────────────────────────────────────────────
function DevelopmentsPage({ devs, setDevs, factories, users, currentUser, onView, showToast, onNotify, askConfirm }) {
  const [showForm, setShowForm]     = useState(false);
  const [editingDev, setEditingDev] = useState(null);
  const [search, setSearch]         = useState("");
  const [tab, setTab]               = useState("open");
  const [sortBy, setSortBy]         = useState("created_date");
  const [filterFactory, setFilterFactory] = useState("all");
  const isAdmin = currentUser?.role === "admin";

  const filtered = devs
    .filter((d) => {
      if (tab === "completed") return d.status === "completed" || d.status === "cancelled";
      return d.status === "open" || d.status === "in_progress";
    })
    .filter((d) => filterFactory === "all" || d.factory_ids?.includes(filterFactory))
    .filter((d) => !search || [d.title, d.client_name, ...(d.factory_names || []), d.team_member_name, d.material]
      .some((x) => x?.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "title" ? (a.title || "").localeCompare(b.title || "") : new Date(b.created_date) - new Date(a.created_date));

  const openCount = devs.filter((d) => d.status === "open" || d.status === "in_progress").length;
  const doneCount = devs.filter((d) => d.status === "completed").length;

  async function saveDev(data, isNew) {
    if (isNew) {
      if (data.factory_ids.length > 1) {
        const newDevs = await Promise.all(data.factory_ids.map(async (fid, idx) => {
          const fname = data.factory_names[idx] || "";
          const nd = { ...data, id: genId("DEV-"), factory_ids: [fid], factory_names: [fname], created_date: new Date().toISOString().slice(0, 10), updates: [] };
          const { updates: _, messages: __, ...record } = nd;
          return await db.upsertDev(record);
        }));
        const full = await db.getDevs();
        setDevs(full);
        showToast(`${newDevs.length} developments created`);
        newDevs.forEach((nd) => nd && onNotify(nd, nd.factory_ids[0]));
      } else {
        const { updates: _, messages: __, ...record } = { ...data, id: genId("DEV-"), created_date: new Date().toISOString().slice(0, 10) };
        const saved = await db.upsertDev(record);
        if (saved) {
          const full = await db.getDevs();
          setDevs(full);
          showToast("Development created");
          onNotify(saved, saved.factory_ids?.[0]);
        }
      }
    } else {
      const { updates: _, messages: __, ...record } = data;
      await db.upsertDev(record);
      const full = await db.getDevs();
      setDevs(full);
      showToast("Development updated");
    }
    setShowForm(false); setEditingDev(null);
  }

  async function deleteDev(id) {
    askConfirm("Delete this development? This cannot be undone.", async () => {
      await db.deleteDev(id);
      setDevs((p) => p.filter((d) => d.id !== id));
      showToast("Deleted");
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/20">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Developments</h1>
              <p className="text-slate-300 mt-1 text-sm">Track product development requests</p>
            </div>
            <Btn variant="purple" size="lg" onClick={() => { setEditingDev(null); setShowForm(true); }}>
              {Icon.plus} New Development
            </Btn>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[["Active", openCount], ["Completed", doneCount], ["Total", devs.length]].map(([label, value]) => (
              <div key={label} className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-slate-300 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {showForm && (
          <div className="mb-6">
            <DevForm dev={editingDev} factories={factories} users={users} currentUser={currentUser}
              onSave={saveDev} onCancel={() => { setShowForm(false); setEditingDev(null); }} />
          </div>
        )}
        {!showForm && (
          <>
            <div className="flex border-b border-slate-200 mb-5">
              {[["open", "Active"], ["completed", "Completed"]].map(([v, l]) => (
                <button key={v} onClick={() => setTab(v)}
                  className={`px-5 py-3 text-sm font-medium transition-colors ${tab === v ? "text-purple-600 border-b-2 border-purple-500" : "text-slate-500 hover:text-slate-700"}`}>{l}</button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{Icon.search}</span>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search developments…" className="pl-11" />
              </div>
              <Select value={filterFactory} onChange={setFilterFactory} className="sm:w-44">
                <option value="all">All Factories</option>
                {factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </Select>
              <Select value={sortBy} onChange={setSortBy} className="sm:w-36">
                <option value="created_date">Newest first</option>
                <option value="title">Name A-Z</option>
              </Select>
            </div>
            {filtered.length === 0
              ? <EmptyState icon={Icon.flask} title="No developments found" subtitle="Create your first development request"
                  action={<Btn variant="purple" onClick={() => setShowForm(true)}>{Icon.plus} New Development</Btn>} />
              : <div className="space-y-3">
                  {filtered.map((d) => (
                    <DevCard key={d.id} dev={d}
                      onEdit={isAdmin ? () => { setEditingDev(d); setShowForm(true); } : null}
                      onDelete={isAdmin ? () => deleteDev(d.id) : null}
                      onView={() => onView(d.id)} />
                  ))}
                </div>
            }
          </>
        )}
      </div>
    </div>
  );
}

function DevCard({ dev, onEdit, onDelete, onView }) {
  const needsFollowUp = (dev.status === "open" || dev.status === "in_progress") && (!dev.updates || dev.updates.length === 0) && daysAgo(dev.created_date) >= 3;
  const isActive   = dev.status === "open" || dev.status === "in_progress";
  const activeDays = daysAgo(dev.created_date);

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all overflow-hidden ${needsFollowUp ? "border-l-4 border-l-orange-400" : ""}`}>
      <div className="flex">
        <div className="w-24 sm:w-32 flex-shrink-0 min-h-[110px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
          {dev.picture_url ? <img src={dev.picture_url} alt={dev.title} className="w-full h-full object-cover" /> : Icon.box}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge className={`${DEV_STATUS_CSS[dev.status]} text-xs`}>{DEV_STATUS_LABEL[dev.status]}</Badge>
            {isActive && (
              <Badge className={`text-xs ${activeDays >= 14 ? "bg-red-100 text-red-700" : activeDays >= 7 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"}`}>
                {activeDays === 0 ? "Today" : `${activeDays}d open`}
              </Badge>
            )}
            {needsFollowUp && <Badge className="bg-orange-100 text-orange-700 text-xs">⏰ Follow-up needed</Badge>}
          </div>
          <h3 className="font-semibold text-slate-800 text-base line-clamp-1">{dev.title}</h3>
          {dev.client_name && <p className="text-xs text-slate-500 mb-1">Client: {dev.client_name}</p>}
          <div className="space-y-0.5 text-xs text-slate-600">
            {dev.factory_names?.length > 0 && <div className="flex items-center gap-1">{Icon.building} {dev.factory_names[0]}</div>}
            {dev.team_member_name && <div className="flex items-center gap-1">{Icon.user} {dev.team_member_name}</div>}
            <div className="flex items-center gap-1">{Icon.calendar} {fmtDate(dev.created_date)}</div>
          </div>
          <div className="mt-2 flex justify-end gap-1">
            {onEdit   && <Btn variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(dev);    }}>{Icon.edit}</Btn>}
            {onDelete && <Btn variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(dev.id); }}>{Icon.trash}</Btn>}
            <Btn variant="ghost" size="sm" onClick={onView}>{Icon.eye} View</Btn>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DevForm({ dev, factories, users, currentUser, onSave, onCancel }) {
  const isEdit = !!dev?.id;
  const [form, setForm] = useState(dev || {
    title: "", client_name: "", factory_ids: [], factory_names: [],
    team_member_name: currentUser?.full_name || "", team_member_id: currentUser?.id || "",
    material: "", size: "", weight: "",
    internal_estimated_date: "", internal_estimated_price: "",
    special_remarks: "", picture_url: "", additional_pictures: [], status: "open",
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleFactory = (fac, checked) => {
    if (checked) { set("factory_ids", [...form.factory_ids, fac.id]); set("factory_names", [...form.factory_names, fac.name]); }
    else { set("factory_ids", form.factory_ids.filter((id) => id !== fac.id)); set("factory_names", form.factory_names.filter((n) => n !== fac.name)); }
  };

  const addImages = (e) => {
    Array.from(e.target.files || []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm((p) => ({ ...p, additional_pictures: [...(p.additional_pictures || []), ev.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const valid = form.title && form.factory_ids.length > 0;

  return (
    <FormCard title={isEdit ? "Edit Development" : "New Development Request"} onClose={onCancel}
      footer={<><Btn variant="outline" onClick={onCancel}>Cancel</Btn><Btn variant="dark" disabled={!valid} onClick={() => onSave(form, !isEdit)}>{Icon.check} {isEdit ? "Update" : "Create & Notify Factories"}</Btn></>}>
      <div className="grid grid-cols-2 gap-4">
        <div><Label required>Item / Product Name</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Blue Polo Shirt" /></div>
        <div><Label>Client Name</Label><Input value={form.client_name} onChange={(e) => set("client_name", e.target.value)} placeholder="Client name" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Size</Label><Input value={form.size} onChange={(e) => set("size", e.target.value)} placeholder="e.g. 30x40cm" /></div>
        <div><Label>Weight</Label><Input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 200g" /></div>
        <div><Label>Material</Label><Input value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="e.g. Cotton" /></div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700">
        <span className="text-slate-400">{Icon.user}</span>
        <span>Assigned to: <strong>{form.team_member_name}</strong></span>
        <span className="ml-auto text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md">You</span>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Internal Info (not visible to suppliers)</p>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Target Date</Label><Input type="date" value={form.internal_estimated_date} onChange={(e) => set("internal_estimated_date", e.target.value)} /></div>
          <div><Label>Target Price (USD)</Label><Input type="number" value={form.internal_estimated_price} onChange={(e) => set("internal_estimated_price", e.target.value)} placeholder="0.00" /></div>
        </div>
      </div>
      <div>
        <Label required>Assign Factories {form.factory_ids.length > 1 && <span className="text-purple-600 font-normal">(will create {form.factory_ids.length} separate developments)</span>}</Label>
        <div className="border border-slate-200 rounded-xl p-3 space-y-1 max-h-44 overflow-y-auto">
          {factories.map((fac) => (
            <label key={fac.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" checked={form.factory_ids.includes(fac.id)} onChange={(e) => toggleFactory(fac, e.target.checked)} className="rounded border-slate-300 text-amber-500" />
              <span className="text-sm font-medium text-slate-700 flex-1">{fac.name}</span>
              {fac.wechat_id ? <span className="text-xs text-green-600 font-mono flex items-center gap-1">{Icon.wechat} {fac.wechat_id}</span>
                : <span className="text-xs text-red-400">⚠ No WeChat</span>}
            </label>
          ))}
        </div>
      </div>
      <div><Label>Special Remarks</Label><Textarea value={form.special_remarks} onChange={(e) => set("special_remarks", e.target.value)} placeholder="Instructions for factories…" /></div>
      <PhotoUpload url={form.picture_url} onChange={(v) => set("picture_url", v)} label="Reference Photo" />
      <div>
        <Label>Additional Reference Photos</Label>
        <label className="flex items-center justify-center h-11 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all">
          <input type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
          <span className="flex items-center gap-2 text-sm text-slate-500">{Icon.upload} Add photos</span>
        </label>
        {form.additional_pictures?.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {form.additional_pictures.map((p, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={p} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, additional_pictures: prev.additional_pictures.filter((_, j) => j !== i) }))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white text-xs">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormCard>
  );
}

function DevDetailPage({ devId, devs, setDevs, factories, getFactory, getUser, onBack, currentUser, onReminder, showToast, askConfirm }) {
  const [showEdit, setShowEdit]           = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [activeTab, setActiveTab]         = useState("updates");
  const dev = devs.find((d) => d.id === devId);
  if (!dev) return null;
  const isAdmin = currentUser?.role === "admin";

  async function changeStatus(status) {
    await db.upsertDev({ ...dev, status, updates: undefined, messages: undefined });
    setDevs((p) => p.map((d) => d.id === devId ? { ...d, status } : d));
    showToast(`Status: ${DEV_STATUS_LABEL[status]}`);
  }

  async function saveUpdate(data) {
    const record = { ...data, id: genId("UPD"), development_id: devId, created_date: new Date().toISOString() };
    const saved = await db.insertUpdate(record);
    if (saved) setDevs((p) => p.map((d) => d.id === devId ? { ...d, updates: [saved, ...(d.updates || [])] } : d));
    setShowUpdateForm(false);
    showToast("Update submitted");
  }

  async function saveDev(data) {
    const { updates: _, messages: __, ...record } = data;
    await db.upsertDev({ ...record, id: devId });
    const full = await db.getDevs();
    setDevs(full);
    setShowEdit(false);
    showToast("Development updated");
  }

  async function del() {
    askConfirm("Delete this development?", async () => {
      await db.deleteDev(devId);
      setDevs((p) => p.filter((d) => d.id !== devId));
      showToast("Deleted"); onBack();
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/20">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors">{Icon.back} Back</button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className={DEV_STATUS_CSS[dev.status]}>{DEV_STATUS_LABEL[dev.status]}</Badge>
                <Badge className="bg-white/10 text-white text-xs">{daysAgo(dev.created_date)}d open</Badge>
              </div>
              <h1 className="text-2xl font-bold">{dev.title}</h1>
              {dev.client_name && <p className="text-slate-300 mt-1">{dev.client_name}</p>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {(dev.status === "open" || dev.status === "in_progress") && (
                <Btn variant="amber" onClick={() => changeStatus("completed")}>{Icon.check} Mark Complete</Btn>
              )}
              {isAdmin && (
                <>
                  <Btn variant="white" onClick={() => setShowEdit((s) => !s)}>{Icon.edit} Edit</Btn>
                  <Select value={dev.status} onChange={changeStatus} className="h-10 w-36 bg-white/10 border-white/20 text-white text-sm rounded-xl">
                    {Object.entries(DEV_STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </Select>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {showEdit && (
          <div className="mb-6">
            <DevForm dev={dev} factories={factories} users={[]} currentUser={currentUser} onSave={saveDev} onCancel={() => setShowEdit(false)} />
          </div>
        )}
        {!showEdit && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {dev.picture_url && (
                <Card className="overflow-hidden shadow-sm">
                  <img src={dev.picture_url} alt="Reference" className="w-full object-cover max-h-72" />
                </Card>
              )}
              {dev.additional_pictures?.length > 0 && (
                <Card className="shadow-sm p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 text-sm">Additional Photos</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {dev.additional_pictures.map((p, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden">
                        <img src={p} alt="" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(p, "_blank")} />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              <Card className="shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100">
                  {[["updates", "Factory Updates"], ["chat", "Chat"]].map(([v, label]) => (
                    <button key={v} onClick={() => setActiveTab(v)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === v ? "text-purple-600 border-b-2 border-purple-500" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
                  ))}
                </div>
                {activeTab === "updates" && (
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-700">Factory Updates ({dev.updates?.length || 0})</h4>
                      <div className="flex gap-2">
                        <Btn variant="ghost" size="sm" onClick={onReminder}>{Icon.wechat} Remind</Btn>
                        <Btn variant="purple" size="sm" onClick={() => setShowUpdateForm((s) => !s)}>{Icon.plus} Add Update</Btn>
                      </div>
                    </div>
                    {showUpdateForm && <FactoryUpdateForm dev={dev} onSave={saveUpdate} onCancel={() => setShowUpdateForm(false)} />}
                    {(!dev.updates || dev.updates.length === 0)
                      ? <p className="text-center text-slate-400 text-sm py-8">No factory updates yet.</p>
                      : dev.updates.map((u) => <UpdateCard key={u.id} update={u} />)
                    }
                  </div>
                )}
                {activeTab === "chat" && <DevChat devId={devId} dev={dev} setDevs={setDevs} currentUser={currentUser} />}
              </Card>
            </div>
            <div className="space-y-4">
              <Card className="shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-3 text-sm uppercase tracking-wide">Details</h3>
                <div className="space-y-3">
                  {[["Item", dev.title], ["Size", dev.size], ["Weight", dev.weight], ["Material", dev.material],
                    ["Factories", dev.factory_names?.join(", ")], ["Team Member", dev.team_member_name], ["Created", fmtDate(dev.created_date)]
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <div key={label}>
                      <label className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</label>
                      <p className="text-sm text-slate-800 mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
              </Card>
              {(dev.internal_estimated_date || dev.internal_estimated_price) && (
                <Card className="shadow-sm p-5 border-l-4 border-l-amber-400">
                  <h3 className="font-semibold text-amber-800 border-b border-amber-100 pb-2 mb-3 text-sm uppercase tracking-wide">🔒 Internal Info</h3>
                  <div className="space-y-3">
                    {dev.internal_estimated_date && (
                      <div><label className="text-xs text-amber-700 uppercase tracking-wide font-medium">Target Date</label>
                        <p className="text-sm text-amber-900 mt-0.5">{fmtDate(dev.internal_estimated_date)}</p></div>
                    )}
                    {dev.internal_estimated_price && (
                      <div><label className="text-xs text-amber-700 uppercase tracking-wide font-medium">Target Price</label>
                        <p className="text-sm text-amber-900 mt-0.5">${dev.internal_estimated_price}</p></div>
                    )}
                  </div>
                </Card>
              )}
              <Card className="shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-3 text-sm uppercase tracking-wide">Factory Contacts</h3>
                {dev.factory_ids?.map((fid) => {
                  const fac = getFactory(fid);
                  if (!fac) return null;
                  return (
                    <div key={fid} className="flex items-start gap-3 py-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">{Icon.building}</div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{fac.name}</p>
                        <p className="text-xs text-slate-500">{fac.contact_person}</p>
                        {fac.wechat_id ? <p className="text-xs text-green-600 font-mono mt-0.5 flex items-center gap-1">{Icon.wechat} {fac.wechat_id}</p>
                          : <p className="text-xs text-red-400 mt-0.5">⚠ No WeChat ID</p>}
                      </div>
                    </div>
                  );
                })}
              </Card>
              {isAdmin && (
                <Btn variant="danger" onClick={del} className="w-full justify-center">{Icon.trash} Delete Development</Btn>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FactoryUpdateForm({ dev, onSave, onCancel }) {
  const [form, setForm] = useState({
    factory_id: dev.factory_ids?.[0] || "", factory_name: dev.factory_names?.[0] || "",
    type: "progress", materials_status: "not_started",
    materials_arrival_date: "", estimated_finish_date: "",
    supplier_price: "", production_status: "", notes: "", progress_pictures: [],
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const addImages = (e) => {
    Array.from(e.target.files || []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm((p) => ({ ...p, progress_pictures: [...p.progress_pictures, ev.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <h4 className="text-sm font-semibold text-slate-700">Submit Factory Update</h4>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Update Type</Label>
          <Select value={form.type} onChange={(v) => set("type", v)}>
            <option value="confirmation">✅ Confirmation</option>
            <option value="progress">📋 Progress</option>
          </Select>
        </div>
        <div><Label>Materials Status</Label>
          <Select value={form.materials_status} onChange={(v) => set("materials_status", v)}>
            {Object.entries(MAT_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </Select>
        </div>
        <div><Label>Materials Arrival</Label><Input type="date" value={form.materials_arrival_date} onChange={(e) => set("materials_arrival_date", e.target.value)} /></div>
        <div><Label>Est. Finish Date</Label><Input type="date" value={form.estimated_finish_date} onChange={(e) => set("estimated_finish_date", e.target.value)} /></div>
        <div><Label>Supplier Price ($)</Label><Input value={form.supplier_price} onChange={(e) => set("supplier_price", e.target.value)} placeholder="0.00" /></div>
      </div>
      <div><Label>Production Status</Label><Textarea value={form.production_status} onChange={(e) => set("production_status", e.target.value)} placeholder="Current stage…" rows={2} /></div>
      <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Additional notes…" rows={2} /></div>
      <div>
        <Label>Progress Photos</Label>
        <label className="flex items-center justify-center h-11 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-amber-400 transition-all">
          <input type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
          <span className="flex items-center gap-2 text-sm text-slate-500">{Icon.upload} Upload photos</span>
        </label>
        {form.progress_pictures.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {form.progress_pictures.map((p, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden"><img src={p} alt="" className="w-full h-full object-cover" /></div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Btn variant="outline" size="sm" onClick={onCancel}>Cancel</Btn>
        <Btn variant="purple" size="sm" onClick={() => onSave(form)}>{Icon.check} Submit Update</Btn>
      </div>
    </div>
  );
}

function UpdateCard({ update }) {
  return (
    <div className="border border-slate-100 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {Icon.building}
          <span className="font-semibold text-slate-800 text-sm">{update.factory_name}</span>
          <Badge className={update.type === "confirmation" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
            {update.type === "confirmation" ? "✅ Confirmed" : "📋 Progress"}
          </Badge>
        </div>
        <span className="text-xs text-slate-400">{fmtDate(update.created_date)}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {update.materials_status && <div><label className="text-xs text-slate-500 uppercase tracking-wide">Materials</label><p className="font-medium text-slate-700">{MAT_LABEL[update.materials_status] || update.materials_status}</p></div>}
        {update.materials_arrival_date && <div><label className="text-xs text-slate-500 uppercase tracking-wide">Materials Arrival</label><p className="font-medium text-slate-700">{fmtDate(update.materials_arrival_date)}</p></div>}
        {update.estimated_finish_date && <div><label className="text-xs text-slate-500 uppercase tracking-wide">Est. Finish</label><p className="font-medium text-slate-700">{fmtDate(update.estimated_finish_date)}</p></div>}
        {update.supplier_price && <div><label className="text-xs text-slate-500 uppercase tracking-wide">Price</label><p className="font-medium text-slate-700">${update.supplier_price}</p></div>}
      </div>
      {update.production_status && <div><label className="text-xs text-slate-500 uppercase tracking-wide">Production Status</label><p className="text-sm text-slate-700 mt-0.5">{update.production_status}</p></div>}
      {update.notes && <div><label className="text-xs text-slate-500 uppercase tracking-wide">Notes</label><p className="text-sm text-slate-700 mt-0.5">{update.notes}</p></div>}
      {update.progress_pictures?.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {update.progress_pictures.map((p, i) => (
            <div key={i} className="rounded aspect-square overflow-hidden">
              <img src={p} alt="" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(p, "_blank")} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DevChat({ devId, dev, setDevs, currentUser }) {
  const messages = dev.messages || [];
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  async function send() {
    const trimmed = text.trim(); if (!trimmed) return;
    const record = { id: genId("MSG"), development_id: devId, sender_name: currentUser?.full_name || "Unknown", sender_role: currentUser?.role || "user", message: trimmed };
    const saved = await db.insertMessage(record);
    if (saved) setDevs((p) => p.map((d) => d.id === devId ? { ...d, messages: [...(d.messages || []), saved] } : d));
    setText("");
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 280 }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
        {messages.length === 0
          ? <p className="text-center text-slate-400 text-sm py-8">No messages yet. Start the conversation!</p>
          : messages.map((msg) => {
              const isOwn = msg.sender_name === currentUser?.full_name;
              return (
                <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isOwn ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"}`}>
                    {!isOwn && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{msg.sender_name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${msg.sender_role === "supplier" ? "bg-purple-200 text-purple-700" : "bg-blue-200 text-blue-700"}`}>
                          {msg.sender_role === "supplier" ? "Supplier" : "Team"}
                        </span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p className={`text-xs mt-1 opacity-60 ${isOwn ? "text-right" : ""}`}>{fmtDate(msg.created_date, true)}</p>
                  </div>
                </div>
              );
            })
        }
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-slate-100 p-3 flex gap-2">
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type a message… (Enter to send)" rows={2}
          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-amber-500" />
        <button onClick={send} disabled={!text.trim()}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium disabled:opacity-40 flex items-center gap-1.5">
          {Icon.plus} Send
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Factories
// ─────────────────────────────────────────────────────────────────────────────
function FactoriesPage({ factories, setFactories, currentUser, showToast, askConfirm }) {
  const [showForm, setShowForm]           = useState(false);
  const [editingFactory, setEditingFactory] = useState(null);
  const [search, setSearch]               = useState("");
  const isAdmin = currentUser?.role === "admin";

  const filtered = factories.filter((f) =>
    !search || [f.name, f.address, f.contact_person].some((x) => x?.toLowerCase().includes(search.toLowerCase()))
  );

  async function save(data) {
    const isNew = !data.id;
    const record = isNew ? { ...data, id: genId("F") } : data;
    const saved = await db.upsertFactory(record);
    if (saved) setFactories((p) => isNew ? [...p, saved] : p.map((f) => f.id === saved.id ? saved : f));
    showToast(isNew ? "Factory added" : "Factory updated");
    setShowForm(false); setEditingFactory(null);
  }

  async function del(id) {
    askConfirm("Delete this factory? This cannot be undone.", async () => {
      await db.deleteFactory(id);
      setFactories((p) => p.filter((f) => f.id !== id));
      showToast("Factory deleted");
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30">
      <div className="bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div><h1 className="text-3xl font-bold">Factories</h1><p className="text-slate-400 mt-1 text-sm">Manage factory locations and contacts</p></div>
            <Btn variant="amber" size="lg" onClick={() => { setEditingFactory(null); setShowForm(true); }}>{Icon.plus} Add Factory</Btn>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10 mt-6 inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">{Icon.building}</div>
            <div><p className="text-2xl font-bold">{factories.length}</p><p className="text-slate-300 text-xs">Total Factories</p></div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {showForm && (
          <div className="mb-6">
            <FactoryForm fac={editingFactory} onSave={save} onCancel={() => { setShowForm(false); setEditingFactory(null); }} />
          </div>
        )}
        {!showForm && (
          <>
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{Icon.search}</span>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search factories…" className="pl-11" />
            </div>
            {filtered.length === 0
              ? <EmptyState icon={Icon.building} title="No factories found" subtitle="Add your first factory"
                  action={<Btn variant="amber" onClick={() => setShowForm(true)}>{Icon.plus} Add Factory</Btn>} />
              : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((f) => (
                    <Card key={f.id} className="shadow-sm hover:shadow-lg transition-all p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">{Icon.building}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-base">{f.name}</h3>
                            {f.main_items?.length > 0 && (
                              <div className="flex flex-wrap gap-1 my-1.5">
                                {f.main_items.map((it) => <span key={it} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">{it}</span>)}
                              </div>
                            )}
                            <div className="space-y-1 text-sm text-slate-600">
                              {f.address && <div className="flex items-start gap-1.5">{Icon.pin} <span className="line-clamp-2 text-xs">{f.address}</span></div>}
                              {f.contact_person && <div className="flex items-center gap-1.5">{Icon.user} <span className="text-xs">{f.contact_person}</span></div>}
                              {f.contact_phone && <div className="flex items-center gap-1.5">{Icon.phone} <span className="text-xs font-mono">{f.contact_phone}</span></div>}
                              {f.wechat_id
                                ? <div className="flex items-center gap-1.5 text-green-600">{Icon.wechat} <span className="text-xs font-mono">{f.wechat_id}</span></div>
                                : <div className="flex items-center gap-1.5 text-red-400">{Icon.wechat} <span className="text-xs">No WeChat ID</span></div>}
                            </div>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1 ml-2">
                            <Btn variant="ghost" size="sm" onClick={() => { setEditingFactory(f); setShowForm(true); }}>{Icon.edit}</Btn>
                            <Btn variant="ghost" size="sm" onClick={() => del(f.id)}>{Icon.trash}</Btn>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}

function FactoryForm({ fac, onSave, onCancel }) {
  const isEdit = !!fac?.id;
  const [form, setForm] = useState(fac || { name: "", address: "", contact_person: "", contact_phone: "", contact_email: "", wechat_id: "", main_items: [], notes: "" });
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim() && !form.main_items.includes(newItem.trim())) { set("main_items", [...form.main_items, newItem.trim()]); setNewItem(""); }
  };

  return (
    <FormCard title={isEdit ? "Edit Factory" : "Add New Factory"} onClose={onCancel}
      footer={<><Btn variant="outline" onClick={onCancel}>Cancel</Btn><Btn variant="dark" disabled={!form.name} onClick={() => onSave(form)}>{Icon.check} {isEdit ? "Update Factory" : "Add Factory"}</Btn></>}>
      <div><Label required>Factory Name</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Sunrise Textile Mills" /></div>
      <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full factory address…" rows={2} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Contact Person</Label><Input value={form.contact_person} onChange={(e) => set("contact_person", e.target.value)} placeholder="Name" /></div>
        <div><Label>Contact Phone</Label><Input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} placeholder="+86 138 0000 0000" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Email</Label><Input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="contact@factory.cn" /></div>
        <div>
          <Label>WeChat ID</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">{Icon.wechat}</span>
            <Input value={form.wechat_id} onChange={(e) => set("wechat_id", e.target.value)} placeholder="factory_wechat_id" className="pl-8" />
          </div>
          {!form.wechat_id && <p className="text-xs text-red-400 mt-1">⚠ Required for WeChat notifications</p>}
        </div>
      </div>
      <div>
        <Label>Items Factory Produces</Label>
        <div className="flex gap-2 mb-2">
          <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="e.g. Cotton Fabric"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())} />
          <Btn variant="amber" onClick={addItem}>Add</Btn>
        </div>
        {form.main_items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.main_items.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm">
                {it}
                <button type="button" onClick={() => set("main_items", form.main_items.filter((_, j) => j !== i))} className="hover:text-amber-900 ml-1">×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Additional notes…" rows={2} /></div>
    </FormCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────────────────
function UsersPage({ users, setUsers, factories, currentUser, showToast, askConfirm }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole]   = useState("");
  const [editFactory, setEditFactory] = useState("");
  const [editWechat, setEditWechat]   = useState("");
  const notAdmin = currentUser?.role !== "admin";

  function startEdit(u) {
    setEditingId(u.id); setEditName(u.full_name || ""); setEditEmail(u.email || "");
    setEditRole(u.role || "user"); setEditFactory(u.factory_id || ""); setEditWechat(u.wechat_id || "");
  }

  async function saveEdit(u) {
    const fac = factories.find((f) => f.id === editFactory);
    const updated = { ...u, full_name: editName, email: editEmail, role: editRole,
      factory_id: editRole === "supplier" ? editFactory : null,
      factory_name: editRole === "supplier" ? fac?.name : null, wechat_id: editWechat };
    const saved = await db.upsertUser(updated);
    if (saved) setUsers((p) => p.map((x) => x.id === u.id ? saved : x));
    setEditingId(null); showToast("User updated");
  }

  async function deleteUser(id) {
    if (id === currentUser?.id) { showToast("⚠ Cannot delete yourself", "error"); return; }
    askConfirm("Delete this user? This cannot be undone.", async () => {
      await db.deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
      showToast("User deleted");
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">{Icon.users}</div>
          <div><h1 className="text-3xl font-bold">User Management</h1><p className="text-slate-400 mt-1 text-sm">Manage users, roles, and supplier assignments</p></div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {notAdmin && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <span className="text-orange-500 flex-shrink-0">{Icon.alert}</span>
            <p className="text-sm text-orange-800 font-medium">Read-only view. Only administrators can edit users.</p>
          </div>
        )}
        <Card className="shadow-lg overflow-hidden">
          <div className="p-5 border-b border-slate-100"><h2 className="font-semibold text-slate-800">All Users ({users.length})</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{["User", "Email", "Role", "WeChat ID", "Factory", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      {editingId === u.id
                        ? <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9 w-36" />
                        : <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">{Icon.user}</div>
                            <span className="font-medium text-slate-800 text-sm">{u.full_name || <span className="text-slate-400 italic">No name</span>}</span>
                          </div>}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {editingId === u.id
                        ? <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="email@company.com" className="h-9 w-44" />
                        : <div className="flex items-center gap-1.5">{Icon.mail} {u.email}</div>}
                    </td>
                    <td className="px-5 py-4">
                      {editingId === u.id
                        ? <Select value={editRole} onChange={setEditRole} className="h-9 w-28"><option value="admin">Admin</option><option value="user">User</option><option value="supplier">Supplier</option></Select>
                        : <Badge className={ROLE_CSS[u.role] || ROLE_CSS.user}>{u.role || "user"}</Badge>}
                    </td>
                    <td className="px-5 py-4">
                      {editingId === u.id
                        ? <div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-600">{Icon.wechat}</span><Input value={editWechat} onChange={(e) => setEditWechat(e.target.value)} className="h-9 w-36 pl-7" /></div>
                        : u.wechat_id ? <span className="text-xs font-mono text-green-600 flex items-center gap-1">{Icon.wechat} {u.wechat_id}</span> : <span className="text-xs text-red-400">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {editingId === u.id && editRole === "supplier"
                        ? <Select value={editFactory} onChange={setEditFactory} className="h-9 w-40"><option value="">Select factory…</option>{factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</Select>
                        : <span className="text-sm text-slate-600">{u.factory_name || (u.role === "supplier" ? <span className="text-red-400 text-xs">Not assigned</span> : "—")}</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {editingId === u.id
                        ? <div className="flex items-center justify-end gap-2"><Btn variant="dark" size="sm" onClick={() => saveEdit(u)}>{Icon.check}</Btn><Btn variant="outline" size="sm" onClick={() => setEditingId(null)}>{Icon.close}</Btn></div>
                        : !notAdmin && (
                          <div className="flex items-center justify-end gap-1">
                            <Btn variant="ghost" size="sm" onClick={() => startEdit(u)}>{Icon.edit} Edit</Btn>
                            <Btn variant="ghost" size="sm" onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700">{Icon.trash}</Btn>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
