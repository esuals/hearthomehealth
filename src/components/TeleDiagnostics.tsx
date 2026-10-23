import React, { useState, useEffect } from 'react';
import { 
  TeleConsultSession, 
  MedicationOrder, 
  ActiveTab, 
  BookedConsultation, 
  UserMembership 
} from '../types';
import { AVAILABLE_DOCTORS } from '../data/mockData';
import { ScheduleMap } from './ScheduleMap';
import { 
  Stethoscope, 
  Video, 
  Mic, 
  MicOff, 
  Camera, 
  PhoneOff, 
  Activity, 
  Heart, 
  Pill, 
  CheckCircle2, 
  ShieldCheck, 
  Volume2, 
  Calendar, 
  Car, 
  MapPin, 
  Plus, 
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Clock,
  UserCheck
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface TeleDiagnosticsProps {
  session: TeleConsultSession;
  onIssuePrescription: (order: MedicationOrder) => void;
  setActiveTab: (tab: ActiveTab) => void;
  consultations: BookedConsultation[];
  user: UserMembership;
  onOpenBookModal: () => void;
  onOpenPlans: () => void;
}

export const TeleDiagnostics: React.FC<TeleDiagnosticsProps> = ({
  session,
  onIssuePrescription,
  setActiveTab,
  consultations,
  user,
  onOpenBookModal,
  onOpenPlans,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule_maps' | 'tele_room' | 'doctors'>('schedule_maps');
  const [selectedConsultationId, setSelectedConsultationId] = useState<string>(
    consultations[0]?.id || ''
  );

  // Video Call State
  const [isInCall, setIsInCall] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [heartRate, setHeartRate] = useState(session.patientVitals.heartRate);
  const [isHeartSoundPlaying, setIsHeartSoundPlaying] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Preventive Cardiovascular Review');
  const [doctorPrescriptionIssued, setDoctorPrescriptionIssued] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedConsultation = consultations.find((c) => c.id === selectedConsultationId) || consultations[0];
  const hasQuotaRemaining = user.consultationsRemaining > 0;

  // Live heart rate subtle fluctuation simulation
  useEffect(() => {
    if (!isInCall) return;
    const interval = setInterval(() => {
      setHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(84, Math.max(68, prev + delta));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isInCall]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartCall = () => {
    soundFx.playChime('success');
    setIsInCall(true);
    setActiveSubTab('tele_room');
    triggerToast('Connected with Dr. Sarah Jenkins, MD (Secure HIPAA Encrypted Tele-Link)');
  };

  const handleEndCall = () => {
    soundFx.playChime('alert');
    setIsInCall(false);
    setIsHeartSoundPlaying(false);
  };

  const handleToggleHeartSound = () => {
    soundFx.playHeartbeat();
    setIsHeartSoundPlaying(true);
    setTimeout(() => setIsHeartSoundPlaying(false), 2000);
  };

  const handleSimulateDoctorPrescription = () => {
    const newRx: MedicationOrder = {
      id: `rx_${Math.floor(1000 + Math.random() * 9000)}`,
      medicationName: 'Azithromycin 250 mg',
      dosage: '6 Capsules · 5-Day Oral Z-Pack',
      instructions: 'Take 2 capsules day 1, then 1 capsule daily with food for 4 days.',
      category: 'Post-Consult Acute',
      status: 'verifying',
      prescribedBy: 'Dr. Sarah Jenkins, MD (Tele-Diagnostics)',
      orderDate: 'Today, Just Now',
      etaMinutes: 38,
      courierName: 'Priority Express Courier Dispatch',
      temperatureCelsius: 19.8,
      daysSupply: 5,
      refillsRemaining: 1,
    };

    soundFx.playChime('success');
    setDoctorPrescriptionIssued(true);
    onIssuePrescription(newRx);
    triggerToast('Digital Rx Issued & Transmitted to Express Pharmacy Courier!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Quota Meter & Book Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Yearly Membership Consultations
            </span>
            <span className="text-slate-300">·</span>
            <span className={`text-xs font-semibold ${hasQuotaRemaining ? 'text-slate-700' : 'text-amber-700 font-bold'}`}>
              {hasQuotaRemaining
                ? `${user.consultationsRemaining} of ${user.consultationsTotal} Consultations Remaining`
                : `Annual Allowance Elapsed (0 of ${user.consultationsTotal} Left)`}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Consultations, Schedule Maps & Tele-Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Book in-home physician visits, clinic sessions with patient medical shuttle pickup, or instant HD video consults. Every booking is covered under your yearly subscription quota.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenBookModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Consultation</span>
          </button>
        </div>
      </div>

      {/* Quota Progress Strip & Elapsed Notification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900">Annual Plan Allowance:</span>
            <span className="text-slate-600">
              {user.consultationsTotal - user.consultationsRemaining} used, {user.consultationsRemaining} remaining this billing year
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            Renews on {user.renewalDate}
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              user.consultationsRemaining > 2
                ? 'bg-blue-600'
                : user.consultationsRemaining > 0
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${(user.consultationsRemaining / user.consultationsTotal) * 100}%` }}
          />
        </div>

        {!hasQuotaRemaining && (
          <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Your annual consultation allowance has elapsed. You can purchase single add-on visits or upgrade to Executive Premier for 16 consultations.
              </span>
            </div>
            <button
              onClick={onOpenPlans}
              className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-xs whitespace-nowrap shrink-0 transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl max-w-md">
        <button
          onClick={() => setActiveSubTab('schedule_maps')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'schedule_maps'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Schedule Maps ({consultations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tele_room')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'tele_room'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-indigo-600" />
          <span>Live Video Room</span>
        </button>

        <button
          onClick={() => setActiveSubTab('doctors')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'doctors'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Physicians</span>
        </button>
      </div>

      {/* VIEW 1: SCHEDULE MAPS & APPOINTMENT TRACKING */}
      {activeSubTab === 'schedule_maps' && (
        <div className="space-y-6">
          {/* Appointment Selector Chips (if multiple booked) */}
          {consultations.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">Appointments:</span>
              {consultations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConsultationId(c.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    selectedConsultationId === c.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{c.scheduledDate} · {c.doctorName.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Schedule Map Display */}
          {selectedConsultation ? (
            <ScheduleMap
              consultation={selectedConsultation}
              onLaunchVirtualRoom={() => {
                setActiveSubTab('tele_room');
                handleStartCall();
              }}
              onSyncCalendar={() => triggerToast('Appointment synced with calendar (.ics generated)')}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">No Consultations Currently Scheduled</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You have {user.consultationsRemaining} consultations available in your annual plan.
              </p>
              <button
                onClick={onOpenBookModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Consultation Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: LIVE TELE-DIAGNOSTIC VIDEO ROOM */}
      {activeSubTab === 'tele_room' && (
        <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Main Video Screen */}
            <div className="lg:col-span-2 relative min-h-[380px] sm:min-h-[460px] bg-slate-900 flex flex-col justify-between p-4 sm:p-6">
              {/* Top Bar on Video */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-slate-200">{session.doctorName}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-400">{session.doctorSpecialty}</span>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs font-mono text-emerald-400">
                  {isInCall ? 'LIVE HD · HIPAA 256-BIT' : 'STANDBY'}
                </div>
              </div>

              {/* Video Viewport Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isInCall ? (
                  <div className="relative w-full h-full">
                    <img
                      src="/src/assets/images/tele_diagnostics_doctor_1792753773036.jpg"
                      alt="Dr. Sarah Jenkins on Tele-Diagnostic video consult"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-950/70 border border-indigo-700/50 flex items-center justify-center mx-auto text-indigo-400">
                      <Stethoscope className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Tele-Diagnostic Examination Room</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                        Connect with {session.doctorName}. Optical sensors and audio telemetry are primed.
                      </p>
                    </div>
                    <button
                      onClick={handleStartCall}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-600/30"
                    >
                      Enter Video Consultation
                    </button>
                  </div>
                )}
              </div>

              {/* Patient Self-View Window (Bottom Right) */}
              {isInCall && (
                <div className="absolute bottom-20 right-4 w-28 sm:w-36 h-36 sm:h-44 rounded-xl overflow-hidden border-2 border-indigo-500/80 shadow-2xl bg-slate-800 z-20">
                  {!isCameraOff ? (
                    <div className="relative w-full h-full bg-slate-800 flex flex-col justify-end p-2">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="relative z-10 text-[10px] text-white font-medium flex items-center justify-between">
                        <span>David (You)</span>
                        <span className="text-emerald-400">Optical PPG</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      Camera Off
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Call Controls Bar */}
              {isInCall && (
                <div className="relative z-10 flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-3 rounded-full transition-colors ${
                      isMicMuted ? 'bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    className={`p-3 rounded-full transition-colors ${
                      isCameraOff ? 'bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                  >
                    <Camera className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleToggleHeartSound}
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
                      isHeartSoundPlaying ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    title="Auscultate Digital Stethoscope"
                  >
                    <Volume2 className="w-4 h-4 text-red-400" />
                    <span>{isHeartSoundPlaying ? 'Listening...' : 'Digital Stethoscope'}</span>
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                    title="End Tele-Visit"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Live Vitals HUD & Tele-Diagnostic Panel */}
            <div className="p-6 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                    <Activity className="w-4 h-4" />
                    <span>Real-Time Vitals HUD</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">Sensors Active</span>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {/* Heart Rate */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Pulse / Heart Rate</span>
                      <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tabular-nums">
                      {heartRate} <span className="text-xs text-slate-400 font-sans">BPM</span>
                    </div>
                    {/* Miniature ECG waveform */}
                    <div className="mt-2 h-6 flex items-center overflow-hidden">
                      <svg className="w-full h-5 stroke-red-500 fill-none" viewBox="0 0 100 20">
                        <path
                          d="M 0 10 L 20 10 L 25 2 L 30 18 L 35 10 L 50 10 L 55 4 L 60 16 L 65 10 L 100 10"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Blood Pressure */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Blood Pressure</span>
                      <Activity className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tabular-nums">
                      120/78
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Normotensive</span>
                  </div>

                  {/* Oxygen Saturation */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>SpO2 Blood Oxygen</span>
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tabular-nums">
                      99 <span className="text-xs text-slate-400 font-sans">%</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Optimal Aeration</span>
                  </div>

                  {/* Temperature */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Body Temp</span>
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tabular-nums">
                      98.4 <span className="text-xs text-slate-400 font-sans">°F</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Afebrile</span>
                  </div>
                </div>

                {/* Consultation Symptoms Review */}
                <div className="mt-5 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Chief Complaint / Reason for Visit
                  </label>
                  <select
                    value={selectedSymptom}
                    onChange={(e) => setSelectedSymptom(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Preventive Cardiovascular Review">Preventive Cardiovascular & Blood Panel Review</option>
                    <option value="Seasonal Bronchospasm & Wheezing">Seasonal Bronchospasm / Inhaler Renewal</option>
                    <option value="Acute Migraine / Headache">Acute Headache / Migraine Symptoms</option>
                    <option value="Dermatological Rash or Reaction">Dermatological Rash or Allergic Flare</option>
                  </select>
                </div>
              </div>

              {/* Doctor's Action: Digital Prescription Issuance */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="text-xs text-slate-400">
                  <span>Clinical Recommendation:</span>
                  <p className="text-slate-200 mt-1 font-medium">
                    {session.clinicalImpression}
                  </p>
                </div>

                {!doctorPrescriptionIssued ? (
                  <button
                    onClick={handleSimulateDoctorPrescription}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Pill className="w-4 h-4" />
                    <span>Issue Digital Rx to Express Courier</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-xs text-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Prescription Sent to Pharmacy!</span>
                    </div>
                    <p className="text-[11px] text-emerald-300">
                      Azithromycin 250mg is now being packed into cold-chain tote for 38-minute doorstep delivery.
                    </p>
                    <button
                      onClick={() => setActiveTab('pharmacy')}
                      className="w-full py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500 transition-colors"
                    >
                      Track Medication Courier →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AVAILABLE DOCTORS & SPECIALISTS */}
      {activeSubTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Affiliated Physicians & Hospital Specialists
            </h3>
            <span className="text-xs text-slate-500">
              Available for In-Home, Clinic with Shuttle, or Tele-Visits
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_DOCTORS.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{doc.name}</h4>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        ★ {doc.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{doc.specialty}</p>
                    <p className="text-xs text-slate-400 mt-1">{doc.hospital}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Days: <strong className="text-slate-700">{doc.availableDays.join(', ')}</strong>
                  </div>
                  <button
                    onClick={onOpenBookModal}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Book Appointment</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
