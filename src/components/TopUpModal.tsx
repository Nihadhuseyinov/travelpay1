import React, { useState } from 'react';
import { Plus, X, CheckCircle2, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { TouristProfile } from '../types';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourist: TouristProfile;
  setTourist: React.Dispatch<React.SetStateAction<TouristProfile>>;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  tourist,
  setTourist,
}) => {
  if (!isOpen) return null;

  const [amount, setAmount] = useState('100');
  const [method, setMethod] = useState<'applepay' | 'card' | 'kiosk'>('applepay');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    setTourist(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        AZN: prev.balances.AZN + val,
      },
    }));

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B1728] border border-amber-400/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center font-bold">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <h3 className="text-base font-bold text-white">Balansın Artırılması</h3>
          <p className="text-xs text-slate-400">
            Mərkəzi Bank TravelPay kartınızı komissiyasız artırın
          </p>
        </div>

        {isSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>+{amount} AZN balansınıza dərhal əlavə olundu!</span>
          </div>
        )}

        <form onSubmit={handleTopUp} className="space-y-4">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Məbləğ (AZN)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="5"
                max="5000"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xl font-bold font-mono text-white focus:outline-none focus:border-amber-400 tabular-nums"
              />
              <span className="absolute right-3.5 top-3 text-sm font-bold text-amber-400">₼</span>
            </div>
          </div>

          {/* Quick preset amount chips */}
          <div className="flex gap-2">
            {['50', '100', '250', '500'].map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setAmount(p)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  amount === p 
                    ? 'bg-amber-400 text-slate-950' 
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {p} ₼
              </button>
            ))}
          </div>

          {/* Method selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] text-slate-400 block">Ödəniş Üsulu</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('applepay')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  method === 'applepay'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  method === 'card'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold">Bank Kartı</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('kiosk')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  method === 'kiosk'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold">Terminal / Nağd</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
            <span>Milli Ödəniş Sistemi Komissiyası:</span>
            <span className="font-bold text-emerald-400 font-mono">0.00% (Pulsuz)</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer active:scale-95"
          >
            {amount} ₼ Balansı Artır
          </button>
        </form>
      </div>
    </div>
  );
};
