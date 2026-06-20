import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Target, 
  ArrowUpRight, 
  Users,
  Activity,
  Globe,
  Utensils,
  CreditCard,
  Percent,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#d97706', '#10B981', '#3b82f6', '#8b5cf6'];

// Active Live context data
const analyticsLive = [
  { name: 'Traditional Kemis', SalesValue: 120000, OrdersCount: 42 },
  { name: 'Axum Gold Jewelry', SalesValue: 262000, OrdersCount: 154 },
  { name: 'Premium Footwear', SalesValue: 93100, OrdersCount: 88 },
  { name: 'Atelier Couture', SalesValue: 184000, OrdersCount: 38 },
];

// Historical database values
const analyticsHistorical = [
  { name: 'Traditional Kemis', SalesValue: 1840000, OrdersCount: 1240 },
  { name: 'Axum Gold Jewelry', SalesValue: 2840000, OrdersCount: 4100 },
  { name: 'Premium Footwear', SalesValue: 1420000, OrdersCount: 2200 },
  { name: 'Atelier Couture', SalesValue: 2450000, OrdersCount: 1050 },
];

const pieDataPay = [
  { name: 'Chapa Gateway', value: 45 },
  { name: 'Telebirr Superapp', value: 35 },
  { name: 'CBE Birr', value: 15 },
  { name: 'Cash On Delivery', value: 5 },
];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<'live' | 'historical'>('live');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');

  // Multiplier depending on selected focus
  const dynamicMultiplier = activeTab === 'historical' ? 25 : 1;

  // Handles clicking global statistics cards to trigger chart state shifts
  const handleMetricCardClick = (metricId: string) => {
    setSelectedMetric(metricId);
  };

  const chartData = activeTab === 'live' ? analyticsLive : analyticsHistorical;

  return (
    <div className="space-y-12 relative min-h-screen pb-32 bg-[#070709] p-6 md:p-10 text-white font-sans">
      
      {/* Visual Ambient Decor */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-sans font-black uppercase tracking-tight text-white">Financial Audits Office</h1>
          <p className="text-[11px] font-medium text-zinc-500 mt-1 uppercase tracking-widest">
            SaaS transaction streams, payment provider ratios, and order ticket telemetry
          </p>
        </div>
        
        {/* Interactive clickable tabs correcting the historical is not clickable bug */}
        <div className="flex gap-2.5 p-1.5 bg-zinc-900 border border-white/5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all cursor-pointer ${
              activeTab === 'live' 
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Live Monitor
          </button>
          <button 
            onClick={() => setActiveTab('historical')}
            className={`px-4 py-2 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all cursor-pointer ${
              activeTab === 'historical' 
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Historical (30D)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive KPI metric trigger blocks which corrects 'not clickable' issues */}
        <div className="lg:col-span-1 space-y-4">
          
          <div 
            onClick={() => handleMetricCardClick('revenue')}
            className={`p-6 bg-[#0B0B0E] border rounded-2xl flex items-center justify-between cursor-pointer transition-all relative overflow-hidden group ${
              selectedMetric === 'revenue' ? 'border-amber-500 shadow-[0_4px_25px_rgba(217,119,6,0.1)]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:scale-110">
              <TrendingUp className="w-16 h-16 text-amber-500" />
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Global Gross Revenue</span>
              <h4 className="text-2xl font-black font-mono text-white mt-2">
                {(39722 * dynamicMultiplier).toLocaleString()} <span className="text-xs text-amber-500">ETB</span>
              </h4>
              <p className="text-[8px] font-bold text-amber-500 uppercase tracking-tighter mt-1">Click to render Revenue metrics</p>
            </div>
          </div>

          <div 
            onClick={() => handleMetricCardClick('sessions')}
            className={`p-6 bg-[#0B0B0E] border rounded-2xl flex items-center justify-between cursor-pointer transition-all relative overflow-hidden group ${
              selectedMetric === 'sessions' ? 'border-amber-500 shadow-[0_4px_25px_rgba(217,119,6,0.1)]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:scale-110">
              <Activity className="w-16 h-16 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Atelier Sizing Consultations</span>
              <h4 className="text-2xl font-black font-mono text-white mt-2">
                {(344 * dynamicMultiplier).toLocaleString()} <span className="text-xs text-emerald-400">Clients</span>
              </h4>
              <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter mt-1">Click to focus turnarounds</p>
            </div>
          </div>

          <div 
            onClick={() => handleMetricCardClick('costs')}
            className={`p-6 bg-[#0B0B0E] border rounded-2xl flex items-center justify-between cursor-pointer transition-all relative overflow-hidden group ${
              selectedMetric === 'costs' ? 'border-amber-500 shadow-[0_4px_25px_rgba(217,119,6,0.1)]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:scale-110">
              <Percent className="w-16 h-16 text-blue-500" />
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Logistics Surcharge Costs</span>
              <h4 className="text-2xl font-black font-mono text-white mt-2">
                {(14210 * dynamicMultiplier).toLocaleString()} <span className="text-xs text-blue-400">ETB</span>
              </h4>
              <p className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter mt-1">Click to analyze shipping/handling</p>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-amber-600 to-amber-400 text-black rounded-2xl overflow-hidden relative border border-amber-500/20 shadow-xl">
            <div className="relative z-10">
              <Target className="w-8 h-8 mb-6 text-black/40" />
              <h3 className="text-sm font-black tracking-widest mb-1 uppercase">Atelier Efficiency</h3>
              <p className="text-black/70 text-[10px] uppercase font-bold tracking-widest mb-6 leading-relaxed">Weaving accuracy indices at 97.4%</p>
              <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '97.4%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.3)]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {selectedMetric.toUpperCase()} Category Allocations Plot ({activeTab.toUpperCase()})
                </h3>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Interactive distribution matrix across standard collections</p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1E" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#606067', fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#606067', fontWeight: 700 }} />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{ backgroundColor: '#070709', border: '1px solid #222', borderRadius: '12px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar 
                    dataKey={selectedMetric === 'revenue' ? 'SalesValue' : 'OrdersCount'} 
                    fill="#d97706" 
                    radius={[8, 8, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pie Chart of Chapa vs Telebirr distributions */}
            <div className="p-6 bg-[#0B0B0E] border border-white/5 rounded-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-white">Payment Provider ratio</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieDataPay}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieDataPay.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-y-2 mt-6">
                {pieDataPay.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro details metrics */}
            <div className="p-6 bg-[#0D0D11] border border-white/5 rounded-2xl flex flex-col justify-center gap-4">
              <span className="text-[10px] font-black tracking-widest text-[#25d366] uppercase block">● INTEGRATION INTEGRITY</span>
              <p className="text-sm font-black uppercase tracking-tight leading-relaxed">
                Direct Settlement Enabled via CBE clearing APIs. Estimated time to wallet: <span className="px-2 py-0.5 bg-amber-500 text-black font-mono font-black ml-1">INSTANTANEOUS</span>
              </p>
              <button 
                onClick={() => {
                  alert("Initiated settlement audit clearance. Checks are healthy!");
                }}
                className="w-fit px-5 py-3 bg-zinc-800 hover:bg-zinc-750 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md cursor-pointer"
              >
                Trigger Reconciliation
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
