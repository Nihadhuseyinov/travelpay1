import React from 'react';
import { X, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StoryModalProps {
  storyId: string | null;
  onClose: () => void;
  onActionClick: (targetTab: string) => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  storyId,
  onClose,
  onActionClick,
}) => {
  if (!storyId) return null;

  const storyDetails: Record<string, { title: string; subtitle: string; icon: string; desc: string; stats: string; actionText: string; targetTab: string }> = {
    qr: {
      title: '0.3 Saniyəlik Risk-Free QR',
      subtitle: 'Mərkəzi Bankın Biometrik Fraud Radarı',
      icon: '⚡',
      desc: 'Restoran, muzey və otellərdə ödəniş edərkən 0.3 saniyədə IP, geo-fence və cihaz ID yoxlanılır. Şübhəli halda üz skanı tələb olunur və kart oğurlansa belə pulunuz 100% qorunur.',
      stats: '99.98% Fraud-Free · 0.28 san Klirinq',
      actionText: 'QR Ödənişi Sınaqdan Keçir',
      targetTab: 'payments',
    },
    offline: {
      title: 'Dağ Zonaları üçün Offline QR',
      subtitle: 'Xınalıq, Şahdağ və Lahıcda İnternetsiz Ödəniş',
      icon: '⛰️',
      desc: 'İnternet və mobil şəbəkə olmayan uzaq dağ kəndlərində Mərkəzi Bankın ECDSA rəqəmsal imzalı offline tokenləri ilə 300 ₼-dək ödəniş edin. Şəbəkəyə qoşulduqda avtomatik sinxronlaşır.',
      stats: '100% Offline Hazır · 0 Kəsinti',
      actionText: 'Offline Token Yarat',
      targetTab: 'security',
    },
    fx: {
      title: 'Mərkəzi Bank Rəsmi Məzənnəsi',
      subtitle: '0% Gizli Spred və Hava Limanı Qənaəti',
      icon: '💱',
      desc: 'Hava limanı və küçə köşklərindəki 6-8% gizli valyuta itkisindən qorunun. Bütün xarici valyutalar (USD, EUR, GBP, TRY) birbaşa dövlət rəsmi kursu ilə dəyişdirilir.',
      stats: '0.00% Spred · 6.5% Turist Qənaəti',
      actionText: 'Valyuta Dəyişməsinə Keç',
      targetTab: 'converter',
    },
    crypto: {
      title: 'Kripto Travel Wallet',
      subtitle: 'Otel və Biletlərin USDT / BTC ilə Alınması',
      icon: '💎',
      desc: 'Fairmont Flame Towers, Şahdağ və AZAL biletlərini birbaşa USDT və ya Bitcoin ilə alın. Sistem satış nöqtəsində dərhal stabil AZN-ə konvertasiya edir və blockchain TxHash qəbzi təqdim edir.',
      stats: '0 Volatillik Riski · On-Chain Sübut',
      actionText: 'Kripto Walleti Aç',
      targetTab: 'crypto',
    },
    edv: {
      title: 'ƏDV Geri Al (Tax Free) İnteqrasiyası',
      subtitle: 'Avtomatik Dövlət Vergi Qaytarılması',
      icon: '🧾',
      desc: 'Partnyor mağazalardan və restoranlardan aldığınız hər qəbzdə 18% ƏDV-nin 9%-i avtomatik TravelPay kartınıza geri qayıdır. Hava limanında uzun gömrük növbələrinə ehtiyac yoxdur.',
      stats: '+76.05 AZN Qaytarılıb · 100% Rəqəmsal',
      actionText: 'Qəbzlər və ƏDV Balansına Bax',
      targetTab: 'analytics',
    },
    ai: {
      title: 'AI Ağıllı Səyahət Köməkçisi',
      subtitle: 'Bakı və Regionlar üçün Fərdi Marşrut',
      icon: '🤖',
      desc: 'Sizin xərcləmə vərdişlərinizi və büdcənizi analiz edərək optimal 3 günlük səyahət planı tərtib edir, muzeylərə endirimli fast-track keçid biletləri təklif edir.',
      stats: 'Real-time Xərc Analitikası',
      actionText: 'AI Köməkçi ilə Danış',
      targetTab: 'ai',
    },
  };

  const current = storyDetails[storyId] || storyDetails.qr;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#0C1E34] to-[#060F1A] border-2 border-amber-400/50 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Story Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-amber-400 rounded-full animate-pulse" />
        </div>

        <div className="text-center pt-2 space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 mx-auto flex items-center justify-center text-3xl shadow-lg">
            {current.icon}
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">{current.title}</h3>
          <span className="text-xs font-mono text-amber-300 block">{current.subtitle}</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed text-center px-1">
          {current.desc}
        </p>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Mərkəzi Bank Göstəricisi</span>
          <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">{current.stats}</span>
        </div>

        <button
          onClick={() => {
            onClose();
            onActionClick(current.targetTab);
          }}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{current.actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
