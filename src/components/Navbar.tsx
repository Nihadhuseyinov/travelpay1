import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe2, 
  Sparkles, 
  UserCheck, 
  QrCode, 
  Menu, 
  X,
  Bell
} from 'lucide-react';
import { TouristProfile } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tourist: TouristProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenAi: () => void;
  onOpenKyc: () => void;
  onOpenQuickPay: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tourist,
  language,
  setLanguage,
  onOpenAi,
  onOpenKyc,
  onOpenQuickPay,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const navLinks = [
    { id: 'overview', label: t.nav.overview },
    { id: 'payments', label: t.nav.payments },
    { id: 'converter', label: t.nav.converter },
    { id: 'crypto', label: t.nav.crypto },
    { id: 'analytics', label: t.nav.analytics },
    { id: 'security', label: t.nav.security },
  ];

  const sampleNotifications = [
    { id: 1, title: 'ƏDV Geri Al (Tax Free) Hesablandı', desc: '+11.25 AZN Şirvanşah Restoranından qayıtdı', time: '12:35' },
    { id: 2, title: 'GYD Aeroport Xoş Gəlmisiniz', desc: '3 muzeyə 15% endirim kartınıza tətbiq edildi', time: '10:14' },
    { id: 3, title: 'Trust Score Yeniləndi', desc: 'Skorunuz 96/100 A+ təyin olundu (0 AZN depozit)', time: 'Dünən' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#071220]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Sovereign Micro Ribbon */}
      <div className="bg-[#0A182B] border-b border-slate-800/80 px-4 py-1 text-[11px] text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400">AMB</span>
          <span className="text-slate-500">·</span>
          <span className="truncate text-slate-300">{t.centralBankBadge}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onOpenAi} 
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer text-[11px] font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Köməkçi</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setLanguage(language === 'az' ? 'en' : 'az')}
            className="flex items-center gap-1 font-mono text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
            title="Dili Dəyiş / Switch Language"
          >
            <Globe2 className="w-3 h-3 text-slate-400" />
            <span className="uppercase font-bold">{language === 'az' ? 'EN' : 'AZ'}</span>
          </button>
        </div>
      </div>

      {/* Main Top Navigation (Strict 3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Authentic Central Bank Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#071220] rounded-[7px] flex items-center justify-center text-amber-400 font-extrabold text-lg">
                ₼
              </div>
            </div>
            <div>
              <span className="text-base font-bold text-white group-hover:text-amber-300 transition-colors whitespace-nowrap block leading-tight">
                MƏRKƏZİ BANK
              </span>
              <span className="text-[10px] font-mono tracking-wider text-amber-400/90 block leading-tight uppercase">
                TravelPay
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean 5 nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap transition-colors py-1 cursor-pointer relative ${
                  isActive 
                    ? 'text-amber-400 font-semibold' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Notification, Profile, & Quick Pay */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative cursor-pointer"
              title="Bildirişlər"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0A1628] border border-slate-800 rounded-xl shadow-2xl p-3 space-y-2 z-50 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Bildirişlər</span>
                  <span className="text-[10px] text-amber-400 font-mono">3 Yeni</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {sampleNotifications.map((n) => (
                    <div key={n.id} className="p-2 bg-slate-900/80 rounded-lg space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                        <span className="truncate">{n.title}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tourist Profile */}
          <button
            onClick={onOpenKyc}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-400/50 transition-colors cursor-pointer text-left"
            title="Turist Profili və KYC"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400/80 shrink-0">
              <img 
                src={tourist.avatarUrl} 
                alt={tourist.fullName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-[11px] font-semibold text-slate-200 truncate max-w-[90px]">
                {tourist.fullName.split(' ')[0]}
              </div>
              <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>{tourist.trustScore} Skor</span>
              </div>
            </div>
          </button>

          {/* Quick Pay Action */}
          <button
            onClick={onOpenQuickPay}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md transition-all active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.hero.quickPay}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1628] border-b border-slate-800 px-4 py-3 space-y-1.5">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-xs font-semibold ${
                activeTab === link.id
                  ? 'bg-amber-400/10 text-amber-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                onOpenKyc();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-slate-300"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>KYC: {tourist.kycStatus}</span>
            </button>
            <button
              onClick={() => {
                onOpenAi();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-amber-400 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Köməkçi</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

