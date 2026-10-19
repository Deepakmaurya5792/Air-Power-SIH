import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Plane,
  BrainCircuit,
  Activity,
  Cpu,
  Wrench,
  Package,
  TrendingUp,
  Box,
  BarChart3,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Search,
  Bell,
  Radio,
  Clock,
  Compass,
  FileCheck
} from 'lucide-react';
import CinematicBackground from './CinematicBackground';

const navigationItems = [
  { name: 'Command Center', path: '/command-center', icon: LayoutDashboard, badge: null },
  { name: 'Fleet Overview', path: '/fleet', icon: Plane, badge: '150' },
  { name: 'Predictive Maintenance', path: '/predictive-ai', icon: BrainCircuit, badge: 'AI' },
  { name: 'Aircraft Health', path: '/aircraft-health', icon: Activity, badge: null },
  { name: 'Sensor Intelligence', path: '/sensor-intelligence', icon: Cpu, badge: 'Live' },
  { name: 'Maintenance Work Orders', path: '/work-orders', icon: Wrench, badge: null },
  { name: 'Spare Parts Inventory', path: '/inventory', icon: Package, badge: 'Low' },
  { name: 'Availability Forecast', path: '/forecast', icon: TrendingUp, badge: null },
  { name: 'Digital Twin', path: '/digital-twin', icon: Box, badge: null },
  { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3, badge: null },
  { name: 'Data Management', path: '/data-management', icon: Database, badge: null },
  { name: 'Settings & Audit', path: '/settings', icon: Settings, badge: null },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex relative overflow-hidden">
      {/* Background layer */}
      <CinematicBackground intensity="subtle" />

      {/* Sidebar */}
      <aside
        className={`relative z-20 flex flex-col transition-all duration-300 border-r border-sky-500/20 bg-white/95 backdrop-blur-md shadow-sm ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo / Header */}
        <div className="p-4 border-b border-sky-500/15 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/landing')}>
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center text-sky-600 font-bold shadow-sm">
                <Radio className="w-5 h-5 animate-pulse text-sky-600" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-wider text-slate-900">AIR POWER</h1>
                <p className="text-[10px] text-sky-600 tracking-widest font-mono uppercase font-semibold">Fleet Intelligence</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center text-sky-600 font-bold cursor-pointer" onClick={() => navigate('/landing')}>
              <Radio className="w-5 h-5 animate-pulse text-sky-600" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-sky-50 text-slate-400 hover:text-sky-600 border border-transparent hover:border-sky-500/20 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-700 border border-sky-500/40 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border hover:border-slate-200'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-500 group-hover:text-sky-600'}`} />
                {!collapsed && (
                  <span className="ml-3 truncate font-normal tracking-wide flex-1">{item.name}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase font-semibold ${
                    item.badge === 'AI' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    item.badge === 'Low' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Simulation Mode Badge */}
        <div className="p-3 border-t border-sky-500/15 bg-slate-50">
          {!collapsed ? (
            <div className="p-2.5 rounded-md border border-amber-400/50 bg-amber-50/80 flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider font-mono">SIMULATION MODE</p>
                <p className="text-[10px] text-amber-700 mt-0.5 leading-snug">Synthetic Defence Prototype. Fictional fleet records.</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-md border border-amber-400/50 bg-amber-50 flex items-center justify-center text-amber-600" title="SIMULATION MODE: Synthetic Prototype">
              <ShieldAlert className="w-4 h-4" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-sky-500/15 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between shadow-xs">
          {/* Breadcrumb & Search */}
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
              <span className="text-slate-400">AIR-NET</span>
              <span>/</span>
              <span className="text-sky-600 font-bold uppercase">{location.pathname.replace('/', '') || 'Command'}</span>
            </div>

            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search aircraft, work order, or component..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/fleet?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="w-full bg-slate-50 border border-sky-500/25 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500/30"
              />
            </div>
          </div>

          {/* Right Status Panel */}
          <div className="flex items-center space-x-4">
            {/* Clock */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-xs font-mono text-sky-800">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentTime} UTC</span>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-600 hover:text-slate-900 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 tech-panel rounded-xl shadow-2xl p-4 z-50 text-xs bg-white border border-sky-200">
                  <div className="flex items-between justify-between pb-2 border-b border-slate-200 mb-3">
                    <span className="font-semibold text-slate-800 uppercase tracking-wide">Tactical Notifications</span>
                    <span className="text-[10px] text-slate-500">3 Unread</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2 rounded bg-amber-50 border border-amber-200">
                      <p className="font-semibold text-amber-800">High Risk Component: CMP-074</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">Aircraft AIR-075 predicted 74.7% failure risk in next 30 days.</p>
                    </div>
                    <div className="p-2 rounded bg-sky-50 border border-sky-200">
                      <p className="font-semibold text-sky-800">Work Order Completed</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">WO-00002 for AIR-110 resolved by Unit-B.</p>
                    </div>
                    <div className="p-2 rounded bg-rose-50 border border-rose-200">
                      <p className="font-semibold text-rose-800">Spare Part Stock Alert</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">Filter Assembly (PART-001) below reorder threshold (7 left).</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                AP
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800">Aero Commander</p>
                <p className="text-[10px] font-mono text-emerald-600 font-bold">STATUS: ACTIVE</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
