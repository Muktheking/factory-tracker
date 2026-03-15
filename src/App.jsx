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
const LOKA_LOGO_SRC = "data:image/png;base64,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H3jggXvuuQfHILS04XX2799/zz33IKX0zDPPPPfcc5/3vOe94AUvGBkZyefzpVIpm82COTUnVqZp4tU8/vjjH/nIRx5//HGsB3BffhjnAY5ly7J83XXXveAFLxgdHTVN0zTNbdu21Wq1//qv//rhD3+4a9eu6elpQghcnsHpIoTMzMwcOnTopptuIoRcdNFFV1999Ytf/OJKpQKjnOu6jDag6a2wgSUigHNWbawHxGgX5XI5nU5Xq1VIfNPT09/73vduvfXW+++/H2Q6kUjA2EJgLfHcoJuR+dA0Da5IVVX37NnzL5/85I033njeeee97nWvu+yyy/r6+mZmZpBnHpWyBHAPQblcTqVS0OL7+vpuuummb33rW/fecw8hhAoC8SVN154thAW6xmkx3AYQoh988MEHH3zwP//zP3fu3Pmmt7z5vPPOw3ggXC8sGodHUXNfFMwskiQlk8mDBw9+9KMf/fnPfw66n0gkarUal805sfY8T1aVcqmkqOqBAweufve7f/7zn//VX/3VeeedNzExAS8IrCj4DIUATFTX9enp6UMHDxJKCWMUboDopzjttNOQAWAYBtIIGh4GbgrHcj6f37JlC2Pstttuu+WWW+6+++4DBw4QQiilyWQSJjUScDtzNyT3XuB1Y/5vueWWiy+++Kr/9Y7nPe95UEo8z+vr6ysUCjAoNYSiKOCskN9ncjlZUcDaGzIA4jHY00ZHR2Ge2rx587333vtv//Zvv/nNb8bHxwkh8AfwKUXQI5aNruue5xmGkc1m77///ve+971vetOb3vGOd2zatOnw4cOappG6cLIWV06IbXSKVkuh2y8dq4nRnQj5ANp9+4lEolQqSZKUyWQefPDBL37xizfffDP/K6RjXBm2ftuxGSFendcddWk814VL03PdsaNHJyYmdu3a9dd//dcve9nLhoaGHMepVCqJRKLJ6u/v75+amkqlUqIoFovF/v7+gwcPfvazn73hhhsq5bKsKIlEolKpuI7j2DYVBObOiv/1gQDcxK8oSq1Wm5yc/NnPfnb/7gf+7M/+7I//+I9HRkampqZc100kEs15UkNA8OeOB0VRdF3XdX1mZubOO++89tprDx06pGmaYRjJZBJOCBi+uNQ5q1eZZkLXa7WaqqqJROLnt946PT390Y9+9LzzzisWi9VqFZ4YCMuuO+thJoQgEIj4YR2z9MUfHp0L2zffw8EQEp+DYIyB7zqOs379+unp6e9///tf//rXjxw5QgiRJElVVXiM4FsOZiGErolfFUVRFKVarU5NTf3sZz977InH/+Ef/uH5z3/+8PDw1NQUBIsm6xZRAAh4dV0X9Nex7VBQCfODVjVVhUOIEFKtVjdt2rR79+6///u/f/jhh6GOSJLEbYx4FzDvIJsaVcU0TSsUCpqmTUxMfP7zn3dd98/+7M/6+/sFQTCsSOW1FXScPp+wpS6AKbUCr5t+YnAE4wEWg3K5vGnTJkmSvvzlL//Zn/3ZzTffDIO+rutBvxykJMMwREkSRJEKAv8RRFEQRcs0BVFM6DqlFNVkJVl2bLtcKv3jBz7wsY99rFgsqqoqiuLAwECT5I/x8fF169YxxiqVSn9//7333nvNNdd86d/+rVIuJ3RdFMVioeA6jqppiqoyz4MeACke7kcQKR4PY9s2bFyapmFL/9PHPvaRj3xkYmIikUjAx1AqldqdN4i9oEqe5+m6rqqqZVl33nnn//pf/+vQoUOJRALUH27t2diqud7m2YKOkkQYMw0Df33ooYc+8YlP7N+/H06UWq3GHeaIhIGvGP9KsgzXq+e6zPPIXLsEt1OBbsK8xprWAgJ9JIQMDg7u37///e9//4c+9KEjR45w9ylP3cfVMOeh0BQoZNAAYEcC60okEgf277/qqqs+8YlPTExMIB0hnU43MQnyypezpX8DFu/Q68C/tVoNth1Zlk855ZRf/OIXf/zHf3zffffBSobxM8YSiUQmkyGEgB3CsQxZAYyWuwRs2/7Xf/3X7373u4ODg1NTU3xuQx+arJP6oXbQVLNqTEBRM9XumBldgYKCPYy+vr4nnnjis5/97I033ohfi8ViqVTiogoPF4Z5x4QE5C9iKPyEEFXTTMOoVauEEFGSZiuUUYoN9uMf/SiZTP7N3/yNrutjY2NIYW04npGRkaNHj2YymeHh4Z///Ocf//jHH3v0US2RgCnc8zxCqSAIpmEQQiRZdm2H+VGbPPwRo0UQC0R14qePJJK6ZVnf+fa3C4XCRz7ykU2bNj3zzDPw1rY1b6ARkiSBcEiSVC6X8/n8VVddBXoNGoQYTR6zSwhBYBWPBSKUlIpFsC/DMARRdF33V7/61dlnn/3ud7+7v78fsU/w3AYjr04I/thZoX3kMUZJsEgcj88JFlGvB8oBZLPZp5566rrrrrv99tvhrM7lciRQinG2Toyfx8DpPtdHESqGKYJ/GCI21J2vfvWrY2Njn/vc57LZbLFYzGazUb6EUPUkfEkFIVT/jjFG/BLxzM8P/8UvfvHe9753fHwcEV+obgmjXK1Wg1HONE1+5dli+P5rYowVi8WBgYFcLnf99dfv3Lnzd3/3d8vVxqVrVgqzMRVcuIBI0kFOIET8iJTyn6hjoo5v5VzieZQxyticL2fHRBklxI90IPXiADvx06tgfqw9N2Ly7cfBjwQ4KYfJHttY13UIOAjlzOfzEDz5lHJzATwBEP9hNGeeRylVVJUQAooMoAA9FQQ45SzD1FTthm9df+O3v+M5riLJru1gwAgqh7EeFNCsGQlVE6nw+KOPffTDH3nst48qsmLWjEwq7dqOSIWEqnmOSwmlhDqWTXxDfDCyiEcuwngSLB5Vq1ZlWZYV5ac33/wP//APlmX19/fDoBHKgAHJ5vNQ7/SjlMKGAHl848aN73rXuyCYQ1gGQcHkB801nNnIskwYoYQSj3mOSzwmECoQShm58cYb9+7dCxLPg7KgSUCWZ4wRj7m2Qwn1HDe45k/8EErxOIGOBaCD8K6TQHkMx3Eg/g8MDBw5cuT973//r3/9a/C2arVKKUXUKRfJeYIFd2xwThx8KbDewCuDTiRwv//85z9/z3vegxBMwzBghzEMQ9d1HIl7YTYEQonHRCoQbGqPYQHM+WGEMiJIouM6mb5soVR819XvLlXKoixZjm05NhUFjzB8oKJABOoxLzhsjBx6AN4dIaRQKGQymWPHjn3ta1/jGweuFDAbFl1fhMy10C4M3K2CSZ5NMeG55XyxLuYeqwj1G3LtPPtiwLcrTPClUkkQhMHBwZtuumnXrl1Qe2GyQMS053nZbBYeYC5K67oOUwOaBQmiyDzPMk0a2gBzs9OxW4aHhz/60Y8+/PDD69evx+7CNUE9QXl5nTLXda+99toDBw5gjyFEFadwcwEcg9gbtm2DJnKRE9dBoUME8OEsLZGwbdu2LEEUb/7JT/7xH/8RN0WSEZc0wTOaLK1EIgFWCrvW0NDQN77xjb179zqOgxHyrDQkNIBVMD8wCTlcPHcvZBaglE5PTz/55JP4jDhL4mtj85oUIPfMKwCBFcHtaZrmwMAAPDRTU1PXXXfdAw88gCubpjk4OAieQXy2B7aK8cAEx/kcT+zCm0UmAeYf+R8WImoc59Zbb/30pz+N5gS8qBEyP3CpdovWEUIs01RUNZ/PX3/99ceOHatWKpIkObbNBwaCClMPn8DQtOD1geNyX/dTTz314IMPUj/QgNvluNKw/GCMCTEdJGv72UNoYnNkgSYQWMHFYvGHP/zh4cOHsUWRmEp8AzcicAgEVUI8z4N1WFFVVdNcx5EkCeL/icxSSudYhxgTBMG27WQyOTMzQwj50pe+lM/nQbgxGK6z4lfTNNPp9He/+9277roLVA98i+ej8pBtHsgBcDs7eAlsJrDyI7wVuWlGrQZCls1mCSE33XTT//zP/4A78q3ElZ4m6wpprhie4zgHDx784he/mMvldF2HXQh3Yb7VHnE74GdgEhhn1C1cx7nzzjt5fGfwJRLflzjvIOcFXKyg4MjZ1nX9Rz/60f/9v/8XqgwhRBCEcrkMosyJJgz6cKFjBqATgBOj6txsarTnIUoqnU6DhUNcECXJMs3rr7/+5z//eTKZhKkQ/3J2shDZmVLG2M033/zZz37Wc11BFDOZjCCKjm3blkUYkxUFJkTbsiRZDjFgLm7zrGkwYEVRDh8+DKZIfAMg88suLAMDiHrLQsNpWjsEsV56ikEaLQAur8HoifTIu+66a/fu3YQQRJoTQsrlMogCaDEcqtjAyWQymUym0mkLaaWUWqYpCIIoSWg5QurqQxC/hg+iSpLJJKL4kdzPqQZPtgQVnpyc/OpXvwrTM7feYFSgQWAbPKcMRAfOWB6Tk8lkILtB24AhBc+YyWQkWS4UCqqmTU1OfulLX4LNQQh0FaV+RlWTSYZoD5V83759Y2NjsixXq1WQVIyT+KlVjuNUq1XoAbMGtIDpgNWBEPLggw/CGQOjBDen8FNaYVTNV4iu64jo13V9amqqv7//6aef/vrXv04ISaVSxK+3ipWAAXMKCOYEHzW0KIyTUorkKbwR7jaAjmUaBvM8o1YTBCGh69VK5ROf+MTTTz8N0wr8xpAneNmGdp/Ltqx77r57bGyMCoIkSZMTE57r9g8MaIkEXCzM95qEjD8AVhH4N6+Ugzf4xBNPML9cBM9FWDbiU2/8IITMMp/lJ4L1S7Y52r0OjUD9FWIG0BChaWEBUy9oim3bd99998TEBCfxOBI5qFzGgbFYEISKDy2R6OvrSyQSkiwbtZrrOAODg2Qu3Q/eF/YlXMEwjEceeYT6JXqweiEY4tdMJnPLLbeMj4+DH/D8LL6KYJQghOi6nkqlTNNUVbW/v39kZGT9+vXDw8MwJReLRcZYMpkkhCBGk8CEQilYoOe6tm2n0undu3fv3r0b2bYkoCc1Ec8xS0jIIn6mFQxN8PHySE2e+sD5AYApBTHiUidnYIwxSZbHxsZgjiONNj8/eEGrg3CFj5uqNE0zTfNb3/rW4cOHE4kEnM+MMahZ1LeM8ZHjZYFJm6YJfRFKm6qqqFRB/KQBxhiM5nwAtmXVqlUqCPv27v3BD34AzwSUCcEvbdScATcE8zxJlgkhKHuH8aTS6ZlczrZtnnCg+dVE8GtIwZp9BX51ZIQJEUL27NmDKCPim+bIytGf2UGygAmIj2OtEcS19rytg/oRDoLf7BtkHSL50aNHiR9oAX1flmUejwGpjVKKtClCyPnnn3/JpS/YuXPnwMDAzMxMoVB44oknbrvttqefekrwc6lYyCbJGExAiMU0TXPPnj2maSLViIsvWM2KohiGcfvtt0NahyhNAoQAegAhBFE3hJDR0dHLLrvs937v9zZu3IishUOHDu3Zs+fmm28+cuQIpRRJWJTS2QBHSngEkSAItVrNdZwnn3zykksuCW6feXc1lBUcU61WcRfiB/mAbgZpGVgFFB3QfTxskO6EXpxpmsViEVcGh4A5S/BrSjcJ5pkXCIBhjA0MDEBP2rJly6233ookWO5o4QPD+HEWoumR4O153rZt284+++xNmzYJgjA2Nvb444+jPgT4brVarVQqiFPAyGE2tExTlCRKKRHF22+//bWvfe2OHTu4Muf61bNdtz0lQEQBJVkul0qiJMmybFsWPruO4zoO8YuwInOFu1FJIFcLRJ93RSS+IjsxMTE9Pb1x40YaCEkKRgosHUKKNb+7xOXlpR5Bl6D+SdfOs7eCeoLCvwlyApD7mZkZiLpcn4UHlfgCJqTgmZmZkZGRK6+88i1vecuO007N5/OqqiqKMjk5+YpXvOKNb3zjNddcc/fdd88KpIGoREqpxzwUDIB9wDTNBx98cGxsbNtJ2xFbgr0Ep2Iymfztw4/s27ePMdbX1zc9PR1M1uf/8mSoCy+88JOf/OS2bdsQLlmtVjVNe/azn21Z1hVXXPHlL3/55ptvRrUiVP5hjLmeCz8wIQTu653Pec55553HncDBmJYm8jUGwGvSYWCwmKFw5o4dOy688MLh4eHjx4/v3bv3iSeemJycdBwH+QH8FVDfEBG6F5jH0aNHn/3sZ8MJz/xYLDCV2SjShSLIp3F9y7L+8z//c2JiAtohaDe4DsxoXCUyTROD37Rp05/8yZ9ccsklp512Gqq0apr29NNP79q165Of/CRKS+F0qBSmaRJKbNtmfknOSrlMCDl48ODtt9++bds2OIf47RbwgK7ruo4DNwMPeE2mUqeddtpZZ5119tlny7K8d+/e+++//8knnywGOgnWvwKci8khfpGMY8eObdy4kQSKr/D4nAW9hzbQ8C7hAibLMI6uAo2wPMQIwfM7aPIwZ9d1Z2ZmXNeF7g/pDPI1Yvgsy4J1iBDy0pe+9B3veEd/f//Ro0d1XT927Fg2m4UFZsOGDddee+3LX/7y+gVKKeWCPGQoBHs89thj208+ifASyn5KrSRJTz/99Pj4ODK2iJ+AxhUUWIpAs0ZHR9///veffvrptVoNqgwq51QqFdu2zzrrrM997nOO49x66639/f0o/CDLMhUFo1YTRNF1nJHR0T/6oz9605vedMopp0xMTHh+Whnx+V+T+cTDQuqHbpFIJFDB4oorrnjzm9+8c+dOFO+ESHvPPfd84Qtf+M1vfsNZGguY70NqEyRQl7Fjx45xkx0sTpwtBfnTAnY96JqqqvDJp1KpAwcO3HfffXgceCzwASYgrjHA3mUYxqmnnvr3f//3l19+ebVahY7FGCuVSlu3bj3jjDOy2ewHP/hB1K9GOBBenyCJtmWJkuS6bqVc5trArbfe+upXv3p4eBgvFxazBVRppZQyhGCJomkYhNIzzzrrL/7iL174wheOjIwwxorFIqpJ33jjjZ/+9KePjx0LUQ/+K6ygjt+8AfWXZmZmgoYj4rPkdse5YIR2mcTNqXC/wF3WRCdoca10nKR2ijOxukIcrGlmY29jNqwiYLKImmcQR1RVhGEBdb6IQGumIcqwJVKXeYIkCoJg2ZasKpZju65z7vnn/dmfv03TEy6bjY5AJhePCt+xY8cVV1xx809+Ismy43lIa7Ity/U8Rmc9q7LfxK1arR47doxnJPGiOnD95XI5UDrQYs42+CNgs1FKd+7cef755zNKXOY5nouKno7jZjKZfD5fKBUlSfqr9//1vgP7n37qqWQ6RQiplMuCKIqSdPLJJ7/yla985Stfecopp3ieNzk5CRsR4yH2gar6fHqDZBobDWEwYAMoOPH2t7/92muvRaGefD5fqVR0Xa9UKi95yUvS6fQ73/nOZ555RvD7sILL8mvyl8UYg8kCA0DjIxjQuW2E+mkKiLKN3O+eJ/n145ifjoDHQVEHeOAJIffff//TTz0Fls/VMlwWlpB0Os3L8wmC8O53v/tlL3vZsfHjoTs6Rq1q1F7+ylc8+PBD//7Nb7rMY4RZtkUE6jLPtT3iW88JpbPdHQTh0Ucfvfvuu6+88kokBMBrwvUwDJgvFT6whuvctizHtrVEQpblk08++dvf/vbGjRtrtdr4+DgUmsnJSU3T3vSmN1UqlY//0z/DtY51xbkO9RP3OEvmKWbQkuEfZr5POGqHdgpeRLGN5eM8XYvmqnoMAIHnKM6O3CvsaohaJ7YTY57rOrYtSpJtWa7jSLL80pe+dMuWLeAcNAJnnHGGFPBzYq+Kfp2G4Ha1LAseWv5N0EjFJaxgEAicq6iHg6AUQRB27tw5PDwMd/HIyAhIpKqqR48e7evrk2U5kUiceuqpr3jFK1RNq5TLlXI5nclceumlH/jAB771rW+9973vPfnkk2u1WqFQQHmA4EKaV7Pk/AC2GmQqvOxlL3vXu95FCNm/fz8hJJPJwAmMckNnnnnmJZdcAj6HbIx504+5PSrk761XAlpBUGMIvn0Uw/jNb34TvHL986JmVCKRYIy97GUvu+yyy9BZoSFSqdTll19+8imn2LaN5EFVVZvUqnNse/fu3dVqFe5WTm3blURty8r29aUzGaNW27hx4xe/+MX+/v6xsTG4oJFyCLmeUvrc5z4XrgseAEb9LLaGU9eFloY13RAmpvutA7sX0YQIyHnmmWcKhQIPRJk9zi8t4PnRFENDQ7/zO7+DmByEfDS0RW7duhWSEYXpNuAiI37MIp1167mFQiEYwsgvyBibnJwEYYJRnviRiNh7PCKFEII49P7+fvSK0TQNeUybNm0aGxvjfeK2bdumadrIyMiLXvSil7zkJeeee242m2WMTU9Po68IDDW8JECQBzTf8Mzvxyv74eRvectb1q1bVygUUEypUCjUarVMJoPa9Js3b965c+ePf/xj6D2g/s14jK/e8dkLHh+k5vOOk/gsJMjnoIVAkn3mmWduv/32cEJf3cMSQvBEv//7v79+/foDBw5oeuNGLpVKZefOnTt27Ni3dy+qQjUZIXD//fcXi0WU6BEDjY7nPMh8kGS5kM+rmkYIufLKK88666yxsTHULuWZ8NDVisXiGWecceaZZx46dIgrOvjA80KCs82aZvyuFNY0AyCBKNKVHsgqADdxwOW7efPmP/3TP92/fz/s5uVyuVKpoH8W4k8sy0IVSdj6Jb9RFCclMJRDWRYEAdkAsF0QQgilruMQRjgJI75NH7uLBSoHEJ9JFItF4tdq55qB55f3wa0zmUyhUHjggQde+9rXgohPT0+jVyL8xgMDA5Jfqv53f/d3r7vuuu3bt2/fvn1kZKRQKBSLRZgCdF1njBWLRdM08Tk4Xc0ZQJA6wBz07Gc/+4ILLsjn8+gIBk8pumBC47Ft+9RTTx0cHESyKyEEto6G18fEcgbAx1Nv6Jt38QfVBb5ZIAWDznqe9/jjjx89ckRWFBRH4DMQnA3ulU2lUlu2bIEPP+ru+Xx+/fr127dvhz3QsW3TMGi0tURWlP379+/fv//iiy9GQdnZSWj5MYNjtm1767Ztv//7vz8+Ps4r7oHhUb+ORbVa7e/vP/nkk2HUaijjs7n++ZgBxFit4BZkbHjG2KZNm974xjcmk0nbtg0fKJJlWValUkEJZVEUN27cGMyOqQfzG2Mhe8olBDk4ti/kcosq32acAfB/AZ5ASwJmFuYX9kF4IqwEu3fvPnDgwPqNGxzH6e/vn5ycTCaTo6Ojk5OTMIvD3ZrNZl/2spdpmlYul/fu3YtOhMhaQgC7KIqDg4PgFvx2QWobBfBR4ns4rrzySihYEPBhy0a4JG/dPjAwgE5ewcdsPKWeRwMGkKC1Dd8IgZYMrSyAkKjE0/0g7T722GPBw+rP5bqOoihDQ0PDw8PBZLd6wNhy3nnnDQ0N5XI5lG8T/HoSDYdn1GoPPPDA85//fJT9mA3Dj4h+iYJtWYqqWqb5spe97NRTT8Wy5Cw5kUiAE/AkgIGBgaDDn/nqL5nL49lC8xKWGmuXAUCxjTWAFgFTjyAIyHgqFAqww+TzechE6XR6YGCAG1sQy4i6iYIgQChDYXcuCQbJE4KviW/9ZwGbteDXreT0PbivQtsbKcq8cg7/Xgr0EUN7pkOHDn3ta1/71Gc+PTU1JYri8PAwFBe4N2B5Ry3oRCIxPj6eTCY3btwI5YOTfgj+wVKUQZbTHBg5KKCu68973vOQewz7PnrsgN2iwj4cngh4BSnHN63ciBvK+L/zJio3B39A9Ivfs2dPQtctyyIRG4qLz4ZhnHHGGevWrYuq3wnA53/qqaemUqmJ8XFV05pn9sKhilRbrlMyNqf4b0MhPQQBETGq+uxnPzuZTE5PTzuOA3ug5JdQrdVq6KaAGIrgbGCEwXHSuc7/JrdeEaxdBhCjLYAsYmUrioLcfcaYiah/QkzbrhoGl4Y0TasaBmcbiqYZhlGqVNRAfS6+MfgHN9CnyfFTh1iglmH9iUEDBSFk48aNXE5kvuGofuPBb/mDH/xA0dRr/vZvs9nswYMH4aLUE4lCoSCKokSp5TiKoiiaJpmmy1gun1ckCYI5b2NLCEGOaEjkn5cHBN0YSAMGg3T9nsm8uDzKLSBFGQQOSUbN7hLISOAzEAxADLoum4+z4RPxKCYE9R46dChYGLkheGLU9u3b0ah51rgXMTmuYaSzWU3XCSG26zJCUCE8amyKooyNjUFhYn7bZN7jpsXH9FxXVpTR0VHP8yqVCiz+UMgQTIW3PJsIFgjz93wFRfDLd9fftAs1gK4b0Iog1gDmBeg49jzka0jBrl/2EvFtsixrmoYioIIgJBIJruNTSmE/4fGRoNr8V9d1oeYLvFCiKJIAV4DMVT+woIS1fv16RM4E1QuQA9QXI4SoqoqydI7jfPOb3/y7v/mbhx9+ePPGjevWrRMpnZyc7MtkCCG6psmyTBmbmZkhnpdMJhVJ4vUGiL+fKaWg/sEhhT7Ugxu1XL+b4PHjxxOJBPyNjLFUKsUYQ8wVGk6BB4Pi8PKlUdcXabgQBZsb7ty8UsXsKZSQwB2CU0p8R6vneblcbnp62nNdWYwUKNHyk/qOaMMw+vv7o+w/hBBJkkRKZVnuz2ZlTfNsm/lB/Q1rlFqmaZom0stFv4uD1GajZjyb4zi5XA5tpTHzWPaIgmOMpdNpxGKhBjicW1wQwa9t33eFIPAiTTx1M1hgpB4tXrfJFVrB4h+M05eGf8ILgxAE0oA/1ZtKVzsYPfETAqV0VmBxXEkQiccoi3Rd8lppWPSgX7BZc+MM9RvtcgUcEp/jtxCAK9hzXOZ6AqGu7TiWzVyPuR7xGHM9VVGZ63mOKwoiYUQglKfJMN/+wxGMTOfh7du3bwelSyaToHe6rnOrFMzrwROZ6/3oBz9821vf+oG//4fd99+fULV1IyOlQlEShHKxJIuiIsmSIEiCaJsmZEDQlxCV5yyK+AXmuJmYS9/1p/AkaojSlmU5nksEKkgi6s4jl4LRWRMWdK9QxZsTLzRQyp+5nmPZIhXQ5JZS6jKG9yVSwbUdgVA+2qg1g8Ez1yOMuLaDoVJRdBkTJKlmmrD47X16Tz43IwoiJAMa6PnMVxrS6FCd6ZRTTlEUBe56QRAkQZAEIdTngzLm2s7w4OCpp+ywDUOWZEEUSV3HApT7p4wQRojHjo8dm56cwq1nezkwjwjUI8wjjPuxwhsh0PwD65/7kKFGOH4rAtS+hvKH1DbEkvFVQeZqsTwPkSsH3GTEN1rrFG8xFFLyew8QXxHE+lnTGkDvkfulQ/0UYT0FpUKk6SJxlzEG/QCdFFHTWJEkgVCuJei6nkwmEUmZTCahN/DdQpo7OXkbW8aYX2bScZzNmzeffvrpxC9Hk81m0T28/i3jRNT8OnL4ma9//evvePtV73nPe+6+6zcbN27csG49pZR4LJFIKJJMKRWp4Dluf38/Ho0X5ffqOjUuGM03drurlFO0hpdqRQMgJLIrACRizOqsaO8x4kWOH0tCkqTBwcHBwUHYD5toAJBFBEIppYgE410KGo6Kc9lQWFRbRrkFNIAKTmMrdHmlSA0EOOJ3XxD8Gqtr1AcQJFuc4cdoguCMeX4ZW8aYBHkfpfn9il0o2qPoOmRh13F0TUOOqK4larUaXJq8W7coig899BAJlDybNzebBdI7QVlgkjrppJPOOOOMRx99FDEn6M0dzHQNCVAoCYfojmPHjv34xz9+6KGHbrzxxte85jUXXXTRyMhIPp+Hjgi5z7QtaDN4RqSP8aIxYZG85d0eJdZR32fbJAcqCiEZnAQMZZwK8Lu3S5gQ++g5DqU0l8sJgsBcj5E5xdFCg4FrPZ1OwxIIJ0fUc3FjUYt7k/qR+CgaGFTLlhRc8G9dMF9xcZOrEZ7nrTkGUL/WuV4WY17Uy1PwTELcRoq/ZVmoQqyqKnzFxWJxcnJyenp6YmJi79N7JiYmjh07ls/nkVdcLpdrtZqqqigNz0UV0NyokXChnuf3QxN3Xffyyy//3ve+h7QyBCBls9lyucwaxYamUinUogEddxwH4eS7du0aHR194xvf+MY3vnF4eLhYLMINKymz/WEQpaMoCkzzzeeqRQQpCNdvOA9YsKpafxYNOIEXdk2Y5jxCXNcdHx8nhDAyP/mD5YrHv7aC1skrFkOwHzX/ngTmtrP0t6Ei1eQWoR20ANa7MGDxMD/5hlt01xwDAOjc2KwV58mrF3CXoTwWtncqlUK06P79+w8dOnTgwIHf/OY3995778zMTCKRsAyTl3EmfvQet5XDUonXERXxzRGWcAlBWOpzn/vcyy+//Gc/+5kkSbquI1GLzH3p/AMfDBKVeTNeVH/7+Mc//uMf//htb3vbFVdcoShKqVQSLJH5FV24pYv5SZ4LXkjzagA08A1tIbCdS9DBb4I8ZJHLng/DsqypqSnP8yihzXkAr48P3sOTpxqCTwh/s815BvOL6pTLZe6FIo1Els4iOI0tmoBC074MagqZGznN5QlRjPbarwVwVShmAC0iZPQnhIyMjNRqtVKpRAhJJpOSJOXz+ampqf/4j//YtWvXo7/9bfD0WrVK2GxlHhIo8MAdywgl5FXekNDbcCR0blND/kEURFEU/+7v/u6JJ544cOBAsVjMZrOIDKk/nfhVTimltm2bpgnjPkaImMuHH374Xe9616WXXvrWt771sssu88hsR0Zu6eJx4qHrkzb5QZAH1PM2MjftufUrh47EJRZPdKBywbAD7UoUmsn1vJQC552Yc1FuTIL4Cw3J71HgK5MnmrTo5FgkGnLuVkjK8tD94O34lAp+S7KYAbBlsxWudnBOyQKUiFJaKBSq1aosy8PDw57n3X333TfccMMvfvGLaqVCCFFUlfr14gmZbaXCpTMeL4GAIp691Yq2zik4TxSAJ0Ag1LbtHTt2/PVf//WHP/zh48ePs4iCi/wKGB7kU2jHCPBAGA9o3H//93/v3r37BS94wXUf+XBfX5/neeVyub+/X9d13t2XT1Qr89lQim8yyAXQsjAXmXvx1m3WDQEGIAoC86OzhPnq72N6sXiCoTJNBk9bdlYTn1uAN4ckg6WDV9dVbd7naktj6BRC1B9vzbbttcsAGGOU0EVug7WDhrSJUmpZ1tDQkKZpTz311A033PC9732vWCjoyWRC1w3DsEyTUEoYc2xbCDRH5XH0ILvw3/IQUvADuIjnHRVf0IQQURSNak1RlJmZmVe/+tW1Wu26664rFAqJRKK+RxUeAUF+iPPj5XlR7Qsd5PGrKIrlcvmXv/zlk08/9bd/+7eXX345snPL5TIiPhc5sUHbVEjM7ywV45xgkdIP+KKsKDzpqbm3VvJ7oFM/yotSqiiK2zgP7ITBiser+INvNiTqRzbXM4DQe2/3eaMQklfanczlND8EuSm02FqtdsLBwrFE924ROJ7VYQFX5peqPwvrD595iZjQfTv5/N0H6mdCQP4N2kxDEwgglh85lthgyWSyWq2KVNi0YeOtt/zs6ne9+5tf/0YxX1BkpVquIK5fEiXiMU3VCCOyKBE221NeVVVKqed5vHlTsFQcbyODdJuGCMr12PY4XRAEXdcNwyiVSm9+85s/9KEPoZg7zvL8bjbUV2Ucv203Uhy4M5kfwBhDtA8+HDhw4C/+4i++8IUvIGhV13UUkYYkiGHArMRLknG6wEuzBUfOSRv1++uSAFfgyk0w4xQHN6cdHjsR683BvX9B0l//roPLgPnh84Jf+JNn2Oi6jqudyI0gc2JzSYDU8lrcNNALNxieSwNsj1IKtzxu57XQMoVnpSUSCfRNw3xiJLh4uVymLdBoz3UxSNf/QBopTFyO5jvI8+tAhOaTnxvUVokfkRn1EuvfS9TebAL+3oOJhJRS5GxeffXVqz78sZ5VtEi+m3OItYb6SQh9g8I4WEmweh85cmRgYGDHjh0f/OAHr7nmmt27d4OaY5NjAzO/NTYhRNM05GRB+mCMIRWAX5PTOJhxiR8VGoUQ4QBUVc3lcmjfODMz84Y3vOErX/nK5Zdfzp+CV9Dk6bUg4gjsaSX/QBTFz3/+8x/72MeGh4dRpCHYBpn4vo1640CPAdMId059AH4I1M985lSPBTI5SN2cowZGkFc1p93c+uT6jRi5xWlxTznnEeq/XC2vGAHZXNJCJNvWrVtXPQNoBfO+pNXyFpcCrE5HjpoNSEMgmowxVVV1Xf/sZz/7uc997vjx47quE0I8z4NNXPA7dvEi6YVCAXI0GgJDRgbNTSaT69ato34iMW7XSjZAaHj4ADEwlUoVi8WpqalnP/vZX/jCFz760Y9u27atVquBQHieB6HVsqxSqQTZFh1oydxiXiG4rlsplwv5/Je+9KVvfvObW7ZsQcxrcNJYoNBF6+NfHszL6VtEkKDgCq7nikJkODWE5aBmEDXJOIBX4OFfNlcCmF+PhCthIZWig5yAX7bJr90JzA/XfbPZbNf5ADo1jyEFmS+7esW5Ozfq8iCKHIS+h8gAsRpCfT6f37Jly/333//5z38ejVt5U2/e39UwDHQCME1z06ZNuVwOKaMbNmzYunXraaeddvrpp6fTaUmSBgYGvv/97//gBz9AtQOuqLb+IEF9LplM5vN5QRBQ0mt6elpRlNe//vWXXXbZt771rRtuuAG129C0loeLoBInLtIsBYGxhK57nmea5ic/+cmTTz750ksvHRsbIwEjeOtq6ApikcOjvt2fR3Z6risIQpRNn8yVzYkfF9RwvTHGqED5GsBdmifrBE12QXtaKzaf1p+3HkETU5PDVhzMj12GvAJDWa1W6zoG0EGErJCkZXq3FhCSWOsNYvWcEv5StMKQZTmXy33hC184duwYiD7zI2qo3zEDqbM48ciRI4SQc845553vfOdZZ521ceNGGOJBcwcGBh5//PEf/vCHuBG3DEBgmfdZgpvcMAxN0/r7+23bRsU33CWbza5fv/6aa6559atf/b3vfe+nP/3pxMSE67qqqjLejcCvsglHRcN7iZIE65aqqpMTEx/72McuuugiZJDNq0J1DxoQ3DYpl+eXWkPd73mP56wCLndOnaMygXnJa2iQPFMkygnMi+3AskcCSkYHxf8Qoe8Ud1k2ML8SOJ+TjpmAaAQ6df0ozOsDaMX+s7re4lIgyAj5hASnBR2yYMCxLKu/v/+WW275z//8T1RYgyWdEGJZFkR4aAyI7clms5qmXX311TfeeOOLX/zi7du3O47DW18JgpDL5XjBRXjVyHzlKhuuMUppX18fUpGp34JKluX+/v5yuVwsFg3DOPPMMz/4wQ9+97vffec737llyxbHcRDtk0ql8Iy2bScSjfsUEvilGVMUxTQMRVUffvjhG264YXR0NJiwykfVCvdafnSEUYHawp4ATYsS2uR5Bb+XFsSCYGHX4KrjQ+LX5ynczUeLCRdFER1aSCDLJHjAYsCJfr0JoVO3WDpw1qtpGtLjUcyqlzUAjuYCzhqn/iFyEDUbNNCTS9f1iYmJ733ve57ros2vZVm89C5vvVKr1ZDJVavVrrrqqr/5m7+xbXtsbCyRSKDSPSo3oDYc/MDcQ8ujTVp/EIhjk5OT/f39xGdF6CvC8wzS6bTjOIVC4eyzzz733HNf9apX/c///M+tt976wAMPQDXGfWHFaniXaqWSSqfL5bKiqo7jeK77y1/+8pWvfCUKyrqBfjVedAe0FQSb2yOFLHT9wyjvOY6u6yeffDKIYv3Fg8C0oHMcvvE8r/5wvltBp3K5nDe3G0STiyeTSXRpp3MTVoLHdApcT+W/svk81SsIrk7BkIspnZqa6joG0MTWtpjLxjxgkWCMIfDRNM3BwcG77rrrN3fdldB1x7J5Ug/KrlUqFWT2Ej+M5+KLL377299eLper1eq6detQLhTJVtwaAAUCFBOBCvPmCjVE30C/YzuO51JGbNehjFBRYIyJsiQIwlRumjKSSOqFQsEj7LzzzjvvvPOuuOKKO+6446c//ek999yD8qUoUdfw+lQQyqUSgU3Ddakg7N2795577rnsssuC5J4G+petFOoLgHcQnLaC5sKYM+8WY4whvYPHtgpShGVfoAKjhmWWy2VCiSAIHmHMQ4foxrXNMZjh4WHelq7j4v/qBWMM4WoIcYb3a+/evW2bgNo19bRrCJrXpLNgcPWczNU3McKGt2ilvtUqBXfEcWPFPJmcHkMdf0kQXdvZ89TThBHLMHm5c246p77dFpRdFMWdO3cODw9D2K/Uqh5hLvNQ5h612l3mgSuIoogy7l6goD+pi9nl2kbwJeJ00zRd5jFKqSjgXyqKRKCVWi2Xn0mm04qmWo7DKBEkKZefGRsbO+OMM97ylrf8n//zf77xjW9cdtllKB3KiQgvXIxQH9xO1TSjVhMliTF29MiRY8eOZTIZHvnK4+UxTr7qgnXrgtIi9VMiyNyQFb5ieeI0/sQDHEOLdk7vB0oZJS7zPDJ7Ecm3/LrMEyTRIyc0v1CADWVktrazxyihcJDAZ8NdvvhsWZZpmqOjo7Ise+xENxES2Pj4gNWlqur09PSvfvUrfI9YT8fz0GrOI4RRyihFgzlZVSzHIQIlhAiSSASBUMII8wjjj4lC/x5hgiQSSrL9fagtgfmEIAJmA78UaZS7O+fZKaWCwH1CcD4zv80k/5JPWvAFhZ56zjV9pTBYPTS0sEO0riN0j0++4Dc+wXuklCqK8u///u9hBrDaGV2MJQLIGTZDsVh84IEHiN//pCFgWyeEZLPZU089FV9iT/KsGc56edMrpFxhEaKub8OLN+bWjDHGFE2z0bNMEGRZdjzPNE3TtlVVzfT1iaJo2nY2m3UZw400TTt06BAaCTznOc/57Gc/+y//8i+ZTAZEHMGI1E8Hm71TIJUJIzxy5Ei5XObVzTjJWPh0LxpcRuai9yKpSYiuIXoK3m9N01KpFGmUA8XB2RshZGpqivgNW0ISJCeCoigSQSgWizOFAiHEZYxxdUpocAu8HYT/QpiAcbIJOe4I6gffqSt3FiHBFyKOLMtrIg8gRgcBT+nDDz9MmsbLc/F5eHj4vPPOY37PFvyVZ+QSX7DlWULY/PhTfUs/vo6Dv5JAxmOtUkkmEplUyrXtWqUii2I6mUyoaj6X8xzHrNWY69YqFZHShKoKgpBOp9GFEUVDR0dH/+iP/ujf//3ft2/fjvJwGAakNmQmz1Yy8FvVE0qffPLJ6elp8DDBb5zZcQZQT8uaoZHq3CnyxPwCrmAAfX19IyMj9WML3o6LwIIgHD9+HGnSOECI+FEkaWpiYnpykgoCZYwwRgWBRMkEnidK0oYNGzKZjGVZCHnkgnxoGEsBzmiX6PqdAleAZqvykaZqSz1WatwxVhaUUt6pHKV7EBUadTxP+s9kMqOjoygWjRoPkBO5Sg6jAc/OJYTw3LHmuUL1XzLGdF2H8gGqXalUisWibdubNm3SdZ0xNjAwYBgGt4DNzMygioCiKMPDw1NTU9PT0y984Qvf9773DQ0NET8FGgeYpglLN3oXu44Dxnb48OGZmRnFL4wj+Lyhg+QgtENb34z1toUFDyB0R55SNzAwsHnzZtKIYfObgqMjKmxycnJycpKrgA01AEQKTU5O5vP5oHwQ9eBUEAghZ5xxBk/Kq6f+wWdZzFQ0vFT3k34gROSFqD908H5toVP3jdFZcHKGXBKEzzc5HrIewm8IIZCmeW0Wwe/gyK2iyWSS+IU5CSEQ4rgTNXSvIGMIrZlSqQTii8S0gYGB0dHRdDp99OhR0HoUigFNlyQpnU7j0RCthELQMzMzr3jFK8466yzSVMshhIATlEolOABaqVqzehHcpJhJmPKSyeTWrVtJoE5R8Cy8cW5Jc113amrqyJEjofTphveamJhA9jiObPgu+KgEQTjnnHOQnwz/BLgO6RwXrMcqEvxJgIszv1pJONR61VHhmMEsD0DaINvOzMwgn7Ne4uNggR4ppmnyragoCl4ELP74hm9sHk4atN7W766gCSiEdDoNziHLcjqdNk3zjjvu+OxnP/tXf/VXd955ZzabzefzKPqGShWlUgm1KDRNo5RqmibLMqTOM888UxAEBLOirTGY2Rwy5A/yhEHDT1tdcTcA0KnFHzqdF7bDw55yyincXVx/MCHEdV2E/2LO9+zZo6oqFwjqX6imaeVyed++fcFLsToGwI/3XHdkZOS0005DauEJR0LnvCANwRObaZ0RpavA6nzO+LXrwkBjdCewnbgjFKHcTQKHqB8WXalUDMNIp9OIixckEa5gQgjCEiilhULh/vvv5xdEJYaQKM0apSuTucSXUmrbtq7rmUzm+PHjP/nJT370ox89/PDDhmF4rptMJl/0ohf19fVVq1VQn1KplE1n4ACglCaTSYioqHO5fv163rAMllPLskRZch2H+PQUUj/6XwaTV+Ho7iw5qCcxza7fiOh3kAeA/VM/ifr0008fGBjI5/M8uKgh5yb+O7rvvvte85rXiKLoOo3Xj6qq+/bt2717NwtE7uFPjLHZ/OFAlJHneeeee+6mTZsqlQpC2uBkDlL/pdADuEk9ONtdwvuDoH4DJYCiHRh8AFEnxBJ0DA68fdDldDo9b9go6CDUhWq1yhjDhkSxZbAT6peGz+Vyv/jFLwghcBLMGz7fcA9jhNA87r777ne/+91/9b733X333RAPU+n0T2+++Sc/+Ul/f3+hUAB3URQF4XGJRCKbzdq2jRhQPFe1WkVWMJKToTTMCXzy46llWeZ6DE4XGrWgWQzqt16Lm5EGqOTiB8AvAibHi/ls2bJlcHCQ63khgOLUajUECruu+8ADDxw7doyXzGuo0h09evSpp57ygouhjqnwg0VRPP300/v6+qDYUUqRA0iW0v5DGlXN6vgtOgK+AIJOYFmWhWDZQn5QPcMMso56frCCJrCocTY5hQYaI3D5ruGba5LWuNrBySXzA5m5hy34cnEAN22jL4qmaZDowQNCE45fQTEJIZOTkw888EAmkymVSqqqopEWUsASiUSpVFq3bt0vf/nLo0ePUkpBf8EA+O6F4SVIUlHHDUHoyBeFiYYxtnH9hm9ff8Pb3/bnv7r9vyihlBHmepRQyzAJI5/51Kf/59f/fc5ZZ0+OT5SLpUwqDULmOA5qgmISJElKJBL33Xcf8eML+ZPOWjmQ5IXxMHbBBRds3rwZxgc8F3wYPHeaBMJggpuIBJjZvLQjmF3B5jU9z92tng8eCw+Q+WwjjMz+lZ+CX3nHHkEQCoXChg0bXvaylxmmAX0IRyLknHeCZL6JTJKkI0eOfPWrX920aZPnuLZpubZDGZEEkXjMNi2jWsumM9++/oZquaLICvGYJIh4m4QxSZIIpYqqYuiObdu2nc1mX/WqV+VyOdSY0zStUqnwfhLw8/M13Ox5GWOex+O+sBrB5/AN93PgQ9C2zgK1/rE7uCXTC6Td8HpZqJXb/KV3CjyZgz+CbduVSuWEDyBIOruQj9E20e4Fl+ERVjUgBcuyLMtyJpMZGBiAHzhq6kD+MplMpVL5+c9/Pjk5OTQ0NDMzk8lkcrmcqqoIuxwZGdm1a9dPfvKT4LnNXwe2EBhJMpksFAp9fX35fD6ZTKI89T/90z+Nj4+n02nwjGq1iuTe/v7+I0eOfOADH/j1r399xhln9Pf35/P5Wq2GdmC6riM52fO8RCLxgx/8YO/evcQXdeEhcF3Xc11BFAVRZJ6HrmeCKG7atAnKAdQaAPGgHXwFtE0rc3Btt3vuvOChXIQQ+FQuuuiikeERURQNw+BFOKhvCYR7H6U4MDk33XTTF7/4xfXr1/f398MhjD/19fVt3br1U5/61EMPPUR8jYqXkpYVxbFtSqllmloioSgKOMELXvCC4eFhGpDqSF2wwNJt81bUiyYDWAYBGoEPkFGwmBOJRF9fnxBcJUukJS0pFswAQldYuhH2BiD+QBRKJBIbNmwgEQ1baCC1uFgsEkIeffTR//iP/xBFcf369Ywx0It0Or1u3bqjR49+7nOfe+jBBxteBAgKJaAm5XIZ4eSU0tHRUZiYNE376le/+sEPfnBmZoYQUqlUCCGqqiYSiVpttk9kKpV69NFH//f//t//9m//lsvlUCJ0cHAQMeODg4OnnHKKJEkPP/zwV77ylWeeeYb6RqpQdWj+jIQxURRPOukkGkgeZnVG4U6hLTrODwttihBXWAD4Awp+C89arXb++eefeeaZkDGhABFCPM+DXoVTeHCXaZrlcvkzn/nMxz/+8X379g0NDaVSKWiWe/bs+dSnPvX1r399fHyca+p8qFhyUApR3cwyzYSuv/rVrx4cHIQWGLppZ19Hw+u0TjmDK4Qso6gNXVnTNChAhUKhXC7PzMw0iNtlXVzSqB4LGGfITBQzgFbAqxEgFeCMM8647bbbgn7a4IvA+tF1vVqtplKpsbGxD33oQ1NTUy95yUvWbVi/bt06hNv/8pe//P73v3/nrl1aImHWjNAdQ0IJ1zY8zzt+/HihUNiyZcvhw4eLxaKu66Ojo3feeeeXvvQl27YzmQwqu1FKa7WaqqqwF/FI07GxsX/+53++/vrr3/zmN4+Ojm7atGlwcNBxnIMHDx4+fPj222+//fbbx8fHCSEw5hBfg1YUxXYdz3VB/CzTlGR5y5YtZ599NtwboQF3dhOF6Pg8F29k+m/4ud3Fz+lDUNA2DGNoaOiyyy7bddedqqqapmkYBlgvCRQaQb8HWGN0XT98+PDHP/7xX/7yl+eccw4SOEql0lNPPfXYY4/hXpIkgeLD18IYI1ACHIf4yhkh5KKLLnrWs55FKUV+GfXdMHycxGdX8z4dpZS1EzoVqmnaZEpxtfoat8tDfOAVJ4SUSqVEIpFMJvv7+wcGBqRQfChpU8pYcURtg6jxs2BQgf95tTzsCoKX56WUyrJ84YUXon4DTOT1byGTyUD8LxaLMI/867/+66233rp565a+vr5SqWSa5n333YeKOuFaNHNfBzdVc7nkyJEj119//Xve8x7e75dS+swzz5RKJW4OgqJAKTVNEwGI0AmgC+fz+Xw+/4EPfCCTySSTyUwmg/yGqampUqkEQ7bruoZhwPgLg4Zt2yizQxjTk8lKuex53stf/vIzzzwTFyedC7tsiLYuWy/yL+BSlDQ+DC/F8TxZlj1n1rT90pe+9Hv/8f09e/ZwDwEhBGVfQZRRLpAQkk6ni8Uiui/s3r179+7dqAjL8wGRHcJrg/PqSUSgjDHXcSRZliTJqNXWrV//ute9rr+/H9Y8lCys9+rByxWamdZnMkQo+DcNl27IJRY6ix+znKIndCM4t1Kp1PT09P79+48dO+bz1Toe0G0aQMdnilJKaLiWU4wmEPwO44SQU045Zdu2bfv376/3SeJNgfqnUimkgOHLvXv3Hjx8CNFBkiQ5tt0/MFCpVKqVCve318tHoe1ECMnlcl/5yleOHTt25ZVX7tixA8b3c889N5VKTRwfh5EBhCaZTKLzEfVbhIOmw6yPasO5XI4/IPG9lMFb80Z6oii6nqsnk9VKBaQqmUxefvnlPAWMg/sDOjj/7fKV+nkLXoq0yU6C1wFTFASBua4gCIx6nufl8/lt27b9xV/8xfve9z5MPibctm1e5ZurAuVymRDCK3VT3/+fSCTwjvC+eGY12IAsyx5hjm2TQLXt888//0UvehHUC16uinti+UvkYQ5tPS9pSnkwyHrq0dA3xjWAdgfQESQSCdM00b0DzQA2bdr0nve8RwgxgFUnC9MItHg89mrMAOYFj9r0/IrQL3zhC1m0CoUphQxOCEEtfsaYbVk8CUuUpEqlYpmmrCg4K3gdvCAvULsRGxt0oVIuf++73/3Lv/zLr33tayhxvmHDhuc85zmEkGw2C1PAwMBAuVzmZWdAlLlPEgHjxK8ghkcDjYD0yvyqRDxaI+jUtS1LTyavvPLKrVu3FgoF6mv3QZtDB3dT29eso/4NecCCR8IreXBSC0b7ile84qUvfSmlVJIkhAwE74VlQPwCEohKQjQXLoVQUbymYKI43oXgV2FSVJVSalvWho0bX/3qV/f394OXoB4fD7UKPW9QwF3Ys5O6V4B4If5li5Sn4ZQuKTDDaMcNmSyfz+/YsWMOA1jqQXQDGnKLcM4Rnf13SSuqry4wP14WnrdMJvPCF75Q8Ql3PTy/3BuEQUVRyuWyKIpUEHARRVFcx7FMU08m7boGvKHVyGkr8esSa4mElkhMjI8LgjA4ODg9PZ1Op9/0pjdls9lcLoc4By7aS5IEowToCGOMJySjtl25XOZRrcG6lcjz5HvbsixBFGu1mqwogihms9l3vvOdyBoLBhbjrKXY1UHy0eL1FzkMSmnDXQA1Dg+LhIBkOlWqlD3P+8u//MvNmzc7joOWnOgXjWMopYVCAWVW0QaOX5DnWHBWjV3JnSuUUjgPeJStJMtveMMbXvOa1yBjAycGj6+XJxpPUWC/h05pZX4WwOmX3wmMG2HzokcetAEBvwcll+Y1OvC+g1GlPNwt+D0LhMQGEXLANh9xECwCAqFNfigjoR/ml2u3LEvRVM8vL04Eip85RdVXP4LPHgLooCiKeHzbdRoW2gUcz8XkJJK6y7xSpXzBsy5829v/HE5XngHEM4OwKniY84mUHNdjridSgTIiSzJhxKwZekJnjJ177rmXXHKJ57cKcV1XVVUiUEaYxzyPeYQSQolhGowwy7LAWs444wyY/nO53CWXXPJ3f/d3hBDDMDKZDCEkkUjAAwyjEw9+5y1feEVi4gfpc9kW3/Mi/owxLs8KgqCq6uc+97n169eXSiUUQyb+xobSgCpD9WaH4OoFB6KUqqoKu0f9BpmNaZFElL8XJJERJikyESgJrNvwjx+JS/1KR7PaDyPM9RBZT3x2FQpXDZbaJwKlokAoESQR+1oSBOJ5km//8TzPcmyXeY7nSpI0PT39rGc965/+6Z+GhoaYHwiAzACex4CoKhpobED9UoN8tfA3Rfwy+gQxCI4Dq5Flmn/+53/+nve8B/WCoFZyHk8CRRq49V9WFUaYIIke82b3OEFWMfP8D1y/Ib6TmYe68QFzzsQYc5mnp5K2Y3vMUzTV9VyPeZg0j3lUFLBriEBd5smqAsXINE34OYhfIz1q33UW0MnQlA29IeeszhY5HgnIR5jlYOUWpHoS35Ya4pBB+SW40BsK5ouBEAHiyxqCIPBMlvoXwIWCGABEZtRQw9SlUqk//MM/PP/88yFo85BwmHH5quCmAOwfRIjDEGnbtqZpkiRVq9Vt27Z96UtfevOb30wIyWaziqJomlatVk+YMqhvsJMk0Q+6J76SgfAS0zTf/va3f+YznxkdHUXpN1j/4YrAjsWQkAPMyT3WA/WrlSH3BwtJlmW+V1E1CIkCX/rSl1784hcfPnx4cHAQtYOY76Y2DAOtl0hdeg0HbyEJmmUYRnAR8t3EFzMSFJLJ5GwEpG2jHxnzvIY/uDhUfjwFIYR33cEzcoGPi/N8APyz67kYAXSj5jWgGCXbtm17/PHHL7300g9/+MPJZHJmZqa/v1/wk8b5O5RlGbJCPc3h84PWEaJfVhbVhNKZjFGrWab5p2996/ve9z74cpp0pQdTMU1z9p36zV5m7yUIsz/i7AdBEEgg8wArljNIjI2LONRnrngqxhihVIZQNTcoKAji5xXyOVkGE5AkSejVipJW0M9s2z4RgEFbUy2DS5MzWBhJg2uLH8DZOL8smxvVF7xg/d3nHVW9YBs8sf4sx5utYUt9+zJ/kBhNgGwp7EZFUWq1WrVaPeOMM971rnddc801k5OToKGIySGEIIqGm1BowIoCa4DgN/CSJGn9+vX/8A//cOqpp1qWtXnz5mPHjomBUqCzCNBR4vvfdF0/6aSTEokEDP0zMzP53Mzb3vY2x3G+/OUvHzp0COIt8gZA8TEkLg0EzQXcy41djduCFmC0lNJSsXjKjh2f+tSnLrjggieeeGLbtm25XA416CHKIep0cHAwkUjQaOkKtSqRElGr1ZBkF1qHwVPgzUbEPf42u3Mj3FeiKCJFtlqtFovFbDYLHlyr1lRV1TQtmUyCjtc7wOYMVaCEEOZPAl59fYwNx/Hjx9evX+84zqte9SpFUT7ykY8cOHAATIirXMwvDkrq9ilfKry7nBeoQkgIKRWLqXT66quvvvrqqwuFwtjY2ObNmw8dOtTX19dwPIgLwiO7rss8z2VMlGYLOnHGzP/lHmYEuVUqlZASQHzzJhjA0NAQLssIQZIgsgWpn0gcvAWWFjgol5CETlcNiZoHON4IIfDJo32FFLSutsKLuOpK/V5OvBESIYR39+aBE0FhIbhoQhwy+H1DoaBdBtBQnCGESIrs+f3HeWL0vMVnYvAOWTC2oqiDbdsvfelLx8bGPv3pT8OniuUB4S7I+5lffwozX61WRVFMpVK1Wu3UU0+97rrrzjvvvFwut2PHjmuuueZv//ZvS6UShEQwbFL39j3Pc2x7eHhY13WElCiKks1miccOHTr0tre97bnPfe5HP/rRW2+9Feo25D6QElBSQgiMBqQu1wxHor4b3BWCIBiG4bruH/zhlQg/tW27r68PoYfcV6koimEYpVKJUorA0JDcwyEIAtQp4sdoz/YbCAyGBSIFYU/HnKh+WrJtWSSCEIOso1cX+i2DzSSTSSRhcbqvqipn21w4C0w0I4RIsoxsanAUmNeaoFqtOo7z8pe/fNu2bR//+Md/8YtfJJNJXqaN0wQ0h8DnoKhHKc1kMjxYCAQL2QbPfd7z/r//7/97znOeMz09LQhCKpVCknlUTQU0wuXqiyTLlNJZn1NIJCWEEJLQdehkGJtlWeBeWNuCn2RAfJU3l8uZpqlqmqZphUIBl5JkmSeFEL4RGONXhnWOzS0v0XxKFwmujhOfByeTyaNHj4ZDsOtNkCHQQPkL5sdQgjpUq1Xqm4AQ/Ev8HhFB9SfE86N2CJnLGKImKIoBBIWp4JUFabYEB6JZoBvymiExogAnKph9tVqFnYcQUiwW3/Wudw0NDX3lK1/ZvXs3IQTB3Xj7EPaJn0glCALyA3C1XC532WWXXX311WeddRYIcT6ff/GLX/zII49cf/31qChAmUf8zUl9kzo+WIydddZZ6DbseV6hUEgmk7VqlRBSKBTS6fQ//dM/veENb/jUpz61e/fuoEMCixPbe1Yw9MUO3kWEUgqyiNoGhJCdO3e+4Q1veM2VfwATajqdhtrR398/MzODp4bK29fX19/fj4tw60GItvKII3ACxthsjx3vRDZZcM1DXcDppmFgOkj0vgABMgyDvzVYM7A3FR/ET5mOupSkyJZfDUlRFHg7hOg6gNB7TNPs7+8vFosnnXTSF77whS9+8Ys//elPx8bG0OaTC9So/UcbPQjqs85qLbUaIeSUU0556Utf+qd/9tZ169ZNT09z69DAwECxWIwK5INelU6nkbPi2HZC10GvgpSHf8b6wZWhp3p+XjHYPPWrAIHWQbcwajXQekIp8zzHf3eCILh+3UNuF+H+Dz5m7uRYOqAUI59PUOlf/epXJzzvJNpsEoTol7gi/iKGOemjH/3okSNHcBvYdmF0C+6oIBuon/3OMgCO0GWxwbg2BLvqo48+Os9V1jzwoqlfqB0apSRJ+dzMgQMHXvWqVz3rWc+64447vvWtbz3yyCMkUNczqF0xxkD9E4nE6aef/oY3vOEtb3lLX1/fnj17+vr6YB3q6+v7m7/5G13Xf/zjHxcKBWqZ3G7DPM8N0B1V0zZs2OD6tX9hNEin07ZtQ3ATBOF5z3vejh07nn766R//+Md79uzZs2cP6tAJvoYO4h4C11QIIbquX3jhhZdffvnOnTvXr19fqVSQajQzMwNnRq1Wy2QyzHceYNlXq1XLsjZt2iSL4f71XMNQ/IxW27Y3btxICFEUxbRPBEQFdyX8qLlcbmRkZMvWreCOyGlo+L4cx0mlUp7noSYaNrwgCIVCHn4XtDBD+UxW1xeeD1XTEwhy1TStWCxiTiDDNrwv7tjX1wffTKFQ0HX9gx/84Ote97qf/vSnP/vZzw4ePIjJYcE2y3PBDSOgJBdffPEll1zy/Oc///zzz2eUTE1Nwe4PtQDMIIoBQGvBktiwYUOtVkMATA0ke67Iy3wX0ebNm2Ex50yaBsJk+EuBGHHSSSeNj4+Dm/J1yAUgzy8t53leKpVKJBJ46cE5X2rxHyOBhMFVVcdxdu3aRd/8x2/5/Oc/PzY2xjWd5qPhFjGIUVDojh8//ud//uePPfYYpRQOKFjZZEWxzWYRfktn/Iq8CyWEEEmWYewTJYnbARoOaV4G0+UIjj/k02aMvfWtb/3kJz+Zy8+QRqswNBWgcel0GnIcxJZkQof8i8Vw5MiRRx555IEHHjh8+HChUCgUCphbSin8ujt27NixY8fOnTsvvPDCbDZ77NixWq2GnpGo6fjMM8+sW7cukUiMjY0Vi8VcfobHngbDK2HE2LZt2znnnINOXjBIlgrFgYEBuHyx9/r6+mBh37Nnz//7f//v0UcfHRsbm56enp6ehs7u+tUZMQNIlD/99NNFUdy+ffull1569tlng9BrmuZ4rm3boK2GYUA/QE6Zoii6rkPohpFkZmZGU9So+XRd1zTNbDbLGDMMY2BgYGJiIpHUg3yCC0xIp9I0bWJiAhVdZFkulUpRkbiwsyWTSUEQYHtBwTvKCGLtk8mkYRjVarW/vz+464PUkDFmWCakJRAv0G4kXpC5svOsCmXZuq7n8/lEIgHfDGhiX18ffOOHDh269957H3zwwcnJSaRk4/1yoxxcTUNDQ9u3bz/llFO2bt162mmnbdu2jVKay+VEWapWq6Ojo7lczvO8gYEBRAA3LEtFCBEEAQqrqqr5fB6LEJZ9MlctY75LvFqtlsvlkZGRRCKRz+dhzdZ1HbZEzuNh6kTRC13XYWuCMsfnBxIwyK7jOLquT0xM9PX1MT8WkTWqu7MU/AABkFx7Zoxls9k3vvGNUlAeb/HG/GAhUCEdkdfEJ/2CILi+ihA8KzysluOOFoPgM4qy5Ng2XGQIJjENQ5Sk2A/cHJBfpqenQf1hsHYcZ2pqamho6OjRoyins27dutNOO+21r32t4zi5XA4UFpZr0Kz+/n6Y/ovFYrFYzGQyiIBEbdFCobB169ZqtZrP50dHR1Op1BlnnQm7SpDQwDggCEKxWOSyLazM6XQa0iXctlxCdF1369atZ5xxBo43TXNycnJiYoLHLEBGo5Qmk8l0Op1Op0dHR0VRnJqaKhaLeIRarUYEClKC2jWyLMM9i0xLWOoFQSiVSoSQdDrt2oGYk8BK5kYGCPIoNaGqKp6ufrNA7SiXyxCua7WaKIpNbPHQSyD54lzk/siipOs6QunBHeEgCe4RkHXsCD2VlCTJMAwU6oGLmx9fD8iRsI/BfVKtVmVZhsle07Rzzjnn3HPPBUEEqXUcB2uJ+jFXWCdQwpBBMjExgVUnimI6nZ6YmNB1nVI6PT2NFxE1D9CEYLccHByE1ZcTK1JHlzzPy2az8OqjcRAvZRE8GAIQ7js8PFytVsFm+vr68DhBvYq/U9gbBOFE9hX3Hi01/bEsC6VY8d5hhurr65OCz0Na4ASeXwYWuw57QFVVQRCY51E/aRvuKddxFl9SP8pAxEfe1tUcxyGUmqZJ/dcgiCKZW26+ye16BtR34fBfmxsAuSSFX7ElRFEU9USpUs70ZW3XYYRRUSiWS4QQSZLS2Uy2vy8oAUCiNHImY0yQRMdzHc+lokAJsV2HioIsKuVqhRAiSGLVqFFRQGnP5g8CKRjGbo8wQgmPwRBFQYKJWRTK1UqxXOJq/vDoyOj6dXxnksBGZYxZljWVm55dIZLoESZQKquzLSHhAkGkE4bBI0dJIGEY8iD1g5KJX1WfMeYyjxBCBFo1avhg2pYgiWyuQM2BCRf88jgwJTeZFp74JviBj9yLYDl+TIsoMEJq5omyDVyip5RS8URSNPWdGTx4NGqcLvM826KUKprqeC7xXFlVKKVqQmOMmbZlWCbh7hyB9g30Y3L48sMUYW2Y5RIUOz2VxNhcP3kbvyLqpH5J8M88nAxOSv6kUXEf3HrDQ8Iwz7B6cYM2N+OAGUMb4HPFD+CuYFgd4TTi1iG8naAWBbRCfNqlezDJQnnFB1mWC4WCVH+z5pcO2vFJgDoHSQm+8j+0Nc6VQc+T+yVFUGLln91A7wsSWFShX8lc/Sz0JZlbfSGIqHXrBcq/BPVr7LTgn0BSg2alIAPguWDBwbBGIWotosvXWMPhdXzMoWVACOEUky8DgGdFBCd8MfMfNZJ2z6on1lG8sKsAKxb1g9NQHnF4eHi2GFzoGRoqoVEAxw5uleVc64vUDEJLqst3aZcjqFUIc6uxk4CSEToFH4Iz38q7a+i0bH5uiMpAmEXeO9cA+NWCLGHewTRBkKnMO8IeRsP5DK4QPj/BX0O8oYPjiXoLoXXYUM4Iflkfxtq1gMudUgob7NNPPz02NjYbr93W5IZeYVBzJEtGQ1t5YW2Bk6r6K8RsoF3QuQkvpG6r14vSodMbfm5+x+Cl+KuMigYJ5aMRn4VELV0WiMEPqRStDC80zhBZaUvAWjbUy7YdJ2rBZ2e+m7QhkeVJmiF7w1LT2dCriVJPQ2tmpcTf1gEfFSEErhfXdXfs2PHP//zPDWZ/XgT3Bv9mzgf+ghkjhC5tIM0iFkSIZpFufXmrAqGdyaOegyJwPYEOmmUa6getb/gQJ2g4vHp1pD5TndQxpG7e2O1iXkEqtB0aMjCy0NkIMtSgYhRSueo1sI5PfpN5aOWRg6okrXOndeFSgZtd13UEMuVyufHx8b6+PikoAXE0eYCQvkbqAmnnHk26v616F76tnkFIfKuXtfnmCW3IKF2h+b1YIP04BEiaIW2VBhK1iM8MOA1qqMQsAMsgWa9ehOgPJ6mk0Rro4LzNu67q6XgUGwhdsy2pZdkA/z9KY+m6PjAwgNDtBi0h8aEJh2w4d3OUIDKrBHThRDQGnmi1jLabwCImjSLO2lf/4IcljHGLKfPDBPBvcEnRgNJIW/Px8OXnzO0Dzj97hMzeJXg7xjzfTc15A0WZHYzNP6zxXVuA23D80dRnqRtTtBts2O54PIKarYT4k4xf+YT7//t0hszuuyB5ZUHRMShZLi9BaSjLR9mIorTYLkGlUkmlUpRSx3GQkIFkhdk6DWTu0FsRUoKMmjO94FuklDZZ6J1CFCdv9U0ET4/ZQKfhze02US9QB20CDa8QZdOvl1RCH0J35EXfyFwHNeLxufbA5tZ7CWL2Um0u6YZbqZuVgKUzudQbCULGEw4WEZqxPCQliHntOfXP1Z1vFqXfarUaL8eLOCuJBKw6NIB2b8BcjxIqEOp5HgpIUUY8SHlLOSHt5hnUOSTqTl8bBiHqW8CR54J46rYI0yyFne+gJgz1xL0YExfq5A8dIIUYhv/XOdef9U4RSgjqOAZlVeJ5jS2XdfJBK3MVHM+Jobbp6G7xXkFEMtSm92KBmYm6TvM3IgbYpBB4vyeuGXqQto6p/9MSo4m1I3hAyNQZdbUQaV0Ml21iiYo63rZtGEJRsCefz2ua1riu9+LHFCPGqkB3ymsxVgtWy/phjCFRsVKpwGCVyWTGxsZOVKriH1rkJ/N+EyNGjNWCeEf3NoKmKl6m4pZbbhGCpJ9/aP7u66Ma6r+MESPG6kW8nXsPqLYEHwDsvXfdddcJHwCZ+9Zbsb1yVhEySM3rOYkRo8ewWkwB8yLeuT0JvFb050DVwnXr1klRvT0XfAOO7gyGjREjhE45V3sDvf10S4HVsn5QlJvXuQNEUQzXam5xfLHFMEaMXkK94XdeU3CMVQRI5GgGiSLk6F7QQANYfJBybAKKESNGjO4BiqUTvw0RiuBmMhmJ97oEw0f18OamITiRqd8NGBWueeVrXgE4brHS/WAB8G/mPaX+y4VJDMFcwsVLDG2lYi5YxGkxTyqYW7OwGy0RWp/nxY+8s++3rftG/YkGyhAt0b0azlvrt2txfwVXeys5AZ7nqaqKjgVoEMQYm5qaWurM8xgxYsSIscKQJKlQKKArAHrApdPpD33oQ51MBIsRI0aMGF0ISZLQoBetOhlj4+PjmzdvjjWAGKsSNAIrPa4YMboRaFPMq2ANDg4iKzjWAGIsCaJocRwdEGMxiFo/S837V+q+nQL12xSn0+lKpWIYRjqdppTGGkCMGDFi9DgkSRJFEYE5lmWhIlCpVIo1gBgxYsTocaAUKOqA6rouSbNZwDEDiBEjRoweB0L2FUVB0H+1WiWEZLNZCZ4BEggsRUOM5jYvHkuLeFJRFHEWsgr41bjSEWOl0KQZg6qqsAwmVI0SalqWoihR9aBO2DobtcEjrEFjltBnxhijhPGmYLwXGGPM79iOJYS/ep6HuIUTpwdqr9uOI4oi2rkEUxkopej/jhORlSJJEvJUSJ0xl7bZyKlFHwaPf6eNGqEsAxZzu1Zq1tfPWJMMiVBScSuz3cq8tWt/b6Vk/+KxyIsvOJEllHoSOsDzvEQiYVkWMoGxLwzD6LAGwDdh7OvrcnieZ5qmYRi2bddqNVSJIoS4rtswKawVRt5KAxOPnGg8xIUGUG1kEQYFEQCcAN/jG+J3OHIcBwMTBAGiDDxdfPy4JqSe9icpRoweAdqBYRcwxtLpdDqdnpqaWiwDiCPwVikURTFNc2BgYGBgAIqaKIq1Wi2ZTOKAkPwVRUCjmD0CzurLxBqWSfyMcZBvRggVBM9xRFFEtrrnea7rMtd1XdewbTAn2Q9iw19dxgRBUCQJbS48z7Nt27btRCLhuq7rusTzKCEipTiADyM01lhOWWbEhGJFkEqlCoWCLMsQ/E3ThCzVAQ2gIfVvMWM+xkrBNE1CyNGjR3/961+7risIgqIoyBAhAerP32CUBlCvVge1wJDdhlI6MDSIgAQI/qhLJYqipmkg9FxmJ76877quZVmmaVqWRQiRZRlXQFUTwzAopTAHybJcq9W4rsDv0mT8MZYNDalETCKWB67rYo+gJgQ2o6qqnTEBcR6ADR8z+e5HIpEwDOO///u/H3/8cRiCZFlWFMW27RApx7/zMgBSx+8bMoCRdaMg+ohJUBRF0zRFUTKZjCRJqqrqup7NZoeHh0dGRrLZrG3b2Wx2cHBwYGCAEMKrThG/uDk3EPFKh9xMhGHbtu04jqqqnZ3ALsFSE9BO7eXQdVYdiVh1Aw6hVquhBFClUslkMvi8kDDQ+hcZ1ABCJYpi9t61gEGwUCgUCgX+JcTqtq4T5VhrKNxRSo8dP4ZPJGgd8uV0mP5lWU4mk6lUKpFIMMZSqdTg4ODg4ODw8PDGjRs3b948PDysqmoikUilUohp43qDaZpgBuAKCHdTFKXd54qX7tJhtRPT1Qjo2dVqVZIkx3EKhcLg4GA6nV64BhDlbo6xWuB5XjKZNE0zkUggLMx1XVjhSaMogoYX4YSy1WUgNNYYXMeBNAHXbrVanZyYCJ9LqSRJiURCUZRUKpVOp4eHhzds2LB58+bt27dv3rx5cHBw48aNiqLAG2xZFriCbdtcJ4ixsojJxUrBsiyUgEZOwMDAwMGDBztmAurIdWIsGxRFsSwL5pFSqUQI0TQNtJIfE2TwURJxPQPgNveGkWpUnBNzzBiDKkADTuNgMCjhqiRjhDHHtku2TQiZnpoifpAlrJnpdFrX9bPOOmv79u3nnHPOaaedtmHDhkwmgw6oeMYYK4uYUKwUTNNMJpOu6xqGYRhGMpksFotf+MIXTlT2h7sMb4iH89cjKPhzR5/nx3HzY2INusth2zalFP/iG7iFo+KLoxB1fMOtTiklHiOE8IVCif+bx+aqBnMNSuTESYE7+VdgzKwZZs0ghBw6cJBSKstyOp3esmXLhRdeePHFF5922mnr1q1Lp9OSJNm2Dc7neZ4sy6qemJmZQeyQ4ziIlSaBFBaearCwcNIgg2xlU6xeEtnuOmn4fVt0Y/G5DstPppbujlH2GHyDHGDIVZqmWZaVTqePHDkSZwLH6CnIsgwfwPT09PT09IMPPvjtb39bUZQLLrjg1FNPPeecc84888zTTz99aGioXC7n8/lKraqqKvSegYEByEeDg4O2baNLkuM4cIwrisLZQ4wYqxGsrhlOzABi9BS4CQuhooQQ13Urlcodd9xxxx13iKK4ZcuWM8888+yzz7744osvuuiivoH+fD4P8+jhw4clSerr65uYmFBVFVFGADQAnkoTI8YqRSg1J2YAMXoKmqY5AfDvk8mkYRiu6z7zzDMHDhy45ZZb1q9ff9555z3/BZdceuml27ZtQ3pBqVQSBGF0dNQwDBJocYpUg9Vrn4kRoz5OL2YAMXoNINzcjcxJdqVSUVUViQ7IhxwfH7/tttt+cfsv169ff9ZZZ73pTW964QtfODg4WKvVKpUKAqLgCWCMiT6CTCWIdnnDEsXXz4vYObc2wY0/oQUTM4AYvQZO/XkFIYAnB6iqKggCLPvMdY8dOzYzM3Pfffdt2LDhda973Wtf+9pMJkMI4Q4AnkKJtkor9mAxYiwawagEGjeEidFjgNhOAtQfdeJQCBffWJaFihHpdJoKAiGkVqvl8/knnnjig//4j69//etvuOGGycnJWq2Gc5GagIuv6MPFiNFJxAwgRq8BmQ2oKsojlZEUBmo+K/gIAiGkXC7Lsuy5Lvy9lFItkXj00Uf/7m//9h3veMf1119//PhxXdeRM4Fy6iv9fDFidBJz+gEE90zUCQj5Z4zJsoyyi5RS13UFSfSYJ4giYcRjHvJ6eNx3QzQ0XzaJIm+IeROUglfDzoc0x8seIFyER4/ERtJVjcj8g0Ayc3CNWYZJKXVtByvfNi2RCoSS/3fvff/v3vtuufmnb33rW1/0ohdl0mnDMCqlsqTIvG4S9QsrJhKJBY+tSxAq4sK/X+Yxc+JTn4fUnDJE/bX58Z3CCs7YvHfkFb1kWTYMAx9M03QcRxTFtjUAXmERFlVkkImiiDSiE3XEPI+wOY0+QkD6WD14Zlnw16iDgweEEJoCfhHHccAGQP1hGcDgY8TgEEUxnU7/9re/fd/73vee97znvvvuSyQS6XSaMZbNZhESirWEL1d6vD2CeCaXCJqmIdWREALxJZVKEUKkdrN2ERFBCEENYcjRqLUiyTIqDZFgIckIDSDoTAtysCheGjXIFvktPx2bFjywrSvE6HkE02RQN5EQ4rruL37xi927d//BH/zBn/zJn5x3wfkHDhygfgebZDJZLpdDLQdWI1qXnZcOMfVfOhiGIQiCruuIZCsUCiMjI8ViUeLScbCQQ5MLBetKo0EHtOBSqeTYtuM4JHR6xMVWqj47ti6vDWlZliiKiUQiVgJikMDiR7lskHhZlqempr7+9a8/8MADb3rLm//wD/+QEFIqlZLJpGVZKDTdY8Qrpv49Bt6gyTAMkO50Op3JZKR2JW4YXsAAJL9Jk6IofX19mzZvhoUdMXYInxDqS7jU3YvMNdM3FEba1QBOqCBzHwfmflTGEEXRsixN08bHxxteJMYaBJZKrVZLpVKWZVUqFbSasW37oYce2ndg/29/+9t3vetd69evL5fLjLFqtYrsgZUeeEuY1ybeDaQ/ZgYdB2gyQp/REKZcLpfL5cYmoCYvAAVSYExHQo0gCH19fV/+8pcrlQoqsUiSVK1WwQzEiECjhnmVQTawiIcNP0LwMzgTIcR1XfSVZYz96Ec/+sxnPrPIO8ZYjWio+GKTVCoVfMl7ykuSlJ+Z+eY3vrF3796/+7u/O+ecc1A4aGpqirfSXNVYOurfIk2PSf8SARZ7VMaFPF0sFk866aQTJqAWL8SrJAK4XCKRyGQyfX19oK2yLFerVQhNitQ4dLr+jqFQjeCXDY9vjiYSDYp/IfLPsqxEIhFn98TgwMpB01QY9xFXii8TSd1xnF27dl199dV/9Vd/9cpXvrJUKvXA+omSxpaTIsfUf+mAnkgQ3BESPTAwcNVVV7W9cMEteMNVlNWVJAmmJbTgUBTFMAxd16EgN7xOiwtukQygXqVgjNm2DQW/UqkUi8VNmza12y4qxloAZBH8SylFgEOtWiWUqqr61JNPvve97z1+/Pjb3va2uOFwjC4HQnXg70QM29TUVCaTkVARHkScMQbLeJMLwV2MayH4hxddwYn4F91FCCE0ItI0StmkUT4D0pgTRPkwhKgcN5cJgoDhSZKUTqfBsWLpIwYQ8oTxX3kVICweUZJKpdKHPvShPXv2fPSjH63VarB8Imssk8lUq1VN04INdlYXum1HLF2cUkNrRFuiZzfoT80Biz26QqqqiqhQ13WXPBM4Kg9gKW7U8WvGiFEPo1azTNN1HFmWHdv+6U9/etVVV7muC1uQ67rYXWi6tNKDjRGDEEJUVYXxAz2RCoWCJEmyLHcdA2glsavhXRY5yMWcHmPtQBBFSZbxryRJgijmpqdvvfXWq666yjAMNB1zXdeyrFKpNDQ0tNLjjbEyqKda7WZcdRYojoLIF0VRNE0bHBycmJhY9bWA6tlJcwbTSqhrjBhR8FwXHiPHtmvVqiAIWiIhy/KuO+54z3veMzU1xa2pqVQqygEWY61hxUmN4ziaplFKLcuyLAtRQN/97neXnAG0K9Ev0mTU+pEr/kpirEaIksQ8z/OjBiBV2ZalqOpv7rrrve99b7FYRDA06sctTKON0S6WzdTcLrrkdSMMFM3eGWMI5nzooYd6hwG0/r7b0hhixAhCFEXYf2RFoYLA66tYpplKp//r9tuvvfZaSFi1Wi2uHrrG0Q2kH6CUmqYJ0g9vcCaTGRgYWHIG4LX54zLW8Kf5WYzSVi7OwebmCceI0SIs00QyvG3bsxUPGZMVhRBSLpUIIb+47bZrr702m80SQsrl8goPN8YKodt8AEh6JX48aLVarVarjuP0iBO4DQgLTCyIEQMQBMFzXcKYKEmSLBNCbMuCZ1iUJFlRvv+9733uc5/btm3bSo80RoxZIAsMIfuqqqZSqdmqDSTAmqgfu4oKPx258bwcJnSjJpyhyQGtW3AopbbrUFHgj4ziRSSYNcZ8FYEwEluHYgRACWWuh6wUz3HJ7Nqjru0oimKaZv/Q0NTU1Kf+5f+cvP2k17zmNTMzM0i8zGQyY2Njo6Ojs1ajiGUVte+W00rZyt7v1Hi6QQ5r+CxhurTouH5cYaWszbD+E0KQz4h6bif6AQSHtdYM4k2UkqistBgx6mGaZjqdnpqa0nXd87wPfOADd999dzqddhwHlYWGhoaKxSLy56Mu0rXOzBg9iTmSL+kEo1sVCG4q6jcI5Oj5x4/RcaDSFqfsnucdO3bsE5/4xP79+zdt2oTek8SvQxU7h1cdus2m3ykIQeMPaSEkZrWHtbFAcj8QYgCr6FlidA88z0PLPVRC9DxvaGho165d3/72t0H6BUEwDCORSKAa+UqPN8ai0DNUYrZzb5ABkB56vCiEGB6aXJLoUnQxYjQHY6xardJA44p8Pi+K4o9+9KObbrpp3bp1oPu1Wq25CWi1IEoQbBcr/RxtIzTs1f5csyYgzgPwYRU9wIIRZQJijLGoNmYxYkSALyEea4G6iuPj4//2b/82MTGh6zqlFIWjm+yv2AfQzeg9wti2Caj3UO8DiBGjXUiShF5JlFLwADQUI4Q8+OCDX//619EyDEXUmxfcjdGFqJfrV5ekH4WwE7jnEWJ4JPrx19S0xFgk0DRGlmVUCmKMlcvlRCIhCILrujfccMNTTz2F+qC8UnqMGCsOQRRFlIlgjGFd8rj4EBpyvFWhotZr0yiIQQI94vmjUUrj6M8Y7QKyv+M4fI0JgmCaJqVUFMWZmZkvfvGLlmWhJx+WX3BDcV/UUo+z+W6tH9JSj6ddLJtZbF5bXHfOTz2CVn3qezqxXAXu/OSHrtgwY8ToRYiiaJqm67r33HPP7bffvm7dunK5LAQQpCM9YFLoVTSkjT1AMNdo9Avn5ywuChRjKQGdQBTFqamp73znO8ePH1cUBZ20V0R7bmLLrv9+OQcWY0UgBLXOhsyg59EbzpwY3QnGmCiKkiRpmnbPPff85Cc/6e/vr1arXRIyyO/ecBjxvgiCBmo5rBb7z7yYZQDxm44RYymAGiymaRJCarXaT37yk+np6UQiEfQE8IOXk6ZE8Z4V50nNERV3H4WlGEO9J6B1LMV4FoMTDKA7x7dECBleu3nFx1jVQIQFIQRJwo888shtt922cePGoNWlPjJtqRG14JsrBGsZQfE/9OWqxqwbKuQj7oEHawWx8y3GMgAmIEqp67qFQuFHP/rRxMRE0P0bjM1Y6sHEPoAYQcQJUDFiLCHQH9hxnGQyiQDrBx54YNeuXcEooJUeY4yFoDde3GyRaOqHw/PP9Yc2NGMtUmxp/dwou16U5YofVq+11QfDIoczSjLqSTDG+FODSDVvAtHExoomczidq5K4ID/xhKIpUEYJo4QRduKnF7ZSGHhwNF8lhJTLZVVV8acf/vCHAqGKJHuOKxBKGREI1RTVc9yltmXX26OD4XANH2EphrFsaDj+Vmh31LOHCMjSjbxT4OMHrbNtW5IkkHpBEKSVHVzUymt+yhINZk1BlmVOtQkhgiAoioLSBQ0RVb1AFEXbtlH3BgGOtm2j3QTM32g8hPJnsiw7nhu+RE+/UNM0MTOIB/U8r1wuP/DAA/v27TvrrLMMw9B13XEcVBIVBGEVUJQYPYQVZgCkTR4QU/9OwbZtEGVO90GvowpVQmSoByRcxhhIPyFElmVd16vVqqqqruvi4pw3UNFXBSglq0GA6hQ8z0NrMM/zxsfH77nnnvPPP59bgQRBsCwrkUhYzqovFBpjFWHlGQBpjQfUk/6YGSwGiqK4rjs6OvqsZz1rZmbGMAwUqoyS9KOqFJimyRirVCq5XK5QKNg+UAhBluVsNut5Xq1W8zwvkUgYlnni5DXwBqFuwwqEngGoBnHnnXe+5S1vSaVSjuPABEfiJR1j2bFiDCBE9LlZrfXTl2RYawaWZSmKsnPnzmuvvZb4jaAVRYnSAKImHMEtuVxubGwsn88Xi8WDBw/u27dv3759+Xy+XC4XCgVKqaqqlmXVajVBmi2ZuSrsp4sH1CNKKaxAtm3DOLZ79+6nnnrqwgsvnJqa0jQN3/dAn4AYqwsrqQHUE/2FqQIxFgDYIjRNO+mkk6rVKvpEQwloiCgTkGVZuq6Pjo6ecsopiqIkEolyuTw+Pm4YxhNPPLFr16777rvv0KFD0DA0TZujARBC+AvtaX7AAqHVWOETExN33XXXhRdeyF2ys22749UdYxmx8iag2AewIoC8aRiGZVkzMzOyLFNKbduOehdRJiBcBCbsarVarVZFUezr6xsdHd26detll11WLBb/+7//+7vf/e7DDz8MCRdvfO0oAegVjMqg+JUQYprmHXfc8Za3vAWagSRJYMC266z0eGOsIcR5AGsUoMWSJCmKIoqiruuqqjLGpAgIEUgkEq7rmqYpCALCHKFMHDhwAO6BTCbzx3/8xzfddNPnP//55z3veaFh9DxHR0AUPuMDKkMIgvDYY49NT0/zqtGWZfX8bMToNoQ7grXijOpIgYuo4OL6ize/UVQ0bqjQbv0p/K+e5znOmhO7qJ+DWqvVVFU1DMN1XUmSqChQUSACDf3MBu/X/TieS0VBlCUiUJd5HmEeYYwSNaG5zMNPvlhwPPelL3/Zt2/8zoc//OHBwUHmeWAqmqbJsszq8k64VWQl5qaToJSCvsNZgn9h7alUKr/+9a91XUddoGQyiZJBKzXOVrBSw6tHVMJE85QF/KlhIaa2btfZR4hqENRk2kNdJZoMjF+Brz3XdUVRhKC26jdYjA5iATu8/pQQvWCMOY5jWZZhGLVa7U//9E+//e1vX3DhheifVatWCSGqpoUuwtZAme5arXbo0KFKpYKeAbZtdxWFjbFsiHrvy7D+YwawptERsa7hRYLfMMZc10V46PT09Omnn/61r33tiiuuMA1DUVXHcUzDqL9IB0WtLgSCQZ988sl8Ps+VgLhX8JpCK1uvfhd0dl/EDGCNIrT4Fs8J6sk3Qa1BQRBFEc3QKaWyLFcqlb6+vo9//OO/d9llSCGmfkmctSMC40n3799/7NgxVVVh7Ip7Ba81tGtb67hIFDOAGB0juw2ZSshpnE6nHcdBnvCnP/3prVu3whHdkQGsIsDtNDExceDAAcwSvAUrPa4YK4OGnCBI7pdIIY4ZwNpFc7vNwi7C1zGvc8ndXPj3wIED2Ww2nU6Xy+VUKvWFL3yBMcbDT3vY5hMCY0yWZdM0Dx48SFCWy88HjrFG0Ny7HqL+SzSGmAGsaTRcfF6bP4xSRmnUX13GXMb4r1u2bJEkybIs0LtnPetZ73jHOxRFiYoHW8bJWG4gFujo0aOu6zLGwANWelAxlgnBtV2/zvleiH0AMZYEjYWOztHboOCP28EZYFnW1NSUJEnJZLJWq5VKpXe84x2nnHJKw+H1MAOAY5wQksvlbNu2LAvBeSs9rhjLjZVd6kJwf/LahMswmpWK8QjaJYJP2tkI3+4BZSd+QoDUKYoigvep6JeGbvQjUsp/gt9TxvDT8HhJECRBwCk4zHVdVEBzHEdRFMMwEonEO9/5TsYYl39RYbQ3PKL1aj74Ip5RkqR9+/aNj48PDQ1VKpWGkd0LQ9RIlvoZQ+CPXH9Wxx8wNKQWD+j4ree9b+hF4JpBUanhm2p49/ov68cZ+jX0XmINYE0jiigsHbFA4XvLslRVlWVZFEVVVS+66KKLLroIBdEYY0iY4q1UegPBXcqnF3VSC4WC53k9b/KK0YVYMQZQv9zjDdANCJkmmzipFgZYOXBB+H4Nw9i0adNrXvMa3Ij3qKE9USyoofxF/Y5pnueVSqXx8fHY/hNj2RDcVt2iAcSkf5kR1Df5l9wc2TrRb6771wOyv6ZplmWZpqkoSrlcNgzjhS984Y4dO6AE4Mio+qOrCyHBn3+GyE8IqdVq4+PjbL6WnDFidAQhWSSSAURt7HY3/Lyop0GdvX6MhmC+C2SZp5f3nUYKWDKZxOetW7defPHFJFA9jTHWw0Ixn3/Hcaanp4kfFLTS44rRy2B1gXYrrAHElH1lUc99yRL7w9FzBn0i0TMSoQeEkOc85zm6rsMBgIN7oxgc/1w/pZRSz/PQMyfeC2sBS+FYXjBWkgHUr/h4Dyw/6ue8eUTB4gFDBw82Qyk0BAWdfvrpPB4Uo+oBK1BIxwrOJ5/VSqXCLXIrNc4YPQ++6oKLbdVLWDEWhvp4stCvLRL9dk12tVqNUqppGngAY0zTNEj9w8PD27dvD165l0wi9aoAZwaWZTG/dNKKjS/GmoTUPGh08WhdqFnYTestGK3fhdfUjjqdEUZ6tEcfLM484h4dqfhf66kVtw41/GvrkGWZMQY2MNsDy7ZFUaxWq5lMBgwAScKolrPaeUDD+aGUCoLgOA4CYZ966qnp6el169blcjlZ7UxZpHrnc0MDVEfutTBEjWoxV1tBNB/AvI9ZPxuhbxb5gBDLeOgB/7Jj5UdW/AXEWNUQRVHTtIGBAUKI67qe5wWdAb0HWLccx0E/NWQCr/SgYqw5xCrnWkfIHt3wr2Tpa5IYhsEYGxwcRJ4w/AQ9bBLBo8EjAjZAKUW74Bgxlgj1Dj+BROQoxlg7CPKAhmS9lW8WCRREGxwczGQyzK9R0cNLkfrFkeAIgaWrh8NeY3QbsNMb556s4MbrqjCptYagvE8ilIMleh2qqlJKBwcHs9ksIQQ1IXq4VzPMXHBBua4LJWAZrEDx/uoNtBt8ETqR/zpbfmvxiyDq3vHa6k40t/xE/Wnp3qbneYZhaJqWSCSW+l5dBU6CwQxojwYdtIuYniwFQuEbrGExuB7Wu2PUo0t8AIwxwzAURdE0reMX70IERTZ84C10YsRYOoR4QNgHUH9QjDWCJpxgGWhxIpFQFCWVSum6TvwI3aW+6QqC+tVA8S+LE8FirAQk6J6zdeE9j6fnLGbPR5271Gpdi/eFtOW6LvOFL8ZYw7HRBlX0eweIC5Zl2fM8RVEcx2kr6mZh1CpE6fivuLskSfABMD8xqlf1AOw1PJ0sy7Isu65r2zbyAIJPHWQVi5nz7gRtVPO1yWO2OwOLyVlpfl8ep98gf6j9G3XqHTWfOk7Y+e2kKNdBLIysEXSbsYVbRVZ6IEsL8FpORJgf+LTS44qxJsB32bLGWXcVoYkRxIq/Gi7yhyjjyo5q6RBKy4RC0Pz4ekW259lkB9HDa6lFhGYAi2d2v4XEwM4690K/xm+ie9BVUYDtBrStagRNYaqq8m3Y4uk9Pz8dRMP4hZUazIojXApiGTZbvYMryuYeI0YwNmalx7KE4DZ9QRD6+voQ/Op53rw2oBanpbdnr3WsdtK/FO8xKGNJQStkMOav3RvPO7Mx0e9OdJUSAHTVYJYOvDsmCmC0mMWz9OPqWayRddU6KKXLGnocv4BuQ7e9ETYXKz2cpYUoisj+zWaziUSiedhr7ANYJHp+ObUFrgSc8DstTyRy/Bq6DV1CakOBoaEvexWo/aCqqiRJcTXQpUM3rPDuRLgcdLA+Pmm/wn49ljr2vxUE74XIdxRfpIQ6joN4DH5MzxOdEHgSAP5tPSZ4YZSaWwJDpyANxXEc27YJIehP0NsVodEVmfj9D9CeIeQNbrJNVoqotR5Z38qeiko8XPx7b2Vs896Fr9X6qzW5QsPjVwqz0T5+1BlSoIjfEURqfnLvGe6jEjpirCxs204mk7wxum3bwVSp3gP1++EQQjKZDPrDxH3hYyw1Qhtq/jyAXt2BQcQ8YMUBalitVqempriQ0sPvhXuAGWODg4OiKNq2DQYAfXRNmcJirAgYY/NoAPy4HluCs7trzUSddz9g+jh69OihQ4fI3PoHPQm+5FzXhQYQ+r51S8uqQNQjrPattxpfTTDOIpIBhIh+x13EHQ8zXcxIVvsq7BlMTk7OzMx0lQl1ScEYE0UxmUziA2MsmA/cyiTESzfGwoDV1cwEtHYy6OJdtOKAxb9cLoMIwhLSw+8FLl/Yf7LZrOu6cIMHVdIefvwYKwvml4Rbcz6AOJi6OwG7/9TUlOM4vDBOj629IKBhe563ZcuWoaEh+DwgcjV0A8SI0VlgdbXkA+h5xDxgxaEoimma4+PjlmURQlRVRSBQr74aboQdHR3t6+tDS2TGWDDyNfihV5lBN4SJLwary7fBBX/+jRBccGgGwMPvgsHITVB/TOiWK/IuA/7duSI/I8z1BEJFKvCuI4h/5wczeuKnV8FpiiAItm3LstxuP4AgGr76qPvC+sEj/YkfAuQ4zsGDBwVBSKVSpmkyxhRFWdh4uhl8mSEQaMOGDQMDA+h+jGKo9eu2q6hh8xcdRQdaOb7dc5ujI8o918ma36UenRrPvJedF3gE7HfkGyIFXRRFuszloGPEoJRCvLBtG6tQkiR8OT09feDAAXAFrM4eTo7lZA5VgDAPXUXoY6wFzAk5WClpfcWxNp96MVjkjIV0R8i/Tz75JGJAuS7Sw2GghBBBEDRN27x5M/F1UOSFxYjRcTTcsJTSxkLHWiCIXJ9as2xvYVg86XddV5IkWZYJIa7rcip/9913G4aBQh2EkB52AJBACtjJJ59MCDEMQ1EUVVUtx17poS0JevhVtoUVnIfgzuUGJan+b813+ErRyiWauLWs9ywAi58oGHZEUUTUo2masizrum4Yxj333IN1iZzYHq4DQQiRJMmyrGw2u2HDBnyzPOuw3Vt0G+Fe7U7jbkBwDns82K4e9Q8bM4BW0Cn3Poz7ng80glcU5fHHH9+7d6/ruqZp4rAFe6RXBeABHhkZSafTnuepqiqKIp49RoyOg9XF/5BQT+C1LAuvzadeDBY8Y4wx8ABEeSIWqFAo/PCHP0QWGD+s50uBEkLOOOOMdDpdqVQIIcgLW+lxxVgrwObqZSErxhJhMXQKNZBh/yGEiKJoWdbExMQtt9yCWCAEBTmOw+bWRegxOI6j6/ppp52WTCbL5bJlWYIgQC3oSbQeLhljOSEh7hi/nAiE71z1t3ZtdiyiXvwC7hul9YCyuK6LZ+dl2dcUMC3oSCVJkmEYqqo28buGPEjNL9sE1E80QUgyY6y/v//73/9+LpcLxn3iFj0QBsr8ZAv8ygmf53mDg4NnnHGGbdu6rmMdLukYOouoAK2lVmJWyofR4vrvODo1n1zbxlKEvdF13cYSVsyZ1w6C77qV9754xuw4jqqqhBDbttPp9COPPPKVr3xlMdfsZoDcM7/AAwchZOPGjevWratWq/B4880ZI0bHQefmFXKEF1ysl60pBJU/fGAR6JTOLgiCoiiFQgGRoLVa7SMf+cixsbFFXrZrAS2Ty3HBCTzvvPM2btwIBwBCnuKtF2NJEfSxQSgR+K6OF9+aQv3rXp4FYBgGIUTTtFwuNzg4+MMf/vDee++Ve7HkA8ADK+DhAAghkiTt3LkTveC5magHnMCxrb/LwRckC5aDjnlAjObo1GZWFKVSqTiOs2HDht/+9rdf+tKXCCG2ZXVomF0HTv1DtqANGzace+65tVoNrhfUR+rhzOeYMXQnGqee096tPhgjhOA+bLIheXTAIm8nCIKu67Is792792Mf+9jBgwdty5IVxbWXygW6skDEASf9fAKf/exnr1+/vlQqqapaq9WYX66LkpgmxlhChDZ7mAHEbHlNoZ70N3/7s0RqEfJBtVpNJBKHDx/+67/+6/vuvVdPJhHyv7CrrSJw1VuSJEmSLrvsMlmWK5WKJEkwCqECUix2xVg6BLf5rE1yZQcUY6XQEU6/ADaQyWQOHTr0/ve//75776WCUK1UervmTwiiKKqqmkwmzz33XF6YF4+/mHLc3YPY1NOdCIWxckjB30lATuHbkgbiQ4KXCN0gZCJokTREXaf+Cu2uocg4ZUoopS7zRElkrue6rizLoYMpm3P8qkaT8TPGJElKJpPFYtH1HMeyJUX2mtqhw8tIEARBMAzD8zxFURDaD3M2+jsqiiLLsmEYmqbpum4Zxg9/+MNvfv0bjz76qK7rnucZhkEZcR2n92gE3xE0kN+gaVqlUrn88su3bNmCecN0UUoVRXFdlwjdNQ9YDkFS0NwY2G68fPCYTsX4L8ZQyX02zY/hU9H6vVbKqI6hitKsqMFXI1TPOSag+pcXnIiGk9J7+3aNQJZlSqkoivl8vlQqJZNJTdNM06RC4zdaz5jxDep3KorCGDNN0zRNxHdWKhVd10VRrFQqqqpmMpn77rvvW9/85p137BofHyeEOI6D5l8oC9rD/k9VVavVKui74ziw/+BPoCBxAGiMpUZD9sMYk0Ibu57iR7HoeMmuaiAcE1GJiqLAFlGtVhNJPUqswv909jfmMUYI0RTFtu1itUoI0TQtm047jmNUq0MDAzMzM8lkcmRo6MEHH7zpppt+/etf79u3j7kepVTTNIghkEd6uOwPpdS2bUIIYwyc4KyzznrBC14QDA8lgd3XhT6A0KvpbXY1r22jZ8CCPYFPrL+58l1I02miBPTeBPU2FEWxLAsJ4rquW5YlSVIqlXK8SH9sPSFAiEsikUgkEjBhc5dmPp8/dOjQvffee9ttt913332cfyDqsVar8es4vWj/4UDHTfwLRnvFFVcMDg4i8melRzc/Gr6aVTHyjqBXVyZP8GzQECaKB5AVffFrZ80tD2C1R9PdZDIJUq6qapTPAOWSgo4iLsPatl2r1Wq1Gsq6Pfzww48++uju3bsnJycLhQLxzU2u67qOY5om31Sof0AIURQFYnKvQpZly7Iqlcopp5zy0pe+1LKsqH0Xtc57lRJ1Lbp8wjuyThhjEq9MMq/LPrRAo7y1MVYFUALviSee+OY3v2nbtmVZsMNEdaQK1ssLrgRN0xzHmZyc3LNnz4EDB3K5nGmakHlnu30x5sHaIwiI99c0Da1gcFnXdS3L6vL9tmC4rgvrv6ZptVrtuc997o4dO9DyHge0KFqtFGNYjJN29aJXV2MQsxoAT04JxQIR39jX3N2/FmaqJwEC/T//8z9333235SfiUkrnjUKplwBg84EOgcu6juNSShgjlKqaJopitVpFCixjjFs/GGOyLMM8slTP2QXAA0qStH79+he/+MVceYrjI7sQveoDCI3/hAkIezKKmtc7fEJH1pODGKsCqD3peR6i0SVJApGy3cYZuahUEwyAC64BxhjzPM91eYYJ8zxRklzXNQ2DEEIFgRHy/7f33nF2lXX++POcfs9tc6emkYRAAgRCDSGICrICKggqYAMWsWJBFHFXLOtvd1VAbAiisl/dFZXFXWHFCqwUCS5VQgoJSSCkTEim3Tu3nXv68/vjPefJmdvm3imZmeS+X3lN7tw55TnPeZ5PL57niYKAAtToBADSf3CUwakKtDiGK/i000479dRTTdMcx2ZpmYZamBSULRgJ+58L+5wu1AoBqh8YWqYxjBkwULmsp3pBw+05EgkriOB/4WZMh8iOokFOLwyAUALqSOL+aOcwI+VvbqSGARuJF6KE+q5H8RdCiD/iXPCZzyN/yMEiXgHQhHjI/0i3Cd/TNM0xnFgsfvGll3R0de7evTsejzuOQ0KFH/iqK5uQOjNTOXXjM9c0sq/Hh/pBg/im2fDfMWP/x7RM1D+g8q9VRxi2kTQ48vpoNsCycQPMyJXZiMsNeScsKEwilB83qZiBxLRMgG2p4S1MCjhXQ1htOLkBP88777zXve51e/bsmTNnDhhtrQCbxqn/ZI28tQUOWQiT++5nhSjXWu4tTDrCIjxjzHVdnm9pmWbPnDkf+chHEokEJK/6ka/hCCsymiWU3auFqUDZ9B7cs10zE3gcmEXU/9CMbWhh6gDZH1o2BHxRFGVZ9gkjhHzwgx889dRT9+3bl0qlhoeHK2v+1A+1CGNy6VErlq8MtVKdDtb5qVkOutYJDZLO2bKw6gdft9BC44AthTe7RwtW27Ffd8YZV111VaFQQIgUKv+MSfErJZVaZvTKcxsfcNXPzdqjD0qUuVimwtY/Fcc3C6GSUh8Kr5xVYLpH1MLsBi/pzL+xLMu27Wgs9qlPfSqZTBYKBU3TUDoJ/uE6xvdKK8SY3zSLsA/sUNjyTaHMJ38QY6QaKH45FOhgWZASqWZjbaGFZoE4WiRDMMYQ+qlp2uWXX/7Gs87qGxhQVbVkWYIoWo4TrvsfXnmMMbGBaJyDnipNLyp57UFMHxq1RY6JWTRHYam/Rf1bmBS4rgvqr2kasqbb29uPOXb5NddcQwhRFAXWIfR9rBNZyBEWQqea4rc4yiELqXJ5VcrItf4a/qa+tDImkZ3EJVj1Xvz6AqHEZwKhoiBycy1OgRbv+z4LfW616GshjFq1khjzI1G9VCqVLFPTNEESk6m273znO5FIxDQMkVLf82RR9F1XDhXVIIQQvvLHikwv81eV7Vwek96IQNO482DqxKPw44zp3hgTZVFYjRxZ/xs+meERNj4bzR4fxjje4JjgHadd141EIhBHXNcVxj3KFlpoIQyUOEVhO0mSbr755mXLlvG/TpaIM0ul9UqvW0v5PpBAYS5KaTKZdBxncHAQzaDG2YKu5Thq4dAErYFYPK4oCugcpfTTn/70hRdeuHfv3qkbBj7Mdko6Ff7tScEEZ7Xy9Ol9TaIoom6jaZq2bUej0WQy6bpulRosY85+mYt8JrytFlqYXqAadkTXKaXnn3/+5z//+Zdffhl1tmsZbZpCVdoxe+l+LcwQYsIndrJmeNrfFCqQS5JEKVVVlVK6ffv2wcFBqWyBjnmhqi7yGfLaWmhhuoAKd7Ztn3HGGT/4wQ/27t0rSZKqquHA0EnBmOb7iVifpxEzh4aw0VWQ689krb9OdWhls9OFhq+oVqKqqqIoXV1d//qv/yo0Rf1baKGFWhBFcf78+d/73vcIIYwxXdez2Sw30ZSZjJq9+GzXAOr7AGYa8ZksL8XMeUGGYVBKo9EovMGGYfT19SWTSYmMjitocMSzVMpooYUJohapkmW5q6vrZz/72Zw5c/bs2dPW1uZ5Xjwe58VBp+juM5aGNohaMTmznbZUjr9WvNOBgSzLaEuHZk2apnV0dLBwNVCgqfG1fAAttAAsWLDgrrvuOuKIIzKZTGdnp23bpVIJXc8mHa0d10KzkCTJNM1SqZRMJhVFKRQK6AUikaCOFWMMiSooV1KrTndZ6DFpOGq1qk1tKpZyVQli/919xoux8F6YYatf+PTWTjtkEV4SvHexpmmmZUZ0vWQYhNJYLFbI5wVRPPHEE//93/9dVVXLsgRBKJVK8LaFxf8Juspq7bs6OsGY16lE5Sad+BZo3IY+pbHz49jR4WvWkuiBxr2njRw5FdqP53moQZLP5ymlsVjM87yRPIBxT8r4UBZEdIDR7IZp4ZCFIAiSJKFuD+r7m6YZjcVKhiFKkqqqoP4XX3zxz3/+c34kIASY7ocohx805iwDJ08T9FW0MDPB+y9FIhFN04rFom3buq5L4TXaoOc6vFwap57hgytDiRp+kMnEVHvqW5jtkCTJsiwoy8ifLBYKEV1Hq0tJlj/ykY9cd911lFLHcSrDo2dgq8uwHBr+Gdb4p2vMrXjCqQPEEdd1HccRRRFti7LZ7IjY0uzlwq+qWdfxgUHNe83yaIoWDgwURbFtGzXdACT6RqJ6yTAIIe0dHVdfffXHP/5xQkgmk1EUJRw3woKWe9P7FLVQSWprRRlN9Z4tu0XL9DpF4OqpbduiKOq6Lorio48+ur8WUNj8V2fhVl0TTakC0wv+sGENd7YMvoUDBjRJxrZhjEGA8jwP1P+II4/80pe+dN555xWLRQhTOIybUzgbqEXLmqVxk7VEK+3adUZyYAhx5TAOAlVgpo0flX9kWVYUxTRNURRt237wwQfLNYAGfRTjEP9rXX8aiW94007XGFqYsUDCJCJ5eDdtQRLf/OY3f+YznznuuOOQWVMoFOLxOAlWMkqBzrT9z1HV5Euq0dxK09CU4iAg+jMZoijC+KOqKqpBpFIpx3GqVAMljb2McXgCql7zAGsPVcfQYgAtVIL39U0kEqZpep7X09Pzvsve/4lPfCIej/f390ejUdd1RVFEo0cuycL0PzMXVaW9hX8uk8QPPEVu8YCpA6VUVVXHcbj4ryhKW1ubNCkzPj49YEp3SG0fwIEeSQuzFKgTLoqiYRiu6775zW++/vrrV7/u9IGBgVwup6qqYRjJZJJSumfPHl3XKwnoDKRonufVMvZWDc87wIFMM3DGDg6YptnW1pbP5x3HgeBiGEY+n5d41FpY46uTBwCEI5EbR9WzypbdxGlx/StQMpIBgEfGY87AcL0Wxgda4+Uzwiih4fgc3/dd36OUMhqEBlCKlc98X5BE27EFUfQJW3z44g9+8IPvfe9729ra+vv7SUA6JUmCZ1jTNBYqx885wSTSsqqON9L8fgEDUFUVvA3DRqHgytAgQoht26hohAASSZIqUxwmjgNA9OvcopE5bGT+a1k4GrxF/etMEKIoFotFRDMXi0Xf99va2kRRlMoCgQ8RlG3OQ+rZD01QQhlhhBHYZxzXIYSIVPCITxgRRBF00HNdQqkky77vxxOJfC638tRTb7rpplWrVu3evXvPnj2RSGS6H2VCAOdTFMXzvP7+fk3TIpGI7/tVw1hJYDs2TVNV1VQqZZomkt0ONZlpthsJIPSgDgTYf19fXy6X288A2Oh6VdM94BZamEzQUKY338ySJDHm8S6+I3oAPhPCGPvCDTd84hOfoJS++uqr8Xg8LPmWmT1nC4GQZRlKwKZNm7773e9mMhlJklzXjUajOKBMA+D98l7/+tdffPHFiUTiUBMWDxogmE1RFGSBLVq06IYbbmi6HPTBATC5Q/DBD1n4bMSkCXOHJEgw/vjeSFosYUwQRcTweJ73/ve//7LLLjv55JPT6XSpVGpra6OUFotFTdOm9TkmCgQ1xWIxy7KefvrpfC6nqKrv+67j1D+xo6NDlmWUu0DXswMy3hYmB5IkOY5jWRYiQRljhmEsX758vwYw3SMcwQGIj64MhGgxgIMGtXv2jnh6PN8XBVGSJd/3bdtGYpcky4qiGMWi7/sXXnjhlVdeuXr1atd1BwcHubUUpo+y9TZzNk6DiEajxWKRBKK9JMuMMddxREkiNaK0UR9MURRJkrLZbD6fh+t7Ssc56yZ2hsO2bdj6DMOQJCkWixWLxWKxKFVKwTOKH0w6wpaug/gxW6gEf+Mo7YDPSOxyHUfX9be+7W2XXHLJ6173uo6Ojr6+PkKIoiiyLCNkQpIkXdch+c7elWNZFjf3S5I04gcWBK9W45rAYU4I4Y8fiURM0zyAo55+1Hrjs0V2tG1b0zRN0xzHcV2XMaZp2kg/AFIhFM/e9T0OtHwehwIgxlJKJUlijCGgJRaL2a7T1ta2evXqd77zna973eui0ahhGP39/bFYzHVdSqlt24iEURQFZT6n+1EmBKSzwQlMKbVMkxAiK4pj21WPx3Qx30csLHhnOp3Wdf3ADryFCQEF4Agh0WhU07RCoWDbtmVZ5at5fPGdswst2f8QBAo5MMbgBUUJ9FQqdc55577tbW8744wzGGOZTKZYLKJauGVZoihCVtJ13fd9y7I49Z+96SOyLDuOg3YFqqoKouh7nuu6NIjqKXso13URNCLLMkRDVVXhKWlhdkFRFEKIaZp4xYlEIpPJjKoFxMZV5rNZhDfPxM3x47gCnpQbARhj2OeVF2xh2kEphZkCzXX54qFBFwcQJpgmYKzgp/CIHUSyI9ylVCrJsrxy5coLL7zwrLPOWrzkcN/3i8Wi67q8K4aqqp7n8RyR8Ic6pRTqP0XZkbXiykkNIazWsmx8DPgr5kQQhEgkUiqVKKWiJIWTfspuxHzfcRwUtsNhUIxmI/MbHxqZVTI6zKzx0w8k+OqFEICQ0Nmtz7Zw0ANFeHi6ImRwyO+ob2UHtgssbv49Qlbg6UXoC6V03rx5K1euPPfcc1/3utf19PRQSoslgwWVOzmJxB2rjmfm7OfxAY9Z2RWgwXPxoSUkHTSYNgZQRwJqoQUO2B+49Tkchi9JEuw5YAzIVtX0CCHE8zzHtpHtRQjRY9FVq1adccYZZ5999pIlSxRFcV23WDJM05RlOZz+ctCbQCtzfbguVfV4ho0Z8IkDYCGYUZh1j1nTWU2qv9+ZogG0qH8LVQHSz4LWjGhrRwgplUrQYblIC8O0WSoRQqggSLKcSqWOP/74s88++5RTTjn88MM1TUO/xkKhIAgCfKFhqTZsX5q2B556VBX8x4xy4azx4J4cjllH+seHKWcAY6rSDa6n2R6G1cL4UBZ67zgOd0WSQBSFV5MQIklSR2dnR0fHUUcdtXLlypUrVy5evDgSiUBv4C3a4Q1DWRsU86k0gxys64qTfj8ABPyaJxyk81Afhwj1J9OuARys26yFyQL37vIcXUIIpZTXapYkqa2tbe7cuUcdddTixYtPPW3VwoULFy9erOt6qVQyDMP3fTiKS6USfAP41bZt0zTBDLiSMaaJY7YLIkIFKKWsgec9RIw/lU83vuCU2YIZ5wM4uJdXC81CCmJUELXFGJMkSVGUBQsWgOgfc8wxixcvnjt3bldXVyKR8AmzLCuXyw0ODsJJANJPCJFlGdHrCCiC54AGDb/K9vnBug7LrP9jJsEwsMbRRx6sk1OJWfekNd9mjeeYKT6AFlqoCsjsyWSyp6dn/vz5ixYtWrJkyZw5c5YtW9bW1pZIJEYylRhzHGdoaMgnDHQf3gIexIlG2IgaEgQBBZxLpRKi/g8dS7cbguM4qH5azwQUAm2g1eXBhFlH/ceBUS0hK51Cla+5ERV4fIujlvLV7FljHE8JFShhhAoC8cqj/Ub0XDbq+IMSjDF0srUsCxGWBAYWod4Dj9LSsEKC4EtuooFlRqQC7Cq4Mo805xRZURTEaxJCEMOD68uy3NXVtXjx4nnz5kWj0YWLF82bN2/RokUdHR3RaDQSiUAngBXbMEvI4cAjCKIgUOrz2/HwdkodzyPIBFYUQogFy5Ik+YwJlPqMIZoIo7ItC6rDyGPy8iGC4AfaA3/eRqhh1bXNGQ8uIoqiJElwecOnDeYEYk2D4szoWADLGE/IGglh8n2eslArnMlnTNP1gmEsWLjwx//2b6gGinIXlS+aEOK7LmMsEonMnTsXzS9lWUZj8apPWqeLCPfk88WGOccshKkQG91cYf/7DeY/rMTUviEhhFBR5JU/ymhUmfYTvhf/GwtChIVQmD9f2KiwNnKRYJAsCFNGNolhGJjAkaaM08Q4MWzkwyMnBoVAWhrAIQpFUSALIyHI87wRWbhGnfdaogDEas91w8VkqCDggjyHi1IaiURAwV3XVRQlmUxChMfPRYsWaZqGX1OpVCqVisfjqqqWrBEzvWVZIIU8RQvblYf/Y896NQQCHi9URhlHioNKkiRJnufBmcxHHjZ8+wF5heEII6GUYt6anf9wxBEfm+u6LKB02KhgDLIsg4qhkAtOVxRFURTDMMKPM6YdFc8ly/K8efN6enrA8yqJ4/55CzF1qFnhrMnGwZM58CAkCOTlryM8BkppqVTSNA2ZHKZponQH+pk0NdtY5Hx5kID040WHOU34Vy6v0KBZFgs654y0hhYEJBVGo1GeUQHGjOgy27ZzuRz2F/irZVmMMXGaSomA/YTbAqO1w+SP5lDQDQ8CYAOsXLnyne98Jyqdgag5XvWiYHzz4NcwGfUCYCfA/NLT1c2/h592/vz5PT09tm1j50ciEe6AJYQkk0lOVmCocRwHGgnql/E4HxyAAfONzQdWq00JJYTxf4xxkRN03wkChDhhLRQKXOIbkXYZY74PmgVWxANJUSF5fC8iTIPAUcABqCAgVZ0yxjxPVRQf3coY8zzPdZyS41ilEtdUKCF4Q6Mk6IrbSaJomqbluqBijLFSsYjs6FHTFcwnp9EkINN4vzykqgy15h9E0Pc8SqksSVAEPc8Tw8pKSPrubG83TdMoFARB0DUNbWy5075xSIGvG2+N5//jOvuJFQT8IIecBwXgsSkhRrGo63pEVbE4fQgNqioQYts2euxAffQ8z7VtXdNKEFAIYZ7nuy5lTJ6+QlKQurB4wMUjkUgkEml6QHXoe+Wf6MEeMzB7ASPGqaee+tnPfjafz4P627Ytq/U2WCUDCFcRAA+AaiyQUSYLEHTQSn4WhCmQnj179kgBuNXIdV1GR8z3UKKhw+JSNAQu3dfqVBWW6cp0f9B3MWgG4LpuPp/HZuaFJfhlMX5CCHwMLJSC0BT4+MP0mtsNRsxoQZ8y3/dRtgG0DCSYBNFQZRckgbhd9b7cAc5tcZRSWZbLitzx05GHQUJaEYbXrJyHIXHjDy4LukkqDM6MMYjP+Cs3gum6XmaqGpO88MXG9Tw+nqqnw7YWXiG4QiKR8DwPNVCRPIh54CPHnGBbMcZQQJAQYts2tGFZllFdqql5myy4rhuLxdDcDU8nSZJpmpPGkcoWREsPmOFAf7h0Ol0sFvv7+7EgBEEoWWOU+aWj02X5xhZ4Xy1kbIlS2HTAozZ5S8WwOEYISSQS2EWoyaOqKhwDVBS4BYabwhHZiRO5VYfUXXVh+sjP4lYs1HoDKSRBVCh/QJ584Ps+NA/YT7GdUCbarlFNs854hKArNT6DOEKc5DZr8AD8aUT2d10S+LRxKc4vWQPeCFAozlpIwGbChCkst4ERksDIxvPymq2KiqRr2LJAZBVF0TQtl8uR0Q2a+EsBW+J2Jz6Gpu6LlwtLvRDqfF6LZ48oYSFgerntCyojrhCNRguFgqZplFLTNAuFApRCURQNw8AaxpvF7cJ9Nw8wuISHaS+VSiiBNSUqSYv6z3ygJCxkGRA1FM8ployqx4dlJRoqHsD3AwkZTAVBMAxDCBJ3Qc5ANMEn0F0EFJ+XGCNBaCYJBE/XdWVVwVncsYnPvC4/C1nq62icYc2AjS6GA0LDhThN0+LxeNjEEeYWiqJYlgUvKDegN0v9KyeWi8bYotFoVAy8lyRkhgIPwOBh0kV6M+eRZaJ01XlA/A8JiB2/Dg4oO7dYLIJ+gZLiPaIvWJ3HqQTKa1uWxZ0BqNEULisdvjUOzuVylFLU4ubMsv6NKp+XhBRWrmnxjmZlMwabPufBYUUTr4Abr6DOojaqIAjRaDQWiwlBpFkikYDWi9VV1RF9IIEXTSmFE65UKnV2dra1tbV8AIcoCoUCCciBpmnYjbZti/IYS4JTf+wcbjMlo4NPYrEY5wrwO8GJl8/n0+l0JpPhFBzaMShLMpns6OgAkWWMqaqaK+S5bMupNiGEawBh6l9n2Nxcwzc8iD66G2JjmKaZyWQMw8D3fNvLshyNRuPxeCQS2bt3L8J1QD1RWB8905uaf06ySWBdQYnmrq4u27YNw4DnEwBjwASCPcTj8Wg0SimFqYRz2TJFpxIgwWDAhBBcEza68Nj4Z13XcWU/qMXERfimgGAYmPJUVQU9sm27r68v/FoDi73Q09ODiC/P80qlEo9Vq2riq0NYUdYbgg4JGYLCcQQktH7w9klIr+JsjxvNYrGYLMvFYjGTyeTzebi1dF2HW0vTtGg0CtUQV8ABNPD2Nzt1kwKuypAgJV4QhP7+/sn0AYz51xZmDrh4jjASEkjfru/VOoWOjpcgISkMhBJCK4R3gVDQR0mS8vn89u3bN27cuGvXrldeeWXfvn3pdBrkAJo1RGnLspLJ5JIlS5Dkdeyxx65YsSKVSqElCzeL8xgMvmm5raaOD4CEBHmItNBINm3atHHjxq1bt+ZyuUwms2fPnnw+jxpzJPAJJ5PJefPmLVy4sLOzc+XKlUuWLOnq6srn89lsFuXykVXQ1PyXMQBQ8FKp9PDDD2/btu2FF17YtWsXLM4jvpmgHL+mafPmzTvyyCMXL16cSqXe9KY3gSzyqai/B+GkEQTBtu3h4WH0uSQhPlp2PAJaGGORSCQWi2maFrbFNQ5FUXRdp5Tu3bt348aNmzZt6uvrsyzrxRdfhF2Lv1/YyjHJS5cuXbFixRFHHNHe3g6+WHnl+jOPd00ptSyrUCggJRCepLDxkIQ0SAwV7AePCZF57ty5nuc999xzjz/++JYtW/r7+3O5HMQm7B3GWCKROPnkk1etWrV48eLDDjsslUoVi0XLsjRNkyQJRzY1b5MFrDGQfjxgPp9/8MEHJb5uwrLDuNnUxPnbdHHIQw3YEr7v67qeyWS48yqsMlcivGe4aizLMvaVZVme58XjcUppNKLv27fvhRdeeP7559esWfP8888XCgX026q8DgnMu/39/Zs2bSKEiKI4d+7cuXPnvvncc84///yOjg6ECQ0ODkYikWKxmEgkCoVCZ2dnf38/ISQajRJCXNcVqWDbtq7ruVyura3NcZxCoaDruu96pVIpEokkkknLsnbu3Pn0008/88wzTzzxRD6fLxaLYbWmzJQUlqnnH7ZgwYIFb3vb284///zu7m40EkC0YrFY9H2/vb19aGhozpw5g4OD4LKO46iqWiwWU6kU5Pq2trZMJhOLxbAtC4XCmjVr7r333nXr1vXv62MhVL41QsiWzS/95dHHwMCOPPLI008//d3vfveKFSvy+bxhGNFoVFGUbDabTCaHh4ej0ShoKzwZmqLati1SoWTZX/3KP7344ouKopimibdf+caj8RiY9Fvf+tYvfOEL8MBDgq7KA2RRQvmNaDSKIyEdO47z8P/++bnnnnvxxRefe+65XC4HlavWStv60haoPp2dnatXrz755JNPOeWUlStX5osFVVU5R0T8VR3PqkgFx7J1XXdt54tfuOHFF19UVRUDC69hgYcRe142m/3Xf/3Xiy66aPfu3YsXLzZN02IkGU889sij995775///OehoSESVNUnowUjQsiGdet/cdfPBUE4//zzr7jiilWrVplGSSBU1yL5bE6PRUmFSWpKwW+B2DkwP+iaTz31VCsPoIUJIZ/Pg5BBznIcJxaL9fX13f2LX/7lL3/5y1/+AjEWFhV4yapeh9d55tbw3t7evXv3Pvf83374wx++5z3vueyyyxYsWBCLxRhjsNHLspzJZKLRKOgRj+wWRdE0zWQyaRiG53mJRIIxViqVOjo6CCEvv/zyn//853vuueell15CnTicCCEOgiFX9iuxe9eugYGBp59++gc/+MEVV1xx5ZVXdnd3Dw4OIuojFosVCoVIJJLL5aLRKGMMFjbP82Kx2MDAQFtbmyAI+/btQ6P5/v7+Bx544H/+53+2bNlimqZj2wLdz4DD1IHPGxQdqFmU0nXr1m3fvv2//uu/zj333C9/+ctLlix5+eWXPc9DFzME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";
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
