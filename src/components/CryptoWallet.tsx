import React, { useState } from 'react';
import { 
  Coins, 
  Hotel, 
  Plane, 
  ExternalLink, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Hash, 
  Sparkles,
  Clock,
  Layers,
  Building2
} from 'lucide-react';
import { TouristProfile, Transaction } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { formatCurrency, generateSvgQrMatrix } from '../utils/formatters';

interface CryptoWalletProps {
  tourist: TouristProfile;
  setTourist: React.Dispatch<React.SetStateAction<TouristProfile>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  language: Language;
}

interface TravelBookingItem {
  id: string;
  title: string;
  type: 'Hotel' | 'Flight' | 'Tour';
  location: string;
  priceAZN: number;
  priceUSDT: number;
  priceBTC: number;
  imageTag: string;
  rating: number;
}

export const CryptoWallet: React.FC<CryptoWalletProps> = ({
  tourist,
  setTourist,
  transactions,
  setTransactions,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedAsset, setSelectedAsset] = useState<'BTC' | 'ETH' | 'USDT'>('USDT');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<Transaction | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const bookingCatalog: TravelBookingItem[] = [
    {
      id: 'BOOK-01',
      title: 'Fairmont Baku Flame Towers (Caspian Sea View Suite)',
      type: 'Hotel',
      location: 'Bakı, Alov Qüllələri',
      priceAZN: 480.00,
      priceUSDT: 282.35,
      priceBTC: 0.0041,
      imageTag: 'Lüks Otel',
      rating: 4.9,
    },
    {
      id: 'BOOK-02',
      title: 'Şahdağ Dağ Xizək Kurortu (Vip Dağ Evi 2 Gecə)',
      type: 'Hotel',
      location: 'Qusar, Şahdağ Dağları',
      priceAZN: 350.00,
      priceUSDT: 205.88,
      priceBTC: 0.0030,
      imageTag: 'Xizək & Spa',
      rating: 4.8,
    },
    {
      id: 'BOOK-03',
      title: 'AZAL Aviabilet (Bakı GYD ➔ London LHR)',
      type: 'Flight',
      location: 'Heydər Əliyev Beynəlxalq Aeroportu',
      priceAZN: 620.00,
      priceUSDT: 364.70,
      priceBTC: 0.0054,
      imageTag: 'Birbaşa Uçuş',
      rating: 5.0,
    },
    {
      id: 'BOOK-04',
      title: 'İçərişəhər Butik Otel & Qədim Şirvanşah Qonaqlığı',
      type: 'Hotel',
      location: 'İçərişəhər Tarixi Qoruğu',
      priceAZN: 190.00,
      priceUSDT: 111.76,
      priceBTC: 0.0016,
      imageTag: 'Tarixi Məkan',
      rating: 4.7,
    },
  ];

  // Book with crypto handler
  const handleBookWithCrypto = (item: TravelBookingItem) => {
    let deductAmount = 0;
    if (selectedAsset === 'USDT') deductAmount = item.priceUSDT;
    else if (selectedAsset === 'BTC') deductAmount = item.priceBTC;
    else deductAmount = item.priceAZN / 5680; // ETH

    const currentBal = tourist.balances[selectedAsset];
    if (currentBal < deductAmount) {
      alert(`Kifayət qədər ${selectedAsset} balansınız yoxdur. Mövcud: ${currentBal} ${selectedAsset}`);
      return;
    }

    const randomHash = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newTx: Transaction = {
      id: `TXN-CRYPTO-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      merchantName: item.title,
      category: item.type === 'Flight' ? 'Transport' : 'Hotel',
      amountAZN: item.priceAZN,
      originalAmount: Number(deductAmount.toFixed(4)),
      originalCurrency: selectedAsset,
      status: 'Completed',
      fraudRiskScore: 2,
      paymentMethod: 'Crypto Wallet',
      location: item.location,
      txHash: randomHash,
      receiptNumber: `AMB-BLOCKCHAIN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      vatRefundAZN: Number((item.priceAZN * 0.09).toFixed(2)),
    };

    // Deduct crypto and update state
    setTourist(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [selectedAsset]: Number((prev.balances[selectedAsset] - deductAmount).toFixed(4)),
      },
    }));

    setTransactions(prev => [newTx, ...prev]);
    setBookingSuccessModal(newTx);
  };

  const copyTxHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Problem & Sovereign Solution Banner */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-400/10 text-amber-300 rounded-lg shrink-0 mt-0.5">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Fintech İzahı & Virtual Aktivlər
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                Stablecoin Auto-Conversion
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {t.fintechProblems.crypto}
            </p>
          </div>
        </div>
      </div>

      {/* Crypto Balances Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* USDT Card */}
        <div 
          onClick={() => setSelectedAsset('USDT')}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            selectedAsset === 'USDT'
              ? 'bg-gradient-to-br from-emerald-950/30 to-slate-900 border-emerald-500/60 shadow-lg'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono">
                ₮
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Tether USDT</span>
                <span className="text-[10px] text-slate-400">TRC-20 & ERC-20</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              1 USDT = 1.70 AZN
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {tourist.balances.USDT.toFixed(2)} USDT
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              ≈ {(tourist.balances.USDT * 1.70).toFixed(2)} AZN ekvivalent
            </div>
          </div>
        </div>

        {/* BTC Card */}
        <div 
          onClick={() => setSelectedAsset('BTC')}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            selectedAsset === 'BTC'
              ? 'bg-gradient-to-br from-amber-950/30 to-slate-900 border-amber-500/60 shadow-lg'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono">
                ₿
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Bitcoin</span>
                <span className="text-[10px] text-slate-400">Lightning & SegWit</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              1 BTC ≈ 114,850 ₼
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {tourist.balances.BTC.toFixed(4)} BTC
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              ≈ {(tourist.balances.BTC * 114850).toFixed(2)} AZN ekvivalent
            </div>
          </div>
        </div>

        {/* ETH Card */}
        <div 
          onClick={() => setSelectedAsset('ETH')}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            selectedAsset === 'ETH'
              ? 'bg-gradient-to-br from-blue-950/30 to-slate-900 border-blue-500/60 shadow-lg'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center font-mono">
                Ξ
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Ethereum</span>
                <span className="text-[10px] text-slate-400">Layer-2 Arbitrum / Base</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
              1 ETH ≈ 5,680 ₼
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {tourist.balances.ETH.toFixed(3)} ETH
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              ≈ {(tourist.balances.ETH * 5680).toFixed(2)} AZN ekvivalent
            </div>
          </div>
        </div>
      </div>

      {/* Travel Bookings Hub: Otellər və Aviabiletlərin Kripto ilə Alınması */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-semibold text-white">
              Kripto ilə Rezervasiya (Otel & Aviabilet)
            </h3>
            <p className="text-xs text-slate-400">
              {selectedAsset} ilə ödəniş edin — Mərkəzi Bank sistemi otelə/aviadaşıyıcıya avtomatik rəsmi AZN köçürür
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Aktiv Ödəniş Valyutası:</span>
            <span className="px-2.5 py-1 text-xs font-mono font-bold text-amber-300 bg-slate-950 border border-amber-500/30 rounded">
              {selectedAsset}
            </span>
          </div>
        </div>

        {/* Bookable Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookingCatalog.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    {item.imageTag}
                  </span>
                  <span className="font-mono text-emerald-400">★ {item.rating}</span>
                </div>
                <h4 className="text-sm font-semibold text-white leading-snug">
                  {item.title}
                </h4>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Qiymət</span>
                  <div className="font-mono text-white text-sm font-bold tabular-nums">
                    {selectedAsset === 'USDT' && `${item.priceUSDT} USDT`}
                    {selectedAsset === 'BTC' && `${item.priceBTC} BTC`}
                    {selectedAsset === 'ETH' && `${(item.priceAZN / 5680).toFixed(4)} ETH`}
                    <span className="text-xs text-slate-400 ml-1.5 font-normal">
                      ({item.priceAZN} ₼)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookWithCrypto(item)}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{selectedAsset} ilə Al</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blockchain Transactions & On-Chain Explorer Proof */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Blockchain Əməliyyat Qəbzləri</h3>
            <span className="text-xs text-slate-400">
              Hər bir kripto ödənişin beynəlxalq səviyyədə hüquqi sübutu (TxHash & Blok Təsdiqi)
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Dövlət İnteqrasiyalı Node
          </span>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Tarix</th>
                <th className="py-2.5 px-3">Xidmət / Məkan</th>
                <th className="py-2.5 px-3">Kripto Məbləğ</th>
                <th className="py-2.5 px-3">AZN Ekvivalent</th>
                <th className="py-2.5 px-3">Blockchain TxHash</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions
                .filter(t => t.paymentMethod === 'Crypto Wallet' || t.txHash)
                .map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-3 text-slate-300">{tx.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-white font-sans">{tx.merchantName}</td>
                    <td className="py-2.5 px-3 text-amber-300 font-bold tabular-nums">
                      {tx.originalAmount} {tx.originalCurrency}
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 tabular-nums">
                      {tx.amountAZN.toFixed(2)} ₼
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono text-[11px]">
                        <Hash className="w-3 h-3 text-amber-400" />
                        <span>{tx.txHash ? tx.txHash.slice(0, 14) + '...' : '0x8f2a...c2'}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Təsdiqləndi (12/12)
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Success & Blockchain Proof Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1524] border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setBookingSuccessModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">
                Kripto Rezervasiya Uğurla Tamamlandı!
              </h4>
              <p className="text-xs text-slate-400">
                Mərkəzi Bankın likvidlik protokolu vasitəsilə dərhal AZN-ə çevrildi və təsdiq kodu təqdim edildi.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Bron Edilən Xidmət:</span>
                <span className="text-white font-sans font-bold">{bookingSuccessModal.merchantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ödənilən Kripto:</span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {bookingSuccessModal.originalAmount} {bookingSuccessModal.originalCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Otelə Çatdırılan Məbləğ:</span>
                <span className="text-emerald-400 font-bold tabular-nums">
                  {bookingSuccessModal.amountAZN.toFixed(2)} AZN (0 Volatillik)
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 block mb-1">On-Chain TxHash (Blockchain Sübutu):</span>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="truncate mr-2">{bookingSuccessModal.txHash}</span>
                  <button
                    onClick={() => copyTxHash(bookingSuccessModal.txHash || '')}
                    className="p-1 hover:text-white text-slate-400 cursor-pointer"
                    title="Kopyala"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                {copiedHash && (
                  <span className="text-[10px] text-emerald-400 block mt-1">
                    ✓ TxHash buferə kopyalandı!
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors cursor-pointer"
              >
                Qəbzi Çap Et
              </button>
              <button
                onClick={() => setBookingSuccessModal(null)}
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
