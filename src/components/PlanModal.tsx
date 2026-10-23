import React from 'react';
import { SubscriptionPlan, UserMembership } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { Check, X, Shield, Star, Sparkles, AlertCircle } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserMembership;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  const handleSelect = (plan: SubscriptionPlan) => {
    soundFx.playChime('success');
    onSelectPlan(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">
                Annual Health Membership Tiers
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              One Yearly Subscription. Complete Medical Protection.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              All plans include guaranteed emergency ambulance services, scheduled yearly health screenings, 24/7 tele-diagnostics, and rapid medication delivery.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Cards Grid */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrent = currentUser.planId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col bg-white rounded-xl border p-5 transition-all ${
                    isCurrent
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                      : plan.popular
                      ? 'border-slate-300 shadow-sm'
                      : 'border-slate-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      <span>{plan.badge || 'Popular'}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.highlight}</p>
                  </div>

                  <div className="mb-5 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                        ${plan.pricePerYear.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ year</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      ~${Math.round(plan.pricePerYear / 12)} / month billed annually
                    </span>
                  </div>

                  {/* Feature Breakdown */}
                  <div className="space-y-3 text-xs flex-1 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong className="text-slate-900 font-semibold">Scheduled Checks:</strong> {plan.features.scheduledChecks}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong className="text-slate-900 font-semibold">Emergency Ambulance:</strong> {plan.features.emergencyAmbulance}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong className="text-slate-900 font-semibold">Tele-Diagnostics:</strong> {plan.features.teleDiagnostics}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong className="text-slate-900 font-semibold">Rx Delivery:</strong> {plan.features.drugDelivery}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong className="text-slate-900 font-semibold">Concierge Support:</strong> {plan.features.supportSLA}
                      </span>
                    </div>
                    {plan.features.homePhlebotomy && (
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-amber-900">
                          In-Home Nurse Phlebotomy visits included
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div>
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-default"
                      >
                        <Check className="w-4 h-4" />
                        <span>Current Active Plan</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelect(plan)}
                        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-colors shadow-xs ${
                          plan.popular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        Switch to {plan.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantee notice */}
          <div className="mt-6 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-3 text-xs text-blue-900">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <p>
              <strong>Annual Subscription Guarantee:</strong> Zero deductible or surprise charges on emergency ambulance dispatches and scheduled checkup panels. Refill medication courier allowance rolls over each quarter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
