import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  RefreshCw, 
  PlaneLanding, 
  CheckCircle2, 
  Send,
  Eye,
  EyeOff,
  Coins,
  Receipt,
  Copy,
  ChevronRight
} from 'lucide-react';
import { TouristProfile } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';

interface HeroSectionProps {
  tourist: TouristProfile;
  language: Language;
  onOpenQuickPay: () => void;
  onOpenTransfer: () => void;
  onOpenConverter: () => void;
  onOpenCrypto: () => void;
  onOpenAi: () => void;
  onOpenKyc: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  tourist,
  language,
  onOpenQuickPay,
  onOpenTransfer,
  onOpenConverter,
  onOpenCrypto,
  onOpenAi,
  onOpenKyc,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const t = TRANSLATIONS[language];

  // Total balance calculation
  const totalAZNEquiv = 
    tourist.balances.AZN +
    tourist.balances.USD * 1.70 +
    tourist.balances.EUR * 1.8485 +
    tourist.balances.USDT * 1.70 +
    tourist.balances.BTC * 114850;

  const handleCopyCardNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('4098812094108920');
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  return (
    <div className="relative bg-[#071220] pt-4 pb-8 border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Aeroport Xoş Gəlmisiniz Bildirişi (Clean & Compact) */}
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-400/25 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <PlaneLanding className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Heydər Əliyev Beynəlxalq Aeroportu (GYD)
                </span>
                <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  Aktiv Səfər
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {t.hero.airportNotice}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAi}
            className="px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 self-end sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tövsiyələr</span>
          </button>
        </div>

        {/* Central Banking Card Showcase & Quick Actions */}
        <div className="flex flex-col items-center">
          {/* Real Azerbaijani Bank Card (Clean, Luxurious, MƏRKƏZİ BANK) */}
          <div className="w-full max-w-md">
            <div
              onClick={() => setCardFlipped(!cardFlipped)}
              className="relative w-full aspect-[1.586] rounded-2xl p-6 transition-all duration-500 shadow-2xl cursor-pointer select-none overflow-hidden bg-gradient-to-br from-[#0B1A2F] via-[#081526] to-[#040A14] border border-amber-400/40 hover:border-amber-400/70"
            >
              {/* Subtle gold ornamentation pattern in background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

              {!cardFlipped ? (
                /* Card Front */
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Top Line: MƏRKƏZİ BANK */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-black tracking-wider text-amber-300 drop-shadow-sm font-sans">
                        MƏRKƏZİ BANK
                      </h2>
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-medium block">
                        AZƏRBAYCAN RESPUBLİKASI
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Contactless waves icon */}
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300/80" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
                        <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                        <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                      </svg>
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        TURİST PASS
                      </span>
                    </div>
                  </div>

                  {/* Gold EMV Chip & Balance Preview */}
                  <div className="flex items-center justify-between my-1">
                    {/* Authentic Gold Chip */}
                    <div className="w-11 h-8 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-md flex items-center justify-center p-1 border border-amber-300/60">
                      <div className="w-full h-full border border-amber-800/40 rounded-[2px] flex items-center justify-center">
                        <div className="w-3 h-3 border-r border-amber-800/30" />
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400 text-[10px] uppercase font-medium">
                        <span>{t.hero.totalBalance}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBalance(!showBalance);
                          }}
                          className="hover:text-white transition-colors"
                        >
                          {showBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight tabular-nums mt-0.5">
                        {showBalance ? formatCurrency(totalAZNEquiv, 'AZN') : '••••••••'}
                      </div>
                    </div>
                  </div>

                  {/* Card Number & Holder */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm sm:text-base font-mono tracking-widest text-slate-200 font-semibold tabular-nums drop-shadow-sm">
                        4098 8120 9410 8920
                      </div>
                      <button
                        onClick={handleCopyCardNumber}
                        className="p-1 text-slate-400 hover:text-amber-300 transition-colors"
                        title="Kart nömrəsini kopyala"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between text-[11px] text-slate-300 pt-1">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block">Kart Sahibi</span>
                        <span className="font-bold text-white uppercase tracking-wider">{tourist.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block">Bitmə Tarixi</span>
                        <span className="font-mono text-slate-200">12/28</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block">Valyuta</span>
                        <span className="font-mono font-bold text-amber-300">AZN · MULTI</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Back (Flipped) */
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="h-8 bg-slate-950 -mx-6 mt-1 flex items-center px-6">
                    <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                      CVV: 894 · CENTRAL BANK SECURE ENCLAVE
                    </span>
                  </div>

                  <div className="space-y-2 py-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Turist Pasportu:</span>
                      <span className="font-mono text-white font-semibold">{tourist.passportNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Trust Score (Güvən):</span>
                      <span className="font-mono text-emerald-400 font-bold">{tourist.trustScore}/100 (A+)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Otel Depoziti:</span>
                      <span className="text-amber-300 font-semibold">0 AZN (Azaddır)</span>
                    </div>
                  </div>

                  <div className="text-center pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                    Kartı çevirmək üçün klikləyin
                  </div>
                </div>
              )}
            </div>

            {copiedCard && (
              <div className="text-center text-xs text-emerald-400 font-mono mt-1.5 animate-fade-in">
                ✓ Kart nömrəsi kopyalandı
              </div>
            )}
          </div>

          {/* Azerbaijani Mobile Banking Style Quick Actions Bar */}
          <div className="w-full max-w-md grid grid-cols-4 gap-2 pt-4">
            {/* Quick Action 1: QR Ödəniş */}
            <button
              onClick={onOpenQuickPay}
              className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-xl text-center transition-all cursor-pointer group flex flex-col items-center gap-1.5"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                QR Ödə
              </span>
            </button>

            {/* Quick Action 2: Köçürmə */}
            <button
              onClick={onOpenTransfer}
              className="p-3 bg-slate-900 border border-slate-800 hover:border-blue-400/50 rounded-xl text-center transition-all cursor-pointer group flex flex-col items-center gap-1.5"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                Köçürmə
              </span>
            </button>

            {/* Quick Action 3: Valyuta Dəyiş */}
            <button
              onClick={onOpenConverter}
              className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-xl text-center transition-all cursor-pointer group flex flex-col items-center gap-1.5"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                Valyuta
              </span>
            </button>

            {/* Quick Action 4: Kripto Wallet */}
            <button
              onClick={onOpenCrypto}
              className="p-3 bg-slate-900 border border-slate-800 hover:border-emerald-400/50 rounded-xl text-center transition-all cursor-pointer group flex flex-col items-center gap-1.5"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                Kripto
              </span>
            </button>
          </div>

          {/* Tourist Trust Score & Hotel Exemption Banner */}
          <div className="w-full max-w-md mt-4">
            <div 
              onClick={onOpenKyc}
              className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                  {tourist.trustScore}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Turist Güvən Skoru (A+ Reytinq)</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium block">
                    ✓ Otellərdə 0 AZN depozit imtiyazı aktivdir
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

