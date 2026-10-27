import React, { useState } from 'react';
import { ArrowRight, X, CheckCircle2, Send, CreditCard, User, ShieldCheck } from 'lucide-react';
import { TouristProfile, Transaction } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourist: TouristProfile;
  setTourist: React.Dispatch<React.SetStateAction<TouristProfile>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  tourist,
  setTourist,
  setTransactions,
}) => {
  if (!isOpen) return null;

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('30');
  const [transferType, setTransferType] = useState<'card' | 'phone'>('card');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0 || !recipient) return;

    if (tourist.balances.AZN < val) {
      alert('Balansınızda kifayət qədər vəsait yoxdur.');
      return;
    }

    const newTx: Transaction = {
      id: `TXN-P2P-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      merchantName: transferType === 'card' ? `Karta köçürmə: •••• ${recipient.slice(-4) || '8812'}` : `Köçürmə: ${recipient}`,
      category: 'P2P',
      amountAZN: val,
      originalAmount: val,
      originalCurrency: 'AZN',
      status: 'Completed',
      fraudRiskScore: 3,
      paymentMethod: 'P2P Instant',
      location: 'Mərkəzi Bank AÖS',
      receiptNumber: `AMB-P2P-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setTourist(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        AZN: prev.balances.AZN - val,
      },
    }));

    setTransactions(prev => [newTx, ...prev]);
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
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-300 mx-auto flex items-center justify-center font-bold">
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </div>
          <h3 className="text-base font-bold text-white">Karta və P2P Köçürmə</h3>
          <p className="text-xs text-slate-400">
            Azərbaycanın istənilən bank kartına 0.1 saniyədə komissiyasız köçürmə
          </p>
        </div>

        {isSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{amount} AZN vəsait uğurla köçürüldü!</span>
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setTransferType('card')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                transferType === 'card' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
              }`}
            >
              16 Rəqəmli Kart
            </button>
            <button
              type="button"
              onClick={() => setTransferType('phone')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                transferType === 'phone' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
              }`}
            >
              Mobil Nömrə
            </button>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              {transferType === 'card' ? 'Qəbul edənin Kart Nömrəsi' : 'Mobil Nömrə və ya TravelPay ID'}
            </label>
            <input
              type="text"
              placeholder={transferType === 'card' ? '4169 •••• •••• 8812' : '+994 50 123 45 67'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400">Köçürmə Məbləği</span>
              <span className="text-slate-400 font-mono">
                Mövcud: <strong className="text-white">{tourist.balances.AZN.toFixed(2)} ₼</strong>
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xl font-bold font-mono text-white focus:outline-none focus:border-amber-400 tabular-nums"
              />
              <span className="absolute right-3.5 top-3 text-sm font-bold text-amber-400">₼</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AÖS Ani Klirinq:</span>
            </span>
            <span className="font-bold text-emerald-400 font-mono">0.00% Komissiya</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer active:scale-95"
          >
            {amount} ₼ Göndər
          </button>
        </form>
      </div>
    </div>
  );
};
