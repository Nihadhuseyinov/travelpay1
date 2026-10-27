import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Transaction, TouristProfile } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';

interface AnalyticsDashboardProps {
  transactions: Transaction[];
  tourist: TouristProfile;
  language: Language;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  transactions,
  tourist,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [forecastDays, setForecastDays] = useState<3 | 5>(3);

  // Calculate real category totals from transactions
  const categoryTotals: Record<string, number> = {
    Hotel: 0,
    Restaurant: 0,
    Museum: 0,
    Transport: 0,
    Shopping: 0,
  };

  let totalSpentAZN = 0;
  let totalVatRefundAZN = 0;

  transactions.forEach((tx) => {
    if (categoryTotals[tx.category] !== undefined) {
      categoryTotals[tx.category] += tx.amountAZN;
    } else {
      categoryTotals.Shopping += tx.amountAZN;
    }
    totalSpentAZN += tx.amountAZN;
    if (tx.vatRefundAZN) totalVatRefundAZN += tx.vatRefundAZN;
  });

  const categories = [
    { label: 'Otel & Yaşayış', key: 'Hotel', color: 'bg-amber-400', amount: categoryTotals.Hotel },
    { label: 'Restoran & Kafe', key: 'Restaurant', color: 'bg-blue-400', amount: categoryTotals.Restaurant },
    { label: 'Muzey & İncəsənət', key: 'Museum', color: 'bg-emerald-400', amount: categoryTotals.Museum },
    { label: 'Nəqliyyat & Metro', key: 'Transport', color: 'bg-indigo-400', amount: categoryTotals.Transport },
    { label: 'Alış-veriş & Xalça', key: 'Shopping', color: 'bg-purple-400', amount: categoryTotals.Shopping },
  ];

  // AI 3-Day predictive spending forecast
  const dailyAverage = totalSpentAZN / 3;
  const forecastDay1 = Math.round(dailyAverage * 0.95);
  const forecastDay2 = Math.round(dailyAverage * 1.15); // Weekend / tour effect
  const forecastDay3 = Math.round(dailyAverage * 0.85);

  const popularLocations = [
    { name: 'İçərişəhər (Qız Qalası)', visits: '4,820 turist', trend: '+14%', verified: true },
    { name: 'Dənizkənarı Milli Park (Bulvar)', visits: '5,140 turist', trend: '+18%', verified: true },
    { name: 'Alov Qüllələri & Dağüstü Park', visits: '3,950 turist', trend: '+11%', verified: true },
    { name: 'Heydər Əliyev Mərkəzi', visits: '3,210 turist', trend: '+9%', verified: true },
    { name: 'Şahdağ Dağ Xizək Mərkəzi', visits: '2,400 turist', trend: '+22%', verified: true },
    { name: 'Qobustan Qayaüstü Rəsmləri', visits: '1,890 turist', trend: '+15%', verified: true },
  ];

  return (
    <div className="space-y-6">
      {/* Problem & Sovereign Solution Banner */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-400/10 text-amber-300 rounded-lg shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Fintech İzahı & AI Xərc İntellekti
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                Real-Time Anomaly Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {t.fintechProblems.ai}
            </p>
          </div>
        </div>
      </div>

      {/* AI Behavioral Alert Card */}
      <div className="p-4 bg-gradient-to-r from-blue-950/40 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-400/20 text-amber-300 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              AI Sərfiyyat Anomaliya İntellekti
            </span>
            <p className="text-xs text-slate-200 mt-0.5">
              "Bu həftə restoranlara Bakıdakı orta xarici turistdən <span className="font-bold text-amber-300">28% daha çox</span> xərcləyirsiniz. 
              Sizin üçün İçərişəhərdə 3 rəsmi partnyor restoranda 15% endirim aktivləşdirilib."
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 uppercase block">ƏDV Geri Al Qazancı</span>
          <span className="text-base font-mono font-bold text-emerald-400 tabular-nums">
            +{totalVatRefundAZN.toFixed(2)} AZN
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Ümumi Turist Xərci</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {totalSpentAZN.toFixed(2)} ₼
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Səyahət dövrü ərzində</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Gündəlik Orta Sərf</span>
          <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums mt-1">
            {dailyAverage.toFixed(2)} ₼/gün
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Turist norması daxilində</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Qənaət Olunan Vergi (Tax Free)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {totalVatRefundAZN.toFixed(2)} ₼
          </div>
          <span className="text-[10px] text-emerald-500/80 block mt-1">Avtomatik kartınıza qayıdır</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Offline Əməliyyat Sayı</span>
          <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums mt-1">
            1 Token (Xınalıq)
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Şəbəkəsiz zonada ödənilib</span>
        </div>
      </div>

      {/* Analytics Grid: Category Bars + AI 3-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-7 p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Kateqoriyalar Üzrə Xərclər</h3>
              <span className="text-xs text-slate-400">Turist kartının istiqamətlər üzrə payı</span>
            </div>
            <span className="text-xs font-mono text-slate-400">100% Real-time</span>
          </div>

          <div className="space-y-3 pt-2">
            {categories.map((cat) => {
              const pct = totalSpentAZN > 0 ? (cat.amount / totalSpentAZN) * 100 : 0;
              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.label}</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {cat.amount.toFixed(2)} ₼ ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ən çox xərc: <strong className="text-white">Otel & Yaşayış</strong></span>
            <span>Ən çox əməliyyat: <strong className="text-white">Restoran & Metro</strong></span>
          </div>
        </div>

        {/* AI 3-Day Expenditure Forecast */}
        <div className="lg:col-span-5 p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">AI Xərc Proqnozu</h3>
              <span className="text-xs text-slate-400">Növbəti 3 günün xərc təxmini</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-[11px]">
              <span className="text-amber-400 font-bold px-1.5">3 Günlük</span>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Sabah (Cümə)</span>
                <span className="text-[10px] text-slate-400">Muzey & Qastronomiya turu</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-amber-300 tabular-nums">~{forecastDay1} AZN</span>
                <span className="text-[9px] text-slate-500 block">±5% xəta payı</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Şənbə (Həftəsonu)</span>
                <span className="text-[10px] text-slate-400">Şahdağ / Quba region səfəri</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-amber-300 tabular-nums">~{forecastDay2} AZN</span>
                <span className="text-[9px] text-slate-500 block">Regional aktivlik</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Bazar (Yola Düşmə)</span>
                <span className="text-[10px] text-slate-400">Suvenir & Aeroport xərcləri</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-amber-300 tabular-nums">~{forecastDay3} AZN</span>
                <span className="text-[9px] text-slate-500 block">Duty-Free daxil</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-lg text-[11px] text-blue-200">
            💡 <strong>Tövsiyə:</strong> Şənbə günü Şahdağa getməzdən əvvəl tətbiqdən "Offline QR Token" generasiya etməyiniz məsləhətdir.
          </div>
        </div>
      </div>

      {/* Popular Tourist Locations in Azerbaijan */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Ən Populyar Ziyarət Məkanları (Canlı Turist Sıxlığı)</h3>
            <span className="text-xs text-slate-400">Mərkəzi Bankın anonim tranzaksiya sıxlığı analitikası</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Bakı & Regionlar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularLocations.map((loc, idx) => (
            <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate">{loc.name}</span>
                <span className="text-[10px] text-emerald-400 font-mono">{loc.trend}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{loc.visits}</span>
                <span className="text-amber-400 text-[10px]">✓ AMB Verifikasiyalı</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
