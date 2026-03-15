// v3 - notifications 5s, nav shortcuts, visits filter, dev filter/sort, pending users, rebranding
import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    // Nav
    dashboard: "Dashboard", visits: "Visits", dev: "Dev", factories: "Factories",
    users: "Users", signOut: "Sign out", loading: "Loading your data…",
    // Actions
    newVisit: "Log New Visit", newDev: "New Development", addFactory: "Add Factory",
    addUser: "Add User", search: "Search…", save: "Save", cancel: "Cancel",
    edit: "Edit", delete: "Delete", view: "View", send: "Send", confirm: "Confirm",
    createUser: "Create User", markComplete: "Mark Complete", reopen: "Reopen",
    remind: "Remind", addUpdate: "Add Update", backToVisits: "Back to Visits",
    backToDevs: "Back to Developments", deleteVisit: "Delete Visit",
    deleteDev: "Delete Development", deleteFactory: "Delete Factory",
    // Status
    active: "Active", completed: "Completed", total: "Total", open: "Open",
    inProgress: "In Progress", cancelled: "Cancelled",
    // Dashboard
    totalVisits: "Total Visits", activeDevs: "Active Devs",
    needsFollowUp: "Needs Follow-up", recentVisits: "Recent Visits",
    recentDevs: "Recent Developments", viewAll: "View All",
    noVisits: "No visits yet", noDevs: "No developments yet",
    // Dev detail
    factoryUpdates: "Factory Updates", chat: "Chat", details: "Details",
    internalInfo: "🔒 Internal Info", targetDate: "Target Date", targetPrice: "Target Price",
    factoryContacts: "Factory Contacts", sellerContact: "Seller Contact",
    typeMessage: "Type a message… (Enter to send)", noMessages: "No messages yet. Start the conversation!",
    supplierPrice: "Supplier Price (¥)", internalPrice: "Target Price (RMB ¥)",
    // Visit form
    logVisit: "Log New Visit", factory: "Factory", visitor: "Visitor", purpose: "Purpose",
    item: "Item", orderNumber: "Order Number", visitDate: "Visit Date",
    location: "Location", detectLocation: "Detect Location", detecting: "Detecting…",
    addPhotos: "Add Photos", visitDetails: "Visit Details", openInAmap: "Open in Amap →",
    // Dev form
    itemName: "Item / Product Name", clientName: "Client Name", size: "Size",
    weight: "Weight", material: "Material", teamMember: "Team Member",
    selectFactories: "Select Factories", specialRemarks: "Special Remarks",
    mainPhoto: "Main Photo", additionalPhotos: "Additional Photos",
    estimatedDate: "Estimated Completion Date",
    // Factory form
    factoryName: "Factory Name", address: "Address", contactPerson: "Contact Person",
    contactPhone: "Contact Phone", contactEmail: "Contact Email", wechatId: "WeChat ID",
    mainItems: "Main Items", notes: "Notes", addItem: "Add Item",
    // Users
    userManagement: "User Management", allUsers: "All Users", fullName: "Full Name",
    email: "Email", password: "Password", role: "Role", wechat: "WeChat ID",
    resetPassword: "Reset", sendReset: "Send password reset email",
    // Notifications
    notifications: "Notifications", noNotifications: "No new notifications",
    newMessage: "New message from", newVisitLogged: "New visit logged",
    factoryAdded: "Factory added", infoEdited: "Info edited", newDevelopment: "New development",
    clearAll: "Clear all",
    // Auth
    signIn: "Log In", signUp: "Create an Account", forgotPassword: "Forgot password?",
    welcomeBack: "Log in to your account", createAccount: "Create Account",
    // Misc
    readOnly: "Read-only view. Only administrators can edit users.",
    noWeChat: "No WeChat ID", notAssigned: "Not assigned", noFactory: "No factory",
    searchFactories: "Search factories…", searchDevs: "Search developments…",
    newestFirst: "Newest First", nameAZ: "Name A-Z", allFactories: "All Factories",
    followUpNeeded: "⏰ Follow-up needed", daysOpen: "d open", daysToComplete: "d to complete",
    sameDay: "Same day", today: "Today", thisWeek: "This Week", allTime: "All Time",
    month: "Month", year: "Year", clearFilter: "Clear filter", allVisitors: "All Visitors",
    allTeamMembers: "All Team Members", byTeamMember: "By Team Member",
    manageFactories: "Manage factory locations and contacts", totalFactories: "Total Factories",
    development: "development", developments: "developments", open3Days: "open 3+ days with no factory update",
    updateFactory: "Update Factory", noVisitsFound: "No visits found", noDevsFound: "No developments found",
    logFirstVisit: "Log your first factory visit", createFirstDev: "Create your first development request",
    backToVisits: "Back to Visits", backToDevs: "Back to Developments",
    factoryTrackerTitle: "Fashion-Passion", internalUseOnly: "Fashion-Passion · Internal Use Only",
    // Supplier/Dev view (hardcoded strings)
    myAssignedDevs: "我的开发任务", assignedToFactory: "分配给您工厂的开发项目",
    noDevsYet: "暂无开发记录", assignedWillAppear: "分配给您工厂的开发将显示在这里",
    viewAndUpdate: "查看 & 更新 →",
    statusHistory: "状态历史", factoryUpdatesCount: "工厂更新",
    submitUpdate: "提交更新", submitMarkComplete: "✅ 提交并标记完成",
    noUpdateYet: "暂无更新。使用「提交更新」发布进度。",
    tickSteps: "请勾选您当前正在进行的步骤",
    productionSteps: "生产步骤", estOverallFinish: "预计总完成日期",
    additionalNotes: "附加备注", progressPhotos: "进度照片",
    specialRemarksLabel: "📋 特殊备注", sellerContactLabel: "销售联系人",
    teamMemberLabel: "跟进人员", createdLabel: "创建时间", factoriesLabel: "工厂",
    clientLabel: "客户", done: "✓ 完成", upcoming: "待完成", overdue: "已逾期",
    darkMode: "深色模式", lightMode: "浅色模式",
  },
  zh: {
    // Nav
    dashboard: "首页", visits: "工厂拜访", dev: "开发", factories: "工厂",
    users: "用户", signOut: "退出登录", loading: "加载数据中…",
    // Actions
    newVisit: "记录拜访", newDev: "新建开发", addFactory: "添加工厂",
    addUser: "添加用户", search: "搜索…", save: "保存", cancel: "取消",
    edit: "编辑", delete: "删除", view: "查看", send: "发送", confirm: "确认",
    createUser: "创建用户", markComplete: "标记完成", reopen: "重新开启",
    remind: "提醒", addUpdate: "添加更新", backToVisits: "返回拜访列表",
    backToDevs: "返回开发列表", deleteVisit: "删除拜访",
    deleteDev: "删除开发", deleteFactory: "删除工厂",
    // Status
    active: "进行中", completed: "已完成", total: "总计", open: "待处理",
    inProgress: "进行中", cancelled: "已取消",
    // Dashboard
    totalVisits: "拜访总数", activeDevs: "进行中开发",
    needsFollowUp: "需要跟进", recentVisits: "最近拜访",
    recentDevs: "最近开发", viewAll: "查看全部",
    noVisits: "暂无拜访记录", noDevs: "暂无开发记录",
    // Dev detail
    factoryUpdates: "工厂更新", chat: "聊天", details: "详情",
    internalInfo: "🔒 内部信息", targetDate: "目标日期", targetPrice: "目标价格",
    factoryContacts: "工厂联系人", sellerContact: "销售联系人",
    typeMessage: "输入消息…（回车发送）", noMessages: "暂无消息，开始对话吧！",
    supplierPrice: "供应商报价 (¥)", internalPrice: "目标价格（人民币 ¥）",
    // Visit form
    logVisit: "记录新拜访", factory: "工厂", visitor: "拜访人", purpose: "目的",
    item: "品项", orderNumber: "订单号", visitDate: "拜访日期",
    location: "位置", detectLocation: "自动定位", detecting: "定位中…",
    addPhotos: "添加照片", visitDetails: "拜访详情", openInAmap: "在高德地图中打开 →",
    // Dev form
    itemName: "产品名称", clientName: "客户名称", size: "尺寸",
    weight: "重量", material: "材质", teamMember: "跟进人员",
    selectFactories: "选择工厂", specialRemarks: "特殊备注",
    mainPhoto: "主图", additionalPhotos: "附加图片",
    estimatedDate: "预计完成日期",
    // Factory form
    factoryName: "工厂名称", address: "地址", contactPerson: "联系人",
    contactPhone: "联系电话", contactEmail: "联系邮箱", wechatId: "微信号",
    mainItems: "主要产品", notes: "备注", addItem: "添加产品",
    // Users
    userManagement: "用户管理", allUsers: "所有用户", fullName: "姓名",
    email: "邮箱", password: "密码", role: "角色", wechat: "微信号",
    resetPassword: "重置", sendReset: "发送重置密码邮件",
    // Notifications
    notifications: "通知", noNotifications: "暂无新通知",
    newMessage: "新消息来自", newVisitLogged: "新增拜访记录",
    factoryAdded: "工厂已添加", infoEdited: "信息已更新", newDevelopment: "新建开发",
    clearAll: "清除全部",
    // Auth
    signIn: "登录", signUp: "创建账户", forgotPassword: "忘记密码？",
    welcomeBack: "登录您的账户", createAccount: "创建账户",
    // Misc
    readOnly: "只读模式，只有管理员可以编辑用户。",
    noWeChat: "无微信号", notAssigned: "未分配", noFactory: "无工厂",
    searchFactories: "搜索工厂…", searchDevs: "搜索开发…",
    newestFirst: "最新优先", nameAZ: "名称 A-Z", allFactories: "所有工厂",
    followUpNeeded: "⏰ 需要跟进", daysOpen: "天 未完成", daysToComplete: "天 完成",
    sameDay: "当天完成", today: "今天", thisWeek: "本周", allTime: "全部时间",
    month: "月份", year: "年份", clearFilter: "清除筛选", allVisitors: "所有拜访人",
    allTeamMembers: "所有跟进人员", byTeamMember: "按跟进人员",
    manageFactories: "管理工厂地址和联系方式", totalFactories: "工厂总数",
    development: "条开发", developments: "条开发", open3Days: "超3天无工厂更新",
    updateFactory: "更新工厂", noVisitsFound: "未找到拜访记录", noDevsFound: "未找到开发记录",
    logFirstVisit: "记录您的第一次工厂拜访", createFirstDev: "创建第一个开发请求",
    backToVisits: "返回拜访列表", backToDevs: "返回开发列表",
    factoryTrackerTitle: "Fashion-Passion", internalUseOnly: "Fashion-Passion · 仅供内部使用",
    // Supplier/Dev view (hardcoded strings)
    myAssignedDevs: "我的开发任务", assignedToFactory: "分配给您工厂的开发项目",
    noDevsYet: "暂无开发记录", assignedWillAppear: "分配给您工厂的开发将显示在这里",
    viewAndUpdate: "查看 & 更新 →",
    statusHistory: "状态历史", factoryUpdatesCount: "工厂更新",
    submitUpdate: "提交更新", submitMarkComplete: "✅ 提交并标记完成",
    noUpdateYet: "暂无更新。使用「提交更新」发布进度。",
    tickSteps: "请勾选您当前正在进行的步骤",
    productionSteps: "生产步骤", estOverallFinish: "预计总完成日期",
    additionalNotes: "附加备注", progressPhotos: "进度照片",
    specialRemarksLabel: "📋 特殊备注", sellerContactLabel: "销售联系人",
    teamMemberLabel: "跟进人员", createdLabel: "创建时间", factoriesLabel: "工厂",
    clientLabel: "客户", done: "✓ 完成", upcoming: "待完成", overdue: "已逾期",
    darkMode: "深色模式", lightMode: "浅色模式",
  }
};
let globalLang = "en";
const getLang = () => globalLang;
const t = (key) => TRANSLATIONS[globalLang]?.[key] || TRANSLATIONS.en[key] || key;

// React hook version for components that need reactive translations
const useT = () => {
  const [, forceUpdate] = useState(0);
  return (key) => TRANSLATIONS[globalLang]?.[key] || TRANSLATIONS.en[key] || key;
};

// Loka Fashion Logo — actual brand image
const LOKA_LOGO_SRC = "data:image/png;base64,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";
const LokaLogo = ({ size = 32 }) => (
  <img src={LOKA_LOGO_SRC} alt="Loka Fashion" width={size} height={size}
    style={{ objectFit: "contain", borderRadius: 8, background: "white", padding: 2 }}
    onError={(e) => { e.target.style.display="none"; }}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CONFIG — paste your project URL and anon key here
// ─────────────────────────────────────────────────────────────────────────────
// WGS-84 → GCJ-02 (Mars Coordinates) conversion — required for accurate AMap geocoding in China
function wgs84ToGcj02(lat, lng) {
  const a = 6378245.0, ee = 0.00669342162296594323;
  function transformLat(x, y) {
    let r = -100 + 2*x + 3*y + 0.2*y*y + 0.1*x*y + 0.2*Math.sqrt(Math.abs(x));
    r += (20*Math.sin(6*x*Math.PI) + 20*Math.sin(2*x*Math.PI)) * 2/3;
    r += (20*Math.sin(y*Math.PI) + 40*Math.sin(y/3*Math.PI)) * 2/3;
    r += (160*Math.sin(y/12*Math.PI) + 320*Math.sin(y*Math.PI/30)) * 2/3;
    return r;
  }
  function transformLng(x, y) {
    let r = 300 + x + 2*y + 0.1*x*x + 0.1*x*y + 0.1*Math.sqrt(Math.abs(x));
    r += (20*Math.sin(6*x*Math.PI) + 20*Math.sin(2*x*Math.PI)) * 2/3;
    r += (20*Math.sin(x*Math.PI) + 40*Math.sin(x/3*Math.PI)) * 2/3;
    r += (150*Math.sin(x/12*Math.PI) + 300*Math.sin(x/30*Math.PI)) * 2/3;
    return r;
  }
  const dLat = transformLat(lng - 105, lat - 35);
  const dLng = transformLng(lng - 105, lat - 35);
  const radLat = lat / 180 * Math.PI;
  const magic = 1 - ee * Math.sin(radLat) ** 2;
  const sqrtMagic = Math.sqrt(magic);
  return {
    lat: lat + (dLat * 180) / (a * (1 - ee) / (magic * sqrtMagic) * Math.PI),
    lng: lng + (dLng * 180) / (a / sqrtMagic * Math.cos(radLat) * Math.PI),
  };
}

const SUPABASE_URL  = "https://gtgwnvtckrnhzbjodgvd.supabase.co";
// ── EmailJS config ────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID         = "service_x78l5ad";
const EMAILJS_TEMPLATE_ID        = "template_imrpdcg";
const EMAILJS_WEEKLY_TEMPLATE_ID = "template_weekly";
const EMAILJS_PUBLIC_KEY  = "PPb7_rwXSmdYMdXFw";
async function sendFollowUpEmail({ to_email, to_name, dev_title, factory_name, step_name, status_message, dev_image, dev_link }) {
  if (!to_email) return;
  try {
    if (!window.emailjs) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(); };
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email, to_name: to_name || "Team", dev_title, factory_name, step_name, status_message,
      dev_image: dev_image || "",
      dev_link: dev_link || "",
    });
    console.log("Follow-up email sent to", to_email);
  } catch (err) {
    console.error("EmailJS error:", err);
  }
}
async function sendWeeklySummaryEmail({ to_email, to_name, summary_html, week_label }) {
  if (!to_email) return;
  try {
    if (!window.emailjs) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(); };
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_WEEKLY_TEMPLATE_ID, {
      to_email, to_name: to_name || "Team", summary_html, week_label,
    });
    console.log("Weekly summary sent to", to_email);
  } catch (err) {
    console.error("Weekly email error:", err);
  }
}
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Z3dudnRja3JuaHpiam9kZ3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTAzNDAsImV4cCI6MjA4ODc4NjM0MH0.4-7mYTWKjabHOlvNMuNJ3o_pzhDDoGd_2XFDwIbGvNc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
// VAPID public key — generate once with: npx web-push generate-vapid-keys
// Then set VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT in Supabase secrets
const VAPID_PUBLIC_KEY = "BOymcB5Ldv_zN-IQQ2LosmYLCbK09S0B45ecFYg4zUsoZOV56HysYwauOploKMoo8b7IAuhTaE29OO0M2Yib3Zw";

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT TO EXCEL — uses SheetJS loaded from CDN
// ─────────────────────────────────────────────────────────────────────────────
async function exportToExcel(rows, filename) {
  if (!window.XLSX) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const ws = window.XLSX.utils.json_to_sheet(rows);
  const wb = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(wb, ws, "Data");
  window.XLSX.writeFile(wb, filename);
}
// Compress image to max 1200px wide and ~80% quality before uploading
async function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob || file), "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

async function uploadImage(file) {
  const compressed = await compressImage(file);
  const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
  const { error } = await supabase.storage.from("photos").upload(path, compressed, { upsert: false, contentType: "image/jpeg" });
  if (error) throw error;
  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}

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
// NOTE: Run this SQL in Supabase if not done:
// ALTER TABLE users ADD COLUMN IF NOT EXISTS status text DEFAULT 'approved';
// UPDATE users SET status = 'approved' WHERE status IS NULL;
const db = {
  // FACTORIES
  async getFactories()          { const { data } = await supabase.from("factories").select("*").order("name"); return data || []; },
  async upsertFactory(f)        { const { data } = await supabase.from("factories").upsert(f).select().single(); return data; },
  async deleteFactory(id)       { await supabase.from("factories").delete().eq("id", id); },

  // USERS
  async getUsers()              { const { data } = await supabase.from("users").select("*").order("full_name"); return data || []; },
  async getPendingUsers()        { const { data } = await supabase.from("users").select("*").eq("status", "pending").order("full_name"); return data || []; },
  async approveUser(id)          { const { data } = await supabase.from("users").update({ status: "approved" }).eq("id", id).select().single(); return data; },
  async rejectUser(id)           { await supabase.from("users").delete().eq("id", id); },
  async upsertUser(u)           { const { data } = await supabase.from("users").upsert(u).select().single(); return data; },
  async deleteUser(id)          { await supabase.from("users").update({ status: "blocked" }).eq("id", id); },

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
  async upsertDev(d) {
    // Only send columns that exist in the developments table
    const allowed = ["id","title","department","client_name","buyer_name","mail_subject",
      "factory_ids","factory_names","team_member_name","team_member_id",
      "assigned_user_id","assigned_user_name",
      "material","size","weight","internal_estimated_date","internal_estimated_price",
      "internal_notes","special_remarks","picture_url","additional_pictures",
      "artwork_files","status","status_history","created_date","last_edited_at"];
    const record = Object.fromEntries(Object.entries(d).filter(([k]) => allowed.includes(k)));
    const { data, error } = await supabase.from("developments").upsert(record).select().single();
    if (error) {
      // If new columns don't exist yet, retry with only the base columns
      if (error.message?.includes("column") && error.message?.includes("schema cache")) {
        const base = ["id","title","department","client_name","buyer_name","mail_subject",
          "factory_ids","factory_names","team_member_name","team_member_id",
          "material","size","weight","internal_estimated_date","internal_estimated_price",
          "special_remarks","picture_url","additional_pictures",
          "artwork_files","status","status_history","created_date"];
        const fallback = Object.fromEntries(Object.entries(d).filter(([k]) => base.includes(k)));
        const { data: d2, error: e2 } = await supabase.from("developments").upsert(fallback).select().single();
        if (e2) { alert("Save failed: " + e2.message); } return d2;
      }
      alert("Save failed: " + error.message);
    }
    return data;
  },
  async deleteDev(id)           { await supabase.from("developments").delete().eq("id", id); },
  async insertUpdate(u) {
    const allowed = ["id","development_id","factory_id","factory_name","type",
      "materials_status","materials_arrival_date","estimated_finish_date",
      "supplier_price","production_status","notes","progress_pictures",
      "production_steps","created_date"];
    const record = Object.fromEntries(Object.entries(u).filter(([k]) => allowed.includes(k)));
    const { data, error } = await supabase.from("development_updates").insert(record).select().single();
    if (error) console.error("insertUpdate failed:", error.message, record);
    return data;
  },
  async insertMessage(m) {
    const allowed = ["id","development_id","sender_name","sender_role","message","read_by","created_date"];
    const record = Object.fromEntries(Object.entries(m).filter(([k]) => allowed.includes(k)));
    const { data, error } = await supabase.from("development_messages").insert(record).select().single();
    if (error) console.error("insertMessage failed:", error.message, record);
    return data;
  },
  async markMessagesRead(devId, userName) {
    // Get all messages in this dev not sent by user and not yet read by them
    const { data: msgs } = await supabase.from("development_messages")
      .select("id, read_by").eq("development_id", devId);
    if (!msgs) return;
    for (const msg of msgs) {
      const readBy = msg.read_by || [];
      if (!readBy.includes(userName)) {
        await supabase.from("development_messages").update({ read_by: [...readBy, userName] }).eq("id", msg.id);
      }
    }
  },

  // VISITS
  async getVisits()             { const { data } = await supabase.from("visits").select("*").order("visit_date", { ascending: false }); return data || []; },
  async upsertVisit(v)          { const { data, error } = await supabase.from("visits").upsert(v).select().single(); if (error) { alert("Save failed: " + error.message); } return data; },
  async deleteVisit(id)         { await supabase.from("visits").delete().eq("id", id); },

  // Notifications
  async getNotifs(userId)       { const { data } = await supabase.from("notifications").select("*").eq("recipient_id", userId).eq("read", false).order("created_at", { ascending: false }).limit(50); return data || []; },
  async insertNotif(n)          { const { data, error } = await supabase.from("notifications").insert(n).select().single(); if (error) console.error("insertNotif failed:", error.message, n); return data; },
  async markNotifRead(id)       { await supabase.from("notifications").update({ read: true }).eq("id", id); },
  async markAllNotifsRead(userId) { await supabase.from("notifications").update({ read: true }).eq("recipient_id", userId).eq("read", false); },
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const DEV_STATUS_CSS = {
  pending: "bg-slate-100 text-slate-600", open: "bg-blue-100 text-blue-800", in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
};
const DEV_STATUS_LABEL = () => ({ pending: t("pending") || "Pending", open: t("open"), in_progress: t("inProgress"), completed: t("completed"), cancelled: t("cancelled") });
const MAT_LABEL = { not_started: "Not Started", sourcing: "Sourcing", ordered: "Ordered", received: "Received", unavailable: "Unavailable" };
const PRODUCTION_STEPS_EN = {
  original_sample:   "Waiting for Original Sample",
  sourcing_materials:"Sourcing Materials",
  waiting_materials: "Waiting for Materials",
  open_mold:         "Open Mold",
  printing:          "Printing",
  dyeing_fabric:     "Dyeing Fabric",
  embroidery:        "Making Embroidery",
  lab_dips:          "Arranging Lab Dips",
  metal_plating:     "Metal Plating",
  washing:           "Washing",
  quilting:          "Quilting",
  stitching:         "Stitching",
  assembly:          "Assembling",
  revising_sample:   "Revising Sample",
  waiting_client:    "Waiting for Client Confirmation",
};
const PRODUCTION_STEPS_ZH = {
  original_sample:   "等待原版样品",
  sourcing_materials:"采购材料",
  waiting_materials: "等待材料",
  open_mold:         "开模",
  printing:          "印刷",
  dyeing_fabric:     "染色",
  embroidery:        "刺绣制作",
  lab_dips:          "安排试色",
  metal_plating:     "电镀",
  washing:           "水洗",
  quilting:          "绗缝",
  stitching:         "缝制",
  assembly:          "组装",
  revising_sample:   "修改样品",
  waiting_client:    "等待客户确认",
};
const PRODUCTION_STEPS = [
  { id: "original_sample",   label: "Waiting for Original Sample",  icon: "🔬" },
  { id: "sourcing_materials",label: "Sourcing Materials",           icon: "🔍" },
  { id: "waiting_materials", label: "Waiting for Materials",        icon: "⏳" },
  { id: "open_mold",         label: "Open Mold",                    icon: "🔩" },
  { id: "printing",          label: "Printing",                     icon: "🖨️" },
  { id: "dyeing_fabric",     label: "Dyeing Fabric",                icon: "🎨" },
  { id: "embroidery",        label: "Making Embroidery",            icon: "🧵" },
  { id: "lab_dips",          label: "Arranging Lab Dips",           icon: "🧪" },
  { id: "metal_plating",     label: "Metal Plating",                icon: "✨" },
  { id: "washing",           label: "Washing",                      icon: "🫧" },
  { id: "quilting",          label: "Quilting",                     icon: "🪡" },
  { id: "stitching",         label: "Stitching",                    icon: "🧶" },
  { id: "assembly",          label: "Assembling",                   icon: "🔧" },
  { id: "revising_sample",   label: "Revising Sample",              icon: "✏️" },
  { id: "waiting_client",    label: "Waiting for Client Confirmation", icon: "🤝" },
];
function getStepLabel(id) {
  return (globalLang === "zh" ? PRODUCTION_STEPS_ZH[id] : PRODUCTION_STEPS_EN[id]) || id;
}
const ROLE_CSS  = { admin: "bg-purple-100 text-purple-700", user: "bg-blue-100 text-blue-700", supplier: "bg-orange-100 text-orange-700", viewer: "bg-teal-100 text-teal-700" };

function genId(prefix) {
  return prefix + Date.now().toString(36).toUpperCase().slice(-4) + Math.random().toString(36).slice(2,5).toUpperCase();
}
// ── China Time (UTC+8) helpers — app is China-only ──────────────────────────
function getChinaNow() {
  // Returns current time shifted to UTC+8
  return new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
}
function getChinaToday() {
  // Returns UTC+8 midnight as a Date object for comparisons
  const cn = getChinaNow();
  return new Date(Date.UTC(cn.getUTCFullYear(), cn.getUTCMonth(), cn.getUTCDate()));
}
function getChinaTodayStr() {
  // Returns today's date string in UTC+8 as YYYY-MM-DD
  const cn = getChinaNow();
  return cn.toISOString().slice(0, 10);
}
function parseLocalDate(str) {
  // Parse YYYY-MM-DD as UTC+8 midnight
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)); // stored as UTC midnight = China date
}
function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((parseLocalDate(dateStr) - getChinaNow()) / 86400000);
  if (diff < 0) return `Overdue by ${Math.abs(diff)} Day${Math.abs(diff) !== 1 ? "s" : ""}`;
  if (diff === 0) return "Due Today";
  return `${diff} Day${diff !== 1 ? "s" : ""} Left`;
}
function daysLeftShort(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((parseLocalDate(dateStr) - getChinaNow()) / 86400000);
  if (diff < 0) return `Overdue ${Math.abs(diff)}d`;
  if (diff === 0) return "Due Today";
  return `${diff} Days Left`;
}
function daysAgo(d) {
  if (!d) return 0;
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}
function fmtDate(d, withTime) {
  if (!d) return "—";
  const locale = globalLang === "zh" ? "zh-CN" : "en-GB";
  const opts = globalLang === "zh"
    ? { year: "numeric", month: "2-digit", day: "2-digit" }
    : { day: "2-digit", month: "short", year: "numeric" };
  if (withTime) { opts.hour = "2-digit"; opts.minute = "2-digit"; }
  return new Date(d).toLocaleDateString(locale, opts);
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
const DEV_ICON_SRC = "data:image/jpeg;base64,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";
const FACTORY_ICON_SRC = "data:image/png;base64,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";

const Icon = {
  plus:      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  search:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  eye:       <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  edit:      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  building:  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M9 21v-4h6v4"/></svg>,
  users:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  flask:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 3h6v5l4 9H5l4-9V3z"/><path d="M6 14h12"/></svg>,
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
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    try {
      const publicUrl = await uploadImage(f);
      onChange(publicUrl);
    } catch (err) {
      alert("Upload failed: " + (err.message || err));
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <Label>{label}</Label>
      {uploading ? (
        <div className={`flex flex-col items-center justify-center border-2 border-dashed border-amber-300 rounded-xl bg-amber-50 ${small ? "h-28" : "h-40"}`}>
          <div className="text-amber-600 text-sm font-medium animate-pulse">Uploading…</div>
        </div>
      ) : url ? (
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

// ─────────────────────────────────────────────────────────────────────────────
// Slideshow Viewer — for "viewer" role, shown on TV/big screen
// ─────────────────────────────────────────────────────────────────────────────
function SlideshowViewer({ visits, devs, onSignOut }) {
  const DURATION = 30000;
  const sorted = [...visits].sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));

  // Build sequence: dashboard (preview), visit, dashboard (preview), visit...
  const sequence = [];
  sorted.forEach((v, i) => {
    sequence.push({ type: "dashboard", upcomingIndex: i });
    sequence.push({ type: "visit", data: v, index: i });
  });

  const [seqIdx, setSeqIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [progress, setProgress] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const startRef = useRef(Date.now());
  const intervalRef = useRef(null);

  const current = sequence[seqIdx] || sequence[0];
  const visit = current?.type === "visit" ? current.data : null;
  const photos = visit ? [visit.picture_url, ...(visit.additional_pictures || [])].filter(Boolean) : [];

  function goTo(newIdx) {
    setFade(false);
    setTimeout(() => {
      const i = ((newIdx % sequence.length) + sequence.length) % sequence.length;
      setSeqIdx(i);
      setPhotoIdx(0);
      setProgress(0);
      startRef.current = Date.now();
      setFade(true);
    }, 500);
  }

  function next() { goTo(seqIdx + 1); }
  function prev() { goTo(seqIdx - 1); }

  // Auto-advance
  useEffect(() => {
    if (!sequence.length) return;
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { clearInterval(intervalRef.current); next(); }
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [seqIdx, sequence.length]);

  // Cycle photos
  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setPhotoIdx(p => (p + 1) % photos.length), DURATION / photos.length);
    return () => clearInterval(t);
  }, [seqIdx, photos.length]);

  if (!sequence.length) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white text-4xl">No visits to display</div>
  );

  // Stats for dashboard screen
  const totalVisits = visits.length;
  const thisMonth = visits.filter(v => { const d = new Date(v.visit_date); const n = getChinaNow(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length;
  const activeDevs = devs?.filter(d => d.status === "open" || d.status === "in_progress").length || 0;
  const recentVisits = sorted.slice(0, 8);

  // Shared top bar
  const TopBar = ({ label, counter }) => (
    <div className="relative z-10 flex items-center justify-between px-12 pt-8 pb-4">
      <div className="flex items-center gap-4">
        <LokaLogo size={56} />
        <div>
          <p className="text-white font-black text-3xl tracking-tight">Loka Fashion</p>
          <p className="text-amber-400 text-base font-medium">{label}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {counter && <span className="text-white/50 text-xl font-medium">{counter}</span>}
        <button onClick={(e) => { e.stopPropagation(); onSignOut(); }}
          className="text-white/40 hover:text-white text-base px-5 py-2 rounded-xl border border-white/20 hover:border-white/50 transition-all">
          Exit
        </button>
      </div>
    </div>
  );

  // Progress bar
  const ProgressBar = () => (
    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/10">
      <div className="h-full bg-amber-400 transition-none" style={{ width: `${progress}%` }} />
    </div>
  );

  // Nav arrows
  const Arrows = () => (<>
    <button onClick={(e) => { e.stopPropagation(); prev(); }}
      className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all opacity-0 hover:opacity-100">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button onClick={(e) => { e.stopPropagation(); next(); }}
      className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all opacity-0 hover:opacity-100">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </>);

  // ── VISIT SLIDE ──
  if (current.type === "visit" && visit) {
    return (
      <div className="min-h-screen bg-black flex flex-col relative overflow-hidden select-none" onClick={next}>
        {/* Background photo */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
          {photos.length > 0
            ? <img src={photos[photoIdx]} alt="" className="w-full h-full object-contain bg-black" />
            : <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <svg width="120" height="120" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5} className="text-slate-700"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
          }
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />
        </div>

        <TopBar label="Factory Visit" counter={`${current.index + 1} / ${sorted.length}`} />

        {/* Main info — bottom */}
        <div className={`relative z-10 mt-auto px-12 pb-10 transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
          {photos.length > 1 && (
            <div className="flex gap-2 mb-6">
              {photos.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i === photoIdx ? "w-10 bg-amber-400" : "w-3 bg-white/30"}`} />)}
            </div>
          )}
          <div className="flex items-end justify-between gap-12">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-amber-400 text-xl font-bold uppercase tracking-widest">Factory Visit</span>
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="text-white/60 text-xl">{fmtDate(visit.visit_date, true)}</span>
              </div>
              <h2 className="text-white font-black leading-tight mb-3" style={{fontSize:"clamp(2rem,4vw,3.5rem)",wordBreak:"break-word"}}>{visit.factory_name}</h2>
              <p className="text-amber-300 font-bold mb-3 truncate" style={{fontSize:"clamp(1.5rem,3vw,2.5rem)"}}>{visit.item}</p>
              {visit.purpose && <p className="text-white/70 leading-relaxed line-clamp-2" style={{fontSize:"clamp(1rem,1.8vw,1.5rem)"}}>{visit.purpose}</p>}
            </div>
            <div className="flex-shrink-0 text-right space-y-4">
              {visit.visitor_name && (
                <div className="flex items-center justify-end gap-4">
                  <div>
                    <p className="text-white/50 text-base uppercase tracking-wider">Visitor</p>
                    <p className="text-white font-bold" style={{fontSize:"clamp(1.2rem,2.5vw,2rem)"}}>{visit.visitor_name}</p>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-amber-500/30 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 font-black" style={{fontSize:"2rem"}}>
                    {visit.visitor_name[0]}
                  </div>
                </div>
              )}
              {visit.location_address && (
                <div className="flex items-center justify-end gap-2 text-white/50" style={{fontSize:"clamp(0.85rem,1.2vw,1.1rem)"}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="max-w-md truncate">{visit.location_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <ProgressBar />
        <Arrows />
      </div>
    );
  }

  // ── DASHBOARD SLIDE ──
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden select-none" onClick={next}>
      <div className={`flex flex-col h-screen transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
        <TopBar label="Visit Overview" />

        <div className="flex-1 px-12 pb-12 flex flex-col gap-8 overflow-hidden">
          {/* Stat boxes */}
          <div className="grid grid-cols-3 gap-6 flex-shrink-0">
            {[
              { label: "Total Visits", value: totalVisits, color: "from-blue-600 to-blue-700", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
              { label: "This Month",   value: thisMonth,   color: "from-amber-500 to-amber-600", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
              { label: "Active Devs",  value: activeDevs,  color: "from-purple-600 to-purple-700", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg> },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className={`bg-gradient-to-br ${color} rounded-3xl p-8 flex items-center gap-6 shadow-2xl`}>
                <div className="text-white/70">{icon}</div>
                <div>
                  <p className="text-white font-black" style={{fontSize:"clamp(2.5rem,5vw,4rem)"}}>{value}</p>
                  <p className="text-white/80 font-semibold" style={{fontSize:"clamp(1rem,1.5vw,1.4rem)"}}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent visits grid */}
          <div className="flex-1 min-h-0">
            <p className="text-white/50 text-xl font-semibold uppercase tracking-widest mb-4">Recent Factory Visits</p>
            <div className="grid grid-cols-4 gap-4 h-full">
              {recentVisits.map((v, i) => {
                const photo = v.picture_url || v.additional_pictures?.[0];
                const isActive = i === current.upcomingIndex;
                return (
                  <div key={v.id} className={`rounded-2xl overflow-hidden bg-slate-800 flex flex-col border transition-all duration-500 ${isActive ? "border-amber-400 ring-2 ring-amber-400 shadow-xl shadow-amber-900/40" : "border-white/5 opacity-60 scale-95"}`}>
                    <div className="h-36 bg-slate-700 flex-shrink-0 overflow-hidden relative">
                      {photo
                        ? <img src={photo} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                      }
                      {isActive && (
                        <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">NEXT</div>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col items-center justify-center text-center gap-1">
                      <p className="text-white font-bold text-base leading-tight">{v.factory_name}</p>
                      <p className="text-amber-400 text-sm">{v.item}</p>
                      {v.visitor_name && <p className="text-white/80 text-sm flex items-center gap-1">👤 {v.visitor_name}</p>}
                      <p className="text-white/40 text-xs">{fmtDate(v.visit_date, true)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <ProgressBar />
      <Arrows />
    </div>
  );
}

// Loading screen
function LoadingScreen({ message = "Connecting to database…" }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
      <div className="animate-pulse"><LokaLogo size={72} /></div>
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
  const [mode, setMode]       = useState("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [info, setInfo]       = useState("");
  const [loginLang, setLoginLang] = useState("en");

  function switchLang(l) { setLoginLang(l); globalLang = l; }

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    // Check status BEFORE attempting auth — uses SECURITY DEFINER RPC to bypass RLS
    const { data: status } = await supabase.rpc("get_user_status", { user_email: email });
    if (status === null) {
      setLoading(false);
      setError(loginLang === "zh" ? "此账户不存在或已被停用。" : "This account does not exist or has been disabled.");
      return;
    }
    if (status === "pending") {
      setLoading(false);
      setError(loginLang === "zh" ? "您的账户正在等待管理员审批，请稍后再试。" : "Your account is pending admin approval. Please try again later.");
      return;
    }
    if (status === "blocked") {
      setLoading(false);
      setError(loginLang === "zh" ? "此账户已被停用，请联系管理员。" : "This account has been disabled. Please contact your admin.");
      return;
    }
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
    if (err) { setLoading(false); setError(err.message); return; }
    if (data?.user) {
      // Insert as pending FIRST, then immediately sign out so they cannot access the app
      await supabase.from("users").upsert({
        id: "U-" + data.user.id.slice(0, 8).toUpperCase(),
        full_name: name, email, role: "user", status: "pending",
      });
      await supabase.auth.signOut();
    }
    setLoading(false);
    setInfo(loginLang === "zh"
      ? "账户申请已提交！请等待管理员审批后方可登录。"
      : "Account request submitted! Please wait for admin approval before logging in.");
    setMode("login");
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-8">
        <LokaLogo size={128} />
        <h1 className="text-white text-2xl font-bold mt-3">{t("factoryTrackerTitle")}</h1>
        <p className="text-slate-400 text-sm mt-1">{t("welcomeBack")}</p>
        {/* Language switcher on login screen */}
        <div className="flex items-center bg-slate-700 rounded-lg overflow-hidden mt-3">
          {["en","zh"].map(l => (
            <button key={l} onClick={() => switchLang(l)}
              className={`px-3 py-1.5 text-xs font-bold transition-colors ${loginLang === l ? "bg-amber-500 text-white" : "text-slate-400 hover:text-white"}`}>
              {l === "en" ? "EN" : "中文"}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700">
        <div className="flex rounded-xl bg-slate-700 p-1 mb-6">
          {[["login", t("signIn")], ["signup", loginLang === "zh" ? "创建账户" : "Create an Account"]].map(([v, l]) => (
            <button key={v} onClick={() => { setMode(v); setError(""); setInfo(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === v ? "bg-amber-500 text-white shadow" : "text-slate-400 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>

        {info && <div className="mb-4 px-4 py-3 bg-green-900/40 border border-green-700 rounded-xl text-green-300 text-sm">{info}</div>}
        {error && <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-700 rounded-xl text-red-300 text-sm">{error}</div>}

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{loginLang === "zh" ? "姓名" : "Full Name"}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={loginLang === "zh" ? "您的姓名" : "Your full name"} required
                className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t("email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
              className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t("password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
              className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-12 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <span className="animate-spin">⏳</span> : null}
            {mode === "login" ? t("signIn") : (loginLang === "zh" ? "创建账户" : "Create an Account")}
          </button>
        </form>

        {mode === "login" && (
          <button onClick={async () => {
            if (!email) { setError("Enter your email first."); return; }
            setLoading(true);
            const { error: err } = await supabase.auth.resetPasswordForEmail(email);
            setLoading(false);
            if (err) setError(err.message);
            else setInfo(loginLang === "zh" ? "重置密码邮件已发送，请查收。" : "Password reset email sent — check your inbox.");
          }} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-4 transition-colors">
            {t("forgotPassword")}
          </button>
        )}
      </div>
      <p className="text-slate-600 text-xs mt-6">{t("internalUseOnly")}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Global Search Overlay
// ─────────────────────────────────────────────────────────────────────────────
function GlobalSearchOverlay({ query, setQuery, visits, devs, factories, onClose, onViewDev, onViewVisit, onViewFactory, currentUser }) {
  const inputRef = useRef(null);
  const isSupplier = currentUser?.role === "supplier";

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const q = query.trim().toLowerCase();

  const matchedDevs = q.length < 2 ? [] : devs.filter(d =>
    [d.title, d.client_name, d.buyer_name, d.mail_subject, d.material, ...(d.factory_names || []), d.team_member_name, d.id]
      .some(x => x?.toLowerCase().includes(q))
  ).slice(0, 6);

  const matchedVisits = (q.length < 2 || isSupplier) ? [] : visits.filter(v =>
    [v.item, v.purpose, v.order_number, v.factory_name, v.visitor_name]
      .some(x => x?.toLowerCase().includes(q))
  ).slice(0, 6);

  const matchedFactories = q.length < 2 ? [] : factories.filter(f =>
    [f.name, f.address, f.contact_person, f.contact_email]
      .some(x => x?.toLowerCase().includes(q))
  ).slice(0, 4);

  const totalResults = matchedDevs.length + matchedVisits.length + matchedFactories.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-slate-400 flex-shrink-0"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search developments, visits, factories…"
            className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent" />
          {query && <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>}
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded border border-slate-200">Esc</button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {q.length < 2 && (
            <div className="text-center py-10 text-slate-400 text-sm">Type at least 2 characters to search…</div>
          )}
          {q.length >= 2 && totalResults === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">No results for "{query}"</div>
          )}

          {matchedDevs.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Developments</div>
              {matchedDevs.map(d => (
                <button key={d.id} onClick={() => onViewDev(d.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
                    {d.picture_url ? <img src={d.picture_url} alt="" className="w-full h-full object-cover" /> :
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{d.title}</p>
                    <p className="text-xs text-slate-500 truncate">{d.factory_names?.[0]} {d.client_name ? `· ${d.client_name}` : ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${DEV_STATUS_CSS[d.status]}`}>{DEV_STATUS_LABEL()[d.status]}</span>
                </button>
              ))}
            </div>
          )}

          {matchedVisits.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Visits</div>
              {matchedVisits.map(v => (
                <button key={v.id} onClick={() => onViewVisit(v.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
                    {v.picture_url ? <img src={v.picture_url} alt="" className="w-full h-full object-cover" /> :
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22"/></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{v.item}</p>
                    <p className="text-xs text-slate-500 truncate">{v.factory_name} · {fmtDate(v.visit_date)}</p>
                  </div>
                  <span className="text-xs text-slate-400">#{v.order_number}</span>
                </button>
              ))}
            </div>
          )}

          {matchedFactories.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Factories</div>
              {matchedFactories.map(f => (
                <button key={f.id} onClick={onViewFactory}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex-shrink-0 flex items-center justify-center text-amber-500">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                    <p className="text-xs text-slate-500 truncate">{f.address || f.contact_person || "—"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {totalResults > 0 && <div className="h-3" />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App Root
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession]     = useState(undefined); // undefined = checking, null = logged out
  const [loading, setLoading]     = useState(true);
  const initialLoadDone = useRef(false);
  const [lang, setLang]           = useState("en");
  const [dark, setDark]           = useState(() => { try { return localStorage.getItem("darkMode") === "1"; } catch { return false; } });
  const [pushSubscribed, setPushSubscribed] = useState(() => { try { return localStorage.getItem("pushSubscribed") === "1"; } catch { return false; } });
  const [showProfile, setShowProfile] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  function changeLang(l) { globalLang = l; setLang(l); }
  function toggleDark() { setDark(d => { const n = !d; try { localStorage.setItem("darkMode", n ? "1" : "0"); } catch {} return n; }); }

  // ── PWA Service Worker + Push Subscription ─────────────────────────────────
  async function registerPush(userId, fromButton = false) {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      if (fromButton) showToast("Push notifications not supported on this browser", "error");
      return;
    }
    if (fromButton) setPushLoading(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        if (fromButton) showToast("Notifications blocked — please enable in browser settings", "error");
        return;
      }
      if (permission !== "granted") {
        if (fromButton) showToast("Notification permission not granted", "error");
        return;
      }
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }
      const subJson = sub.toJSON();
      await supabase.from("push_subscriptions").upsert({
        user_id: userId,
        endpoint: subJson.endpoint,
        subscription: subJson,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,endpoint" });
      try { localStorage.setItem("pushSubscribed", "1"); } catch {}
      setPushSubscribed(true);
      if (fromButton) showToast("Push notifications enabled!", "ok");
    } catch (err) {
      console.warn("Push registration failed:", err);
      if (fromButton) showToast("Failed to enable notifications", "error");
    } finally {
      if (fromButton) setPushLoading(false);
    }
  }

  async function unregisterPush(userId) {
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await supabase.from("push_subscriptions").delete().eq("user_id", userId).eq("endpoint", sub.endpoint);
          await sub.unsubscribe();
        }
      }
      try { localStorage.removeItem("pushSubscribed"); } catch {}
      setPushSubscribed(false);
      showToast("Push notifications disabled", "ok");
    } catch (err) {
      console.warn("Push unsubscribe failed:", err);
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }

  async function sendPushToUser(userId, title, body, url = "/") {
    try {
      await supabase.functions.invoke("send-push", {
        body: { user_id: userId, title, body, url },
      });
    } catch (err) {
      console.warn("Push send failed:", err);
    }
  }

  // Push a notification to the DB for a specific user (by their users-table id)
  function renderNotifMsgRaw(msgKey, msgData = {}) {
    const d = msgData;
    if (msgKey === "newDev") return `New development: ${d.title || ""}`;
    if (msgKey === "devAssigned") return `You've been assigned to: ${d.title || ""}`;
    if (msgKey === "newMsg") return `New message in ${d.title || "a development"}`;
    if (msgKey === "supplierConfirmed") return `Supplier confirmed: ${d.title || ""}`;
    if (msgKey === "supplierUpdate") return `Factory update on: ${d.title || ""}`;
    if (msgKey === "newVisit") return `New visit logged at ${d.factory || ""}`;
    if (msgKey === "factoryAdded") return `Factory added: ${d.name || ""}`;
    if (msgKey === "infoEdited") return `Info updated: ${d.name || ""}`;
    if (msgKey === "stepDueToday") return `Step due today: ${d.step || ""} — ${d.title || ""}`;
    if (msgKey === "stepOverdue") return `Overdue ${d.days || ""}d: ${d.step || ""} — ${d.title || ""}`;
    if (msgKey === "newPendingUser") return `New user pending approval: ${d.name || ""}`;
    return msgKey;
  }

  async function pushNotif(recipientId, msgKey, msgData = {}, devId = null, type = "info") {
    if (!recipientId) return;
    const n = {
      id: genId("N"),
      recipient_id: recipientId,
      msg_key: msgKey,
      msg_data: msgData,
      dev_id: devId,
      type,
      read: false,
      created_at: new Date().toISOString(),
    };
    await db.insertNotif(n);
    // Also fire a push notification to the recipient's devices
    const notifTitle = "Fashion-Passion";
    const notifBody = renderNotifMsgRaw(msgKey, msgData);
    const notifUrl = devId ? `/#dev=${devId}` : "/";
    sendPushToUser(recipientId, notifTitle, notifBody, notifUrl).catch(() => {});
  }

  // Push to multiple recipients at once
  async function pushNotifToMany(recipientIds, msgKey, msgData = {}, devId = null, type = "info") {
    const ids = [...new Set(recipientIds.filter(Boolean))];
    await Promise.all(ids.map(id => pushNotif(id, msgKey, msgData, devId, type)));
  }
  function renderNotifMsg(n) {
    const k = n.msg_key || n.msgKey;
    const d = n.msg_data || n.msgData || {};
    if (!k) return n.msg || "";
    if (k === "factoryAdded") return `${t("factoryAdded")}: ${d.name || ""}`;
    if (k === "infoEdited") return `${t("infoEdited")}: ${d.name || ""}`;
    if (k === "factoryDeleted") return globalLang === "zh"
      ? `工厂已删除: ${d.name || ""}`
      : `Factory deleted: ${d.name || ""}`;
    if (k === "userRoleChanged") return globalLang === "zh"
      ? `${d.name || "用户"} 的角色已从 ${d.oldRole || ""} 改为 ${d.newRole || ""}`
      : `${d.name || "User"}'s role changed from ${d.oldRole || ""} to ${d.newRole || ""}`;
    if (k === "userDeleted") return globalLang === "zh"
      ? `用户已删除: ${d.name || d.email || ""}`
      : `User deleted: ${d.name || d.email || ""}`;
    if (k === "devAssigned") return globalLang === "zh"
      ? `您被分配到开发任务: "${d.title || ""}"`
      : `You were assigned to a development: "${d.title || ""}"`;
    if (k === "newDev") return globalLang === "zh"
      ? `${d.team || "有人"}新建了开发: ${d.title || ""}`
      : `${d.team || "New development"}: ${d.title || ""}`;
    if (k === "newMsg") return globalLang === "zh"
      ? `${d.sender || "有人"} 在 "${d.devTitle || "开发"}" 中发来消息: ${d.preview || ""}`
      : `${d.sender || "Someone"} in "${d.devTitle || "a development"}": ${d.preview || ""}`;
    if (k === "newVisit") return globalLang === "zh"
      ? `${d.visitor || "有人"} 拜访了 ${d.factory || ""}`
      : `${d.visitor || "Someone"} visited ${d.factory || ""}`;
    if (k === "pending") return `${globalLang === "zh" ? "新账户申请" : "New signup request"}: ${d.name || ""} (${d.email || ""})`;
    if (k === "devUpdate") {
      const steps = Array.isArray(d.steps) && d.steps.length > 0 ? d.steps.join(", ") : null;
      return globalLang === "zh"
        ? `${d.factory || "工厂"} 开始 ${steps || "更新"} · "${d.title || "开发"}"`
        : `${d.factory || "Factory"} started ${steps || "update"} · "${d.title || "a development"}"`;
    }
    if (k === "newDevSupplier") return globalLang === "zh"
      ? `新开发任务: "${d.title || ""}"`
      : `New development assigned to you: "${d.title || ""}"`;
    if (k === "supplierConfirmed") return globalLang === "zh"
      ? `供应商已确认接收 "${d.title || ""}"`
      : `${d.factory || "Supplier"} confirmed receipt of "${d.title || ""}"`;
    if (k === "devViewed") return globalLang === "zh"
      ? `${d.viewer || "团队成员"}查看了您的开发: "${d.title || ""}"`
      : `${d.viewer || "Team"} viewed your development: "${d.title || ""}"`;
    if (k === "newMsgCount") return globalLang === "zh"
      ? `${d.count} 条新消息`
      : `${d.count} new message${d.count > 1 ? "s" : ""}`;
    if (k === "visitDeleted") return globalLang === "zh"
      ? `拜访记录已删除: ${d.visitor || ""} → ${d.factory || ""}`
      : `Visit deleted: ${d.visitor || ""} at ${d.factory || ""}`;
    if (k === "devEdited") return globalLang === "zh"
      ? `${d.by || "管理员"} 编辑了开发: "${d.title || ""}"`
      : `${d.by || "Admin"} edited development: "${d.title || ""}"`;
    if (k === "devDeleted") return globalLang === "zh"
      ? `${d.by || "管理员"} 删除了开发: "${d.title || ""}"`
      : `${d.by || "Admin"} deleted development: "${d.title || ""}"`;
    if (k === "userApproved") return globalLang === "zh"
      ? `用户已批准: ${d.name || d.email || ""}`
      : `User approved: ${d.name || d.email || ""}`;
    if (k === "userRejected") return globalLang === "zh"
      ? `用户已拒绝: ${d.name || d.email || ""}`
      : `User rejected: ${d.name || d.email || ""}`;
    if (k === "userAdded") return globalLang === "zh"
      ? `新用户已添加: ${d.name || d.email || ""} (${d.role || ""})`
      : `New user added: ${d.name || d.email || ""} (${d.role || ""})`;
    if (k === "userUnblocked") return globalLang === "zh"
      ? `用户已解封: ${d.name || d.email || ""}`
      : `User unblocked: ${d.name || d.email || ""}`;
    if (k === "userBlocked") return globalLang === "zh"
      ? `用户已被封禁: ${d.name || d.email || ""}`
      : `User blocked: ${d.name || d.email || ""}`;
    if (k === "devCompleted") return globalLang === "zh"
      ? `${d.by || "团队"} 标记开发完成: "${d.title || "开发"}"`
      : `${d.by || "Team"} marked "${d.title || "a development"}" as completed`;
    if (k === "stepDone") return globalLang === "zh"
      ? `${d.factory || "工厂"} 完成了 ${d.step || ""} · "${d.title || ""}"`
      : `${d.factory || "Factory"} completed ${d.step || ""} · "${d.title || ""}"`;
    if (k === "stepDueToday") return globalLang === "zh"
      ? `⏰ 今日到期: ${d.factory || "工厂"} · ${d.step || ""} · "${d.title || ""}"`
      : `⏰ Due today: ${d.factory || "Factory"} · ${d.step || ""} · "${d.title || ""}"` ;
    if (k === "stepOverdue") return globalLang === "zh"
      ? `🔴 逾期 ${d.days || 1} 天: ${d.factory || "工厂"} · ${d.step || ""} · "${d.title || ""}"`
      : `🔴 Overdue by ${d.days || 1}d: ${d.factory || "Factory"} · ${d.step || ""} · "${d.title || ""}"` ;
    if (k === "devReopened") return globalLang === "zh"
      ? `${d.by || "供应商"} 重新开启了 "${d.title || "开发"}"`
      : `${d.by || "Supplier"} reopened "${d.title || "a development"}"`;
    return n.msg || "";
  }
  const [dbError, setDbError]     = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [factories, setFactories] = useState([]);
  const [users, setUsers]         = useState([]);
  const [devs, setDevs]           = useState([]);
  const [visits, setVisits]       = useState([]);
  const [toast, setToast]         = useState(null);
  const [detail, setDetail]       = useState(null);
  const [confirm, setConfirm]     = useState(null);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");

  // 1. Check existing session on mount, listen for auth changes
  useEffect(() => {
    async function checkAndSetSession(session) {
      if (!session) { setSession(null); return; }
      try {
        const { data: status } = await supabase.rpc("get_user_status", { user_email: session.user.email });
        if (status === null || status === "pending" || status === "blocked") {
          await supabase.auth.signOut();
          setSession(null);
          return;
        }
        setSession(session);
      } catch (e) { setSession(null); }
    }
    // Always re-validate the current session on mount (catches stale sessions)
    supabase.auth.getSession().then(({ data: { session } }) => checkAndSetSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAndSetSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. Load data once we have a session
  useEffect(() => {
    if (!session) return;
    if (!initialLoadDone.current) setLoading(true);
    (async () => {
      try {
        const [f, u, d, v] = await Promise.all([db.getFactories(), db.getUsers(), db.getDevs(), db.getVisits()]);
        setFactories(f); setUsers(u); setDevs(d); setVisits(v);
        setLoading(false);
        initialLoadDone.current = true;
      } catch (e) {
        setDbError(e.message || String(e));
        setLoading(false);
      }
    })();
  }, [session]);

  // Deep-link: if URL contains #dev=DEV-xxx, open that dev after data loads
  useEffect(() => {
    if (loading || !devs.length) return;
    const hash = window.location.hash;
    const match = hash.match(/^#dev=(.+)$/);
    if (match) {
      const devId = decodeURIComponent(match[1]);
      const found = devs.find(d => d.id === devId);
      if (found) {
        setPage("developments");
        setDetail({ type: "dev", id: devId });
        window.location.hash = ""; // clean up URL
      }
    }
  }, [loading, devs]);

  // Match the logged-in auth user to the users table by email
  const authEmail   = session?.user?.email;
  const currentUser = users.find((u) => u.email?.toLowerCase() === authEmail?.toLowerCase()) || null;

  // Load notifications from DB when user is identified + register push
  const notifsLoadedRef = useRef(false);
  useEffect(() => {
    if (!currentUser?.id || notifsLoadedRef.current) return;
    notifsLoadedRef.current = true;
    db.getNotifs(currentUser.id).then(rows => setNotifications(rows));
    registerPush(currentUser.id, false).catch(() => {});
  }, [currentUser?.id]);

  // Use a ref so realtime handlers always have latest currentUser
  const currentUserRef = useRef(currentUser);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // 3. Realtime subscriptions — data sync + instant notification delivery
  useEffect(() => {
    if (!session || loading || dbError) return;
    const ch = supabase.channel("realtime-all")
      .on("postgres_changes", { event: "*", schema: "public", table: "factories" }, () => {
        db.getFactories().then(setFactories);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => {
        db.getUsers().then(setUsers);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "developments" }, () => {
        db.getDevs().then(setDevs);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "development_updates" }, () => {
        db.getDevs().then(setDevs);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "development_messages" }, () => {
        db.getDevs().then(setDevs);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "visits" }, () => {
        db.getVisits().then(setVisits);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "visits" }, () => {
        db.getVisits().then(setVisits);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const cu = currentUserRef.current;
        if (!cu) return;
        if (payload.new?.recipient_id === cu.id) {
          setNotifications(prev => [payload.new, ...prev].slice(0, 50));
        }
      })
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });
    return () => supabase.removeChannel(ch);
  }, [session, loading, dbError]);

  // 4. Simple data refresh every 20s + notification poll every 10s as Realtime fallback
  useEffect(() => {
    if (!session || !currentUser) return;
    const dataInterval = setInterval(() => {
      db.getDevs().then(newDevs => {
        setDevs(newDevs);
        if (!currentUserRef.current || currentUserRef.current.role === "viewer") return;
        const today = getChinaToday();
        const todayStr = today.toISOString().slice(0,10);
        const sentKey = "stepNotifSent_" + todayStr;
        const sentIds = (() => { try { return JSON.parse(sessionStorage.getItem(sentKey) || "[]"); } catch { return []; } })();
        const newSentIds = [...sentIds];
        newDevs.forEach(dev => {
          if (dev.status !== "open" && dev.status !== "in_progress") return;
          const latestUpdate = dev.updates?.[0];
          if (!latestUpdate?.production_steps) return;
          Object.entries(latestUpdate.production_steps).forEach(([stepId, s]) => {
            if (!s.est_date || s.completed) return;
            const due = parseLocalDate(s.est_date);
            const daysOverdue = Math.floor((today - due) / 86400000);
            if (daysOverdue < 0) return;
            const notifId = dev.id + "_" + stepId + "_" + s.est_date;
            if (sentIds.includes(notifId)) return;
            newSentIds.push(notifId);
            const step = PRODUCTION_STEPS.find(p => p.id === stepId);
            const stepLabel = step ? step.label : stepId;
            const msgKey = daysOverdue === 0 ? "stepDueToday" : "stepOverdue";
            const msgData = { title: dev.title || "", step: stepLabel, factory: dev.factory_names?.[0] || "", days: daysOverdue };
            supabase.from("users").select("id,role,factory_id,email,full_name").then(({ data: uRows }) => {
              if (!uRows) return;
              const supplierUser = uRows.find(u => u.role === "supplier" && dev.factory_ids?.includes(u.factory_id));
              const recipientIds = [
                ...uRows.filter(u => u.role === "admin").map(u => u.id),
                dev.team_member_id, dev.assigned_user_id, supplierUser?.id,
              ].filter((id, i, arr) => id && arr.indexOf(id) === i);
              // Send in-app notifications
              recipientIds.forEach(rid => {
                supabase.from("notifications").insert({
                  id: "N-" + Date.now() + "-" + Math.random().toString(36).slice(2),
                  recipient_id: rid, msg_key: msgKey, msg_data: msgData,
                  dev_id: dev.id, type: "dev", read: false, created_at: new Date().toISOString(),
                });
              });
              // Send email to team member + assigned user (not supplier, not all admins)
              const emailKey = "emailSent_" + todayStr;
              const emailSentIds = (() => { try { return JSON.parse(sessionStorage.getItem(emailKey) || "[]"); } catch { return []; } })();
              const emailNotifId = dev.id + "_" + stepId + "_email_" + s.est_date;
              if (!emailSentIds.includes(emailNotifId)) {
                // Mark as sent immediately before async to prevent duplicates on re-fire
                try { sessionStorage.setItem(emailKey, JSON.stringify([...emailSentIds, emailNotifId])); } catch {}
                const statusMsg = daysOverdue === 0
                  ? `Step "${stepLabel}" is due today`
                  : `Step "${stepLabel}" is overdue by ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""}`;
                const seenEmails = new Set();
                const emailRecipients = [dev.team_member_id, dev.assigned_user_id]
                  .filter((id, i, arr) => id && arr.indexOf(id) === i);
                emailRecipients.forEach(rid => {
                  const user = uRows.find(u => u.id === rid);
                  if (user?.email && !seenEmails.has(user.email)) {
                    seenEmails.add(user.email);
                    const emailPayload = {
                      to_email: user.email,
                      to_name: user.full_name || "Team",
                      dev_title: dev.title || "",
                      factory_name: dev.factory_names?.[0] || "",
                      step_name: stepLabel,
                      status_message: statusMsg,
                      dev_link: window.location.origin + "/#dev=" + encodeURIComponent(dev.id),
                    };
                    if (dev.picture_url) emailPayload.dev_image = dev.picture_url;
                    sendFollowUpEmail(emailPayload);
                  }
                });
              }
            });
          });
        });
        try { sessionStorage.setItem(sentKey, JSON.stringify(newSentIds)); } catch {}
      });
      db.getVisits().then(setVisits);

      // ── Weekly summary email — Mondays only, once per week ──────────────────
      const cnNow = getChinaNow();
      const isMonday = cnNow.getUTCDay() === 1; // UTC+8 stored as UTC, day-of-week check
      if (isMonday && currentUserRef.current?.role === "admin") {
        const weekKey = "weeklySent_" + getChinaTodayStr();
        const alreadySent = (() => { try { return sessionStorage.getItem(weekKey) === "1"; } catch { return false; } })();
        if (!alreadySent) {
          try { sessionStorage.setItem(weekKey, "1"); } catch {}
          supabase.from("users").select("id,role,email,full_name").then(({ data: uRows }) => {
            if (!uRows) return;
            const admins = uRows.filter(u => u.role === "admin" && u.email);
            // Build summary — active devs with steps due in next 14 days
            const activeDevs = newDevs.filter(d => d.status === "open" || d.status === "in_progress");
            const today = getChinaToday();
            const in14 = new Date(today.getTime() + 14 * 86400000);
            let summaryRows = "";
            activeDevs.forEach(dev => {
              const latestUpdate = dev.updates?.[0];
              if (!latestUpdate?.production_steps) return;
              const upcomingSteps = Object.entries(latestUpdate.production_steps)
                .filter(([, s]) => s.est_date && !s.completed)
                .map(([stepId, s]) => {
                  const due = parseLocalDate(s.est_date);
                  const diff = Math.ceil((due - today) / 86400000);
                  const step = PRODUCTION_STEPS.find(p => p.id === stepId);
                  return { label: step ? step.label : stepId, due, diff, dateStr: s.est_date };
                })
                .filter(s => s.due <= in14)
                .sort((a, b) => a.due - b.due);
              if (upcomingSteps.length === 0) return;
              summaryRows += `<tr style="border-bottom:1px solid #eee"><td style="padding:8px 12px;font-weight:bold;vertical-align:top">${dev.title || ""}</td><td style="padding:8px 12px;color:#666;vertical-align:top">${dev.factory_names?.[0] || "—"}</td><td style="padding:8px 12px;vertical-align:top">${upcomingSteps.map(s => `<div style="margin-bottom:4px"><span style="font-size:12px;padding:2px 6px;border-radius:4px;background:${s.diff < 0 ? "#fee2e2" : s.diff <= 3 ? "#fef3c7" : "#dbeafe"};color:${s.diff < 0 ? "#991b1b" : s.diff <= 3 ? "#92400e" : "#1e40af"}">${s.diff < 0 ? `Overdue ${Math.abs(s.diff)}d` : s.diff === 0 ? "Today" : `${s.diff}d`}</span> ${s.label}</div>`).join("")}</td></tr>`;
            });
            if (!summaryRows) return; // nothing upcoming, skip email
            const cn = getChinaNow();
            const weekLabel = `Week of ${cn.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })}`;
            const summary_html = `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px"><thead><tr style="background:#f8fafc"><th style="padding:8px 12px;text-align:left;color:#475569">Development</th><th style="padding:8px 12px;text-align:left;color:#475569">Factory</th><th style="padding:8px 12px;text-align:left;color:#475569">Upcoming Steps</th></tr></thead><tbody>${summaryRows}</tbody></table>`;
            admins.forEach(admin => {
              sendWeeklySummaryEmail({ to_email: admin.email, to_name: admin.full_name || "Team", summary_html, week_label: weekLabel });
            });
          });
        }
      }
    }, 20000);
    // Poll notifications every 10s — guarantees delivery even if Realtime is not working
    const notifInterval = setInterval(() => {
      const cu = currentUserRef.current;
      if (!cu) return;
      db.getNotifs(cu.id).then(rows => {
        if (rows.length > 0) setNotifications(rows);
      });
    }, 10000);
    return () => { clearInterval(dataInterval); clearInterval(notifInterval); };
  }, [session, currentUser?.id]);

  // Re-validate every 20s — force reload if blocked/deleted so there's no stale state
  useEffect(() => {
    if (!session) return;
    const email = session?.user?.email;
    if (!email) return;
    const interval = setInterval(async () => {
      try {
        const { data: status } = await supabase.rpc("get_user_status", { user_email: email });
        if (status === null || status === "pending" || status === "blocked") {
          await supabase.auth.signOut();
          window.location.reload(); // force full reload — no stale state possible
        }
      } catch (e) {}
    }, 20000);
    return () => clearInterval(interval);
  }, [session?.user?.email]); // depend on email string, not session object

  async function saveProfile(updates) {
    if (!currentUser?.id) return;
    const { error } = await supabase.from("users").update(updates).eq("id", currentUser.id);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
      showToast("Profile updated", "ok");
      setShowProfileEdit(false);
    } else {
      showToast("Failed to save", "error");
    }
  }

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
  const getDisplayName = (user) => user?.chinese_name || user?.full_name || "";

  const needsFollowUp = devs.filter((d) => {
    if (d.status !== "open" && d.status !== "in_progress") return false;
    // Original rule: no updates after 3 days
    if (!d.updates?.length && daysAgo(d.created_date) >= 3) return true;
    // New rule: any step with an overdue est_date and no update submitted AFTER the due date
    const latestUpdate = d.updates?.[0];
    const steps = latestUpdate?.production_steps || {};
    return Object.values(steps).some(s => {
      if (!s.est_date || s.completed) return false;
      const due = parseLocalDate(s.est_date);
      const today = getChinaToday();
      if (due > today) return false; // not yet due
      // Check if any update was submitted strictly after the due date (next day or later)
      const nextDayAfterDue = new Date(due.getTime() + 24 * 60 * 60 * 1000);
      const hasNewerUpdate = d.updates?.some(u => u.created_date && new Date(u.created_date) >= nextDayAfterDue);
      return !hasNewerUpdate;
    });
  });

  // Developments with target date within 7 days (or already overdue)
  const dueSoon = devs.filter((d) => {
    if (!d.internal_estimated_date) return false;
    if (d.status === "completed" || d.status === "cancelled") return false;
    const daysLeft = Math.ceil((new Date(d.internal_estimated_date) - getChinaNow()) / 86400000);
    return daysLeft <= 7;
  }).sort((a, b) => new Date(a.internal_estimated_date) - new Date(b.internal_estimated_date));

  async function notifyFactory(dev, factoryId) {
    // Push in-app notifications to supplier + all admins
    const supplierUser = users.find(u => u.role === "supplier" && u.factory_id === factoryId);
    const adminIds = users.filter(u => u.role === "admin").map(u => u.id);
    if (supplierUser) {
      await pushNotif(supplierUser.id, "newDevSupplier", { title: dev.title || "" }, dev.id, "dev");
    }
    // Notify admins (if the creator isn't already admin — avoid self-notifying)
    const nonCreatorAdmins = adminIds.filter(id => id !== currentUser?.id);
    await pushNotifToMany(nonCreatorAdmins, "newDev", { title: dev.title || "", team: dev.team_member_name || "" }, dev.id, "dev");
    // Also send WeChat if backend configured
    if (BACKEND_URL) {
      const factory = getFactory(factoryId);
      const teamMember = getUser(dev.team_member_id);
      const res = await sendNotification("/notify/new-development", { dev, factory, teamMember });
      if (!res.ok) showToast(`⚠ WeChat: ${res.error}`, "error");
    }
  }

  async function sendReminder(dev) {
    if (!BACKEND_URL) { showToast("⚠ Backend not configured", "error"); return; }
    const factory = getFactory(dev.factory_ids?.[0]);
    const teamMember = getUser(dev.team_member_id);
    showToast("Sending reminder…", "sending");
    const res = await sendNotification("/notify/reminder", { dev, factory, teamMember });
    showToast(res.ok ? `✅ Reminder sent` : `⚠ ${res.error}`, res.ok ? "ok" : "error");
  }

  const role = currentUser?.role || "user";
  const isAdmin = role === "admin";
  const isSupplier = role === "supplier";
  const isViewer = role === "viewer";

  const navItems = [
    { id: "dashboard",    icon: Icon.grid,      label: t("dashboard") },
    !isSupplier && { id: "visits", icon: Icon.clipboard, label: t("visits") },
    { id: "developments", icon: Icon.flask,     label: t("dev") },
    !isSupplier && { id: "factories", icon: Icon.building, label: t("factories") },
    isAdmin && { id: "users", icon: Icon.users, label: t("users") },
  ].filter(Boolean);

  function goPage(id) { setDetail(null); setPage(id); }

  // Not yet checked session
  if (session === undefined) return <LoadingScreen message="Checking session…" />;
  // Not logged in — show login screen
  if (!session) return <LoginScreen onLogin={setSession} />;
  // Logged in but data still loading
  if (loading) return <LoadingScreen message={t("loading")} />;
  if (dbError) return <ErrorScreen error={dbError} />;

  // Viewer role — fullscreen slideshow only
  if (isViewer) return <SlideshowViewer visits={visits} devs={devs} onSignOut={async () => { await supabase.auth.signOut(); setSession(null); }} />;

  let content = null;
  if (detail?.type === "dev") {
    const dev = devs.find((d) => d.id === detail.id);
    if (dev) content = (
      <DevDetailPage dark={dark} devId={detail.id} devs={devs} setDevs={setDevs} factories={factories}
        getFactory={getFactory} getUser={getUser} onBack={() => setDetail(null)}
        currentUser={currentUser} onReminder={() => sendReminder(dev)} showToast={showToast} askConfirm={askConfirm} users={users} pushNotif={pushNotif} pushNotifToMany={pushNotifToMany} />
    );
  } else if (detail?.type === "visit") {
    const visit = visits.find((v) => v.id === detail.id);
    if (visit) content = (
      <VisitDetailPage visitId={detail.id} visits={visits} setVisits={setVisits} factories={factories}
        onBack={() => setDetail(null)} currentUser={currentUser} showToast={showToast} askConfirm={askConfirm} users={users} pushNotifToMany={pushNotifToMany} />
    );
  } else if (page === "dashboard") {
    const dashVisits = isAdmin ? visits : visits.filter(v => v.visitor_name === currentUser?.full_name);
    const dashDevs   = isAdmin ? devs   : isSupplier
      ? devs.filter(d => d.factory_ids?.includes(currentUser?.factory_id))
      : devs.filter(d => d.team_member_id === currentUser?.id);
    const dashFollowUp = needsFollowUp.filter(d => dashDevs.find(x => x.id === d.id));
    const dashDueSoon  = dueSoon.filter(d => dashDevs.find(x => x.id === d.id));
    content = (
      <DashboardPage dark={dark} visits={dashVisits} devs={dashDevs} factories={factories} setPage={goPage}
        needsFollowUp={dashFollowUp} dueSoon={dashDueSoon} onViewDev={(id) => setDetail({ type: "dev", id })}
        onViewVisit={(id) => setDetail({ type: "visit", id })} currentUser={currentUser} />
    );
  } else if (page === "visits") {
    const filteredVisits = isAdmin ? visits : visits.filter(v => v.visitor_name === currentUser?.full_name);
    content = (
      <VisitsPage dark={dark} visits={filteredVisits} setVisits={setVisits} factories={factories} currentUser={currentUser}
        onView={(id) => setDetail({ type: "visit", id })} showToast={showToast} askConfirm={askConfirm} users={users} pushNotifToMany={pushNotifToMany} />
    );
  } else if (page === "developments") {
    const filteredDevs = isAdmin ? devs : isSupplier
      ? devs.filter(d => d.factory_ids?.includes(currentUser?.factory_id))
      : devs.filter(d => d.team_member_id === currentUser?.id);
    content = (
      <DevelopmentsPage dark={dark} devs={filteredDevs} setDevs={setDevs} factories={factories} users={users}
        currentUser={currentUser} onView={(id) => setDetail({ type: "dev", id })}
        showToast={showToast} onNotify={notifyFactory} askConfirm={askConfirm} pushNotif={pushNotif} pushNotifToMany={pushNotifToMany} />
    );
  } else if (page === "factories") {
    content = (
      <FactoriesPage dark={dark} factories={factories} setFactories={setFactories} currentUser={currentUser}
        devs={devs} visits={visits} showToast={showToast} askConfirm={askConfirm} users={users} pushNotifToMany={pushNotifToMany} />
    );
  } else if (page === "users") {
    content = (
      <UsersPage dark={dark} users={users} setUsers={setUsers} factories={factories} currentUser={currentUser}
        showToast={showToast} askConfirm={askConfirm} pushNotif={pushNotif} />
    );
  }

  return (
    <div data-dark={dark ? "1" : "0"} className={`min-h-screen ${dark ? "bg-slate-950 text-slate-100" : "bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/20"}`}
      onClick={() => { setShowProfile(false); setShowNotifs(false); }}>
      <style>{`
        [data-dark="1"] .bg-white { background-color: #1e293b !important; }
        [data-dark="1"] .bg-slate-50 { background-color: #1e293b !important; }
        [data-dark="1"] .bg-slate-100 { background-color: #1e293b !important; }
        [data-dark="1"] .bg-slate-200 { background-color: #334155 !important; }
        [data-dark="1"] .text-slate-800 { color: #f1f5f9 !important; }
        [data-dark="1"] .text-slate-700 { color: #e2e8f0 !important; }
        [data-dark="1"] .text-slate-600 { color: #cbd5e1 !important; }
        [data-dark="1"] .text-slate-500 { color: #94a3b8 !important; }
        [data-dark="1"] .border-slate-100 { border-color: #334155 !important; }
        [data-dark="1"] .border-slate-200 { border-color: #334155 !important; }
        [data-dark="1"] .shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important; }
        [data-dark="1"] .hover\:bg-slate-50:hover { background-color: #334155 !important; }
        [data-dark="1"] .hover\:bg-slate-100:hover { background-color: #334155 !important; }
        [data-dark="1"] input, [data-dark="1"] textarea, [data-dark="1"] select {
          background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important;
        }
        [data-dark="1"] .bg-gradient-to-br { background-image: none !important; background-color: #0f172a !important; }
      `}</style>
      {toast && <Toast message={toast.message} type={toast.type} />}
      {confirm && (
        <ConfirmDialog message={confirm.message}
          onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
          onCancel={() => setConfirm(null)} />
      )}
      {/* ── Profile Edit Modal ── */}
      {showProfileEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowProfileEdit(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 bg-slate-900 flex items-center justify-between">
              <h2 className="text-white font-semibold">{globalLang === "zh" ? "编辑个人资料" : "Edit Profile"}</h2>
              <button onClick={() => setShowProfileEdit(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Profile picture */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center flex-shrink-0">
                  {profileForm.profile_picture
                    ? <img src={profileForm.profile_picture} alt="" className="w-full h-full object-cover" />
                    : <span className="text-amber-400 text-2xl font-bold">{currentUser?.full_name?.charAt(0) || "?"}</span>
                  }
                </div>
                <div>
                  <label className="cursor-pointer px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors">
                    {globalLang === "zh" ? "上传照片" : "Upload Photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => setProfileForm(f => ({ ...f, profile_picture: ev.target.result }));
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                  {profileForm.profile_picture && (
                    <button onClick={() => setProfileForm(f => ({ ...f, profile_picture: "" }))}
                      className="ml-2 text-xs text-red-500 hover:text-red-700">{globalLang === "zh" ? "移除" : "Remove"}</button>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{globalLang === "zh" ? "JPG、PNG，最大2MB" : "JPG, PNG, max 2MB"}</p>
                </div>
              </div>
              {/* Full name */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{globalLang === "zh" ? "姓名" : "Full Name"}</label>
                <input type="text" value={profileForm.full_name} onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
              </div>
              {/* Chinese name */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{globalLang === "zh" ? "中文名" : "Chinese Name"}</label>
                <input type="text" value={profileForm.chinese_name} onChange={e => setProfileForm(f => ({ ...f, chinese_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
              </div>
              {/* WeChat ID */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{globalLang === "zh" ? "微信号" : "WeChat ID"}</label>
                <input type="text" value={profileForm.wechat_id} onChange={e => setProfileForm(f => ({ ...f, wechat_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
              </div>
              {/* Birthday */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{globalLang === "zh" ? "生日" : "Birthday"}</label>
                <input type="date" value={profileForm.birthday} onChange={e => setProfileForm(f => ({ ...f, birthday: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
              </div>
              {/* Email (read-only) */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{globalLang === "zh" ? "邮箱（不可修改）" : "Email (read-only)"}</label>
                <input type="text" value={authEmail} disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowProfileEdit(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">{t("cancel")}</button>
              <button onClick={() => saveProfile(profileForm)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors">{t("save")}</button>
            </div>
          </div>
        </div>
      )}

      {showGlobalSearch && (
        <GlobalSearchOverlay
          query={globalQuery} setQuery={setGlobalQuery}
          visits={visits} devs={devs} factories={factories}
          onClose={() => setShowGlobalSearch(false)}
          onViewDev={(id) => { setShowGlobalSearch(false); setDetail({ type: "dev", id }); }}
          onViewVisit={(id) => { setShowGlobalSearch(false); setDetail({ type: "visit", id }); }}
          onViewFactory={() => { setShowGlobalSearch(false); goPage("factories"); }}
          currentUser={currentUser}
        />
      )}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900">
        {/* ── Row 1: Logo + Lang + Bell + User ── */}
        <div className="flex items-center h-12 px-3 sm:px-4 gap-2 max-w-6xl mx-auto">
          <button onClick={() => goPage("dashboard")} className="flex items-center gap-2 flex-shrink-0">
            <LokaLogo size={28} />
            <span className="hidden md:block text-white font-semibold text-sm">{t("factoryTrackerTitle")}</span>
          </button>
          <div className="flex-1" />
          <div className="flex-shrink-0 flex items-center gap-1.5">
            {/* Search */}
            <button onClick={() => { setShowGlobalSearch(true); setGlobalQuery(""); }}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>
            </button>
            {/* Notifications bell */}
            <div className="relative">
              <button onClick={e => { e.stopPropagation(); setShowNotifs(s => !s); setShowProfile(false); }}
                className="relative w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-800 text-sm">{t("notifications")}</span>
                    {notifications.length > 0 && (
                      <button onClick={() => { db.markAllNotifsRead(currentUser?.id); setNotifications([]); setShowNotifs(false); }}
                        className="text-xs text-slate-400 hover:text-red-500">{t("clearAll")}</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0
                      ? <p className="text-center text-slate-400 text-sm py-6">{t("noNotifications")}</p>
                      : notifications.map(n => (
                          <button key={n.id} onClick={() => {
                            db.markNotifRead(n.id);
                            setNotifications(prev => prev.filter(x => x.id !== n.id));
                            setShowNotifs(false);
                            const devId = n.dev_id || n.devId;
                            const type = n.type;
                            if ((type === "chat" || type === "dev") && devId) { setDetail({ type: "dev", id: devId }); }
                            else if (type === "visit") goPage("visits");
                            else if (type === "factory") goPage("factories");
                            else if (type === "pending") goPage("users");
                          }} className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                            <div className="flex items-start gap-2">
                              <span className="text-lg flex-shrink-0">
                                {n.type === "chat" ? "💬" : n.type === "visit" ? "🏭" : n.type === "factory" ? "🏢" : n.type === "pending" ? "👤" : "🔔"}
                              </span>
                              <div>
                                <p className="text-sm text-slate-700 leading-snug">{renderNotifMsg(n)}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{new Date(n.created_at || n.time).toLocaleTimeString()}</p>
                              </div>
                            </div>
                          </button>
                        ))
                    }
                  </div>
                </div>
              )}
            </div>
            {/* Profile avatar + dropdown */}
            <div className="relative">
              <button onClick={e => { e.stopPropagation(); setShowProfile(s => !s); setShowNotifs(false); setShowProfileEdit(false); }}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  {currentUser?.profile_picture
                    ? <img src={currentUser.profile_picture} alt="" className="w-full h-full object-cover" />
                    : <span className="text-amber-400 text-xs font-bold">{currentUser?.full_name?.charAt(0) || authEmail?.charAt(0)?.toUpperCase() || "?"}</span>
                  }
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-white text-xs font-medium leading-tight">{currentUser?.full_name || authEmail}</span>
                  <span className="text-amber-400 text-xs leading-tight capitalize">{currentUser?.role}</span>
                </div>
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-slate-400 hidden sm:block"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
              {showProfile && (
                <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="px-4 py-4 bg-slate-900 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center">
                      {currentUser?.profile_picture
                        ? <img src={currentUser.profile_picture} alt="" className="w-full h-full object-cover" />
                        : <span className="text-amber-400 text-lg font-bold">{currentUser?.full_name?.charAt(0) || "?"}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{currentUser?.full_name || authEmail}</p>
                      {currentUser?.chinese_name && <p className="text-slate-400 text-xs truncate">{currentUser.chinese_name}</p>}
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full capitalize">{currentUser?.role}</span>
                    </div>
                  </div>
                  {/* Menu items */}
                  <div className="py-1">
                    {/* Edit Profile */}
                    <button onClick={() => { setShowProfileEdit(true); setProfileForm({ full_name: currentUser?.full_name || "", chinese_name: currentUser?.chinese_name || "", wechat_id: currentUser?.wechat_id || "", birthday: currentUser?.birthday || "", profile_picture: currentUser?.profile_picture || "" }); setShowProfile(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={2}><path strokeLinecap="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </span>
                      <span className="text-sm text-slate-700 font-medium">{globalLang === "zh" ? "编辑个人资料" : "Edit Profile"}</span>
                    </button>
                    {/* Language */}
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={2}><path strokeLinecap="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                      </span>
                      <span className="text-sm text-slate-700 font-medium flex-1">{globalLang === "zh" ? "语言" : "Language"}</span>
                      <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
                        {["en","zh"].map(l => (
                          <button key={l} onClick={() => changeLang(l)}
                            className={`px-2.5 py-1 text-xs font-bold transition-colors ${lang === l ? "bg-amber-500 text-white" : "text-slate-500 hover:text-slate-700"}`}>
                            {l === "en" ? "EN" : "中文"}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Appearance */}
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        {dark
                          ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={2}><circle cx="12" cy="12" r="5"/><path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                          : <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={2}><path strokeLinecap="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        }
                      </span>
                      <span className="text-sm text-slate-700 font-medium flex-1">{globalLang === "zh" ? "外观" : "Appearance"}</span>
                      <button onClick={toggleDark}
                        className={`relative w-10 h-5 rounded-full transition-colors ${dark ? "bg-amber-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                    {/* Push notifications */}
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <span className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                      </span>
                      <span className="text-sm text-slate-700 font-medium flex-1">{globalLang === "zh" ? "推送通知" : "Push Notifications"}</span>
                      <button onClick={e => {
                          e.stopPropagation();
                          if (!currentUser) return;
                          if (pushSubscribed) unregisterPush(currentUser.id);
                          else registerPush(currentUser.id);
                        }}
                        className={`relative w-10 h-5 rounded-full transition-colors ${pushSubscribed ? "bg-amber-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${pushSubscribed ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                    <div className="border-t border-slate-100 my-1" />
                    {/* Sign out */}
                    <button onClick={() => { setShowProfile(false); signOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left">
                      <span className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}><path strokeLinecap="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      </span>
                      <span className="text-sm text-red-600 font-medium">{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ── Row 2: Nav tabs ── */}
        <div>
          <nav className="flex items-center justify-center gap-2 px-2 max-w-6xl mx-auto overflow-x-auto">
            {navItems.map((item) => {
              const active = !detail && page === item.id;
              return (
                <button key={item.id} onClick={() => goPage(item.id)}
                  className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 transition-all font-medium whitespace-nowrap flex-shrink-0 ${
                    active ? "border-b-2 border-amber-500 text-amber-400" : "text-slate-400 hover:text-white"
                  }`}>
                  {item.icon}
                  <span className="text-[9px] sm:text-xs leading-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="pt-[84px]">{content}</main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
function StepCalendar({ devs, onViewDev }) {
  const today = getChinaToday();
  const [viewYear,  setViewYear]  = useState(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());
  const [selected,  setSelected]  = useState(null); // "YYYY-MM-DD"

  // Build map: dateStr -> [{dev, stepLabel, completed}]
  const stepsByDate = {};
  devs.forEach(dev => {
    if (dev.status === "completed" || dev.status === "cancelled") return;
    const lu = dev.updates?.[0];
    if (!lu?.production_steps) return;
    Object.entries(lu.production_steps).forEach(([stepId, s]) => {
      if (!s.est_date) return;
      if (!stepsByDate[s.est_date]) stepsByDate[s.est_date] = [];
      const step = PRODUCTION_STEPS.find(p => p.id === stepId);
      stepsByDate[s.est_date].push({ dev, stepLabel: getStepLabel(step ? step.id : stepId), completed: !!s.completed });
    });
  });

  const firstDay = new Date(Date.UTC(viewYear, viewMonth, 1));
  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
  const startDow = firstDay.getUTCDay(); // 0=Sun
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = firstDay.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const todayStr  = getChinaTodayStr();

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelected(null);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelected(null);
  }

  const selectedItems = selected ? (stepsByDate[selected] || []) : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span className="font-semibold text-slate-700 text-sm">{monthName}</span>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
        ))}
        {/* Cells */}
        {cells.map((day, i) => {
          if (!day) return <div key={"e"+i} />;
          const mm = String(viewMonth + 1).padStart(2, "0");
          const dd = String(day).padStart(2, "0");
          const dateStr = `${viewYear}-${mm}-${dd}`;
          const items = stepsByDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selected;
          const overdue = items.some(it => !it.completed && parseLocalDate(dateStr) < getChinaToday());
          const hasIncomplete = items.some(it => !it.completed);
          return (
            <div key={dateStr} onClick={() => items.length > 0 ? setSelected(isSelected ? null : dateStr) : null}
              className={`relative rounded-xl p-1 min-h-[44px] flex flex-col items-center transition-all
                ${items.length > 0 ? "cursor-pointer hover:bg-slate-50" : ""}
                ${isSelected ? "ring-2 ring-purple-400 bg-purple-50" : ""}
                ${isToday ? "bg-amber-50" : ""}`}>
              <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                ${isToday ? "bg-amber-500 text-white" : "text-slate-600"}`}>{day}</span>
              {items.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center mt-0.5">
                  {items.slice(0, 3).map((it, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${it.completed ? "bg-emerald-400" : overdue ? "bg-red-400" : "bg-purple-400"}`} />
                  ))}
                  {items.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex gap-4 text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block"/>Upcoming</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Overdue</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/>Completed</span>
      </div>
      {/* Selected day detail */}
      {selected && selectedItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <span className="text-sm font-semibold text-slate-700">{fmtDate(selected)} — {selectedItems.length} step{selectedItems.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {selectedItems.map((it, idx) => {
              const isOver = !it.completed && parseLocalDate(selected) < getChinaToday();
              return (
                <div key={idx} onClick={() => onViewDev(it.dev.id)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${it.completed ? "bg-emerald-400" : isOver ? "bg-red-400" : "bg-purple-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{it.dev.title}</p>
                    <p className="text-xs text-slate-500">{it.stepLabel} · {it.dev.factory_names?.[0] || "—"}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0
                    ${it.completed ? "bg-emerald-100 text-emerald-700" : isOver ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"}`}>
                    {it.completed ? t("done") : isOver ? t("overdue") : t("upcoming")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardPage({ dark, visits, devs, factories, setPage, needsFollowUp, dueSoon, onViewDev, onViewVisit, currentUser }) {
  const isAdmin = currentUser?.role === "admin";
  const isSupplier = currentUser?.role === "supplier";
  const [bannerTab, setBannerTab] = useState("visits");
  const timerRef = useRef(null);

  useEffect(() => {
    if (isSupplier) return;
    timerRef.current = setInterval(() => {
      setBannerTab(t => t === "visits" ? "devs" : "visits");
    }, 30000);
    return () => clearInterval(timerRef.current);
  }, [isSupplier]);

  const recentVisits = [...visits].sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date)).slice(0, 10);
  const recentDevs   = [...devs].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 10);
  const openCount    = devs.filter((d) => d.status === "open" || d.status === "in_progress").length;

  const stats = [
    !isSupplier && { label: t("totalVisits"),    value: visits.length,        color: "blue",    onClick: () => setPage("visits") },
    { label: t("activeDevs"),     value: openCount,            color: "amber",   onClick: () => setPage("developments") },
    isAdmin && { label: t("factories"),       value: factories.length,     color: "emerald", onClick: () => setPage("factories") },
    { label: t("needsFollowUp"), value: needsFollowUp.length, color: needsFollowUp.length > 0 ? "red" : "slate", onClick: () => setPage("developments") },
  ].filter(Boolean);

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}>
      <div className="bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map(({ label, value, color, onClick }) => (
              <div key={label} onClick={onClick}
                className={`bg-white/10 rounded-xl p-3 border border-white/10 transition-all ${onClick ? "cursor-pointer hover:bg-white/20 hover:scale-105" : ""}`}>
                <p className={`text-xl sm:text-3xl font-bold text-${color}-400`}>{value}</p>
                <p className="text-slate-300 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {needsFollowUp.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-orange-500 flex-shrink-0">{Icon.alert}</span>
            <p className="text-sm text-orange-800 font-medium">{needsFollowUp.length} {needsFollowUp.length > 1 ? t("developments") : t("development")} {t("open3Days")}</p>
            <button onClick={() => setPage("developments")} className="ml-auto text-xs font-semibold text-orange-600 hover:underline whitespace-nowrap">{t("viewAll")} →</button>
          </div>
        )}
        {dueSoon?.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 flex-shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-sm font-semibold text-red-800">{dueSoon.length} development{dueSoon.length > 1 ? "s" : ""} due within 7 days</span>
            </div>
            {dueSoon.map((d) => {
              const daysLeft = Math.ceil((new Date(d.internal_estimated_date) - getChinaNow()) / 86400000);
              const overdue  = daysLeft < 0;
              return (
                <div key={d.id} onClick={() => onViewDev(d.id)}
                  className="flex items-center justify-between bg-white rounded-xl px-3 py-2 cursor-pointer hover:bg-red-50 transition-colors border border-red-100">
                  <span className="text-sm font-medium text-slate-700 truncate">{d.title}</span>
                  <span className={`ml-3 text-xs font-semibold whitespace-nowrap px-2 py-0.5 rounded-full ${overdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {overdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {!isSupplier ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1 bg-slate-200 rounded-lg p-1">
                <button onClick={() => { setBannerTab("visits"); clearInterval(timerRef.current); }}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${bannerTab === "visits" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  {t("recentVisits")}
                </button>
                <button onClick={() => { setBannerTab("devs"); clearInterval(timerRef.current); }}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${bannerTab === "devs" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  {t("recentDevs")}
                </button>
                <button onClick={() => { setBannerTab("calendar"); clearInterval(timerRef.current); }}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${bannerTab === "calendar" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  📅 Calendar
                </button>
              </div>
              <button onClick={() => setPage(bannerTab === "visits" ? "visits" : "developments")}
                className="text-sm text-amber-600 font-medium hover:underline">{t("viewAll")}</button>
            </div>
            {bannerTab === "visits" && (
              <div className="space-y-3">
                {recentVisits.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">{t("noVisits")}</p>
                  : recentVisits.map((v) => (
                    <Card key={v.id} className="shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 p-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                          {v.picture_url ? <img src={v.picture_url} alt="" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-1 text-slate-300">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline strokeLinecap="round" strokeLinejoin="round" points="21 15 16 10 5 21"/></svg>
                  <span className="text-xs">No photo</span>
                </div>}
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
                          {Icon.eye} {t("view")}
                        </button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
            {bannerTab === "devs" && (
              <div className="space-y-3">
                {recentDevs.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">{t("noDevs")}</p>
                  : recentDevs.map((d) => {
                    const _lu = d.updates?.[0]; const _tod = getChinaToday();
                    const nf = ((d.status === "open" || d.status === "in_progress") && (!d.updates || d.updates.length === 0) && daysAgo(d.created_date) >= 3) ||
                      ((d.status === "open" || d.status === "in_progress") && Object.values(_lu?.production_steps || {}).some(s => { if (!s.est_date) return false; const due = parseLocalDate(s.est_date); if (due > _tod) return false; const _nd = new Date(due.getTime() + 86400000); return !s.completed && !d.updates?.some(u => u.created_date && new Date(u.created_date) >= _nd); }));
                    return (
                      <Card key={d.id} className={`shadow-sm hover:shadow-md transition-all ${nf ? "border-l-4 border-l-orange-400" : ""}`}>
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                            {d.picture_url ? <img src={d.picture_url} alt="" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-1 text-slate-300">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline strokeLinecap="round" strokeLinejoin="round" points="21 15 16 10 5 21"/></svg>
                  <span className="text-xs">No photo</span>
                </div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={DEV_STATUS_CSS[d.status]}>{DEV_STATUS_LABEL()[d.status]}</Badge>
                              {nf && <Badge className="bg-orange-100 text-orange-700">⏰ Follow-up</Badge>}
                              <span className="text-sm font-semibold text-slate-800 truncate">{d.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{d.factory_names?.join(", ") || "No factory"} · {d.team_member_name}</p>
                          </div>
                          <button onClick={() => onViewDev(d.id)}
                            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                            {Icon.eye} {t("view")}
                          </button>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            )}
            {bannerTab === "calendar" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <StepCalendar devs={devs} onViewDev={onViewDev} />
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800">{t("recentDevs")}</h2>
              <button onClick={() => setPage("developments")} className="text-sm text-amber-600 font-medium hover:underline">{t("viewAll")}</button>
            </div>
            <div className="space-y-3">
              {recentDevs.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">{t("noDevs")}</p>
                : recentDevs.map((d) => {
                  const _lu2 = d.updates?.[0]; const _tod2 = getChinaToday();
                  const nf = ((d.status === "open" || d.status === "in_progress") && (!d.updates || d.updates.length === 0) && daysAgo(d.created_date) >= 3) ||
                    ((d.status === "open" || d.status === "in_progress") && Object.values(_lu2?.production_steps || {}).some(s => { if (!s.est_date) return false; const due = parseLocalDate(s.est_date); if (due > _tod2) return false; const _nd2 = new Date(due.getTime() + 86400000); return !s.completed && !d.updates?.some(u => u.created_date && new Date(u.created_date) >= _nd2); }));
                  return (
                    <Card key={d.id} className={`shadow-sm hover:shadow-md transition-all ${nf ? "border-l-4 border-l-orange-400" : ""}`}>
                      <div className="flex items-center gap-3 p-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                          {d.picture_url ? <img src={d.picture_url} alt="" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-1 text-slate-300">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline strokeLinecap="round" strokeLinejoin="round" points="21 15 16 10 5 21"/></svg>
                  <span className="text-xs">No photo</span>
                </div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={DEV_STATUS_CSS[d.status]}>{DEV_STATUS_LABEL()[d.status]}</Badge>
                            {nf && <Badge className="bg-orange-100 text-orange-700">⏰ Follow-up</Badge>}
                            <span className="text-sm font-semibold text-slate-800 truncate">{d.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{d.factory_names?.join(", ") || "No factory"} · {d.team_member_name}</p>
                        </div>
                        <button onClick={() => onViewDev(d.id)}
                          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                          {Icon.eye} {t("view")}
                        </button>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Visits
// ─────────────────────────────────────────────────────────────────────────────
function VisitsPage({ dark, visits, setVisits, factories, currentUser, onView, showToast, askConfirm, users = [], pushNotifToMany }) {
  const [showForm, setShowForm]       = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [search, setSearch]           = useState("");
  const [filterFactory, setFilterFactory] = useState("all");
  const [filterVisitor, setFilterVisitor] = useState("all");
  const [timeFilter, setTimeFilter]   = useState("all");
  const [customMonth, setCustomMonth] = useState("");
  const [customYear, setCustomYear]   = useState("");
  const isAdmin = currentUser?.role === "admin";

  // Apply factory filter first for stats
  const factoryFiltered = visits.filter((v) => filterFactory === "all" || v.factory_id === filterFactory);

  // Time filter helper
  function matchesTime(v) {
    if (timeFilter === "all") return true;
    const d = new Date(v.visit_date);
    const now = getChinaNow();
    if (timeFilter === "today") {
      return d.toDateString() === now.toDateString();
    }
    if (timeFilter === "week") {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (timeFilter === "month" && customMonth) {
      const [y, m] = customMonth.split("-");
      return d.getFullYear() === parseInt(y) && d.getMonth() + 1 === parseInt(m);
    }
    if (timeFilter === "year" && customYear) {
      return d.getFullYear() === parseInt(customYear);
    }
    return true;
  }

  const filtered = factoryFiltered
    .filter(matchesTime)
    .filter((v) => filterVisitor === "all" || v.visitor_name === filterVisitor)
    .filter((v) => !search || [v.order_number, v.item, v.factory_name, v.purpose, v.visitor_name]
      .some((x) => x?.toLowerCase().includes(search.toLowerCase())));

  // Stats based on factory filter
  const statsTotal = factoryFiltered.length;
  const statsToday = factoryFiltered.filter(v => new Date(v.visit_date).toDateString() === getChinaNow().toDateString()).length;
  const statsWeek  = factoryFiltered.filter(v => daysAgo(v.visit_date) <= 7).length;
  const statsFactories = [...new Set(factoryFiltered.map(v => v.factory_id))].length;

  const visitors = [...new Set(visits.map((v) => v.visitor_name).filter(Boolean))];
  const years = [...new Set(visits.map(v => new Date(v.visit_date).getFullYear()))].sort((a,b) => b-a);

  async function save(data) {
    const isNew = !data.id;
    const record = isNew ? { ...data, id: genId("V") } : data;
    const saved = await db.upsertVisit(record);
    if (saved) {
      setVisits((p) => isNew ? [saved, ...p] : p.map((v) => v.id === saved.id ? saved : v));
      showToast(isNew ? "Visit logged" : "Visit updated");
      if (isNew && pushNotifToMany) {
        const recipientIds = users
          .filter(u => u.role === "admin" && u.id !== currentUser?.id)
          .map(u => u.id);
        await pushNotifToMany(recipientIds, "newVisit", {
          visitor: currentUser?.full_name || saved.visitor_name || "Someone",
          factory: saved.factory_name || "",
        }, null, "visit");
      }
    }
    setShowForm(false); setEditingVisit(null);
  }

  async function del(id) {
    const target = visits.find(v => v.id === id);
    askConfirm("Delete this visit? This cannot be undone.", async () => {
      await db.deleteVisit(id);
      setVisits((p) => p.filter((v) => v.id !== id));
      showToast("Visit deleted");
      if (pushNotifToMany) {
        const recipientIds = users.filter(u => u.role === "admin" && u.id !== currentUser?.id).map(u => u.id);
        if (recipientIds.length) await pushNotifToMany(recipientIds, "visitDeleted", {
          visitor: target?.visitor_name || "", factory: target?.factory_name || "",
        }, null, "visit");
      }
    });
  }

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gradient-to-br from-slate-50 to-blue-50/20"}`}>
      <div className="bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">{t("visits")}</h1>
              <p className="text-slate-400 mt-0.5 text-xs">Track and log all factory visits</p>
            </div>
            <Btn variant="amber" size="lg" onClick={() => { setEditingVisit(null); setShowForm(true); }}>
              {Icon.plus} {t("newVisit")}
            </Btn>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { label: t("total"), value: statsTotal, filters: ["all"] },
              { label: t("today"), value: statsToday, filters: ["today", "week", "month", "year"], isTimeBox: true },
              { label: t("factories"), value: statsFactories, filters: null },
            ].map(({ label, value, filters, isTimeBox }) => {
              const isActive = isTimeBox
                ? (timeFilter !== "all")
                : (filters && filters.includes(timeFilter));
              return (
                <div key={label}
                  onClick={() => {
                    if (isTimeBox) {
                      // cycle through time filters
                      const cycle = ["all","today","week","month","year"];
                      const idx = cycle.indexOf(timeFilter);
                      setTimeFilter(cycle[(idx + 1) % cycle.length]);
                    } else if (filters) {
                      setTimeFilter(filters[0]);
                    }
                  }}
                  className={`rounded-xl p-4 border transition-all ${filters !== null || isTimeBox ? "cursor-pointer hover:bg-white/20 hover:scale-105" : ""} ${isActive ? "bg-amber-500/30 border-amber-400" : "bg-white/10 border-white/10"}`}>
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-slate-300 text-xs mt-0.5">{label}{isTimeBox && timeFilter !== "all" ? ` · ${timeFilter}` : ""}</p>
                </div>
              );
            })}
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
            <div className="flex flex-col gap-2 mb-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{Icon.search}</span>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} className="pl-11 w-full" />
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
                <Select value={filterFactory} onChange={setFilterFactory} className="w-full sm:w-44">
                  <option value="all">{t("allFactories")}</option>
                  {factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Select>
                {isAdmin && (
                  <Select value={filterVisitor} onChange={setFilterVisitor} className="w-full sm:w-40">
                    <option value="all">{t("allVisitors")}</option>
                    {visitors.map((v) => <option key={v} value={v}>{v}</option>)}
                  </Select>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5 items-center">
              {[["all", t("allTime")],["today", t("today")],["week", t("thisWeek")]].map(([v,l]) => (
                <button key={v} onClick={() => setTimeFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${timeFilter === v ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-600 border-slate-200 hover:border-amber-400"}`}>{l}</button>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">{t("month")}:</span>
                <input type="month" value={customMonth} onChange={e => { setCustomMonth(e.target.value); setCustomYear(""); setTimeFilter("month"); }}
                  className="h-8 px-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">{t("year")}:</span>
                <select value={customYear} onChange={e => { setCustomYear(e.target.value); setCustomMonth(""); setTimeFilter(e.target.value ? "year" : "all"); }}
                  className="h-8 px-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400">
                  <option value="">—</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {timeFilter !== "all" && (
                <button onClick={() => { setTimeFilter("all"); setCustomMonth(""); setCustomYear(""); }}
                  className="text-xs text-red-400 hover:text-red-600 underline">{t("clearFilter")}</button>
              )}
              <button onClick={() => {
                const rows = filtered.map(v => ({
                  "Date": v.visit_date?.slice(0,10), "Factory": v.factory_name,
                  "Visitor": v.visitor_name, "Order #": v.order_number,
                  "Item": v.item, "Purpose": v.purpose, "Location": v.location_address,
                }));
                exportToExcel(rows, `visits_${new Date().toISOString().slice(0,10)}.xlsx`);
              }} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export Excel ({filtered.length})
              </button>
            </div>
            {filtered.length === 0
              ? <EmptyState icon={Icon.clipboard} title={t("noVisitsFound")} subtitle={t("logFirstVisit")}
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
      <div className="flex flex-col sm:flex-row">
        <div className="w-full h-40 sm:w-44 sm:h-auto flex-shrink-0 sm:self-stretch bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
          {visit.picture_url ? <img src={visit.picture_url} alt="" className="w-full h-full object-contain bg-slate-100" /> : <div className="flex flex-col items-center gap-1 text-slate-300">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline strokeLinecap="round" strokeLinejoin="round" points="21 15 16 10 5 21"/></svg>
                  <span className="text-xs">No photo</span>
                </div>}
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
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-end gap-1.5 sm:gap-1">
            <div className="flex gap-1 justify-end">
              {canEdit && onEdit && <Btn variant="ghost" size="sm" onClick={onEdit}>{Icon.edit}</Btn>}
              {onDelete && <Btn variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-600">{Icon.trash}</Btn>}
            </div>
            <Btn variant="ghost" size="sm" onClick={onView} className="w-full sm:w-auto justify-center border border-slate-200 sm:border-0">{Icon.eye} {t("view")}</Btn>
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
    private_notes: "",
  });
  const [locating, setLocating] = useState(!isEdit);
  const [locError, setLocError] = useState("");
  const didGeo = useRef(false);

  if (!isEdit && !didGeo.current && typeof navigator !== "undefined" && navigator.geolocation) {
    didGeo.current = true;
    let bestAccuracy = Infinity;
    let watchId = null;
    let settled = false;

    async function applyPosition(pos) {
      const { latitude, longitude } = pos.coords;
      // Convert WGS-84 (browser GPS) → GCJ-02 (AMap/China system) — fixes ~500m offset
      const gcj = wgs84ToGcj02(latitude, longitude);
      try {
        const res = await fetch(`https://restapi.amap.com/v3/geocode/regeo?key=a3fa54b4926b09660455bbb6c286c12a&location=${gcj.lng},${gcj.lat}&radius=50&extensions=base&batch=false`);
        const data = await res.json();
        const address = data.regeocode?.formatted_address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setForm((p) => ({ ...p, latitude, longitude, location_address: address }));
      } catch {
        setForm((p) => ({ ...p, latitude, longitude, location_address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
      }
      setLocating(false);
    }

    // Watch position — accept updates as accuracy improves, stop after 10s or accuracy < 20m
    watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const acc = pos.coords.accuracy;
        if (acc < bestAccuracy) {
          bestAccuracy = acc;
          await applyPosition(pos);
          if (acc <= 20 && !settled) { // Good enough — stop watching
            settled = true;
            navigator.geolocation.clearWatch(watchId);
          }
        }
      },
      () => { setLocating(false); setLocError("GPS unavailable"); },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
    );
    // Always stop watching after 10s and keep best result so far
    setTimeout(() => { if (!settled) { navigator.geolocation.clearWatch(watchId); setLocating(false); } }, 10000);
  }

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const addImages = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        const url = await uploadImage(file);
        setForm((p) => ({ ...p, additional_pictures: [...p.additional_pictures, url] }));
      } catch (err) {
        alert("Upload failed: " + (err.message || err));
      }
    }
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
            <span className="animate-spin text-base">⏳</span><span>Getting precise location… (up to 10s)</span>
          </div>
        ) : form.latitude && form.longitude ? (
          <div className="flex items-start gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
            <span className="flex-shrink-0 mt-0.5 text-green-500">{Icon.pin}</span>
            <span className="flex-1 leading-relaxed">{form.location_address}</span>
            <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-md whitespace-nowrap">GPS ✓</span>
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
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Private Notes — only visible to you
        </p>
        <Textarea value={form.private_notes || ""} onChange={(e) => set("private_notes", e.target.value)} placeholder="Personal notes, reminders, observations…" rows={3} />
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
    const gcj = wgs84ToGcj02(lat, lon);
    fetch(`https://restapi.amap.com/v3/geocode/regeo?key=a3fa54b4926b09660455bbb6c286c12a&location=${gcj.lng},${gcj.lat}&radius=50&extensions=base&batch=false`)
      .then(r => r.json())
      .then(data => {
        const address = data.regeocode?.formatted_address || existingAddress;
        setAddress(address);
      })
      .catch(() => setAddress(existingAddress));
  }, [lat, lon, existingAddress]);
  return address;
}

function VisitDetailPage({ visitId, visits, setVisits, factories, onBack, currentUser, showToast, askConfirm, users = [], pushNotifToMany }) {
  const [showEdit, setShowEdit] = useState(false);
  const [lightbox, setLightbox] = useState(null);
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
      if (pushNotifToMany) {
        const recipientIds = users.filter(u => u.role === "admin" && u.id !== currentUser?.id).map(u => u.id);
        if (recipientIds.length) await pushNotifToMany(recipientIds, "visitDeleted", {
          visitor: visit?.visitor_name || "", factory: visit?.factory_name || "",
        }, null, "visit");
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
      <div className="bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3 transition-colors">{Icon.back} {t("backToVisits")}</button>
              <Badge className="bg-amber-500 text-white mb-2">#{visit.order_number}</Badge>
              <h1 className="text-2xl font-bold mt-1">{visit.item}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-300 flex-wrap">
                <div className="flex items-center gap-2">{Icon.calendar} {fmtDate(visit.visit_date, true)}</div>
                {resolvedAddress && <div className="flex items-start gap-2">{Icon.pin} <span>{resolvedAddress}</span></div>}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap flex-shrink-0">
              {canEdit && <Btn variant="white" onClick={() => setShowEdit((s) => !s)}>{Icon.edit} {t("edit")}</Btn>}
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
                  <img src={visit.picture_url} alt="Main" className="w-full object-cover max-h-80 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setLightbox(visit.picture_url)} />
                </Card>
              )}
              {visit.additional_pictures?.length > 0 && (
                <Card className="shadow-sm p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 text-sm">Additional Photos</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {visit.additional_pictures.map((p, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden">
                        <img src={p} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setLightbox(p)} />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              {lightbox && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
                  <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
                  <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition-colors">✕</button>
                </div>
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
                  {visit.private_notes && (visit.visitor_name === currentUser?.full_name || currentUser?.role === "admin") && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2">
                      <label className="text-xs text-slate-500 uppercase tracking-wide font-medium flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Private Notes
                      </label>
                      <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{visit.private_notes}</p>
                    </div>
                  )}
                </div>
              </Card>
              {(visit.latitude && visit.longitude) || visit.location_address ? (
                <Card className="shadow-sm overflow-hidden">
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">{Icon.pin} Location</h3>
                    {visit.latitude && visit.longitude && (
                      <a href={`https://uri.amap.com/marker?position=${visit.longitude},${visit.latitude}&name=Visit+Location&coordinate=gaode&zoom=15`} target="_blank" rel="noreferrer"
                        className="text-xs font-medium text-amber-600 hover:text-amber-700">Open in Amap →</a>
                    )}
                  </div>
                  {visit.latitude && visit.longitude ? (
                    <img 
                      src={`https://restapi.amap.com/v3/staticmap?location=${visit.longitude},${visit.latitude}&zoom=15&size=750*400&markers=large,0xFF0000,A:${visit.longitude},${visit.latitude}&key=a3fa54b4926b09660455bbb6c286c12a`}
                      alt="map" style={{ width: "100%", display: "block", maxHeight: "250px", objectFit: "cover" }} />
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
function DevelopmentsPage({ dark, devs, setDevs, factories, users, currentUser, onView, showToast, onNotify, askConfirm, pushNotif, pushNotifToMany }) {
  const [showForm, setShowForm]     = useState(false);
  const [editingDev, setEditingDev] = useState(null);
  const [search, setSearch]         = useState("");
  const [tab, setTab]               = useState("open");
  const [sortBy, setSortBy]         = useState("created_date");
  const [filterFactory, setFilterFactory] = useState("all");
  const isAdmin = currentUser?.role === "admin";
  const isSupplier = currentUser?.role === "supplier";
  const [filterUser, setFilterUser] = useState("all");
  const [supplierTab, setSupplierTab] = useState("active");
  // seenUpdates: map of devId -> latest update date/id we've seen (persisted in sessionStorage)
  const [seenUpdates, setSeenUpdates] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("seenUpdates") || "{}"); } catch { return {}; }
  });
  function markSeen(devId, latestDate) {
    setSeenUpdates(prev => {
      const next = { ...prev, [devId]: latestDate };
      try { sessionStorage.setItem("seenUpdates", JSON.stringify(next)); } catch {}
      return next;
    });
  }
  function hasNewUpdate(dev) {
    if (!dev.updates?.length) return false;
    const latest = dev.updates[0]?.created_date; // updates are newest-first
    if (!latest) return false;
    const seen = seenUpdates[dev.id];
    return !seen || new Date(latest) > new Date(seen);
  }
  // seenEdits: track when admin last edited a dev (for "Updated" pill)
  const [seenEdits, setSeenEdits] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("seenEdits") || "{}"); } catch { return {}; }
  });
  function markEditSeen(devId) {
    setSeenEdits(prev => {
      const next = { ...prev, [devId]: new Date().toISOString() };
      try { sessionStorage.setItem("seenEdits", JSON.stringify(next)); } catch {}
      return next;
    });
  }
  function hasBeenEdited(dev) {
    if (!dev.last_edited_at) return false;
    const seen = seenEdits[dev.id];
    return !seen || new Date(dev.last_edited_at) > new Date(seen);
  }
  const allUsers = [...new Set(devs.map(d => d.team_member_name).filter(Boolean))];

  // Factory-aware stats
  const factoryDevs = filterFactory === "all" ? devs : devs.filter(d => d.factory_ids?.includes(filterFactory));

  const filtered = devs
    .filter((d) => {
      // Admin sees all. Supplier handled separately. Users see their own + ones assigned to them.
      if (!isAdmin && !isSupplier) {
        const isOwner = d.team_member_id === currentUser?.id || d.team_member_name === currentUser?.full_name;
        const isAssigned = d.assigned_user_id === currentUser?.id;
        if (!isOwner && !isAssigned) return false;
      }
      if (tab === "completed") return d.status === "completed" || d.status === "cancelled";
      return d.status === "open" || d.status === "in_progress" || d.status === "pending";
    })
    .filter((d) => filterFactory === "all" || d.factory_ids?.includes(filterFactory))
    .filter((d) => filterUser === "all" || d.team_member_name === filterUser)
    .filter((d) => !search || [d.title, d.client_name, ...(d.factory_names || []), d.team_member_name, d.material]
      .some((x) => x?.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "user") return (a.team_member_name || "").localeCompare(b.team_member_name || "");
      return new Date(b.created_date) - new Date(a.created_date);
    });
  const openCount = factoryDevs.filter((d) => d.status === "open" || d.status === "in_progress" || d.status === "pending").length;
  const doneCount = factoryDevs.filter((d) => d.status === "completed").length;

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
        // Notify assigned user for each new dev
        if (pushNotif) {
          newDevs.forEach(nd => {
            if (nd?.assigned_user_id && nd.assigned_user_id !== currentUser?.id) {
              pushNotif(nd.assigned_user_id, "devAssigned", { title: nd.title || "" }, nd.id, "dev");
            }
          });
        }
      } else {
        const { updates: _, messages: __, ...record } = { ...data, id: genId("DEV-"), created_date: new Date().toISOString().slice(0, 10) };
        const saved = await db.upsertDev(record);
        if (saved) {
          const full = await db.getDevs();
          setDevs(full);
          showToast("Development created");
          onNotify(saved, saved.factory_ids?.[0]);
          // Notify assigned user
          if (pushNotif && saved.assigned_user_id && saved.assigned_user_id !== currentUser?.id) {
            await pushNotif(saved.assigned_user_id, "devAssigned", { title: saved.title || "" }, saved.id, "dev");
          }
        }
      }
    } else {
      const { updates: _, messages: __, ...record } = data;
      const prevDev = devs.find(d => d.id === data.id);
      await db.upsertDev({ ...record, last_edited_at: new Date().toISOString() });
      const full = await db.getDevs();
      setDevs(full);
      showToast("Development updated");
      // Notify newly assigned user if assignment changed
      if (pushNotif && data.assigned_user_id && data.assigned_user_id !== prevDev?.assigned_user_id) {
        if (data.assigned_user_id !== currentUser?.id) {
          await pushNotif(data.assigned_user_id, "devAssigned", { title: data.title || "" }, data.id, "dev");
        }
      }
      // Notify supplier that their development was edited
      if (pushNotifToMany) {
        const supplierUser = users.find(u => u.role === "supplier" && data.factory_ids?.includes(u.factory_id));
        const recipientIds = [supplierUser?.id].filter(id => id && id !== currentUser?.id);
        if (recipientIds.length) await pushNotifToMany(recipientIds, "devEdited", {
          title: data.title || "", by: currentUser?.full_name || "Admin",
        }, data.id, "dev");
      }
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

  // ── Supplier dedicated view ──────────────────────────────────────────────
  if (isSupplier) {
    const myDevs = devs.filter(d => d.factory_ids?.includes(currentUser?.factory_id));
    const myActive = myDevs.filter(d => d.status === "open" || d.status === "in_progress" || d.status === "pending");
    const myDone   = myDevs.filter(d => d.status === "completed" || d.status === "cancelled");
    const supplierList = supplierTab === "active" ? myActive : myDone;

    // Track which devs the supplier has seen (persisted in localStorage)
    const [seenDevIds, setSeenDevIds] = useState(() => {
      try { return JSON.parse(localStorage.getItem(`seenDevs_${currentUser?.id}`) || "[]"); } catch { return []; }
    });
    function markDevSeen(devId) {
      setSeenDevIds(prev => {
        if (prev.includes(devId)) return prev;
        const next = [...prev, devId];
        try { localStorage.setItem(`seenDevs_${currentUser?.id}`, JSON.stringify(next)); } catch {}
        return next;
      });
    }
    function isNewDev(dev) { return !seenDevIds.includes(dev.id); }

    return (
      <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gradient-to-br from-slate-50 to-purple-50/20"}`}>
        <div className="bg-slate-800 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <h1 className="text-xl font-bold">{t("myAssignedDevs")}</h1>
            <p className="text-slate-400 mt-0.5 text-xs">{t("assignedToFactory")}</p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[[t("active"), myActive.length, "active"], [t("completed"), myDone.length, "done"], [t("total"), myDevs.length, null]].map(([label, value, tab]) => (
                <div key={label} onClick={() => tab && setSupplierTab(tab)}
                  className={`rounded-xl p-3 border transition-all ${tab ? "cursor-pointer hover:bg-white/20" : ""} ${supplierTab === tab ? "bg-amber-500/30 border-amber-400" : "bg-white/10 border-white/10"}`}>
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-slate-300 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {supplierList.length === 0
            ? <EmptyState icon={Icon.flask} title={t("noDevsYet")} subtitle={t("assignedWillAppear")} />
            : <div className="space-y-4">
                {supplierList.map(dev => {
                  const latestUpdate = dev.updates?.slice(-1)[0];
                  const unreadCount = (dev.messages || []).filter(m =>
                    m.sender_name !== currentUser?.full_name && !(m.read_by || []).includes(currentUser?.full_name)
                  ).length;
                  const isNew = isNewDev(dev);
                  return (
                    <div key={dev.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex">
                        <div className="w-36 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative min-h-[140px]">
                          {dev.picture_url
                            ? <img src={dev.picture_url} alt={dev.title} className="w-full h-full object-cover absolute inset-0" />
                            : <div className="flex flex-col items-center gap-1 text-slate-400">
                                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline strokeLinecap="round" strokeLinejoin="round" points="21 15 16 10 5 21"/></svg>
                                <span className="text-xs">No photo</span>
                              </div>
                          }
                          {/* Team member name on thumbnail */}
                          {dev.team_member_name && (() => {
                            const member = users.find(u => u.id === dev.team_member_id);
                            const displayName = member?.chinese_name || dev.team_member_name;
                            return (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                <p className="text-white text-xs font-medium truncate text-center">👤 {displayName}</p>
                              </div>
                            );
                          })()}
                          {isNew && (
                            <div className="absolute top-2 left-2">
                              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">New</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DEV_STATUS_CSS[dev.status]}`}>{DEV_STATUS_LABEL()[dev.status]}</span>
                            {unreadCount > 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">💬 {unreadCount} new</span>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-800 text-base">{dev.title}</h3>
                          {dev.material && <p className="text-xs text-slate-500 mt-0.5">Material: {dev.material}{dev.size ? ` · ${dev.size}` : ""}</p>}
                          {dev.special_remarks && (
                            <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 rounded-lg p-2 border border-slate-100">{dev.special_remarks}</p>
                          )}
                          {latestUpdate && (() => {
                            const preview = latestUpdate.production_status || latestUpdate.notes || "";
                            return preview ? (
                              <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                                <p className="text-xs text-purple-500 uppercase tracking-wide font-semibold mb-0.5">{globalLang === "zh" ? "最新更新" : "Latest update"}</p>
                                <p className="text-xs text-purple-700">{preview.slice(0, 100)}{preview.length > 100 ? "…" : ""}</p>
                              </div>
                            ) : null;
                          })()}
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-slate-400">{fmtDate(dev.created_date)}</p>
                            <Btn variant="purple" size="sm" onClick={() => { markDevSeen(dev.id); markSeen(dev.id, dev.updates?.[0]?.created_date); onView(dev.id); }}>{t("viewAndUpdate")}</Btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gradient-to-br from-slate-50 to-purple-50/20"}`}>
      <div className="bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">{t("dev")}</h1>
              <p className="text-slate-400 mt-0.5 text-xs">Track product development requests</p>
            </div>
            {!isSupplier && (
              <Btn variant="purple" size="lg" onClick={() => { setEditingDev(null); setShowForm(true); }}>
                {Icon.plus} {t("newDev")}
              </Btn>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[[t("active"), openCount, "open"], [t("completed"), doneCount, "completed"], [t("total"), factoryDevs.length, null]].map(([label, value, tabTarget]) => (
              <div key={label} onClick={() => tabTarget && setTab(tabTarget)}
                style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"0.75rem",padding:"1rem",cursor:tabTarget?"pointer":"default",transition:"all 0.2s"}}>
                <p className="text-lg font-bold">{value}</p>
                <p style={{color:"#cbd5e1"}} className="text-xs mt-0.5">{label}{filterFactory !== "all" ? " *" : ""}</p>
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
              {[["open", t("active"), openCount], ["completed", t("completed"), doneCount]].map(([v, l, count]) => (
                <button key={v} onClick={() => setTab(v)}
                  className={`px-5 py-3 text-sm font-medium transition-colors ${tab === v ? "text-purple-600 border-b-2 border-purple-500" : "text-slate-500 hover:text-slate-700"}`}>{l} ({count})</button>
              ))}
            </div>
            <div className="flex flex-col gap-2 mb-5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{Icon.search}</span>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchDevs")} className="pl-11 w-full" />
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
                {!isSupplier && (
                  <Select value={filterFactory} onChange={setFilterFactory} className="w-full sm:w-44">
                    <option value="all">{t("allFactories")}</option>
                    {factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </Select>
                )}
                <Select value={sortBy} onChange={setSortBy} className="w-full sm:w-40">
                  <option value="created_date">{t("newestFirst")}</option>
                  <option value="title">{t("nameAZ")}</option>
                  {isAdmin && <option value="user">{t("byTeamMember")}</option>}
                </Select>
                {isAdmin && (
                  <Select value={filterUser} onChange={setFilterUser} className="w-full sm:w-44">
                    <option value="all">{t("allTeamMembers")}</option>
                    {allUsers.map(u => <option key={u} value={u}>{u}</option>)}
                  </Select>
                )}
                <button onClick={() => {
                  const rows = filtered.map(d => ({
                    "ID": d.id, "Title": d.title, "Status": DEV_STATUS_LABEL()[d.status] || d.status,
                    "Department": d.department, "Factory": d.factory_names?.join(", "),
                    "Team Member": d.team_member_name, "Client": d.client_name,
                    "Material": d.material, "Size": d.size, "Weight": d.weight,
                    "Target Date": d.internal_estimated_date, "Target Price": d.internal_estimated_price,
                    "Created": d.created_date,
                  }));
                  exportToExcel(rows, `developments_${new Date().toISOString().slice(0,10)}.xlsx`);
                }} className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors whitespace-nowrap">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export ({filtered.length})
                </button>
              </div>
            </div>
            {filtered.length === 0
              ? <EmptyState icon={Icon.flask} title={t("noDevsFound")} subtitle={t("createFirstDev")}
                  action={!isSupplier ? <Btn variant="purple" onClick={() => setShowForm(true)}>{Icon.plus} {t("newDev")}</Btn> : null} />
              : <div className="space-y-3">
                  {filtered.map((d) => (
                    <DevCard key={d.id} dev={d}
                      onEdit={isAdmin ? () => { setEditingDev(d); setShowForm(true); } : null}
                      onDelete={isAdmin ? () => deleteDev(d.id) : null}
                      hasNewUpdate={hasNewUpdate(d)}
                      hasBeenEdited={hasBeenEdited(d)}
                      onView={() => { markSeen(d.id, d.updates?.[0]?.created_date); markEditSeen(d.id); onView(d.id); }} />
                  ))}
                </div>
            }
          </>
        )}
      </div>
    </div>
  );
}

function DevCard({ dev, onEdit, onDelete, onView, hasNewUpdate, hasBeenEdited }) {
  const latestUpdate = dev.updates?.[0];
  const hasOverdueStep = (() => {
    const steps = latestUpdate?.production_steps || {};
    const latestUpdateDate = latestUpdate?.created_date ? new Date(latestUpdate.created_date) : null;
    const today = getChinaToday();
    return Object.values(steps).some(s => {
      if (!s.est_date || s.completed) return false;
      const due = parseLocalDate(s.est_date);
      if (due > today) return false;
      const nextDay = new Date(due.getTime() + 24 * 60 * 60 * 1000);
      const hasNewerUpdate = dev.updates?.some(u => u.created_date && new Date(u.created_date) >= nextDay);
      return !hasNewerUpdate;
    });
  })();
  const needsFollowUp = ((dev.status === "open" || dev.status === "in_progress") && (!dev.updates || dev.updates.length === 0) && daysAgo(dev.created_date) >= 3) || hasOverdueStep;
  const isActive    = dev.status === "open" || dev.status === "in_progress";
  const isCompleted = dev.status === "completed";
  const activeDays  = daysAgo(dev.created_date);

  const completedDate = isCompleted && dev.updates?.length > 0
    ? dev.updates[dev.updates.length - 1]?.created_date
    : null;
  const daysToComplete = completedDate
    ? Math.round((new Date(completedDate) - new Date(dev.created_date)) / 86400000)
    : isCompleted ? activeDays : null;

  // Get the latest factory estimated finish date from updates (updates[0] is newest)
  const latestEstFinish = dev.updates?.find(u => u.estimated_finish_date)?.estimated_finish_date || null;
  const targetDate = dev.internal_estimated_date || null;

  // Is target date overdue?
  const targetOverdue = targetDate && new Date(targetDate) < getChinaNow() && !isCompleted;

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all overflow-hidden ${needsFollowUp ? "border-t-4 border-t-orange-400 sm:border-t-0 sm:border-l-4 sm:border-l-orange-400" : ""}`}>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full h-44 sm:w-52 sm:h-auto flex-shrink-0 sm:self-stretch bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 relative">
          {dev.picture_url ? <img src={dev.picture_url} alt={dev.title} className="w-full h-full object-contain bg-slate-100" /> : <div className="flex flex-col items-center gap-1 text-slate-300">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline strokeLinecap="round" strokeLinejoin="round" points="21 15 16 10 5 21"/></svg>
                  <span className="text-xs">No photo</span>
                </div>}
          {(hasNewUpdate || hasBeenEdited) && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 pb-2 flex-wrap px-2">
              {hasNewUpdate && (
                <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  New Update
                </div>
              )}
              {hasBeenEdited && (
                <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Updated
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge className={`${DEV_STATUS_CSS[dev.status]} text-xs`}>{DEV_STATUS_LABEL()[dev.status]}</Badge>
            {isActive && (
              <Badge className={`text-xs ${activeDays >= 14 ? "bg-red-100 text-red-700" : activeDays >= 7 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"}`}>
                {activeDays === 0 ? "Today" : `${activeDays}d open`}
              </Badge>
            )}
            {isCompleted && daysToComplete !== null && (
              <Badge className="text-xs bg-green-100 text-green-700">
                {daysToComplete === 0 ? "Same day" : `${daysToComplete}d to complete`}
              </Badge>
            )}
            {needsFollowUp && <Badge className="bg-orange-100 text-orange-700 text-xs">{t("followUpNeeded")}</Badge>}
          </div>
          <h3 className="font-semibold text-slate-800 text-base line-clamp-1">{dev.title}</h3>
          {dev.client_name && <p className="text-xs text-slate-500 mb-1">Client: {dev.client_name}</p>}
          <div className="space-y-0.5 text-xs text-slate-600">
            {dev.factory_names?.length > 0 && <div className="flex items-center gap-1">{Icon.building} {dev.factory_names[0]}</div>}
            {dev.team_member_name && <div className="flex items-center gap-1">{Icon.user} {dev.team_member_name}</div>}
            <div className="flex items-center gap-1">{Icon.calendar} {fmtDate(dev.created_date)}</div>
          </div>
          {(targetDate || latestEstFinish) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {targetDate && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${targetOverdue ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="opacity-70">Target:</span> {fmtDate(targetDate)}
                </div>
              )}
              {latestEstFinish && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="opacity-70">Factory Est:</span> {fmtDate(latestEstFinish)}
                </div>
              )}
            </div>
          )}
          {(() => {
            const lu = dev.updates?.[0];
            const steps = lu?.production_steps || {};
            const activeSteps = Object.entries(steps).filter(([, s]) => !s.completed);
            if (!activeSteps.length) return null;
            const today = getChinaNow();
            return (
              <div className="mt-2 space-y-1">
                {activeSteps.map(([id, s]) => {
                  const step = PRODUCTION_STEPS.find(p => p.id === id);
                  if (!step) return null;
                  const diff = s.est_date ? Math.ceil((parseLocalDate(s.est_date) - today) / 86400000) : null;
                  const isOverdue = diff !== null && diff < 0;
                  const isToday = diff === 0;
                  const timeLabel = diff === null ? null : isOverdue ? `Overdue ${Math.abs(diff)}d` : isToday ? "Due Today" : `${diff} Days Left`;
                  return (
                    <div key={id} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border ${isOverdue ? "bg-red-50 text-red-700 border-red-200" : isToday ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-purple-50 text-purple-700 border-purple-100"}`}>
                      <span>{step.icon}</span>
                      <span className="font-semibold">{getStepLabel(step.id)}</span>
                      {timeLabel && <><span className="opacity-40">·</span><span>{timeLabel}</span></>}
                    </div>
                  );
                })}
              </div>
            );
          })()}
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-end gap-1.5 sm:gap-1">
            <div className="flex gap-1 justify-end sm:justify-end">
              {onEdit   && <Btn variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(dev);    }}>{Icon.edit}</Btn>}
              {onDelete && <Btn variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(dev.id); }}>{Icon.trash}</Btn>}
            </div>
            <Btn variant="ghost" size="sm" onClick={onView} className="w-full sm:w-auto justify-center border border-slate-200 sm:border-0">{Icon.eye} {t("view")}</Btn>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DevForm({ dev, factories, users, currentUser, onSave, onCancel }) {
  const isEdit = !!dev?.id;
  const isAdmin = currentUser?.role === "admin";
  const [form, setForm] = useState(dev || {
    title: "", department: "", client_name: "", buyer_name: "", mail_subject: "",
    factory_ids: [], factory_names: [],
    team_member_name: currentUser?.full_name || "", team_member_id: currentUser?.id || "",
    assigned_user_id: "", assigned_user_name: "",
    material: "", size: "", weight: "",
    internal_estimated_date: "", internal_estimated_price: "",
    internal_notes: "",
    special_remarks: "", picture_url: "", additional_pictures: [], artwork_files: [], status: "pending",
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleFactory = (fac, checked) => {
    if (checked) { set("factory_ids", [...form.factory_ids, fac.id]); set("factory_names", [...form.factory_names, fac.name]); }
    else { set("factory_ids", form.factory_ids.filter((id) => id !== fac.id)); set("factory_names", form.factory_names.filter((n) => n !== fac.name)); }
  };

  const addImages = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        const url = await uploadImage(file);
        setForm((p) => ({ ...p, additional_pictures: [...(p.additional_pictures || []), url] }));
      } catch (err) {
        alert("Upload failed: " + (err.message || err));
      }
    }
  };

  const [artworkUploading, setArtworkUploading] = useState([]);
  const addArtworks = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const tempId = Date.now() + Math.random();
      setArtworkUploading(p => [...p, { id: tempId, name: file.name, progress: 0 }]);
      try {
        const path = `${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`;
        // Simulate progress while uploading
        const progressInterval = setInterval(() => {
          setArtworkUploading(p => p.map(u => u.id === tempId ? { ...u, progress: Math.min(u.progress + 15, 90) } : u));
        }, 200);
        const { error } = await supabase.storage.from("photos").upload(path, file, { upsert: false, contentType: file.type });
        clearInterval(progressInterval);
        if (error) throw error;
        setArtworkUploading(p => p.map(u => u.id === tempId ? { ...u, progress: 100 } : u));
        const { data } = supabase.storage.from("photos").getPublicUrl(path);
        setForm((p) => ({ ...p, artwork_files: [...(p.artwork_files || []), { name: file.name, url: data.publicUrl }] }));
        setTimeout(() => setArtworkUploading(p => p.filter(u => u.id !== tempId)), 800);
      } catch (err) {
        setArtworkUploading(p => p.filter(u => u.id !== tempId));
        alert("Artwork upload failed: " + (err.message || err));
      }
    }
  };

  const valid = form.title && form.factory_ids.length > 0 && form.internal_estimated_date;

  return (
    <FormCard title={isEdit ? "Edit Development" : "New Development Request"} onClose={onCancel}
      footer={<><Btn variant="outline" onClick={onCancel}>Cancel</Btn><Btn variant="dark" disabled={!valid} onClick={() => onSave(form, !isEdit)}>{Icon.check} {isEdit ? "Update" : "Create & Notify Factories"}</Btn></>}>

      {/* Product name + Department */}
      <div className="grid grid-cols-2 gap-4">
        <div><Label required>Item / Product Name</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Blue Polo Shirt" /></div>
        <div>
          <Label>Department</Label>
          <select value={form.department || ""} onChange={(e) => set("department", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">— Select department —</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
      </div>

      {/* Size / Weight / Material */}
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Size</Label><Input value={form.size} onChange={(e) => set("size", e.target.value)} placeholder="e.g. 30x40cm" /></div>
        <div><Label>Weight</Label><Input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 200g" /></div>
        <div><Label>Material</Label><Input value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="e.g. Cotton" /></div>
      </div>

      {/* Target Date — visible to all */}
      <div className="grid grid-cols-2 gap-4">
        <div><Label required>Target Date</Label><Input type="date" value={form.internal_estimated_date} onChange={(e) => set("internal_estimated_date", e.target.value)} /></div>
      </div>

      {/* Internal Info — not visible to suppliers */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Internal Info — not visible to suppliers
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Client Name</Label><Input value={form.client_name} onChange={(e) => set("client_name", e.target.value)} placeholder="e.g. H&M" /></div>
          <div><Label>Buyer Name</Label><Input value={form.buyer_name || ""} onChange={(e) => set("buyer_name", e.target.value)} placeholder="e.g. Sarah Cohen" /></div>
        </div>
        <div><Label>Mail Subject</Label><Input value={form.mail_subject || ""} onChange={(e) => set("mail_subject", e.target.value)} placeholder="Paste the email subject line here" /></div>
        <div>
          <Label>Target Price (RMB ¥)</Label>
          <Input type="number" value={form.internal_estimated_price}
            onChange={(e) => set("internal_estimated_price", e.target.value)}
            onBlur={(e) => { const n = parseFloat(e.target.value); if (!isNaN(n)) set("internal_estimated_price", n.toFixed(2)); }}
            placeholder="0.00" step="0.01" />
        </div>
        {isAdmin && users?.length > 0 && (
          <div>
            <Label>Assign User In Charge</Label>
            <select value={form.assigned_user_id || ""} onChange={(e) => {
              const u = users.find(u => u.id === e.target.value);
              set("assigned_user_id", e.target.value);
              set("assigned_user_name", u?.full_name || "");
            }} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">— No specific user assigned —</option>
              {users.filter(u => u.role !== "supplier" && u.role !== "viewer").map(u => (
                <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">This development will appear in the assigned user's Dev tab</p>
          </div>
        )}
        <div>
          <Label>Internal Notes / Remarks</Label>
          <Textarea value={form.internal_notes || ""} onChange={(e) => set("internal_notes", e.target.value)}
            placeholder="e.g. Similar to order #1234, reference development DEV-005…" rows={3} />
          <p className="text-xs text-slate-400 mt-1">Not visible to suppliers</p>
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
      <div><Label>{t("specialRemarks")}</Label><Textarea value={form.special_remarks} onChange={(e) => set("special_remarks", e.target.value)} placeholder="Instructions for factories…" /></div>
      <PhotoUpload url={form.picture_url} onChange={(v) => set("picture_url", v)} label={globalLang === "zh" ? "参考图片" : "Reference Photo"} />
      <div>
        <Label>{globalLang === "zh" ? "附加参考图片" : "Additional Reference Photos"}</Label>
        <label className="flex items-center justify-center h-11 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all">
          <input type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
          <span className="flex items-center gap-2 text-sm text-slate-500">{Icon.upload} {globalLang === "zh" ? "添加照片" : "Add photos"}</span>
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
      <div>
        <Label>Artwork Files <span className="text-slate-400 font-normal text-xs">(PDF, AI, images)</span></Label>
        <label className="flex items-center justify-center h-11 border-2 border-dashed border-purple-200 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all">
          <input type="file" accept=".pdf,.ai,.eps,.svg,image/*" multiple onChange={addArtworks} className="hidden" />
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Upload artworks
          </span>
        </label>
        {artworkUploading.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {artworkUploading.map(u => (
              <div key={u.id} className="px-3 py-2 bg-purple-50 border border-purple-100 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-700 truncate flex-1">{u.name}</span>
                  <span className="text-xs text-purple-500 ml-2">{u.progress}%</span>
                </div>
                <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-200" style={{ width: `${u.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {form.artwork_files?.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {form.artwork_files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-100 rounded-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 flex-shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <a href={f.url} target="_blank" rel="noreferrer" className="text-xs text-purple-700 truncate flex-1 hover:underline">{f.name}</a>
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, artwork_files: prev.artwork_files.filter((_, j) => j !== i) }))}
                  className="w-4 h-4 flex items-center justify-center text-red-400 hover:text-red-600 text-sm flex-shrink-0">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormCard>
  );
}

function DevDetailPage({ dark, devId, devs, setDevs, factories, getFactory, getUser, onBack, currentUser, onReminder, showToast, askConfirm, users = [], pushNotif, pushNotifToMany }) {
  const [showEdit, setShowEdit]           = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [activeTab, setActiveTab]         = useState("updates");
  const [lightbox, setLightbox]           = useState(null);
  const dev = devs.find((d) => d.id === devId);
  if (!dev) return null;
  const isAdmin    = currentUser?.role === "admin";
  const isSupplier = currentUser?.role === "supplier";

  // Unread messages: messages not sent by current user and not read by them
  const unreadCount = (dev.messages || []).filter(m =>
    m.sender_name !== currentUser?.full_name &&
    !(m.read_by || []).includes(currentUser?.full_name)
  ).length;

  async function changeStatus(status) {
    const historyEntry = { status, changed_by: currentUser?.full_name || "Unknown", changed_at: new Date().toISOString() };
    const newHistory = [...(dev.status_history || []), historyEntry];
    await db.upsertDev({ ...dev, status, status_history: newHistory, updates: undefined, messages: undefined });
    setDevs((p) => p.map((d) => d.id === devId ? { ...d, status, status_history: newHistory } : d));
    showToast(`Status: ${DEV_STATUS_LABEL()[status]}`);
    if (!pushNotifToMany) return;
    if (status === "open") {
      const supplierUser = users.find(u => u.role === "supplier" && dev.factory_ids?.includes(u.factory_id));
      if (currentUser?.role === "supplier") {
        // Supplier reopened → notify admins + team member + assigned user
        const recipientIds = [
          ...users.filter(u => u.role === "admin").map(u => u.id),
          dev.team_member_id,
          dev.assigned_user_id,
        ].filter(id => id && id !== currentUser?.id);
        if (recipientIds.length) {
          await pushNotifToMany(recipientIds, "devReopened", {
            title: dev.title || "",
            by: currentUser?.full_name || "Supplier",
          }, devId, "dev");
        }
      } else {
        // Admin/user reopened → notify supplier
        const recipientIds = [supplierUser?.id].filter(id => id && id !== currentUser?.id);
        if (recipientIds.length) {
          await pushNotifToMany(recipientIds, "devReopened", {
            title: dev.title || "",
            by: currentUser?.full_name || "Team",
          }, devId, "dev");
        }
      }
    } else if (status === "completed") {
      // Marked complete → notify admins + team member + assigned user + supplier
      const supplierUser = users.find(u => u.role === "supplier" && dev.factory_ids?.includes(u.factory_id));
      const recipientIds = [
        ...users.filter(u => u.role === "admin").map(u => u.id),
        dev.team_member_id,
        dev.assigned_user_id,
        supplierUser?.id,
      ].filter(id => id && id !== currentUser?.id);
      if (recipientIds.length) {
        await pushNotifToMany(recipientIds, "devCompleted", {
          title: dev.title || "",
          by: currentUser?.full_name || "Team",
        }, devId, "dev");
      }
    }
  }

  const [editingStep, setEditingStep] = useState(null); // { update, stepId, stepData, markDone }

  async function handleEditStep(update, stepId, stepData, markDone = false) {
    if (markDone) {
      // Mark step as completed
      const newSteps = { ...update.production_steps, [stepId]: { ...stepData, completed: true } };
      const { error } = await supabase.from("development_updates")
        .update({ production_steps: newSteps })
        .eq("id", update.id);
      if (!error) {
        const full = await db.getDevs();
        setDevs(full);
        showToast("Step marked as done ✓");
        // Notify admins + team member + assigned user
        if (pushNotifToMany) {
          const step = PRODUCTION_STEPS.find(p => p.id === stepId);
          const stepLabel = getStepLabel(stepId);
          const recipientIds = [
            ...users.filter(u => u.role === "admin").map(u => u.id),
            dev.team_member_id,
            dev.assigned_user_id,
          ].filter(id => id && id !== currentUser?.id);
          if (recipientIds.length) {
            await pushNotifToMany(recipientIds, "stepDone", {
              factory: dev.factory_names?.[0] || currentUser?.factory_name || "Supplier",
              title: dev.title || "",
              step: stepLabel,
            }, devId, "dev");
          }
        }
      }
    } else {
      setEditingStep({ update, stepId, stepData });
    }
  }

  async function saveStepEdit(newDate) {
    if (!editingStep) return;
    const { update, stepId, stepData } = editingStep;
    const newSteps = { ...update.production_steps, [stepId]: { ...stepData, est_date: newDate } };
    const { error } = await supabase.from("development_updates")
      .update({ production_steps: newSteps })
      .eq("id", update.id);
    if (!error) {
      const full = await db.getDevs();
      setDevs(full);
      showToast("Step date updated");
    }
    setEditingStep(null);
  }

  async function saveUpdate(data) {
    const { mark_complete, ...updateData } = data;
    // Sanitize empty strings to null for date fields (Supabase rejects "" for date type)
    const sanitized = { ...updateData };
    ["materials_arrival_date","estimated_finish_date"].forEach(k => {
      if (sanitized[k] === "" || sanitized[k] === undefined) sanitized[k] = null;
    });
    const record = { ...sanitized, id: genId("UPD"), development_id: devId, created_date: new Date().toISOString() };
    const saved = await db.insertUpdate(record);
    if (saved) {
      // Add to status history
      const historyEntry = {
        status: mark_complete ? "completed" : "update_submitted",
        changed_by: currentUser?.full_name || "Supplier",
        changed_at: new Date().toISOString(),
        label: (() => {
          if (mark_complete) return "Supplier submitted final update & marked complete";
          const steps = data.production_steps || {};
          const stepLabels = Object.entries(steps).map(([id, s]) => {
            const step = PRODUCTION_STEPS.find(p => p.id === id);
            const label = step?.label || id;
            if (s.est_date) {
              const days = Math.ceil((parseLocalDate(s.est_date) - getChinaNow()) / 86400000);
              if (days > 0) return label + " (" + days + " Day" + (days !== 1 ? "s" : "") + " Left)";
              if (days === 0) return label + " (Due Today)";
              return label;
            }
            return label;
          });
          return stepLabels.length > 0 ? stepLabels.join(" · ") : ("Update submitted" + (data.notes ? ": " + data.notes.slice(0, 40) : ""));
        })(),
      };
      const newHistory = [...(dev.status_history || []), historyEntry];
      if (mark_complete) {
        await db.upsertDev({ ...dev, status: "completed", status_history: newHistory, updates: undefined, messages: undefined });
        setDevs((p) => p.map((d) => d.id === devId
          ? { ...d, status: "completed", status_history: newHistory, updates: [saved, ...(d.updates || [])] }
          : d));
        showToast("✅ Development marked as completed!");
      } else {
        await db.upsertDev({ ...dev, status_history: newHistory, updates: undefined, messages: undefined });
        setDevs((p) => p.map((d) => d.id === devId ? { ...d, status_history: newHistory, updates: [saved, ...(d.updates || [])] } : d));
        showToast("Update submitted");
      }
      // Notify admin + team member + assigned user (+ supplier if marked complete)
      if (pushNotifToMany) {
        const supplierUser = users.find(u => u.role === "supplier" && dev.factory_ids?.includes(u.factory_id));
        const recipientIds = [
          ...users.filter(u => u.role === "admin").map(u => u.id),
          dev.team_member_id,
          dev.assigned_user_id,
          mark_complete ? supplierUser?.id : null,
        ].filter(id => id && id !== currentUser?.id);
        if (recipientIds.length) {
          const stepNames = Object.keys(data.production_steps || {}).map(id => {
            const s = PRODUCTION_STEPS.find(p => p.id === id);
            return s ? s.label : id;
          });
          await pushNotifToMany(recipientIds, mark_complete ? "devCompleted" : "devUpdate", {
            factory: dev.factory_names?.[0] || currentUser?.factory_name || "Supplier",
            title: dev.title || "",
            steps: stepNames,
            notes: data.notes || "",
            by: currentUser?.full_name || "Supplier",
          }, devId, "dev");
        }
      }
    }
    setShowUpdateForm(false);
  }

  async function saveDev(data) {
    const { updates: _, messages: __, ...record } = data;
    await db.upsertDev({ ...record, id: devId, last_edited_at: new Date().toISOString() });
    const full = await db.getDevs();
    setDevs(full);
    setShowEdit(false);
    showToast("Development updated");
    // Notify newly assigned user if assignment changed
    if (pushNotif && data.assigned_user_id && data.assigned_user_id !== dev.assigned_user_id) {
      if (data.assigned_user_id !== currentUser?.id) {
        await pushNotif(data.assigned_user_id, "devAssigned", { title: data.title || dev.title || "" }, devId, "dev");
      }
    }
    // Notify supplier that their development was edited
    if (pushNotifToMany) {
      const supplierUser = users.find(u => u.role === "supplier" && dev.factory_ids?.includes(u.factory_id));
      const recipientIds = [supplierUser?.id].filter(id => id && id !== currentUser?.id);
      if (recipientIds.length) await pushNotifToMany(recipientIds, "devEdited", {
        title: data.title || dev.title || "", by: currentUser?.full_name || "Admin",
      }, devId, "dev");
    }
  }

  async function del() {
    askConfirm("Delete this development?", async () => {
      await db.deleteDev(devId);
      setDevs((p) => p.filter((d) => d.id !== devId));
      showToast("Deleted"); onBack();
      if (pushNotifToMany) {
        const supplierUser = users.find(u => u.role === "supplier" && dev.factory_ids?.includes(u.factory_id));
        const recipientIds = [
          ...users.filter(u => u.role === "admin" && u.id !== currentUser?.id).map(u => u.id),
          supplierUser?.id,
        ].filter(id => id && id !== currentUser?.id);
        if (recipientIds.length) await pushNotifToMany(recipientIds, "devDeleted", {
          title: dev.title || "", by: currentUser?.full_name || "Admin",
        }, null, "dev");
      }
    });
  }

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gradient-to-br from-slate-50 to-purple-50/20"}`}>
      <div style={{background:"linear-gradient(to right, #1e293b, #334155)",color:"white"}}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors">{Icon.back} Back</button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className={DEV_STATUS_CSS[dev.status]}>{DEV_STATUS_LABEL()[dev.status]}</Badge>
                <Badge className="bg-white/10 text-white text-xs">{daysAgo(dev.created_date)}d open</Badge>
              </div>
              <h1 className="text-2xl font-bold">{dev.title}</h1>
              {dev.client_name && <p className="text-slate-300 mt-1">{dev.client_name}</p>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {(dev.status === "open" || dev.status === "in_progress") && (
                <Btn variant="amber" onClick={() => changeStatus("completed")}>{Icon.check} Mark Complete</Btn>
              )}
              {dev.status === "completed" && (
                <Btn variant="ghost" onClick={() => changeStatus("open")}
                  className="border border-slate-300 text-slate-300 hover:bg-white/10">
                  ↩ Reopen
                </Btn>
              )}
              {isAdmin && (
                <Btn variant="white" onClick={() => setShowEdit((s) => !s)}>{Icon.edit} {t("edit")}</Btn>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {showEdit && (
          <div className="mb-6">
            <DevForm dev={dev} factories={factories} users={users} currentUser={currentUser} onSave={saveDev} onCancel={() => setShowEdit(false)} />
          </div>
        )}
        {!showEdit && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {dev.picture_url && (
                <Card className="overflow-hidden shadow-sm">
                  <img src={dev.picture_url} alt="Reference" className="w-full object-cover max-h-72 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setLightbox(dev.picture_url)} />
                </Card>
              )}
              {dev.additional_pictures?.length > 0 && (
                <Card className="shadow-sm p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 text-sm">Additional Photos</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {dev.additional_pictures.map((p, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden">
                        <img src={p} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setLightbox(p)} />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {lightbox && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
                  <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
                  <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition-colors">✕</button>
                </div>
              )}
              <Card className="shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100">
                  {[["updates", t("factoryUpdates")], ["chat", t("chat")], ["history", t("statusHistory")]].map(([v, label]) => (
                    <button key={v} onClick={() => setActiveTab(v)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === v ? "text-purple-600 border-b-2 border-purple-500" : "text-slate-500 hover:text-slate-700"}`}>
                      {label}
                      {v === "chat" && activeTab !== "chat" && unreadCount > 0 && (
                        <span className="absolute top-2 right-[calc(50%-20px)] w-2.5 h-2.5 bg-red-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                {editingStep && (
                  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
                      <h3 className="font-semibold text-slate-800">Edit Step Date</h3>
                      <p className="text-sm text-slate-600">{PRODUCTION_STEPS.find(p => p.id === editingStep.stepId)?.label}</p>
                      <input type="date" min={new Date().toISOString().slice(0,10)}
                        defaultValue={editingStep.stepData.est_date || ""}
                        id="editStepDateInput"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
                      <div className="flex justify-end gap-2">
                        <Btn variant="outline" size="sm" onClick={() => setEditingStep(null)}>Cancel</Btn>
                        <Btn variant="purple" size="sm" onClick={() => {
                          const val = document.getElementById("editStepDateInput").value;
                          if (val) saveStepEdit(val);
                        }}>Save Date</Btn>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "updates" && (
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-700">{t("factoryUpdatesCount")} ({dev.updates?.length || 0})</h4>
                      <div className="flex gap-2">
                        {!isSupplier && <Btn variant="ghost" size="sm" onClick={() => {
                          const fac = getFactory(dev.factory_ids?.[0]);
                          const wechatId = fac?.wechat_id;
                          if (!wechatId) { showToast("⚠ No WeChat ID set for this factory", "error"); return; }
                          window.location.href = `weixin://dl/chat?${wechatId}`;
                          setTimeout(() => showToast(`WeChat ID: ${wechatId} — open WeChat and search this ID`, "ok"), 1000);
                        }}>{Icon.wechat} Remind</Btn>}
                        {!isSupplier && <Btn variant="purple" size="sm" onClick={() => setShowUpdateForm((s) => !s)}>{Icon.plus} Add Update</Btn>}
                        {isSupplier && <Btn variant="purple" size="sm" onClick={() => setShowUpdateForm((s) => !s)}>{Icon.plus} {t("submitUpdate")}</Btn>}
                      </div>
                    </div>
                    {showUpdateForm && <FactoryUpdateForm dev={dev} onSave={saveUpdate} onCancel={() => setShowUpdateForm(false)} />}
                    {/* Supplier confirmation — shown only if supplier hasn't confirmed yet */}
                    {isSupplier && !dev.status_history?.some(h => h.status === "supplier_confirmed") && !dev.updates?.length && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h4 className="font-semibold text-emerald-800 text-base">New Development Received</h4>
                        <p className="text-sm text-emerald-700">Please confirm you have received this development request and that you will start working on it.</p>
                        <Btn variant="amber" onClick={async () => {
                          const confirmEntry = {
                            status: "supplier_confirmed",
                            changed_by: currentUser?.full_name || "Supplier",
                            changed_at: new Date().toISOString(),
                            label: "Supplier confirmed receipt & started process",
                          };
                          const newHistory = [...(dev.status_history || []), confirmEntry];
                          await db.upsertDev({ ...dev, status: "open", status_history: newHistory, updates: undefined, messages: undefined });
                          setDevs(p => p.map(d => d.id === devId ? { ...d, status: "open", status_history: newHistory } : d));
                          showToast("✅ Confirmed! You can now submit updates.");
                          // Notify admin + team member + assigned user
                          if (pushNotifToMany) {
                            const recipientIds = [
                              ...users.filter(u => u.role === "admin").map(u => u.id),
                              dev.team_member_id,
                              dev.assigned_user_id,
                            ].filter(id => id && id !== currentUser?.id);
                            await pushNotifToMany(recipientIds, "supplierConfirmed", {
                              title: dev.title || "",
                              factory: dev.factory_names?.[0] || currentUser?.factory_name || "Supplier",
                            }, devId, "dev");
                          }
                        }} className="mx-auto">
                          ✅ Confirm Receipt & Start Process
                        </Btn>
                      </div>
                    )}
                    {isSupplier && dev.status_history?.some(h => h.status === "supplier_confirmed") && !dev.updates?.length && (
                      <p className="text-center text-slate-400 text-sm py-8">{t("noUpdateYet")}</p>
                    )}
                    {!isSupplier && (!dev.updates || dev.updates.length === 0) && (
                      <p className="text-center text-slate-400 text-sm py-8">No factory updates yet.</p>
                    )}
                    {dev.updates?.map((u) => <UpdateCard key={u.id} update={u} isSupplier={isSupplier} onEditStep={handleEditStep} />)}
                  </div>
                )}
                {activeTab === "chat" && <DevChat devId={devId} dev={dev} setDevs={setDevs} currentUser={currentUser} users={users} pushNotifToMany={pushNotifToMany} />}
                {activeTab === "history" && (
                  <div className="p-5 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">{t("statusHistory")}</h4>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200" />
                      {/* Step 1: Created */}
                      <div className="flex items-start gap-3 pl-8 relative pb-4">
                        <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-400 border-2 border-white" />
                        <div className="flex-1 bg-blue-50 rounded-xl p-3 border border-blue-100">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Development Created</span>
                            <span className="text-xs text-slate-400 whitespace-nowrap">{fmtDate(dev.created_date)}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">by {dev.team_member_name || "Unknown"}</p>
                        </div>
                      </div>
                      {/* Remaining history entries — skip internal admin_viewed entries */}
                      {[...(dev.status_history || [])].filter(h => h.status !== "admin_viewed").map((h, i) => {
                        const colors = {
                          open: "bg-blue-100 text-blue-700",
                          pending: "bg-slate-100 text-slate-600",
                          in_progress: "bg-amber-100 text-amber-700",
                          completed: "bg-green-100 text-green-700",
                          cancelled: "bg-red-100 text-red-700",
                          supplier_confirmed: "bg-emerald-100 text-emerald-700",
                          update_submitted: "bg-purple-100 text-purple-700",
                          admin_viewed: "bg-sky-100 text-sky-700",
                        };
                        const dotColor = h.status === "supplier_confirmed" ? "bg-emerald-400"
                          : h.status === "update_submitted" ? "bg-purple-400"
                          : h.status === "admin_viewed" ? "bg-sky-400"
                          : "bg-slate-400";
                        const label = h.label || DEV_STATUS_LABEL()[h.status] || h.status;
                        return (
                          <div key={i} className="flex items-start gap-3 pl-8 relative pb-4">
                            <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full ${dotColor} border-2 border-white`} />
                            <div className="flex-1 bg-slate-50 rounded-xl p-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[h.status] || "bg-slate-100 text-slate-600"}`}>
                                  {label}
                                </span>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{fmtDate(h.changed_at, true)}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">by {h.changed_by}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            </div>
            <div className="space-y-4">
              <Card className="shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-3 text-sm uppercase tracking-wide">Details</h3>
                <div className="space-y-3">
                  {[["Item", dev.title], ["Size", dev.size], ["Weight", dev.weight], ["Material", dev.material],
                    [t("factoriesLabel"), dev.factory_names?.join(", ")], [t("teamMemberLabel"), dev.team_member_name], [t("createdLabel"), fmtDate(dev.created_date)]
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <div key={label}>
                      <label className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</label>
                      <p className="text-sm text-slate-800 mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
              </Card>
              {!isSupplier && (dev.internal_estimated_date || dev.internal_estimated_price || dev.internal_notes || dev.assigned_user_name) && (
                <Card className="shadow-sm p-5 border-l-4 border-l-amber-400">
                  <h3 className="font-semibold text-amber-800 border-b border-amber-100 pb-2 mb-3 text-sm uppercase tracking-wide">🔒 Internal Info</h3>
                  <div className="space-y-3">
                    {dev.internal_estimated_date && (
                      <div><label className="text-xs text-amber-700 uppercase tracking-wide font-medium">Target Date</label>
                        <p className="text-sm text-amber-900 mt-0.5">{fmtDate(dev.internal_estimated_date)}</p></div>
                    )}
                    {dev.internal_estimated_price && (
                      <div><label className="text-xs text-amber-700 uppercase tracking-wide font-medium">Target Price</label>
                        <p className="text-sm text-amber-900 mt-0.5">¥{parseFloat(dev.internal_estimated_price).toFixed(2)}</p></div>
                    )}
                    {dev.assigned_user_name && (
                      <div><label className="text-xs text-amber-700 uppercase tracking-wide font-medium">User In Charge</label>
                        <p className="text-sm text-amber-900 mt-0.5">{dev.assigned_user_name}</p></div>
                    )}
                    {dev.internal_notes && (
                      <div><label className="text-xs text-amber-700 uppercase tracking-wide font-medium">Internal Notes</label>
                        <p className="text-sm text-amber-900 mt-0.5 whitespace-pre-wrap">{dev.internal_notes}</p></div>
                    )}
                  </div>
                </Card>
              )}
              {dev.special_remarks && (
                <Card className="shadow-sm p-5 border-l-4 border-l-purple-400">
                  <h3 className="font-semibold text-purple-800 border-b border-purple-100 pb-2 mb-3 text-sm uppercase tracking-wide">{t("specialRemarksLabel")}</h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{dev.special_remarks}</p>
                </Card>
              )}
              {dev.artwork_files?.length > 0 && (
                <Card className="shadow-sm p-5 border-l-4 border-l-indigo-400">
                  <h3 className="font-semibold text-indigo-800 border-b border-indigo-100 pb-2 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Artwork Files ({dev.artwork_files.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {dev.artwork_files.map((f, i) => {
                      const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f.name);
                      const isPdf = /\.pdf$/i.test(f.name);
                      return (
                        <a key={i} href={f.url} target="_blank" rel="noreferrer"
                          className="group flex flex-col items-center gap-1.5 p-2 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors">
                          {isImage
                            ? <img src={f.url} alt={f.name} className="w-full h-16 object-cover rounded-lg border border-indigo-100" />
                            : isPdf
                              ? <PdfThumbnail url={f.url} height={64} />
                              : <div className="w-full h-16 flex flex-col items-center justify-center bg-indigo-100 rounded-lg gap-0.5">
                                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                  <span className="text-xs font-bold uppercase text-indigo-400">{f.name.split('.').pop().toUpperCase()}</span>
                                </div>
                          }
                          <span className="text-xs text-indigo-700 w-full text-center font-medium line-clamp-2 leading-tight">{f.name}</span>
                          <span className="text-xs text-indigo-400 group-hover:text-indigo-600">Tap to open ↗</span>
                        </a>
                      );
                    })}
                  </div>
                </Card>
              )}
              {isSupplier ? (
                <>
                  <Card className="shadow-sm p-5">
                    <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-3 text-sm uppercase tracking-wide">{t("sellerContactLabel")}</h3>
                    {(() => {
                      const seller = getUser(dev.team_member_id);
                      return seller ? (
                        <div className="flex items-start gap-3 py-2">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">{Icon.user}</div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{seller.chinese_name || seller.full_name}</p>
                            {seller.chinese_name && <p className="text-xs text-slate-400">{seller.full_name}</p>}
                            {seller.email && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">{Icon.mail} {seller.email}</p>}
                            {seller.wechat_id ? <p className="text-xs text-green-600 font-mono mt-0.5 flex items-center gap-1">{Icon.wechat} {seller.wechat_id}</p>
                              : <p className="text-xs text-red-400 mt-0.5">⚠ No WeChat ID</p>}
                          </div>
                        </div>
                      ) : <p className="text-xs text-slate-400">No seller assigned</p>;
                    })()}
                  </Card>
                </>
              ) : (
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
              )}
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
  const isFirstUpdate = !dev.updates?.length;
  const today = getChinaTodayStr();
  const [form, setForm] = useState({
    factory_id: dev.factory_ids?.[0] || "", factory_name: dev.factory_names?.[0] || "",
    type: "progress", production_steps: {}, estimated_finish_date: "",
    supplier_price: "", notes: "", progress_pictures: [],
  });
  const [stepError, setStepError] = useState("");
  const [dateErrors, setDateErrors] = useState({});

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleStep = (stepId) => {
    setForm(p => {
      const steps = { ...p.production_steps };
      if (steps[stepId]) {
        delete steps[stepId];
      } else {
        steps[stepId] = { checked: true, est_date: "" };
      }
      return { ...p, production_steps: steps };
    });
  };

  const setStepDate = (stepId, date) => {
    // Validate: step date can't be before today
    const errors = { ...dateErrors };
    if (date && date < today) {
      errors[stepId] = "Date can't be in the past";
    } else {
      delete errors[stepId];
    }
    setDateErrors(errors);
    setForm(p => ({
      ...p,
      production_steps: { ...p.production_steps, [stepId]: { ...p.production_steps[stepId], est_date: date } }
    }));
  };

  const setFinishDate = (date) => {
    const errors = { ...dateErrors };
    if (date && date < today) {
      errors["finish"] = "Finish date can't be in the past";
    } else {
      // Check it's not earlier than any checked step date
      const stepDates = Object.values(form.production_steps).map(s => s.est_date).filter(Boolean);
      const latestStep = stepDates.length ? stepDates.sort().at(-1) : null;
      if (date && latestStep && date < latestStep) {
        errors["finish"] = `Finish date can't be before step date (${latestStep})`;
      } else {
        delete errors["finish"];
      }
    }
    setDateErrors(errors);
    set("estimated_finish_date", date);
  };

  const addImages = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        const url = await uploadImage(file);
        setForm((p) => ({ ...p, progress_pictures: [...p.progress_pictures, url] }));
      } catch (err) { alert("Upload failed: " + (err.message || err)); }
    }
  };

  const handleSubmit = (markComplete) => {
    const checkedSteps = Object.keys(form.production_steps);
    if (checkedSteps.length === 0) { setStepError("Please tick at least one production step."); return; }
    if (Object.keys(dateErrors).length > 0) return;
    setStepError("");
    onSave({ ...form, mark_complete: markComplete });
  };

  const checkedCount = Object.keys(form.production_steps).length;

  return (
    <div className="bg-white border-2 border-purple-100 rounded-2xl overflow-hidden shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-4">
        <h4 className="text-white font-semibold text-base">Submit Production Update</h4>
        <p className="text-purple-200 text-xs mt-0.5">{t("tickSteps")}</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Production Steps Checklist */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t("productionSteps")}</label>
            {checkedCount > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">{checkedCount} selected</span>}
          </div>
          {stepError && <p className="text-xs text-red-500 mb-2">{stepError}</p>}
          <div className="space-y-2">
            {PRODUCTION_STEPS.map(step => {
              const isChecked = !!form.production_steps[step.id];
              const stepData = form.production_steps[step.id];
              return (
                <div key={step.id} className={`rounded-xl border-2 transition-all ${isChecked ? "border-purple-300 bg-purple-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"}`}>
                  <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer" onClick={() => toggleStep(step.id)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isChecked ? "bg-purple-600 border-purple-600" : "border-slate-300 bg-white"}`}>
                      {isChecked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <span className="text-base mr-1">{step.icon}</span>
                    <span className={`text-sm font-medium flex-1 ${isChecked ? "text-purple-800" : "text-slate-600"}`}>{getStepLabel(step.id)}</span>
                  </div>
                  {isChecked && (
                    <div className="px-3 pb-3">
                      <div className="ml-8">
                        <label className="text-xs text-purple-600 font-medium mb-1 block">{globalLang === "zh" ? "该步骤预计完成日期" : "Estimated completion date for this step"}</label>
                        <input type="date" min={today} value={stepData?.est_date || ""}
                          onChange={e => setStepDate(step.id, e.target.value)}
                          className="w-full px-3 py-1.5 border border-purple-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-purple-400" />
                        {dateErrors[step.id] && <p className="text-xs text-red-500 mt-1">{dateErrors[step.id]}</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Est. Finish Date + Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{t("estOverallFinish")}</label>
            <input type="date" min={today} value={form.estimated_finish_date}
              onChange={e => setFinishDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-purple-400" />
            {dateErrors["finish"] && <p className="text-xs text-red-500 mt-1">{dateErrors["finish"]}</p>}
          </div>
          {isFirstUpdate && (
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{t("supplierPrice")}</label>
              <input type="number" value={form.supplier_price} onChange={e => set("supplier_price", e.target.value)}
                placeholder="0.00" step="0.01"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-purple-400" />
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{t("additionalNotes")}</label>
          <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
            placeholder={globalLang === "zh" ? "任何附加信息…" : "Any additional information…"} rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-purple-400" />
        </div>

        {/* Progress Photos */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{t("progressPhotos")}</label>
          <label className="flex items-center justify-center h-10 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all">
            <input type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
<span className="flex items-center gap-2 text-sm text-slate-500">{Icon.upload} {globalLang === "zh" ? "添加照片" : "Add photos"}</span>
          </label>
          {form.progress_pictures.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {form.progress_pictures.map((p, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden"><img src={p} alt="" className="w-full h-full object-cover" /></div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
          <Btn variant="outline" size="sm" onClick={onCancel}>Cancel</Btn>
          <Btn variant="purple" size="sm" onClick={() => handleSubmit(false)}>{Icon.check} {t("submitUpdate")}</Btn>
          <Btn variant="ghost" size="sm" className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
            onClick={() => handleSubmit(true)}>{t("submitMarkComplete")}</Btn>
        </div>
      </div>
    </div>
  );
}

function PdfThumbnail({ url, height = 80 }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | done | error

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        const pdf = await window.pdfjsLib.getDocument(url).promise;
        if (cancelled) return;
        const page = await pdf.getPage(1);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: 1 });
        const scale = height / viewport.height;
        const scaled = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.height = scaled.height;
        canvas.width = scaled.width;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: scaled }).promise;
        if (!cancelled) setStatus("done");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    render();
    return () => { cancelled = true; };
  }, [url]);

  if (status === "error") return (
    <div className="w-full flex flex-col items-center justify-center bg-red-50 rounded-lg gap-1" style={{ height }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <span className="text-xs font-bold text-red-400">PDF</span>
    </div>
  );

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-slate-100" style={{ height }}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full object-contain" style={{ display: status === "done" ? "block" : "none" }} />
    </div>
  );
}

function UpdateCard({ update, isSupplier, onEditStep }) {
  const [lightbox, setLightbox] = useState(null);
  const steps = update.production_steps || {};
  const checkedSteps = Object.entries(steps);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
        <span className="text-xs text-slate-400">{fmtDate(update.created_date)}</span>
        {update.notes && <span className="text-xs text-slate-500 italic truncate max-w-[60%]">{update.notes}</span>}
      </div>
      <div className="p-3 space-y-2">
        {checkedSteps.length > 0 && (
          <div>
            <div className="space-y-1.5">
              {checkedSteps.map(([id, s]) => {
                const step = PRODUCTION_STEPS.find(p => p.id === id);
                if (!step) return null;
                const dl = daysLeft(s.est_date);
                const isOverdue = s.est_date && Math.ceil((parseLocalDate(s.est_date) - getChinaNow()) / 86400000) < 0;
                const isDueToday = s.est_date && Math.ceil((parseLocalDate(s.est_date) - getChinaNow()) / 86400000) === 0;
                const isDone = s.completed;
                return (
                  <div key={id} className={`rounded-lg border px-3 py-2 ${isDone ? "bg-green-50 border-green-200" : isOverdue ? "bg-red-50 border-red-200" : isDueToday ? "bg-amber-50 border-amber-200" : "bg-purple-50 border-purple-100"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${isDone ? "bg-green-500" : "bg-purple-600"}`}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span className="text-xs mr-0.5">{step.icon}</span>
                        <span className={`text-sm font-medium ${isDone ? "text-green-800 line-through opacity-70" : isOverdue ? "text-red-800" : "text-purple-800"}`}>{getStepLabel(step.id)}</span>
                        {isDone && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">{t("done")}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {s.est_date && !isDone && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${isOverdue ? "bg-red-100 text-red-600" : isDueToday ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"}`}>
                            {dl}
                          </span>
                        )}
                        {s.est_date && isDone && (
                          <span className="text-xs text-green-600">{fmtDate(s.est_date)}</span>
                        )}
                        {isSupplier && onEditStep && !isDone && (
                          <button onClick={() => onEditStep(update, id, s)}
                            className="text-xs text-slate-400 hover:text-purple-600 px-1.5 py-0.5 rounded hover:bg-purple-50 transition-colors">
                            Edit
                          </button>
                        )}
                        {isSupplier && onEditStep && !isDone && (
                          <button onClick={() => onEditStep(update, id, s, true)}
                            className="text-xs text-green-600 hover:text-green-800 px-1.5 py-0.5 rounded hover:bg-green-50 border border-green-200 transition-colors font-medium">
                            {t("done")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Dates + Price */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {update.estimated_finish_date && <div><label className="text-xs text-slate-500 uppercase tracking-wide">{globalLang === "zh" ? "预计完成" : "Est. Finish"}</label><p className="font-medium text-slate-700 mt-0.5">{fmtDate(update.estimated_finish_date)}</p></div>}
          {update.supplier_price && <div><label className="text-xs text-slate-500 uppercase tracking-wide">{globalLang === "zh" ? "价格" : "Price"}</label><p className="font-medium text-slate-700 mt-0.5">¥{update.supplier_price}</p></div>}
        </div>
        {/* Legacy fields for old updates */}
        {update.production_status && <div><label className="text-xs text-slate-500 uppercase tracking-wide">{globalLang === "zh" ? "生产状态" : "Production Status"}</label><p className="text-sm text-slate-700 mt-0.5">{update.production_status}</p></div>}
        {update.materials_status && !checkedSteps.length && <div><label className="text-xs text-slate-500 uppercase tracking-wide">{globalLang === "zh" ? "材料" : "Materials"}</label><p className="text-sm text-slate-700 mt-0.5">{MAT_LABEL[update.materials_status] || update.materials_status}</p></div>}
        {update.notes && <div><label className="text-xs text-slate-500 uppercase tracking-wide">{globalLang === "zh" ? "备注" : "Notes"}</label><p className="text-sm text-slate-700 mt-0.5">{update.notes}</p></div>}
        {update.progress_pictures?.length > 0 && (
          <div className="grid grid-cols-4 gap-1.5">
            {update.progress_pictures.map((p, i) => (
              <div key={i} className="rounded aspect-square overflow-hidden">
                <img src={p} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setLightbox(p)} />
              </div>
            ))}
          </div>
        )}
      </div>
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition-colors">✕</button>
        </div>
      )}
    </div>
  );
}

function DevChat({ devId, dev, setDevs, currentUser, users = [], pushNotifToMany }) {
  const messages = dev.messages || [];
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const isSupplier = currentUser?.role === "supplier";
  const isAdmin    = currentUser?.role === "admin";

  // Mark messages as read when chat is opened OR when new messages arrive
  useEffect(() => {
    if (!currentUser?.full_name) return;
    db.markMessagesRead(devId, currentUser?.full_name).then(() => {
      db.getDevs().then(setDevs);
    });
  }, [devId, messages.length]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  async function send() {
    const trimmed = text.trim(); if (!trimmed) return;
    const record = {
      id: genId("MSG"), development_id: devId,
      sender_name: currentUser?.full_name || "Unknown",
      sender_role: currentUser?.role || "user",
      message: trimmed,
      read_by: [currentUser?.full_name],
    };
    const saved = await db.insertMessage(record);
    if (saved) {
      setDevs((p) => p.map((d) => d.id === devId ? { ...d, messages: [...(d.messages || []), saved] } : d));
      // Notify everyone involved except the sender
      if (pushNotifToMany) {
        const recipientIds = [
          ...users.filter(u => u.role === "admin").map(u => u.id),
          dev.team_member_id,
          dev.assigned_user_id,
          // supplier user for this dev's factory
          ...users.filter(u => u.role === "supplier" && dev.factory_ids?.includes(u.factory_id)).map(u => u.id),
        ].filter(id => id && id !== currentUser?.id);
        await pushNotifToMany(recipientIds, "newMsg", {
          sender: currentUser?.full_name || "Someone",
          devTitle: dev.title || "",
          preview: trimmed.slice(0, 40),
        }, devId, "chat");
      }
    }
    setText("");
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 280 }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
        {messages.length === 0
          ? <p className="text-center text-slate-400 text-sm py-8">{t("noMessages")}</p>
          : messages.map((msg) => {
              const isOwn = msg.sender_name === currentUser?.full_name;
              // Read receipt: message is "read" if a non-admin from the other side has read it
              const readBy = msg.read_by || [];
              const isReadByOther = isOwn && readBy.some(name => name !== currentUser?.full_name);
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
                    <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : ""}`}>
                      <p className={`text-xs opacity-60`}>{fmtDate(msg.created_date, true)}</p>
                      {isOwn && (
                        <span className={`text-xs ${isReadByOther ? "text-blue-400" : "opacity-40 text-white"}`}>
                          {isReadByOther ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
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
          placeholder={t("typeMessage")} rows={2}
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
function FactoriesPage({ dark, factories, setFactories, currentUser, devs = [], visits = [], showToast, askConfirm, users = [], pushNotifToMany }) {
  const [showForm, setShowForm]           = useState(false);
  const [editingFactory, setEditingFactory] = useState(null);
  const [search, setSearch]               = useState("");
  const isAdmin = currentUser?.role === "admin";
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "user";

  const filtered = factories.filter((f) =>
    !search || [f.name, f.address, f.contact_person].some((x) => x?.toLowerCase().includes(search.toLowerCase()))
  );

  async function save(data) {
    const isNew = !data.id;
    const record = isNew ? { ...data, id: genId("F") } : data;
    const saved = await db.upsertFactory(record);
    if (saved) setFactories((p) => isNew ? [...p, saved] : p.map((f) => f.id === saved.id ? saved : f));
    showToast(isNew ? t("factoryAdded") : t("infoEdited"));
    setShowForm(false); setEditingFactory(null);
    if (pushNotifToMany) {
      const otherAdminIds = users.filter(u => u.role === "admin" && u.id !== currentUser?.id).map(u => u.id);
      await pushNotifToMany(otherAdminIds, isNew ? "factoryAdded" : "infoEdited", { name: saved.name || "" }, null, "factory");
    }
  }

  async function del(id) {
    const factory = factories.find(f => f.id === id);
    askConfirm("Delete this factory? This cannot be undone.", async () => {
      await db.deleteFactory(id);
      setFactories((p) => p.filter((f) => f.id !== id));
      showToast(t("deleteFactory"));
      if (pushNotifToMany) {
        const otherAdminIds = users.filter(u => u.role === "admin" && u.id !== currentUser?.id).map(u => u.id);
        await pushNotifToMany(otherAdminIds, "factoryDeleted", { name: factory?.name || "" }, null, "factory");
      }
    });
  }

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gradient-to-br from-slate-50 to-amber-50/30"}`}>
      <div className="bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div><h1 className="text-xl font-bold">{t("factories")}</h1><p className="text-slate-400 mt-0.5 text-xs">{t("manageFactories")}</p></div>
            {isAdmin && <Btn variant="amber" size="lg" onClick={() => { setEditingFactory(null); setShowForm(true); }}>{Icon.plus} {t("addFactory")}</Btn>}
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 mt-3 inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">{Icon.building}</div>
            <div><p className="text-2xl font-bold">{factories.length}</p><p className="text-slate-300 text-xs">{t("totalFactories")}</p></div>
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
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchFactories")} className="pl-11" />
            </div>
            {filtered.length === 0
              ? <EmptyState icon={Icon.building} title="No factories found" subtitle="Add your first factory"
                  action={isAdmin ? <Btn variant="amber" onClick={() => setShowForm(true)}>{Icon.plus} {t("addFactory")}</Btn> : null} />
              : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((f) => {
                    const fDevs    = devs.filter(d => d.factory_ids?.includes(f.id));
                    const fVisits  = visits.filter(v => v.factory_id === f.id);
                    const completed = fDevs.filter(d => d.status === "completed").length;
                    const active    = fDevs.filter(d => d.status === "open" || d.status === "in_progress").length;
                    const compRate  = fDevs.length > 0 ? Math.round((completed / fDevs.length) * 100) : null;
                    return (
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
                        {canEdit && (
                          <div className="flex gap-1 ml-2">
                            <Btn variant="ghost" size="sm" onClick={() => { setEditingFactory(f); setShowForm(true); }}>{Icon.edit}</Btn>
                            {isAdmin && <Btn variant="ghost" size="sm" onClick={() => del(f.id)}>{Icon.trash}</Btn>}
                          </div>
                        )}
                      </div>
                      {(fDevs.length > 0 || fVisits.length > 0) && (
                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <p className="text-lg font-bold text-slate-800">{fDevs.length}</p>
                            <p className="text-xs text-slate-500">Total Devs</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-amber-600">{active}</p>
                            <p className="text-xs text-slate-500">Active</p>
                          </div>
                          <div className="text-center">
                            <p className={`text-lg font-bold ${compRate >= 70 ? "text-green-600" : compRate >= 40 ? "text-amber-600" : "text-slate-600"}`}>
                              {compRate !== null ? `${compRate}%` : "—"}
                            </p>
                            <p className="text-xs text-slate-500">Completion</p>
                          </div>
                          {fVisits.length > 0 && (
                            <div className="col-span-3 mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                              {fVisits.length} visit{fVisits.length > 1 ? "s" : ""} logged
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                    );
                  })}
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
      footer={<><Btn variant="outline" onClick={onCancel}>Cancel</Btn><Btn variant="dark" disabled={!form.name} onClick={() => onSave(form)}>{Icon.check} {isEdit ? t("updateFactory") : t("addFactory")}</Btn></>}>
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
      <div><Label>{t("notes")}</Label><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Additional notes…" rows={2} /></div>
    </FormCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────────────────
function UsersPage({ dark, users, setUsers, factories, currentUser, showToast, askConfirm, pushNotif }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState("");
  const [editChineseName, setEditChineseName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole]   = useState("");
  const [editFactory, setEditFactory] = useState("");
  const [editWechat, setEditWechat]   = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName]         = useState("");
  const [newEmail, setNewEmail]       = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole]         = useState("user");
  const [addingUser, setAddingUser]   = useState(false);
  const [usersTab, setUsersTab]       = useState("active");
  const notAdmin = currentUser?.role !== "admin";

  const pendingUsers  = users.filter(u => u.status === "pending");
  const blockedUsers  = users.filter(u => u.status === "blocked");
  const activeUsers   = users.filter(u => u.status !== "pending" && u.status !== "blocked");

  // Notify this admin about pending users they haven't been notified about yet
  const notifiedPendingRef = useRef(new Set());
  useEffect(() => {
    if (!currentUser?.id || currentUser.role !== "admin" || !pushNotif) return;
    // Only notify about pending users we haven't already notified in DB
    (async () => {
      for (const u of pendingUsers) {
        if (notifiedPendingRef.current.has(u.id)) continue;
        notifiedPendingRef.current.add(u.id);
        // Check if a pending notif for this user already exists to avoid duplicates
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("recipient_id", currentUser.id)
          .eq("msg_key", "pending")
          .eq("read", false)
          .filter("msg_data->>email", "eq", u.email)
          .maybeSingle();
        if (!existing) {
          pushNotif(currentUser.id, "pending", { name: u.full_name, email: u.email }, null, "pending");
        }
      }
    })();
  }, [pendingUsers.map(u => u.id).join(",")]);

  async function approveUser(u) {
    const saved = await db.approveUser(u.id);
    if (saved) setUsers(p => p.map(x => x.id === u.id ? { ...x, status: "approved" } : x));
    showToast(`✓ ${u.full_name} approved — they can now log in.`);
    if (pushNotif) {
      const otherAdminIds = users.filter(x => x.role === "admin" && x.id !== currentUser?.id).map(x => x.id);
      otherAdminIds.forEach(id => pushNotif(id, "userApproved", { name: u.full_name, email: u.email }, null, "pending"));
    }
  }

  async function rejectUser(u) {
    askConfirm(`Reject ${u.full_name}? They will not be able to log in.`, async () => {
      await db.deleteUser(u.id); // sets status = blocked
      setUsers(p => p.filter(x => x.id !== u.id));
      showToast(`${u.full_name} rejected.`);
      if (pushNotif) {
        const otherAdminIds = users.filter(x => x.role === "admin" && x.id !== currentUser?.id).map(x => x.id);
        otherAdminIds.forEach(id => pushNotif(id, "userRejected", { name: u.full_name, email: u.email }, null, "pending"));
      }
    });
  }

  function startEdit(u) {
    setEditingId(u.id); setEditName(u.full_name || ""); setEditChineseName(u.chinese_name || ""); setEditEmail(u.email || "");
    setEditRole(u.role || "user"); setEditFactory(u.factory_id || ""); setEditWechat(u.wechat_id || "");
  }

  async function saveEdit(u) {
    const fac = factories.find((f) => f.id === editFactory);
    const updated = { ...u, full_name: editName, chinese_name: editChineseName, email: editEmail, role: editRole,
      factory_id: editRole === "supplier" ? editFactory : null,
      factory_name: editRole === "supplier" ? fac?.name : null, wechat_id: editWechat };
    const saved = await db.upsertUser(updated);
    if (saved) setUsers((p) => p.map((x) => x.id === u.id ? saved : x));
    setEditingId(null); showToast("User updated");
    // Notify other admins if role changed
    if (pushNotif && u.role !== editRole) {
      const otherAdminIds = users.filter(x => x.role === "admin" && x.id !== currentUser?.id).map(x => x.id);
      otherAdminIds.forEach(id => pushNotif(id, "userRoleChanged", {
        name: editName, oldRole: u.role, newRole: editRole,
      }, null, "pending"));
    }
  }

  async function deleteUser(id) {
    if (id === currentUser?.id) { showToast("⚠ Cannot block yourself", "error"); return; }
    const target = users.find(u => u.id === id);
    askConfirm("Block this user? They will not be able to log in until unblocked.", async () => {
      await db.deleteUser(id);
      setUsers((p) => p.map((u) => u.id === id ? { ...u, status: "blocked" } : u));
      showToast("User blocked — they can no longer log in.");
      if (pushNotif && target) {
        const otherAdminIds = users.filter(u => u.role === "admin" && u.id !== currentUser?.id).map(u => u.id);
        otherAdminIds.forEach(adminId => pushNotif(adminId, "userBlocked", {
          name: target.full_name, email: target.email,
        }, null, "pending"));
      }
    });
  }

  async function unblockUser(u) {
    const saved = await db.approveUser(u.id);
    if (saved) setUsers(p => p.map(x => x.id === u.id ? { ...x, status: "approved" } : x));
    showToast(`✓ ${u.full_name} unblocked — they can now log in again.`);
    if (pushNotif) {
      const otherAdminIds = users.filter(x => x.role === "admin" && x.id !== currentUser?.id).map(x => x.id);
      otherAdminIds.forEach(id => pushNotif(id, "userUnblocked", { name: u.full_name, email: u.email }, null, "pending"));
    }
  }

  async function permanentlyDeleteUser(u) {
    if (u.id === currentUser?.id) { showToast("⚠ Cannot delete yourself", "error"); return; }
    askConfirm(`Permanently delete ${u.full_name}? This removes them from the app and Supabase Auth completely.`, async () => {
      const { error } = await supabase.rpc("delete_user_completely", { user_email: u.email });
      if (error) {
        await db.deleteUser(u.id);
        setUsers(p => p.map(x => x.id === u.id ? { ...x, status: "blocked" } : x));
        showToast("⚠ Could not delete from Auth — user blocked instead. Run the SQL function first.", "error");
      } else {
        setUsers(p => p.filter(x => x.id !== u.id));
        showToast(`✓ ${u.full_name} permanently deleted.`);
        if (pushNotif) {
          const otherAdminIds = users.filter(x => x.role === "admin" && x.id !== currentUser?.id).map(x => x.id);
          otherAdminIds.forEach(adminId => pushNotif(adminId, "userDeleted", {
            name: u.full_name, email: u.email, action: "deleted",
          }, null, "pending"));
        }
      }
    });
  }

  async function addUser() {
    if (!newName || !newEmail || !newPassword) { showToast("Please fill all fields", "error"); return; }
    if (newPassword.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    setAddingUser(true);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: newEmail, password: newPassword, options: { data: { full_name: newName } }
    });
    // If auth signup fails because email already exists in Auth, we can still
    // create/restore the users table row so the person can be managed in the app
    if (signUpError && !signUpError.message?.toLowerCase().includes("already")) {
      showToast("Error: " + signUpError.message, "error"); setAddingUser(false); return;
    }
    // Use the existing auth user's id if available, otherwise generate one
    const authId = signUpData?.user?.id;
    const newUser = {
      id: authId ? "U-" + authId.slice(0, 8).toUpperCase() : genId("U"),
      full_name: newName, email: newEmail, role: newRole, status: "approved"
    };
    const saved = await db.upsertUser(newUser);
    if (saved) setUsers((p) => [...p.filter(u => u.email !== newEmail), saved]);
    setShowAddUser(false); setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("user");
    setAddingUser(false);
    showToast(`✓ User ${newName} added — they can now log in.`);
    if (pushNotif) {
      const otherAdminIds = users.filter(x => x.role === "admin" && x.id !== currentUser?.id).map(x => x.id);
      otherAdminIds.forEach(id => pushNotif(id, "userAdded", { name: newName, email: newEmail, role: newRole }, null, "pending"));
    }
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) showToast("Error: " + error.message, "error");
    else showToast(`Password reset email sent to ${email}`);
  }

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}>
      <div className="bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">{Icon.users}</div>
              <div><h1 className="text-xl font-bold">User Management</h1><p className="text-slate-400 mt-0.5 text-xs">Manage users, roles, and supplier assignments</p></div>
            </div>
            {!notAdmin && <Btn variant="amber" onClick={() => setShowAddUser(s => !s)}>{Icon.plus} {t("addUser")}</Btn>}
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Admins",    count: users.filter(u => u.role === "admin" && u.status !== "blocked").length,    color: "bg-purple-500/20 border-purple-500/30", text: "text-purple-200" },
              { label: "Users",     count: users.filter(u => u.role === "user" && u.status !== "blocked").length,     color: "bg-blue-500/20 border-blue-500/30",     text: "text-blue-200" },
              { label: "Suppliers", count: users.filter(u => u.role === "supplier" && u.status !== "blocked").length, color: "bg-orange-500/20 border-orange-500/30", text: "text-orange-200" },
              { label: "Viewers",   count: users.filter(u => u.role === "viewer" && u.status !== "blocked").length,   color: "bg-teal-500/20 border-teal-500/30",     text: "text-teal-200" },
              { label: "Blocked",   count: blockedUsers.length, color: "bg-red-500/20 border-red-500/30",   text: "text-red-200" },
            ].map(({ label, count, color, text }) => (
              <div key={label} className={`rounded-xl p-4 border ${color}`}>
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className={`text-xs mt-0.5 ${text}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {notAdmin && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <span className="text-orange-500 flex-shrink-0">{Icon.alert}</span>
            <p className="text-sm text-orange-800 font-medium">Read-only view. Only administrators can edit users.</p>
          </div>
        )}
        {pendingUsers.length > 0 && !notAdmin && (
          <div className="mb-6 bg-orange-50 border-2 border-orange-300 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⏳</span>
              <span className="text-orange-700 font-bold text-base">{pendingUsers.length} Account Request{pendingUsers.length > 1 ? "s" : ""} Pending Approval</span>
            </div>
            <div className="space-y-3">
              {pendingUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800">{u.full_name}</p>
                    <p className="text-slate-500 text-xs">{u.email} · Requested access</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveUser(u)} className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors">✓ Approve</button>
                    <button onClick={() => rejectUser(u)} className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition-colors">✕ Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {showAddUser && !notAdmin && (
          <Card className="shadow-lg mb-6 p-6">
            <h3 className="font-semibold text-slate-800 mb-4 text-lg">Add New User</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label required>Full Name</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="John Smith" /></div>
              <div><Label required>Email</Label><Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="john@company.com" /></div>
              <div><Label required>Password</Label><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" /></div>
              <div><Label>Role</Label>
                <Select value={newRole} onChange={setNewRole}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="supplier">Supplier</option>
                  <option value="viewer">Viewer (Slideshow)</option>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Btn variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Btn>
              <Btn variant="dark" disabled={addingUser} onClick={addUser}>{addingUser ? "Creating..." : "Create User"}</Btn>
            </div>
          </Card>
        )}
        <Card className="shadow-lg overflow-hidden">
          <div className="p-5 border-b border-slate-100"><h2 className="font-semibold text-slate-800">Active Users ({activeUsers.length})</h2></div>
          <div className="divide-y divide-slate-100">
            {activeUsers.map((u) => (
              <div key={u.id} className="p-4 hover:bg-slate-50 transition-colors">
                {editingId === u.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-slate-500 font-medium mb-1 block">Full Name</label><Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" /></div>
                      <div><label className="text-xs text-slate-500 font-medium mb-1 block">Chinese Name</label><Input value={editChineseName} onChange={(e) => setEditChineseName(e.target.value)} placeholder="中文名" className="h-9" /></div>
                      <div><label className="text-xs text-slate-500 font-medium mb-1 block">Email</label><Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="email@company.com" className="h-9" /></div>
                      <div><label className="text-xs text-slate-500 font-medium mb-1 block">Role</label><Select value={editRole} onChange={setEditRole} className="h-9"><option value="admin">Admin</option><option value="user">User</option><option value="supplier">Supplier</option><option value="viewer">Viewer (Slideshow)</option></Select></div>
                      <div><label className="text-xs text-slate-500 font-medium mb-1 block">WeChat ID</label><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-600">{Icon.wechat}</span><Input value={editWechat} onChange={(e) => setEditWechat(e.target.value)} className="h-9 pl-7" /></div></div>
                      {editRole === "supplier" && <div><label className="text-xs text-slate-500 font-medium mb-1 block">Factory</label><Select value={editFactory} onChange={setEditFactory} className="h-9"><option value="">Select factory…</option>{factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</Select></div>}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Btn variant="outline" size="sm" onClick={() => setEditingId(null)}>{Icon.close} Cancel</Btn>
                      <Btn variant="dark" size="sm" onClick={() => saveEdit(u)}>{Icon.check} Save</Btn>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">{Icon.user}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm">{u.full_name || <span className="text-slate-400 italic">No name</span>}</span>
                        {u.chinese_name && <span className="text-slate-500 text-sm">· {u.chinese_name}</span>}
                        <Badge className={ROLE_CSS[u.role] || ROLE_CSS.user}>{u.role || "user"}</Badge>
                        {u.role === "supplier" && (u.factory_name
                          ? <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{u.factory_name}</span>
                          : <span className="text-xs text-red-400">No factory assigned</span>)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="text-xs text-slate-500 flex items-center gap-1">{Icon.mail} {u.email}</span>
                        {u.wechat_id
                          ? <span className="text-xs text-green-600 font-mono flex items-center gap-1">{Icon.wechat} {u.wechat_id}</span>
                          : <span className="text-xs text-slate-300">No WeChat</span>}
                      </div>
                    </div>
                    {!notAdmin && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Btn variant="ghost" size="sm" onClick={() => startEdit(u)}>{Icon.edit} Edit</Btn>
                        <Btn variant="ghost" size="sm" onClick={() => resetPassword(u.email)} className="text-blue-500 hover:text-blue-700">🔑 Reset</Btn>
                        <Btn variant="ghost" size="sm" onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700">🚫 Block</Btn>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {blockedUsers.length > 0 && !notAdmin && (
          <Card className="shadow-lg overflow-hidden border-red-100">
            <div className="p-5 border-b border-red-100 bg-red-50 flex items-center gap-2">
              <span className="text-red-500">🚫</span>
              <h2 className="font-semibold text-red-800">Blocked Users ({blockedUsers.length})</h2>
              <span className="text-xs text-red-500 ml-1">— cannot log in</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b border-red-100">
                  <tr>{["User", "Email", "Role", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-red-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-50">
                  {blockedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-red-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-400">{Icon.user}</div>
                          <span className="font-medium text-slate-500 text-sm">{u.full_name || <span className="italic">No name</span>}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">{Icon.mail} {u.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={ROLE_CSS[u.role] || ROLE_CSS.user}>{u.role || "user"}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Btn variant="ghost" size="sm" onClick={() => unblockUser(u)} className="text-green-600 hover:text-green-800">✓ Unblock</Btn>
                          <Btn variant="ghost" size="sm" onClick={() => permanentlyDeleteUser(u)} className="text-red-600 hover:text-red-800">🗑 Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
