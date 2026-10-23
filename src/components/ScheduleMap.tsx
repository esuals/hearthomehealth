import React from 'react';
import { BookedConsultation } from '../types';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Calendar, 
  Car, 
  Stethoscope, 
  UserCheck, 
  Phone, 
  CheckCircle2, 
  ShieldCheck,
  Video,
  Home,
  Building2,
  CalendarDays
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface ScheduleMapProps {
  consultation: BookedConsultation;
  onLaunchVirtualRoom?: () => void;
  onSyncCalendar?: () => void;
}

export const ScheduleMap: React.FC<ScheduleMapProps> = ({
  consultation,
  onLaunchVirtualRoom,
  onSyncCalendar,
}) => {
  const isVideo = consultation.mode === 'video_telehealth';
  const isHomeVisit = consultation.mode === 'in_home_physician';
  const isShuttle = consultation.mode === 'clinic_with_shuttle_pickup';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
              {isVideo ? 'Virtual Telehealth' : isHomeVisit ? 'In-Home Physician Visit' : 'Clinic Visit with Shuttle Pickup'}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Status: {consultation.status === 'confirmed' ? 'Confirmed & Scheduled' : consultation.status}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{consultation.doctorName}</span>
            <span className="text-xs font-normal text-slate-300">({consultation.doctorSpecialty})</span>
          </h3>

          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">{consultation.scheduledDate}</span>
            <span>·</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{consultation.scheduledTime}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isVideo && onLaunchVirtualRoom && (
            <button
              onClick={onLaunchVirtualRoom}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>Launch Video Room</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playChime('success');
              if (onSyncCalendar) onSyncCalendar();
            }}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium border border-white/15 transition-colors flex items-center gap-1.5"
            title="Download iCal / Google Calendar Event"
          >
            <CalendarDays className="w-3.5 h-3.5 text-indigo-300" />
            <span>Sync to Calendar</span>
          </button>
        </div>
      </div>

      {/* Main Schedule Map Graphic & Route View */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Visual Vector Route / Map Simulation */}
        <div className="relative rounded-2xl bg-slate-950 p-5 sm:p-6 text-white overflow-hidden border border-slate-800">
          {/* Background Map Grid */}
          <div className="opacity-15 absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="sched-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#60a5fa" strokeWidth="0.7" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sched-grid)" />
            </svg>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800 gap-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                <span>Appointment Route & Transport Topology</span>
              </span>
              <span className="font-mono text-emerald-400">
                {isShuttle
                  ? `Shuttle Pickup at ${consultation.pickupDetails?.pickupTime}`
                  : isHomeVisit
                  ? `Physician Arrival: ${consultation.scheduledTime}`
                  : 'Direct Encrypted Link'}
              </span>
            </div>

            {/* Route Diagram */}
            <div className="py-2">
              <div className="relative flex items-center justify-between">
                {/* Connecting Track Line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 w-full" />
                </div>

                {/* Point A: Departure / Pickup Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-slate-900 shadow-md">
                    {isShuttle || isHomeVisit ? <Home className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-bold text-white mt-1.5 text-center max-w-[120px] truncate">
                    {consultation.scheduleMap.departurePoint.split('(')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isShuttle ? 'Pickup 09:45 AM' : isHomeVisit ? 'Patient Home' : 'Patient Portal'}
                  </span>
                </div>

                {/* Midpoint: Transit / Escort */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-slate-900 shadow-md animate-pulse">
                    {isShuttle ? (
                      <Car className="w-5 h-5" />
                    ) : isHomeVisit ? (
                      <Stethoscope className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-indigo-300 mt-1.5 text-center">
                    {isShuttle
                      ? 'Transit Corridor (22m)'
                      : isHomeVisit
                      ? 'Visiting MD Travel'
                      : 'Vital Telemetry'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {consultation.pickupDetails?.routeDistance || 'Direct Connect'}
                  </span>
                </div>

                {/* Point B: Destination Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-slate-900 shadow-md">
                    {isHomeVisit ? <UserCheck className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-bold text-white mt-1.5 text-center max-w-[120px] truncate">
                    {consultation.scheduleMap.destinationPoint.split(',')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    {consultation.scheduledTime.split(' - ')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Shuttle Vehicle & Driver Credentials if pickup enabled */}
            {consultation.pickupRequired && consultation.pickupDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Medical Shuttle
                  </span>
                  <span className="font-semibold text-slate-200">
                    {consultation.pickupDetails.vehicleType}
                  </span>
                  <span className="block font-mono text-[11px] text-indigo-400">
                    Plate: {consultation.pickupDetails.vehiclePlate}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Transport Escort
                  </span>
                  <span className="font-semibold text-slate-200">
                    {consultation.pickupDetails.driverName}
                  </span>
                  <span className="block text-[11px] text-emerald-400">
                    BLS Certified Escort Driver
                  </span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Pickup Schedule
                  </span>
                  <span className="font-semibold text-white">
                    {consultation.pickupDetails.pickupTime} Prompt
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    Doorstep curbside assistance
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Map Milestones Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Appointment Timeline & Schedule Milestones
          </h4>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {consultation.scheduleMap.milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-3.5 relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    milestone.status === 'done'
                      ? 'bg-emerald-600 text-white'
                      : milestone.status === 'current'
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-slate-100 text-slate-600 border border-slate-300'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {milestone.label}
                    </span>
                    <span className="text-xs font-mono font-semibold text-indigo-700">
                      {milestone.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Reason & Preparation Notes */}
        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Consultation Agenda: {consultation.reasonForVisit}</span>
          </div>
          {consultation.notes && <p className="text-blue-900/80">{consultation.notes}</p>}
        </div>
      </div>
    </div>
  );
};
