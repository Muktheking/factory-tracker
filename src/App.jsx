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
