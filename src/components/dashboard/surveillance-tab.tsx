'use client';
// ============================================================
// Arogya AI Command Center — Disease Surveillance Tab
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Sparkles, MapPin, AlertCircle, CheckSquare, Square, Check,
  Radar, Users, Calendar, Activity, ChevronRight, Info
} from 'lucide-react';
import { generateOutbreakAlerts, generateAmbulances } from '@/data/generators';
import { OutbreakAlert, Ambulance } from '@/types';
import { formatDate } from '@/lib/utils';

// Coordinate boundaries to scale to SVG pixels
const MIN_LAT = 25.22;
const MAX_LAT = 25.40;
const MIN_LNG = 82.90;
const MAX_LNG = 83.08;

const VILLAGES_LIST = [
  { name: 'Rampur', lat: 25.3176, lng: 82.9739 },
  { name: 'Sultanpur', lat: 25.3400, lng: 83.0100 },
  { name: 'Laxmipur', lat: 25.2900, lng: 82.9500 },
  { name: 'Govindpur', lat: 25.3500, lng: 82.9200 },
  { name: 'Krishnapur', lat: 25.2700, lng: 83.0300 },
  { name: 'Sunderpur', lat: 25.3100, lng: 83.0500 },
  { name: 'Chandpur', lat: 25.3600, lng: 82.9900 },
  { name: 'Haripur', lat: 25.2800, lng: 82.9100 },
  { name: 'Shivpur', lat: 25.3300, lng: 82.9600 },
  { name: 'Devpur', lat: 25.2600, lng: 83.0000 },
  { name: 'Ganeshpur', lat: 25.3700, lng: 83.0200 },
  { name: 'Mohanpur', lat: 25.2500, lng: 82.9400 },
  { name: 'Sitapur', lat: 25.3800, lng: 82.9300 },
  { name: 'Janakpur', lat: 25.2400, lng: 83.0400 },
  { name: 'Ayodhyapur', lat: 25.3200, lng: 83.0600 },
];

export default function SurveillanceTab() {
  const [alerts, setAlerts] = useState<OutbreakAlert[]>(generateOutbreakAlerts());
  const [ambulances, setAmbulances] = useState<Ambulance[]>(generateAmbulances());
  const [selectedAlert, setSelectedAlert] = useState<OutbreakAlert | null>(alerts[0] || null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Checklist states for recommended actions
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (actionKey: string) => {
    setCheckedActions(prev => ({ ...prev, [actionKey]: !prev[actionKey] }));
  };

  // Convert lat/lng to SVG x/y coordinates
  const scaleCoords = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * width;
    // SVGs have y increase downwards, so invert latitude mapping
    const y = (1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * height;
    return { x, y };
  };

  const getAlertSeverityColor = (disease: string) => {
    if (disease === 'Dengue') return 'text-red-500 bg-red-500/10 border-red-500/30';
    if (disease === 'Diarrhea') return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Grid Panel: Outbreak Alerts */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-bold text-gray-950 dark:text-white text-xs flex items-center gap-1.5 border-b border-gray-100 dark:border-zinc-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-teal-500" />
              Active Outbreak Threats
            </h4>
            <div className="space-y-3">
              {alerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                const statusColor = getAlertSeverityColor(alert.disease);

                return (
                  <button
                    key={alert.id}
                    onClick={() => {
                      setSelectedAlert(alert);
                      setCheckedActions({});
                    }}
                    className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col gap-2.5 ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-500/30 shadow-md shadow-teal-500/5'
                        : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-800/80'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${statusColor}`}>
                          {alert.disease} Outbreak
                        </span>
                        <h5 className="font-bold text-xs text-gray-900 dark:text-white mt-2">
                          Cluster: {alert.casesDetected} Cases in {alert.location}
                        </h5>
                      </div>
                      <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400">
                        Conf: {alert.confidence}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 dark:border-zinc-800/50 pt-2">
                      <span className="font-medium">Surveillance status: {alert.status}</span>
                      <span>Detected {formatDate(alert.detectedDate)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Panel: Custom Animated Vector Map */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <div>
              <h4 className="font-bold text-gray-950 dark:text-white text-xs">Varanasi PHC Catchment Map</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Catchment twin tracking disease vectors and ambulances</p>
            </div>
            <Radar className="w-5 h-5 text-teal-500 animate-spin opacity-70" style={{ animationDuration: '6s' }} />
          </div>

          {/* Interactive Vector SVG Canvas */}
          <div className="relative w-full h-80 rounded-2xl bg-gray-50/50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80 p-2 flex items-center justify-center">
            <svg viewBox="0 0 500 350" className="w-full h-full select-none">
              {/* Region Grid overlay */}
              <defs>
                <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#8080800d" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" rx="12" />

              {/* Connecting boundary roads between villages */}
              <path
                d="M 50 150 Q 150 80 250 120 T 450 150 M 120 40 L 250 120 L 220 280 M 350 320 L 250 120"
                fill="none"
                stroke="#80808018"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Active Outbreak Severity Heat Pulsators */}
              {alerts.map((alert) => {
                const affectedVillages = alert.location.split(', ');
                return affectedVillages.map((villageName) => {
                  const villageObj = VILLAGES_LIST.find((v) => v.name === villageName);
                  if (!villageObj) return null;
                  const { x, y } = scaleCoords(villageObj.lat, villageObj.lng, 500, 350);
                  
                  const isDengue = alert.disease === 'Dengue';
                  const isDiarrhea = alert.disease === 'Diarrhea';
                  const color = isDengue ? '#EF4444' : isDiarrhea ? '#F59E0B' : '#3B82F6';

                  return (
                    <g key={`${alert.id}-${villageName}`}>
                      {/* Pulse Circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={alert.casesDetected * 1.8}
                        fill={color}
                        fillOpacity={0.15}
                      >
                        <animate
                          attributeName="r"
                          values={`${alert.casesDetected * 1.2};${alert.casesDetected * 2.2};${alert.casesDetected * 1.2}`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="fill-opacity"
                          values="0.25;0.05;0.25"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Inner Focus Core */}
                      <circle cx={x} cy={y} r="4" fill={color} />
                    </g>
                  );
                });
              })}

              {/* Map Nodes representing catchment villages */}
              {VILLAGES_LIST.map((village) => {
                const { x, y } = scaleCoords(village.lat, village.lng, 500, 350);
                const isHovered = hoveredNode === village.name;

                return (
                  <g
                    key={village.name}
                    onMouseEnter={() => setHoveredNode(village.name)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? '7' : '4'}
                      className="fill-teal-500/30 stroke-teal-500 dark:stroke-teal-400 transition-all duration-200"
                      strokeWidth="1.5"
                    />
                    {isHovered && (
                      <g>
                        {/* Tooltip background */}
                        <rect
                          x={x - 45}
                          y={y - 28}
                          width="90"
                          height="18"
                          rx="4"
                          fill="#1F2937"
                          className="shadow-xl"
                        />
                        <text
                          x={x}
                          y={y - 16}
                          fill="#ffffff"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {village.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Live ambulance vehicles moving on twin map */}
              {ambulances.filter(a => a.status !== 'Maintenance').map((amb) => {
                const { x, y } = scaleCoords(amb.lat, amb.lng, 500, 350);
                const isEnRoute = amb.status === 'En Route';

                return (
                  <g key={amb.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      className="fill-purple-500 stroke-white dark:stroke-zinc-900"
                      strokeWidth="1"
                    />
                    {/* Ring for active vehicles */}
                    {isEnRoute && (
                      <circle
                        cx={x}
                        cy={y}
                        r="10"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="1"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Map legend indicator */}
          <div className="flex gap-4 justify-center text-[10px] text-gray-500 border-t border-gray-100 dark:border-zinc-800/80 pt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500/20 border border-teal-500" />
              <span>Catchment Village</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500" />
              <span>Dengue Hotspot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Ambulance Active</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Recommended Preventive Actions Checklist */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col gap-4">
          {selectedAlert ? (
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="space-y-4">
                <div className="border-b border-gray-100 dark:border-zinc-800 pb-2">
                  <h4 className="font-bold text-gray-950 dark:text-white text-xs flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-teal-500" />
                    AI Vector Control Protocols
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Recommended tasks for {selectedAlert.disease} at {selectedAlert.location}</p>
                </div>

                <div className="space-y-2.5">
                  {selectedAlert.suggestedActions.map((action, idx) => {
                    const isChecked = !!checkedActions[action];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleAction(action)}
                        className="w-full p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 hover:border-teal-500/20 text-left transition-colors cursor-pointer flex items-start gap-3 group"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400 group-hover:text-teal-500 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-[11px] font-medium leading-normal ${isChecked ? 'text-gray-400 dark:text-zinc-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                          {action}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Protocol summary */}
              <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-950/40 p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800/80 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <span>
                  Completing vector tasks updates the Catchment Surveillance report. Notifications will sync with local ASHA workers in real-time.
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <ShieldAlert className="w-8 h-8 mb-2 opacity-30 text-teal-500 animate-bounce" />
              <h5 className="font-bold text-xs text-gray-700 dark:text-gray-300">Select An Alert</h5>
              <p className="text-[10px] mt-1 max-w-xs">Select any disease threat trigger in the left panel to display suggested Vector containment checklist items.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
