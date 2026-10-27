import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  CreditCard,
  MapPin,
  Clock
} from 'lucide-react';
import { TouristProfile } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourist: TouristProfile;
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  perks?: { title: string; desc: string; discount: string }[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  tourist,
  language,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Salam, ${tourist.fullName}! Azərbaycan Respublikası Mərkəzi Bankının TravelPay Ağıllı Səyahət Köməkçisinə xoş gəlmisiniz. Sizin pasport profilinizi və tranzaksiya vərdişlərinizi analiz edərək ən optimal xərcləmə və səyahət tövsiyələrini hazırladım.`,
      timestamp: '14:20',
      perks: [
        {
          title: '3 Əsas Muzeyə 15% Endirim',
          desc: 'Heydər Əliyev Mərkəzi, Qız Qalası və Xalça Muzeyində QR ilə növbəsiz keçid.',
          discount: '15% Endirim',
        },
        {
          title: 'İçərişəhər Qastronomiya Təklifi',
          desc: 'Şirvanşah və Qala Divarı restoranlarında TravelPay kartı ilə 10% keşbek.',
          discount: '10% Keşbek',
        },
      ],
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: `📊 Canlı Xərc Analiziniz: Bu həftə restoranlara orta turistdən 28% çox xərcləyirsiniz. ƏDV Geri Al (Tax Free) xidmətindən indiyədək +76.05 AZN dövlət vergi geri ödənişi toplamısınız.`,
      timestamp: '14:21',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const smartQueries = [
    'Bakıda 3 günlük optimal büdcəli plan',
    'ƏDV Geri Al (Tax Free) necə qaytarılır?',
    'Xarici kartımdan ən sərfəli konvertasiya qaydası',
    'Şahdağ və Xınalıq üçün offline QR necə işləyir?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputPrompt;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = '';
      let perksToAdd: { title: string; desc: string; discount: string }[] | undefined = undefined;

      if (q.includes('3 günlük') || q.includes('plan')) {
        aiReply = `Azərbaycan üzrə 3 günlük rəsmi tövsiyə olunan tur marşrutunuz:\n\n1-ci Gün (Tarixi Bakı): İçərişəhər, Qız Qalası, Şirvanşahlar Sarayı və Dənizkənarı Bulvar. Günorta naharı üçün TravelPay partnyoru olan "Şirvanşah" restoranında 12% endirimdən faydalanın.\n\n2-ci Gün (Müasir Memarlıq & Mədəniyyət): Zaha Hadid şah əsəri Heydər Əliyev Mərkəzi və Alov Qüllələri. Axşam Muğam Ocağında milli çay süfrəsi.\n\n3-cü Gün (Regional macəra): Qobustan palçıq vulkanları və ya Şahdağ xizək kurortu. Dağ kəndlərində internet zəif olarsa, "Offline QR Token" ilə rahat ödəniş edin.`;
      } else if (q.includes('ƏDV') || q.includes('Tax Free')) {
        aiReply = `Azərbaycanda "ƏDV Geri Al" (Tax Free) sistemi TravelPay kartınızla 100% avtomatlaşdırılıb! Partnyor mağazalardan və restoranlardan aldığınız hər qəbzdə 18% ƏDV-nin 9%-i (nağdsız ödənişdə) dərhal TravelPay balansınıza qayıdır. Hava limanında gömrükdə uzun növbədə durmağa ehtiyac qalmır, çünki Trust Score-unuz A+ səviyyəsindədir!`;
      } else if (q.includes('konvertasiya') || q.includes('kurs')) {
        aiReply = `Mərkəzi Bankın tövsiyəsi: Azərbaycanda ödəniş edərkən USD ilə ödəniş daha sərfəlidir (1 USD = 1.70 AZN sabit məzənnə). Əgər Avro və ya Funtla ödəyirsinizsə, TravelPay daxilindəki "Ağıllı Konvertasiya" vidceti vasitəsilə vəsaiti öncədən AZN-ə dəyişməyiniz məsləhətdir — beləliklə xarici bankların 3-5% gizli marjasından qorunursunuz.`;
      } else if (q.includes('offline') || q.includes('Şahdağ') || q.includes('Xınalıq')) {
        aiReply = `Xınalıq, Lahıc və Şahdağ kimi dağ zonalarında bəzən mobil rabitə olmaya bilər. TravelPay Kibertəhlükəsizlik bölməsindən şəbəkə varkən 300 AZN-dək "Offline QR Token" yaradın. Bu token şifrəli ECDSA imzası daşıyır və internet olmadan qonaq evlərində skan edilir. Bakıya qayıdanda və ya şəbəkə tapılanda serverə avtomatik ötürülür.`;
      } else {
        aiReply = `Sualınız Mərkəzi Bankın TravelPay analitik bazasında yoxlanıldı. Alexandra Morgan üçün 96 bal Trust Score və 0 AZN otel depoziti aktivdir. Bakı daxilində metro və avtobuslarda TravelPay NFC kartınızla 0.60 AZN tariflə birbaşa turniketdən keçə bilərsiniz. Hər hansı təhlükə halında 0.3s biometrik radarınız aktivdir.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        perks: perksToAdd,
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0A1628] border border-amber-500/40 rounded-2xl max-w-2xl w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#0A1628] rounded-[9px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">AI Ağıllı Səyahət Köməkçisi</h3>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  AMB İntellekt
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Fərdi tövsiyələr, xərc analitikası və real-vaxt səyahət optimallaşdırıcısı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 font-bold text-xs'
                    : 'bg-blue-600/30 border border-blue-400/30 text-blue-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-300" />}
              </div>

              <div
                className={`max-w-[82%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 font-medium'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Optional Perks Box */}
                {m.perks && (
                  <div className="mt-3 space-y-2 border-t border-slate-800/80 pt-2">
                    <span className="text-[10px] font-semibold text-amber-300 uppercase block">
                      Aktiv Turist İmtiyazlarınız:
                    </span>
                    {m.perks.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-white text-[11px]">{p.title}</div>
                          <div className="text-[10px] text-slate-400">{p.desc}</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                          {p.discount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] font-mono mt-1 text-right ${
                    m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>AI Köməkçi analiz edir və cavab hazırlayır...</span>
            </div>
          )}
        </div>

        {/* Smart Query Prompts */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0">Tez Sual:</span>
          {smartQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-amber-300 border border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Bakı səyahəti, xərc proqnozu və ya endirimlər haqqında soruşun..."
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
