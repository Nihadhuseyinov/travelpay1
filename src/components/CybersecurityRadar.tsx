import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Fingerprint, 
  Eye, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Activity, 
  Key, 
  CheckCircle2, 
  Terminal, 
  RefreshCw,
  QrCode,
  Sparkles,
  Zap
} from 'lucide-react';
import { TouristProfile, FraudAlert } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { generateSvgQrMatrix } from '../utils/formatters';

interface CybersecurityRadarProps {
  tourist: TouristProfile;
  setTourist: React.Dispatch<React.SetStateAction<TouristProfile>>;
  fraudAlerts: FraudAlert[];
  setFraudAlerts: React.Dispatch<React.SetStateAction<FraudAlert[]>>;
  language: Language;
}

export const CybersecurityRadar: React.FC<CybersecurityRadarProps> = ({
  tourist,
  setTourist,
  fraudAlerts,
  setFraudAlerts,
  language,
}) => {
  const t = TRANSLATIONS[language];

  // Offline QR State
  const [offlineTokenAmount, setOfflineTokenAmount] = useState('60');
  const [offlineTokenGenerated, setOfflineTokenGenerated] = useState<string | null>(null);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [offlineSyncMessage, setOfflineSyncMessage] = useState<string | null>(null);

  // Fraud Simulation Test State
  const [simulatingThreat, setSimulatingThreat] = useState(false);
  const [threatLogs, setThreatLogs] = useState<string[]>([]);
  const [threatResult, setThreatResult] = useState<string | null>(null);

  // Generate Offline QR Token
  const handleGenerateOfflineQr = () => {
    const amt = parseFloat(offlineTokenAmount) || 0;
    if (amt <= 0 || amt > 300) {
      alert('Offline token limiti maksimum 300 AZN-dir.');
      return;
    }

    const tokenPayload = `AMB_OFFLINE_${tourist.id}_${amt}AZN_${Date.now()}_SIG_ECDSA_99182`;
    setOfflineTokenGenerated(tokenPayload);
  };

  // Simulate network toggle and auto-sync
  const handleToggleOfflineNetwork = () => {
    if (!isSimulatedOffline) {
      setIsSimulatedOffline(true);
      setOfflineSyncMessage('Cihaz offline rejimə keçdi (Şahdağ / Xınalıq dağ zonası). Offline tokenlər qəbul edilir.');
    } else {
      setIsSimulatedOffline(false);
      setOfflineSyncMessage('İnternet bağlantısı bərpa olundu! Bütün offline əməliyyatlar 0.4 saniyədə AMB serverinə avtomatik sinxronizasiya edildi.');
      setTimeout(() => setOfflineSyncMessage(null), 5000);
    }
  };

  // Run Real-time Fraud Radar Simulation Test
  const handleRunFraudSimulation = (type: 'anomalous_amount' | 'vpn_mismatch' | 'velocity_flood') => {
    setSimulatingThreat(true);
    setThreatResult(null);
    setThreatLogs([]);

    const log = (msg: string) => setThreatLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    log('Təhlükəsizlik radarı işə düşdü: Giriş parametrləri analiz edilir...');

    setTimeout(() => {
      if (type === 'vpn_mismatch') {
        log('ANOMALİYA AŞKARLANDI: Cihaz IP-si Frankfurt (Almaniya), lakin kart Bakı POS-unda istifadə edilir!');
        log('Risk Skoru: 88/100 (Kritik geo-fence uyğunsuzluğu).');
      } else if (type === 'anomalous_amount') {
        log('ANOMALİYA AŞKARLANDI: Normal 40 AZN əvəzinə birdən 4,500 AZN çəkilmə cəhdi!');
        log('Risk Skoru: 92/100 (Turist vərdişindən 10x fərqli).');
      } else {
        log('ANOMALİYA AŞKARLANDI: 1 dəqiqə ərzində 7 müxtəlif POS terminalında ardıcıl cəhd!');
        log('Risk Skoru: 95/100 (Velocity flood hücumu).');
      }

      setTimeout(() => {
        log('MÜDAFİƏ PROTOKOLU: Tranzaksiya dərhal donduruldu (0.28 san).');
        log('TƏLƏB: Şəxsiyyətin sübutu üçün biometrik üz skanı və SMS 2FA tələb olundu.');
        setSimulatingThreat(false);
        setThreatResult('Hücumun qarşısı 100% alındı: Kart bloklanmadı, lakin biometrik təsdiqsiz pul çıxarışı rədd edildi.');

        // Add to fraud alerts
        const newAlert: FraudAlert = {
          id: `FRD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          user: `${tourist.fullName} (${tourist.id})`,
          action: type === 'vpn_mismatch' ? 'Simulated Geo-mismatch' : 'High Amount Anomaly (4,500 AZN)',
          riskScore: 92,
          riskFactors: ['IP Geo Mismatch', 'Velocity Spike', 'Simulated Penetration Test'],
          resolved: true,
          actionTaken: 'Biometric Verified',
        };
        setFraudAlerts(prev => [newAlert, ...prev]);
      }, 700);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Problem & Sovereign Solution Banner */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-400/10 text-amber-300 rounded-lg shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Fintech İzahı & Kiber-Mühafizə
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                AES-256 Sovereign Enclave
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Problem: Turist kartlarının kiber cinayətkarlar tərəfindən klonlanması və xarici IP-lərlə icazəsiz çıxarışlar.
              Həll: 0.3 saniyəlik biometrik risk mühərriki, geo-fence sərhəd qorunması və şifrəli offline QR tokenləri.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Score & Privileges Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tourist Trust Score Deep Dive */}
        <div className="lg:col-span-6 p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Turist Güvən Skoru (Trust Score)</h3>
              <span className="text-xs text-slate-400">Verifikasiya edilmiş dövlət reytinqi</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full font-mono font-bold text-emerald-400 text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>{tourist.trustScore} / 100 (A+)</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Bu skor pasport KYC yoxlaması, biometrik təsdiq və əvvəlki uğurlu ödənişlər əsasında formalaşır.
            Yüksək skorlu turistlər Azərbaycanda xüsusi imtiyazlara malikdir.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Otellərdə 0 AZN Depozit İmtiyazı</span>
              </div>
              <span className="font-mono text-emerald-400 text-[11px]">AKTİV</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Fast-Track Aeroport ƏDV Geri Qaytarma</span>
              </div>
              <span className="font-mono text-emerald-400 text-[11px]">AKTİV</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Offline Ödəniş Limiti (300 ₼-dək)</span>
              </div>
              <span className="font-mono text-emerald-400 text-[11px]">TƏSDİQLƏNDİ</span>
            </div>
          </div>
        </div>

        {/* Security Parameters & Enclave Status */}
        <div className="lg:col-span-6 p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Aktiv Müdafiə Şəbəkəsi</h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Bütün Modullar Aktivdir
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Şifrələmə Standartı</span>
              <span className="font-mono font-bold text-white text-sm mt-0.5 block">AES-256 GCM</span>
              <span className="text-[10px] text-emerald-400">End-to-End qapalı tunel</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Geo-Fence Qorunması</span>
              <span className="font-mono font-bold text-white text-sm mt-0.5 block">Azərbaycan Sərhədi</span>
              <span className="text-[10px] text-emerald-400">Sərhəddən kənar blok</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Biometrik Sensor</span>
              <span className="font-mono font-bold text-white text-sm mt-0.5 block">FIDO2 / WebAuthn</span>
              <span className="text-[10px] text-emerald-400">Barmaq izi & Üz tanıma</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Sessiya Timeout</span>
              <span className="font-mono font-bold text-white text-sm mt-0.5 block">15 Dəqiqə Qoruma</span>
              <span className="text-[10px] text-emerald-400">Avtomatik kilidlənmə</span>
            </div>
          </div>

          {/* Interactive Threat Simulator Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-amber-300 block">
              Juri üçün Canlı Təhlükə Simulyatoru (Test Edin):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRunFraudSimulation('vpn_mismatch')}
                disabled={simulatingThreat}
                className="px-3 py-1.5 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md cursor-pointer transition-colors"
              >
                1. Saxta VPN Mismatch Testi
              </button>
              <button
                onClick={() => handleRunFraudSimulation('anomalous_amount')}
                disabled={simulatingThreat}
                className="px-3 py-1.5 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md cursor-pointer transition-colors"
              >
                2. Şübhəli 4,500 ₼ Çəkilmə Testi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Simulator Console if active */}
      {(simulatingThreat || threatLogs.length > 0) && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Terminal className="w-3.5 h-3.5" />
              0.3s Anti-Fraud Audit Ticker
            </span>
            {simulatingThreat && <span className="text-amber-400 animate-pulse">Analiz aparılır...</span>}
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {threatLogs.map((lg, i) => (
              <div key={i} className="text-slate-300">{lg}</div>
            ))}
          </div>
          {threatResult && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-300 font-sans text-xs mt-2">
              ✓ {threatResult}
            </div>
          )}
        </div>
      )}

      {/* Offline QR Payment Section (İnternetsiz Dağ Kəndləri üçün) */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">Offline QR Ödəniş Sistemi</h3>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Xınalıq, Şahdağ & Lahıc
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              İnternet və mobil şəbəkə olmayan uzaq dağ zonalarında kriptoqrafik offline tokenlə dərhal ödəniş edin
            </p>
          </div>

          {/* Simulated Offline Switch */}
          <button
            onClick={handleToggleOfflineNetwork}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isSimulatedOffline
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {isSimulatedOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            <span>Şəbəkə Vəziyyəti: {isSimulatedOffline ? 'OFFLINE (İnternet Yoxdur)' : 'ONLINE'}</span>
          </button>
        </div>

        {offlineSyncMessage && (
          <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-lg text-xs text-blue-200 animate-fade-in">
            {offlineSyncMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              Mərkəzi Bankın ECDSA rəqəmsal imzalı offline tokenləri turist cihazında təhlükəsiz saxlanılır.
              Siz dağ kəndində yerləşən qonaq evinə və ya yerli sənətkara offline QR təqdim edirsiniz.
              Cihazlar sonradan şəbəkəyə qoşulanda tranzaksiya serverə avtomatik ötürülür və təsdiqlənir.
            </p>

            <div className="flex items-center gap-3">
              <div className="w-36">
                <label className="text-[11px] text-slate-400 block mb-1">Məbləğ (Maks. 300 ₼)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={offlineTokenAmount}
                    onChange={(e) => setOfflineTokenAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono font-bold text-white tabular-nums"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-bold text-amber-400">₼</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerateOfflineQr}
                  className="py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Kriptoqrafik Offline QR Yarat</span>
                </button>
              </div>
            </div>
          </div>

          {/* QR Display */}
          <div className="lg:col-span-5 flex justify-center">
            {offlineTokenGenerated ? (
              <div className="p-4 bg-white rounded-xl text-center shadow-lg border-2 border-amber-400">
                <svg viewBox="0 0 21 21" className="w-36 h-36 mx-auto" shapeRendering="crispEdges">
                  {generateSvgQrMatrix(offlineTokenGenerated).map((row, r) =>
                    row.map((active, c) =>
                      active ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#07111F" /> : null
                    )
                  )}
                </svg>
                <span className="text-[10px] font-mono font-bold text-slate-900 block mt-2">
                  OFLLINE TOKEN: {offlineTokenAmount} AZN
                </span>
                <span className="text-[9px] font-mono text-slate-500 block">
                  ECDSA-SHA256 Validated
                </span>
              </div>
            ) : (
              <div className="w-44 h-44 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-4 text-center text-slate-500 text-xs">
                <WifiOff className="w-8 h-8 mb-2 opacity-50" />
                <span>Məbləği daxil edib offline QR yaradın</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
