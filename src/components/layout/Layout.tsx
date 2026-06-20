import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus,
  ArrowLeft,
  Store,
  Clock,
  Activity,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border-l cursor-pointer ${
        active 
          ? "text-white border-white bg-white/[0.03] font-bold" 
          : "text-zinc-500 border-transparent hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="font-sans">{label}</span>
      {active && (
        <motion.div
          layoutId="active-dot"
          className="ml-auto w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        />
      )}
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle support of fast sandbox bypasses 
  const bypassUser = localStorage.getItem('GURSHA_SANDBOX_USER');
  const activeProfile = bypassUser ? JSON.parse(bypassUser) : profile;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Atelier Ledger', path: '/admin' },
    { icon: BarChart3, label: 'Revenue Stream', path: '/analytics' },
    { icon: Settings, label: 'Configurations', path: '/settings' },
  ];

  const currentPathLabel = menuItems.find(i => i.path === location.pathname)?.label || 'Atelier Operations';

  const handleAdminLogout = () => {
    localStorage.removeItem('GURSHA_SANDBOX_USER');
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#030303] text-[#F5F5F7] font-sans overflow-hidden">
      
      {/* Sidebar navigation drawer */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 250 : 0 }}
        className="relative flex flex-col h-full bg-[#070707] border-r border-[#141414] overflow-hidden shrink-0"
      >
        <div className="flex flex-col h-24 px-8 justify-center border-b border-[#141414]">
          <div className="text-[7px] tracking-[0.3em] font-black text-zinc-500 uppercase">SYS_NODE_LOC: BOLE</div>
          <div className="text-sm font-serif font-bold tracking-widest text-[#D4C3AC] mt-1">HABESHA COUTURE</div>
        </div>

        <nav className="flex-1 py-12 space-y-1.5">
          <SidebarItem
            icon={LayoutDashboard}
            label="Atelier Ledger"
            active={location.pathname === '/admin'}
            onClick={() => navigate('/admin')}
          />
          <SidebarItem
            icon={BarChart3}
            label="Revenue Stream"
            active={location.pathname === '/analytics'}
            onClick={() => navigate('/analytics')}
          />
          <SidebarItem
            icon={Settings}
            label="Configurations"
            active={location.pathname === '/settings'}
            onClick={() => navigate('/settings')}
          />

          {/* Quick return to public showroom */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-[#D4C3AC] transition-all border-l border-transparent mt-16 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-zinc-500" />
            <span>Public Showroom</span>
          </button>
        </nav>

        <div className="p-6 space-y-4 border-t border-[#141414] bg-[#050505]">
          <div className="p-4 bg-zinc-950/80 border border-[#141414] rounded-lg">
            <span className="text-[7px] uppercase tracking-[0.25em] text-zinc-500 block mb-1">State</span>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#D4C3AC] rounded-full animate-pulse mr-0.5" />
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Active online</span>
            </div>
          </div>
          
          {activeProfile && (
            <div className="flex items-center gap-3 px-1.5 pt-2">
              <UserCheck className="w-4 h-4 text-[#D4C3AC] shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[9px] font-bold text-white truncate uppercase tracking-widest">{activeProfile.displayName}</p>
                <button 
                  onClick={handleAdminLogout} 
                  className="text-[8px] text-red-400/80 hover:text-red-400 uppercase font-bold tracking-wider transition-colors block mt-0.5 cursor-pointer"
                >
                  Terminate session
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Arena */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header toolbar */}
        <header className="h-24 border-b border-[#141414] flex items-center justify-between px-8 bg-[#050505]/40 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="hover:text-white transition-colors cursor-pointer text-[#D4C3AC] font-bold">MENU</button>
            <span className="text-zinc-800">/</span>
            <span className="text-white font-bold">{currentPathLabel.toUpperCase()}</span>
          </div>

          <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest font-mono">
            <div className="flex flex-col items-end">
              <span className="text-zinc-600 font-bold text-[8px]">Uptime score</span>
              <span className="text-emerald-400 font-bold">99.992%</span>
            </div>
            <div className="w-[1px] h-6 bg-white/5"></div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-[#D4C3AC] hover:bg-white text-black px-5 py-3 rounded-md text-[9px] font-bold tracking-[0.15em] transition-all cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              BOUTIQUE SHOWROOM
            </button>
          </div>
        </header>

        {/* Outer scrolling content body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 pb-32">
          {children}
        </div>

        {/* Mini diagnostics system dock trailing line footer */}
        <footer className="bg-[#030303] border-t border-[#141414] px-8 py-4 flex items-center justify-between z-[50]">
          <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-widest font-mono text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-[#D4C3AC] rounded-full animate-pulse" />
              <span className="text-[#D4C3AC]">Atelier Router Stable</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div>
              Platform: <span className="text-zinc-400 font-sans font-bold">EXPRESS + VITE + TAILWIND</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-700">
            <span>SECURE_JWT: ALIGN</span>
            <span>CHAPA_WEBHOOK: HOOKED</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
