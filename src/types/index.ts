// ============================================================
// Arogya AI Command Center — Core Type Definitions
// ============================================================

// --- Auth & Users ---
export type UserRole =
  | 'medical_officer'
  | 'doctor'
  | 'nurse'
  | 'pharmacist'
  | 'lab_technician'
  | 'anm'
  | 'asha_worker'
  | 'administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  medical_officer: 'Medical Officer',
  doctor: 'Doctor',
  nurse: 'Nurse',
  pharmacist: 'Pharmacist',
  lab_technician: 'Lab Technician',
  anm: 'ANM',
  asha_worker: 'ASHA Worker',
  administrator: 'Administrator',
};

// --- Patients ---
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  village: string;
  district: string;
  bloodGroup: string;
  allergies: string[];
  chronicDiseases: string[];
  pregnancyStatus?: 'Not Applicable' | 'First Trimester' | 'Second Trimester' | 'Third Trimester' | 'Postpartum';
  riskScore: number;
  riskFactors: RiskFactor[];
  lastVisit: string;
  registrationDate: string;
  vitals: VitalRecord[];
  visits: Visit[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  vaccinations: VaccinationRecord[];
  aiRecommendation: string;
  confidenceScore: number;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  description: string;
}

export interface VitalRecord {
  date: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  heartRate: number;
  spO2: number;
  respiratoryRate: number;
  weight: number;
}

export interface Visit {
  id: string;
  date: string;
  type: 'OPD' | 'Emergency' | 'Follow-up' | 'Vaccination' | 'Lab';
  doctor: string;
  diagnosis: string;
  notes: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
}

export interface Prescription {
  id: string;
  date: string;
  doctor: string;
  medicines: PrescribedMedicine[];
  diagnosis: string;
}

export interface PrescribedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface LabReport {
  id: string;
  date: string;
  testName: string;
  result: string;
  normalRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  technician: string;
}

export interface VaccinationRecord {
  id: string;
  date: string;
  vaccineName: string;
  doseNumber: number;
  batchNumber: string;
  administeredBy: string;
  nextDueDate?: string;
}

// --- Doctors ---
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  avatar?: string;
  phone: string;
  email: string;
  status: 'Available' | 'Busy' | 'On Leave' | 'Off Duty';
  patientsToday: number;
  avgConsultationTime: number;
  workloadScore: number;
  burnoutRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  totalConsultations: number;
  rating: number;
  shifts: Shift[];
  leaveCalendar: LeaveRecord[];
}

export interface Shift {
  day: string;
  startTime: string;
  endTime: string;
  department: string;
}

export interface LeaveRecord {
  date: string;
  type: 'Casual' | 'Sick' | 'Earned' | 'Emergency';
  status: 'Approved' | 'Pending' | 'Rejected';
}

// --- Staff ---
export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'On Leave' | 'Off Duty';
  productivityScore: number;
  stressLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  workloadHours: number;
  tasksCompleted: number;
  avatar?: string;
}

// --- Medicine Inventory ---
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
  pricePerUnit: number;
  usagePerDay: number;
  usageTrend: number[];
  daysUntilExpiry: number;
  stockStatus: 'Adequate' | 'Low' | 'Critical' | 'Out of Stock' | 'Overstocked';
  demandForecast: { day: string; predicted: number }[];
}

export interface RedistributionRecommendation {
  fromFacility: string;
  toFacility: string;
  medicine: string;
  quantity: number;
  reason: string;
  savings: number;
}

// --- Beds ---
export interface Bed {
  id: string;
  ward: 'ICU' | 'General' | 'Emergency' | 'Maternity' | 'Pediatric';
  number: string;
  status: 'Occupied' | 'Available' | 'Cleaning' | 'Maintenance' | 'Reserved';
  patient?: string;
  admissionDate?: string;
  predictedDischarge?: string;
  doctor?: string;
}

export interface WardStats {
  ward: string;
  total: number;
  occupied: number;
  available: number;
  cleaning: number;
  occupancyRate: number;
  avgStay: number;
}

// --- Queue ---
export interface QueueEntry {
  id: string;
  tokenNumber: number;
  patientName: string;
  patientId: string;
  priority: 'Normal' | 'Emergency' | 'Child' | 'Senior' | 'Pregnant';
  department: string;
  doctor: string;
  status: 'Waiting' | 'In Consultation' | 'Completed' | 'No Show';
  checkInTime: string;
  estimatedWaitTime: number;
  actualWaitTime?: number;
}

// --- Disease Surveillance ---
export interface DiseaseCase {
  id: string;
  disease: string;
  patientId: string;
  village: string;
  lat: number;
  lng: number;
  reportDate: string;
  status: 'Suspected' | 'Confirmed' | 'Recovered' | 'Deceased';
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
}

export interface OutbreakAlert {
  id: string;
  disease: string;
  location: string;
  confidence: number;
  casesDetected: number;
  suggestedActions: string[];
  status: 'Active' | 'Monitoring' | 'Resolved';
  detectedDate: string;
}

// --- Vaccination ---
export interface VaccinationBeneficiary {
  id: string;
  name: string;
  age: number;
  type: 'Child' | 'Pregnant Woman' | 'Adult';
  village: string;
  vaccineDue: string;
  dueDate: string;
  status: 'Due' | 'Overdue' | 'Completed' | 'Missed';
  riskLevel: 'Low' | 'Medium' | 'High';
  phone: string;
}

// --- Ambulance ---
export interface Ambulance {
  id: string;
  vehicleNumber: string;
  type: '108' | '102' | 'Private';
  status: 'Available' | 'En Route' | 'At Scene' | 'Returning' | 'Maintenance';
  driver: string;
  lat: number;
  lng: number;
  fuelLevel: number;
  lastMaintenance: string;
  nextMaintenance: string;
  currentDestination?: string;
  eta?: number;
  kmDriven: number;
  dispatchTime?: number;
}

// --- Alerts ---
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory =
  | 'medicine'
  | 'staff'
  | 'equipment'
  | 'disease'
  | 'infrastructure'
  | 'patient'
  | 'ambulance';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  isRead: boolean;
  isResolved: boolean;
  aiRecommendation?: string;
  source: string;
}

// --- AI Insights ---
export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  confidence: number;
  severity: AlertSeverity;
  actionItems: string[];
  module: string;
  timestamp: string;
}

// --- KPI ---
export interface KPIData {
  label: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  trend: number[];
  unit?: string;
  color?: string;
}

// --- Charts ---
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface FootfallPrediction {
  date: string;
  predicted: number;
  actual?: number;
  lowerBound: number;
  upperBound: number;
}

export interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

// --- Digital Twin ---
export interface FacilityRoom {
  id: string;
  name: string;
  type: 'opd' | 'emergency' | 'lab' | 'pharmacy' | 'ward' | 'waiting' | 'admin' | 'storage';
  x: number;
  y: number;
  width: number;
  height: number;
  occupancy: number;
  capacity: number;
  status: 'Normal' | 'Busy' | 'Critical' | 'Closed';
  staff: number;
}

// --- Reports ---
export type ReportType = 'daily' | 'weekly' | 'monthly' | 'medicine' | 'attendance' | 'disease' | 'performance';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  generatedAt: string;
  generatedBy: string;
  period: string;
  status: 'Ready' | 'Generating' | 'Failed';
  downloadUrl?: string;
}

// --- Settings ---
export interface HospitalSettings {
  name: string;
  type: 'PHC' | 'CHC' | 'District Hospital';
  district: string;
  state: string;
  departments: string[];
  aiThresholds: {
    riskScoreAlert: number;
    burnoutThreshold: number;
    stockAlertDays: number;
    outbreakConfidence: number;
    queueAlertMinutes: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  language: 'en' | 'hi' | 'gu' | 'mr';
  theme: 'light' | 'dark' | 'system';
}

// --- Copilot ---
export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  charts?: ChartDataPoint[];
  suggestions?: string[];
}
