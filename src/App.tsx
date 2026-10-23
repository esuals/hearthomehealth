/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  INITIAL_BOOKED_CONSULTATIONS,
  SUBSCRIPTION_PLANS
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
import { NigerianPaymentModal } from './components/NigerianPaymentModal';
import { AuthModal } from './components/AuthModal';
import { RuralFacilityLocator } from './components/RuralFacilityLocator';
import { TermsModal } from './components/TermsModal';
import { soundFx } from './utils/soundEffects';
import { auth, testFirestoreConnection, syncUserProfileToFirestore, fetchUserProfileFromFirestore } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('clinical');

  // Nigerian Native Payment & Auth Modal states
  const [isNigerianPaymentModalOpen, setIsNigerianPaymentModalOpen] = useState<boolean>(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[1]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);

  // Sync data-theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentThemeId);
  }, [currentThemeId]);

  // Initial Firestore connection test & Firebase Auth state synchronization
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const remoteData = await fetchUserProfileFromFirestore(firebaseUser.uid);
          if (remoteData) {
            setUser((prev) => ({
              ...prev,
              ...remoteData,
              uid: firebaseUser.uid,
              memberName: remoteData.displayName || remoteData.memberName || firebaseUser.displayName || prev.memberName,
              email: firebaseUser.email || prev.email,
            }));
          } else {
            // First time login -> sync initial Nigerian pilot profile to Firestore
            const initialSync: UserMembership = {
              ...INITIAL_USER,
              uid: firebaseUser.uid,
              memberName: firebaseUser.displayName || INITIAL_USER.memberName,
              email: firebaseUser.email || INITIAL_USER.email,
              avatarUrl: firebaseUser.photoURL || INITIAL_USER.avatarUrl,
            };
            await syncUserProfileToFirestore(initialSync);
            setUser(initialSync);
          }
        } catch (err) {
          console.warn('Profile sync note:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Emergency Dispatch State (Adapted for rural Nigerian terrain)
  const [ambulanceState, setAmbulanceState] = useState<AmbulanceDispatchState>({
    isActive: false,
    status: 'standby',
    unitName: 'ALS Rural 4x4 Unit 102',
    unitType: 'Land Cruiser 4x4 Rural Medical Unit & Okada Escort',
    paramedicTeam: ['Nurse Bukola Adeleke, RN', 'Tunde Alabi (Lead CHEW)'],
    etaMinutes: 6,
    initialEtaMinutes: 6,
    destinationHospital: 'UCH Outreach Center / State Hospital Oyo (Trauma Wing)',
    patientAddress: INITIAL_USER.address,
    sirenAudioActive: false,
    dispatchCallActive: false,
  });

  // Handler for booking new scheduled health check
  const handleBookCheck = (newCheck: ScheduledCheck) => {
    setChecks((prev) => [newCheck, ...prev]);
    setUser((prev) => {
      const updated = {
        ...prev,
        checkupsRemaining: Math.max(0, prev.checkupsRemaining - 1),
      };
      syncUserProfileToFirestore(updated).catch(() => {});
      return updated;
    });
  };

  // Handler for booking consultation with quota deduction
  const handleBookConsultation = (newConsultation: BookedConsultation) => {
    setBookedConsultations((prev) => [newConsultation, ...prev]);
    setUser((prev) => {
      const remaining = Math.max(0, prev.consultationsRemaining - 1);
      const updated = {
        ...prev,
        consultationsRemaining: remaining,
        teleConsultsRemaining: `${remaining} of ${prev.consultationsTotal} available this year`,
      };
      syncUserProfileToFirestore(updated).catch(() => {});
      return updated;
    });
    setActiveTab('telediag');
  };

  // Handler for prescription issued from tele-diagnostics or refill
  const handleAddMedicationOrder = (order: MedicationOrder) => {
    setMedications((prev) => [order, ...prev]);
  };

  // Handler for plan upgrade / checkout trigger
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanForPayment(plan);
    setIsPlanModalOpen(false);
    setIsNigerianPaymentModalOpen(true);
  };

  const handleOpenDirectPayment = () => {
    const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === user.planId) || SUBSCRIPTION_PLANS[1];
    setSelectedPlanForPayment(currentPlan);
    setIsNigerianPaymentModalOpen(true);
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
      let replyText = `Ẹ nle o, ${user.memberName.split(' ')[0]}. I've noted this in your Heart Home Health clinical chart. Our community health officer is at your service. How else can our medical desk support you in ${user.community || 'Fiditi'} today?`;
      let actionTag: SupportChatMessage['actionTag'] = undefined;

      if (lower.includes('fasting') || lower.includes('coffee') || lower.includes('water') || lower.includes('breakfast') || lower.includes('ogi')) {
        replyText = "For tomorrow's annual blood screening in Fiditi, clean drinking water is strongly encouraged to keep your veins hydrated for Nurse Bukola. Please avoid heavy food, pap (ogi), tea or coffee for 10 hours prior to ensure optimal lipid and glucose accuracy.";
        actionTag = { label: 'View Appointment Checklist', tab: 'checks' };
      } else if (lower.includes('refill') || lower.includes('inhaler') || lower.includes('medication') || lower.includes('malaria') || lower.includes('coartem')) {
        replyText = "Your plan covers express motorcycle courier delivery for essential drugs including Coartem malaria therapy and antihypertensives with ₦0 copay. You can track your dispatch right in your Rx portal.";
        actionTag = { label: 'Track Medication Delivery', tab: 'pharmacy' };
      } else if (lower.includes('ambulance') || lower.includes('emergency') || lower.includes('chest') || lower.includes('pain') || lower.includes('sos') || lower.includes('okada')) {
        replyText = "If you or your family member has severe chest pain, breathing difficulty, or maternal distress, tap Emergency SOS immediately. Our 4x4 rural mobile unit and motorcycle health escort are stationed nearby.";
        actionTag = { label: 'Open Emergency SOS Console', tab: 'emergency' };
      } else if (lower.includes('doctor') || lower.includes('consult') || lower.includes('video') || lower.includes('clinic') || lower.includes('hospital')) {
        replyText = "Dr. Folashade Adeyemi is on call for rural consultations. You can also search accredited Primary Healthcare Centres in Afijio LGA using our Google Maps grounded tool.";
        actionTag = { label: 'Find Nearby Health Centres', tab: 'facilities' };
      } else if (lower.includes('pay') || lower.includes('naira') || lower.includes('ussd') || lower.includes('bank') || lower.includes('transfer') || lower.includes('pos')) {
        replyText = `You can pay or renew your annual subscription via USSD (*737#, *966#, *901#, *894#), instant NIP bank transfer to our dedicated virtual account, or cash at any village POS kiosk.`;
        actionTag = { label: 'Open Nigerian Payment Checkout', tab: 'overview' };
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
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-rose-100 selection:text-rose-900 ${activeTheme.classNames.bodyBg}`}
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
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPayment={handleOpenDirectPayment}
        onOpenTerms={() => setIsTermsModalOpen(true)}
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
            onOpenPayment={handleOpenDirectPayment}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenTerms={() => setIsTermsModalOpen(true)}
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

        {activeTab === 'facilities' && (
          <RuralFacilityLocator user={user} />
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

        {activeTab === 'terms' && (
          <TermsModal
            isOpen={true}
            isStandaloneTab={true}
            onClose={() => setActiveTab('overview')}
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

      {/* Annual Subscription Plans & Benefits Modal (₦) */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        currentUser={user}
        onSelectPlan={handleSelectPlan}
      />

      {/* Native Nigerian Payment Modal (USSD, NIP Bank Transfer, POS Cash Voucher, Verve Card) */}
      <NigerianPaymentModal
        isOpen={isNigerianPaymentModalOpen}
        onClose={() => setIsNigerianPaymentModalOpen(false)}
        selectedPlan={selectedPlanForPayment}
        user={user}
        onPaymentSuccess={(updatedUser) => {
          setUser(updatedUser);
        }}
        onOpenTerms={() => setIsTermsModalOpen(true)}
      />

      {/* Rural Nigerian Subscriber Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onUserUpdate={(updatedUser) => {
          setUser(updatedUser);
        }}
        onOpenPlans={() => {
          setIsAuthModalOpen(false);
          setIsPlanModalOpen(true);
        }}
        onOpenTerms={() => setIsTermsModalOpen(true)}
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

      {/* Rights of Use, Medical Disclaimer & Terms Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        user={user}
      />
    </div>
  );
}
