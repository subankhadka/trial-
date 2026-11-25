import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarCheck2,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  Download,
  FileClock,
  FileText,
  LayoutDashboard,
  LocateFixed,
  LogOut,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  SlidersHorizontal,
  Sparkles,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";

type View =
  | "Dashboard"
  | "Attendance"
  | "Employees"
  | "Leave management"
  | "Reports & analytics"
  | "Office & shifts"
  | "Activity logs"
  | "Settings";
type Status = "Present" | "Late" | "On leave" | "Incomplete" | "Holiday";

type AttendanceRow = {
  name: string;
  initials: string;
  department: string;
  time: string;
  hours: string;
  status: Status;
  tone: "green" | "amber" | "purple" | "red" | "slate";
  verification: string;
};

const navigation: { label: View; icon: typeof LayoutDashboard; section?: string }[] = [
  { label: "Dashboard", icon: LayoutDashboard, section: "WORKSPACE" },
  { label: "Attendance", icon: CalendarCheck2 },
  { label: "Employees", icon: Users, section: "MANAGE" },
  { label: "Leave management", icon: FileText },
  { label: "Reports & analytics", icon: BarChart3, section: "INSIGHTS" },
  { label: "Office & shifts", icon: MapPin },
  { label: "Activity logs", icon: FileClock },
  { label: "Settings", icon: Settings2, section: "SYSTEM" },
];

const people = [
  { name: "Anisha Rai", initials: "AR", role: "Product designer", department: "Design", color: "coral" },
  { name: "Bikash Thapa", initials: "BT", role: "Backend engineer", department: "Engineering", color: "blue" },
  { name: "Kabita Shrestha", initials: "KS", role: "Marketing executive", department: "Marketing", color: "violet" },
  { name: "Nabin Gurung", initials: "NG", role: "Product manager", department: "Product", color: "green" },
  { name: "Pratiksha Joshi", initials: "PJ", role: "Finance associate", department: "Finance", color: "gold" },
];

const attendance: AttendanceRow[] = [
  { name: "Anisha Rai", initials: "AR", department: "Design", time: "09:42 AM", hours: "07h 18m", status: "Present", tone: "green", verification: "Verified" },
  { name: "Bikash Thapa", initials: "BT", department: "Engineering", time: "09:58 AM", hours: "07h 02m", status: "Present", tone: "green", verification: "Verified" },
  { name: "Kabita Shrestha", initials: "KS", department: "Marketing", time: "10:16 AM", hours: "06h 44m", status: "Late", tone: "amber", verification: "Review" },
  { name: "Nabin Gurung", initials: "NG", department: "Product", time: "—", hours: "—", status: "On leave", tone: "purple", verification: "Approved" },
  { name: "Pratiksha Joshi", initials: "PJ", department: "Finance", time: "09:38 AM", hours: "07h 22m", status: "Present", tone: "green", verification: "Verified" },
];

const chartBars = [58, 70, 54, 78, 66, 82, 74, 91, 78, 86, 68, 97, 83, 73, 88, 80, 94, 76, 89, 92, 84];

function Avatar({ initials, color = "green", size = "medium" }: { initials: string; color?: string; size?: "small" | "medium" | "large" }) {
  return <span className={`avatar avatar-${color} avatar-${size}`}>{initials}</span>;
}

function StatusPill({ status, tone }: { status: string; tone: AttendanceRow["tone"] }) {
  return (
    <span className={`status-pill status-${tone}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
  trend,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Users;
  tone: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className={`metric-icon metric-${tone}`}><Icon size={17} strokeWidth={2.2} /></span>
        <span className="metric-label">{label}</span>
        <MoreHorizontal size={17} className="metric-more" />
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">
        {trend && (trend === "up" ? <ArrowUpRight size={14} className="trend-up" /> : <ArrowDownRight size={14} className="trend-down" />)}
        <span>{note}</span>
      </div>
    </div>
  );
}

function VerificationItem({ icon: Icon, label, value, good = true }: { icon: typeof LocateFixed; label: string; value: string; good?: boolean }) {
  return (
    <div className="verification-item">
      <span className={`verification-icon ${good ? "verification-good" : "verification-warn"}`}><Icon size={16} /></span>
      <span className="verification-copy"><strong>{label}</strong><small>{value}</small></span>
      {good ? <CheckCircle2 size={15} className="verification-check" /> : <AlertTriangle size={15} className="verification-alert" />}
    </div>
  );
}

function Dashboard({
  onAction,
  onOpenEmployee,
  notice,
}: {
  onAction: (message: string) => void;
  onOpenEmployee: () => void;
  notice: string;
}) {
  const [range, setRange] = useState("This week");
  const [department, setDepartment] = useState("All departments");
  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><Sparkles size={13} /> TODAY, TUESDAY 24 NOVEMBER 2026</div>
          <h1>Good morning, Suban.</h1>
          <p className="page-subtitle">Here’s the attendance pulse for your team. Everyone’s in sync.</p>
        </div>
        <div className="header-actions">
          <button className="button button-quiet" onClick={() => onAction("Report export is being prepared") }><Download size={16} /> Export report</button>
          <button className="button button-primary" onClick={onOpenEmployee}><Plus size={17} /> Take attendance</button>
        </div>
      </section>

      {notice && <div className="notice-bar"><CheckCircle2 size={16} /><span>{notice}</span><button onClick={() => onAction("")} aria-label="Dismiss notification"><X size={15} /></button></div>}

      <section className="metric-grid">
        <MetricCard label="Total employees" value="42" note="3 added this month" icon={Users} tone="green" trend="up" />
        <MetricCard label="Present today" value="34" note="81% of your team" icon={CheckCircle2} tone="blue" trend="up" />
        <MetricCard label="Absent today" value="05" note="2 more than yesterday" icon={UserRound} tone="coral" trend="down" />
        <MetricCard label="Pending requests" value="03" note="Needs your review" icon={Clock3} tone="gold" />
      </section>

      <section className="dashboard-grid dashboard-grid-top">
        <div className="panel trend-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">ATTENDANCE OVERVIEW</span><h2>Team presence</h2></div>
            <div className="panel-controls"><div className="segmented-control">{["This week", "This month"].map(item => <button key={item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>{item}</button>)}</div><button className="icon-button" title="More options"><MoreHorizontal size={18} /></button></div>
          </div>
          <div className="chart-legend"><span><i className="legend-dot legend-green" />Present</span><span><i className="legend-dot legend-sand" />Late / review</span><span className="chart-total"><strong>86.4%</strong> average presence</span></div>
          <div className="bar-chart" aria-label={`Attendance chart for ${range}`}>
            <div className="chart-y-labels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
            <div className="chart-area"><div className="chart-grid-lines"><span /><span /><span /><span /><span /></div><div className="bar-list">{chartBars.map((height, index) => <div className="bar-wrap" key={index}><div className={`chart-bar ${index === 11 ? "bar-highlight" : ""}`} style={{ height: `${height}%` }}><span>{index === 11 ? "94%" : ""}</span></div>{[0, 4, 8, 12, 16, 20].includes(index) && <small>{["18 Nov", "19 Nov", "20 Nov", "21 Nov", "22 Nov", "24 Nov"][Math.floor(index / 4)]}</small>}</div>)}</div></div>
          </div>
        </div>

        <div className="panel presence-panel">
          <div className="panel-heading"><div><span className="panel-kicker">LIVE STATUS</span><h2>Today at a glance</h2></div><span className="live-label"><i /> Live</span></div>
          <div className="donut-wrap"><div className="donut"><div className="donut-inner"><strong>34</strong><span>present</span></div></div><div className="donut-summary"><div><span className="summary-dot summary-present" /><strong>34</strong><span>Present</span></div><div><span className="summary-dot summary-late" /><strong>03</strong><span>Late</span></div><div><span className="summary-dot summary-leave" /><strong>05</strong><span>Leave / absent</span></div></div></div>
          <div className="panel-footnote"><span><Clock3 size={14} /> Last sync 2 min ago</span><button className="text-button" onClick={() => onAction("Attendance data is already up to date")}>Refresh <ArrowUpRight size={14} /></button></div>
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid-bottom">
        <div className="panel table-panel">
          <div className="panel-heading table-heading"><div><span className="panel-kicker">RECENT ATTENDANCE</span><h2>Who’s in today</h2></div><button className="text-button" onClick={() => onAction("Opening the full attendance register")}>View all <ChevronRight size={15} /></button></div>
          <div className="table-toolbar"><div className="search-field"><Search size={16} /><input aria-label="Search attendance" placeholder="Search by name or department" /><kbd>⌘ K</kbd></div><button className="filter-button" onClick={() => onAction("Filters are ready for your attendance register")}><SlidersHorizontal size={15} /> Filter</button></div>
          <div className="attendance-table"><div className="table-row table-head"><span>EMPLOYEE</span><span>CHECK-IN</span><span>HOURS</span><span>STATUS</span><span>VERIFY</span><span /></div>{attendance.map((row) => <div className="table-row" key={row.name}><span className="person-cell"><Avatar initials={row.initials} color={row.tone === "green" ? "green" : row.tone === "amber" ? "gold" : row.tone === "purple" ? "violet" : "coral"} size="small" /><span><strong>{row.name}</strong><small>{row.department}</small></span></span><span className="time-cell">{row.time}</span><span className="hours-cell">{row.hours}</span><span><StatusPill status={row.status} tone={row.tone} /></span><span className={`verify-label ${row.verification === "Verified" ? "verified" : row.verification === "Review" ? "review" : "approved"}`}><span />{row.verification}</span><button className="row-menu" title={`More actions for ${row.name}`}><MoreHorizontal size={16} /></button></div>)}</div>
        </div>

        <div className="panel attention-panel">
          <div className="panel-heading"><div><span className="panel-kicker">NEEDS ATTENTION</span><h2>Review queue <span className="count-badge">3</span></h2></div><button className="icon-button" title="More options"><MoreHorizontal size={18} /></button></div>
          <div className="review-list"><div className="review-item"><span className="review-icon review-amber"><Clock3 size={16} /></span><div><strong>Kabita arrived late</strong><p>Checked in at 10:16 AM · 16 min late</p></div><ChevronRight size={16} className="review-arrow" /></div><div className="review-item"><span className="review-icon review-coral"><LocateFixed size={16} /></span><div><strong>Location needs review</strong><p>Bikash Thapa · 126m from office</p></div><ChevronRight size={16} className="review-arrow" /></div><div className="review-item"><span className="review-icon review-purple"><FileText size={16} /></span><div><strong>Leave request pending</strong><p>Roshni Karki · 24–25 Nov</p></div><ChevronRight size={16} className="review-arrow" /></div></div>
          <button className="button button-outline full-button" onClick={() => onAction("Opening all review requests")}>Review all requests <ArrowUpRight size={15} /></button>
        </div>
      </section>
    </>
  );
}

function EmployeeView({ onAction, onBack }: { onAction: (message: string) => void; onBack: () => void }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const handleAttendance = () => {
    setCheckedIn(true);
    onAction("Check-in recorded and sent for verification");
  };
  return (
    <div className="employee-view">
      <section className="welcome-row employee-welcome"><div><button className="back-link" onClick={onBack}><ChevronRight size={15} className="back-chevron" /> Admin dashboard</button><div className="eyebrow"><Sparkles size={13} /> TUESDAY 24 NOVEMBER 2026 · KATHMANDU</div><h1>Your attendance, made simple.</h1><p className="page-subtitle">Good morning, Suban. You’re all set for another productive day.</p></div><div className="header-actions"><button className="button button-quiet" onClick={() => setShowLeave(true)}><FileText size={16} /> Request leave</button><button className="button button-primary" onClick={handleAttendance} disabled={checkedIn}>{checkedIn ? <><Check size={17} /> Checked in</> : <><CalendarCheck2 size={17} /> Check in now</>}</button></div></section>
      <section className="employee-grid">
        <div className="panel punch-panel"><div className="panel-heading"><div><span className="panel-kicker">TODAY’S ATTENDANCE</span><h2>{checkedIn ? "You’re checked in" : "Not checked in yet"}</h2></div><span className={`status-pill ${checkedIn ? "status-green" : "status-slate"}`}><span className="status-dot" />{checkedIn ? "Present" : "Ready"}</span></div><div className="punch-time"><span>{checkedIn ? "09:43" : "--:--"}</span><small>AM</small></div><div className="punch-meta"><span><Clock3 size={14} /> Check-in time</span><span className="punch-divider" /><span>{checkedIn ? "07h 17m elapsed" : "Shift starts at 10:00 AM"}</span></div><button className={`button ${checkedIn ? "button-outline" : "button-primary"} punch-button`} onClick={handleAttendance} disabled={checkedIn}>{checkedIn ? <><CheckCircle2 size={17} /> Attendance recorded</> : <><CalendarCheck2 size={17} /> Complete check-in</>}</button><div className="verification-block"><div className="verification-heading"><span>VERIFICATION CHECKLIST</span><small>{checkedIn ? "All checks passed" : "Ready when you are"}</small></div><VerificationItem icon={LocateFixed} label="GPS location" value="Within 100m of Nirkar office" /><VerificationItem icon={Camera} label="Selfie capture" value="Front camera ready" /><VerificationItem icon={Smartphone} label="Registered device" value="Pixel 8 · Approved" /></div></div>
        <div className="employee-side-stack"><div className="panel summary-panel"><div className="panel-heading"><div><span className="panel-kicker">THIS MONTH</span><h2>Your summary</h2></div><CalendarDays size={18} className="muted-icon" /></div><div className="summary-stats"><div><strong>18</strong><span>Present</span></div><div><strong>01</strong><span>Late</span></div><div><strong>02</strong><span>Leave</span></div></div><div className="progress-line"><span style={{ width: "86%" }} /></div><div className="summary-foot"><span>Attendance rate</span><strong>86.4%</strong></div></div><div className="panel mini-history"><div className="panel-heading"><div><span className="panel-kicker">RECENT HISTORY</span><h2>Last 5 days</h2></div><button className="text-button" onClick={() => onAction("Opening your full attendance history")}>View all <ChevronRight size={15} /></button></div><div className="mini-history-list">{["Mon, 23 Nov", "Fri, 20 Nov", "Thu, 19 Nov", "Wed, 18 Nov", "Tue, 17 Nov"].map((day, index) => <div className="mini-history-row" key={day}><span className={`day-status ${index === 1 ? "day-late" : "day-present"}`}><Check size={12} /></span><span>{day}</span><strong>{index === 1 ? "10:14 AM" : "09:" + [41, 46, 52, 38][index % 4] + " AM"}</strong><small>{index === 1 ? "Late" : "Present"}</small></div>)}</div></div></div>
      </section>
      {showLeave && <LeaveModal onClose={() => setShowLeave(false)} onSubmit={() => { setShowLeave(false); onAction("Leave request sent to your administrator"); }} />}
    </div>
  );
}

function LeaveModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="leave-title" onMouseDown={event => event.stopPropagation()}><div className="modal-header"><div><span className="panel-kicker">TIME AWAY</span><h2 id="leave-title">Request leave</h2></div><button className="icon-button" onClick={onClose} aria-label="Close leave request"><X size={18} /></button></div><label>Leave type<select defaultValue="Paid time off"><option>Paid time off</option><option>Sick leave</option><option>Personal leave</option></select></label><div className="form-row"><label>From<input type="text" defaultValue="24 Nov 2026" /></label><label>To<input type="text" defaultValue="25 Nov 2026" /></label></div><label>Reason<textarea defaultValue="Personal appointment" rows={3} /></label><div className="modal-actions"><button className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={onSubmit}>Send request <ArrowUpRight size={15} /></button></div></div></div>;
}

function ListPage({ view, onAction }: { view: View; onAction: (message: string) => void }) {
  const content = {
    Attendance: { eyebrow: "ATTENDANCE REGISTER", title: "Attendance records", copy: "Review and manage every check-in, check-out, and verification event.", icon: CalendarCheck2, button: "Add manual record" },
    Employees: { eyebrow: "PEOPLE DIRECTORY", title: "Employees", copy: "Keep employee profiles, departments, and device approvals in one place.", icon: Users, button: "Add employee" },
    "Leave management": { eyebrow: "TIME AWAY", title: "Leave management", copy: "Review upcoming leave requests and keep staffing plans clear.", icon: FileText, button: "Review requests" },
    "Reports & analytics": { eyebrow: "INSIGHTS", title: "Reports & analytics", copy: "Turn verified attendance data into clear, export-ready summaries.", icon: BarChart3, button: "Build a report" },
    "Office & shifts": { eyebrow: "WORKPLACE SETTINGS", title: "Office & shifts", copy: "Manage locations, working hours, grace periods, and attendance rules.", icon: MapPin, button: "Add office" },
    "Activity logs": { eyebrow: "AUDIT TRAIL", title: "Activity logs", copy: "See who changed what across your attendance workspace.", icon: FileClock, button: "Export logs" },
    Settings: { eyebrow: "SYSTEM", title: "Settings", copy: "Configure organization preferences, permissions, and notification rules.", icon: Settings2, button: "Save changes" },
  }[view as Exclude<View, "Dashboard">] ?? { eyebrow: "WORKSPACE", title: view, copy: "Your workspace is ready for the next step.", icon: LayoutDashboard, button: "Create" };
  const Icon = content.icon;
  return <section className="empty-section"><div className="section-header-card"><div><span className="panel-kicker">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.copy}</p></div><button className="button button-primary" onClick={() => onAction(`${content.button} flow opened`)}><Plus size={17} /> {content.button}</button></div><div className="empty-state"><div className="empty-icon"><Icon size={26} /></div><h2>{view === "Employees" ? "42 teammates, one source of truth." : "A focused workspace for your next action."}</h2><p>This section is connected to the Nirkar Attendance navigation and ready for the next data-backed phase.</p><button className="button button-outline" onClick={() => onAction("Sample data loaded for this view")}><Sparkles size={15} /> Preview sample data</button></div></section>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("Dashboard");
  const [employeeMode, setEmployeeMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notice, setNotice] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const showNotice = (message: string) => {
    setNotice(message);
    if (message) window.setTimeout(() => setNotice(current => current === message ? "" : current), 3400);
  };

  const greeting = useMemo(() => employeeMode ? "My attendance" : activeView, [activeView, employeeMode]);

  return <div className={`app-shell ${darkMode ? "theme-dark" : ""}`}>
    <aside className={`sidebar ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"} ${mobileNavOpen ? "mobile-open" : ""}`}>
      <div className="brand-row"><div className="brand-mark"><span /><span /></div>{sidebarOpen && <div className="brand-name">Nirkar <em>Attendance</em></div>}<button className="sidebar-close-mobile" onClick={() => setMobileNavOpen(false)}><X size={18} /></button></div>
      <div className="sidebar-org"><div className="org-avatar">NC</div>{sidebarOpen && <div className="org-copy"><strong>Nirkar & Co.</strong><span>Admin workspace</span></div>}{sidebarOpen && <ChevronDown size={15} className="org-chevron" />}</div>
      <nav className="main-nav">{navigation.map((item, index) => <div key={item.label}>{item.section && sidebarOpen && <div className="nav-section-label">{item.section}</div>}<button className={`nav-item ${activeView === item.label && !employeeMode ? "nav-active" : ""}`} onClick={() => { setActiveView(item.label); setEmployeeMode(false); setMobileNavOpen(false); }} title={!sidebarOpen ? item.label : undefined}><item.icon size={18} strokeWidth={activeView === item.label && !employeeMode ? 2.4 : 1.85} />{sidebarOpen && <span>{item.label}</span>}{sidebarOpen && item.label === "Leave management" && <span className="nav-count">3</span>}</button></div>)}</nav>
      <div className="sidebar-bottom"><button className={`employee-switch ${employeeMode ? "switch-active" : ""}`} onClick={() => { setEmployeeMode(true); setActiveView("Dashboard"); setMobileNavOpen(false); }}><div className="employee-switch-icon"><UserRound size={17} /></div>{sidebarOpen && <span><strong>Employee view</strong><small>Preview as Suban</small></span>}{sidebarOpen && <ChevronRight size={15} />}</button><div className="sidebar-footer"><button className="nav-item footer-item" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">{darkMode ? <Sun size={17} /> : <Moon size={17} />}{sidebarOpen && <span>{darkMode ? "Light mode" : "Dark mode"}</span>}</button>{sidebarOpen && <div className="user-mini" onClick={() => setProfileOpen(!profileOpen)}><Avatar initials="SK" color="green" size="small" /><span><strong>Suban Khadka</strong><small>Administrator</small></span><MoreHorizontal size={16} /></div>}</div></div>
      {profileOpen && sidebarOpen && <div className="profile-popover"><button onClick={() => showNotice("Profile settings opened")}><UserRound size={15} /> Profile settings</button><button onClick={() => showNotice("You are securely signed out of the preview")}><LogOut size={15} /> Sign out</button></div>}
    </aside>

    <main className={`main-content ${sidebarOpen ? "main-wide" : "main-full"}`}>
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu-button" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button><button className="collapse-button" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}</button><div className="breadcrumb"><span>Nirkar Attendance</span><ChevronRight size={14} /><strong>{greeting}</strong></div></div><div className="topbar-right"><div className="top-date"><CalendarDays size={15} /> <span>Tue, 24 Nov 2026</span></div><div className="topbar-divider" /><div className="notification-wrap"><button className="icon-button top-icon" onClick={() => setNotificationOpen(!notificationOpen)} aria-label="Notifications"><Bell size={18} /><i /></button>{notificationOpen && <div className="notification-popover"><div className="popover-heading"><strong>Notifications</strong><span>3 new</span></div><div className="notification-item"><span className="notification-dot green-dot" /><div><strong>Attendance synced</strong><small>All records are up to date</small></div></div><div className="notification-item"><span className="notification-dot amber-dot" /><div><strong>3 requests need review</strong><small>Leave and attendance exceptions</small></div></div><button className="text-button" onClick={() => setNotificationOpen(false)}>Mark all as read <Check size={14} /></button></div>}</div><div className="top-profile"><Avatar initials="SK" color="green" size="small" /><div><strong>Suban</strong><small>Admin</small></div><ChevronDown size={14} /></div></div></header>
      <div className="page-content">{employeeMode ? <EmployeeView onAction={showNotice} onBack={() => setEmployeeMode(false)} /> : activeView === "Dashboard" ? <Dashboard onAction={showNotice} onOpenEmployee={() => setEmployeeMode(true)} notice={notice} /> : <ListPage view={activeView} onAction={showNotice} />}</div>
    </main>
  </div>;
}
