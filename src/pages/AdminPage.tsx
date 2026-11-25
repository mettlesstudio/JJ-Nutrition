import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Video,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Bell,
  Download,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  DollarSign,
  ChevronDown,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { IMAGES } from '../assets/images';

export interface PatientAppointment {
  id: string;
  ref: string;
  patientName: string;
  age: number;
  email: string;
  phone: string;
  conditionProtocol: string;
  tierName: string;
  duration: string;
  dateTime: string;
  timeSlot: string;
  fee: string;
  currency: string;
  timezone: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  chiefComplaints: string;
  medicationsAndSupplements: string;
  screeningNote: string;
  allergies: string;
  clinicalNotes: string;
}

const INITIAL_PATIENTS: PatientAppointment[] = [
  {
    id: 'p1',
    ref: 'JJN-2026-1042',
    patientName: 'Eleanor Vance',
    age: 46,
    email: 'eleanor.vance@example.com',
    phone: '+61 412 884 102',
    conditionProtocol: 'Heart Health Combo',
    tierName: 'Standard Consultation',
    duration: '45 Minutes',
    dateTime: 'Thursday, Nov 12, 2026',
    timeSlot: '10:15 AM',
    fee: '$75 USD',
    currency: 'USD',
    timezone: 'Australia/Sydney (AEST)',
    status: 'Confirmed',
    chiefComplaints: 'Manage elevated triglycerides and mild hypertension naturally alongside low-dose statin therapy.',
    medicationsAndSupplements: 'Atorvastatin 10mg daily, occasional Ibuprofen (screened for gut barrier safety)',
    screeningNote: 'Practitioner Selvi reviews liver enzyme (CYP450 3A4) pathway clearance, statin-induced CoQ10 depletion, and vascular endothelial nitric oxide support.',
    allergies: 'Mild lactose sensitivity, no known pharmaceutical allergies',
    clinicalNotes: 'Baseline lipid panel reviewed. Recommended adding ubiquinol (200mg active form) with morning fats to offset statin mitochondrial drain.',
  },
  {
    id: 'p2',
    ref: 'JJN-2026-1088',
    patientName: 'Asha R.',
    age: 34,
    email: 'asha.r@example.com',
    phone: '+61 405 219 883',
    conditionProtocol: 'Energy Enhancement',
    tierName: 'Quick Consultation',
    duration: '10 Minutes',
    dateTime: 'Friday, Nov 13, 2026',
    timeSlot: '02:45 PM',
    fee: '$5 AUD',
    currency: 'AUD',
    timezone: 'Australia/Sydney (AEST)',
    status: 'Confirmed',
    chiefComplaints: 'Persistent 3 PM brain fog, post-viral mitochondrial lethargy, seeking immediate clarification on CoQ10 vs PQQ synergy.',
    medicationsAndSupplements: 'Multivitamin, Magnesium glycinate 300mg at bedtime',
    screeningNote: 'Practitioner Selvi checks cellular ATP synthesis cofactors, riboflavin-5-phosphate, and adrenal cortisol awakening response.',
    allergies: 'None reported',
    clinicalNotes: 'Advised switching from generic magnesium to high-bioavailability bisglycinate chelate and adding active methylated B-complex before noon.',
  },
  {
    id: 'p3',
    ref: 'JJN-2026-1120',
    patientName: 'Marcus Bennett',
    age: 52,
    email: 'm.bennett@example.com',
    phone: '+1 (555) 392-8190',
    conditionProtocol: 'Ulcer Management & Healing Support',
    tierName: 'Extended Consultation',
    duration: '1 Hour 15 Minutes',
    dateTime: 'Wednesday, Nov 11, 2026',
    timeSlot: '01:30 PM',
    fee: '$150 USD',
    currency: 'USD',
    timezone: 'America/New_York (US Eastern)',
    status: 'Pending',
    chiefComplaints: 'Severe stomach burning after meals, post-H. pylori antibiotic recovery, weaning off long-term omeprazole under gastroenterologist oversight.',
    medicationsAndSupplements: 'Omeprazole 20mg twice daily, Gaviscon liquid',
    screeningNote: 'Practitioner Selvi checks for liver enzyme (CYP450) competition, rebound acid hypersecretion risk, and mucosal lining demulcent cofactors (Zinc Carnosine, DGL).',
    allergies: 'Tree nuts (severe anaphylaxis - avoid almond/walnut extracts)',
    clinicalNotes: 'Formulated gentle mucosal barrier recovery roadmap. Zinc carnosine 75mg bid on empty stomach, deglycyrrhizinated licorice (DGL) chewables 20 min prior to meals.',
  },
  {
    id: 'p4',
    ref: 'JJN-2026-0954',
    patientName: 'Sophie Davies',
    age: 29,
    email: 'sophie.davies@example.com',
    phone: '+61 428 901 342',
    conditionProtocol: 'Iron Deficiency / Anaemia',
    tierName: 'Standard Consultation',
    duration: '45 Minutes',
    dateTime: 'Monday, Nov 09, 2026',
    timeSlot: '11:30 AM',
    fee: '$75 USD',
    currency: 'USD',
    timezone: 'Australia/Sydney (AEST)',
    status: 'Completed',
    chiefComplaints: 'Serum ferritin at 11 ug/L, chronic air hunger and hair thinning, severe GI cramping from traditional ferrous sulfate tablets.',
    medicationsAndSupplements: 'Ferrous sulfate 325mg (discontinued due to severe nausea/constipation)',
    screeningNote: 'Practitioner Selvi checks hepcidin-mediated iron absorption blocks, copper/ceruloplasmin status, and non-constipating amino acid chelate delivery.',
    allergies: 'Gluten sensitivity (non-celiac)',
    clinicalNotes: 'Transitioned to Iron Bisglycinate Chelate 24mg combined with liposomal Vitamin C and lactoferrin taken away from coffee and calcium.',
  },
];

interface AdminPageProps {
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('info@jjnutrition.com.au');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [keepActive, setKeepActive] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [patients, setPatients] = useState<PatientAppointment[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p3'); // Marcus Bennett by default
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [isTelehealthModalOpen, setIsTelehealthModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Email notifications settings state
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(true);
  const [notifyDirectCalendar, setNotifyDirectCalendar] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Please enter practitioner email');
      return;
    }
    setIsLoggingIn(true);
    setLoginError('');
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsAuthenticated(true);
      showToast('Welcome back, Practitioner Selvi');
    }, 600);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    showToast('Signed out of Clinical Portal');
  };

  // Filtered patients list
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        patient.patientName.toLowerCase().includes(q) ||
        patient.ref.toLowerCase().includes(q) ||
        patient.conditionProtocol.toLowerCase().includes(q) ||
        patient.email.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [patients, statusFilter, searchQuery]);

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Update selected patient's status
  const handleUpdateStatus = (newStatus: PatientAppointment['status']) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? { ...p, status: newStatus } : p))
    );
    showToast(`Appointment status updated to ${newStatus}`);
  };

  // Update notes
  const handleNotesChange = (text: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? { ...p, clinicalNotes: text } : p))
    );
  };

  const handleSaveNotes = () => {
    setIsNotesSaved(true);
    showToast('Clinical notes securely saved to practice database');
    setTimeout(() => setIsNotesSaved(false), 2400);
  };

  // Export CSV mock handler
  const handleExportCSV = () => {
    const headers = ['Reference,Patient Name,Condition Protocol,Status,Date,Time,Fee,Email,Phone\n'];
    const rows = patients.map(
      (p) =>
        `"${p.ref}","${p.patientName}","${p.conditionProtocol}","${p.status}","${p.dateTime}","${p.timeSlot}","${p.fee}","${p.email}","${p.phone}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JJ-Nutrition-Appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported 4 appointment records to CSV');
  };

  // KPI Calculations
  const totalBookings = patients.length;
  const upcomingBookings = patients.filter((p) => p.status === 'Confirmed').length;
  const pendingBookings = patients.filter((p) => p.status === 'Pending').length;
  const totalFeesUSD = '$305';

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[#FAF9F6] text-[#10243D] selection:bg-[#044AA3] selection:text-white relative overflow-x-hidden font-montserrat"
      style={{
        backgroundImage: `linear-gradient(rgba(250, 249, 246, 0.75), rgba(250, 249, 246, 0.75)), url('/white-wall-textures.webp')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto, 750px 750px',
      }}
    >
      {/* Subtle DNA Pattern Backdrop */}
      <div
        className="absolute top-0 left-0 right-0 h-[480px] pointer-events-none select-none opacity-20 z-0"
        style={{
          backgroundImage: `url('/dnapattern.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />

      {/* Ambient Blue Radial Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#044AA3]/10 blur-[120px] rounded-full pointer-events-none select-none z-0"
        aria-hidden="true"
      />

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#10243D] text-white px-5 py-2.5 rounded-full shadow-[0_8px_28px_rgba(16,36,61,0.28)] flex items-center gap-2.5 text-xs sm:text-sm font-medium border border-white/15"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* VIEW A: PRACTITIONER LOGIN PAGE                                      */}
      {/* ===================================================================== */}
      {!isAuthenticated ? (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 min-h-screen">
          {/* Top Bar with Link Back to Main Website */}
          <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#555555] hover:text-[#044AA3] bg-white/80 hover:bg-white px-4 py-2 rounded-full border border-[#CDE0F3] shadow-2xs transition-all cursor-pointer select-none group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to JJ Nutrition</span>
            </button>

            <span className="text-[11px] font-mono font-medium text-[#555555] tracking-wider uppercase bg-[#EBF2FA] px-3 py-1 rounded-full border border-[#CDE0F3]">
              PORTAL BUILD // 2026.11
            </span>
          </div>

          {/* Centered Glass / Elevated Login Card */}
          <div className="w-full max-w-md mx-auto my-auto py-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/95 backdrop-blur-xl border border-[#CDE0F3] rounded-3xl p-6 sm:p-8 md:p-9 shadow-[0_24px_60px_rgba(16,36,61,0.12)] relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#044AA3] via-[#38BDF8] to-[#044AA3]" />

              {/* Brand Emblem & Header Lockup */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#EBF2FA] border border-[#CDE0F3] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <img
                    src={IMAGES.brandLogo}
                    alt="JJ Nutrition Emblem"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 bg-[#EBF2FA] text-[#044AA3] text-[10.5px] font-semibold tracking-wider uppercase px-3 py-0.5 rounded-full border border-[#CDE0F3] mb-2">
                  <Lock className="w-3 h-3 text-[#044AA3]" />
                  <span>Admin & Clinical Portal</span>
                </div>

                <h1 className="font-heading font-medium italic text-2xl sm:text-3xl text-[#10243D] leading-tight mb-1">
                  Practitioner Sign In
                </h1>
                <p className="text-xs sm:text-sm text-[#555555] font-normal leading-relaxed">
                  Restricted clinical workspace for Practitioner Selvi, RDN.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-[#10243D] uppercase tracking-wider mb-1.5">
                    Practitioner Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="info@jjnutrition.com.au"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDE0F3] text-sm text-[#10243D] bg-white placeholder:text-[#555555]/40 focus:outline-none focus:border-[#044AA3] focus:ring-2 focus:ring-[#044AA3]/15 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field with Eye Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#10243D] uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => showToast('Password reset link dispatched to recovery channel')}
                      className="text-xs text-[#044AA3] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter clinical password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#CDE0F3] text-sm text-[#10243D] bg-white placeholder:text-[#555555]/40 focus:outline-none focus:border-[#044AA3] focus:ring-2 focus:ring-[#044AA3]/15 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555555] hover:text-[#10243D] cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Keep Active Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={keepActive}
                      onChange={(e) => setKeepActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#044AA3] focus:ring-[#044AA3] border-[#CDE0F3] cursor-pointer"
                    />
                    <span className="text-xs text-[#555555]">Keep session active on this device</span>
                  </label>
                </div>

                {/* Submit Primary CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full h-12 rounded-full bg-[#044AA3] hover:bg-[#033A82] text-white font-montserrat text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(4,74,163,0.32)] hover:shadow-[0_6px_22px_rgba(3,58,130,0.42)] transition-all cursor-pointer active:scale-[0.98] disabled:opacity-70"
                  >
                    {isLoggingIn ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <span>Access Clinical Portal</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom Security Notice */}
              <div className="mt-6 pt-5 border-t border-[#CDE0F3] text-center">
                <span className="text-[11px] text-[#555555] flex items-center justify-center gap-1.5 leading-snug">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>256-Bit SSL Encrypted Intake • HIPAA & Privacy Compliant</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <div className="w-full text-center text-xs text-[#555555]">
            JJ Nutrition Clinical Telehealth Platform · Practitioner Portal
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* VIEW B: PRACTITIONER CLINICAL APPOINTMENT DASHBOARD                  */
        /* ===================================================================== */
        <div className="relative z-10 flex-1 flex flex-col min-h-screen">
          {/* 1. TOP PORTAL HEADER BAR */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CDE0F3] px-4 sm:px-6 lg:px-8 py-3.5 transition-all shadow-xs">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Left Brand Lockup & Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EBF2FA] border border-[#CDE0F3] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <img
                    src={IMAGES.brandLogo}
                    alt="JJ Nutrition Logo"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading font-medium italic text-lg sm:text-xl text-[#10243D] leading-tight">
                      Practitioner Appointment Inbox
                    </h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#EBF2FA] text-[#044AA3] border border-[#CDE0F3]">
                      Admin: Practitioner Selvi, RDN
                    </span>
                  </div>
                  <p className="text-xs text-[#555555] font-normal">
                    Live patient intake dashboard · Direct notifications to{' '}
                    <strong className="text-[#10243D]">info@jjnutrition.com.au</strong>
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-2.5 self-end md:self-auto">
                <button
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#CDE0F3] bg-white hover:bg-[#F4F8FC] text-xs font-medium text-[#10243D] transition-all cursor-pointer shadow-2xs"
                  title="Configure alert notification channels"
                >
                  <Bell className="w-3.5 h-3.5 text-[#044AA3]" />
                  <span className="hidden sm:inline">Notification Channels</span>
                  <span className="sm:hidden">Alerts</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#CDE0F3] bg-white hover:bg-[#F4F8FC] text-xs font-medium text-[#10243D] transition-all cursor-pointer shadow-2xs"
                  title="Export all intake records to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-[#044AA3]" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-medium text-red-700 transition-all cursor-pointer shadow-2xs"
                  title="Sign out of the practitioner portal"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </header>

          {/* MAIN WORKSPACE BODY */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* 2. KPI OVERVIEW STRIP & FILTER CONTROLS */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#CDE0F3] p-4 sm:p-5 shadow-xs space-y-4">
              {/* Upper: KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3.5 rounded-xl bg-[#F4F8FC]/80 border border-[#CDE0F3] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider block">
                      Total Bookings
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#10243D]">
                      {totalBookings}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#CDE0F3] flex items-center justify-center text-[#044AA3]">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F8FC]/80 border border-[#CDE0F3] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider block">
                      Upcoming
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#044AA3]">
                      {upcomingBookings}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#CDE0F3] flex items-center justify-center text-[#044AA3]">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F8FC]/80 border border-[#CDE0F3] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider block">
                      Total Fees
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-emerald-700">
                      {totalFeesUSD}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#CDE0F3] flex items-center justify-center text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F8FC]/80 border border-[#CDE0F3] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider block">
                      Pending Action
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-amber-600">
                      {pendingBookings}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#CDE0F3] flex items-center justify-center text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Lower: Filter Pills and Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#CDE0F3]">
                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs font-semibold text-[#555555] mr-1 hidden sm:inline">
                    Filter:
                  </span>
                  {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((status) => {
                    const isSelected = statusFilter === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#044AA3] text-white shadow-xs'
                            : 'bg-[#F4F8FC] text-[#555555] hover:text-[#10243D] border border-[#CDE0F3]'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient, ref, condition..."
                    className="w-full pl-9 pr-3.5 py-1.5 rounded-full border border-[#CDE0F3] text-xs sm:text-sm bg-white text-[#10243D] placeholder:text-[#555555]/50 focus:outline-none focus:border-[#044AA3] focus:ring-1 focus:ring-[#044AA3]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555555] hover:text-[#10243D]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 3. MASTER-DETAIL SPLIT CLINICAL WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Patient Appointment Queue (5 cols) */}
              <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl border border-[#CDE0F3] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#CDE0F3]">
                  <h3 className="font-heading font-medium italic text-base text-[#10243D]">
                    Patient Queue ({filteredPatients.length})
                  </h3>
                  <span className="text-[11px] text-[#555555]">
                    Ordered by session time
                  </span>
                </div>

                {/* Patient Cards List */}
                <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
                  {filteredPatients.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#555555]">
                      No appointments match this filter.
                    </div>
                  ) : (
                    filteredPatients.map((patient) => {
                      const isSelected = patient.id === selectedPatient.id;
                      const isPending = patient.status === 'Pending';
                      const isConfirmed = patient.status === 'Confirmed';
                      const isCompleted = patient.status === 'Completed';

                      return (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => setSelectedPatientId(patient.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                            isSelected
                              ? 'border-[#044AA3] bg-[#EBF2FA] shadow-xs ring-1 ring-[#044AA3]'
                              : 'border-[#CDE0F3] bg-white hover:bg-[#F4F8FC] hover:border-[#044AA3]/50'
                          }`}
                        >
                          {/* Top Row: Ref & Status Badge */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[11px] font-semibold text-[#555555]">
                              {patient.ref}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isPending
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : isConfirmed
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : isCompleted
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                              }`}
                            >
                              {patient.status}
                            </span>
                          </div>

                          {/* Patient Name */}
                          <h4 className="font-montserrat text-sm font-semibold text-[#10243D] leading-snug">
                            {patient.patientName}
                          </h4>

                          {/* Condition Protocol */}
                          <p className="text-xs text-[#044AA3] font-medium truncate mt-0.5">
                            {patient.conditionProtocol}
                          </p>

                          {/* Bottom Row: Time and Fee */}
                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#CDE0F3]/70 text-[11px] text-[#555555]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#044AA3]" />
                              {patient.timeSlot}
                            </span>
                            <span className="font-semibold text-[#10243D]">
                              {patient.fee}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Selected Patient Dossier & Action Workspace (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Patient & Booking Header Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#CDE0F3] p-5 sm:p-6 shadow-xs space-y-4">
                  {/* Top: Ref, Name, Status Dropdown & Telehealth Call */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#CDE0F3]">
                    <div>
                      <span className="font-mono text-xs text-[#555555] block">
                        Booking Reference: <strong className="text-[#10243D]">{selectedPatient.ref}</strong>
                      </span>
                      <h2 className="font-heading font-medium italic text-2xl sm:text-3xl text-[#10243D] leading-tight mt-0.5">
                        {selectedPatient.patientName}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {/* Interactive Status Selector */}
                      <div className="relative">
                        <select
                          value={selectedPatient.status}
                          onChange={(e) => handleUpdateStatus(e.target.value as any)}
                          className="pl-3 pr-8 py-2 rounded-xl border border-[#CDE0F3] text-xs font-semibold bg-white text-[#10243D] appearance-none cursor-pointer focus:outline-none focus:border-[#044AA3]"
                        >
                          <option value="Pending">Pending Confirmation</option>
                          <option value="Confirmed">Confirmed / Upcoming</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#555555] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Primary Telehealth Call CTA */}
                      <button
                        type="button"
                        onClick={() => setIsTelehealthModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#044AA3] hover:bg-[#033A82] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer select-none active:scale-[0.98]"
                      >
                        <Video className="w-4 h-4" />
                        <span className="hidden sm:inline">Start Telehealth Call</span>
                        <span className="sm:hidden">Call</span>
                      </button>
                    </div>
                  </div>

                  {/* 4-Item Metadata Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F4F8FC]/70 p-3 rounded-xl border border-[#CDE0F3] text-xs">
                    <div>
                      <span className="text-[10.5px] uppercase text-[#555555] block">Consultation Tier</span>
                      <span className="font-semibold text-[#10243D] block">{selectedPatient.tierName}</span>
                      <span className="text-[10px] text-[#555555]">{selectedPatient.duration}</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase text-[#555555] block">Date & Time</span>
                      <span className="font-semibold text-[#10243D] block">{selectedPatient.timeSlot}</span>
                      <span className="text-[10px] text-[#555555]">{selectedPatient.dateTime}</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase text-[#555555] block">Fee Paid</span>
                      <span className="font-semibold text-emerald-700 block">{selectedPatient.fee}</span>
                      <span className="text-[10px] text-[#555555] truncate block">{selectedPatient.timezone}</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase text-[#555555] block">Patient Age</span>
                      <span className="font-semibold text-[#10243D] block">{selectedPatient.age} years</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Verified Identity</span>
                    </div>
                  </div>

                  {/* Clickable Email & Phone row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#044AA3]">
                    <a
                      href={`mailto:${selectedPatient.email}`}
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#555555]" />
                      <span>{selectedPatient.email}</span>
                    </a>
                    <a
                      href={`tel:${selectedPatient.phone}`}
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#555555]" />
                      <span>{selectedPatient.phone}</span>
                    </a>
                  </div>
                </div>

                {/* 2. Clinical Intake Dossier Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#CDE0F3] p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#CDE0F3]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#044AA3]" />
                      <span className="text-xs font-semibold text-[#044AA3] uppercase tracking-wider">
                        Clinical Intake Dossier
                      </span>
                    </div>
                    <span className="text-[11px] text-[#555555]">
                      Confidential Patient Medical Evaluation
                    </span>
                  </div>

                  {/* Selected Condition Protocol */}
                  <div>
                    <span className="text-[11px] text-[#555555] uppercase block">Selected Condition Protocol:</span>
                    <h3 className="font-heading font-medium italic text-xl text-[#10243D]">
                      {selectedPatient.conditionProtocol}
                    </h3>
                  </div>

                  {/* Primary Health Goal / Chief Complaints */}
                  <div className="bg-[#F4F8FC] p-3.5 rounded-xl border border-[#CDE0F3] space-y-1">
                    <span className="text-xs font-semibold text-[#10243D] block">
                      Primary Health Goal / Chief Complaints:
                    </span>
                    <p className="text-xs text-[#555555] leading-relaxed">
                      {selectedPatient.chiefComplaints}
                    </p>
                  </div>

                  {/* Current Medications & Supplements Safety Screening Box (Warm Amber) */}
                  <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/90 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span>Current Medications & Supplements (Drug-Nutrient Safety Screening):</span>
                    </div>
                    <p className="text-xs font-medium text-amber-950">
                      {selectedPatient.medicationsAndSupplements}
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed italic">
                      *{selectedPatient.screeningNote}
                    </p>
                  </div>

                  {/* Known Allergies / Intolerances */}
                  <div className="text-xs text-[#555555] pt-1">
                    <strong className="text-[#10243D]">Known Allergies / Food Intolerances:</strong>{' '}
                    <span>{selectedPatient.allergies}</span>
                  </div>
                </div>

                {/* 3. Practitioner Selvi's Private Clinical Notes & Protocol Assignment Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#CDE0F3] p-5 sm:p-6 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#044AA3]" />
                      <h4 className="font-montserrat text-sm font-semibold text-[#10243D]">
                        Practitioner Selvi's Private Clinical Notes & Protocol Assignment
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#555555]">
                      Private & Encrypted
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={selectedPatient.clinicalNotes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Record patient biochemical observations, lab test review notes, recommended supplement dosages, or follow-up milestones here..."
                    className="w-full p-3.5 rounded-xl border border-[#CDE0F3] text-xs sm:text-sm text-[#10243D] bg-white placeholder:text-[#555555]/40 focus:outline-none focus:border-[#044AA3] focus:ring-2 focus:ring-[#044AA3]/15 transition-all font-montserrat leading-relaxed"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#555555]">
                      Notes are saved securely to the practice database.
                    </span>

                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#044AA3] hover:bg-[#033A82] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                    >
                      {isNotesSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Saved to Database</span>
                        </>
                      ) : (
                        <span>Save Clinical Notes</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* TELEHEALTH LAUNCH MODAL */}
          <AnimatePresence>
            {isTelehealthModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsTelehealthModalOpen(false)}
                  className="fixed inset-0 bg-[#10243D]/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-lg bg-white rounded-2xl border border-[#CDE0F3] p-6 shadow-xl z-10 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#CDE0F3]">
                    <div className="flex items-center gap-2 text-[#044AA3]">
                      <Video className="w-5 h-5" />
                      <h3 className="font-heading font-medium italic text-lg text-[#10243D]">
                        Start Telehealth Session
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsTelehealthModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-[#F4F8FC] flex items-center justify-center text-[#555555] hover:text-[#10243D]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-[#555555]">
                    <p>
                      Initiating encrypted 1-on-1 telehealth room for{' '}
                      <strong className="text-[#10243D]">{selectedPatient.patientName}</strong> ({selectedPatient.ref}).
                    </p>
                    <div className="p-3 bg-[#F4F8FC] rounded-xl border border-[#CDE0F3] font-mono text-[11px] text-[#10243D] space-y-1">
                      <div><strong>Room ID:</strong> jjn-clinical-{selectedPatient.ref.toLowerCase()}</div>
                      <div><strong>Patient:</strong> {selectedPatient.email}</div>
                      <div><strong>Encryption:</strong> AES-256 WebRTC Direct Stream</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => setIsTelehealthModalOpen(false)}
                      className="px-4 py-2 rounded-full border border-[#CDE0F3] text-xs font-medium text-[#555555] hover:bg-[#F4F8FC]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setIsTelehealthModalOpen(false);
                        showToast(`Telehealth room launched for ${selectedPatient.patientName}`);
                      }}
                      className="px-5 py-2 rounded-full bg-[#044AA3] text-white text-xs font-semibold shadow-xs hover:bg-[#033A82] flex items-center gap-1.5"
                    >
                      <Video className="w-4 h-4" />
                      <span>Launch Video Call Now</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* NOTIFICATION CHANNELS MODAL */}
          <AnimatePresence>
            {isNotificationModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="fixed inset-0 bg-[#10243D]/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-md bg-white rounded-2xl border border-[#CDE0F3] p-6 shadow-xl z-10 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#CDE0F3]">
                    <div className="flex items-center gap-2 text-[#044AA3]">
                      <Bell className="w-5 h-5" />
                      <h3 className="font-heading font-medium italic text-lg text-[#10243D]">
                        Practitioner Notification Channels
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsNotificationModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-[#F4F8FC] flex items-center justify-center text-[#555555] hover:text-[#10243D]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <label className="flex items-start justify-between p-3 rounded-xl border border-[#CDE0F3] bg-[#F4F8FC] cursor-pointer">
                      <div>
                        <strong className="text-[#10243D] block">Email Intake Alerts</strong>
                        <span className="text-[#555555]">Dispatches instant copy of patient intake to info@jjnutrition.com.au</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#044AA3] rounded"
                      />
                    </label>

                    <label className="flex items-start justify-between p-3 rounded-xl border border-[#CDE0F3] bg-[#F4F8FC] cursor-pointer">
                      <div>
                        <strong className="text-[#10243D] block">Mobile SMS Alerts</strong>
                        <span className="text-[#555555]">Urgent notifications for cancellations or reschedule requests to +61 412 884 102</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifySMS}
                        onChange={(e) => setNotifySMS(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#044AA3] rounded"
                      />
                    </label>

                    <label className="flex items-start justify-between p-3 rounded-xl border border-[#CDE0F3] bg-[#F4F8FC] cursor-pointer">
                      <div>
                        <strong className="text-[#10243D] block">Direct Google / Outlook Calendar Sync</strong>
                        <span className="text-[#555555]">Automatically syncs confirmed bookings into Practitioner Selvi's calendar</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifyDirectCalendar}
                        onChange={(e) => setNotifyDirectCalendar(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#044AA3] rounded"
                      />
                    </label>
                  </div>

                  <div className="pt-2 text-right">
                    <button
                      onClick={() => {
                        setIsNotificationModalOpen(false);
                        showToast('Notification channels updated successfully');
                      }}
                      className="px-5 py-2 rounded-full bg-[#044AA3] text-white text-xs font-semibold hover:bg-[#033A82]"
                    >
                      Done & Save Channels
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
