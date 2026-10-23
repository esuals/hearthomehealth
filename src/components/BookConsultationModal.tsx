import React, { useState } from 'react';
import { UserMembership, BookedConsultation, ConsultationMode } from '../types';
import { AVAILABLE_DOCTORS, DoctorProfile } from '../data/mockData';
import { 
  X, 
  Video, 
  Home, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  UserCheck, 
  AlertCircle, 
  Check, 
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserMembership;
  onBookSuccess: (newConsultation: BookedConsultation) => void;
  onOpenPlans: () => void;
}

export const BookConsultationModal: React.FC<BookConsultationModalProps> = ({
  isOpen,
  onClose,
  user,
  onBookSuccess,
  onOpenPlans,
}) => {
  if (!isOpen) return null;

  const hasQuotaRemaining = user.consultationsRemaining > 0;

  // Form State
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>('clinic_with_shuttle_pickup');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(AVAILABLE_DOCTORS[0].id);
  const [appointmentDate, setAppointmentDate] = useState<string>('2026-10-26');
  const [appointmentTime, setAppointmentTime] = useState<string>('10:30 AM - 11:15 AM');
  const [pickupEnabled, setPickupEnabled] = useState<boolean>(true);
  const [reasonForVisit, setReasonForVisit] = useState<string>('Preventive Cardiovascular Review & ECG');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [allowElapsedOverride, setAllowElapsedOverride] = useState<boolean>(false);

  const selectedDoctor = AVAILABLE_DOCTORS.find((d) => d.id === selectedDoctorId) || AVAILABLE_DOCTORS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasQuotaRemaining && !allowElapsedOverride) {
      soundFx.playChime('alert');
      return;
    }

    // Format display date
    const dateObj = new Date(appointmentDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Derive pickup time ~45 mins before slot
    const pickupTime = '09:45 AM';

    const newBooking: BookedConsultation = {
      id: `cst_${Math.floor(1000 + Math.random() * 9000)}`,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorHospital: selectedDoctor.hospital,
      doctorAvatar: selectedDoctor.avatarUrl,
      mode: selectedMode,
      scheduledDate: formattedDate,
      scheduledTime: appointmentTime,
      status: 'confirmed',
      venueName: selectedMode === 'clinic_with_shuttle_pickup' 
        ? `${selectedDoctor.hospital} (Specialist Pavilion Suite 410)`
        : selectedMode === 'in_home_physician'
        ? 'In-Home Physician Visit (Patient Residence)'
        : '❤️ Home Health Encrypted Tele-Suite (Heart Home Health)',
      venueAddress: selectedMode === 'clinic_with_shuttle_pickup'
        ? '1190 5th Avenue, New York, NY 10029'
        : user.address,
      patientAddress: user.address,
      reasonForVisit,
      pickupRequired: selectedMode === 'clinic_with_shuttle_pickup' && pickupEnabled,
      pickupDetails: selectedMode === 'clinic_with_shuttle_pickup' && pickupEnabled ? {
        pickupTime,
        driverName: 'Robert Vance (Medical Transport Specialist)',
        vehicleType: '❤️ Home Health Executive Health Shuttle #08',
        vehiclePlate: 'MED-7491-NY',
        pickupStatus: 'scheduled',
        routeDistance: '3.8 miles',
        routeEstDuration: '22 mins',
      } : undefined,
      scheduleMap: {
        departurePoint: selectedMode === 'clinic_with_shuttle_pickup'
          ? `${user.address.split(',')[0]} (Patient Residence)`
          : selectedMode === 'in_home_physician'
          ? `${selectedDoctor.hospital} (Physician Dispatch Hub)`
          : 'Patient Secure Terminal',
        destinationPoint: selectedMode === 'clinic_with_shuttle_pickup'
          ? `${selectedDoctor.hospital}, Suite 410`
          : user.address,
        coordinatesSummary: 'Lat 40.7829° N, Long 73.9654° W -> Lat 40.7903° N, Long 73.9525° W',
        milestones: selectedMode === 'clinic_with_shuttle_pickup' ? [
          {
            time: '09:40 AM',
            label: 'Shuttle Arrival & Patient Boarding',
            description: `❤️ Home Health Shuttle #08 arrives at ${user.address.split(',')[0]} with medical escort.`,
            status: 'upcoming',
          },
          {
            time: '09:45 AM - 10:10 AM',
            label: 'Dedicated Medical Transit Route',
            description: 'Transit via dedicated medical corridor with onboard vitals monitoring equipment.',
            status: 'upcoming',
          },
          {
            time: '10:15 AM',
            label: 'Fast-Track VIP Clinic Check-in',
            description: `Escort directly to Suite 410 for private exam with ${selectedDoctor.name}.`,
            status: 'upcoming',
          },
          {
            time: appointmentTime,
            label: 'Doctor Consultation & Diagnostic Exam',
            description: `Comprehensive consultation with ${selectedDoctor.name} (${selectedDoctor.specialty}).`,
            status: 'upcoming',
          },
          {
            time: '11:25 AM',
            label: 'Return Shuttle Departure',
            description: `Medical shuttle returns patient safely back to ${user.address.split(',')[0]}.`,
            status: 'upcoming',
          },
        ] : selectedMode === 'in_home_physician' ? [
          {
            time: '10:00 AM',
            label: 'Physician En Route',
            description: `${selectedDoctor.name} departs clinic hub with diagnostic clinical mobile kit.`,
            status: 'upcoming',
          },
          {
            time: '10:25 AM',
            label: 'Doorstep Arrival & Sanitization',
            description: `Physician arrives at ${user.address.split(',')[0]}.`,
            status: 'upcoming',
          },
          {
            time: appointmentTime,
            label: 'In-Home Physical Exam & Diagnostic Review',
            description: `Physical examination, prescription reconciliation, and vital check.`,
            status: 'upcoming',
          },
        ] : [
          {
            time: '10:25 AM',
            label: 'Tele-Suite Audio/Video Sensor Calibration',
            description: 'Optical camera heart rate and telemetry sensors stand by.',
            status: 'upcoming',
          },
          {
            time: appointmentTime,
            label: 'Live HD Video Consultation',
            description: `Encrypted 256-bit video link with ${selectedDoctor.name}.`,
            status: 'upcoming',
          },
        ],
      },
      notes: additionalNotes || 'Please have your current medications ready for clinical reconciliation.',
    };

    soundFx.playChime('success');
    onBookSuccess(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                Annual Membership Consultation
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs font-mono text-emerald-400">
                {user.consultationsRemaining} of {user.consultationsTotal} Remaining
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Book Doctor Consultation & Schedule Map
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota Banner or Elapsed Notification */}
        {hasQuotaRemaining ? (
          <div className="px-6 py-3 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Subscription Benefit:</strong> 1 consultation credit will be deducted from your yearly balance ({user.consultationsRemaining} remaining). ₦0 copay.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-5 bg-amber-50 border-b border-amber-200 text-xs text-amber-950 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-bold text-amber-900 block">
                  Annual Consultation Allowance Elapsed
                </strong>
                <p className="mt-0.5 text-amber-800">
                  You have used all {user.consultationsTotal} consultations included in your {user.planName} plan for this annual billing cycle.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPlans();
                }}
                className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade Plan for More Consultations</span>
              </button>

              <button
                type="button"
                onClick={() => setAllowElapsedOverride(true)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  allowElapsedOverride
                    ? 'bg-amber-200 border-amber-400 text-amber-950'
                    : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Book with Single Add-On (₦8,500 Copay)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Mode Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Choose Consultation Type & Delivery
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMode('clinic_with_shuttle_pickup')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedMode === 'clinic_with_shuttle_pickup'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/30'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Clinic + Shuttle Pickup</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Dedicated medical van picks you up and returns you home.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('in_home_physician')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedMode === 'in_home_physician'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/30'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">In-Home Doctor Visit</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Concierge physician visits your residence in person.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('video_telehealth')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedMode === 'video_telehealth'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/30'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Virtual HD Video</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Instant or scheduled video with live telemetry HUD.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Select Doctor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Select Attending Physician
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_DOCTORS.map((doc) => (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    selectedDoctorId === doc.id
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{doc.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{doc.specialty}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <span>{doc.hospital.split(' ')[0]}</span>
                      <span>·</span>
                      <span className="text-amber-600 font-semibold">★ {doc.rating}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Day & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Consultation Day
              </label>
              <input
                type="date"
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Appointment Time Window
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="09:30 AM - 10:15 AM">09:30 AM - 10:15 AM (Morning)</option>
                <option value="10:30 AM - 11:15 AM">10:30 AM - 11:15 AM (Mid-Morning)</option>
                <option value="01:30 PM - 02:15 PM">01:30 PM - 02:15 PM (Afternoon)</option>
                <option value="03:30 PM - 04:15 PM">03:30 PM - 04:15 PM (Late Afternoon)</option>
              </select>
            </div>
          </div>

          {/* Step 4: Medical Pickup & Transport Toggle (if clinic visit) */}
          {selectedMode === 'clinic_with_shuttle_pickup' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pickupEnabled}
                  onChange={(e) => setPickupEnabled(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    Include Patient Medical Shuttle Pickup & Return Escort ($0 Copay)
                  </span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    AegisCare BLS-certified medical shuttle will arrive at <strong>{user.address}</strong> approximately 45 minutes prior to appointment.
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Reason for Visit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Reason for Consultation / Agenda
            </label>
            <input
              type="text"
              required
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              placeholder="e.g. Cardiovascular Risk Review, Blood Pressure Adjustment, Annual Screening"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {hasQuotaRemaining ? (
                <span>1 credit will be deducted upon confirmation</span>
              ) : allowElapsedOverride ? (
                <span className="text-amber-700 font-semibold">Single consultation add-on: $75</span>
              ) : (
                <span className="text-red-600 font-semibold">Allowance elapsed</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasQuotaRemaining && !allowElapsedOverride}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors shadow-sm shadow-blue-600/20 flex items-center gap-1.5"
              >
                <span>Confirm & Generate Schedule Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
