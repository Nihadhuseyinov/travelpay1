import React, { useState } from 'react';
import { 
  RefreshCw, 
  ArrowRightLeft, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle, 
  Building2, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { ExchangeRate, TouristProfile, CurrencyCode } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';

interface CurrencyConverterProps {
  rates: ExchangeRate[];
  tourist: TouristProfile;
  setTourist: React.Dispatch<React.SetStateAction<TouristProfile>>;
  language: Language;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  rates,
  tourist,
  setTourist,
  language,
}) => {
  const t = TRANSLATIONS[language];

  // Interactive Swap Form State
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('AZN');
  const [amount, setAmount] = useState<string>('200');
  const [swapSuccessMessage, setSwapSuccessMessage] = useState<string | null>(null);

  // Smart Choice Advisor State
  const [compareAmountAZN, setCompareAmountAZN] = useState<string>('170.00');

  // Rates lookup
  const getRate = (code: CurrencyCode): number => {
    if (code === 'AZN') return 1.0;
    const found = rates.find(r => r.code === code);
    return found ? found.rateToAZN : 1.0;
  };

  const parsedAmount = parseFloat(amount) || 0;
  const fromRate = getRate(fromCurrency);
  const toRate = getRate(toCurrency);

  // Calculate conversion: Amount * fromRate / toRate
  const convertedResult = (parsedAmount * fromRate) / toRate;

  // Execute Swap in tourist wallet
  const handleExecuteSwap = () => {
    if (parsedAmount <= 0) return;

    // Check balance in source currency if tourist has that balance key
    const availableSource = (tourist.balances as any)[fromCurrency] ?? 0;
    if (availableSource < parsedAmount) {
      alert(`Xəbərdarlıq: Seçilmiş ${fromCurrency} balansınızda kifayət qədər vəsait yoxdur (Mövcud: ${availableSource})`);
      return;
    }

    setTourist(prev => {
      const updatedBalances = { ...prev.balances };
      (updatedBalances as any)[fromCurrency] -= parsedAmount;
      (updatedBalances as any)[toCurrency] = ((updatedBalances as any)[toCurrency] || 0) + convertedResult;

      return {
        ...prev,
        balances: updatedBalances,
      };
    });

    setSwapSuccessMessage(
      `Uğurlu Konvertasiya: ${parsedAmount} ${fromCurrency} ➔ ${convertedResult.toFixed(2)} ${toCurrency} (Mərkəzi Bank rəsmi məzənnəsi ilə 0% komissiya).`
    );

    setTimeout(() => {
      setSwapSuccessMessage(null);
    }, 5000);
  };

  // Switch currencies
  const handleInvertCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Smart Comparison calculations
  const targetAZN = parseFloat(compareAmountAZN) || 170;
  const costInUSD = targetAZN / getRate('USD');
  const costInEUR = targetAZN / getRate('EUR');
  const costInGBP = targetAZN / getRate('GBP');
  const costInTRY = targetAZN / getRate('TRY');

  // Savings compared to conventional 6% predatory airport spread
  const airportMarkupSaved = (targetAZN * 0.065).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Problem & Sovereign Solution Banner */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-400/10 text-amber-300 rounded-lg shrink-0 mt-0.5">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Fintech İzahı & Valyuta Şəffaflığı
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                0% Gizli Markup
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {t.fintechProblems.converter}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Sovereign Converter & Swap */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Rəsmi AMB Valyuta Konvertasiyası</h3>
                <span className="text-xs text-slate-400">Gizli komissiyasız, dövlət rəsmi məzənnəsi ilə birbaşa mübadilə</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/30">
                Canlı AMB Klirinqi
              </span>
            </div>

            {swapSuccessMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{swapSuccessMessage}</span>
              </div>
            )}

            {/* Input From Currency */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Dəyişdirilən Valyuta (From)</span>
                <span className="text-slate-400">
                  Balans: <span className="font-mono text-white">{(tourist.balances as any)[fromCurrency] ?? 0} {fromCurrency}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl font-mono font-bold text-white focus:outline-none tabular-nums"
                  placeholder="0.00"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                  className="bg-slate-900 border border-slate-700 text-sm font-semibold text-amber-300 px-3 py-2 rounded-lg cursor-pointer"
                >
                  <option value="USD">🇺🇸 USD ($)</option>
                  <option value="EUR">🇪🇺 EUR (€)</option>
                  <option value="GBP">🇬🇧 GBP (£)</option>
                  <option value="TRY">🇹🇷 TRY (₺)</option>
                  <option value="USDT">⚡ USDT (₮)</option>
                  <option value="AZN">🇦🇿 AZN (₼)</option>
                </select>
              </div>
            </div>

            {/* Invert Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleInvertCurrencies}
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-amber-400 shadow-md transition-transform hover:rotate-180 duration-300 cursor-pointer"
                title="İstiqaməti dəyiş"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Output To Currency */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Alınan Valyuta (To)</span>
                <span className="text-slate-400">
                  Cari Balans: <span className="font-mono text-white">{(tourist.balances as any)[toCurrency] ?? 0} {toCurrency}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-full text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                  {convertedResult.toFixed(2)}
                </div>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                  className="bg-slate-900 border border-slate-700 text-sm font-semibold text-amber-300 px-3 py-2 rounded-lg cursor-pointer"
                >
                  <option value="AZN">🇦🇿 AZN (₼)</option>
                  <option value="USD">🇺🇸 USD ($)</option>
                  <option value="EUR">🇪🇺 EUR (€)</option>
                  <option value="USDT">⚡ USDT (₮)</option>
                </select>
              </div>
            </div>

            {/* Exchange Rate details strip */}
            <div className="p-3 bg-slate-950/60 rounded-lg text-xs space-y-1 font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Mərkəzi Bank Rəsmi Məzənnəsi:</span>
                <span className="text-white font-semibold">
                  1 {fromCurrency} = {(fromRate / toRate).toFixed(4)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bank Spredi / Əlavə Faiz:</span>
                <span className="text-emerald-400 font-semibold">0.00% (Tam Sıfır)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Qorunan Turist Əmanəti:</span>
                <span className="text-amber-300">Dövlət Zəmanətli Hesab</span>
              </div>
            </div>

            <button
              onClick={handleExecuteSwap}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-amber-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Dərhal Konvertasiya Et və Balansa Əlavə Et</span>
            </button>
          </div>

          {/* Smart Choice Advisor Feature */}
          <div className="p-5 bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-900 border border-blue-500/30 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ağıllı Valyuta Məsləhətçisi (Smart Recommendation)</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Ödəniş edərkən hansı valyuta ilə ödəməyiniz daha sərfəlidir? Mərkəzi Bankın AI alqoritmi
              kartınızın beynəlxalq konvertasiya itkisini minimuma endirmək üçün ən yaxşı variantı təklif edir.
            </p>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 block">Restoran / Otel Hesabı (AZN ilə):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={compareAmountAZN}
                  onChange={(e) => setCompareAmountAZN(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono font-bold text-white w-40 tabular-nums focus:outline-none focus:border-amber-400"
                />
                <span className="text-xs text-slate-400 font-mono">₼ hesab üçün müqayisə</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <span className="text-[10px] text-emerald-400 font-bold block">✓ ƏN SƏRFƏLİ</span>
                <span className="text-sm font-bold font-mono text-white tabular-nums">${costInUSD.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block">USD ilə ödə</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Avro</span>
                <span className="text-sm font-bold font-mono text-white tabular-nums">€{costInEUR.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block">EUR ilə ödə</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Britaniya</span>
                <span className="text-sm font-bold font-mono text-white tabular-nums">£{costInGBP.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block">GBP ilə ödə</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Türkiyə</span>
                <span className="text-sm font-bold font-mono text-white tabular-nums">₺{costInTRY.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block">TRY ilə ödə</span>
              </div>
            </div>

            <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg text-xs text-amber-200 flex items-center justify-between">
              <span>Hava limanı köşklərinə nisbətən qənaətiniz:</span>
              <span className="font-mono font-bold text-amber-300">+{airportMarkupSaved} AZN (6.5% qənaət)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live CBAR Official Rates Board */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Mərkəzi Bank Rəsmi Məzənnələri</h3>
                <span className="text-xs text-slate-400">1 Xarici Valyuta = AZN</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block">Son Yenilənmə</span>
                <span className="text-[11px] font-mono text-emerald-400">22.10.2026 14:00</span>
              </div>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Valyuta</th>
                    <th className="py-2.5 px-3 text-right">Rəsmi Kurs (AZN)</th>
                    <th className="py-2.5 px-3 text-right">24s Dəyişmə</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {rates.map((rate) => (
                    <tr 
                      key={rate.code}
                      onClick={() => {
                        setFromCurrency(rate.code);
                        setToCurrency('AZN');
                      }}
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <span className="text-sm">{rate.flag}</span>
                        <div>
                          <span className="font-bold text-white">{rate.code}</span>
                          <span className="text-[10px] text-slate-500 block font-sans">{rate.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white tabular-nums">
                        {rate.rateToAZN >= 100 
                          ? rate.rateToAZN.toLocaleString() 
                          : rate.rateToAZN.toFixed(4)} ₼
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        <span className={rate.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {rate.change24h >= 0 ? `+${rate.change24h}%` : `${rate.change24h}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                "Azərbaycan Respublikasının Mərkəzi Bankı haqqında" Qanuna əsasən bütün hesablaşmalar rəsmi kursla təmin edilir.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
