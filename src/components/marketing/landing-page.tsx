'use client';
// ============================================================
// Arogya AI Command Center — Marketing Landing Page
// ============================================================
import { motion } from 'framer-motion';
import {
  Sparkles, Bed, Truck, BarChart2, ShieldCheck, ChevronRight,
  TrendingUp, Activity, Fuel, Navigation, Globe, ArrowUpRight
} from 'lucide-react';

interface LandingPageProps {
  onEnterPortal: () => void;
}

export default function LandingPage({ onEnterPortal }: LandingPageProps) {
  
  // Custom scroll handler to features section
  const handleScrollToFeatures = () => {
    const element = document.getElementById('features-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-teal-500/20 selection:text-teal-300 relative overflow-hidden">
      
      {/* Background Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[400px] right-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl -z-10 animate-pulse duration-5000" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

      {/* Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-gray-800/40 relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Arogya AI
            </span>
            <span className="block text-[8px] tracking-widest text-teal-400/80 font-bold uppercase leading-none mt-0.5">
              Command Platform
            </span>
          </div>
        </div>

        {/* Center Links (Scroll navigation) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-400">
          <a href="#features-section" onClick={(e) => { e.preventDefault(); handleScrollToFeatures(); }} className="hover:text-white transition-colors">Features</a>
          <a href="#metrics-section" className="hover:text-white transition-colors">Operational Metrics</a>
          <a href="#footer-section" className="hover:text-white transition-colors">About Portal</a>
        </nav>

        <button
          onClick={onEnterPortal}
          className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 text-white rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5"
        >
          <span>Launch Command Center</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32 grid md:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column Text details */}
        <div className="md:col-span-6 flex flex-col gap-6 text-center md:text-left">
          
          {/* Badge Tag */}
          <div className="w-fit mx-auto md:mx-0 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/10 flex items-center gap-1.5 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-[10px] uppercase font-black tracking-widest text-teal-400">
              AI-Powered Healthcare Operations
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white">
            Optimize Hospital Operations in <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Real-Time</span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto md:mx-0">
            A unified digital twin dashboard for bed allocation, smart ambulance transit logs, and diagnostic clinic analytics. Powered by predictive AI to handle surges.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
            <button
              onClick={onEnterPortal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/15 text-white font-extrabold text-sm rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Enter Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleScrollToFeatures}
              className="px-6 py-3 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white font-bold text-sm rounded-xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer flex items-center justify-center"
            >
              <span>View Features Overview</span>
            </button>
          </div>
        </div>

        {/* Right Column: Complex Command Mockup visualization */}
        <div className="md:col-span-6 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-3xl blur-2xl -z-10" />
          
          {/* Main Visual Frame */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md p-5 rounded-3xl bg-[#0F1626] border border-gray-800 shadow-2xl shadow-black/80 flex flex-col gap-4 select-none relative overflow-hidden"
          >
            {/* Glossy Header Bar */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] text-gray-500 font-bold tracking-wider uppercase ml-1">Live Twin telemetry</span>
              </div>
              <span className="text-[8px] font-bold text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded">SYNCED &lt; 1s</span>
            </div>

            {/* Sub mockup widgets */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Ward occupancy twin mockup */}
              <div className="p-3.5 rounded-2xl bg-[#172036] border border-gray-800 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-gray-400 font-bold uppercase">Bed occupancy</span>
                  <Bed className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[...Array(12)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-2.5 h-2.5 rounded-md border ${
                        i % 5 === 0 ? 'bg-rose-500/20 border-rose-500/50' : 'bg-emerald-500/20 border-emerald-500/50'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] font-semibold text-gray-400">
                  <span>Available: 10</span>
                  <span className="text-rose-400">Occupied: 2</span>
                </div>
              </div>

              {/* Ambulance dispatch logs mockup */}
              <div className="p-3.5 rounded-2xl bg-[#172036] border border-gray-800 flex flex-col gap-2.5 justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-gray-400 font-bold uppercase">Transit fleet</span>
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] text-gray-400">
                    <span>UP65-AM108</span>
                    <span className="text-blue-400 font-bold">En Route</span>
                  </div>
                  <div className="flex items-center justify-between text-[8px]">
                    <span className="flex items-center gap-1 font-semibold">
                      <Fuel className="w-3 h-3 text-emerald-400" />
                      Fuel Level
                    </span>
                    <span className="font-extrabold">94%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                    <div className="w-[94%] h-full bg-emerald-500" />
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Live Analytics Bar chart preview */}
            <div className="p-3.5 rounded-2xl bg-[#172036] border border-gray-800 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-gray-400 font-bold uppercase">Surge Load Forecast</span>
                <span className="text-[8px] text-emerald-400 font-extrabold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +12% surge expected
                </span>
              </div>
              <div className="flex items-end justify-between h-14 pt-2">
                {[30, 45, 60, 40, 75, 90, 60].map((h, i) => (
                  <div key={i} className="w-6 bg-gray-800 rounded-t-md h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-teal-500/20 to-teal-400 rounded-t-md"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[7px] text-gray-500 font-bold">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
            </div>

          </motion.div>
        </div>

      </section>

      {/* Features Grid Section */}
      <section id="features-section" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-800/40 relative z-10 scroll-mt-6">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-white leading-tight">
            Intelligent Features for Modern Healthcare
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Streamline workflows, automate ambulance transit tracking, and monitor bed sanitization cycles seamlessly.
          </p>
        </div>

        {/* 3 Grid Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#0F1626]/80 border border-gray-800/75 flex flex-col gap-4 hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
              <Bed className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">Digital Twin Ward Map</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Visual grid maps displaying real-time ICU, Maternity, and General ward bed occupancies. Discharge patients or trigger bed sanitization states in a click.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#0F1626]/80 border border-gray-800/75 flex flex-col gap-4 hover:border-teal-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:bg-teal-500/20 transition-all">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">Smart Fleet Dispatch</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Track emergency fleet dispatches dynamically. Measure exact fuel consumption levels depending on transit times and block dispatches of low-fuel vehicles.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#0F1626]/80 border border-gray-800/75 flex flex-col gap-4 hover:border-purple-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">Predictive Surge Forecasts</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Forecast upcoming patient surges and compute average ward admission lengths to optimize doctor shifts and prevent clinicial burnout rates.
            </p>
          </div>

        </div>
      </section>

      {/* Metrics Banner Section */}
      <section id="metrics-section" className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-800/40 relative z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-[#0F1626] border border-gray-800 shadow-xl flex flex-col gap-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-800 text-center">
            <div className="flex flex-col gap-2">
              <span className="text-3xl md:text-5xl font-black text-white">94%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Bed occupancy accuracy</span>
            </div>
            <div className="flex flex-col gap-2 pl-4 md:pl-0">
              <span className="text-3xl md:text-5xl font-black text-teal-400">1.5%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Fuel drop rate (Transit)</span>
            </div>
            <div className="flex flex-col gap-2 pl-4 md:pl-0">
              <span className="text-3xl md:text-5xl font-black text-rose-500">12%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Low Fuel Lockout limit</span>
            </div>
            <div className="flex flex-col gap-2 pl-4 md:pl-0">
              <span className="text-3xl md:text-5xl font-black text-blue-500">&lt; 5s</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Twin Sync Latency</span>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Get Started Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 text-center">
        <div className="max-w-3xl mx-auto p-10 md:p-16 rounded-3xl bg-gradient-to-b from-[#131B2E] to-[#0F1626] border border-gray-800 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          
          {/* Accent decoration glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl -z-10" />

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Modernize Your Hospital Operations?
          </h2>
          
          <p className="text-gray-400 text-xs md:text-sm max-w-lg leading-relaxed">
            Deploy Arogya AI at your health facility to streamline bed allocations, control transit queues, and sync analytics.
          </p>

          <button
            onClick={onEnterPortal}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25 text-white font-extrabold text-sm rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-2 mt-4"
          >
            <span>Launch Command Center</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer-section" className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-800/40 relative z-50 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">Arogya AI</span>
            <p className="text-[9px] mt-0.5">Automated Clinical Intelligence Twin</p>
          </div>
        </div>

        <div className="flex gap-6 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Platform Docs</a>
        </div>

        <p>© 2026 Arogya AI. All rights reserved.</p>
      </footer>

    </div>
  );
}
