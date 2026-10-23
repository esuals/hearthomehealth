export type ActiveTab = 'overview' | 'checks' | 'emergency' | 'telediag' | 'pharmacy' | 'support' | 'plans';

export interface SubscriptionPlan {
  id: string;
  name: string;
  pricePerYear: number;
  highlight: string;
  badge?: string;
  popular?: boolean;
  features: {
    scheduledChecks: string;
    emergencyAmbulance: string;
    teleDiagnostics: string;
    drugDelivery: string;
    supportSLA: string;
    homePhlebotomy: boolean;
    familyMembersIncluded: number;
    annualConsultationsQuota: number;
  };
}

export type ConsultationMode = 'video_telehealth' | 'in_home_physician' | 'clinic_with_shuttle_pickup';

export interface BookedConsultation {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorHospital: string;
  doctorAvatar?: string;
  mode: ConsultationMode;
  scheduledDate: string;
  scheduledTime: string;
  status: 'confirmed' | 'in_transit' | 'in_session' | 'completed';
  venueName: string;
  venueAddress: string;
  patientAddress: string;
  reasonForVisit: string;
  pickupRequired: boolean;
  pickupDetails?: {
    pickupTime: string;
    driverName: string;
    vehicleType: string;
    vehiclePlate: string;
    pickupStatus: 'scheduled' | 'dispatched' | 'arriving' | 'picked_up';
    routeDistance: string;
    routeEstDuration: string;
  };
  scheduleMap: {
    departurePoint: string;
    destinationPoint: string;
    routePolyline?: string;
    milestones: {
      time: string;
      label: string;
      description: string;
      status: 'upcoming' | 'current' | 'done';
    }[];
    coordinatesSummary: string;
  };
  notes?: string;
}

export interface UserMembership {
  memberId: string;
  memberName: string;
  avatarUrl: string;
  planId: string;
  planName: string;
  annualFee: number;
  renewalDate: string;
  joinedDate: string;
  status: 'active' | 'renewal_pending';
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  address: string;
  checkupsRemaining: number;
  checkupsTotal: number;
  consultationsRemaining: number;
  consultationsTotal: number;
  ambulanceRidesRemaining: string;
  teleConsultsRemaining: string;
  rxDeliveryCredits: number;
}

export interface ScheduledCheck {
  id: string;
  title: string;
  category: 'Biochemical Baseline' | 'Cardiovascular & ECG' | 'Metabolic & Hormonal' | 'Executive Comprehensive';
  venue: 'Home Phlebotomy Visit' | 'Metropolitan Diagnostic Lab Center';
  scheduledDate: string;
  scheduledTime: string;
  status: 'confirmed' | 'sample_collected' | 'analyzing' | 'completed';
  address: string;
  nurseAssigned?: string;
  fastingRequired: boolean;
  fastingHours?: number;
  preparationNotes: string[];
  labReport?: {
    completedOn: string;
    reviewedBy: string;
    summary: string;
    biomarkers: {
      name: string;
      value: string;
      range: string;
      status: 'optimal' | 'borderline' | 'attention';
    }[];
  };
}

export interface AmbulanceDispatchState {
  isActive: boolean;
  status: 'standby' | 'verifying' | 'dispatched' | 'en_route' | 'on_scene' | 'transporting';
  unitName: string;
  unitType: string;
  paramedicTeam: string[];
  etaMinutes: number;
  initialEtaMinutes: number;
  destinationHospital: string;
  patientAddress: string;
  dispatchTimestamp?: string;
  sirenAudioActive: boolean;
  dispatchCallActive: boolean;
}

export interface MedicationOrder {
  id: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  category: 'Chronic Maintenance' | 'Post-Consult Acute' | 'Emergency Fast-Track';
  status: 'verifying' | 'packed' | 'out_for_delivery' | 'delivered';
  prescribedBy: string;
  orderDate: string;
  etaMinutes: number;
  courierName: string;
  temperatureCelsius: number;
  daysSupply: number;
  refillsRemaining: number;
}

export interface TeleConsultSession {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorHospital: string;
  scheduledTime: string;
  status: 'scheduled' | 'connecting' | 'in_call' | 'concluded';
  patientVitals: {
    heartRate: number;
    bloodPressure: string;
    spO2: number;
    bodyTemp: number;
  };
  clinicalImpression?: string;
}

export interface SupportChatMessage {
  id: string;
  sender: 'user' | 'concierge' | 'system';
  senderName: string;
  timestamp: string;
  text: string;
  actionTag?: {
    label: string;
    tab: ActiveTab;
  };
}
