import React, { useState, useEffect } from 'react';
import { AmbulanceDispatchState, UserMembership } from '../types';
import { 
  Ambulance, 
  PhoneCall, 
  MapPin, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Radio, 
  Clock, 
  Heart, 
  UserCheck, 
  CheckCircle2, 
  XOctagon, 
  Navigation,
  FileHeart
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface EmergencyServicesProps {
  user: UserMembership;
  dispatchState: AmbulanceDispatchState;
  setDispatchState: React.Dispatch<React.SetStateAction<AmbulanceDispatchState>>;
}

export const EmergencyServices: React.FC<EmergencyServicesProps> = ({
  user,
  dispatchState,
  setDispatchState,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [dispatcherNote, setDispatcherNote] = useState<string>(
    'ALS Unit 402 en route with priority code 3. Stand by for paramedic arrival.'
  );

  // Handle SOS 5-second cancellation countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      soundFx.playChime('tick');
      timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      // Countdown completed -> Trigger Ambulance Dispatch
      setCountdown(null);
      triggerDispatchNow();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle active dispatch dynamic progression simulation
  useEffect(() => {
    if (!dispatchState.isActive) return;

    const interval = setInterval(() => {
      setDispatchState((prev) => {
        if (!prev.isActive) return prev;
        const newEta = Math.max(1, prev.etaMinutes - 1);
        let nextStatus: AmbulanceDispatchState['status'] = prev.status;

        if (newEta <= 2) {
          nextStatus = 'on_scene';
          setDispatcherNote('Ambulance on-scene at 742 Evergreen Terrace. Paramedics entering building.');
        } else if (newEta <= 4) {
          nextStatus = 'en_route';
          setDispatcherNote('Unit 402 passing Broadway & 72nd St. Vitals telemetry synchronized.');
        }

        return {
          ...prev,
          etaMinutes: newEta,
          status: nextStatus,
        };
      });
    }, 12000); // Progress every 12s in simulation

    return () => clearInterval(interval);
  }, [dispatchState.isActive, setDispatchState]);

  const handleInitiateSOS = () => {
    soundFx.playChime('alert');
    setCountdown(5);
  };

  const handleCancelCountdown = () => {
    soundFx.playChime('tick');
    setCountdown(null);
  };

  const triggerDispatchNow = () => {
    soundFx.playChime('alert');
    setCountdown(null);
    setDispatchState({
      isActive: true,
      status: 'en_route',
      unitName: 'ALS Rural 4x4 Unit 102',
      unitType: 'Land Cruiser 4x4 Rural Medical Unit & Okada Escort',
      paramedicTeam: ['Nurse Chioma Nwachukwu, RN', 'Emeka Okorie (Lead CHEW)'],
      etaMinutes: 6,
      initialEtaMinutes: 6,
      destinationHospital: 'FMC Owerri / IMSUTH Orlu Emergency Trauma Centre',
      patientAddress: user.address,
      dispatchTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sirenAudioActive: false,
      dispatchCallActive: true,
    });
    setDispatcherNote('Rural 4x4 Emergency Unit & motorcycle medical escort dispatched with siren active.');
  };

  const handleCancelDispatch = () => {
    soundFx.stopAmbulanceSiren();
    setIsSirenOn(false);
    setDispatchState((prev) => ({
      ...prev,
      isActive: false,
      status: 'standby',
      sirenAudioActive: false,
      dispatchCallActive: false,
    }));
  };

  const handleToggleSiren = () => {
    const active = soundFx.toggleSiren();
    setIsSirenOn(active);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 text-white rounded-2xl p-6 border border-red-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              100% Covered Emergency Medical Services
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-red-200">Zero Out-Of-Pocket Copay</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Emergency Services & Rapid Ambulance Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Priority high-acuity ALS ambulance response linked directly to metropolitan emergency networks and Level 1 trauma centers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">Coverage Status</div>
            <div className="text-xs font-bold text-emerald-400">
              {(user.emergencyRidesRemaining ?? 3)} of {(user.emergencyRidesTotal ?? 3)} Dispatches Available
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Dispatch Console */}
      {!dispatchState.isActive ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center">
          {countdown !== null ? (
            /* 5-Second Cancellation Window */
            <div className="max-w-md mx-auto py-4 space-y-4 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-red-100 border-4 border-red-600 text-red-600 flex items-center justify-center mx-auto text-3xl font-extrabold font-mono animate-pulse">
                {countdown}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Dispatching Emergency Ambulance
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transmitting your GPS location & medical profile to nearest ALS Unit. Press cancel if triggered by accident.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCancelCountdown}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <XOctagon className="w-4 h-4 text-red-600" />
                  <span>Cancel Dispatch</span>
                </button>
                <button
                  onClick={triggerDispatchNow}
                  className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-md shadow-red-600/30 flex items-center gap-1.5"
                >
                  <span>Dispatch Immediately</span>
                </button>
              </div>
            </div>
          ) : (
            /* Standby Trigger Button */
            <div className="max-w-md mx-auto py-4 space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
                <button
                  onClick={handleInitiateSOS}
                  className="relative w-36 h-36 rounded-full bg-gradient-to-b from-red-500 to-red-700 text-white shadow-2xl shadow-red-600/50 flex flex-col items-center justify-center group active:scale-95 transition-transform border-4 border-red-200"
                >
                  <Ambulance className="w-12 h-12 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-extrabold tracking-wider">SOS</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-red-100">
                    Dispatch
                  </span>
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tap to Trigger Immediate Ambulance Response
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  A 5-second safety buffer will allow accidental cancellation. Your live GPS coordinates ({user.address}) and medical profile will be dispatched.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-left pt-2 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Average ETA</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">5 - 8 mins</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Ambulance Tier</div>
                  <div className="text-sm font-bold text-slate-900">ALS Unit</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Member Copay</div>
                  <div className="text-sm font-bold text-emerald-600 font-mono">$0.00</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* LIVE AMBULANCE DISPATCH IN PROGRESS CONSOLE */
        <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-md space-y-6">
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse shadow-md shadow-red-600/30">
                <Ambulance className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded">
                    Priority Emergency In Progress
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Dispatched at {dispatchState.dispatchTimestamp}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {dispatchState.unitName} · {dispatchState.unitType}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSiren}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  isSirenOn
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Toggle Web Audio Ambulance Siren Sound"
              >
                {isSirenOn ? <Volume2 className="w-3.5 h-3.5 text-red-600 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isSirenOn ? 'Mute Siren Tone' : 'Ambulance Siren Sound'}</span>
              </button>

              <button
                onClick={handleCancelDispatch}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-colors"
              >
                End / Cancel
              </button>
            </div>
          </div>

          {/* Interactive Live Radar & Map Visual Simulation */}
          <div className="relative rounded-2xl bg-slate-950 p-6 text-white overflow-hidden border border-slate-800">
            {/* Background Grid & Streets Simulation */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Map Progression Graphic */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    GPS Telemetry Transmitting
                  </span>
                  <span className="font-mono text-white">Speed: 46 MPH · Code 3 High Priority</span>
                </div>

                {/* Road Line Simulation */}
                <div className="relative py-6">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(15, (1 - dispatchState.etaMinutes / dispatchState.initialEtaMinutes) * 100))}%` }}
                    />
                  </div>

                  {/* Nodes on Route */}
                  <div className="flex justify-between items-center text-xs mt-2 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>Trauma Station 04</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-amber-400 animate-pulse">
                      <Ambulance className="w-4 h-4" />
                      <span>ALS 402 En Route</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-red-400">
                      <MapPin className="w-4 h-4" />
                      <span>Patient Residence</span>
                    </div>
                  </div>
                </div>

                {/* Dispatcher Broadcast Intercom */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/80 text-xs flex items-start gap-2.5">
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <span className="font-bold text-slate-200">911 Dispatch Intercom:</span>{' '}
                    <span className="text-slate-300">{dispatcherNote}</span>
                  </div>
                </div>
              </div>

              {/* Big ETA Countdown Meter */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 text-center flex flex-col justify-center">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Estimated Arrival
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-red-500 font-mono my-1 tracking-tight tabular-nums">
                  {dispatchState.etaMinutes} <span className="text-xl text-slate-300">min</span>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-red-400" />
                  Trauma team prepped
                </span>
                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
                  Destination:{' '}
                  <strong className="text-white block truncate">{dispatchState.destinationHospital}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Paramedics and Equipment details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Assigned First-Response Crew</span>
              </div>
              <ul className="space-y-1 text-slate-600">
                {dispatchState.paramedicTeam.map((member, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{member}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-600" />
                <span>Onboard Advanced Life Support Equipment</span>
              </div>
              <div className="text-slate-600 space-y-1">
                <div>• Zoll X-Series 12-Lead Defibrillator & ECG sync</div>
                <div>• Hamilton T1 Transport Ventilator</div>
                <div>• Cold-chain emergency blood & medication kit</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Emergency Medical ID (Pre-Transmitted to Paramedics) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
          <div className="flex items-center gap-2">
            <FileHeart className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">
              Paramedic Emergency Dossier
            </h3>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Auto-Sync with Responding Paramedic Terminal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
              Blood Type & RH
            </span>
            <span className="text-lg font-bold text-red-600 font-mono">
              {user.bloodType}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
              Documented Allergies
            </span>
            <div className="font-semibold text-slate-900">
              {user.allergies.join(', ')}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
              Next-of-Kin Contact
            </span>
            <div className="font-semibold text-slate-900">
              {user.emergencyContact.name} ({user.emergencyContact.relation})
            </div>
            <div className="font-mono text-slate-500 mt-0.5">
              {user.emergencyContact.phone}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
          <strong>Pre-existing Conditions on File:</strong> {user.chronicConditions.join(' · ')}. Responding medical personnel are notified of active medications upon dispatch confirmation.
        </div>
      </div>
    </div>
  );
};
