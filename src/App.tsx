/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BankingHome } from './components/BankingHome';
import { PaymentsHub } from './components/PaymentsHub';
import { CurrencyConverter } from './components/CurrencyConverter';
import { CryptoWallet } from './components/CryptoWallet';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CybersecurityRadar } from './components/CybersecurityRadar';
import { AiAssistantModal } from './components/AiAssistantModal';
import { KycModal } from './components/KycModal';
import { TopUpModal } from './components/TopUpModal';
import { TransferModal } from './components/TransferModal';
import { StoryModal } from './components/StoryModal';
import { VatRefundModal } from './components/VatRefundModal';
import { Footer } from './components/Footer';

import { 
  INITIAL_TOURIST, 
  INITIAL_TRANSACTIONS, 
  INITIAL_RATES, 
  INITIAL_FRAUD_ALERTS, 
  PARTNER_MERCHANTS 
} from './data/mockData';
import { Language, TRANSLATIONS } from './utils/translations';
import { 
  Printer, 
  Sparkles, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import { Transaction } from './types';
import { generateSvgQrMatrix } from './utils/formatters';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [language, setLanguage] = useState<Language>('az');
  const [tourist, setTourist] = useState(INITIAL_TOURIST);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [rates, setRates] = useState(INITIAL_RATES);
  const [fraudAlerts, setFraudAlerts] = useState(INITIAL_FRAUD_ALERTS);

  // Interactive Modals
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [vatModalOpen, setVatModalOpen] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071322] via-[#091A30] to-[#050D17] text-slate-100 flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-200">
      {/* Top Sovereign Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tourist={tourist}
        language={language}
        setLanguage={setLanguage}
        onOpenAi={() => setAiAssistantOpen(true)}
        onOpenKyc={() => setKycOpen(true)}
        onOpenQuickPay={() => {
          setActiveTab('payments');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-4 sm:py-6 px-3 sm:px-6">
        {/* Tab 1: Overview / Home Bank Screen */}
        {activeTab === 'overview' && (
          <div className="w-full flex justify-center">
            <BankingHome
              tourist={tourist}
              setTourist={setTourist}
              transactions={transactions}
              rates={rates}
              onOpenQuickPay={() => setActiveTab('payments')}
              onOpenTransfer={() => setTransferOpen(true)}
              onOpenTopUp={() => setTopUpOpen(true)}
              onOpenConverter={() => setActiveTab('converter')}
              onOpenCrypto={() => setActiveTab('crypto')}
              onOpenSecurity={() => setActiveTab('security')}
              onOpenVat={() => setVatModalOpen(true)}
              onOpenAi={() => setAiAssistantOpen(true)}
              onSelectReceipt={(tx) => setSelectedReceipt(tx)}
              onOpenStory={(id) => setActiveStoryId(id)}
            />
          </div>
        )}

        {/* Tab 2: Payments & QR */}
        {activeTab === 'payments' && (
          <div className="max-w-5xl mx-auto py-2">
            <PaymentsHub
              tourist={tourist}
              setTourist={setTourist}
              transactions={transactions}
              setTransactions={setTransactions}
              language={language}
            />
          </div>
        )}

        {/* Tab 3: Currency Converter */}
        {activeTab === 'converter' && (
          <div className="max-w-5xl mx-auto py-2">
            <CurrencyConverter
              rates={rates}
              tourist={tourist}
              setTourist={setTourist}
              language={language}
            />
          </div>
        )}

        {/* Tab 4: Crypto Travel Wallet */}
        {activeTab === 'crypto' && (
          <div className="max-w-5xl mx-auto py-2">
            <CryptoWallet
              tourist={tourist}
              setTourist={setTourist}
              transactions={transactions}
              setTransactions={setTransactions}
              language={language}
            />
          </div>
        )}

        {/* Tab 5: Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <div className="max-w-5xl mx-auto py-2">
            <AnalyticsDashboard
              transactions={transactions}
              tourist={tourist}
              language={language}
            />
          </div>
        )}

        {/* Tab 6: Cybersecurity & Offline Tokens */}
        {activeTab === 'security' && (
          <div className="max-w-5xl mx-auto py-2">
            <CybersecurityRadar
              tourist={tourist}
              setTourist={setTourist}
              fraudAlerts={fraudAlerts}
              setFraudAlerts={setFraudAlerts}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenAi={() => setAiAssistantOpen(true)}
        onOpenKyc={() => setKycOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Floating AI Assistant Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="p-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-300/60"
          title="AI Ağıllı Səyahət Köməkçisi"
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-extrabold pr-1">AI Köməkçi</span>
        </button>
      </div>

      {/* Interactive Modals */}
      <TopUpModal
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        tourist={tourist}
        setTourist={setTourist}
      />

      <TransferModal
        isOpen={transferOpen}
        onClose={() => setTransferOpen(false)}
        tourist={tourist}
        setTourist={setTourist}
        setTransactions={setTransactions}
      />

      <StoryModal
        storyId={activeStoryId}
        onClose={() => setActiveStoryId(null)}
        onActionClick={(targetTab) => {
          if (targetTab === 'ai') setAiAssistantOpen(true);
          else setActiveTab(targetTab);
        }}
      />

      <VatRefundModal
        isOpen={vatModalOpen}
        onClose={() => setVatModalOpen(false)}
        tourist={tourist}
      />

      <AiAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        tourist={tourist}
        language={language}
      />

      <KycModal
        isOpen={kycOpen}
        onClose={() => setKycOpen(false)}
        tourist={tourist}
        setTourist={setTourist}
        language={language}
      />

      {/* Official CBAR Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1524] border border-amber-500/40 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center border-b border-slate-800 pb-3 space-y-1">
              <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/40 mx-auto flex items-center justify-center font-bold text-amber-300">
                ₼
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                MƏRKƏZİ BANK KLİRİNQ QƏBZİ
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                {selectedReceipt.receiptNumber}
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Ticarət Obyekti:</span>
                <span className="font-bold text-white text-right">{selectedReceipt.merchantName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Ödənilən Məbləğ:</span>
                <span className="font-bold text-amber-300 tabular-nums">{selectedReceipt.amountAZN.toFixed(2)} AZN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Ödəyici:</span>
                <span className="text-slate-200">{tourist.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Tarix:</span>
                <span className="text-slate-300">{selectedReceipt.timestamp}</span>
              </div>
              {selectedReceipt.vatRefundAZN && (
                <div className="flex justify-between py-1 text-emerald-400">
                  <span>ƏDV Geri Al (Tax Free):</span>
                  <span className="font-bold tabular-nums">+{selectedReceipt.vatRefundAZN.toFixed(2)} AZN</span>
                </div>
              )}
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl flex items-center justify-between text-[9px] font-mono text-slate-400">
              <div>
                <span className="text-emerald-400 font-bold block">✓ AMB AÖS ilə Təsdiqlənib</span>
                <span>SHA-256: 4f9e...1b8c</span>
              </div>
              <div className="w-10 h-10 bg-white p-1 rounded">
                <svg viewBox="0 0 21 21" className="w-full h-full" shapeRendering="crispEdges">
                  {generateSvgQrMatrix(selectedReceipt.receiptNumber).map((row, r) =>
                    row.map((active, c) =>
                      active ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#000" /> : null
                    )
                  )}
                </svg>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Çap Et</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


