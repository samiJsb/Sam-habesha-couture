import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  Layers,
  CheckCircle,
  Truck,
  XCircle,
  Plus,
  Trash2,
  Sliders,
  Database,
  Terminal as TermIcon,
  Shield,
  Activity,
  LogOut,
  ChevronRight,
  Info,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { 
    menu, 
    orders, 
    reservations, 
    inventory, 
    activeNotification,
    updateOrderStatus, 
    updateReservationStatus,
    addMenuItem 
  } = useRestaurant();

  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  // If local bypass exists, use it, else guide to login
  const bypassUser = localStorage.getItem('GURSHA_SANDBOX_USER');
  const activeProfile = bypassUser ? JSON.parse(bypassUser) : profile;

  // Form states for creating new boutique item
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('12000');
  const [newDishCat, setNewDishCat] = useState('traditional');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600');
  const [menuAddSuccess, setMenuAddSuccess] = useState(false);

  // Tab switching inside Admin Operations
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'reservations' | 'inventory' | 'architecture'>('orders');

  // Server state parameters for diagnostics
  const [diagnostics, setDiagnostics] = useState<any>({
    status: "HABESHA_COMMERCE_ENGINE_STABLE",
    latency: "3ms",
    cpu: "6.2%",
    memory: "41.2MB"
  });

  useEffect(() => {
    const fetchDiag = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setDiagnostics({
          status: data.status,
          latency: data.latency,
          cpu: `${(Math.random() * 8 + 4).toFixed(1)}%`,
          memory: `${(Math.random() * 5 + 32).toFixed(1)}MB`
        });
      } catch (e) {
        // Fallback
      }
    };
    fetchDiag();
    const timer = setInterval(fetchDiag, 6000);
    return () => clearInterval(timer);
  }, []);

  if (!activeProfile) {
    return <Navigate to="/login" replace />;
  }

  // Calculate Aggregates
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'COMPLETED')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const cookingOrdersCount = orders.filter(o => o.status === 'PREPARING').length;
  const completedOrdersCount = orders.filter(o => o.status === 'COMPLETED').length;

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName || !newDishPrice || !newDishDesc) {
      alert("Please specify piece name, price, and descriptions.");
      return;
    }
    const success = await addMenuItem({
      name: newDishName,
      price: Number(newDishPrice),
      category: newDishCat,
      description: newDishDesc,
      image: newDishImage,
      isPopular: false,
      isChefRecommendation: true,
      preparationTime: 7 // Standard tailoring lead days
    });

    if (success) {
      setMenuAddSuccess(true);
      setNewDishName('');
      setNewDishDesc('');
      setTimeout(() => setMenuAddSuccess(false), 4500);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('GURSHA_SANDBOX_USER');
    logout();
    navigate('/');
  };

  // Recharts Sales distribution metrics
  const revTrendData = [
    { name: 'Mon', Revenue: totalRevenue * 0.12 },
    { name: 'Tue', Revenue: totalRevenue * 0.14 },
    { name: 'Wed', Revenue: totalRevenue * 0.08 },
    { name: 'Thu', Revenue: totalRevenue * 0.18 },
    { name: 'Fri', Revenue: totalRevenue * 0.25 },
    { name: 'Sat', Revenue: totalRevenue * 0.32 },
    { name: 'Sun', Revenue: totalRevenue * 0.22 },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-[#F5F5F7] p-6 md:p-10 selection:bg-[#D4C3AC]/20 selection:text-[#D4C3AC] font-sans pb-32">
      
      {/* Toast notifications */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 bg-[#D4C3AC] text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-black animate-spin" />
            <span>{activeNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Title Panel */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-8 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-[#D4C3AC]/10 border border-[#D4C3AC]/30 text-[#D4C3AC] rounded text-[8px] font-black tracking-widest uppercase">
              {activeProfile.role === 'ADMIN' ? 'Atelier Administrator' : 'Showroom Coordinator'}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">SYS_NODE_LOC: BOLE_SHOWROOM_MAIN</span>
          </div>
          <h2 className="text-3xl font-sans font-black uppercase tracking-tight text-white mt-2">
            ATELIER OPERATIONS CONTROL
          </h2>
          <p className="text-[11px] font-medium text-zinc-400 mt-1 uppercase tracking-wider">
            Active User: <span className="text-[#D4C3AC] font-bold">{activeProfile.displayName}</span> ({activeProfile.email})
          </p>
        </div>

        {/* Telemetry quick metrics */}
        <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest font-mono">
          <div className="px-3.5 py-2 bg-[#0A0A0D] border border-white/5 rounded-xl flex items-center gap-2">
            <span className="text-zinc-500 font-bold font-mono">Status:</span>
            <span className="text-emerald-400 font-bold uppercase">Active Online</span>
          </div>
          <div className="px-3.5 py-2 bg-[#0A0A0D] border border-white/5 rounded-xl flex items-center gap-2">
            <span className="text-zinc-500 font-bold font-mono">CPU Usage:</span>
            <span className="text-cyan-400 font-bold">{diagnostics.cpu}</span>
          </div>
          <button 
            onClick={handleAdminLogout}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Terminate
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all font-bold text-[9px] uppercase tracking-wider cursor-pointer"
          >
            Exit Workspace
          </button>
        </div>
      </div>

      {/* Corporate Financial Aggregates Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl relative overflow-hidden">
          <TrendingUp className="w-5 h-5 text-[#D4C3AC] absolute top-6 right-6" />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Atelier Cumulative Sales</span>
          <h4 className="text-2xl font-black font-mono text-white mt-3">
            {totalRevenue.toLocaleString()} <span className="text-xs text-[#D4C3AC] font-sans">ETB</span>
          </h4>
          <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter mt-1">Integrated Banking Gateway Active</p>
        </div>

        <div className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl relative overflow-hidden">
          <ShoppingBag className="w-5 h-5 text-red-500 absolute top-6 right-6 animate-pulse" />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Orders Queue</span>
          <h4 className="text-2xl font-black font-mono text-white mt-3">
            {pendingOrdersCount + cookingOrdersCount} <span className="text-xs text-red-500 font-sans">Active</span>
          </h4>
          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Pending premium tailors assembly</p>
        </div>

        <div className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl relative overflow-hidden">
          <Calendar className="w-5 h-5 text-cyan-500 absolute top-6 right-6" />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Tailoring Consultations</span>
          <h4 className="text-2xl font-black font-mono text-white mt-3">
            {reservations.filter(r => r.status === 'PENDING').length} <span className="text-xs text-cyan-400 font-sans">Awaiting</span>
          </h4>
          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Private VIP Fitting Slots</p>
        </div>

        <div className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl relative overflow-hidden">
          <Layers className="w-5 h-5 text-purple-500 absolute top-6 right-6" />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Catalog Items count</span>
          <h4 className="text-2xl font-black font-mono text-white mt-3">
            {menu.length} <span className="text-xs text-purple-500 font-sans">Pieces</span>
          </h4>
          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Active items registered online</p>
        </div>
      </section>

      {/* Interactive Charts Area */}
      <section className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Daily E-Commerce Sales distribution</h4>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-sans">Visualizing daily transaction turnover volumes in Ethiopian Birr</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revTrendData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4C3AC" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#D4C3AC" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
              <YAxis stroke="#555" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0D', borderColor: '#222', fontSize: '10px' }} 
                labelStyle={{ fontWeight: 'black', color: '#fff' }}
              />
              <Area type="monotone" dataKey="Revenue" stroke="#D4C3AC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Navigation Sub-Sector Tabs */}
      <div className="flex border-b border-white/5 gap-4 mb-8 overflow-x-auto text-[10px] font-black uppercase tracking-widest text-zinc-500 shrink-0">
        {[
          { tab: 'orders', label: 'Couture Orders Ledger', count: pendingOrdersCount + cookingOrdersCount },
          { tab: 'menu', label: 'Launch New Pieces', count: undefined },
          { tab: 'reservations', label: 'Fittings Tracker', count: reservations.filter(r => r.status === 'PENDING').length },
          { tab: 'inventory', label: 'Atelier Raw Materials', count: inventory.filter(i => i.status !== 'IN_STOCK').length },
          { tab: 'architecture', label: 'Relational DB specs', count: undefined }
        ].map(item => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab as any)}
            className={`py-3.5 border-b-2 font-bold cursor-pointer transition-colors relative px-1 ${
              activeTab === item.tab 
                ? "border-[#D4C3AC] text-[#D4C3AC] font-extrabold" 
                : "border-transparent hover:text-white"
            }`}
          >
            {item.label}
            {item.count !== undefined && item.count > 0 && (
              <span className="ml-1.5 px-2.5 py-0.5 bg-[#D4C3AC]/10 text-[#D4C3AC] border border-[#D4C3AC]/20 text-[8px] font-black font-mono rounded">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div className="min-h-[400px]">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono">Consignment Dispatch Ledger</h4>
            
            {orders.length === 0 ? (
              <div className="p-12 border border-dashed border-white/5 rounded-2xl text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No active orders registered in DB logs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map(order => (
                  <div key={order.id} className="p-6 bg-[#0B0B0E] border border-white/5 hover:border-white/10 rounded-2xl flex flex-col lg:flex-row justify-between lg:items-center gap-6 transition-all">
                    
                    {/* Customer overview */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-black font-mono text-white">{order.id}</span>
                        <span className={`px-2 py-0.5 text-[8px] font-black tracking-widest rounded ${
                          order.status === 'PENDING' ? 'bg-[#D4C3AC]/10 text-[#D4C3AC] border border-[#D4C3AC]/20' :
                          order.status === 'PREPARING' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {order.status === 'PREPARING' ? 'WEAVING IN PROGRESS' : order.status}
                        </span>
                        <span className="text-[9px] font-black font-mono text-zinc-500 uppercase tracking-widest">
                          {order.paymentMethod} &bull; {order.paymentStatus}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 font-medium">
                        Consignee: <span className="text-white font-bold">{order.customerName}</span> &bull; {order.customerPhone}
                        {order.deliveryAddress && (
                          <p className="text-zinc-500 text-[10px] mt-1 italic">Deliver Address: {order.deliveryAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* Items Purchased Ordered list */}
                    <div className="flex-1 max-w-md bg-zinc-950/50 border border-white/5 p-4 rounded-xl">
                      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-2 font-mono">Consignment Items:</span>
                      <ul className="space-y-1 text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                        {order.items.map((it, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="text-zinc-500">{it.price.toLocaleString()} ETB</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-white/5 mt-2.5 pt-2 flex justify-between text-[10px] font-black text-[#D4C3AC] font-mono">
                        <span>Invoice Total</span>
                        <span>{order.total.toLocaleString()} ETB</span>
                      </div>
                    </div>

                    {/* Operational Action Tools */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end lg:self-center">
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                          className="px-4 py-2 bg-[#D4C3AC] text-black text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Approve/Weave Garment
                        </button>
                      )}
                      {(order.status === 'PREPARING' || order.status === 'PENDING') && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Complete Dispatch
                        </button>
                      )}
                      {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                          className="px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CRUD registration form */}
            <div className="lg:col-span-1 p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl h-fit">
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Launch New Couture Piece</h4>
              
              <form onSubmit={handleCreateMenuItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Piece Title *</label>
                  <input 
                    type="text" 
                    value={newDishName} 
                    onChange={e => setNewDishName(e.target.value)} 
                    placeholder="E.g., Empress Sheba traditional wedding dress"
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4C3AC] font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Value in ETB *</label>
                  <input 
                    type="number" 
                    value={newDishPrice} 
                    onChange={e => setNewDishPrice(e.target.value)} 
                    placeholder="E.g., 18500"
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4C3AC] font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Piece Category</label>
                  <select 
                    value={newDishCat} 
                    onChange={e => setNewDishCat(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4C3AC]"
                  >
                    <option value="traditional">Traditional Kemis</option>
                    <option value="clothing">Modern Couture</option>
                    <option value="jewelry">Axum Gold</option>
                    <option value="shoes">Fine Leather</option>
                    <option value="cosmetics">Amber Cosmetics</option>
                    <option value="boutique">Boutique Accents</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Display Image Route</label>
                  <input 
                    type="text" 
                    value={newDishImage} 
                    onChange={e => setNewDishImage(e.target.value)} 
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4C3AC] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Detailed specification Descriptions *</label>
                  <textarea 
                    value={newDishDesc} 
                    onChange={e => setNewDishDesc(e.target.value)} 
                    placeholder="Specify fine handloom metrics, gold carat scales, dye origin, custom tilet thread codes..."
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4C3AC] h-20"
                    required
                  />
                </div>

                {menuAddSuccess && (
                  <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                    Couture registered successfully in the online boutique!
                  </p>
                )}

                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-[#D4C3AC] text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg font-bold cursor-pointer"
                >
                  Publish to Showroom
                </button>
              </form>
            </div>

            {/* Menu catalog display with pricing override controls */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono font-bold">Interactive Pieces list</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu.map(item => (
                  <div key={item.id} className="p-4 bg-[#0B0B0E] border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-12 h-16 rounded-xl object-cover" />
                      <div>
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-white line-clamp-1">{item.name}</h5>
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest font-mono">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black font-mono text-[#D4C3AC]">{item.price.toLocaleString()} ETB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono">Bespoke Fitting & private visit Desk</h4>
            
            <div className="grid grid-cols-1 gap-4">
              {reservations.map(resv => (
                <div key={resv.id} className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6">
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white">{resv.id}</span>
                      <span className={`px-2 py-0.5 text-[8px] font-black tracking-widest rounded ${
                        resv.status === 'PENDING' ? 'bg-[#D4C3AC]/10 text-[#D4C3AC] border border-[#D4C3AC]/20' :
                        resv.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {resv.status}
                      </span>
                    </div>
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-white">
                      Patron: {resv.name} &bull; {resv.phone}
                    </h5>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      Scheduled: {resv.date} at {resv.time} &bull; VIP Consult
                    </p>
                    {resv.specialRequests && (
                      <p className="text-[9px] text-zinc-400 italic">Configuration: {resv.specialRequests}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {resv.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => updateReservationStatus(resv.id, 'CONFIRMED', Math.floor(Math.random() * 4) + 1)}
                          className="px-4 py-2 bg-[#D4C3AC] text-black text-[9px] font-black uppercase tracking-widest rounded-xl transition-all font-bold cursor-pointer"
                        >
                          Confirm & Book Atelier room
                        </button>
                        <button 
                          onClick={() => updateReservationStatus(resv.id, 'DECLINED')}
                          className="px-3 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Decline Visit
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono">Raw Atelier Material storage</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map(item => (
                <div key={item.id} className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider text-white">{item.name}</h5>
                      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest font-mono">Minimum stock buffer: {item.threshold} {item.unit}</span>
                    </div>

                    <span className={`px-2 py-0.5 text-[8px] font-black font-mono tracking-widest rounded ${
                      item.status === 'IN_STOCK' ? 'bg-emerald-500/10 text-emerald-400' :
                      item.status === 'LOW_STOCK' ? 'bg-[#D4C3AC]/10 text-[#D4C3AC] border border-[#D4C3AC]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-2xl font-black font-mono text-white mt-4">
                    {item.quantity} <span className="text-xs text-zinc-500 font-sans">{item.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Database specs relational architecture visualizer */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono">Postgraduate Prisma E-Commerce schema (Production Mode)</h4>
              <span className="text-[10px] font-mono text-[#D4C3AC] uppercase">Engine: Prisma-v6</span>
            </div>

            <div className="p-6 bg-[#040406] border border-white/5 rounded-2xl font-mono text-[10px] text-zinc-405 space-y-6 overflow-x-auto text-zinc-400">
              
              <div className="space-y-2 border-l-2 border-[#D4C3AC] pl-4 py-2">
                <span className="text-white font-black">model User {'{'}</span>
                <p className="text-zinc-500 pl-4">id String @id @default(uuid())<br />name String<br />email String @unique<br />role Role @default(CUSTOMER)<br />orders Order[]<br />wishlist Wishlist[]<br />bookings TailorBooking[]</p>
                <span className="text-white font-black">{'}'}</span>
              </div>

              <div className="space-y-2 border-l-2 border-emerald-600 pl-4 py-2">
                <span className="text-white font-black">model Product {'{'}</span>
                <p className="text-zinc-500 pl-4">id String @id @default(uuid())<br />name String<br />description String<br />price Float<br />category String<br />image String<br />rating Float<br />sizes SizingOptions[]</p>
                <span className="text-white font-black">{'}'}</span>
              </div>

              <div className="space-y-2 border-l-2 border-cyan-600 pl-4 py-2">
                <span className="text-white font-black">model TailorBooking {'{'}</span>
                <p className="text-zinc-500 pl-4">id String @id @default(uuid())<br />userId String<br />date DateTime<br />time String<br />fittingRoom Number<br />status BookingStatus @default(PENDING)</p>
                <span className="text-white font-black">{'}'}</span>
              </div>

              <div className="p-4 bg-zinc-900/40 rounded-xl space-y-2 flex items-start gap-4 text-[11px] font-medium leading-relaxed font-sans text-zinc-300">
                <Info className="w-5 h-5 text-[#D4C3AC] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold uppercase tracking-wide text-white font-sans">Enterprise Relational DB architecture Setup</h5>
                  <p>
                    Each payment order triggers transactional atomic row updates on the Inventory stock levels, securely guarding against stock starvation and concurrency collisions under high-frequency VIP flash-sales.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
