import React, { useState } from 'react';
import { UserMembership } from '../types';
import { 
  X, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut, 
  Sparkles,
  Heart,
  AlertTriangle,
  Info,
  Clock,
  Check
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { auth, signInWithGoogle, signOutUser, syncUserProfileToFirestore } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserMembership;
  onUserUpdate: (updatedUser: UserMembership) => void;
  onOpenPlans: () => void;
  onOpenTerms?: () => void;
}

export const IMO_STATE_LGAS = [
  'Aboh Mbaise',
  'Ahiazu Mbaise',
  'Ehime Mbano',
  'Ezinihitte Mbaise',
  'Ideato North',
  'Ideato South',
  'Ihitte/Uboma',
  'Ikeduru',
  'Isiala Mbano',
  'Isu',
  'Mbaitoli',
  'Ngor Okpala',
  'Njaba',
  'Nkwerre',
  'Nwangele',
  'Obowo',
  'Oguta',
  'Ohaji/Egbema',
  'Okigwe',
  'Onuimo',
  'Orlu',
  'Orsu',
  'Oru East',
  'Oru West',
  'Owerri Municipal',
  'Owerri North',
  'Owerri West',
] as const;

export const OTHER_NIGERIAN_STATES = [
  'Abia State',
  'Anambra State',
  'Enugu State',
  'Ebonyi State',
  'Delta State',
  'Rivers State',
  'Edo State',
  'Lagos State',
  'Oyo State',
  'Ogun State',
  'Osun State',
  'Ekiti State',
  'Ondo State',
  'FCT Abuja',
  'Kaduna State',
  'Kano State',
  'Plateau State',
  'Benue State',
  'Akwa Ibom State',
  'Cross River State',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onOpenPlans,
  onOpenTerms,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [waitlistSuccessMessage, setWaitlistSuccessMessage] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Form fields localized for Imo State rural Nigerian trial
  const [memberName, setMemberName] = useState(currentUser.memberName || 'Emmanuel Iwuchukwu');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '+234 803 456 7891');
  const [state, setState] = useState(currentUser.state || 'Imo State');
  const [lga, setLga] = useState(currentUser.lga || 'Aboh Mbaise LGA');
  const [community, setCommunity] = useState(currentUser.community || 'Enyiogugu / Nguru Corridor');
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser.preferredLanguage || 'Igbo');
  const [bloodType, setBloodType] = useState(currentUser.bloodType || 'O Rh-Positive');
  const [nextOfKinName, setNextOfKinName] = useState(currentUser.emergencyContact?.name || 'Chiamaka Iwuchukwu');
  const [nextOfKinPhone, setNextOfKinPhone] = useState(currentUser.emergencyContact?.phone || '+234 802 334 9901');

  if (!isOpen) return null;

  const isImoState = state === 'Imo State';

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      soundFx.playChime('tick');
      const firebaseUser = await signInWithGoogle();
      if (firebaseUser) {
        const updated: UserMembership = {
          ...currentUser,
          uid: firebaseUser.uid,
          memberName: firebaseUser.displayName || memberName,
          email: firebaseUser.email || currentUser.email,
          avatarUrl: firebaseUser.photoURL || currentUser.avatarUrl,
        };

        await syncUserProfileToFirestore(updated);
        onUserUpdate(updated);
        soundFx.playChime('success');
      }
    } catch (error: any) {
      console.error('Google Sign-in failed:', error);
      setErrorMessage(error.message || 'Google Sign-in was cancelled or encountered an error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setWaitlistSuccessMessage(null);

    // Enforce restriction to Imo State
    if (!isImoState) {
      soundFx.playChime('alert');
      setWaitlistSuccessMessage(
        `Thank you ${memberName || 'Subscriber'}. You have been placed on the Phase 2 Clinical Expansion Waitlist for ${state}. As soon as operations expand beyond Imo State, you will be notified at ${phoneNumber}.`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedUser: UserMembership = {
        ...currentUser,
        memberName,
        phoneNumber,
        state: 'Imo State',
        lga: lga.endsWith('LGA') ? lga : `${lga} LGA`,
        community,
        preferredLanguage: preferredLanguage as any,
        bloodType,
        address: `${community}, ${lga.endsWith('LGA') ? lga : `${lga} LGA`}, Imo State, Nigeria`,
        emergencyContact: {
          name: nextOfKinName,
          relation: 'Next of Kin / Family Contact',
          phone: nextOfKinPhone,
        },
      };

      if (auth.currentUser?.uid) {
        updatedUser.uid = auth.currentUser.uid;
      }

      await syncUserProfileToFirestore(updatedUser);
      onUserUpdate(updatedUser);
      soundFx.playChime('success');
      onClose();
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      setErrorMessage(error.message || 'Could not update profile to Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      soundFx.playChime('tick');
      onUserUpdate({
        ...currentUser,
        uid: undefined,
        email: undefined,
      });
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const isSignedIn = !!auth.currentUser || !!currentUser.uid;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-white w-full max-w-xl sm:max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[96vh] sm:max-h-[92vh] overflow-hidden animate-in fade-in duration-150">
        {/* Sticky Compact Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-rose-300 truncate">
                  ❤️ Home Health
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  🇳🇬 Imo Pilot
                </span>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-white truncate">
                Subscriber Onboarding & Verification
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compact Imo State Restriction Alert Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-b border-amber-300/40 px-3 py-2 sm:px-4 sm:py-2.5 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1 text-[11px] sm:text-xs text-slate-800">
              <span className="font-extrabold text-amber-950">
                Exclusive Imo Pilot:
              </span>{' '}
              <span className="text-slate-700">
                Signups & 4x4 ambulance dispatch strictly restricted to <strong>27 Imo State LGAs</strong>. Other states join Phase 2 Waitlist.
              </span>
            </div>
          </div>
        </div>

        {/* Form Container with Scrollable Body and Sticky Footer */}
        <form onSubmit={handleSaveProfile} className="flex flex-col flex-1 overflow-hidden min-h-0">
          {/* Scrollable Fields Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3 text-xs">
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {waitlistSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Phase 2 Clinical Waitlist Confirmed!</span>
                </div>
                <p className="text-emerald-700">{waitlistSuccessMessage}</p>
              </div>
            )}

            {/* Google Quick Sync Strip */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-900 block truncate">
                    {isSignedIn ? 'Firebase Cloud Account' : 'Google Identity Sync'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {isSignedIn
                      ? `${auth.currentUser?.email || currentUser.email || currentUser.memberName}`
                      : 'Sync medical records & SOS history'}
                  </span>
                </div>
              </div>

              {isSignedIn ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleSignIn}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google Sign-In</span>
                </button>
              )}
            </div>

            {/* Field Set 1: Subscriber Name & Phone (2-Column Grid on Mobile) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-0.5 text-[11px] truncate">
                  Subscriber Name *
                </label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Emmanuel Iwuchukwu"
                  className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-0.5 text-[11px] truncate">
                  Phone (+234) *
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+234 803 456 7891"
                  className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                />
              </div>
            </div>

            {/* Field Set 2: Imo State & LGA Selection (2-Column Grid) */}
            <div className="p-2.5 sm:p-3 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* State Field */}
                <div>
                  <label className="block text-slate-800 font-bold mb-0.5 text-[11px] flex items-center justify-between">
                    <span>State *</span>
                    {isImoState ? (
                      <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1 py-0.2 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="text-[9px] text-amber-700 font-bold bg-amber-100 px-1 py-0.2 rounded">
                        Waitlist
                      </span>
                    )}
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      const newSt = e.target.value;
                      setState(newSt);
                      if (newSt === 'Imo State' && !IMO_STATE_LGAS.some((l) => lga.includes(l))) {
                        setLga('Aboh Mbaise LGA');
                      }
                    }}
                    className={`w-full py-1.5 px-2 rounded-lg border bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-rose-500 outline-none text-xs ${
                      isImoState ? 'border-emerald-400 bg-emerald-50/20' : 'border-amber-400 bg-amber-50/40'
                    }`}
                  >
                    <option value="Imo State">🇳🇬 Imo State (Active Pilot)</option>
                    <optgroup label="Other States (Phase 2 Waitlist)">
                      {OTHER_NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* LGA Field */}
                <div>
                  <label className="block text-slate-800 font-bold mb-0.5 text-[11px] truncate">
                    {isImoState ? 'Imo LGA (27 LGAs) *' : 'Local Government *'}
                  </label>
                  {isImoState ? (
                    <select
                      value={lga.replace(' LGA', '')}
                      onChange={(e) => setLga(`${e.target.value} LGA`)}
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                    >
                      {IMO_STATE_LGAS.map((l) => (
                        <option key={l} value={l}>
                          {l} LGA
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      placeholder="e.g. Ikeja LGA"
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                    />
                  )}
                </div>
              </div>

              {/* Village / Autonomous Community (Full Width) */}
              <div>
                <label className="block text-slate-800 font-bold mb-0.5 text-[11px] truncate">
                  Village / Autonomous Community *
                </label>
                <input
                  type="text"
                  required
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder={isImoState ? 'e.g. Enyiogugu / Nguru / Ahiara' : 'e.g. Community name'}
                  className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                />
              </div>

              {!isImoState ? (
                <div className="p-2 bg-amber-100/80 border border-amber-300 rounded-lg text-[10px] text-amber-900 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700 mt-0.5" />
                  <span>
                    Selecting <em>{state}</em> registers you on Phase 2 Waitlist. Switch to <strong>Imo State</strong> for active clinical benefits.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Active coverage across IMSUTH Orlu, FMC Owerri & all 27 General Hospitals.</span>
                </div>
              )}
            </div>

            {/* Field Set 3: Dialect & Blood Group (2-Column Grid) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-0.5 text-[11px] truncate">
                  Consultation Dialect
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as any)}
                  className="w-full py-1.5 px-2 sm:py-2 sm:px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                >
                  <option value="Igbo">Igbo (Asụsụ Igbo)</option>
                  <option value="Pidgin">Pidgin English</option>
                  <option value="English">English</option>
                  <option value="Yoruba">Yoruba</option>
                  <option value="Hausa">Hausa</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-0.5 text-[11px] truncate">
                  Blood Group
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full py-1.5 px-2 sm:py-2 sm:px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                >
                  <option value="O Rh-Positive">O Rh-Positive (O+)</option>
                  <option value="A Rh-Positive">A Rh-Positive (A+)</option>
                  <option value="B Rh-Positive">B Rh-Positive (B+)</option>
                  <option value="AB Rh-Positive">AB Rh-Positive (AB+)</option>
                  <option value="O Rh-Negative">O Rh-Negative (O-)</option>
                  <option value="A Rh-Negative">A Rh-Negative (A-)</option>
                </select>
              </div>
            </div>

            {/* Field Set 4: Emergency Next of Kin (2-Column Grid) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-slate-700 font-semibold mb-0.5 text-[11px] truncate">
                  Next of Kin (Name)
                </label>
                <input
                  type="text"
                  value={nextOfKinName}
                  onChange={(e) => setNextOfKinName(e.target.value)}
                  placeholder="Chiamaka Iwuchukwu"
                  className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-0.5 text-[11px] truncate">
                  Next of Kin Phone
                </label>
                <input
                  type="text"
                  value={nextOfKinPhone}
                  onChange={(e) => setNextOfKinPhone(e.target.value)}
                  placeholder="+234 802 334 9901"
                  className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                />
              </div>
            </div>

            {/* NDPA & Regulatory Consent Checkbox */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer shrink-0"
                />
                <span className="text-slate-700 leading-tight">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onOpenTerms) onOpenTerms();
                    }}
                    className="font-bold text-rose-700 hover:text-rose-900 underline inline cursor-pointer"
                  >
                    Rights of Use & Clinical Terms
                  </button>{' '}
                  under the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>.
                </span>
              </label>
            </div>
          </div>

          {/* Sticky Bottom Footer - Always Visible on Screen */}
          <div className="p-2.5 sm:p-3.5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPlans();
              }}
              className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer order-2 sm:order-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Subscription Tiers (₦120k - ₦480k)</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !agreedToTerms}
              className={`w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer order-1 sm:order-2 active:scale-95 ${
                isImoState
                  ? 'bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white shadow-rose-600/25'
                  : 'bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white shadow-amber-600/25'
              }`}
            >
              {isImoState ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Confirm Imo State Registration</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Join Phase 2 Waitlist ({state.replace(' State', '')})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
