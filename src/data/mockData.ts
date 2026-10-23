import {
  SubscriptionPlan,
  UserMembership,
  ScheduledCheck,
  MedicationOrder,
  TeleConsultSession,
  SupportChatMessage,
} from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_standard',
    name: 'CarePlus Essential',
    pricePerYear: 590,
    highlight: 'Ideal for individuals seeking proactive yearly health assurance and guaranteed emergency ambulance coverage.',
    features: {
      scheduledChecks: '1 Comprehensive Annual Health Check (Clinic partner or home kit)',
      emergencyAmbulance: '100% Covered Emergency Ambulance (ALS ground dispatch)',
      teleDiagnostics: '4 Comprehensive MD Consultations with vital telemetry',
      drugDelivery: 'Free 24-hour scheduled medication doorstep delivery',
      supportSLA: 'Standard Care Concierge (15 min response time)',
      homePhlebotomy: false,
      familyMembersIncluded: 1,
      annualConsultationsQuota: 4,
    },
  },
  {
    id: 'plan_comprehensive',
    name: 'CarePlus Comprehensive',
    pricePerYear: 1180,
    highlight: 'Our most selected tier: In-home nurse visits, priority 6-minute emergency dispatch, and rapid 45-minute medication courier.',
    popular: true,
    badge: 'Most Popular',
    features: {
      scheduledChecks: '2 Full-Spectrum Annual Checks (Full Blood Panel + ECG + Biomarkers)',
      emergencyAmbulance: 'Priority Advanced Life Support (ALS) Ambulance with live hospital telemetry',
      teleDiagnostics: '8 Annual MD Specialist & In-Home Physician Consultations + Medical Shuttle Transport',
      drugDelivery: 'Express 45-Minute Emergency & Chronic Cold-Chain Courier delivery',
      supportSLA: 'Dedicated Registered Nurse Concierge (< 2 min response SLA)',
      homePhlebotomy: true,
      familyMembersIncluded: 1,
      annualConsultationsQuota: 8,
    },
  },
  {
    id: 'plan_executive',
    name: 'Executive Premier Family',
    pricePerYear: 2450,
    highlight: 'Maximum peace-of-mind for families: 4 annual checks, mobile ICU ambulance, and dedicated personal physician team.',
    features: {
      scheduledChecks: '4 Annual In-Home Health Audits + Advanced Cardiac, Genetic & Cancer Screenings',
      emergencyAmbulance: 'Critical Mobile ICU & Air Evacuation priority dispatch',
      teleDiagnostics: '16 Private Physician Visits, On-Demand Telehealth & VIP Medical Shuttle Service',
      drugDelivery: 'Ultra-Fast White-Glove Prescription courier with automated refill sync',
      supportSLA: 'Immediate 24/7 Priority Emergency Triage Desk (Instant response)',
      homePhlebotomy: true,
      familyMembersIncluded: 4,
      annualConsultationsQuota: 16,
    },
  },
];

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  availableDays: string[];
  supportsHomeVisit: boolean;
  supportsClinicVisit: boolean;
  supportsVideo: boolean;
  avatarUrl: string;
}

export const AVAILABLE_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc_jenkins',
    name: 'Dr. Sarah Jenkins, MD',
    specialty: 'Internal Medicine & Preventive Cardiology',
    hospital: 'Mount Sinai Health Network Affiliate',
    rating: 4.9,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    supportsHomeVisit: true,
    supportsClinicVisit: true,
    supportsVideo: true,
    avatarUrl: '/src/assets/images/tele_diagnostics_doctor_1792753773036.jpg',
  },
  {
    id: 'doc_cole',
    name: 'Dr. Ethan Cole, MD',
    specialty: 'Emergency Medicine & Acute Care Diagnostics',
    hospital: 'NYU Langone Medical Center',
    rating: 4.95,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    supportsHomeVisit: true,
    supportsClinicVisit: false,
    supportsVideo: true,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'doc_rostova',
    name: 'Dr. Elena Rostova, MD',
    specialty: 'Family Medicine & Comprehensive Health Audit',
    hospital: 'Columbia University Irving Medical Pavilion',
    rating: 4.88,
    availableDays: ['Tue', 'Wed', 'Thu', 'Sat'],
    supportsHomeVisit: false,
    supportsClinicVisit: true,
    supportsVideo: true,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813590-781e8eb06141?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'doc_rivera',
    name: 'Dr. Marcus Rivera, MD',
    specialty: 'Metabolic & Geriatric Health Specialist',
    hospital: 'Lenox Hill Hospital Cardiology Group',
    rating: 4.92,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    supportsHomeVisit: true,
    supportsClinicVisit: true,
    supportsVideo: true,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=240&q=80',
  },
];

export const INITIAL_USER: UserMembership = {
  memberId: 'AEG-8492-NY',
  memberName: 'David Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  planId: 'plan_comprehensive',
  planName: 'CarePlus Comprehensive',
  annualFee: 1180,
  renewalDate: 'November 18, 2027',
  joinedDate: 'November 18, 2024',
  status: 'active',
  bloodType: 'O Rh-Positive',
  allergies: ['Amoxicillin / Penicillin', 'Sulfa drugs'],
  chronicConditions: ['Mild Essential Hypertension', 'Occasional Seasonal Bronchospasm'],
  emergencyContact: {
    name: 'Rachel Chen',
    relation: 'Spouse',
    phone: '+1 (555) 234-8901',
  },
  address: '742 Evergreen Terrace, Apt 4B, New York, NY 10024',
  checkupsRemaining: 1,
  checkupsTotal: 2,
  consultationsRemaining: 3,
  consultationsTotal: 8,
  ambulanceRidesRemaining: 'Unlimited (100% Insured)',
  teleConsultsRemaining: '3 of 8 available this year',
  rxDeliveryCredits: 450,
};

export const INITIAL_BOOKED_CONSULTATIONS: import('../types').BookedConsultation[] = [
  {
    id: 'cst_8021',
    doctorName: 'Dr. Sarah Jenkins, MD',
    doctorSpecialty: 'Internal Medicine & Preventive Cardiology',
    doctorHospital: 'Mount Sinai Health Network Affiliate',
    doctorAvatar: '/src/assets/images/tele_diagnostics_doctor_1792753773036.jpg',
    mode: 'clinic_with_shuttle_pickup',
    scheduledDate: 'Fri, Oct 24, 2026',
    scheduledTime: '10:30 AM - 11:15 AM',
    status: 'confirmed',
    venueName: 'Mount Sinai Heart & Diagnostic Pavilion (Suite 320)',
    venueAddress: '1190 5th Ave, New York, NY 10029',
    patientAddress: '742 Evergreen Terrace, Apt 4B, New York, NY 10024',
    reasonForVisit: 'Cardiovascular Risk Review & Annual Biomarker Discussion',
    pickupRequired: true,
    pickupDetails: {
      pickupTime: '09:45 AM',
      driverName: 'Robert Vance (Medical Transport Specialist)',
      vehicleType: '❤️ Home Health Executive Health Shuttle #08',
      vehiclePlate: 'MED-7491-NY',
      pickupStatus: 'scheduled',
      routeDistance: '3.8 miles',
      routeEstDuration: '22 mins',
    },
    scheduleMap: {
      departurePoint: '742 Evergreen Terrace (Patient Residence)',
      destinationPoint: 'Mount Sinai Diagnostic Pavilion, 1190 5th Ave',
      coordinatesSummary: 'Lat 40.7829° N, Long 73.9654° W -> Lat 40.7903° N, Long 73.9525° W',
      milestones: [
        {
          time: '09:40 AM',
          label: 'Shuttle Arrival & Patient Boarding',
          description: '❤️ Home Health Shuttle #08 arrives at 742 Evergreen Terrace with medical escort.',
          status: 'upcoming',
        },
        {
          time: '09:45 AM - 10:10 AM',
          label: 'Dedicated Medical Transit Route',
          description: 'Scenic crosstown transit via 79th St Transverse with onboard Wi-Fi and blood pressure cuff.',
          status: 'upcoming',
        },
        {
          time: '10:15 AM',
          label: 'Clinic Fast-Track VIP Check-in',
          description: 'Direct escalator transfer to Suite 320 without lobby waiting room delays.',
          status: 'upcoming',
        },
        {
          time: '10:30 AM - 11:15 AM',
          label: 'Doctor Consultation & ECG Review',
          description: 'One-on-one session with Dr. Sarah Jenkins, MD, including cardiac rhythm check.',
          status: 'upcoming',
        },
        {
          time: '11:25 AM',
          label: 'Return Transport Departure',
          description: 'Complimentary return shuttle drops patient back at residential address.',
          status: 'upcoming',
        },
      ],
    },
    notes: 'Please bring your current prescription bottles. Medical shuttle driver will assist with building lobby entry.',
  },
];

export const INITIAL_CHECKS: ScheduledCheck[] = [
  {
    id: 'chk_2026_01',
    title: 'Mid-Year Comprehensive Cardiovascular & Lipid Audit',
    category: 'Cardiovascular & ECG',
    venue: 'Home Phlebotomy Visit',
    scheduledDate: 'Tomorrow, Oct 24, 2026',
    scheduledTime: '08:30 AM - 09:15 AM',
    status: 'confirmed',
    address: '742 Evergreen Terrace, Apt 4B, New York, NY',
    nurseAssigned: 'Nurse Sarah Lindqvist, RN (Mobile Care Unit 12)',
    fastingRequired: true,
    fastingHours: 10,
    preparationNotes: [
      'Fast for 10 hours prior to appointment (water is permitted and encouraged).',
      'Wear loose clothing with easily rollable sleeves for ECG and blood pressure baseline.',
      'Have current morning prescriptions placed on counter for medication reconciliation.',
    ],
  },
  {
    id: 'chk_2026_02',
    title: 'Annual Executive Biochemical & Metabolic Panel',
    category: 'Biochemical Baseline',
    venue: 'Metropolitan Diagnostic Lab Center',
    scheduledDate: 'May 14, 2026',
    scheduledTime: '09:00 AM',
    status: 'completed',
    address: 'Metropolitan Advanced Health Diagnostic Pavilion, Suite 400',
    fastingRequired: true,
    fastingHours: 12,
    preparationNotes: ['12-hour overnight fast completed.'],
    labReport: {
      completedOn: 'May 15, 2026',
      reviewedBy: 'Dr. Michael Vance, MD (Chief Pathologist)',
      summary: 'Overall clinical profile demonstrates robust cardiovascular baseline. Metabolic markers are in target range with slight elevation in fasting glucose managed by current dietary regimen.',
      biomarkers: [
        { name: 'Total Cholesterol', value: '182 mg/dL', range: '< 200 mg/dL', status: 'optimal' },
        { name: 'LDL Cholesterol', value: '98 mg/dL', range: '< 100 mg/dL', status: 'optimal' },
        { name: 'HDL Cholesterol', value: '54 mg/dL', range: '> 40 mg/dL', status: 'optimal' },
        { name: 'Fasting Blood Glucose', value: '96 mg/dL', range: '70 - 99 mg/dL', status: 'optimal' },
        { name: 'HbA1c Glycated Hemoglobin', value: '5.5 %', range: '< 5.7 %', status: 'optimal' },
        { name: 'High-Sensitivity CRP (Inflammation)', value: '0.8 mg/L', range: '< 1.0 mg/L', status: 'optimal' },
        { name: 'Estimated GFR (Kidney Function)', value: '104 mL/min', range: '> 90 mL/min', status: 'optimal' },
        { name: 'Serum 25-OH Vitamin D', value: '31 ng/mL', range: '30 - 100 ng/mL', status: 'borderline' },
      ],
    },
  },
];

export const INITIAL_MEDICATIONS: MedicationOrder[] = [
  {
    id: 'rx_9021',
    medicationName: 'Atorvastatin Calcium',
    dosage: '20 mg · Oral Tablet',
    instructions: 'Take 1 tablet daily at bedtime with water.',
    category: 'Chronic Maintenance',
    status: 'delivered',
    prescribedBy: 'Dr. Sarah Jenkins, MD',
    orderDate: 'Oct 12, 2026',
    etaMinutes: 0,
    courierName: 'Mark R. (Eco-Courier)',
    temperatureCelsius: 18.5,
    daysSupply: 90,
    refillsRemaining: 3,
  },
  {
    id: 'rx_9044',
    medicationName: 'Albuterol Sulfate Inhaler',
    dosage: '90 mcg/actuation · 200 Inhalations',
    instructions: '1 to 2 puffs every 4-6 hours as needed for bronchospasm relief.',
    category: 'Emergency Fast-Track',
    status: 'out_for_delivery',
    prescribedBy: 'Dr. Sarah Jenkins, MD',
    orderDate: 'Today, 03:40 PM',
    etaMinutes: 18,
    courierName: 'David K. (Rapid Courier #44)',
    temperatureCelsius: 19.2,
    daysSupply: 30,
    refillsRemaining: 2,
  },
  {
    id: 'rx_9052',
    medicationName: 'Coenzyme Q10 + Omega-3 CardioPack',
    dosage: '200 mg / 1000 mg softgel',
    instructions: '1 softgel daily with breakfast meal.',
    category: 'Chronic Maintenance',
    status: 'packed',
    prescribedBy: 'CarePlus Wellness Team',
    orderDate: 'Today, 02:15 PM',
    etaMinutes: 45,
    courierName: 'Courier Logistics Dispatch',
    temperatureCelsius: 4.8,
    daysSupply: 60,
    refillsRemaining: 4,
  },
];

export const INITIAL_TELE_SESSION: TeleConsultSession = {
  id: 'tc_771',
  doctorName: 'Dr. Sarah Jenkins, MD',
  doctorSpecialty: 'Internal Medicine & Preventive Cardiology',
  doctorHospital: 'Mount Sinai Health Network Affiliate',
  scheduledTime: 'Immediate On-Demand (CarePlus Instant Triage)',
  status: 'scheduled',
  patientVitals: {
    heartRate: 72,
    bloodPressure: '120/78 mmHg',
    spO2: 99,
    bodyTemp: 98.4,
  },
  clinicalImpression: 'Patient requesting pre-checkup medication review and recent exercise tolerance assessment.',
};

export const INITIAL_SUPPORT_MESSAGES: SupportChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'concierge',
    senderName: 'Nurse Elena Vance, RN',
    timestamp: '10:15 AM',
    text: 'Good morning, David! This is your Heart Home Health registered nurse concierge. Your in-home cardiovascular and phlebotomy check is confirmed for tomorrow morning between 8:30 AM and 9:15 AM.',
  },
  {
    id: 'msg_2',
    sender: 'user',
    senderName: 'David Chen',
    timestamp: '10:18 AM',
    text: 'Thank you Elena. Quick question: can I have black coffee before the blood draw tomorrow or strictly water?',
  },
  {
    id: 'msg_3',
    sender: 'concierge',
    senderName: 'Nurse Elena Vance, RN',
    timestamp: '10:19 AM',
    text: 'Great question! For tomorrow’s lipid and fasting glucose panel, please stick to pure water only. Caffeine can transiently affect arterial tone and metabolic enzymes. After the draw, Nurse Sarah will have an electrolyte boost beverage ready for you!',
    actionTag: {
      label: 'View Checkup Details & Prep',
      tab: 'checks',
    },
  },
];
