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
const LOKA_LOGO_SRC = "data:image/png;base64,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Aw9kUXh0efrvu+/+/PPPTJIURdmxfbvnuh1KSoxAAJdYeGLVJMn4g+BdhPobFRsA4BX86quvsihqVqBcQACkABrLu+++u337dtHF44eYWxsn+PgG5weRBEYgUFxcHAgEFFWNx2Ku45R07Ah79vsC7LKxl4xEIvF4/NNPP00v1b333rtt2zaMNxaLq6JbRKMEAASDwXA4bJqmrusdOnTo0qVLt27dOnfurOt6PB6vrKzknIdCIQDQNA0XNhRFAcZw3c9zXdu2wwUF69ate/nPr9QWI32SH8MwcJ0T3wMAGprQtRxPpqZpWGIPPUz85bLxlGJnJEadQoFxzhVV/fnnn9OfKKEAssikSZM2b94cCASqq6shMYPBg/LfDNi5FxYWopI2TRPnizhp03XdMAxUt4yxUCjEOUdvKLEj27Ji0SiTpO+/+y6LhiDueYqqAkA4HMYzDwDhgoKy0lLbtoW3rhEIoP8P/umfAUDiZlMURWTcwqnw+vXrsyVnVuCcUxwAACmAxvLTTz9BIq8czvdVVUWLJySsvYyx4uJiNOAcdthhxxx37JAhQ84759wXX36poqLiq6++evPNN7/95htJlsXDI34OAMA5moDQF9M0zXqforfffhtH6ziUBp8HC84DAEBRFOyhunbtevzxx//2t7/FfAOvvfbapk2b1q9fv2LFii1btjDGAoFALBZjjOFiJrCa9WpFVSVJisViruN8/fXXtcVIf1PhAgBuE41GcS+QiC3CfhNtCNznco42Zez3NU2Lx+P+fidp76Zprnpj9fBhp6SSIVU51UazeOkSXKQRCy1CMJQf3WbQmz4SiVRXV3ue17dv34MOOqhnz56SJP38889ffvkl5odAvRuNRiORCLoR43VEs6FlmjJ6E8ny22+/na1DkBVFkiRFVaurqmRFUVXVtix87zqO6zjAGDovYeSKfxlVXAvs9A3DwKsMiYns9u3bsyVntiAFQDSesrIyEUmLw0lcQYXERBhHwWVlZV26dBkzZszs2bPFb889+xzx/pjjjn333XdrBqTCKxEdabinKAp6Z2uaZppmvZaN77//nnNeXFy8a9cu4dDttyyh4QUADj/88A8//ND/29NOOw3fDBs27Omnn16xYgVGqKIDKOfc9VxcBwYAXL4eMnTooYceWlsMMeeoExQAR5HClRAtZpZlGYaxzz77HH744Z07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";
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
const FACTORY_ICON_SRC = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADpAPYDASIAAhEBAxEB/8QAHQABAQACAwEBAQAAAAAAAAAAAAgHCQMFBgEEAv/EAFcQAAAEAwMDDQsFDAoDAQAAAAABAgMEBQYHCBESITEJExg2UVZhcXR1kZSyFBciNzhBUrPB0dIyVGKBohUWIzM0QnKSlaGx0yQlNUVGVYKDhKNDU2Rl/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdfUM5lcglERNpzHMQUFDoNbrzyySlJFwmA7AB5OyutoS0CmDqOXQrzEA5EONwynSwN1CVYEvDzEY9YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADCFptsFROVI/Rdk1O/fDPYcsIyLXj3LBnuGfnV/DcGU67OcHS8YzIUYzF9OssrzYNmrMaz4ixPjwH5rOqQlVFU41KZY2RqP8ACRUQovwkS6edTiz85mePEAm2eT++BTqTmcTBS2aQxeEqHhYZpeSXDgkj/ePPbMCv5Sk2J/QEI3EIzLM0OtZ/rMWxm0bg6+aSKSzQjKZyiAjSP5xDoc7RGAhifXzLQ49Km5PJZPLjVmSomlOrL9YzL9w6qkqRtpvE1BDP1XMpkiQNOkp5+II22UF5ybbLBOUZZiPAXJDWd0HDRHdDFHSJDuOOUUC3mPoHpWWWmG0tMtobbSWCUoSRERcBEA66kpDLaYpuAkMpYSxBQLKWWkFuEWHSO0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAebtSnr9M2b1HUEJkd0S+WvxLOWWJZaG1GnHgxIhrxlFsdv9RxT5SGe1FMlo8NxuBh1O62RnmxJKTwIXVecf7nsFrFfpSx1H6xYe0ThqbkOk51VkRhoh2kfaxAY5+/m9Jhhk1x+zHfgH5plaNeWlsE7HTGJrGDhWSynXn4BxCEFjhiajRgWcxskyEbhDHF5lhL1hFXNkRf2eauhST9gDGVxi0uq68k0+hKqmKpi9AuoUy+4Xh5Kizke6KWEV6m68ZTSqofHSw0v7RF7RagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxLe/eOHu71WsjwNTCEfrOJL2iCrGrU63s17vOj2WF92ZJPm5C67o0cQuG/FEGxdxn6SPO67DI/70DGGp0SiCjKOqaKjIGFif6ehCTeaSsy/BlukAxlsqbbfm8F+zDHV1ZePteqGm5hJZrDwncMbDqZfyZdknkGWfP5hsM+4Mk/yaW9VR7h5y1KnpOuzSp0tymXoX9yYo0qTDIIyMmlYYHgAlDU3ni+/epmDPTLkqIuJxIuQhBWp2ua1a1O2ccMuVqLDicSL1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE/X+XtasBim/8A2x0OnocI/YOh1Opom7LJy7hhrszM+hOA/bqhr2t2LQbeP42atJw3cEqP2Dl1PxjW7E1u4fjZg6fQZkAo0dNXbevURPmfTlsQnpaUO5H4ahb12QzBr04V1PSgwEF3CXNZt3jWMcNcgX04cR4+wbAiGvG5E4TV5dDHptRiehCz9g2HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACWNUdiDRZpT8Nj+Mm5H0NLHrbh8PrN3yXOHpdi4hX/YY8DqkLx/ezS0Pjpjlrw4m1F7RlG5YyTF3ink4YZWur6VmYDM444lGuQ7jZ6FIMukhyAegBrmulK7jvYQjR5sX41HShY2MjXLYKXcN8ODRo/raIb6covaNjRAAAAAAAAAAAAAAAAAAAAAAAAAA/l5xtltTjq0toSWKlKPAiLhMTzbfempOitflVNJRUE6TinwVf0dlX0lFp4i6QFCOvss5JOutt5R4JylEWJjkI8dA1QWlWmV1Xk8anFSzaLXgvLhWkmbbLRY5shJZvr0jZ1ZXFREdZlS8ZFuqeiH5RCuOuKPE1qNpJmZnumYD0oAAAAAAAP4feaYaU8+6hptBYqWtRESS3TMxONuN6umKQ1+VUilufTdOKTcxPudpXCZfK4iwAUa6+y0pKXXUIUs8EkpRFifAOQuIan66tHrmtKph57Uk6jXX0uE5CpIzbbZLHNraSwIi4SG0ehn3Yqi5HEvrU469Lodxa1HialG2kzM/rASdqkrxEmkIcj0m+vDiwL2jOl0xnWLAKTT6cElfTnE76pLEZVS0lDF+bCvr6VIFN3bYfuWwqjWsP7pYV0oIBkMfFaB9ABrloY+4b68K0WbCpNbw/SXh7RsaGuOLP7nX4mzTmyatawx4XUjY4AAAAAAAAAAAAAAAAAAADpqwqmn6Qkrs4qSbQstgmizuPrIsT3ElpUfAWcB3Ixza/bNQ9mcEtU7mSXpgacWpfDGS3lnwloSXCYmK229xNZut2S2bw7kFDLM0HMHUfhnPN4CfzeAzz8A89ZFdnry0eNRUdcxMVKJdEK1xS4vE4qII8+JIPOkj3VYcADqrSLb7Ubap397tNQkVBwDyslqWy/FS3C0YuuZsfsp3RlWw66Ay1rE7tNidfczLTKoZWCSPccXpPiThxikrM7M6Ps7lKICmpS0wZF+EiFESnXT3VK0j2ICAb/0plkkrymZbKIGHgoNmV5LbTLZJSRZZ7gtSx3xS0jzJB+pQI41Rrxn0/wA2H6wxY9jnilpHmSD9SgB6sAHQ1xWNNUVJXJvU03hpdCIL5Tqs6z3Ep0qPgLEwHfDGVsdt9D2ZQiymsemMmZpxal0KolOqP6XmQXHn4DEw223tJ7UTjkjs5hn5bBrVrfdq04xDuObwUl8nHp4B1tjt16ta7i0VFX0RFSiXvnrhpiDNUXEEef5J50kf0sD3CAeetCtgtWt0np09T8LFswDqsG5ZLsfCLddczY/XgngGZLDboUFA6xOrSohMdE5lplcOoyaSe44vSriLDjMUdZxZ5SdAShMupqUswqcPDdNJG64e6pWkx6wBr2v4S2AlNr8ngJZBMQcIzKmUtssoJCUllq0EQuyz3aDT3NcN6pIh/VBvHdLOa2e2oXBZ5tBp3mqG9UkBFmqMPZdoshZxx1uXrPixUn3CwrF2e5rJqVYwwNuVQ6cP9BCK9ULeJVscGxjnbliDP6zP3C5bPme56GkjHoQLSfskA70DzEZgCvknxANctqie476bjvyMKjh3P+xI2Mp+SQ1z3kC7ivaRD6s2EwhnftEY2MI+QniAfQAAAAAAAAAAAAAccS+zDMLffdQ00gsVLWeBEXCYx5bhbDS9k8nbi53r0TGRBH3LBs5lumW6Z6C4RE1cWqWtW9T/AO4Mlh4puXuKyUSyXkZIw3XV6VfWeG4QCh7cr2FN0v3RJ6KS3PJsjFCojH+jsq4/zj4hOEjpW2G8VU33RjXoqIhiVgqMiTNENDl6KS0fUQzrYZdDlkrNidWjvpmcWWC0y1ozJhB/TMs6z4MxcBiqpZAwUsgmoGXwjEJCspyWmWUEhCC3CIsxAMPWI3cqIs5SzMH4dM5nqcDOMiU4k2r6CTzFx6RmkiIiwIsCH0AAAABB2qNeM+n+bD9YYsGymJh4Ox2lImKebYZbkcIpa3FElKS1lOkzEfao2eFp0gPD+7D7ZjHDlX2t2xQ0pomUFFvy2BhWoRuBgkmhnJQkkkp0/wA482PhGfARAKVtyvbSGndfk9BttziZJxQqMVnh2j4PTP8AcJ9pahrXrwtSHOJi/FOQil4OR8ZilhotxBewhnywu6PI5GcPOrQnETmYFgtMAkzKGbP6XnWZdHAYqKCg4WBhW4SChmYaHaSSW2mkEhCSLzERZiAYksSu90PZs0zGohUzWdpTiqPiUko0n9AtCS4hmHAizEPpAAAAAIC1Qbx3SzmtntqFwWebQad5qhvVJEO6oQok22S5R6Eypoz/AF1DNdK3rrKJVSkol0Q/NzfhIFhlwkwhGWUlsiPA8rdIBP8AfydVE3g3GNJIgIdBfXlDYPIWiYkkCyRYEiHQX2SGsy8PXciru2p2qZQqIOWK1lJG63krwSefNiKyZvgWUsw6EE3PFGhJFmhU+Yv0gFHAegTcu+TZcXyYGfKPk6fiHGq+XZn5pZPT/wBlPxAJ7vmH3HeaiXi0EiGcGxWFWTkO2stBpI/3DV/eYtBkto9qK6okMPFMQqoZps0vkRKNSdOYhT0BfKoSHgWGVSKcLWhtKVGWSWcizgKmATPKr5FAxkzhoR2STeHQ86ls3TyTJGJ4YmW4KUhX24mGaiWVZTTqCWg90jLEgHIAAAAAAAAACHNUj220pyJ7tpFH3W6dkcmsXpeKlkshoaIjZYw/EvIQWW6tSCMzNWnSegThqkW26lORPdtIqS7p4jKL5mhvVpAe/AAAAAAAAABi+2iw+j7VphLo+olRzMRAkaErhXCTloM8clWJGPXUJRNM0RKG5XTUohoBhBYGaE4rXwqVpMx6IAAAAAAfDUktJkQZSfSLpAfQHzKT6RdIZSfSLpAYotssFo61aaQc1nb0fCRsM1rJOwqyLLRiZkRkZHoxMY+Tcws2LTOagP8A3W/hFMZSfSLpH0BNKbmNmJHnmtRH/wAhv4BzN3NrLE4ZUdUKsP8A6kZ/sCjzMi0mRBlpxwyiATsm51ZMR53qgP8A5iPgHIm59ZEWn7vn/wA1HwChcpO6QZSd0gE/ldDshL/xTs+OMT8A5SukWPkX5HNj44wvhGe8pO6Q+4lgA1nXnaEkFnltEPT9NtPNQJQ8O9g85lqylKMjz4FuENj9KbV5TyJnsEIIv0eUXD8hhe2sXvSu1eVciZ7BAOyAAAAAAAAABDmqRbbqU5E920ipLuniMovmaG9WkS3qkW26lORPdtIqS7p4jKL5mhvVpAe/AB5ytK6pGjEMKqifwcrJ8zJonlHivDTgREZgPRgMb9/eyLf1K/t/CHf3si39Sz7fwgMkAMb9/eyLf1LPt/CHf3si39Sz7fwgMkAMb9/eyLf1LPt/CP1yW2OzGczNmWy2s5ZERb6slpslKSaj3MTIiAe9ACPEAEAX2ayq9u3iKkUunsxhoSHZh0Q8OxEKQkjW2kzPAj0mZjokWUXkVoStLFRGlRYkfdy9HSOa+V5U0TxwPYQNh8ApPcMP4Rfik+fgIBrs70t5L5vUfXl+8fDsmvJEX5PUfXl+8bGspPpF0hlJ9IukBrGpaoLTKJtjlkmm88nELMYaPabiId2LWosFGXgqIzwMjIxs6GuW3zyyI0//ANaE7DY2NAI+1Q2rKjksZTErk84jYCFiG3nnkw7ym9cUk0kWOGnDExhanrP7wc/ksHOZUVQxMFGNJeYdTGrwWhRYkekZN1SXbFSXJojtIFM3bTLvFUZnL+yGOwQCKe9ReT+a1F15fvDvUXk/mtRdeX7xsZyk7pdIZSd0ukBqzrdVrln83hoWo5xPpZGLTrzKTjnMrAj06d0bK7NJhFTaz2n5nHOa5FRctYeeWf5y1NkZn0mIu1RMy75kkz/3crtELGsd8VNKczwvqkgIjv0eUWxyGF7axe9K7V5VyJnsEIIv0eUYxyGF7axe9K7V5VyJnsEA7IAAAAAAAAAEOapFtupTkT3bSKku6eIyi+Zob1aRLeqRbbqU5E920ipLuniMovmaG9WkB78QbqjClHaXI0ZR5JS4zIjPMXhFiLyMQXqi3jPknNp9oB++k7nEVPqZl05RWrLJRsOh/WzhDPJyixwxxHZ7CKN39sdTP3ip7IfFhTXNzPZIerMBqst1s1cswtCRSTk0TMVKhmn9fS1kF4alFhhwZIzxLLlkbGy2FjCrdhBPsodye4zzZREeGnhHjb+HlENc3Q3bWL8pfazK+Rs9ggEfbCKN89dMdTP3jAtaUQ7ZtbtDUkcxKOXAx0IfdCEZGVl5C9H+rAbTBrmvTeV9Gctl/q2QGxSDPGFaM/OhP8ByjhgfyRr9BP8AAcwCJ73tiFpFU2wRFUUrJFTSCi2GSJTT7aFNKQgkmRkpRbmOJDHZWUXmiQRFL6iwIsC/rVv+YNjgANcfepvN/wCX1F+1W/5gFZTeb/y+ov2q3/MGxwAGuyhLv1tEdaRKplP5BEsoRFtvRMbFxjS8EpMjxPBZmeYsBsTAAEvX4rJq0tAep+aUjLSmSoFLrT7CXUIWnKMjJRZRkRlm484n6DsgvJwkK3DQkpnzDDSSS223M20pSReYiJzMNkQANcfepvN/MKi/arf8wO9Teb+YVF+1W/5g2OAA1pR1gdvk9j2DmtNzGKczIS7FR7Ssgsd015iGxKhJQ9IaLkskiVoW9AQLMO4pHyTUhBJMy4Mw7sD0ANe1+jyjGOQwvbWL3pXavKuRM9ghBF+fyi4fkML21i96V2ryrkTPYIB2QAAAAAAAAAIc1SLbdSnInu2kVJd08RlF8zQ3q0iW9Ui23UpyJ7tpFSXdPEZRfM0N6tID35iC9UV8Z8k5tPtC9DEF6or4z5JzafaAWTZD4sKa5uZ7JD1ZjylkPiwprm5nskPVgNeV/DyiGubobtrF+UvtZlfI2ewQgK/j5RDPN0N6xwX5Su1mVciZ7BAOyGua9N5X0Zy2X+rZGxka5r03lfRnLZf6tkBsTgfyRr9BP8BzDhgfyRr9BP8AAcwAAAAAAAAAAAAAAAAAAHoAD0ANe1+fyi4fkML21i96V2ryrkTPYIQRfn8ouH5DC9tYveldq8q5Ez2CAdkAAAAAAAAACHNUi220pyJ7tpGXLErc7K5HZJSsomlYQMNHQkrYZiGlErFC0oIjI8C8xj0N42wmAtfXLIpc3dlkZL0qQhZIJSVIVnMjLjIhhzYRoP8Axsrq4DOeyIscP/HEv6F+4SBfdral64r2VTClZszM4ZmBNtxxojwSrK0ZyGTNhGjfsrq5BsIkb9ldXIBlSza3iyaWUDIpfG1lAsxMPAtNutqJWKVEnOWgeh2Q9jm/iX9C/cMFbCJG/ZXVw2ESN+yurgMO3v6tp6sLbG53TkzamEvKBYbN5sjySUlazMs+5iQsin7wNkMNIZew9W0vS41CtIWnBeYyQRGWgYY2ESN+yurj7sIkb9ldXIBnQrxFjh/44l/Qv3CIbwlVSCoby0TU0nmTUXKVRcGsolBHkmlCGiUecvNkn0DNWwiRv2V1cg2ESN+yurgM4Qt4Wx1EO2k63l5GSCI8y9ziHJsiLHN/Ev6F+4YL2ETe/ZXVw2ETe/ZXVwGdNkRY5v4l/Qv3BsiLHN/Ev6F+4YL2ETe/ZXVw2ETe/ZXVwGdNkRY5v4l/Qv3BsiLHN/Ev6F+4YL2ETe/ZXVw2ETe/ZXVwGdNkRY5v4l/Qv3BsiLHN/Ev6F+4YL2ETe/ZXVw2ETe/ZXVwGdNkRY5v4l/Qv3BsiLHN/Ev6F+4YL2ETe/ZXVw2ETe/ZXVwGdNkRY5v4l/Qv3BsiLHN/Ev6F+4YL2ETe/ZXVw2ETe/ZXVwGdNkRY5v4l/Qv3Ad4ixzDbxL+hfuGC9hE3v2V1cNhE3v2V1cBiO9nVlP1lblDzim5kzMYDuWGa15vHDKJSsSz8ZDYnSu1eVciZ7BCU5Pcqg4WaQsTGVi68w06lbjaGCI1kR44YiuIGHbg4JiEZIybYbS2jHcSWBfwAcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z";

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

  // Clear app badge whenever the app is focused
  useEffect(() => {
    function clearBadge() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(reg => reg.active?.postMessage("clear-badge")).catch(() => {});
      }
    }
    window.addEventListener("focus", clearBadge);
    clearBadge();
    return () => window.removeEventListener("focus", clearBadge);
  }, []);

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
