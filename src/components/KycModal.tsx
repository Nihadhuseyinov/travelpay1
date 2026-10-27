import React, { useState } from 'react';
import { 
  UserCheck, 
  X, 
  FileCheck, 
  Camera, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Globe, 
  Fingerprint, 
  Eye, 
  Clock 
} from 'lucide-react';
import { TouristProfile } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourist: TouristProfile;
  setTourist: React.Dispatch<React.SetStateAction<TouristProfile>>;
  language: Language;
}

export const KycModal: React.FC<KycModalProps> = ({
  isOpen,
  onClose,
  tourist,
  setTourist,
  language,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState(tourist.fullName);
  const [passportNumber, setPassportNumber] = useState(tourist.passportNumber);
  const [nationality, setNationality] = useState(tourist.nationality);
  const [arrivalDate, setArrivalDate] = useState(tourist.arrivalDate);
  const [departureDate, setDepartureDate] = useState(tourist.departureDate);
  const [purpose, setPurpose] = useState(tourist.tripPurpose);
  const [simulatingOcr, setSimulatingOcr] = useState(false);
  const [simulatingFaceScan, setSimulatingFaceScan] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate days in Azerbaijan
  const getDays = () => {
    try {
      const d1 = new Date(arrivalDate);
      const d2 = new Date(departureDate);
      const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
      return diff > 0 ? diff : 7;
    } catch {
      return 7;
    }
  };

  const handleSimulatePassportOcr = () => {
    setSimulatingOcr(true);
    setTimeout(() => {
      setSimulatingOcr(false);
      setFullName('Alexandra Morgan');
      setPassportNumber('US-982410294');
      setNationality('United States');
      alert('Pasport OCR uğurla oxundu: MRZ kodu təsdiqləndi (AMB Dövlət Sərhəd Xidməti inteqrasiyası ilə sinxronlaşdırıldı).');
    }, 1000);
  };

  const handleSimulateBiometricEnroll = () => {
    setSimulatingFaceScan(true);
    setTimeout(() => {
      setSimulatingFaceScan(false);
      setTourist(prev => ({ ...prev, biometricEnrolled: true, trustScore: 98 }));
      alert('Biometrik FIDO2 üz modeli qeydə alındı! Sizin Trust Skorunuz 98/100-ə yüksəldildi.');
    }, 1200);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setTourist(prev => ({
      ...prev,
      fullName,
      passportNumber,
      nationality,
      arrivalDate,
      departureDate,
      tripPurpose: purpose as any,
      kycStatus: 'Verified',
    }));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0A1628] border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Turist Qeydiyyatı & Pasport KYC Sistemi
            </h3>
            <p className="text-xs text-slate-400">
              Mərkəzi Bank rəqəmsal ödəniş hesabı və güvən dərəcəsi verifikasiyası
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Turist profili və səyahət müddəti uğurla təsdiqləndi!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Quick OCR Scanner Simulator Button */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white block">Sürətli Pasport Skanı (AI OCR)</span>
              <span className="text-[11px] text-slate-400">Kamera ilə pasportun alt MRZ kodunu oxudun</span>
            </div>
            <button
              type="button"
              onClick={handleSimulatePassportOcr}
              disabled={simulatingOcr}
              className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{simulatingOcr ? 'Skan edilir...' : 'Pasportu Skan Et'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Ad və Soyad</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Pasport Nömrəsi</label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Vətəndaşlıq / Ölkə</label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              >
                <option value="United States">🇺🇸 United States (ABŞ)</option>
                <option value="United Kingdom">🇬🇧 United Kingdom (Böyük Britaniya)</option>
                <option value="Germany">🇩🇪 Germany (Almaniya)</option>
                <option value="Turkey">🇹🇷 Turkey (Türkiyə)</option>
                <option value="United Arab Emirates">🇦🇪 UAE (BƏƏ)</option>
                <option value="Azerbaijan">🇦🇿 Azerbaijan (Yerli Sakin)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Səfərin Məqsədi</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Tourism">Turizm & İstirahət</option>
                <option value="Culture & Events">Mədəniyyət & Festivallar</option>
                <option value="Business">Biznes & Konfrans</option>
                <option value="Formula 1 / Sports">Formula 1 & İdman</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Azərbaycana Giriş Tarixi</label>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Çıxış Tarixi (Hesabın Bitmə Vaxtı)</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Automatic Account Validity Calculator */}
          <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-amber-200">
                Hesabın Avtomatik Aktivlik Müddəti: <strong>{getDays()} Gün</strong>
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              0 AZN Vergi Girov Tələbi
            </span>
          </div>

          {/* Biometrics Setup */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Biometrik Giriş (Üz / Barmaq İzi)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {tourist.biometricEnrolled ? 'Təsdiqlənib' : 'Gözləmədə'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Biometrik identifikasiya kart oğurlansa belə vəsaitin çıxarılmasını qeyri-mümkün edir və Trust Skorunuzu artırır.
            </p>
            <button
              type="button"
              onClick={handleSimulateBiometricEnroll}
              disabled={simulatingFaceScan}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{simulatingFaceScan ? 'Kamera üz modelini skan edir...' : 'Üz Tanıma Modelini Yenilə'}</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors cursor-pointer"
            >
              Ləğv Et
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
            >
              Yadda Saxla və Təsdiqlə
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
