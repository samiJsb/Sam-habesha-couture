import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Key, ChevronRight, CheckCircle, Flame, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { user, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  // In-memory bypass for local testers/hirers to demo admin controls easily
  const [bypassSuccess, setBypassSuccess] = useState(false);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#030303]">
      <div className="w-8 h-8 border-4 border-[#D4C3AC] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // If already logged in, go straight to public landing or operations control
  if (user || bypassSuccess) {
    return <Navigate to="/admin" replace />;
  }

  // Handle immediate sandbox profile injection to bypass iframe Google blockers
  const triggerSandboxBypass = (role: 'Owner/Admin' | 'Kitchen Manager' | 'Staff Cashier') => {
    localStorage.setItem('GURSHA_SANDBOX_USER', JSON.stringify({
      uid: 'bypass-889',
      displayName: `Samuel (${role === 'Owner/Admin' ? 'Atelier Director' : role === 'Kitchen Manager' ? 'Showroom Designer' : 'Lead Dressmaker'})`,
      email: 'directory@habeshacouture.com',
      role: 'admin',
      roleTag: role
    }));
    setBypassSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,195,172,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#D4C3AC_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/')} 
          className="mb-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500 hover:text-[#D4C3AC] transition-all cursor-pointer font-bold duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Boutique Avenue
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0A0A0D] border border-[#141414] p-8 md:p-10 rounded-none shadow-[0_20px_84px_rgba(0,0,0,0.95)]"
        >
          {/* Brand Panel */}
          <div className="text-center mb-8 space-y-3">
            <div className="flex flex-col items-center">
              <span className="text-sm tracking-[0.35em] font-serif font-black text-[#D4C3AC]">HABESHA COUTURE</span>
              <span className="text-[8px] tracking-[0.45em] text-zinc-500 uppercase font-serif mt-1">CLIENT & STAFF ROOM</span>
            </div>
            <div className="h-[1px] bg-[#141414] w-full mt-4" />
          </div>

          <div className="space-y-6">
            
            <div className="p-4 bg-black/60 border border-[#141414] border-l-2 border-l-[#D4C3AC]">
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">PREVIEW CREDENTIAL ENGINE</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-wider">AWAITING CLIENT SECURE PASSKEY...</span>
              </div>
            </div>

            {/* Standard Signature */}
            <button
              onClick={async () => {
                try {
                  await loginWithGoogle();
                } catch (e: any) {
                  setAuthError("Auth popup was blocked by browser framing. Please use the pre-authorized Atelier roles below to preview!");
                }
              }}
              className="w-full py-4 bg-[#D4C3AC] hover:bg-white text-black text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer duration-300"
            >
              Sign In with Google Cloud
            </button>

            {authError && (
              <p className="text-[8px] text-zinc-400 uppercase tracking-wider text-center font-bold">
                {authError}
              </p>
            )}

            {/* Sandbox Quick Access Roles */}
            <div className="pt-6 border-t border-[#141414] space-y-3">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] block">
                ATELIER ROLES PRE-AUTHS
              </span>
              
              <div className="space-y-2">
                {[
                  { title: 'Atelier Director', desc: 'Direct operations, inspect financial turnover, manage consultations', role: 'Owner/Admin' },
                  { title: 'Showroom Designer', desc: 'Curate luxury looks and publish pieces to the Avenue catalog', role: 'Kitchen Manager' },
                  { title: 'Lead Dressmaker', desc: 'Manage active weaver progress & customer delivery dispatches', role: 'Staff Cashier' }
                ].map(profile => (
                  <button
                    key={profile.title}
                    onClick={() => triggerSandboxBypass(profile.role as any)}
                    className="w-full text-left p-4 bg-black hover:bg-[#0E0E12] border border-[#141414] hover:border-[#D4C3AC]/25 flex items-center justify-between transition-all group cursor-pointer rounded-none duration-300"
                  >
                    <div>
                      <h4 className="text-[10px] font-bold text-[#F5F5F7] uppercase tracking-wider group-hover:text-[#D4C3AC] transition-colors">
                        {profile.title}
                      </h4>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-tighter mt-1 line-clamp-1">
                        {profile.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Micro details */}
            <div className="pt-4 flex justify-between text-[7px] font-mono text-zinc-600 uppercase tracking-widest border-t border-[#141414]">
              <span>PROD_GATEWAY: ACTIVE</span>
              <span>API_VER: 2.0.0</span>
            </div>
          </div>
        </motion.div>
        
        <p className="text-center mt-8 text-[8px] font-medium text-zinc-600 uppercase tracking-[0.25em]">
          HABESHA COUTURE &copy; {new Date().getFullYear()} &bull; BOLE ATELIER CORRIDOR
        </p>
      </div>
    </div>
  );
}
