// ============================================================
// Arogya AI Command Center — Mock Data Generators
// ============================================================
import {
  Patient, Doctor, Medicine, Bed, QueueEntry, DiseaseCase,
  OutbreakAlert, Ambulance, Alert, AIInsight, StaffMember,
  VaccinationBeneficiary, WardStats, RedistributionRecommendation,
  FacilityRoom, Report, KPIData, FootfallPrediction, HeatmapCell,
  VitalRecord, Visit, Prescription, LabReport, VaccinationRecord,
  RiskFactor, CopilotMessage
} from '@/types';
import { generateId, randomBetween, randomFloat, pickRandom, getDaysAgo, getDaysFromNow, generateSparkline } from '@/lib/utils';

// --- Name Banks ---
const MALE_FIRST_NAMES = ['Rajesh', 'Suresh', 'Mahesh', 'Ramesh', 'Dinesh', 'Anil', 'Sunil', 'Vijay', 'Sanjay', 'Ajay', 'Ravi', 'Amit', 'Rahul', 'Deepak', 'Manoj', 'Prakash', 'Ganesh', 'Ashok', 'Mohan', 'Gopal', 'Arjun', 'Krishna', 'Devendra', 'Harish', 'Kishore'];
const FEMALE_FIRST_NAMES = ['Priya', 'Sunita', 'Anita', 'Kavita', 'Savita', 'Meena', 'Seema', 'Rekha', 'Lata', 'Geeta', 'Sita', 'Radha', 'Poonam', 'Asha', 'Nisha', 'Ritu', 'Neha', 'Pooja', 'Anjali', 'Deepa', 'Lakshmi', 'Saraswati', 'Durga', 'Kamla', 'Pushpa'];
const LAST_NAMES = ['Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Joshi', 'Yadav', 'Chauhan', 'Thakur', 'Pandey', 'Mishra', 'Tiwari', 'Dubey', 'Srivastava', 'Agarwal', 'Mehta', 'Shah', 'Desai', 'Kulkarni'];
const VILLAGES = ['Rampur', 'Sultanpur', 'Laxmipur', 'Govindpur', 'Krishnapur', 'Sunderpur', 'Chandpur', 'Haripur', 'Shivpur', 'Devpur', 'Ganeshpur', 'Mohanpur', 'Sitapur', 'Janakpur', 'Ayodhyapur'];
const DISTRICTS = ['Varanasi', 'Lucknow', 'Prayagraj', 'Kanpur', 'Agra'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const ALLERGIES_LIST = ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Dust', 'Pollen', 'None'];
const CHRONIC_DISEASES_LIST = ['Diabetes Type 2', 'Hypertension', 'Asthma', 'COPD', 'Arthritis', 'Thyroid', 'None'];
const SPECIALTIES = ['General Medicine', 'Pediatrics', 'Gynecology', 'Orthopedics', 'Dermatology', 'ENT', 'Ophthalmology', 'Dental'];
const QUALIFICATIONS = ['MBBS', 'MBBS, MD', 'MBBS, MS', 'BDS', 'BAMS', 'BHMS'];

const MEDICINE_DATA: { name: string; generic: string; category: string; unit: string }[] = [
  { name: 'Paracetamol 500mg', generic: 'Acetaminophen', category: 'Analgesic', unit: 'tablets' },
  { name: 'Amoxicillin 250mg', generic: 'Amoxicillin', category: 'Antibiotic', unit: 'capsules' },
  { name: 'ORS Packets', generic: 'Oral Rehydration Salts', category: 'Rehydration', unit: 'packets' },
  { name: 'Metformin 500mg', generic: 'Metformin HCl', category: 'Antidiabetic', unit: 'tablets' },
  { name: 'Amlodipine 5mg', generic: 'Amlodipine Besylate', category: 'Antihypertensive', unit: 'tablets' },
  { name: 'Cetirizine 10mg', generic: 'Cetirizine HCl', category: 'Antihistamine', unit: 'tablets' },
  { name: 'Omeprazole 20mg', generic: 'Omeprazole', category: 'Antacid', unit: 'capsules' },
  { name: 'Azithromycin 500mg', generic: 'Azithromycin', category: 'Antibiotic', unit: 'tablets' },
  { name: 'Ibuprofen 400mg', generic: 'Ibuprofen', category: 'NSAID', unit: 'tablets' },
  { name: 'Doxycycline 100mg', generic: 'Doxycycline', category: 'Antibiotic', unit: 'capsules' },
  { name: 'Iron + Folic Acid', generic: 'Ferrous Sulphate + Folic Acid', category: 'Supplement', unit: 'tablets' },
  { name: 'Albendazole 400mg', generic: 'Albendazole', category: 'Anthelmintic', unit: 'tablets' },
  { name: 'Chloroquine 250mg', generic: 'Chloroquine Phosphate', category: 'Antimalarial', unit: 'tablets' },
  { name: 'Salbutamol Inhaler', generic: 'Salbutamol', category: 'Bronchodilator', unit: 'inhalers' },
  { name: 'Povidone Iodine 5%', generic: 'Povidone Iodine', category: 'Antiseptic', unit: 'bottles' },
  { name: 'Diclofenac Gel', generic: 'Diclofenac Diethylamine', category: 'Topical NSAID', unit: 'tubes' },
  { name: 'Ranitidine 150mg', generic: 'Ranitidine HCl', category: 'Antacid', unit: 'tablets' },
  { name: 'Atenolol 50mg', generic: 'Atenolol', category: 'Beta Blocker', unit: 'tablets' },
  { name: 'Ceftriaxone 1g', generic: 'Ceftriaxone Sodium', category: 'Antibiotic', unit: 'vials' },
  { name: 'Insulin Regular', generic: 'Insulin Human', category: 'Antidiabetic', unit: 'vials' },
  { name: 'Calcium + Vit D3', generic: 'Calcium Carbonate + Cholecalciferol', category: 'Supplement', unit: 'tablets' },
  { name: 'Ondansetron 4mg', generic: 'Ondansetron', category: 'Antiemetic', unit: 'tablets' },
  { name: 'Methyldopa 250mg', generic: 'Methyldopa', category: 'Antihypertensive', unit: 'tablets' },
  { name: 'Misoprostol 200mcg', generic: 'Misoprostol', category: 'Oxytocic', unit: 'tablets' },
  { name: 'Oxytocin 5IU', generic: 'Oxytocin', category: 'Oxytocic', unit: 'ampoules' },
];

const DISEASES = ['Dengue', 'Malaria', 'Tuberculosis', 'Diarrhea', 'Influenza', 'COVID-19'];
const VACCINES = ['BCG', 'OPV', 'Pentavalent', 'Rotavirus', 'MR', 'JE', 'DPT Booster', 'TT', 'Hepatitis B', 'IPV'];

// Village coordinates around Varanasi
const VILLAGE_COORDS: Record<string, [number, number]> = {
  Rampur: [25.3176, 82.9739],
  Sultanpur: [25.3400, 83.0100],
  Laxmipur: [25.2900, 82.9500],
  Govindpur: [25.3500, 82.9200],
  Krishnapur: [25.2700, 83.0300],
  Sunderpur: [25.3100, 83.0500],
  Chandpur: [25.3600, 82.9900],
  Haripur: [25.2800, 82.9100],
  Shivpur: [25.3300, 82.9600],
  Devpur: [25.2600, 83.0000],
  Ganeshpur: [25.3700, 83.0200],
  Mohanpur: [25.2500, 82.9400],
  Sitapur: [25.3800, 82.9300],
  Janakpur: [25.2400, 83.0400],
  Ayodhyapur: [25.3200, 83.0600],
};

// ===== GENERATORS =====

function generateName(gender: 'Male' | 'Female'): string {
  const first = pickRandom(gender === 'Male' ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES);
  const last = pickRandom(LAST_NAMES);
  return `${first} ${last}`;
}

function generateVitals(count: number): VitalRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    date: getDaysAgo(count - i),
    bloodPressureSystolic: randomBetween(110, 160),
    bloodPressureDiastolic: randomBetween(65, 100),
    temperature: randomFloat(97.5, 102.5),
    heartRate: randomBetween(60, 110),
    spO2: randomBetween(90, 100),
    respiratoryRate: randomBetween(14, 24),
    weight: randomFloat(45, 95, 1),
  }));
}

function generateVisits(count: number): Visit[] {
  const types: Visit['type'][] = ['OPD', 'Emergency', 'Follow-up', 'Vaccination', 'Lab'];
  const diagnoses = ['Acute Viral Fever', 'Upper Respiratory Infection', 'Gastroenteritis', 'Hypertension follow-up', 'Diabetes check-up', 'Routine vaccination', 'Prenatal check-up', 'Joint pain', 'Skin infection', 'Urinary Tract Infection'];
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    date: getDaysAgo(i * randomBetween(5, 30)),
    type: pickRandom(types),
    doctor: `Dr. ${pickRandom(LAST_NAMES)}`,
    diagnosis: pickRandom(diagnoses),
    notes: 'Patient examined. Vitals recorded. Treatment prescribed.',
    status: i === 0 ? 'Completed' as const : pickRandom(['Completed', 'Completed', 'Completed'] as const),
  }));
}

function generateRiskFactors(score: number): RiskFactor[] {
  const allFactors: RiskFactor[] = [
    { factor: 'Age above 65', weight: 20, description: 'Elderly patients have higher complications risk' },
    { factor: 'Diabetes', weight: 18, description: 'Uncontrolled blood sugar increases disease severity' },
    { factor: 'Hypertension', weight: 15, description: 'Elevated blood pressure requires monitoring' },
    { factor: 'High fever (>101°F)', weight: 14, description: 'Persistent fever indicates active infection' },
    { factor: 'Low platelet trend', weight: 16, description: 'Declining platelets may indicate dengue' },
    { factor: 'Lives in dengue hotspot', weight: 12, description: 'Area has reported dengue cluster' },
    { factor: 'Missed follow-up visits', weight: 10, description: 'Non-compliance with treatment plan' },
    { factor: 'Pregnancy (third trimester)', weight: 15, description: 'High-risk pregnancy requires monitoring' },
    { factor: 'Low SpO2 (<94%)', weight: 18, description: 'Oxygen saturation below safe threshold' },
    { factor: 'BMI > 30', weight: 8, description: 'Obesity increases risk of complications' },
  ];
  const count = score > 70 ? randomBetween(3, 5) : score > 40 ? randomBetween(2, 3) : randomBetween(1, 2);
  const shuffled = [...allFactors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ===== EXPORTED GENERATORS =====

export function generatePatients(count: number = 50): Patient[] {
  return Array.from({ length: count }, () => {
    const gender = Math.random() > 0.5 ? 'Male' as const : 'Female' as const;
    const age = randomBetween(1, 85);
    const riskScore = randomBetween(10, 98);
    const village = pickRandom(VILLAGES);
    const hasPregnancy = gender === 'Female' && age >= 18 && age <= 40 && Math.random() > 0.6;

    return {
      id: `P${randomBetween(10000, 99999)}`,
      name: generateName(gender),
      age,
      gender,
      phone: `+91 ${randomBetween(70000, 99999)} ${randomBetween(10000, 99999)}`,
      village,
      district: pickRandom(DISTRICTS),
      bloodGroup: pickRandom(BLOOD_GROUPS),
      allergies: Math.random() > 0.6 ? [pickRandom(ALLERGIES_LIST.filter(a => a !== 'None'))] : ['None'],
      chronicDiseases: age > 40 && Math.random() > 0.4 ? [pickRandom(CHRONIC_DISEASES_LIST.filter(d => d !== 'None'))] : ['None'],
      pregnancyStatus: hasPregnancy ? pickRandom(['First Trimester', 'Second Trimester', 'Third Trimester'] as const) : 'Not Applicable',
      riskScore,
      riskFactors: generateRiskFactors(riskScore),
      lastVisit: getDaysAgo(randomBetween(0, 60)),
      registrationDate: getDaysAgo(randomBetween(30, 730)),
      vitals: generateVitals(randomBetween(3, 8)),
      visits: generateVisits(randomBetween(2, 6)),
      prescriptions: Array.from({ length: randomBetween(1, 4) }, () => ({
        id: generateId(),
        date: getDaysAgo(randomBetween(0, 90)),
        doctor: `Dr. ${pickRandom(LAST_NAMES)}`,
        medicines: Array.from({ length: randomBetween(1, 4) }, () => {
          const med = pickRandom(MEDICINE_DATA);
          return { name: med.name, dosage: '1 tablet', frequency: pickRandom(['Once daily', 'Twice daily', 'Thrice daily']), duration: `${randomBetween(3, 14)} days` };
        }),
        diagnosis: pickRandom(['Viral Fever', 'URTI', 'Gastritis', 'Hypertension', 'Diabetes']),
      })),
      labReports: Array.from({ length: randomBetween(1, 3) }, () => {
        const status = pickRandom(['Normal', 'Abnormal', 'Critical'] as const);
        return {
          id: generateId(),
          date: getDaysAgo(randomBetween(0, 60)),
          testName: pickRandom(['CBC', 'Blood Sugar', 'Platelet Count', 'Dengue NS1', 'Malaria Smear', 'Urine Routine', 'Liver Function', 'Thyroid Profile']),
          result: status === 'Normal' ? 'Within normal limits' : status === 'Abnormal' ? 'Slightly elevated' : 'Critically abnormal',
          normalRange: '4.5 - 11.0 × 10³/μL',
          status,
          technician: generateName(pickRandom(['Male', 'Female'] as const)),
        };
      }),
      vaccinations: Array.from({ length: randomBetween(0, 3) }, () => ({
        id: generateId(),
        date: getDaysAgo(randomBetween(30, 365)),
        vaccineName: pickRandom(VACCINES),
        doseNumber: randomBetween(1, 3),
        batchNumber: `B${randomBetween(1000, 9999)}`,
        administeredBy: generateName('Female'),
        nextDueDate: getDaysFromNow(randomBetween(30, 180)),
      })),
      aiRecommendation: riskScore > 70
        ? 'Immediate physician consultation recommended. Schedule follow-up within 48 hours.'
        : riskScore > 40
          ? 'Monitor vitals closely. Schedule follow-up within 1 week.'
          : 'Continue routine care. Next scheduled visit in 1 month.',
      confidenceScore: randomBetween(82, 98),
    };
  });
}

export function generateDoctors(count: number = 12): Doctor[] {
  return Array.from({ length: count }, (_, i) => {
    const patientsToday = randomBetween(15, 200);
    const burnoutRisk = patientsToday > 150 ? 'Critical' as const : patientsToday > 100 ? 'High' as const : patientsToday > 60 ? 'Medium' as const : 'Low' as const;
    return {
      id: `D${1001 + i}`,
      name: `Dr. ${pickRandom(MALE_FIRST_NAMES.concat(FEMALE_FIRST_NAMES))} ${pickRandom(LAST_NAMES)}`,
      specialty: pickRandom(SPECIALTIES),
      qualification: pickRandom(QUALIFICATIONS),
      experience: randomBetween(2, 25),
      phone: `+91 ${randomBetween(70000, 99999)} ${randomBetween(10000, 99999)}`,
      email: `dr.${pickRandom(LAST_NAMES).toLowerCase()}@phc.gov.in`,
      status: i < 2 ? 'On Leave' as const : i < 9 ? 'Available' as const : 'Busy' as const,
      patientsToday,
      avgConsultationTime: randomBetween(5, 20),
      workloadScore: Math.min(100, Math.round(patientsToday / 2)),
      burnoutRisk,
      totalConsultations: randomBetween(500, 15000),
      rating: randomFloat(3.5, 5.0, 1),
      shifts: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', department: pickRandom(SPECIALTIES) },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00', department: pickRandom(SPECIALTIES) },
        { day: 'Wednesday', startTime: '09:00', endTime: '14:00', department: pickRandom(SPECIALTIES) },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00', department: pickRandom(SPECIALTIES) },
        { day: 'Friday', startTime: '09:00', endTime: '17:00', department: pickRandom(SPECIALTIES) },
      ],
      leaveCalendar: Array.from({ length: randomBetween(0, 5) }, () => ({
        date: getDaysFromNow(randomBetween(1, 30)),
        type: pickRandom(['Casual', 'Sick', 'Earned', 'Emergency'] as const),
        status: pickRandom(['Approved', 'Pending'] as const),
      })),
    };
  });
}

export function generateMedicines(): Medicine[] {
  return MEDICINE_DATA.map((med, i) => {
    const currentStock = randomBetween(10, 5000);
    const minimumStock = randomBetween(100, 500);
    const usagePerDay = randomBetween(5, 80);
    const daysUntilExpiry = randomBetween(-5, 365);
    let stockStatus: Medicine['stockStatus'] = 'Adequate';
    if (currentStock <= 0) stockStatus = 'Out of Stock';
    else if (currentStock < minimumStock * 0.3) stockStatus = 'Critical';
    else if (currentStock < minimumStock) stockStatus = 'Low';
    else if (currentStock > minimumStock * 5) stockStatus = 'Overstocked';

    return {
      id: `M${1000 + i}`,
      name: med.name,
      genericName: med.generic,
      category: med.category,
      currentStock,
      minimumStock,
      maximumStock: minimumStock * 5,
      unit: med.unit,
      expiryDate: getDaysFromNow(daysUntilExpiry),
      batchNumber: `BN${randomBetween(10000, 99999)}`,
      supplier: pickRandom(['Indian Pharma Ltd.', 'Cipla', 'Sun Pharma', 'Dr. Reddy\'s', 'Lupin', 'Zydus', 'Hetero']),
      pricePerUnit: randomFloat(0.5, 150, 2),
      usagePerDay,
      usageTrend: generateSparkline(14, Math.max(1, usagePerDay - 20), usagePerDay + 20),
      daysUntilExpiry,
      stockStatus,
      demandForecast: Array.from({ length: 30 }, (_, j) => ({
        day: new Date(Date.now() + j * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        predicted: usagePerDay + randomBetween(-10, 10),
      })),
    };
  });
}

export function generateBeds(): Bed[] {
  const wards: Bed['ward'][] = ['ICU', 'General', 'Emergency', 'Maternity', 'Pediatric'];
  const beds: Bed[] = [];
  const wardCounts = { ICU: 8, General: 30, Emergency: 10, Maternity: 12, Pediatric: 10 };

  for (const ward of wards) {
    for (let i = 1; i <= wardCounts[ward]; i++) {
      const isOccupied = Math.random() > 0.35;
      beds.push({
        id: `${ward[0]}${String(i).padStart(2, '0')}`,
        ward,
        number: `${ward[0]}-${String(i).padStart(2, '0')}`,
        status: isOccupied ? 'Occupied' : Math.random() > 0.7 ? 'Cleaning' : 'Available',
        patient: isOccupied ? generateName(pickRandom(['Male', 'Female'] as const)) : undefined,
        admissionDate: isOccupied ? getDaysAgo(randomBetween(1, 14)) : undefined,
        predictedDischarge: isOccupied ? getDaysFromNow(randomBetween(1, 7)) : undefined,
        doctor: isOccupied ? `Dr. ${pickRandom(LAST_NAMES)}` : undefined,
      });
    }
  }
  return beds;
}

export function generateWardStats(): WardStats[] {
  return ['ICU', 'General', 'Emergency', 'Maternity', 'Pediatric'].map(ward => {
    const total = ward === 'General' ? 30 : ward === 'Maternity' ? 12 : ward === 'Emergency' ? 10 : ward === 'Pediatric' ? 10 : 8;
    const occupied = randomBetween(Math.floor(total * 0.4), total);
    return {
      ward,
      total,
      occupied,
      available: total - occupied - randomBetween(0, 2),
      cleaning: randomBetween(0, 3),
      occupancyRate: Math.round((occupied / total) * 100),
      avgStay: randomFloat(1.5, 7, 1),
    };
  });
}

export function generateQueueEntries(count: number = 25): QueueEntry[] {
  const priorities: QueueEntry['priority'][] = ['Normal', 'Emergency', 'Child', 'Senior', 'Pregnant'];
  const departments = ['General OPD', 'Pediatrics', 'Gynecology', 'Dental', 'Eye'];
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    tokenNumber: 100 + i,
    patientName: generateName(pickRandom(['Male', 'Female'] as const)),
    patientId: `P${randomBetween(10000, 99999)}`,
    priority: i < 2 ? 'Emergency' : pickRandom(priorities),
    department: pickRandom(departments),
    doctor: `Dr. ${pickRandom(LAST_NAMES)}`,
    status: i < 3 ? 'In Consultation' as const : i < 8 ? 'Waiting' as const : pickRandom(['Waiting', 'Waiting', 'Completed'] as const),
    checkInTime: new Date(Date.now() - i * randomBetween(5, 15) * 60000).toISOString(),
    estimatedWaitTime: i < 3 ? 0 : randomBetween(5, 90),
    actualWaitTime: i > 7 ? randomBetween(10, 60) : undefined,
  }));
}

export function generateDiseaseCases(count: number = 80): DiseaseCase[] {
  return Array.from({ length: count }, () => {
    const village = pickRandom(VILLAGES);
    const coords = VILLAGE_COORDS[village] || [25.3176, 82.9739];
    return {
      id: generateId(),
      disease: pickRandom(DISEASES),
      patientId: `P${randomBetween(10000, 99999)}`,
      village,
      lat: coords[0] + randomFloat(-0.02, 0.02, 4),
      lng: coords[1] + randomFloat(-0.02, 0.02, 4),
      reportDate: getDaysAgo(randomBetween(0, 90)),
      status: pickRandom(['Suspected', 'Confirmed', 'Recovered'] as const),
      severity: pickRandom(['Mild', 'Moderate', 'Severe', 'Critical'] as const),
    };
  });
}

export function generateOutbreakAlerts(): OutbreakAlert[] {
  return [
    {
      id: generateId(),
      disease: 'Dengue',
      location: 'Rampur, Sultanpur',
      confidence: 92,
      casesDetected: 14,
      suggestedActions: ['Increase platelet testing kits', 'Initiate fogging in affected areas', 'Deploy ASHA workers for community awareness', 'Stock NS1 antigen rapid test kits', 'Coordinate with District Malaria Officer'],
      status: 'Active',
      detectedDate: getDaysAgo(3),
    },
    {
      id: generateId(),
      disease: 'Diarrhea',
      location: 'Govindpur',
      confidence: 78,
      casesDetected: 8,
      suggestedActions: ['Check water supply contamination', 'Distribute ORS packets', 'Activate sanitation drive', 'Send water samples for testing'],
      status: 'Active',
      detectedDate: getDaysAgo(1),
    },
    {
      id: generateId(),
      disease: 'Malaria',
      location: 'Krishnapur, Devpur',
      confidence: 65,
      casesDetected: 5,
      suggestedActions: ['Distribute mosquito nets', 'Increase blood smear testing', 'Stock Chloroquine and ACT', 'Community vector control'],
      status: 'Monitoring',
      detectedDate: getDaysAgo(7),
    },
  ];
}

export function generateAmbulances(): Ambulance[] {
  return [
    { id: 'AMB-001', vehicleNumber: 'UP 65 AB 1234', type: '108', status: 'Available', driver: 'Raju Singh', lat: 25.3176, lng: 82.9739, fuelLevel: 85, lastMaintenance: getDaysAgo(15), nextMaintenance: getDaysFromNow(15), kmDriven: 45230 },
    { id: 'AMB-002', vehicleNumber: 'UP 65 CD 5678', type: '108', status: 'En Route', driver: 'Mohan Yadav', lat: 25.3400, lng: 83.0100, fuelLevel: 62, lastMaintenance: getDaysAgo(8), nextMaintenance: getDaysFromNow(22), currentDestination: 'Rampur Village', eta: 12, kmDriven: 38700 },
    { id: 'AMB-003', vehicleNumber: 'UP 65 EF 9012', type: '102', status: 'At Scene', driver: 'Vijay Kumar', lat: 25.2900, lng: 82.9500, fuelLevel: 45, lastMaintenance: getDaysAgo(25), nextMaintenance: getDaysFromNow(5), currentDestination: 'Laxmipur PHC', eta: 0, kmDriven: 52100 },
    { id: 'AMB-004', vehicleNumber: 'UP 65 GH 3456', type: '108', status: 'Maintenance', driver: 'Ashok Chauhan', lat: 25.3176, lng: 82.9739, fuelLevel: 30, lastMaintenance: getDaysAgo(30), nextMaintenance: getDaysFromNow(0), kmDriven: 61800 },
    { id: 'AMB-005', vehicleNumber: 'UP 65 IJ 7890', type: '102', status: 'Available', driver: 'Sanjay Verma', lat: 25.3300, lng: 82.9600, fuelLevel: 90, lastMaintenance: getDaysAgo(5), nextMaintenance: getDaysFromNow(25), kmDriven: 29400 },
  ];
}

export function generateAlerts(): Alert[] {
  return [
    { id: generateId(), title: 'Critical Medicine Shortage', description: 'ORS Packets stock below 50 units. Expected demand: 200 packets/week. Immediate procurement required.', severity: 'critical', category: 'medicine', timestamp: new Date().toISOString(), isRead: false, isResolved: false, aiRecommendation: 'Transfer 500 ORS packets from PHC Sultanpur (excess stock: 2000 units). Estimated delivery: 4 hours.', source: 'AI Inventory Monitor' },
    { id: generateId(), title: 'Doctor Absent Without Notice', description: 'Dr. Rajesh Sharma (General Medicine) has not reported for duty. 45 patients scheduled for today.', severity: 'critical', category: 'staff', timestamp: getDaysAgo(0), isRead: false, isResolved: false, aiRecommendation: 'Reassign patients to Dr. Priya Patel and Dr. Amit Kumar. Notify District CMO if absence exceeds 2 days.', source: 'Attendance System' },
    { id: generateId(), title: 'Cold Chain Temperature Alert', description: 'Vaccine refrigerator temperature at 9°C (normal: 2-8°C). Risk to vaccine potency.', severity: 'critical', category: 'equipment', timestamp: getDaysAgo(0), isRead: true, isResolved: false, aiRecommendation: 'Check refrigerator door seal. Move vaccines to backup unit. Technician dispatched — ETA: 45 minutes.', source: 'IoT Sensor' },
    { id: generateId(), title: 'Possible Dengue Cluster Detected', description: '14 suspected dengue cases reported from Rampur and Sultanpur villages in the last 7 days.', severity: 'warning', category: 'disease', timestamp: getDaysAgo(1), isRead: false, isResolved: false, aiRecommendation: 'Initiate vector control measures. Deploy rapid testing kits. Alert District Surveillance Unit.', source: 'AI Disease Surveillance' },
    { id: generateId(), title: 'Ambulance Maintenance Overdue', description: 'Ambulance AMB-004 (UP 65 GH 3456) is 5 days past scheduled maintenance.', severity: 'warning', category: 'ambulance', timestamp: getDaysAgo(2), isRead: true, isResolved: false, aiRecommendation: 'Schedule maintenance within 24 hours. Keep AMB-005 on standby as replacement.', source: 'Fleet Management' },
    { id: generateId(), title: 'High OPD Wait Time', description: 'Average waiting time in General OPD has exceeded 45 minutes (threshold: 30 minutes).', severity: 'warning', category: 'patient', timestamp: getDaysAgo(0), isRead: false, isResolved: false, aiRecommendation: 'Open additional consultation room. Deploy Dr. Verma from Pediatrics (low current load).', source: 'Queue Management AI' },
    { id: generateId(), title: 'Biomedical Waste Pickup Delayed', description: 'Scheduled biomedical waste pickup was missed. Container at 85% capacity.', severity: 'warning', category: 'infrastructure', timestamp: getDaysAgo(1), isRead: true, isResolved: false, source: 'Waste Management' },
    { id: generateId(), title: 'Low Oxygen Cylinder Stock', description: 'Only 3 oxygen cylinders remaining. Normal consumption: 2 per day.', severity: 'critical', category: 'equipment', timestamp: getDaysAgo(0), isRead: false, isResolved: false, aiRecommendation: 'Emergency order placed with supplier. Expected delivery: 6 hours. Optimize usage for critical patients only.', source: 'Inventory Monitor' },
    { id: generateId(), title: 'Bed Occupancy Critical in ICU', description: 'ICU occupancy at 100%. 2 patients awaiting ICU admission from Emergency.', severity: 'critical', category: 'patient', timestamp: getDaysAgo(0), isRead: false, isResolved: false, aiRecommendation: 'Evaluate patients G-05 and G-12 for step-down to General Ward. Contact District Hospital for ICU transfer option.', source: 'Bed Management AI' },
    { id: generateId(), title: 'Power Backup Test Due', description: 'Monthly generator test overdue by 3 days. Last test: 33 days ago.', severity: 'info', category: 'infrastructure', timestamp: getDaysAgo(3), isRead: true, isResolved: false, source: 'Maintenance Schedule' },
  ];
}

export function generateAIInsights(): AIInsight[] {
  return [
    { id: generateId(), title: 'OPD Surge Expected Tomorrow', description: 'Based on seasonal trends and local events, OPD footfall is predicted to increase by 22% tomorrow. Peak hours: 10 AM - 1 PM.', type: 'prediction', confidence: 91, severity: 'warning', actionItems: ['Assign 1 additional doctor to morning shift', 'Pre-prepare 40 OPD tokens', 'Stock additional medications for fever and cold'], module: 'Footfall AI', timestamp: new Date().toISOString() },
    { id: generateId(), title: 'Medicine Redistribution Opportunity', description: 'PHC Sultanpur has excess Amoxicillin (2300 strips). Your facility needs 500 strips within 7 days. Transfer can save ₹12,500.', type: 'recommendation', confidence: 95, severity: 'info', actionItems: ['Initiate inter-facility transfer request', 'Arrange transport logistics', 'Update inventory after receipt'], module: 'Inventory AI', timestamp: new Date().toISOString() },
    { id: generateId(), title: 'Dr. Kumar Burnout Risk: High', description: 'Dr. Kumar has seen 187 patients today (avg: 80). Working 14-hour shifts for 6 consecutive days. Burnout risk score: 89/100.', type: 'alert', confidence: 94, severity: 'critical', actionItems: ['Assign substitute doctor for tomorrow', 'Mandatory rest day within 48 hours', 'Review patient distribution algorithm'], module: 'Staff Intelligence', timestamp: new Date().toISOString() },
    { id: generateId(), title: 'Vaccination Coverage Gap Detected', description: '23 children in Chandpur village have missed Pentavalent Dose 2. Optimal outreach window: Next Tuesday (local market day).', type: 'recommendation', confidence: 88, severity: 'warning', actionItems: ['Schedule ASHA worker visit to Chandpur', 'Prepare 30 vaccine doses', 'Send SMS reminders to registered parents', 'Coordinate with AWW for mobilization'], module: 'Vaccination AI', timestamp: new Date().toISOString() },
    { id: generateId(), title: 'Queue Optimization Available', description: 'Rearranging queue by department allocation can reduce average wait time by 18 minutes.', type: 'optimization', confidence: 82, severity: 'info', actionItems: ['Implement dynamic queue routing', 'Separate OPD and follow-up queues', 'Deploy token-based SMS notifications'], module: 'Queue AI', timestamp: new Date().toISOString() },
    { id: generateId(), title: 'High-Risk Pregnancies Alert', description: '5 high-risk pregnancies identified requiring immediate follow-up. 2 patients have not visited in 3+ weeks.', type: 'alert', confidence: 96, severity: 'critical', actionItems: ['Schedule home visits by ANM', 'Arrange specialist consultation', 'Prepare emergency delivery kits', 'Alert ambulance on standby'], module: 'Patient Intelligence', timestamp: new Date().toISOString() },
  ];
}

export function generateStaffMembers(): StaffMember[] {
  const roles: { role: StaffMember['role']; dept: string; count: number }[] = [
    { role: 'doctor', dept: 'Medical', count: 8 },
    { role: 'nurse', dept: 'Nursing', count: 12 },
    { role: 'pharmacist', dept: 'Pharmacy', count: 3 },
    { role: 'lab_technician', dept: 'Laboratory', count: 4 },
    { role: 'anm', dept: 'MCH', count: 5 },
    { role: 'asha_worker', dept: 'Community', count: 15 },
  ];
  const staff: StaffMember[] = [];
  for (const r of roles) {
    for (let i = 0; i < r.count; i++) {
      const gender = r.role === 'asha_worker' || r.role === 'anm' || r.role === 'nurse' ? 'Female' as const : pickRandom(['Male', 'Female'] as const);
      staff.push({
        id: generateId(),
        name: generateName(gender),
        role: r.role,
        department: r.dept,
        status: Math.random() > 0.85 ? 'On Leave' : 'Active',
        productivityScore: randomBetween(55, 98),
        stressLevel: pickRandom(['Low', 'Medium', 'High', 'Critical'] as const),
        workloadHours: randomFloat(6, 14, 1),
        tasksCompleted: randomBetween(5, 50),
      });
    }
  }
  return staff;
}

export function generateVaccinationBeneficiaries(): VaccinationBeneficiary[] {
  return Array.from({ length: 40 }, () => {
    const isChild = Math.random() > 0.4;
    const type = isChild ? 'Child' as const : 'Pregnant Woman' as const;
    return {
      id: generateId(),
      name: generateName(isChild ? pickRandom(['Male', 'Female'] as const) : 'Female'),
      age: isChild ? randomBetween(0, 5) : randomBetween(18, 35),
      type,
      village: pickRandom(VILLAGES),
      vaccineDue: pickRandom(VACCINES),
      dueDate: getDaysFromNow(randomBetween(-30, 30)),
      status: pickRandom(['Due', 'Overdue', 'Completed', 'Missed'] as const),
      riskLevel: pickRandom(['Low', 'Medium', 'High'] as const),
      phone: `+91 ${randomBetween(70000, 99999)} ${randomBetween(10000, 99999)}`,
    };
  });
}

export function generateFootfallPredictions(): FootfallPrediction[] {
  const predictions: FootfallPrediction[] = [];
  for (let i = -7; i <= 7; i++) {
    const base = 120 + Math.sin(i * 0.5) * 30;
    const predicted = Math.round(base + randomBetween(-10, 10));
    predictions.push({
      date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      predicted,
      actual: i <= 0 ? predicted + randomBetween(-8, 8) : undefined,
      lowerBound: predicted - randomBetween(15, 25),
      upperBound: predicted + randomBetween(15, 25),
    });
  }
  return predictions;
}

export function generateHeatmapData(): HeatmapCell[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const cells: HeatmapCell[] = [];
  for (const day of days) {
    for (let hour = 8; hour <= 20; hour++) {
      const isPeak = (hour >= 10 && hour <= 13) || (hour >= 16 && hour <= 18);
      const isWeekend = day === 'Sat' || day === 'Sun';
      cells.push({
        day,
        hour,
        value: isPeak && !isWeekend ? randomBetween(15, 35) : isWeekend ? randomBetween(3, 12) : randomBetween(5, 18),
      });
    }
  }
  return cells;
}

export function generateKPIData(): KPIData[] {
  return [
    { label: 'Expected Patients', value: 142, change: 18, changeType: 'increase', icon: 'Users', trend: generateSparkline(7, 100, 160), color: '#0F766E' },
    { label: 'Doctors Available', value: 8, change: -1, changeType: 'decrease', icon: 'Stethoscope', trend: generateSparkline(7, 6, 12), color: '#14B8A6' },
    { label: 'Bed Occupancy', value: '78%', change: 5, changeType: 'increase', icon: 'Bed', trend: generateSparkline(7, 60, 90), unit: '%', color: '#F59E0B' },
    { label: 'Medicine Health', value: '85%', change: -3, changeType: 'decrease', icon: 'Pill', trend: generateSparkline(7, 75, 95), unit: '%', color: '#22C55E' },
    { label: 'Avg Wait Time', value: '32 min', change: 8, changeType: 'increase', icon: 'Clock', trend: generateSparkline(7, 20, 45), color: '#EF4444' },
    { label: 'Ambulances Active', value: 3, change: 0, changeType: 'neutral', icon: 'Truck', trend: generateSparkline(7, 2, 5), color: '#8B5CF6' },
    { label: 'Critical Alerts', value: 4, change: 2, changeType: 'increase', icon: 'AlertTriangle', trend: generateSparkline(7, 1, 8), color: '#EF4444' },
    { label: 'Efficiency Score', value: '87%', change: 3, changeType: 'increase', icon: 'TrendingUp', trend: generateSparkline(7, 78, 92), unit: '%', color: '#0F766E' },
    { label: 'Patient Satisfaction', value: '4.2', change: 0.3, changeType: 'increase', icon: 'Heart', trend: generateSparkline(7, 35, 48), color: '#EC4899' },
    { label: 'Doctors On Leave', value: 2, change: 1, changeType: 'increase', icon: 'UserMinus', trend: generateSparkline(7, 0, 4), color: '#F97316' },
  ];
}

export function generateRedistributions(): RedistributionRecommendation[] {
  return [
    { fromFacility: 'PHC Sultanpur', toFacility: 'PHC Varanasi (You)', medicine: 'ORS Packets', quantity: 500, reason: 'Critical shortage at your facility. Sultanpur has 2000+ excess stock.', savings: 4500 },
    { fromFacility: 'CHC Prayagraj', toFacility: 'PHC Varanasi (You)', medicine: 'Amoxicillin 250mg', quantity: 300, reason: 'Stock will deplete in 3 days at current usage rate.', savings: 12500 },
    { fromFacility: 'PHC Varanasi (You)', toFacility: 'PHC Govindpur', medicine: 'Cetirizine 10mg', quantity: 1000, reason: 'Your stock exceeds 6-month demand. Govindpur has critical shortage.', savings: 3200 },
  ];
}

export function generateFacilityRooms(): FacilityRoom[] {
  return [
    { id: 'opd-1', name: 'OPD Room 1', type: 'opd', x: 50, y: 50, width: 180, height: 120, occupancy: 12, capacity: 15, status: 'Busy', staff: 2 },
    { id: 'opd-2', name: 'OPD Room 2', type: 'opd', x: 250, y: 50, width: 180, height: 120, occupancy: 8, capacity: 15, status: 'Normal', staff: 1 },
    { id: 'emergency', name: 'Emergency', type: 'emergency', x: 450, y: 50, width: 200, height: 120, occupancy: 4, capacity: 6, status: 'Critical', staff: 3 },
    { id: 'lab', name: 'Laboratory', type: 'lab', x: 50, y: 200, width: 160, height: 100, occupancy: 3, capacity: 8, status: 'Normal', staff: 2 },
    { id: 'pharmacy', name: 'Pharmacy', type: 'pharmacy', x: 230, y: 200, width: 140, height: 100, occupancy: 5, capacity: 10, status: 'Busy', staff: 2 },
    { id: 'ward-gen', name: 'General Ward', type: 'ward', x: 390, y: 200, width: 260, height: 100, occupancy: 24, capacity: 30, status: 'Busy', staff: 4 },
    { id: 'ward-icu', name: 'ICU', type: 'ward', x: 50, y: 330, width: 200, height: 100, occupancy: 7, capacity: 8, status: 'Critical', staff: 4 },
    { id: 'ward-mat', name: 'Maternity Ward', type: 'ward', x: 270, y: 330, width: 200, height: 100, occupancy: 8, capacity: 12, status: 'Normal', staff: 3 },
    { id: 'waiting', name: 'Waiting Area', type: 'waiting', x: 490, y: 330, width: 160, height: 100, occupancy: 28, capacity: 40, status: 'Busy', staff: 1 },
    { id: 'admin', name: 'Admin Office', type: 'admin', x: 50, y: 460, width: 140, height: 80, occupancy: 3, capacity: 5, status: 'Normal', staff: 3 },
    { id: 'storage', name: 'Storage', type: 'storage', x: 210, y: 460, width: 120, height: 80, occupancy: 0, capacity: 0, status: 'Normal', staff: 0 },
  ];
}

export function generateReports(): Report[] {
  return [
    { id: generateId(), type: 'daily', title: 'Daily Operations Report', generatedAt: getDaysAgo(0), generatedBy: 'AI System', period: 'Today', status: 'Ready' },
    { id: generateId(), type: 'weekly', title: 'Weekly Performance Summary', generatedAt: getDaysAgo(1), generatedBy: 'AI System', period: 'Last 7 Days', status: 'Ready' },
    { id: generateId(), type: 'monthly', title: 'Monthly Health Analytics', generatedAt: getDaysAgo(5), generatedBy: 'Dr. Sharma', period: 'June 2026', status: 'Ready' },
    { id: generateId(), type: 'medicine', title: 'Medicine Consumption Report', generatedAt: getDaysAgo(2), generatedBy: 'AI System', period: 'Last 30 Days', status: 'Ready' },
    { id: generateId(), type: 'disease', title: 'Disease Surveillance Report', generatedAt: getDaysAgo(3), generatedBy: 'AI System', period: 'Q2 2026', status: 'Ready' },
    { id: generateId(), type: 'attendance', title: 'Staff Attendance Report', generatedAt: getDaysAgo(1), generatedBy: 'HR Module', period: 'June 2026', status: 'Ready' },
    { id: generateId(), type: 'performance', title: 'Hospital Performance Index', generatedAt: getDaysAgo(7), generatedBy: 'AI System', period: 'Q2 2026', status: 'Ready' },
  ];
}

export function generateCopilotSuggestions(): string[] {
  return [
    'Predict tomorrow\'s patient load',
    'Which medicines expire this week?',
    'Show overloaded doctors',
    'Suggest medicine redistribution',
    'Generate executive report',
    'Show high-risk pregnancies',
    'Which villages need vaccination drives?',
    'Recommend optimal staffing for tomorrow',
    'How can waiting time be reduced?',
    'Show dengue surveillance status',
  ];
}

// Pre-generate singleton data
let _patients: Patient[] | null = null;
let _doctors: Doctor[] | null = null;
let _medicines: Medicine[] | null = null;
let _beds: Bed[] | null = null;
let _staff: StaffMember[] | null = null;

export function getPatients(): Patient[] {
  if (!_patients) _patients = generatePatients(50);
  return _patients;
}

export function getDoctors(): Doctor[] {
  if (!_doctors) _doctors = generateDoctors(12);
  return _doctors;
}

export function getMedicines(): Medicine[] {
  if (!_medicines) _medicines = generateMedicines();
  return _medicines;
}

export function getBeds(): Bed[] {
  if (!_beds) _beds = generateBeds();
  return _beds;
}

export function getStaff(): StaffMember[] {
  if (!_staff) _staff = generateStaffMembers();
  return _staff;
}
