import React, { useState } from 'react';
import { X, Receipt, CheckCircle2, QrCode, Sparkles, Building2, Download } from 'lucide-react';
import { TouristProfile } from '../types';

interface VatRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourist: TouristProfile;
}

export const VatRefundModal: React.FC<VatRefundModalProps> = ({
  isOpen,
  onClose,
  tourist,
}) => {
  if (!isOpen) return null;

  const [simulatingScan, setSimulatingScan] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);

  const vatReceipts = [
    { merchant: 'Fairmont Baku Flame Towers', amount: '480.00 ₼', vat: '+43.20 ₼', date: '22.10.2026', code: 'NBM-849102' },
    { merchant: 'Şirvanşah Muzey Restoranı', amount: '125.00 ₼', vat: '+11.25 ₼', date: '22.10.2026', code: 'NBM-849088' },
    { merchant: 'Nizami Mall Suvenirlər & Xalça', amount: '210.00 ₼', vat: '+18.90 ₼', date: '20.10.2026', code: 'NBM-848721' },
    { merchant: 'Heydər Əliyev Mərkəzi', amount: '30.00 ₼', vat: '+2.70 ₼', date: '21.10.2026', code: 'NBM-848902' },
  ];

  const handleScanReceipt = () => {
    setSimulatingScan(true);
    setTimeout(() => {
      setSimulatingScan(false);
      setScannedSuccess(true);
      setTimeout(() => setScannedSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B1728] border border-amber-400/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">ƏDV Geri Al (Tax Free)</h3>
          <p className="text-xs text-slate-400">
            Dövlət Vergi Xidməti və Mərkəzi Bankın ortaq turist keşbek portalı
          </p>
        </div>

        {/* Total VAT refunded card */}
        <div className="p-4 bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-2xl text-center space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            Cari Turist Səfərində Qazanılan ƏDV
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
            +76.05 ₼
          </div>
          <span className="text-[11px] text-slate-300 block">
            ✓ Nağdsız ödənişlərdə 9% avtomatik kartınıza qayıdıb
          </span>
        </div>

        {scannedSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Fiskal qəbz təsdiqləndi! +4.50 ₼ ƏDV balansınıza əlavə olundu.</span>
          </div>
        )}

        {/* Scan receipt button */}
        <button
          onClick={handleScanReceipt}
          disabled={simulatingScan}
          className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>{simulatingScan ? 'Fiskal QR oxunur...' : 'Yeni Çeki / QR Kodu Skan Et'}</span>
        </button>

        {/* Receipts list */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            ƏDV Qaytarılan Qəbzlər:
          </span>
          <div className="space-y-1.5">
            {vatReceipts.map((r, i) => (
              <div
                key={i}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{r.merchant}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {r.date} · Kod: {r.code}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold font-mono text-emerald-400 block">{r.vat}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Çek: {r.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Heydər Əliyev Beynəlxalq Aeroportunda gömrükdə növbəsiz Fast-Track rəqəmsal təsdiq.</span>
        </div>
      </div>
    </div>
  );
};
