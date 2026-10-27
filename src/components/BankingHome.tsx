import React, { useState } from 'react';
import { 
  Plus, 
  ArrowRight, 
  CreditCard, 
  QrCode, 
  Search, 
  BarChart2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  PlaneLanding, 
  ChevronRight,
  TrendingUp,
  Receipt,
  FileText,
  Clock,
  ExternalLink,
  Lock,
  WifiOff,
  Coins
} from 'lucide-react';
import { TouristProfile, Transaction, ExchangeRate } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BankingHomeProps {
  tourist: TouristProfile;
  setTourist: React.Dispatch<React.SetStateAction<TouristProfile>>;
  transactions: Transaction[];
  rates: ExchangeRate[];
  onOpenQuickPay: () => void;
  onOpenTransfer: () => void;
  onOpenTopUp: () => void;
  onOpenConverter: () => void;
  onOpenCrypto: () => void;
  onOpenSecurity: () => void;
  onOpenVat: () => void;
  onOpenAi: () => void;
  onSelectReceipt: (tx: Transaction) => void;
  onOpenStory: (storyId: string) => void;
}

export const BankingHome: React.FC<BankingHomeProps> = ({
  tourist,
  setTourist,
  transactions,
  rates,
  onOpenQuickPay,
  onOpenTransfer,
  onOpenTopUp,
  onOpenConverter,
  onOpenCrypto,
  onOpenSecurity,
  onOpenVat,
  onOpenAi,
  onSelectReceipt,
  onOpenStory,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [cardExpanded, setCardExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'yesterday'>('all');

  // Realistic Azerbaijani Central Bank tourist balances
  const totalBalance = tourist.balances.AZN + (tourist.balances.USD * 1.70);
  const personalFunds = tourist.balances.AZN;
  const sovereignCreditLimit = 15000.00; // Mərkəzi Bank Dövlət Zəmanətli Turist Limiti (Depozitsiz)

  const stories = [
    { id: 'qr', title: '0.3s QR', icon: '⚡', subtitle: 'Anti-Fraud' },
    { id: 'offline', title: 'Dağ Rejimi', icon: '⛰️', subtitle: 'Offline QR' },
    { id: 'fx', title: '0% Spred', icon: '💱', subtitle: 'Rəsmi Kurs' },
    { id: 'crypto', title: 'Kripto Otel', icon: '💎', subtitle: 'USDT / BTC' },
    { id: 'edv', title: 'ƏDV Geri Al', icon: '🧾', subtitle: 'Tax Free' },
    { id: 'ai', title: 'AI Bələdçi', icon: '🤖', subtitle: 'Bakı Turu' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Phone Canvas Container */}
      <div className="w-full max-w-[440px] rounded-[38px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(2,8,20,0.85)] border border-[#1C3A63] bg-[#07162C] relative flex flex-col min-h-[840px]">
        {/* Top Sovereign Ambient (Ciddi Tünd Mavi & Qızılı Aksentlər) */}
        <div className="bg-gradient-to-b from-[#0D223F] via-[#091A32] to-[#061324] pt-8 pb-5 px-5 text-white relative border-b border-[#16335B]">
          {/* Subtle Coat of Arms Emblem Watermark */}
          <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
            <div className="w-36 h-36 rounded-full border-4 border-amber-300 flex items-center justify-center font-serif text-6xl font-black text-amber-200">
              ₼
            </div>
          </div>

          {/* Status / Header bar inside app */}
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-900 border border-amber-400/80 p-0.5 shadow-md">
                <img 
                  src={tourist.avatarUrl} 
                  alt={tourist.fullName} 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight">
                    {tourist.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded font-mono border border-amber-400/30">
                    A+ 96
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-300 tracking-wider uppercase block mt-0.5">
                  MƏRKƏZİ BANK TURİST PASS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAi}
                className="p-2 rounded-full bg-[#10284A] hover:bg-[#173866] text-amber-300 transition-colors cursor-pointer shadow-sm border border-[#204477]"
                title="AI Səyahət Köməkçisi"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-full bg-[#10284A] hover:bg-[#173866] text-slate-200 transition-colors cursor-pointer shadow-sm border border-[#204477]"
                title={showBalance ? 'Balansı Gizlət' : 'Balansı Göstər'}
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Stories Bar (Yeniliklər / Highlights) */}
          <div className="relative z-10 mb-4 -mx-1 flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {stories.map((s) => (
              <button
                key={s.id}
                onClick={() => onOpenStory(s.id)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-sky-300 to-amber-500 shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#08182D] flex items-center justify-center text-lg">
                    {s.icon}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-200 tracking-tight whitespace-nowrap">
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Main Balance Display (Ciddi Tünd Mavi zəmində Ağımtıl Bulud Rəngli Balans) */}
          <div className="text-center relative z-10 my-3">
            <div className="flex items-center justify-center gap-1 text-white">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums text-slate-50 drop-shadow-sm">
                {showBalance ? '18 000' : '••••••'}
              </span>
              <span className="text-lg font-bold font-mono text-amber-300">
                {showBalance ? '.00 ₼' : ''}
              </span>
            </div>

            {/* Subtext: Şəxsi vəsaitlər & Zəmanət limiti */}
            <div className="mt-2 flex flex-col items-center gap-1 text-[11px] font-medium text-slate-300">
              <div className="flex items-center justify-between w-60 px-2 py-0.5 rounded bg-[#0A1F3B]/80 border border-[#1E3C66]">
                <span className="text-slate-300">Şəxsi vəsaitlər</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {showBalance ? `${personalFunds.toFixed(2)} ₼` : '••••'}
                </span>
              </div>
              <div className="flex items-center justify-between w-60 px-2 py-0.5 rounded bg-[#0A1F3B]/80 border border-[#1E3C66]">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>Zəmanət limiti</span>
                  <span className="text-[9px] text-amber-300 font-bold">✓ AMB</span>
                </span>
                <span className="font-mono font-bold text-amber-300 tabular-nums">
                  {showBalance ? '15 000.00 ₼' : '••••'}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Circular Quick Action Buttons (Ciddi Tünd Mavi və Qızılı Aksentlər) */}
          <div className="grid grid-cols-3 gap-2 mt-5 mb-2 relative z-10 px-2">
            {/* Action 1: Balansın artırılması */}
            <button
              onClick={onOpenTopUp}
              className="flex flex-col items-center gap-1.5 text-center cursor-pointer group"
            >
              <div className="w-13 h-13 rounded-full bg-[#10284A] hover:bg-[#173866] text-amber-300 border border-[#21487D] flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200 leading-tight">
                Balansın<br />artırılması
              </span>
            </button>

            {/* Action 2: Karta köçürmə */}
            <button
              onClick={onOpenTransfer}
              className="flex flex-col items-center gap-1.5 text-center cursor-pointer group"
            >
              <div className="w-13 h-13 rounded-full bg-[#10284A] hover:bg-[#173866] text-sky-300 border border-[#21487D] flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                <ArrowRight className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200 leading-tight">
                Karta<br />köçürmə
              </span>
            </button>

            {/* Action 3: QR ilə Ödə */}
            <button
              onClick={onOpenQuickPay}
              className="flex flex-col items-center gap-1.5 text-center cursor-pointer group"
            >
              <div className="w-13 h-13 rounded-full bg-[#10284A] hover:bg-[#173866] text-amber-300 border border-[#21487D] flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                <QrCode className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200 leading-tight">
                Risk-Free<br />QR Ödə
              </span>
            </button>
          </div>

          {/* Peeking Sovereign Card (Just like in the screenshot with Leobank card peeking) */}
          <div className="mt-4 -mb-8 relative z-20 flex justify-center">
            <div
              onClick={() => setCardExpanded(!cardExpanded)}
              className="w-[92%] rounded-2xl p-4 bg-gradient-to-br from-[#0B1E38] via-[#071526] to-[#030914] border-2 border-amber-400/70 shadow-2xl cursor-pointer hover:border-amber-300 transition-all text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-xs">
                    ₼
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider text-amber-300 font-sans block leading-none">
                      MƏRKƏZİ BANK
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-medium block">
                      AZƏRBAYCAN RESPUBLİKASI
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-5 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner p-0.5 border border-amber-300/40" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    NFC
                  </span>
                </div>
              </div>

              {cardExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs font-mono space-y-1.5 animate-fade-in">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[10px] text-slate-400 uppercase">Kart No</span>
                    <span className="tracking-widest font-bold">4098 8120 9410 8920</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[10px] text-slate-400 uppercase">Sahibi</span>
                    <span className="font-bold">{tourist.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[10px] text-slate-400 uppercase">Bitmə / CVV</span>
                    <span>12/28 · CVV: 894</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sheet / Activity Feed (Ağımtıl Bulud Rəngi / Misty Cloud-White Sheet) */}
        <div className="flex-1 bg-gradient-to-b from-[#F4F7FB] via-[#EFF3F8] to-[#E6EDF5] text-slate-900 rounded-t-[34px] pt-12 pb-20 px-5 shadow-[0_-10px_30px_rgba(0,0,0,0.25)] relative z-10 space-y-4 border-t border-[#D3DFED]">
          {/* Header of Activity Sheet: Date summary, Search & Analytics */}
          <div className="flex items-center justify-between pb-1 border-b border-[#D8E3EF]">
            <div>
              <span className="text-[11px] font-bold text-[#475569] uppercase font-mono tracking-wider">
                BU GÜN, 32.50 ₼
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenVat}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                title="Xərclər və Analitika"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button 
                onClick={onOpenQuickPay}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                title="Axtarış"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Today's Transactions (From screenshot: Medicat, Taxi 24/7) */}
          <div className="space-y-2">
            {/* Item 1: Medicat */}
            <div 
              onClick={() => onSelectReceipt(transactions[1])}
              className="bg-white/90 hover:bg-white border border-[#DCE4F0] p-2.5 rounded-2xl flex items-center justify-between shadow-xs transition-all cursor-pointer group hover:border-amber-400/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-lg shadow-xs">
                  ❤️
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1A30] block group-hover:text-amber-600 transition-colors">
                    Medicat
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Gözəllik və tibb
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-[#0A1A30] tabular-nums">
                  29.00 ₼
                </span>
                <span className="text-[10px] text-emerald-600 font-mono block font-semibold">
                  +2.61 ₼ ƏDV
                </span>
              </div>
            </div>

            {/* Item 2: Taxi 24/7 */}
            <div 
              onClick={() => onSelectReceipt(transactions[3])}
              className="bg-white/90 hover:bg-white border border-[#DCE4F0] p-2.5 rounded-2xl flex items-center justify-between shadow-xs transition-all cursor-pointer group hover:border-amber-400/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs shadow-xs font-mono">
                  🚕
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1A30] block group-hover:text-amber-600 transition-colors">
                    Taxi 24/7
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Taksi Bakı
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-[#0A1A30] tabular-nums">
                  3.50 ₼
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  NFC Ani
                </span>
              </div>
            </div>
          </div>

          {/* Yesterday Header (From screenshot: DÜNƏN, 34.25 ₼) */}
          <div className="pt-2 border-t border-[#D5DFEC] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#475569] uppercase font-mono tracking-wider">
              DÜNƏN, 34.25 ₼
            </span>
          </div>

          <div className="space-y-2">
            {/* Item 3: Aslan (Karta köçürmə) */}
            <div 
              onClick={() => onSelectReceipt(transactions[0])}
              className="bg-white/90 hover:bg-white border border-[#DCE4F0] p-2.5 rounded-2xl flex items-center justify-between shadow-xs transition-all cursor-pointer group hover:border-amber-400/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A1D36] text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
                  👤
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1A30] block group-hover:text-amber-600 transition-colors">
                    Aslan
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Karta köçürmə
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-[#0A1A30] tabular-nums">
                  30.00 ₼
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  AÖS Ani
                </span>
              </div>
            </div>

            {/* Item 4: Coffee Shop */}
            <div 
              onClick={() => onSelectReceipt(transactions[2])}
              className="bg-white/90 hover:bg-white border border-[#DCE4F0] p-2.5 rounded-2xl flex items-center justify-between shadow-xs transition-all cursor-pointer group hover:border-amber-400/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base shadow-xs">
                  ☕
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1A30] block group-hover:text-amber-600 transition-colors">
                    Coffee Shop Baku
                  </span>
                  <span className="text-[11px] text-slate-500">
                    İçərişəhər · Kafe
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-[#0A1A30] tabular-nums">
                  4.25 ₼
                </span>
                <span className="text-[10px] text-emerald-600 font-mono block font-semibold">
                  +0.38 ₼ ƏDV
                </span>
              </div>
            </div>

            {/* Item 5: Fairmont Baku Flame Towers */}
            <div 
              onClick={() => onSelectReceipt(transactions[0])}
              className="bg-white/90 hover:bg-white border border-[#DCE4F0] p-2.5 rounded-2xl flex items-center justify-between shadow-xs transition-all cursor-pointer group hover:border-amber-400/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base shadow-xs">
                  🏨
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1A30] block group-hover:text-amber-600 transition-colors">
                    Fairmont Flame Towers
                  </span>
                  <span className="text-[11px] text-slate-500">
                    0 AZN Depozit · Kripto USDT
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-[#0A1A30] tabular-nums">
                  480.00 ₼
                </span>
                <span className="text-[10px] text-emerald-600 font-mono block font-semibold">
                  +43.20 ₼ ƏDV
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar (Misty Cloud-White + Deep Navy) */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#F8FAFC]/95 backdrop-blur-md border-t border-[#D5DFEC] px-3 py-2.5 flex items-center justify-around z-30 shadow-md">
          {/* Nav Item 1: Ana səhifə */}
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-0.5 text-[#0A1D36] cursor-pointer"
          >
            <div className="w-5 h-5 flex items-center justify-center text-[#0A1D36]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0A1D36] stroke-none">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold tracking-tight">
              Ana səhifə
            </span>
          </button>

          {/* Nav Item 2: Valyuta / Məzənnə */}
          <button
            onClick={onOpenConverter}
            className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#0A1D36] cursor-pointer transition-colors"
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">
              Valyuta
            </span>
          </button>

          {/* Nav Item 3: Kripto Wallet */}
          <button
            onClick={onOpenCrypto}
            className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#0A1D36] cursor-pointer transition-colors"
          >
            <Coins className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">
              Kripto
            </span>
          </button>

          {/* Nav Item 4: ƏDV geri al */}
          <button
            onClick={onOpenVat}
            className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#0A1D36] cursor-pointer transition-colors"
          >
            <Receipt className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">
              ƏDV geri al
            </span>
          </button>

          {/* Nav Item 5: Təhlükəsizlik */}
          <button
            onClick={onOpenSecurity}
            className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#0A1D36] cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">
              Təhlükəsizlik
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
