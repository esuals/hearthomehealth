export type ActiveTab = 'overview' | 'checks' | 'emergency' | 'telediag' | 'pharmacy' | 'support' | 'plans' | 'facilities' | 'terms';

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameLocal?: string; // e.g. Nlekọta Basic, Ezinụlọ Premier, Udo Complete
  pricePerYearNaira: number;
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
    emergencyDispatchQuota: number;
    scheduledChecksQuota: number;
    rxDeliveryQuota: number;
  };
}

export type ConsultationMode = 'video_telehealth' | 'in_home_physician' | 'clinic_with_shuttle_pickup';

export interface BookedConsultation {
  id: string;
  userId?: string;
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
  uid?: string;
  memberName: string;
  email?: string;
  phoneNumber?: string;
  state?: string;
  lga?: string;
  community?: string;
  preferredLanguage?: 'English' | 'Yoruba' | 'Hausa' | 'Igbo' | 'Pidgin';
  avatarUrl: string;
  planId: string;
  planName: string;
  annualFeeNaira: number;
  renewalDate: string;
  joinedDate: string;
  status: 'active' | 'renewal_pending' | 'unpaid';
  paymentMethod?: 'ussd' | 'bank_transfer' | 'pos_agent' | 'card';
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
  emergencyRidesRemaining: number;
  emergencyRidesTotal: number;
  ambulanceRidesRemaining: string;
  teleConsultsRemaining: string;
  rxDeliveryCredits: number;
  rxDeliveriesRemaining: number;
  rxDeliveriesTotal: number;
}

export interface ScheduledCheck {
  id: string;
  title: string;
  category: 'Biochemical Baseline' | 'Cardiovascular & ECG' | 'Metabolic & Hormonal' | 'Executive Comprehensive';
  venue: 'Home Phlebotomy Visit' | 'Metropolitan Diagnostic Lab Center' | 'Community Primary Health Post';
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

export interface NigerianPaymentRecord {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amountNaira: number;
  method: 'ussd' | 'bank_transfer' | 'pos_agent' | 'card';
  reference: string;
  status: 'successful' | 'pending' | 'failed';
  bankName?: string;
  ussdCode?: string;
  virtualAccount?: string;
  agentVoucherCode?: string;
  createdAt: string;
}

export interface GroundedFacility {
  name: string;
  type: string;
  location: string;
  mapsUrl: string;
  emergencyCapable?: boolean;
  phone?: string;
  snippet?: string;
}
