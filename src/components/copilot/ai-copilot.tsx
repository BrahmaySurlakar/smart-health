'use client';
// ============================================================
// Arogya AI Command Center — AI Copilot Drawer
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Send, Bot, User, TrendingUp, Pill, Users,
  Stethoscope, BarChart3, Syringe, Radar, ChevronRight
} from 'lucide-react';
import { useNotificationStore } from '@/stores/notification-store';
import { CopilotMessage } from '@/types';
import { generateId } from '@/lib/utils';
import { generateCopilotSuggestions } from '@/data/generators';

const COPILOT_RESPONSES: Record<string, string> = {
  "predict tomorrow's patient load": `## Patient Load Forecast — Tomorrow\n\n**Predicted OPD Patients:** 156 (↑18% from today)\n\n**Peak Hours:**\n- 10:00 AM - 11:30 AM (32 patients)\n- 4:00 PM - 5:30 PM (28 patients)\n\n**Staff Required:**\n- Doctors: 5 (currently 4 scheduled)\n- Nurses: 7 (currently 6 scheduled)\n\n**⚠️ Recommendation:** Assign Dr. Verma from Pediatrics (low load) to General OPD during morning peak.\n\n**Confidence: 91%**`,

  "which medicines expire this week": `## Medicines Expiring This Week\n\n| Medicine | Batch | Expiry | Stock |\n|----------|-------|--------|-------|\n| Cetirizine 10mg | BN45231 | Jul 4 | 120 tablets |\n| Povidone Iodine | BN38821 | Jul 5 | 8 bottles |\n| Ranitidine 150mg | BN51023 | Jul 7 | 45 tablets |\n\n**⚠️ Total at risk: ₹3,240 worth of medicines**\n\n**Recommendation:** Prioritize dispensing these medicines for current patients. Transfer excess to PHC Sultanpur if not consumed by Jul 3.`,

  "show overloaded doctors": `## Overloaded Doctors — Today\n\n🔴 **Dr. Amit Kumar** — 187 patients (Burnout Risk: CRITICAL)\n- Working 14-hour shift for 6 consecutive days\n- Recommendation: Mandatory rest tomorrow. Assign substitute.\n\n🟠 **Dr. Priya Patel** — 142 patients (Burnout Risk: HIGH)\n- Avg consultation time dropped to 4 min (quality concern)\n- Recommendation: Redistribute 30 patients to Dr. Verma.\n\n🟡 **Dr. Rajesh Sharma** — 98 patients (Burnout Risk: MEDIUM)\n- Within acceptable range but trending upward.\n\n**AI Suggestion:** Hire 1 additional contract physician for peak days (Mon, Wed, Fri).`,

  "suggest medicine redistribution": `## Smart Redistribution Plan\n\n### Transfer IN (You need):\n1. **ORS Packets** — 500 units from PHC Sultanpur\n   - They have 2000+ excess, you're at critical level\n   - Savings: ₹4,500\n\n2. **Amoxicillin 250mg** — 300 strips from CHC Prayagraj\n   - Your stock depletes in 3 days\n   - Savings: ₹12,500\n\n### Transfer OUT (Your excess):\n1. **Cetirizine 10mg** — 1000 tablets to PHC Govindpur\n   - You have 6-month excess supply\n   - Helps critical shortage at Govindpur\n\n**Total Potential Savings: ₹20,200**\n**Waste Reduction: ~340 medicine units saved from expiry**`,

  "generate executive report": `## 📊 Executive Report — July 2, 2026\n\n### PHC Varanasi | Daily Operations Summary\n\n**Hospital Health Score: 87/100** ✅\n\n| Metric | Today | Yesterday | Change |\n|--------|-------|-----------|--------|\n| OPD Patients | 142 | 120 | ↑18% |\n| Avg Wait Time | 32 min | 28 min | ↑14% |\n| Bed Occupancy | 78% | 72% | ↑8% |\n| Medicine Score | 85% | 88% | ↓3% |\n| Staff Available | 38/47 | 42/47 | ↓9% |\n\n**Critical Actions Required:**\n1. Procure ORS packets (stock critically low)\n2. Address Dr. Kumar burnout (187 patients today)\n3. Investigate dengue cluster in Rampur village\n4. Schedule AMB-004 maintenance\n\n**AI Confidence: 94%**`,

  "show high-risk pregnancies": `## High-Risk Pregnancies — Active Cases\n\n🔴 **Sunita Devi** (P34521) — Risk: 92%\n- Third trimester, Age: 38, Gestational diabetes\n- Last visit: 18 days ago ⚠️\n- Action: Urgent ANM home visit\n\n🔴 **Kamla Yadav** (P28934) — Risk: 88%\n- Second trimester, Hypertension, Previous C-section\n- Last visit: 22 days ago ⚠️\n- Action: Schedule specialist consultation\n\n🟠 **Geeta Singh** (P45123) — Risk: 76%\n- Third trimester, Anemia (Hb: 8.2)\n- Last visit: 5 days ago\n- Action: Iron supplement compliance check\n\n🟠 **Radha Sharma** (P51890) — Risk: 71%\n- First trimester, Age: 17\n- Action: Nutrition counseling, regular monitoring\n\n🟡 **Asha Kumari** (P39201) — Risk: 65%\n- Second trimester, BMI > 30\n- Action: Diet plan, weekly weight monitoring\n\n**Total High-Risk: 5 | Overdue Follow-up: 2**`,

  "which villages need vaccination drives": `## Vaccination Coverage Gap Analysis\n\n### Priority Villages for Outreach:\n\n1. 🔴 **Chandpur** — 23 children missed Pentavalent Dose 2\n   - Best day: Tuesday (market day, high turnout)\n   - Estimated time: 4 hours\n\n2. 🔴 **Rampur** — 18 children missed MR vaccine\n   - Best day: Wednesday\n   - Estimated time: 3 hours\n\n3. 🟠 **Devpur** — 12 pregnant women missed TT\n   - Best day: Thursday (ANW meeting day)\n   - Estimated time: 2.5 hours\n\n4. 🟡 **Govindpur** — 8 children missed OPV booster\n   - Can combine with routine visit\n\n**Optimal Route: Chandpur → Rampur → Devpur → Govindpur**\n**Total estimated time: 1 full day**\n**Total beneficiaries: 61**`,

  "recommend staffing": `## Optimal Staffing Recommendation — Tomorrow\n\n### Based on predicted footfall of 156 patients:\n\n| Role | Required | Scheduled | Gap | Action |\n|------|----------|-----------|-----|--------|\n| Doctors | 5 | 4 | 1 | Recall Dr. Verma |\n| Nurses | 7 | 6 | 1 | Request from CHC |\n| Pharmacists | 2 | 2 | 0 | ✅ |\n| Lab Tech | 2 | 2 | 0 | ✅ |\n| Support | 4 | 3 | 1 | Assign from admin |\n\n**Key Actions:**\n- Shift Dr. Verma from Pediatrics (low load: 15 patients) to General OPD\n- Request 1 nurse from CHC Prayagraj for morning shift\n- Deploy admin support staff to help with crowd management\n\n**Projected Impact:**\n- Wait time reduction: 32 min → 22 min (-31%)\n- Patient satisfaction improvement: +0.3 points`,

  "how can waiting time be reduced": `## Wait Time Optimization Plan\n\n**Current Avg Wait: 32 minutes** (Target: <20 min)\n\n### Immediate Actions (Impact: -10 min):\n1. **Open OPD Room 3** for overflow (currently unused)\n2. **Separate follow-up queue** from new patient queue\n3. **Deploy token-based SMS** — patients arrive closer to their time\n\n### Short-term Actions (Impact: -8 min):\n1. **Dynamic queue routing** — redirect patients to least-busy doctor\n2. **Pre-consultation screening** by nurses (vitals, basic history)\n3. **Digital prescription** — saves 3 min per consultation\n\n### Long-term Actions (Impact: -5 min):\n1. **Staggered appointments** — 30% walk-in, 70% scheduled\n2. **Telemedicine** for follow-ups (reduces physical load by 20%)\n3. **Self-service kiosk** for registration\n\n**Projected Result: 32 min → 18 min (-44%)**\n**Patient Satisfaction Impact: +0.5 points**`,

  "show dengue surveillance status": `## Dengue Surveillance Report\n\n### Current Status: ⚠️ CLUSTER DETECTED\n\n**Confidence: 92%**\n\n### Affected Areas:\n| Village | Cases | Status | Trend |\n|---------|-------|--------|-------|\n| Rampur | 8 | Active | ↑ |\n| Sultanpur | 6 | Active | → |\n| Krishnapur | 2 | Monitoring | ↓ |\n\n**Total Suspected Cases: 16** (Last 14 days)\n**Confirmed: 11 | Recovered: 3 | Under treatment: 8**\n\n### Actions Taken:\n- ✅ NS1 rapid testing kits stocked\n- ✅ Platelet count monitoring initiated\n- ⏳ Fogging scheduled for tomorrow\n- ⏳ ASHA workers deployed for awareness\n\n### Resource Status:\n- Platelet testing kits: 45 remaining (adequate for 7 days)\n- NS1 kits: 30 remaining (need reorder by Jul 5)\n- Dengue IEC materials: Distributed to 8/15 villages`,
};

function getResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  for (const [key, value] of Object.entries(COPILOT_RESPONSES)) {
    if (lowerQuery.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerQuery)) {
      return value;
    }
  }
  // Default intelligent response
  return `## Analysis in Progress\n\nI've analyzed your query: "${query}"\n\n**Here's what I found:**\n\nBased on current facility data:\n- **Hospital Health Score:** 87/100\n- **Active Patients:** 142 today\n- **Staff Utilization:** 81%\n- **Medicine Availability:** 85%\n\n**Key Insights:**\n1. OPD load is trending 18% above weekly average\n2. 4 critical alerts require immediate attention\n3. Disease surveillance shows elevated dengue risk in 2 villages\n\n**Recommendation:** I suggest reviewing the Alert Center for immediate actions and checking the Daily Briefing for comprehensive operational insights.\n\n*For specific queries, try asking about patients, medicines, doctors, diseases, vaccination, or staffing.*`;
}

export default function AICopilot() {
  const { copilotOpen, setCopilotOpen } = useNotificationStore();
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: '👋 Hello! I\'m your AI Copilot for PHC Varanasi. I can help you with patient predictions, medicine management, disease surveillance, staff optimization, and more.\n\nTry asking me something, or click a suggestion below!',
      timestamp: new Date().toISOString(),
      suggestions: generateCopilotSuggestions().slice(0, 4),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (copilotOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [copilotOpen]);

  const handleSend = (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const userMsg: CopilotMessage = {
      id: generateId(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(query);
      const assistantMsg: CopilotMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        suggestions: generateCopilotSuggestions()
          .filter((s) => s.toLowerCase() !== query.toLowerCase())
          .slice(0, 3),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 1200 + (800 * 0.5)); // fixed 1600ms delay — avoids impure Math.random in render
  };

  return (
    <AnimatePresence>
      {copilotOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            onClick={() => setCopilotOpen(false)}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">AI Copilot</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Arogya Intelligence Engine</p>
                </div>
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] ${msg.role === 'user' ? 'order-1' : 'order-1'}`}>
                    <div className="flex items-start gap-2">
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed prose-sm">{msg.content}</div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Suggestions */}
                    {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 ml-9 flex flex-wrap gap-2">
                        {msg.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(suggestion)}
                            className="text-xs px-3 py-1.5 rounded-full border border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 transition-colors flex items-center gap-1"
                          >
                            <ChevronRight className="w-3 h-3" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about your facility..."
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
