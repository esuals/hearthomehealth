import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  FileText, 
  Lock, 
  Ambulance, 
  Heart, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Printer, 
  ExternalLink,
  ChevronRight,
  Info,
  Search,
  Building2,
  CalendarCheck,
  Stethoscope,
  Pill,
  Download
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { UserMembership } from '../types';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserMembership;
  onAcceptTerms?: () => void;
  isStandaloneTab?: boolean;
}

type TermSectionId = 'overview' | 'pilot_scope' | 'emergency_rules' | 'telehealth' | 'subscriptions' | 'privacy_ndpa' | 'disputes';

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  user,
  onAcceptTerms,
  isStandaloneTab = false,
}) => {
  const [activeSection, setActiveSection] = useState<TermSectionId>('overview');
  const [hasAccepted, setHasAccepted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen && !isStandaloneTab) return null;

  const handlePrint = () => {
    soundFx.playChime('tick');
    window.print();
  };

  const handleAccept = () => {
    soundFx.playChime('success');
    setHasAccepted(true);
    if (onAcceptTerms) {
      onAcceptTerms();
    }
  };

  const sections: { id: TermSectionId; title: string; icon: React.ReactNode; badge: string }[] = [
    {
      id: 'overview',
      title: 'Preamble & Rights of Use',
      icon: <FileText className="w-4 h-4 text-rose-600" />,
      badge: 'Binding Contract',
    },
    {
      id: 'pilot_scope',
      title: 'Imo State Pilot Boundaries',
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
      badge: '27 LGAs Only',
    },
    {
      id: 'emergency_rules',
      title: 'Emergency Dispatch & Triage',
      icon: <Ambulance className="w-4 h-4 text-red-600" />,
      badge: '4x4 / Keke Protocol',
    },
    {
      id: 'telehealth',
      title: 'Tele-Diagnostics & In-Home CHEWs',
      icon: <Stethoscope className="w-4 h-4 text-indigo-600" />,
      badge: 'MDCN & NMCN',
    },
    {
      id: 'subscriptions',
      title: 'Pricing, Tiers & Quotas',
      icon: <Scale className="w-4 h-4 text-amber-600" />,
      badge: '₦120k - ₦480k',
    },
    {
      id: 'privacy_ndpa',
      title: 'Privacy & NDPA 2023 Compliance',
      icon: <Lock className="w-4 h-4 text-teal-600" />,
      badge: 'Health Data Encrypted',
    },
    {
      id: 'disputes',
      title: 'Governing Law & Disputes',
      icon: <ShieldCheck className="w-4 h-4 text-slate-600" />,
      badge: 'Nigeria & Imo Laws',
    },
  ];

  return (
    <div className={isStandaloneTab ? 'space-y-6 max-w-5xl mx-auto py-2' : 'fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5'}>
      <div className={`bg-white w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${isStandaloneTab ? '' : 'max-w-4xl max-h-[90vh]'}`}>
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  ❤️ Home Health · Legal & Clinical Governance
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded">
                  NDPA 2023 Compliant
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                  Phase 1 Pilot Trial
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Rights of Use, Medical Disclaimer & Terms of Service
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              title="Print or Export Terms"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Terms</span>
            </button>
            {!isStandaloneTab && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Regulatory Notice Banner */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Publication Effective Date:</strong> October 2026 · Version 2.4 (Pilot Edition) · Enforceable in Imo State & Federal Republic of Nigeria.
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Regulated under the <strong>National Health Act 2014</strong> & <strong>Nigeria Data Protection Act 2023</strong>
          </div>
        </div>

        {/* Search Bar & Mobile Navigation */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses (e.g., refund, ambulance, NDPA)..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar pb-1 sm:pb-0">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  soundFx.playChime('tick');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {sec.icon}
                <span>{sec.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed max-h-[60vh]">
          
          {/* Section 1: Overview & Preamble */}
          {activeSection === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>1. Preamble & Subscriber Rights of Use Agreement</span>
                </h3>
                <p>
                  These Rights of Use and Terms and Conditions ("Agreement") constitute a legally binding contract between you (the "Subscriber", "Patient", or "Diaspora/Family Sponsor") and <strong>❤️ Home Health Nigeria Limited</strong> ("Company", "We", "Our", or "Service"), in collaboration with accredited Nigerian healthcare facilities and emergency ambulance networks.
                </p>
                <p className="font-semibold text-rose-900">
                  By downloading, registering, subscribing, accessing, or utilizing any feature of the ❤️ Home Health platform (including our Emergency SOS, scheduled checkups, tele-diagnostics, prescription deliveries, and hospital referrals), you unconditionally acknowledge and agree to be bound by all provisions herein.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  1.1 Legal Capacity & Authorization
                </h4>
                <p>
                  You represent and warrant that you are at least 18 years of age and possess the legal authority to enter into this Agreement under Nigerian law. If you are registering or sponsoring a subscription on behalf of an elderly parent, dependent, spouse, or minor family member residing in rural Imo State, you affirm that you have obtained their full informed consent (or hold lawful medical proxy) to submit their medical history, blood type, and emergency contact information.
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  1.2 App Publishing & Software License
                </h4>
                <p>
                  The Company grants you a revocable, non-exclusive, non-transferable, limited right and license to install and use the ❤️ Home Health software application strictly for personal, non-commercial healthcare management and family emergency response. You agree not to decompile, reverse-engineer, mirror, or automate unauthorized queries against our Google Maps grounding API, Firestore databases, or emergency dispatch switches.
                </p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Key Subscriber Rights:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>The right to dignified, non-discriminatory healthcare in your preferred dialect (Igbo, Pidgin, or English).</li>
                    <li>The right to inspect and download your electronic health checkup results and lab biomarkers at zero additional cost.</li>
                    <li>The right to transparent emergency dispatch telemetry with live GPS tracking of responding vehicles.</li>
                    <li>The right to withdraw from the Phase 1 Clinical Trial at any time without forfeiture of medical records.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Imo State Pilot Scope */}
          {activeSection === 'pilot_scope' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>2. Phase 1 Clinical Pilot Geographic Boundaries & Scope</span>
                </h3>
                <p>
                  <strong>Notice of Geographic Restriction:</strong> Operations during Phase 1 are strictly confined to the territorial boundaries of <strong>Imo State, Nigeria</strong> across its 27 designated Local Government Areas (LGAs).
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  2.1 The 27 Eligible LGAs in Imo State
                </h4>
                <p>
                  Active in-home nurse visits, emergency 4x4 ambulance dispatch, and cold-chain motorcycle delivery are guaranteed exclusively for addresses situated in:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono">
                  <span>• Aboh Mbaise</span>
                  <span>• Ahiazu Mbaise</span>
                  <span>• Ehime Mbano</span>
                  <span>• Ezinihitte Mbaise</span>
                  <span>• Ideato North</span>
                  <span>• Ideato South</span>
                  <span>• Ihitte/Uboma</span>
                  <span>• Ikeduru</span>
                  <span>• Isiala Mbano</span>
                  <span>• Isu</span>
                  <span>• Mbaitoli</span>
                  <span>• Ngor Okpala</span>
                  <span>• Njaba</span>
                  <span>• Nkwerre</span>
                  <span>• Nwangele</span>
                  <span>• Obowo</span>
                  <span>• Oguta</span>
                  <span>• Ohaji/Egbema</span>
                  <span>• Okigwe</span>
                  <span>• Onuimo</span>
                  <span>• Orlu</span>
                  <span>• Orsu</span>
                  <span>• Oru East</span>
                  <span>• Oru West</span>
                  <span>• Owerri Municipal</span>
                  <span>• Owerri North</span>
                  <span>• Owerri West</span>
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  2.2 Clinical Partner Referral Anchors
                </h4>
                <p>
                  Emergency hospital admissions and secondary/tertiary surgical referrals are coordinated primarily with:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Federal Medical Centre (FMC) Owerri</strong> — Orlu Road, Owerri (Tertiary Trauma and Intensive Care Anchor).</li>
                  <li><strong>Imo State University Teaching Hospital (IMSUTH) Orlu</strong> — Umuna, Orlu (Teaching Hospital & Regional Trauma Center).</li>
                  <li><strong>General Hospital Aboh Mbaise & 27 LGA Primary Health Centres</strong> — Secondary triage, maternal ward, and acute stabilization.</li>
                </ul>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  2.3 Other Nigerian States (Phase 2 Waitlist)
                </h4>
                <p>
                  Residents of Lagos, Abuja, Anambra, Enugu, Rivers, Delta, Oyo, and other states who register will be held on the Phase 2 clinical rollout waitlist. No emergency response guarantees or in-home visits can be dispatched outside Imo State until Phase 2 regulatory clearance is gazetted.
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Emergency Dispatch & Triage */}
          {activeSection === 'emergency_rules' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-950 space-y-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Ambulance className="w-4 h-4 text-red-600" />
                  <span>3. Emergency Ambulance Dispatch & Medical Triage Protocols</span>
                </h3>
                <p>
                  Emergency SOS alerts trigger immediate rapid-response mobilization of advanced 4x4 Land Cruiser rural medical units and dedicated medical tricycles (keke) equipped with oxygen, AED defibrillators, and basic trauma resuscitation supplies.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  3.1 Dispatch Quotas & Zero Out-Of-Pocket Copay
                </h4>
                <p>
                  Each subscription tier includes a specific quota of 100% insured emergency dispatches per membership year:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Tier 1 (Rural Community Essential):</strong> 2 Emergency Dispatches included at ₦0 copay.</li>
                  <li><strong>Tier 2 (Family Community Shield):</strong> 3 Priority Emergency Dispatches included at ₦0 copay.</li>
                  <li><strong>Tier 3 (Rural Cooperative & Diaspora):</strong> 4 Critical Mobile ICU Emergency Dispatches included at ₦0 copay.</li>
                </ul>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  3.2 Response Times & Force Majeure Disclaimers
                </h4>
                <p>
                  While our decentralized deployment of Community Health Extension Workers (CHEWs) aims for an arrival window of under 15 minutes, response times in remote agrarian corridors are subject to rural road navigability, seasonal heavy flooding, bridge disruptions, or civil curfews. The Company shall not be held liable for transit delays caused by unforeseeable infrastructural impediments beyond our direct operational control.
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  3.3 False Alarms & Abuse of SOS Channels
                </h4>
                <p>
                  A 5-second countdown window is provided to cancel accidental SOS triggers. Deliberate, frivolous, or malicious activation of emergency ambulance dispatches diverts critical life-saving assets from true trauma victims and constitutes grounds for immediate subscription revocation and referral to civil authorities.
                </p>
              </div>
            </div>
          )}

          {/* Section 4: Tele-Diagnostics & In-Home Nursing */}
          {activeSection === 'telehealth' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-indigo-600" />
                  <span>4. Tele-Diagnostics, In-Home Visits & Clinician Qualifications</span>
                </h3>
                <p>
                  All clinical consultations, in-home diagnostic sample collections, and health screenings are executed strictly by certified Nigerian healthcare professionals licensed by recognized statutory bodies.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  4.1 Professional Licensing Standards
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Medical Officers & Specialists:</strong> Fully registered with the <strong>Medical and Dental Council of Nigeria (MDCN)</strong> with verified practicing licenses.</li>
                  <li><strong>Registered Nurses (RN):</strong> Certified by the <strong>Nursing and Midwifery Council of Nigeria (NMCN)</strong>.</li>
                  <li><strong>Community Health Extension Workers (CHEWs):</strong> Certified by the <strong>Community Health Practitioners Registration Board of Nigeria (CHPRBN)</strong>.</li>
                  <li><strong>Pharmacies & Pharmacists:</strong> Licensed by the <strong>Pharmacy Council of Nigeria (PCN)</strong>.</li>
                </ul>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  4.2 Telemedicine Informed Consent & Limitations
                </h4>
                <p>
                  Tele-diagnostics conducted via encrypted video or dialect voice calls provide valuable clinical assessment, chronic disease monitoring, triage, and prescription authoring. However, telemedicine does not replace physical examination in complex surgical, obstetrical, or catastrophic trauma scenarios. Where a physician determines that in-person hospitalization is mandatory, the subscriber will be transferred via our clinic shuttle or emergency ambulance.
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  4.3 In-Home Phlebotomy & Biological Specimen Consent
                </h4>
                <p>
                  Subscribers consent to certified nurses and CHEWs conducting sterile capillary or venous blood draws, rapid malaria antigen tests (RDT), fasting blood glucose finger-pricks, and urinalysis in the comfort of their homes. All sharps and biological specimens are sealed and transported in bio-hazard containers following standard epidemiology guidelines.
                </p>
              </div>
            </div>
          )}

          {/* Section 5: Subscriptions, Tiers & Financial Rails */}
          {activeSection === 'subscriptions' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-700" />
                  <span>5. Subscription Plans, Quotas & Financial Rails</span>
                </h3>
                <p>
                  Subscribers choose an annual plan payable in Nigerian Naira (₦). Pricing, benefit quotas, and payment rails are strictly defined below.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  5.1 Official 2026/2027 Tier Pricing & Quota Table
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                        <th className="p-2.5 font-bold">Plan Tier</th>
                        <th className="p-2.5 font-bold">Annual Fee</th>
                        <th className="p-2.5 font-bold">Ambulance</th>
                        <th className="p-2.5 font-bold">Checks</th>
                        <th className="p-2.5 font-bold">Tele-Diag</th>
                        <th className="p-2.5 font-bold">Rx Deliveries</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-900">Rural Community Essential</td>
                        <td className="p-2.5 font-mono text-emerald-700 font-bold">₦120,000 / yr</td>
                        <td className="p-2.5">2 Dispatches</td>
                        <td className="p-2.5">2 Tests</td>
                        <td className="p-2.5">2 Consults</td>
                        <td className="p-2.5">2 Doorstep Rx</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="p-2.5 font-semibold text-slate-900">Family Community Shield</td>
                        <td className="p-2.5 font-mono text-emerald-700 font-bold">₦360,000 / yr</td>
                        <td className="p-2.5 font-bold text-red-600">3 Priority Dispatches</td>
                        <td className="p-2.5">6 Tests</td>
                        <td className="p-2.5">6 Consults</td>
                        <td className="p-2.5">6 Doorstep Rx</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-900">Rural Cooperative & Diaspora</td>
                        <td className="p-2.5 font-mono text-emerald-700 font-bold">₦480,000 / yr</td>
                        <td className="p-2.5 font-bold text-red-600">4 Mobile ICU Dispatches</td>
                        <td className="p-2.5">8 Tests</td>
                        <td className="p-2.5">8 Consults</td>
                        <td className="p-2.5">8 Doorstep Rx</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  5.2 Nigerian Payment Ecosystem Integration
                </h4>
                <p>
                  To accommodate rural financial realities, fees may be settled through:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>USSD Banking Codes:</strong> Direct offline dial strings (*737#, *966#, *901#, *894#, etc.) secured by customer bank PIN.</li>
                  <li><strong>NIP Instant Bank Transfer:</strong> Real-time settlement via dedicated virtual accounts issued by CBN-licensed financial institutions (Wema Bank / Moniepoint MFB).</li>
                  <li><strong>Village POS Agent Cash Vouchers:</strong> Over-the-counter settlement at registered rural Moniepoint or OPay agent kiosks using unique subscriber voucher IDs.</li>
                  <li><strong>Debit Cards:</strong> Instant online checkout via Verve, Mastercard, or Visa cards with 3D-Secure 2FA authentication.</li>
                </ul>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  5.3 Quota Rollover & Refund Policy
                </h4>
                <p>
                  Annual quotas for scheduled diagnostic checkups and consultations are valid for 12 calendar months from activation. Because healthcare assets, staffing, and ambulance standby guarantees are committed in advance, annual subscriptions are non-refundable once an ambulance dispatch, in-home nurse visit, or diagnostic laboratory panel has been conducted.
                </p>
              </div>
            </div>
          )}

          {/* Section 6: Privacy & NDPA 2023 */}
          {activeSection === 'privacy_ndpa' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 space-y-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-700" />
                  <span>6. Data Privacy, Confidentiality & Nigeria Data Protection Act (NDPA) 2023</span>
                </h3>
                <p>
                  Your privacy is paramount. ❤️ Home Health is registered and fully compliant with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> overseen by the Nigeria Data Protection Commission (NDPC).
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  6.1 Sensitive Personal Health Information (PHI)
                </h4>
                <p>
                  We collect strictly necessary medical demographics: blood group, known drug allergies (e.g., Penicillin/Ampiclox), chronic conditions (Hypertension, Diabetes), next-of-kin contacts, and GPS dispatch coordinates.
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  6.2 Cloud Infrastructure & Encryption
                </h4>
                <p>
                  All patient records and clinical consultation notes are stored in secure Google Cloud Firebase Firestore databases with <strong>AES-256 bit encryption at rest and TLS 1.3 encryption in transit</strong>. Access is restricted strictly to attending clinical personnel. We never sell, lease, or monetize individual subscriber health data to third-party commercial advertisers.
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  6.3 Your Rights Under the NDPA 2023
                </h4>
                <p>As a data subject under Nigerian law, you possess:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>The Right to Rectification:</strong> To update your village address, phone number, or next of kin at any time.</li>
                  <li><strong>The Right to Access:</strong> To view, print, or export your complete clinical encounter records.</li>
                  <li><strong>The Right to Erasure ("Right to be Forgotten"):</strong> To request permanent deletion of your profile following subscription conclusion, subject only to statutory medical record retention obligations under the National Health Act.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Section 7: Governing Law & Disputes */}
          {activeSection === 'disputes' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 space-y-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Scale className="w-4 h-4 text-slate-700" />
                  <span>7. Governing Law, Limitation of Liability & Dispute Resolution</span>
                </h3>
                <p>
                  This Agreement is governed by and construed in accordance with the substantive laws of <strong>Imo State</strong> and the <strong>Federal Republic of Nigeria</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  7.1 Clinical Review & Mediation
                </h4>
                <p>
                  In the event of any question, dispute, or grievance concerning medical triage or service delivery, the subscriber agrees to first lodge a formal grievance with the <em>Chief Medical Director Clinical Grievance Desk</em> of ❤️ Home Health. The parties shall endeavor in good faith to resolve the dispute amicably within 21 business days.
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  7.2 Arbitration in Owerri, Imo State
                </h4>
                <p>
                  Any controversy not settled by mediation shall be referred to and finally resolved by arbitration administered under the Nigerian <strong>Arbitration and Mediation Act 2023</strong>. The seat and venue of arbitration shall be <strong>Owerri, Imo State</strong>, and the proceedings shall be conducted in the English language.
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  7.3 Clinical Trial Ethics & Publishing Compliance
                </h4>
                <p>
                  This digital health tool complies with all national standards required for application deployment on international app repositories and public health portals. Periodic non-identifiable, aggregate health trends may be reported to the Imo State Ministry of Health to aid rural healthcare policy planning.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions & Consent Checkbox */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              id="accept-terms-check"
              checked={hasAccepted}
              onChange={(e) => setHasAccepted(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
            />
            <label htmlFor="accept-terms-check" className="text-slate-800 font-medium cursor-pointer">
              I have read and consent to the <strong>Rights of Use, Medical Disclaimer & Terms</strong>.
            </label>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {!isStandaloneTab && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            )}

            <button
              type="button"
              disabled={!hasAccepted}
              onClick={() => {
                handleAccept();
                if (!isStandaloneTab) onClose();
              }}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Accept Terms</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
