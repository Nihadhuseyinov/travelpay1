import React from 'react';
import { Building2, ShieldCheck, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface FooterProps {
  language: Language;
  onOpenAi: () => void;
  onOpenKyc: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenAi,
  onOpenKyc,
  setActiveTab,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-[#050D18] border-t border-slate-800 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand & Authority */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300">
                ₼
              </div>
              <span className="font-bold text-white text-sm">MƏRKƏZİ BANK · TravelPay</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Azərbaycan Respublikası Mərkəzi Bankının rəsmi ödəniş və valyuta infrastrukturu.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dövlət Zəmanətli Milli Ödəniş Sistemi</span>
            </div>
          </div>

          {/* Quick Bank App Services */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Bank Xidmətləri
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('payments')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Ani QR Ödənişlər & Köçürmələr
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('converter')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Mərkəzi Bank Rəsmi Məzənnələri (0% Spred)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('crypto')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Kripto Travel Wallet (USDT / BTC)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('security')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Dağ Kəndləri Offline Ödəniş Tokenləri
                </button>
              </li>
            </ul>
          </div>

          {/* Turist Dəstəyi & AI */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Turist İmtiyazları
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  onClick={onOpenKyc} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Trust Score & 0 AZN Otel Depoziti
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAi} 
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 text-amber-300 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Səyahət Köməkçisi</span>
                </button>
              </li>
              <li>
                <span className="text-slate-400">
                  ƏDV Geri Al (Tax Free) Avto-Geri Qaytarma
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Bakı Metropoliteni NFC Keçid
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            © 2026 Azərbaycan Respublikası Mərkəzi Bankı. Bütün hüquqlar qorunur.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400">AMB AÖS Status: Normal</span>
            <span>·</span>
            <span>24/7 Dəstək: 966</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

