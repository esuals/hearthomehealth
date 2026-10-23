/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ActiveTab, 
  UserMembership, 
  ScheduledCheck, 
  AmbulanceDispatchState, 
  MedicationOrder, 
  TeleConsultSession, 
  SupportChatMessage,
  SubscriptionPlan,
  BookedConsultation
} from './types';
import { ThemeId } from './types/theme';
import { APP_THEMES } from './data/themes';
import { 
  INITIAL_USER, 
  INITIAL_CHECKS, 
  INITIAL_MEDICATIONS, 
  INITIAL_TELE_SESSION, 
  INITIAL_SUPPORT_MESSAGES,
  INITIAL_BOOKED_CONSULTATIONS
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MobileFrame } from './components/MobileFrame';
import { DashboardOverview } from './components/DashboardOverview';
import { ScheduledChecks } from './components/ScheduledChecks';
import { EmergencyServices } from './components/EmergencyServices';
import { TeleDiagnostics } from './components/TeleDiagnostics';
import { MedicationDelivery } from './components/MedicationDelivery';
import { RealtimeSupport } from './components/RealtimeSupport';
import { PlanModal } from './components/PlanModal';
import { BookConsultationModal } from './components/BookConsultationModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { soundFx } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [user, setUser] = useState<UserMembership>(INITIAL_USER);
  const [checks, setChecks] = useState<ScheduledCheck[]>(INITIAL_CHECKS);
  const [medications, setMedications] = useState<MedicationOrder[]>(INITIAL_MEDICATIONS);
  const [teleSession, setTeleSession] = useState<TeleConsultSession>(INITIAL_TELE_SESSION);
  const [bookedConsultations, setBookedConsultations] = useState<BookedConsultation[]>(INITIAL_BOOKED_CONSULTATIONS);
  const [supportMessages, setSupportMessages] = useState<SupportChatMessage[]>(INITIAL_SUPPORT_MESSAGES);
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [isBookConsultModalOpen, setIsBookConsultModalOpen] = useState<boolean>(false);
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('clinical');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Sync data-theme attribute on root element
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentThemeId);
  }, [currentThemeId]);

  // Emergency Dispatch State
  const [ambulanceState, setAmbulanceState] = useState<AmbulanceDispatchState>({
    isActive: false,
    status: 'standby',
    unitName: 'ALS Mobile Unit 402',
    unitType: 'Advanced Life Support (ALS) Ambulance',
    paramedicTeam: ['Capt. Marcus Rivera, Lead Paramedic', 'Sarah Vance, Critical Care EMT-P'],
    etaMinutes: 6,
    initialEtaMinutes: 6,
    destinationHospital: 'Mount Sinai Hospital Level 1 Trauma Center',
    patientAddress: INITIAL_USER.address,
    sirenAudioActive: false,
    dispatchCallActive: false,
  });

  // Handler for booking new scheduled health check
  const handleBookCheck = (newCheck: ScheduledCheck) => {
    setChecks((prev) => [newCheck, ...prev]);
    setUser((prev) => ({
      ...prev,
      checkupsRemaining: Math.max(0, prev.checkupsRemaining - 1),
    }));
  };

  // Handler for booking consultation with quota deduction
  const handleBookConsultation = (newConsultation: BookedConsultation) => {
    setBookedConsultations((prev) => [newConsultation, ...prev]);
    setUser((prev) => {
      const remaining = Math.max(0, prev.consultationsRemaining - 1);
      return {
        ...prev,
        consultationsRemaining: remaining,
        teleConsultsRemaining: `${remaining} of ${prev.consultationsTotal} available this year`,
      };
    });
    setActiveTab('telediag');
  };

  // Handler for prescription issued from tele-diagnostics or refill
  const handleAddMedicationOrder = (order: MedicationOrder) => {
    setMedications((prev) => [order, ...prev]);
  };

  // Handler for plan upgrade / switch
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    const consultationsTotal = plan.id === 'plan_executive' ? 16 : plan.id === 'plan_comprehensive' ? 8 : 4;
    setUser((prev) => ({
      ...prev,
      planId: plan.id,
      planName: plan.name,
      annualFee: plan.pricePerYear,
      checkupsTotal: plan.id === 'plan_executive' ? 4 : plan.id === 'plan_comprehensive' ? 2 : 1,
      checkupsRemaining: plan.id === 'plan_executive' ? 3 : plan.id === 'plan_comprehensive' ? 2 : 1,
      consultationsTotal,
      consultationsRemaining: consultationsTotal - 1,
      teleConsultsRemaining: `${consultationsTotal - 1} of ${consultationsTotal} available this year`,
    }));
  };

  // Intelligent real-time triage support responses
  const handleSendMessage = (text: string) => {
    const userMsg: SupportChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      senderName: user.memberName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setSupportMessages((prev) => [...prev, userMsg]);

    // Simulate nurse reply after brief natural latency
    setTimeout(() => {
      soundFx.playChime('tick');
      const lower = text.toLowerCase();
      let replyText = "Thank you for reaching out, David. I've noted this in your Heart Home Health clinical chart. How else can our medical desk support you today?";
      let actionTag: SupportChatMessage['actionTag'] = undefined;

      if (lower.includes('fasting') || lower.includes('coffee') || lower.includes('water') || lower.includes('breakfast')) {
        replyText = "For tomorrow's annual blood screening, pure water is encouraged to keep veins well-hydrated for the phlebotomist. Please avoid black coffee, tea, and caloric intake for 10 hours prior to ensure optimal lipid and glucose accuracy.";
        actionTag = { label: 'View Appointment Checklist', tab: 'checks' };
      } else if (lower.includes('refill') || lower.includes('inhaler') || lower.includes('medication') || lower.includes('pharmacy')) {
        replyText = "I've reviewed your active prescription for Albuterol Sulfate Inhaler. Your plan covers 45-minute express cold-chain courier delivery with $0 copay. You can track courier dispatch directly in your Rx portal.";
        actionTag = { label: 'Track Medication Delivery', tab: 'pharmacy' };
      } else if (lower.includes('ambulance') || lower.includes('emergency') || lower.includes('chest') || lower.includes('pain') || lower.includes('sos')) {
        replyText = "If you are experiencing acute chest pain, shortness of breath, or sudden weakness, tap Emergency SOS immediately for priority ALS dispatch. Our paramedic team is on standby with 100% plan coverage.";
        actionTag = { label: 'Open Emergency SOS Console', tab: 'emergency' };
      } else if (lower.includes('doctor') || lower.includes('consult') || lower.includes('video') || lower.includes('dr')) {
        replyText = "Dr. Sarah Jenkins is available on our secure tele-diagnostic feed. You can launch the video consult and review your live optical heart rate and vital telemetry anytime.";
        actionTag = { label: 'Launch Tele-Diagnostics', tab: 'telediag' };
      }

      const nurseMsg: SupportChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'concierge',
        senderName: 'Nurse Elena Vance, RN',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        actionTag,
      };

      setSupportMessages((prev) => [...prev, nurseMsg]);
    }, 900);
  };

  const upcomingCheck = checks.find((c) => c.status !== 'completed');
  const activeOrder = medications.find((m) => m.status === 'out_for_delivery' || m.status === 'packed');
  const activeTheme = APP_THEMES[currentThemeId] || APP_THEMES.clinical;

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-blue-100 selection:text-blue-900 ${activeTheme.classNames.bodyBg}`}
      style={{ backgroundColor: activeTheme.colors.canvas, color: activeTheme.colors.textPrimary }}
    >
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isMobileDeviceFrame={isMobileDeviceFrame}
        setIsMobileDeviceFrame={setIsMobileDeviceFrame}
        hasActiveEmergency={ambulanceState.isActive}
        onOpenPlans={() => setIsPlanModalOpen(true)}
        onOpenThemes={() => setIsThemeModalOpen(true)}
        currentThemeName={activeTheme.name}
      />

      {/* Primary Content Viewport */}
      <MobileFrame isMobileDeviceFrame={isMobileDeviceFrame}>
        {activeTab === 'overview' && (
          <DashboardOverview
            user={user}
            upcomingCheck={upcomingCheck}
            upcomingConsultation={bookedConsultations[0]}
            ambulanceState={ambulanceState}
            activeOrder={activeOrder}
            setActiveTab={setActiveTab}
            onOpenPlans={() => setIsPlanModalOpen(true)}
            onOpenBookModal={() => setIsBookConsultModalOpen(true)}
          />
        )}

        {activeTab === 'checks' && (
          <ScheduledChecks
            checks={checks}
            user={user}
            onBookCheck={handleBookCheck}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyServices
            user={user}
            dispatchState={ambulanceState}
            setDispatchState={setAmbulanceState}
          />
        )}

        {activeTab === 'telediag' && (
          <TeleDiagnostics
            session={teleSession}
            onIssuePrescription={handleAddMedicationOrder}
            setActiveTab={setActiveTab}
            consultations={bookedConsultations}
            user={user}
            onOpenBookModal={() => setIsBookConsultModalOpen(true)}
            onOpenPlans={() => setIsPlanModalOpen(true)}
          />
        )}

        {activeTab === 'pharmacy' && (
          <MedicationDelivery
            orders={medications}
            user={user}
            onRequestRefill={handleAddMedicationOrder}
          />
        )}

        {activeTab === 'support' && (
          <RealtimeSupport
            messages={supportMessages}
            onSendMessage={handleSendMessage}
            setActiveTab={setActiveTab}
            user={user}
          />
        )}
      </MobileFrame>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveEmergency={ambulanceState.isActive}
      />

      {/* Annual Subscription Plans & Benefits Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        currentUser={user}
        onSelectPlan={handleSelectPlan}
      />

      {/* Book Consultation & Route Modal */}
      <BookConsultationModal
        isOpen={isBookConsultModalOpen}
        onClose={() => setIsBookConsultModalOpen(false)}
        user={user}
        onBookSuccess={handleBookConsultation}
        onOpenPlans={() => setIsPlanModalOpen(true)}
      />

      {/* Eye-Comfort & Contrast Themes Studio */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentThemeId}
        onSelectTheme={setCurrentThemeId}
      />
    </div>
  );
}
