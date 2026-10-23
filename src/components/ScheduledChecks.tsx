import React, { useState } from 'react';
import { ScheduledCheck, UserMembership } from '../types';
import { 
  CalendarCheck, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Download, 
  Plus, 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  Home, 
  Building2,
  X
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface ScheduledChecksProps {
  checks: ScheduledCheck[];
  user: UserMembership;
  onBookCheck: (newCheck: ScheduledCheck) => void;
}

export const ScheduledChecks: React.FC<ScheduledChecksProps> = ({
  checks,
  user,
  onBookCheck,
}) => {
  const [selectedReportCheck, setSelectedReportCheck] = useState<ScheduledCheck | null>(
    checks.find((c) => c.labReport) || null
  );
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Booking Form State
  const [selectedCategory, setSelectedCategory] = useState<ScheduledCheck['category']>('Executive Comprehensive');
  const [selectedVenue, setSelectedVenue] = useState<'Home Phlebotomy Visit' | 'Metropolitan Diagnostic Lab Center'>('Home Phlebotomy Visit');
  const [bookingDate, setBookingDate] = useState('2026-11-04');
  const [bookingTime, setBookingTime] = useState('09:00 AM - 09:45 AM');

  const upcomingChecks = checks.filter((c) => c.status !== 'completed');
  const completedChecks = checks.filter((c) => c.status === 'completed');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheck: ScheduledCheck = {
      id: `chk_${Date.now()}`,
      title: `${selectedCategory} Healthcare Screening`,
      category: selectedCategory,
      venue: selectedVenue,
      scheduledDate: new Date(bookingDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      scheduledTime: bookingTime,
      status: 'confirmed',
      address: selectedVenue === 'Home Phlebotomy Visit' ? user.address : 'Metropolitan Health Diagnostic Pavilion, Suite 400',
      nurseAssigned: selectedVenue === 'Home Phlebotomy Visit' ? 'Nurse Mobile Unit 08 (Assigned upon dispatch)' : 'Lead Lab Tech Marcus Wei',
      fastingRequired: true,
      fastingHours: 10,
      preparationNotes: [
        '10-hour fasting required prior to blood biomarker specimen collection (pure water encouraged).',
        'Rest peacefully for 15 minutes prior to cardiac rhythm capture.',
        'A confirmation SMS and calendar invite have been synced with your mobile device.',
      ],
    };

    soundFx.playChime('success');
    onBookCheck(newCheck);
    setIsBookingOpen(false);
    triggerToast('Annual Checkup Scheduled! Home phlebotomy visit confirmed.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Annual Subscription Benefit
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{user.checkupsRemaining} of {user.checkupsTotal} Checkups Available</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Scheduled Annual Healthcare Checks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Proactive wellness audits fully covered under your yearly membership. Have certified phlebotomy nurses visit your doorstep or visit our partner diagnostic centers.
          </p>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book Annual Health Check</span>
        </button>
      </div>

      {/* Upcoming Scheduled Checks List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Upcoming Scheduled Appointments ({upcomingChecks.length})
        </h2>

        {upcomingChecks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Checkups Currently Scheduled</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Use your included annual allowance to schedule your comprehensive health audit.
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        ) : (
          upcomingChecks.map((chk) => (
            <div
              key={chk.id}
              className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs transition-all hover:border-blue-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {chk.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {chk.scheduledDate} · {chk.scheduledTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{chk.title}</h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      {chk.venue.includes('Home') ? (
                        <Home className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <strong>{chk.venue}</strong>
                    </span>
                    <span>·</span>
                    <span className="text-slate-500">{chk.address}</span>
                  </div>

                  {chk.nurseAssigned && (
                    <p className="text-xs text-slate-600">
                      <span className="text-slate-500">Clinician:</span>{' '}
                      <strong className="text-slate-800">{chk.nurseAssigned}</strong>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Confirmed Appointment
                  </span>
                  <span className="text-[11px] text-slate-400">100% Plan Covered</span>
                </div>
              </div>

              {/* Fasting & Preparation Instructions Box */}
              {chk.preparationNotes && chk.preparationNotes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-5 rounded-b-2xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Preparation Checklist Before Nurse Arrives</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {chk.preparationNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Completed Checkups & Interactive Biomarker Lab Reports */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Diagnostic Lab Reports & Biomarker History
        </h2>

        {selectedReportCheck?.labReport && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>Completed on {selectedReportCheck.labReport.completedOn}</span>
                  <span>·</span>
                  <span>Reviewed by {selectedReportCheck.labReport.reviewedBy}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedReportCheck.title}
                </h3>
              </div>

              <button
                onClick={() => {
                  soundFx.playChime('success');
                  triggerToast('Downloading clinical PDF lab report...');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors shrink-0 border border-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Official Lab PDF</span>
              </button>
            </div>

            {/* Doctor's Clinical Summary Impression */}
            <div className="my-4 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
              <div className="font-bold flex items-center gap-1.5 text-blue-950 mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Physician's Clinical Interpretation:</span>
              </div>
              <p className="leading-relaxed">{selectedReportCheck.labReport.summary}</p>
            </div>

            {/* Biomarker Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">Biomarker Metric</th>
                    <th className="py-2.5 px-3">Result Value</th>
                    <th className="py-2.5 px-3">Reference Range</th>
                    <th className="py-2.5 px-3 text-right">Clinical Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedReportCheck.labReport.biomarkers.map((bio, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">{bio.name}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800 tabular-nums">{bio.value}</td>
                      <td className="py-3 px-3 font-mono text-slate-500 tabular-nums">{bio.range}</td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-semibold text-xs ${
                            bio.status === 'optimal'
                              ? 'text-emerald-600'
                              : bio.status === 'borderline'
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {bio.status === 'optimal' && '✓ Optimal'}
                          {bio.status === 'borderline' && '⚠ Borderline'}
                          {bio.status === 'attention' && '⚡ Attention'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Book Your Annual Health Checkup
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Included in your yearly membership ($0 additional charge)
                </p>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-5 space-y-4">
              {/* Checkup Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Screening Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'Executive Comprehensive', name: 'Executive Full-Body Panel', sub: 'ECG, metabolic, CBC, lipids, organs' },
                    { id: 'Cardiovascular & ECG', name: 'Cardiovascular & ECG Audit', sub: 'Heart risk markers & rhythm' },
                    { id: 'Biochemical Baseline', name: 'Biochemical Baseline Panel', sub: 'Comprehensive blood chemistry' },
                    { id: 'Metabolic & Hormonal', name: 'Metabolic & Hormonal Scan', sub: 'Thyroid, HbA1c, vitamins' },
                  ].map((pkg) => (
                    <button
                      type="button"
                      key={pkg.id}
                      onClick={() => setSelectedCategory(pkg.id as ScheduledCheck['category'])}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedCategory === pkg.id
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{pkg.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{pkg.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Collection Method & Venue
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedVenue('Home Phlebotomy Visit')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      selectedVenue === 'Home Phlebotomy Visit'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Home className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">In-Home Nurse Visit</div>
                      <div className="text-[11px] text-slate-500">Phlebotomist visits your residence</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVenue('Metropolitan Diagnostic Lab Center')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      selectedVenue === 'Metropolitan Diagnostic Lab Center'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Diagnostic Center</div>
                      <div className="text-[11px] text-slate-500">Lab Pavilion Suite 400</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time Window
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="08:00 AM - 08:45 AM">08:00 AM - 08:45 AM (Early Fasting)</option>
                    <option value="09:00 AM - 09:45 AM">09:00 AM - 09:45 AM</option>
                    <option value="10:30 AM - 11:15 AM">10:30 AM - 11:15 AM</option>
                    <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM (Non-fasting)</option>
                  </select>
                </div>
              </div>

              {/* Patient address confirmation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Service Location:</span> {user.address}
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm shadow-blue-600/20"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
