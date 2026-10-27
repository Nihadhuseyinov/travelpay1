import React, { useState } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  Scan, 
  Send, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Fingerprint, 
  Eye, 
  Clock, 
  Building2, 
  ArrowUpRight,
  Filter,
  Download,
  Printer,
  Sparkles,
  MapPin,
  Lock
} from 'lucide-react';
import { Transaction, TouristProfile, CurrencyCode } from '../types';
import { formatCurrency, generateSvgQrMatrix } from '../utils/formatters';
import { Language, TRANSLATIONS } from '../utils/translations';

interface PaymentsHubProps {
  tourist: TouristProfile;
  setTourist: React.Dispatch<React.SetStateAction<TouristProfile>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  language: Language;
}

export const PaymentsHub: React.FC<PaymentsHubProps> = ({
  tourist,
  setTourist,
  transactions,
  setTransactions,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [activeSubTab, setActiveSubTab] = useState<'scan' | 'p2p' | 'myqr' | 'history'>('scan');

  // Scanner State & Simulation
  const [merchantName, setMerchantName] = useState('Şirvanşah Muzey Restoranı');
  const [paymentAmount, setPaymentAmount] = useState('85.00');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('AZN');
  const [simulateFraudCheck, setSimulateFraudCheck] = useState(false);
  const [checkStep, setCheckStep] = useState<number>(0);
  const [requireBiometric, setRequireBiometric] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<Transaction | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // P2P State
  const [p2pRecipient, setP2pRecipient] = useState('');
  const [p2pAmount, setP2pAmount] = useState('');
  const [p2pNote, setP2pNote] = useState('');
  const [p2pSuccess, setP2pSuccess] = useState(false);

  // Filter for history
  const [historyCategory, setHistoryCategory] = useState<string>('All');

  // Pre-configured merchant options for demo
  const sampleMerchants = [
    { name: 'Şirvanşah Muzey Restoranı', amount: '85.00', category: 'Restaurant' as const, location: 'Baku, Salatin Asgarova str.' },
    { name: 'Fairmont Baku Flame Towers', amount: '350.00', category: 'Hotel' as const, location: 'Baku, Flame Towers' },
    { name: 'Heydər Əliyev Mərkəzi', amount: '30.00', category: 'Museum' as const, location: 'Baku, Heydar Aliyev Ave.' },
    { name: 'Nizami Suvenirlər & Xalça', amount: '140.00', category: 'Shopping' as const, location: 'Baku, Nizami str.' },
    { name: 'Bakı Metropoliteni (Giriş)', amount: '0.60', category: 'Transport' as const, location: 'Sahil Station' },
  ];

  // Run 0.3s Fraud Inspection
  const handleInitiatePayment = () => {
    const amt = parseFloat(paymentAmount) || 0;
    if (amt <= 0) return;

    setSimulateFraudCheck(true);
    setCheckStep(1); // IP & Geo-fence check

    setTimeout(() => {
      setCheckStep(2); // Device Fingerprint & velocity
      setTimeout(() => {
        setCheckStep(3); // Amount anomaly scoring
        setTimeout(() => {
          // If payment is >= 150 AZN or user toggled, require biometric
          if (amt >= 150) {
            setRequireBiometric(true);
            setSimulateFraudCheck(false);
          } else {
            finalizePayment(false);
          }
        }, 200);
      }, 150);
    }, 150);
  };

  const handleSimulateBiometricScan = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setRequireBiometric(false);
      finalizePayment(true);
    }, 1200);
  };

  const finalizePayment = (wasBiometric: boolean) => {
    const amt = parseFloat(paymentAmount);
    const newTx: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      merchantName,
      category: 'Restaurant',
      amountAZN: amt,
      originalAmount: amt,
      originalCurrency: selectedCurrency,
      status: 'Completed',
      fraudRiskScore: wasBiometric ? 8 : 4,
      paymentMethod: 'Risk-Free QR',
      location: 'Bakı, Azərbaycan',
      receiptNumber: `AMB-REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      vatRefundAZN: Number((amt * 0.09).toFixed(2)), // 9% average Tax Free refund
    };

    // Deduct from tourist balance
    setTourist(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        AZN: Math.max(0, prev.balances.AZN - amt),
      },
    }));

    setTransactions(prev => [newTx, ...prev]);
    setSimulateFraudCheck(false);
    setPaymentSuccess(newTx);
  };

  const handleP2pSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(p2pAmount);
    if (!amt || amt <= 0 || !p2pRecipient) return;

    const newTx: Transaction = {
      id: `TXN-P2P-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      merchantName: `P2P Transfer: ${p2pRecipient}`,
      category: 'P2P',
      amountAZN: amt,
      originalAmount: amt,
      originalCurrency: 'AZN',
      status: 'Completed',
      fraudRiskScore: 3,
      paymentMethod: 'P2P Instant',
      location: 'Central Bank Fast Clearance',
      receiptNumber: `AMB-P2P-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setTourist(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        AZN: Math.max(0, prev.balances.AZN - amt),
      },
    }));

    setTransactions(prev => [newTx, ...prev]);
    setP2pSuccess(true);
    setP2pAmount('');
    setP2pRecipient('');
    setP2pNote('');
    setTimeout(() => setP2pSuccess(false), 4000);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (historyCategory === 'All') return true;
    return tx.category === historyCategory;
  });

  return (
    <div className="space-y-6">
      {/* Sovereign Fintech Problem Statement Ribbon */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-400/10 text-amber-300 rounded-lg shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Fintech İzahı & Sovereign Dəyəri
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                0.3s Risk Radar
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {t.fintechProblems.qr}
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg max-w-xl">
        <button
          onClick={() => setActiveSubTab('scan')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'scan'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Risk-Free QR Ödənişi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('p2p')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'p2p'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ani P2P Köçürmə</span>
        </button>

        <button
          onClick={() => setActiveSubTab('myqr')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'myqr'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Mənim QR Kodum</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'history'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Qəbzlər & Tarixçə</span>
        </button>
      </div>

      {/* SubTab 1: Risk-Free QR Scanner & Execution */}
      {activeSubTab === 'scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Viewfinder Simulator & Merchant Selection */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">QR Ödəniş Terminalı</h3>
                  <span className="text-xs text-slate-400">Restoran, otel, muzey və metro POS skanı</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  AMB Sürətli Klirinq Fəal
                </span>
              </div>

              {/* Viewfinder Frame with animated scan line */}
              <div className="relative aspect-video sm:aspect-[2.2/1] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div className="absolute inset-4 border-2 border-dashed border-amber-400/40 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <Scan className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                    <span className="text-xs font-mono text-slate-300 block">
                      Kameranı ticarət obyektinin QR koduna yönəldin
                    </span>
                    <span className="text-[10px] text-slate-500">
                      0.3 saniyədə biometrik anti-fraud aktivləşəcək
                    </span>
                  </div>
                </div>

                {/* Animated Laser Scanning Line */}
                <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#F59E0B] animate-bounce" />

                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
              </div>

              {/* Quick Preset Merchant Chooser */}
              <div>
                <span className="text-xs font-medium text-slate-300 block mb-2">
                  və ya Hazır Partnyor QR-ı Seçin:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleMerchants.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMerchantName(m.name);
                        setPaymentAmount(m.amount);
                      }}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        merchantName === m.name
                          ? 'bg-amber-500/15 border-amber-400/60 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold truncate">{m.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{m.location}</span>
                        <span className="font-mono font-bold text-amber-300 tabular-nums">{m.amount} ₼</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Execution & Fraud Engine Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-base font-semibold text-white">Ödəniş Məlumatları</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Qəbul Edən Obyekt</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400">Məbləğ</label>
                    <span className="text-[11px] text-slate-400">
                      Mövcud: <span className="font-mono font-semibold text-white">{tourist.balances.AZN.toFixed(2)} ₼</span>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full pl-3 pr-16 py-2 bg-slate-950 border border-slate-800 rounded-lg text-lg font-mono font-bold text-white focus:outline-none focus:border-amber-400 tabular-nums"
                    />
                    <div className="absolute right-2 top-2 bottom-2 flex items-center">
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                        className="bg-slate-800 text-xs font-mono font-semibold text-amber-300 px-2 py-1 rounded border border-slate-700"
                      >
                        <option value="AZN">AZN (₼)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-1">
                    ✓ ƏDV Geri Al (Tax Free) avtomatik hesablanacaq: ~{(parseFloat(paymentAmount || '0') * 0.09).toFixed(2)} ₼
                  </span>
                </div>

                {/* 0.3s Fraud Inspection Display during validation */}
                {simulateFraudCheck && (
                  <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-lg space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        0.3s Avtomatik Fraud Yoxlaması Gedir...
                      </span>
                      <span className="font-mono text-[10px] text-blue-400">AMB Radar</span>
                    </div>
                    <div className="space-y-1 text-[11px] font-mono text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>1. IP & Geo-Fence Uyğunluğu:</span>
                        <span className={checkStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}>
                          {checkStep >= 1 ? '✓ TƏSDİQ (Bakı zonası)' : 'Yoxlanılır...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>2. Cihaz İmzası & Sürət:</span>
                        <span className={checkStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}>
                          {checkStep >= 2 ? '✓ TƏSDİQ (Orijinal ID)' : 'Yoxlanılır...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>3. Miqdar Anomaliya Skoru:</span>
                        <span className={checkStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}>
                          {checkStep >= 3 ? '✓ Aşağı Risk (<15%)' : 'Yoxlanılır...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Biometric Verification Simulation Modal Trigger */}
                {requireBiometric && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Şübhəsiz Təhlükəsizlik: Biometrik Təsdiq Tələb Olunur</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Ödəniş məbləği 150 ₼-dən yüksək olduğu üçün kart oğurluğunun qarşısını almaq məqsədilə üzünüzü təsdiqləyin.
                    </p>
                    <button
                      onClick={handleSimulateBiometricScan}
                      disabled={biometricScanning}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {biometricScanning ? (
                        <>
                          <Eye className="w-4 h-4 animate-spin" />
                          <span>Üz Skan Edilir... (Biometrik Hash Doğrulanır)</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-4 h-4" />
                          <span>Üz Skanı / Face ID İlə Təsdiqlə</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <button
                  onClick={handleInitiatePayment}
                  disabled={simulateFraudCheck || requireBiometric}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-amber-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>0.3s Təhlükəsizlik Yoxlaması ilə Ödə</span>
                </button>
              </div>
            </div>

            {/* Payment Success Alert */}
            {paymentSuccess && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Ödəniş Uğurla İcra Olundu!
                  </span>
                  <span className="font-mono text-xs text-white tabular-nums">
                    {paymentSuccess.amountAZN.toFixed(2)} ₼
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Qəbz: <span className="font-mono text-amber-300">{paymentSuccess.receiptNumber}</span> · 
                  ƏDV Geri Al: <span className="font-mono text-emerald-400">+{paymentSuccess.vatRefundAZN} ₼</span>
                </div>
                <button
                  onClick={() => setSelectedReceipt(paymentSuccess)}
                  className="w-full py-1.5 text-xs text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rəsmi AMB Qəbzini Aç və Çap Et</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SubTab 2: P2P Instant Transfers */}
      {activeSubTab === 'p2p' && (
        <div className="max-w-2xl mx-auto p-6 bg-slate-900/80 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-semibold text-white">Ani P2P Turist Köçürməsi</h3>
              <p className="text-xs text-slate-400">
                Azərbaycan daxilində digər turistlərə və ya bələdçilərə dərhal komissiyasız vəsait göndərin
              </p>
            </div>
            <div className="p-2 bg-amber-400/10 text-amber-300 rounded-lg">
              <Send className="w-5 h-5" />
            </div>
          </div>

          {p2pSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Vəsait qarşı tərəfin TravelPay hesabına dərhal oturdu. Komissiya: 0.00 ₼</span>
            </div>
          )}

          <form onSubmit={handleP2pSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Qəbul edənin Telefon Nömrəsi və ya TravelPay ID-si
              </label>
              <input
                type="text"
                placeholder="+994 50 123 45 67 və ya TP-AZ-10293"
                value={p2pRecipient}
                onChange={(e) => setP2pRecipient(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-300">Köçürmə Məbləği (AZN)</label>
                <span className="text-[11px] text-slate-400">
                  Balans: <span className="font-mono text-white">{tourist.balances.AZN.toFixed(2)} ₼</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.00"
                  value={p2pAmount}
                  onChange={(e) => setP2pAmount(e.target.value)}
                  required
                  className="w-full pl-3 pr-12 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-lg font-mono font-bold text-white focus:outline-none focus:border-amber-400 tabular-nums"
                />
                <span className="absolute right-3 top-3 text-sm font-bold text-amber-400">₼</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Qeyd (İxtiyari)</label>
              <input
                type="text"
                placeholder="Məs: Şəki turu üçün nahar xərci"
                value={p2pNote}
                onChange={(e) => setP2pNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-lg text-[11px] text-slate-400 flex items-center justify-between">
              <span>Mərkəzi Bank Sürətli Ödəniş Sistemi (AÖS):</span>
              <span className="font-semibold text-emerald-400">0.00% Komissiya · Ani Klirinq</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Vəsaiti Dərhal Göndər</span>
            </button>
          </form>
        </div>
      )}

      {/* SubTab 3: My QR Code */}
      {activeSubTab === 'myqr' && (
        <div className="max-w-md mx-auto p-6 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Mənim Fərdi Qəbul QR Kodum</h3>
            <p className="text-xs text-slate-400">
              Digər turistlər və ya dostlarınız bu kodu skan edərək sizə birbaşa AZN göndərə bilər
            </p>
          </div>

          {/* Crisp Dynamic Vector QR Code Display */}
          <div className="p-5 bg-white rounded-2xl inline-block shadow-xl border-4 border-amber-400/80">
            <svg
              viewBox="0 0 21 21"
              className="w-48 h-48 mx-auto"
              shapeRendering="crispEdges"
            >
              {generateSvgQrMatrix(`travelpay://user/${tourist.id}/azn`).map((row, r) =>
                row.map((active, c) =>
                  active ? (
                    <rect
                      key={`${r}-${c}`}
                      x={c}
                      y={r}
                      width={1}
                      height={1}
                      fill="#07111F"
                    />
                  ) : null
                )
              )}
            </svg>
            <div className="mt-2 text-[10px] font-mono font-bold text-slate-900 tracking-wider">
              ID: {tourist.id}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-white block">{tourist.fullName}</span>
            <span className="text-[11px] font-mono text-slate-400">
              Pasport: {tourist.passportNumber} · {tourist.countryCode} {tourist.flag}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => alert(`QR Link kopyalandı: https://travelpay.amb.gov.az/pay/${tourist.id}`)}
              className="px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Linki Kopyala
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              Çap Et
            </button>
          </div>
        </div>
      )}

      {/* SubTab 4: Payment Receipts & History */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {/* Category Filter bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              {['All', 'Restaurant', 'Hotel', 'Museum', 'Transport', 'Shopping', 'P2P'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setHistoryCategory(cat)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    historyCategory === cat
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'Bütün Əməliyyatlar' : cat}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-slate-400">
              Cəmi: {filteredTransactions.length} qeyd
            </span>
          </div>

          {/* Transactions Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tarix & Qəbz No</th>
                    <th className="py-3 px-4">Ticarət Obyekti</th>
                    <th className="py-3 px-4">Ödəniş Metodu</th>
                    <th className="py-3 px-4">Məbləğ (AZN)</th>
                    <th className="py-3 px-4">Risk Skoru</th>
                    <th className="py-3 px-4">ƏDV Geri Al</th>
                    <th className="py-3 px-4 text-right">Qəbz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-200">{tx.timestamp}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{tx.receiptNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{tx.merchantName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{tx.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-slate-300">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                        {tx.amountAZN.toFixed(2)} ₼
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                          tx.fraudRiskScore < 10 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {tx.fraudRiskScore}% Risk
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400">
                        {tx.vatRefundAZN ? `+${tx.vatRefundAZN.toFixed(2)} ₼` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceipt(tx)}
                          className="px-2.5 py-1 text-[11px] font-medium text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 rounded transition-colors cursor-pointer"
                        >
                          Bax
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official CBAR Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1524] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>

            {/* Official Sovereign Header */}
            <div className="text-center border-b border-slate-800 pb-4 space-y-1">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 mx-auto flex items-center justify-center font-bold text-amber-300 text-lg">
                ₼
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight uppercase">
                Azərbaycan Respublikası Mərkəzi Bankı
              </h4>
              <p className="text-[10px] font-mono text-slate-400">
                TRAVELPAY RƏQSƏMAL TURİST KLİRİNQ QƏBZİ
              </p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Qəbz Nömrəsi:</span>
                <span className="text-white font-bold">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Əməliyyat Vaxtı:</span>
                <span className="text-slate-200">{selectedReceipt.timestamp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Ticarət Obyekti:</span>
                <span className="text-white font-bold">{selectedReceipt.merchantName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Ödəyici:</span>
                <span className="text-slate-200">{tourist.fullName} ({tourist.passportNumber})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Ödəniş Üsulu:</span>
                <span className="text-amber-300">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-sm">
                <span className="text-slate-300 font-bold">Ödənilən Məbləğ:</span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {selectedReceipt.amountAZN.toFixed(2)} AZN
                </span>
              </div>
              {selectedReceipt.vatRefundAZN && (
                <div className="flex justify-between py-1 text-emerald-400">
                  <span>Hesablanmış ƏDV Geri Al (Tax Free):</span>
                  <span className="font-bold tabular-nums">+{selectedReceipt.vatRefundAZN.toFixed(2)} AZN</span>
                </div>
              )}
            </div>

            {/* Cryptographic Seal & Verification QR */}
            <div className="p-3 bg-slate-950 rounded-lg flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="space-y-0.5">
                <span className="block text-emerald-400 font-semibold">✓ Rəqəmsal İmza ilə Təsdiq Edilib</span>
                <span>SHA-256: 7f8a9b...c1d2e3</span>
                <span className="block text-slate-500">Mərkəzi Bank Dövlət Reyestri</span>
              </div>
              <div className="w-12 h-12 bg-white p-1 rounded">
                <svg viewBox="0 0 21 21" className="w-full h-full" shapeRendering="crispEdges">
                  {generateSvgQrMatrix(selectedReceipt.receiptNumber).map((row, r) =>
                    row.map((active, c) =>
                      active ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#000" /> : null
                    )
                  )}
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Çap Et</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
