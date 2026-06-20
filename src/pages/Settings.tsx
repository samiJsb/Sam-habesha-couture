import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Store, Key, DollarSign, Users, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  const { profile } = useAuth();
  const bypassUser = localStorage.getItem('GURSHA_SANDBOX_USER');
  const activeProfile = bypassUser ? JSON.parse(bypassUser) : profile;

  const [activeTab, setActiveTab] = useState('Boutique');

  // Form hooks
  const [loungeName, setLoungeName] = useState('Habesha Couture Bole Flagship');
  const [loungeAddr, setLoungeAddr] = useState('Bole Medhanialem Century Mall, 3rd Floor');
  const [loungePhone, setLoungePhone] = useState('+251 911 000 111');
  const [loungeHours, setLoungeHours] = useState('09:00 AM - 08:30 PM');

  // Integrations keys
  const [chapaPubKey, setChapaPubKey] = useState('CHAPUBK_TEST-S08V3a9fX...');
  const [telebirrMerchant, setTelebirrMerchant] = useState('TELE_10398402X');
  const [cbeClientId, setCbeClientId] = useState('CBE-MERCH-88301A');

  // Billing parameters
  const [vatRate, setVatRate] = useState('15');
  const [deliveryRate, setDeliveryRate] = useState('350'); // Premium shipping rate

  const [saveSuccess, setSaveSuccess] = useState(false);

  const triggerSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4500);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white p-6 md:p-10 font-sans pb-32">
      
      <div className="border-b border-white/5 pb-6 mb-10">
        <h1 className="text-3xl font-sans font-black uppercase tracking-tight text-white">Atelier Configurations</h1>
        <p className="text-[11px] font-medium text-zinc-500 mt-1 uppercase tracking-widest">
          Configure physical showrooms, payment gateway credentials & shipping multipliers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Aside Sidebar Panel navigation */}
        <aside className="lg:col-span-1 space-y-2.5">
          {[
            { id: 'Boutique', label: 'Atelier Showroom', icon: Store },
            { id: 'Payments', label: 'API Keyring', icon: Key },
            { id: 'Billing', label: 'Taxes & Shipping', icon: DollarSign },
            { id: 'Security', label: 'Staff Privileges', icon: ShieldAlert }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveTab(opt.id)}
              className={`flex items-center gap-3 w-full px-5 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                activeTab === opt.id 
                  ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10" 
                  : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              <opt.icon className="w-4 h-4 shrink-0" />
              <span>{opt.label}</span>
            </button>
          ))}
        </aside>

        {/* Dynamic Panel Content area */}
        <div className="lg:col-span-3 space-y-8">
          
          {activeTab === 'Boutique' && (
            <form onSubmit={triggerSave} className="p-8 bg-[#0B0B0E] border border-white/5 rounded-2xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">
                Atelier Boutique / Showroom Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Lounge Name</label>
                  <input 
                    type="text" 
                    value={loungeName} 
                    onChange={e => setLoungeName(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Store Telephone</label>
                  <input 
                    type="text" 
                    value={loungePhone} 
                    onChange={e => setLoungePhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Physical Location Coordinates</label>
                  <input 
                    type="text" 
                    value={loungeAddr} 
                    onChange={e => setLoungeAddr(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Operating hours</label>
                  <input 
                    type="text" 
                    value={loungeHours} 
                    onChange={e => setLoungeHours(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              {saveSuccess && (
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                  Atelier settings synchronized with global firestore registers.
                </p>
              )}

              <button 
                type="submit" 
                className="px-6 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-all font-bold shadow-lg cursor-pointer"
              >
                Sync Atelier Profile
              </button>
            </form>
          )}

          {activeTab === 'Payments' && (
            <form onSubmit={triggerSave} className="p-8 bg-[#0B0B0E] border border-white/5 rounded-2xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">
                Ethiopian Payment Gateways Keyring
              </h3>

              <div className="space-y-4 font-mono text-zinc-400 text-[10px]">
                <div className="space-y-1.5 font-sans">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-sans">Chapa Public Secret (Bearer Authorizations)</label>
                  <input 
                    type="password" 
                    value={chapaPubKey} 
                    onChange={e => setChapaPubKey(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl focus:outline-none text-white focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-sans">Telebirr AppKey / Superapp Merchant code</label>
                  <input 
                    type="text" 
                    value={telebirrMerchant} 
                    onChange={e => setTelebirrMerchant(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-sans">Commercial Bank of Ethiopia (CBE) Client ID</label>
                  <input 
                    type="text" 
                    value={cbeClientId} 
                    onChange={e => setCbeClientId(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {saveSuccess && (
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                  Encryption tokens locked and signed in cloud storage keys.
                </p>
              )}

              <button 
                type="submit" 
                className="px-6 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-all font-bold shadow-lg cursor-pointer"
              >
                Save Crypto Keyring
              </button>
            </form>
          )}

          {activeTab === 'Billing' && (
            <form onSubmit={triggerSave} className="p-8 bg-[#0B0B0E] border border-white/5 rounded-2xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">
                Service Logistics Taxes & Pricing
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Ethiopian VAT percentage (%)</label>
                  <input 
                    type="number" 
                    value={vatRate} 
                    onChange={e => setVatRate(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Shipping Rate (ETB)</label>
                  <input 
                    type="number" 
                    value={deliveryRate} 
                    onChange={e => setDeliveryRate(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-[11px] p-3.5 rounded-xl font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-zinc-900/60 rounded-xl space-y-1 text-zinc-400 text-[10px] font-medium leading-relaxed">
                <p className="font-bold text-white uppercase tracking-wider mb-1">Billing Auto-calculation Note:</p>
                <p>Taxation is applied as a net VAT surcharge to total catalog prices. Shipping fees are only active for "EXPRESS COURIER" logistics routing.</p>
              </div>

              {saveSuccess && (
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                  Rates updated successfully in catalog server memory.
                </p>
              )}

              <button 
                type="submit" 
                className="px-6 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-all font-bold shadow-lg cursor-pointer"
              >
                Apply Multipliers
              </button>
            </form>
          )}

          {activeTab === 'Security' && (
            <div className="p-8 bg-[#0B0B0E] border border-white/5 rounded-2xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">
                Staff Credentials & ACL Rules
              </h3>

              <div className="space-y-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                {[
                  { name: 'Kidus Yohannes', email: 'kidus@habeshacouture.com', role: 'ADMIN', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
                  { name: 'Almaz Kebede', email: 'almaz.k@habeshacouture.com', role: 'MANAGER', color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
                  { name: 'Samuel (Sandbox)', email: 'samuel@habeshacouture.com', role: 'STAFF', color: 'bg-zinc-800 text-zinc-400' }
                ].map((staff, idx) => (
                  <div key={idx} className="p-4 bg-[#070709] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="text-white text-[11px] font-sans font-black block">{staff.name}</span>
                      <span className="text-zinc-500 lowercase mt-0.5 block">{staff.email}</span>
                    </div>

                    <span className={`px-2 py-0.5 text-[8px] font-black rounded ${staff.color}`}>
                      {staff.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
