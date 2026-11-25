import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Globe,
  Check,
  ChevronRight,
  ChevronLeft,
  Video,
  ArrowUpRight,
  CreditCard,
  Lock,
  Building2,
  Smartphone,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { CLINICAL_SERVICES, CONSULTATION_TIERS } from '../../data/clinicalData';
import { IMAGES } from '../../assets/images';
import { ReceiptPrinter, type ReceiptPrinterStage } from '../ReceiptPrinter';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialTierId?: string;
}

const STEPS = [
  { num: 1, label: 'Service' },
  { num: 2, label: 'Package' },
  { num: 3, label: 'Schedule' },
  { num: 4, label: 'Details' },
  { num: 5, label: 'Payment' },
  { num: 6, label: 'Receipt' },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialTierId = 'quick-consult',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || CLINICAL_SERVICES[0]?.id || 'cardiovascular-combo'
  );
  const [selectedTierId, setSelectedTierId] = useState<string>(initialTierId);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-12');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [consultFormat, setConsultFormat] = useState<'video' | 'phone'>('video');
  const [patientDetails, setPatientDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Australia (AEST)',
    currentMedications: '',
    healthGoals: '',
    consentAgreed: false,
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('4242 8820 9182 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [cardName, setCardName] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Receipt Printer state
  const [printerStage, setPrinterStage] = useState<ReceiptPrinterStage>('processing');
  const [receiptId] = useState(() => `JJN-${Math.floor(100000 + Math.random() * 900000)}`);

  // Synchronize initial selections when modal opens with specific props
  useEffect(() => {
    if (isOpen) {
      if (initialServiceId) setSelectedServiceId(initialServiceId);
      if (initialTierId) setSelectedTierId(initialTierId);
    }
  }, [isOpen, initialServiceId, initialTierId]);

  // Sync patient name to card holder name as convenient default
  useEffect(() => {
    if (patientDetails.fullName && !cardName) {
      setCardName(patientDetails.fullName);
    }
  }, [patientDetails.fullName, cardName]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPaying) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isPaying]);

  // Automatically drive ReceiptPrinter stages when entering Step 6
  useEffect(() => {
    if (step === 6) {
      setPrinterStage('processing');
      const timer1 = setTimeout(() => {
        setPrinterStage('printing');
      }, 1100);

      const timer2 = setTimeout(() => {
        setPrinterStage('complete');
      }, 3100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [step]);

  const selectedService = CLINICAL_SERVICES.find((s) => s.id === selectedServiceId) || CLINICAL_SERVICES[0];
  const selectedTier = CONSULTATION_TIERS.find((t) => t.id === selectedTierId) || CONSULTATION_TIERS[0];

  // Available Time Slots (AEST)
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
  ];

  // Available upcoming dates
  const availableDates = [
    { date: '2026-11-12', label: 'Thu, Nov 12' },
    { date: '2026-11-13', label: 'Fri, Nov 13' },
    { date: '2026-11-16', label: 'Mon, Nov 16' },
    { date: '2026-11-17', label: 'Tue, Nov 17' },
    { date: '2026-11-18', label: 'Wed, Nov 18' },
  ];

  const handleNext = () => {
    if (step < 6) {
      setDirection(1);
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  const handleBack = () => {
    if (step > 1 && !isPaying) {
      setDirection(-1);
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  const handleExecutePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setDirection(1);
      setStep(6);
    }, 950);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setPrinterStage('processing');
      setIsPaying(false);
    }, 300);
  };

  // Step 4 (Details) validation check
  const isStep4Valid =
    patientDetails.fullName.trim().length > 1 &&
    patientDetails.email.trim().includes('@') &&
    patientDetails.phone.trim().length > 5 &&
    patientDetails.consentAgreed;

  // Directional step transition variants
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 18 : -18,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -18 : 18,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
        {/* Subtle Backdrop with Smooth Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={() => {
            if (!isPaying && step !== 6) handleClose();
          }}
          className="fixed inset-0 bg-[#10243D]/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-booking-title"
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-[0_24px_70px_rgba(16,36,61,0.18)] border border-[#CDE0F3] overflow-hidden z-10 flex flex-col h-[94dvh] sm:h-[88vh] max-h-[94dvh] sm:max-h-[850px]"
        >
          {/* ============================================================== */}
          {/* 1. CLEAN COMPACT HEADER (Fixed ~64-72px)                      */}
          {/* ============================================================== */}
          <div className="h-16 sm:h-[72px] px-4 sm:px-6 md:px-8 flex items-center justify-between border-b border-[#CDE0F3] bg-white flex-shrink-0 z-20">
            {/* Left: JJ Nutrition Brand Lockup */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 mr-3">
              <img
                src={IMAGES.brandLogo}
                alt="JJ Nutrition Logo"
                className="h-[30px] sm:h-[34px] md:h-[36px] w-[30px] sm:w-[34px] md:w-[36px] object-contain flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <span className="font-montserrat text-[15.5px] sm:text-[17px] font-normal text-[#111827] whitespace-nowrap truncate">
                  JJ Nutrition
                </span>
                <span className="hidden md:inline-block w-px h-3.5 bg-[#CDE0F3] flex-shrink-0" />
                <span className="hidden md:inline-block font-montserrat text-xs text-[#555555] whitespace-nowrap truncate">
                  Clinical Telehealth Booking
                </span>
              </div>
            </div>

            {/* Right: Minimal Close Icon aligned to far right */}
            <button
              type="button"
              disabled={isPaying}
              onClick={handleClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F4F8FC] hover:bg-[#E6EEF8] text-[#555555] hover:text-[#111827] flex items-center justify-center transition-colors cursor-pointer border border-[#CDE0F3] flex-shrink-0 ml-auto focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-40"
              aria-label="Close booking modal"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2} />
            </button>
          </div>

          {/* ============================================================== */}
          {/* 2. REFINED 6-STEP PROGRESS INDICATOR                           */}
          {/* ============================================================== */}
          {/* Desktop & iPad Horizontal Stepper */}
          <div className="hidden sm:flex items-center justify-between px-6 sm:px-8 py-2.5 sm:py-3 bg-[#F4F8FC]/70 border-b border-[#CDE0F3] flex-shrink-0">
            {STEPS.map((s, idx) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;

              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-montserrat transition-all duration-300 ${
                        isCompleted
                          ? 'bg-accent/15 text-accent font-semibold border border-accent/30'
                          : isCurrent
                          ? 'bg-accent text-white font-semibold shadow-xs'
                          : 'bg-white text-[#555555] border border-[#CDE0F3]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={2.2} /> : s.num}
                    </span>
                    <span
                      className={`font-montserrat text-xs transition-colors duration-200 ${
                        isCurrent
                          ? 'font-medium text-[#111827]'
                          : isCompleted
                          ? 'font-normal text-[#111827]'
                          : 'font-normal text-[#555555]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-2 lg:mx-3 transition-colors duration-300 ${
                        step > s.num ? 'bg-accent/40' : 'bg-[#CDE0F3]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile Stepper & Progress Bar */}
          <div className="flex sm:hidden flex-col bg-[#F4F8FC]/70 border-b border-[#CDE0F3] flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs font-semibold">
                  {step}
                </span>
                <span className="font-montserrat text-sm font-medium text-[#111827]">
                  {STEPS[step - 1].label}
                </span>
              </div>
              <span className="font-montserrat text-xs text-[#555555]">
                Step {step} of 6
              </span>
            </div>
            {/* Smooth progress track */}
            <div className="w-full h-0.5 bg-[#CDE0F3]">
              <motion.div
                className="h-full bg-accent"
                initial={false}
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. SCROLLABLE STEP CONTENT WITH DIRECTIONAL FRAMER MOTION      */}
          {/* ============================================================== */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-7 relative overscroll-contain">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={shouldReduceMotion ? undefined : stepVariants}
                initial={shouldReduceMotion ? undefined : 'enter'}
                animate={shouldReduceMotion ? undefined : 'center'}
                exit={shouldReduceMotion ? undefined : 'exit'}
                className="space-y-6"
              >
                {/* -------------------------------------------------------- */}
                {/* STEP 1: SERVICE (10 Clinical Protocols)                  */}
                {/* -------------------------------------------------------- */}
                {step === 1 && (
                  <div>
                    {/* Section Heading */}
                    <div className="mb-5 sm:mb-6">
                      <h3
                        id="modal-booking-title"
                        className="font-heading font-medium italic text-xl sm:text-2xl text-[#111827] leading-tight mb-1.5"
                      >
                        Choose Your Clinical Focus
                      </h3>
                      <p className="font-montserrat text-sm text-[#555555] font-normal leading-relaxed">
                        Select the targeted health protocol you would like to address with Practitioner Selvi.
                      </p>
                    </div>

                    {/* 10 Clinical Protocol Cards in Clean 2-Column Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CLINICAL_SERVICES.map((service) => {
                        const isSelected = selectedServiceId === service.id;

                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => setSelectedServiceId(service.id)}
                            className={`group p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                              isSelected
                                ? 'border-accent bg-[#EBF2FA] shadow-2xs ring-1 ring-accent'
                                : 'border-[#CDE0F3] bg-white hover:border-accent/50 hover:bg-[#F4F8FC]/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span
                                className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${
                                  isSelected
                                    ? 'bg-accent/15 text-accent'
                                    : 'bg-[#F4F8FC] text-[#555555] group-hover:text-accent'
                                }`}
                              >
                                {service.number}
                              </span>

                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-accent text-white scale-100'
                                    : 'border border-[#CDE0F3] opacity-0 group-hover:opacity-100 scale-90'
                                }`}
                              >
                                <Check className="w-3 h-3" strokeWidth={2.5} />
                              </div>
                            </div>

                            <h4 className="font-montserrat text-sm sm:text-[15px] font-medium text-[#111827] mb-1 leading-snug">
                              {service.title}
                            </h4>

                            <p className="font-montserrat text-xs text-[#555555] leading-relaxed line-clamp-2">
                              {service.tagline}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 2: PACKAGE (3 Consultation Packages / Tiers)        */}
                {/* -------------------------------------------------------- */}
                {step === 2 && (
                  <div>
                    {/* Section Heading */}
                    <div className="mb-5 sm:mb-6">
                      <h3 className="font-heading font-medium italic text-xl sm:text-2xl text-[#111827] leading-tight mb-1.5">
                        Select Consultation Package
                      </h3>
                      <p className="font-montserrat text-sm text-[#555555] font-normal leading-relaxed">
                        Choose the consultation tier that matches your clinical needs. All packages feature direct 1-on-1 access with Practitioner Selvi.
                      </p>
                    </div>

                    {/* 3 Consultation Tier Cards Side-by-Side */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {CONSULTATION_TIERS.map((tier) => {
                        const isSelected = selectedTierId === tier.id;
                        const isPopular = tier.badge === 'MOST POPULAR';

                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => setSelectedTierId(tier.id)}
                            className={`group rounded-2xl p-4 sm:p-5 border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                              isSelected
                                ? 'border-accent bg-[#EBF2FA] shadow-md ring-2 ring-accent'
                                : 'border-[#CDE0F3] bg-white hover:border-accent/50 hover:bg-[#F4F8FC]/60 shadow-xs'
                            }`}
                          >
                            {/* Popular Pill Badge */}
                            {isPopular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-montserrat font-semibold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-xs">
                                {tier.badge}
                              </div>
                            )}

                            <div>
                              {/* Header: Duration & Selection Check */}
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center gap-1 font-montserrat text-xs text-[#555555]">
                                  <Clock className="w-3.5 h-3.5 text-accent" />
                                  {tier.duration}
                                </span>
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'bg-accent text-white scale-100'
                                      : 'border border-[#CDE0F3] opacity-0 group-hover:opacity-100'
                                  }`}
                                >
                                  <Check className="w-3 h-3" strokeWidth={2.5} />
                                </div>
                              </div>

                              {/* Title */}
                              <h4 className="font-heading font-medium italic text-lg sm:text-xl text-[#111827] mb-1">
                                {tier.name}
                              </h4>

                              {/* Subtitle */}
                              <p className="font-montserrat text-xs text-[#555555] line-clamp-2 mb-3">
                                {tier.subtitle}
                              </p>

                              {/* Price */}
                              <div className="mb-4 pb-3 border-b border-[#CDE0F3]/80 flex items-baseline gap-1.5">
                                <span className="font-montserrat text-2xl font-bold text-[#111827]">
                                  A${tier.priceAUD}
                                </span>
                                <span className="font-montserrat text-xs text-[#555555]">
                                  AUD flat fee
                                </span>
                              </div>

                              {/* Full Inclusions Bullet List */}
                              <div className="space-y-2 mb-2">
                                <span className="block font-montserrat text-[11px] font-semibold uppercase tracking-wider text-[#111827]">
                                  Package Inclusions:
                                </span>
                                <ul className="space-y-1.5">
                                  {tier.features.map((feature, fIdx) => (
                                    <li
                                      key={fIdx}
                                      className="flex items-start gap-2 text-xs font-montserrat text-[#555555] leading-snug"
                                    >
                                      <Check
                                        className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5"
                                        strokeWidth={2.2}
                                      />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="pt-3 mt-3 border-t border-[#CDE0F3]/80 text-center">
                              <span
                                className={`font-montserrat text-xs font-medium inline-block py-1 px-3 rounded-full transition-colors ${
                                  isSelected
                                    ? 'bg-accent text-white'
                                    : 'bg-[#F4F8FC] text-[#555555] group-hover:text-accent'
                                }`}
                              >
                                {isSelected ? 'Selected Package' : 'Click to Select'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 3: SCHEDULE (Date, Time Slot, and Telehealth Format) */}
                {/* -------------------------------------------------------- */}
                {step === 3 && (
                  <div>
                    {/* Section Heading */}
                    <div className="mb-5 sm:mb-6">
                      <h3 className="font-heading font-medium italic text-xl sm:text-2xl text-[#111827] leading-tight mb-1.5">
                        Choose Your Consultation Time
                      </h3>
                      <p className="font-montserrat text-sm text-[#555555] font-normal leading-relaxed">
                        Select a convenient date and time for your telehealth consultation.
                      </p>
                    </div>

                    {/* Date Selector */}
                    <div className="mb-6">
                      <span className="font-montserrat text-sm sm:text-xs font-medium uppercase tracking-wider text-[#111827] block mb-2.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        Available Dates
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {availableDates.map((item) => {
                          const isSelected = selectedDate === item.date;
                          const [weekday, dayMonth] = item.label.split(', ');

                          return (
                            <button
                              key={item.date}
                              type="button"
                              onClick={() => setSelectedDate(item.date)}
                              className={`p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'border-accent bg-accent text-white shadow-xs'
                                  : 'border-[#CDE0F3] bg-white text-[#111827] hover:border-accent/50 hover:bg-[#F4F8FC]/60'
                              }`}
                            >
                              <span
                                className={`block font-montserrat text-xs font-normal mb-0.5 ${
                                  isSelected ? 'text-white/80' : 'text-[#555555]'
                                }`}
                              >
                                {weekday}
                              </span>
                              <span className="block font-montserrat text-sm font-semibold">
                                {dayMonth}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slot Selection */}
                    <div className="mb-6">
                      <span className="font-montserrat text-sm sm:text-xs font-medium uppercase tracking-wider text-[#111827] block mb-2.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        Available Time Slots (AEST)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {timeSlots.map((slot) => {
                          const isSelected = selectedTime === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`py-3 px-4 rounded-2xl border text-center font-montserrat text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                                isSelected
                                  ? 'border-accent bg-[#EBF2FA] text-accent ring-1 ring-accent font-semibold shadow-2xs'
                                  : 'border-[#CDE0F3] bg-white text-[#111827] hover:border-accent/50 hover:bg-[#F4F8FC]/60'
                              }`}
                            >
                              {slot}
                              {isSelected && <Check className="w-3.5 h-3.5 text-accent" strokeWidth={2.5} />}
                            </button>
                          );
                        })}
                      </div>
                      <p className="font-montserrat text-xs text-[#555555] mt-2.5 leading-relaxed">
                        All consultation times are shown in Australian Eastern Standard Time (AEST). Automatic calendar conversions will be included in your confirmation.
                      </p>
                    </div>

                    {/* Telehealth Format */}
                    <div>
                      <span className="font-montserrat text-sm sm:text-xs font-medium uppercase tracking-wider text-[#111827] block mb-2.5 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-accent" />
                        Telehealth Format
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setConsultFormat('video')}
                          className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${
                            consultFormat === 'video'
                              ? 'border-accent bg-[#EBF2FA] shadow-2xs ring-1 ring-accent'
                              : 'border-[#CDE0F3] bg-white hover:border-accent/50 hover:bg-[#F4F8FC]/60'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-white border border-[#CDE0F3] flex items-center justify-center flex-shrink-0 text-accent">
                            <Video className="w-4 h-4 text-accent" strokeWidth={1.85} />
                          </div>
                          <div>
                            <div className="font-montserrat text-sm font-medium text-[#111827] mb-0.5">
                              Secure Video Call
                            </div>
                            <div className="font-montserrat text-xs text-[#555555]">
                              Zoom / Google Meet encrypted link
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setConsultFormat('phone')}
                          className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${
                            consultFormat === 'phone'
                              ? 'border-accent bg-[#EBF2FA] shadow-2xs ring-1 ring-accent'
                              : 'border-[#CDE0F3] bg-white hover:border-accent/50 hover:bg-[#F4F8FC]/60'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-white border border-[#CDE0F3] flex items-center justify-center flex-shrink-0 text-accent">
                            <Phone className="w-4 h-4 text-accent" strokeWidth={1.85} />
                          </div>
                          <div>
                            <div className="font-montserrat text-sm font-medium text-[#111827] mb-0.5">
                              Direct Phone Call
                            </div>
                            <div className="font-montserrat text-xs text-[#555555]">
                              Selvi will call your mobile number
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 4: DETAILS (Clinical Intake & Personal Details)      */}
                {/* -------------------------------------------------------- */}
                {step === 4 && (
                  <div>
                    {/* Section Heading */}
                    <div className="mb-5 sm:mb-6">
                      <h3 className="font-heading font-medium italic text-xl sm:text-2xl text-[#111827] leading-tight mb-1.5">
                        Tell Us About Yourself
                      </h3>
                      <p className="font-montserrat text-sm text-[#555555] font-normal leading-relaxed">
                        Please provide the details needed for Practitioner Selvi to prepare for your clinical consultation.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-montserrat text-sm sm:text-xs font-medium text-[#111827] mb-1.5">
                            Full Legal Name <span className="text-accent">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sarah Jenkins"
                              value={patientDetails.fullName}
                              onChange={(e) =>
                                setPatientDetails({ ...patientDetails, fullName: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDE0F3] text-base sm:text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-montserrat text-sm sm:text-xs font-medium text-[#111827] mb-1.5">
                            Email Address <span className="text-accent">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="email"
                              required
                              placeholder="e.g. sarah@example.com"
                              value={patientDetails.email}
                              onChange={(e) =>
                                setPatientDetails({ ...patientDetails, email: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDE0F3] text-base sm:text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-montserrat text-sm sm:text-xs font-medium text-[#111827] mb-1.5">
                            Contact Phone Number <span className="text-accent">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="e.g. 0416 177 347 or +61..."
                              value={patientDetails.phone}
                              onChange={(e) =>
                                setPatientDetails({ ...patientDetails, phone: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDE0F3] text-base sm:text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-montserrat text-sm sm:text-xs font-medium text-[#111827] mb-1.5">
                            Country / Location
                          </label>
                          <div className="relative">
                            <Globe className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                              value={patientDetails.country}
                              onChange={(e) =>
                                setPatientDetails({ ...patientDetails, country: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDE0F3] text-base sm:text-sm text-[#111827] font-montserrat focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white cursor-pointer"
                            >
                              <option value="Australia (AEST)">Australia (AEST / AEDT)</option>
                              <option value="Australia (AWST)">Australia (AWST - Perth)</option>
                              <option value="New Zealand (NZST)">New Zealand (NZST)</option>
                              <option value="United States (PST/EST)">United States (PST / EST)</option>
                              <option value="United Kingdom (GMT)">United Kingdom (GMT)</option>
                              <option value="Other International">Other International</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-montserrat text-sm sm:text-xs font-medium text-[#111827] mb-1">
                          Current Prescription Medications & Supplements
                        </label>
                        <p className="font-montserrat text-xs text-[#555555] mb-1.5">
                          Crucial for prescription safety screening (e.g. blood thinners, statins, SSRIs, thyroid medication, PPIs).
                        </p>
                        <textarea
                          rows={2}
                          placeholder="List any daily prescription drugs, over-the-counter tablets, or current supplements..."
                          value={patientDetails.currentMedications}
                          onChange={(e) =>
                            setPatientDetails({ ...patientDetails, currentMedications: e.target.value })
                          }
                          className="w-full p-3 rounded-xl border border-[#CDE0F3] text-base sm:text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-montserrat text-sm sm:text-xs font-medium text-[#111827] mb-1">
                          Primary Health Goals & Symptoms
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Briefly describe what you would most like Selvi to address during this consultation..."
                          value={patientDetails.healthGoals}
                          onChange={(e) =>
                            setPatientDetails({ ...patientDetails, healthGoals: e.target.value })
                          }
                          className="w-full p-3 rounded-xl border border-[#CDE0F3] text-base sm:text-sm text-[#111827] font-montserrat placeholder:text-[#555555]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all bg-white"
                        />
                      </div>

                      {/* Consent Checkbox */}
                      <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={patientDetails.consentAgreed}
                            onChange={(e) =>
                              setPatientDetails({ ...patientDetails, consentAgreed: e.target.checked })
                            }
                            className="mt-0.5 w-4 h-4 rounded text-accent focus:ring-accent border-[#CDE0F3] cursor-pointer"
                          />
                          <span className="font-montserrat text-xs text-[#555555] leading-relaxed">
                            I understand that this clinical consultation is conducted by Practitioner Selvi under professional guidelines. I agree to share my health history for nutritional evaluation. All information is kept strictly confidential.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 5: PAYMENT (Summary & Trustworthy Checkout)         */}
                {/* -------------------------------------------------------- */}
                {step === 5 && (
                  <div>
                    {/* Section Heading */}
                    <div className="mb-5 sm:mb-6">
                      <h3 className="font-heading font-medium italic text-xl sm:text-2xl text-[#111827] leading-tight mb-1.5">
                        Secure Payment & Checkout
                      </h3>
                      <p className="font-montserrat text-sm text-[#555555] font-normal leading-relaxed">
                        Review your consultation details and complete payment to confirm your appointment.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* Left: Summary Card (5 cols) */}
                      <div className="lg:col-span-5 bg-[#F4F8FC]/80 border border-[#CDE0F3] rounded-2xl p-4 sm:p-5 space-y-3.5">
                        <div className="flex items-center justify-between pb-2.5 border-b border-[#CDE0F3]">
                          <span className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#111827]">
                            Booking Summary
                          </span>
                          <span className="font-montserrat text-[11px] text-accent font-medium px-2 py-0.5 rounded-full bg-accent/10">
                            Verified Practitioner
                          </span>
                        </div>

                        <div>
                          <span className="block font-montserrat text-[11px] text-[#555555] uppercase">
                            Clinical Protocol
                          </span>
                          <span className="font-montserrat text-sm font-medium text-[#111827]">
                            {selectedService.title}
                          </span>
                        </div>

                        <div>
                          <span className="block font-montserrat text-[11px] text-[#555555] uppercase">
                            Package & Duration
                          </span>
                          <span className="font-montserrat text-sm font-medium text-[#111827]">
                            {selectedTier.name} ({selectedTier.duration})
                          </span>
                        </div>

                        <div>
                          <span className="block font-montserrat text-[11px] text-[#555555] uppercase">
                            Appointment Date & Time
                          </span>
                          <span className="font-montserrat text-sm font-medium text-[#111827]">
                            {selectedDate} at {selectedTime} (AEST)
                          </span>
                        </div>

                        <div>
                          <span className="block font-montserrat text-[11px] text-[#555555] uppercase">
                            Format & Patient
                          </span>
                          <span className="font-montserrat text-xs font-medium text-[#111827] block">
                            {consultFormat === 'video' ? 'Secure Video (Zoom)' : 'Direct Phone'}
                          </span>
                          <span className="font-montserrat text-xs text-[#555555] truncate block">
                            {patientDetails.fullName || 'Patient'} ({patientDetails.email || 'Email'})
                          </span>
                        </div>

                        <div className="pt-3 border-t border-[#CDE0F3] flex items-baseline justify-between">
                          <span className="font-montserrat text-sm font-medium text-[#111827]">
                            Total Flat Fee
                          </span>
                          <span className="font-montserrat text-2xl font-bold text-accent">
                            A${selectedTier.priceAUD}.00
                          </span>
                        </div>
                      </div>

                      {/* Right: Payment Method Tabs & Inputs (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        {/* Payment Method Switcher */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              paymentMethod === 'card'
                                ? 'border-accent bg-[#EBF2FA] text-accent ring-1 ring-accent font-semibold'
                                : 'border-[#CDE0F3] bg-white text-[#555555] hover:bg-[#F4F8FC]'
                            }`}
                          >
                            <CreditCard className="w-4 h-4" />
                            <span className="font-montserrat text-xs">Card</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('wallet')}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              paymentMethod === 'wallet'
                                ? 'border-accent bg-[#EBF2FA] text-accent ring-1 ring-accent font-semibold'
                                : 'border-[#CDE0F3] bg-white text-[#555555] hover:bg-[#F4F8FC]'
                            }`}
                          >
                            <Smartphone className="w-4 h-4" />
                            <span className="font-montserrat text-xs">Apple / GPay</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('bank')}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              paymentMethod === 'bank'
                                ? 'border-accent bg-[#EBF2FA] text-accent ring-1 ring-accent font-semibold'
                                : 'border-[#CDE0F3] bg-white text-[#555555] hover:bg-[#F4F8FC]'
                            }`}
                          >
                            <Building2 className="w-4 h-4" />
                            <span className="font-montserrat text-xs">Bank EFT</span>
                          </button>
                        </div>

                        {/* Card Form */}
                        {paymentMethod === 'card' && (
                          <div className="bg-white border border-[#CDE0F3] rounded-2xl p-4 sm:p-5 space-y-3.5">
                            <div>
                              <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1">
                                Cardholder Name
                              </label>
                              <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="Full Name on Card"
                                className="w-full px-3.5 py-2 rounded-xl border border-[#CDE0F3] font-montserrat text-sm text-[#111827] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                              />
                            </div>

                            <div>
                              <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1">
                                Card Number
                              </label>
                              <div className="relative">
                                <CreditCard className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="text"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  placeholder="4242 •••• •••• 4242"
                                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#CDE0F3] font-mono text-sm text-[#111827] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM / YY"
                                  className="w-full px-3.5 py-2 rounded-xl border border-[#CDE0F3] font-mono text-sm text-[#111827] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                              </div>
                              <div>
                                <label className="block font-montserrat text-xs font-medium text-[#111827] mb-1">
                                  Security CVC
                                </label>
                                <input
                                  type="password"
                                  maxLength={4}
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value)}
                                  placeholder="CVC"
                                  className="w-full px-3.5 py-2 rounded-xl border border-[#CDE0F3] font-mono text-sm text-[#111827] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 text-[11px] font-montserrat text-[#555555]">
                              <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>256-Bit SSL Encrypted & Protected Clinical Telehealth Escrow</span>
                            </div>
                          </div>
                        )}

                        {/* Digital Wallet Fast Checkout */}
                        {paymentMethod === 'wallet' && (
                          <div className="bg-white border border-[#CDE0F3] rounded-2xl p-5 text-center space-y-3">
                            <Smartphone className="w-8 h-8 text-accent mx-auto" />
                            <div>
                              <h4 className="font-montserrat text-sm font-semibold text-[#111827]">
                                Express Mobile Checkout
                              </h4>
                              <p className="font-montserrat text-xs text-[#555555] max-w-sm mx-auto mt-1">
                                Authenticate instantly with Apple Pay, Google Pay, or browser biometric token.
                              </p>
                            </div>
                            <div className="pt-2">
                              <button
                                type="button"
                                onClick={handleExecutePayment}
                                className="w-full py-2.5 rounded-xl bg-black text-white font-montserrat text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Pay with Device Token (A${selectedTier.priceAUD})</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Bank EFT Transfer */}
                        {paymentMethod === 'bank' && (
                          <div className="bg-white border border-[#CDE0F3] rounded-2xl p-5 space-y-3 text-xs font-montserrat text-[#555555]">
                            <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                              <Building2 className="w-4 h-4" />
                              <span>Direct Clinical Escrow Account (Australia)</span>
                            </div>
                            <div className="bg-[#F4F8FC] p-3 rounded-xl border border-[#CDE0F3] space-y-1.5 font-mono text-[12px] text-[#111827]">
                              <div><strong>Account Name:</strong> JJ Nutrition Clinical Practice</div>
                              <div><strong>BSB:</strong> 062-000</div>
                              <div><strong>Account Number:</strong> 1849 2019</div>
                              <div><strong>Payment Reference:</strong> {receiptId}</div>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                              *Please use reference <strong>{receiptId}</strong> when transferring. Instant automated receipt will be dispatched upon transfer initiation.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 6: RECEIPT (Custom ReceiptPrinter Integration)      */}
                {/* -------------------------------------------------------- */}
                {step === 6 && (
                  <div className="py-2 sm:py-4 flex flex-col items-center justify-center">
                    <div className="text-center max-w-md mx-auto mb-5">
                      <h3 className="font-heading font-medium italic text-2xl sm:text-3xl text-[#111827] leading-tight mb-1">
                        Booking & Payment Receipt
                      </h3>
                      <p className="font-montserrat text-xs sm:text-sm text-[#555555]">
                        Your clinical consultation appointment has been received and verified.
                      </p>
                    </div>

                    {/* Custom Compound ReceiptPrinter Component */}
                    <ReceiptPrinter.Root stage={printerStage} feedMotion="stepped">
                      <ReceiptPrinter.Machine>
                        <ReceiptPrinter.Header>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-mono text-[11px] font-semibold text-neutral-300 tracking-wider">
                              JJ-TERMINAL // AUS
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-neutral-400">
                            {receiptId}
                          </span>
                        </ReceiptPrinter.Header>

                        <ReceiptPrinter.Screen>
                          <ReceiptPrinter.Status />
                        </ReceiptPrinter.Screen>
                      </ReceiptPrinter.Machine>

                      <ReceiptPrinter.Output>
                        <ReceiptPrinter.Paper>
                          {/* Receipt Paper Content */}
                          <div className="space-y-3.5 text-xs text-neutral-800">
                            {/* Brand Header */}
                            <div className="text-center pb-2.5 border-b border-dashed border-neutral-400">
                              <div className="font-serif italic font-semibold text-base text-neutral-900 tracking-wide">
                                JJ Nutrition Practice
                              </div>
                              <div className="text-[10px] uppercase tracking-wider text-neutral-500 mt-0.5">
                                Practitioner Selvi, RDN • Sydney NSW
                              </div>
                              <div className="text-[10px] text-neutral-500">
                                ABN: 84 920 183 291 • Telehealth
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="space-y-1 text-[11px]">
                              <div className="flex justify-between">
                                <span className="text-neutral-500">Receipt Ref:</span>
                                <span className="font-bold text-neutral-900">{receiptId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500">Transaction Date:</span>
                                <span>{selectedDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500">Appointment Slot:</span>
                                <span>{selectedTime} AEST</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500">Format:</span>
                                <span>{consultFormat === 'video' ? 'Encrypted Video' : 'Direct Phone'}</span>
                              </div>
                            </div>

                            {/* Patient & Clinical Protocol */}
                            <div className="pt-2 border-t border-dashed border-neutral-400 space-y-1 text-[11px]">
                              <div className="flex justify-between">
                                <span className="text-neutral-500">Patient:</span>
                                <span className="font-medium text-neutral-900 truncate max-w-[170px]">
                                  {patientDetails.fullName || 'Patient'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500">Protocol:</span>
                                <span className="font-medium text-neutral-900 truncate max-w-[170px]">
                                  {selectedService.title}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500">Package:</span>
                                <span className="text-neutral-900">
                                  {selectedTier.name} ({selectedTier.duration})
                                </span>
                              </div>
                            </div>

                            {/* Financial Total */}
                            <div className="pt-2.5 border-t border-dashed border-neutral-400 flex items-baseline justify-between">
                              <span className="font-bold text-neutral-900 uppercase">Total Paid:</span>
                              <span className="font-bold text-base text-neutral-900">
                                A${selectedTier.priceAUD}.00 AUD
                              </span>
                            </div>

                            <div className="text-[10px] text-emerald-700 bg-emerald-50 rounded p-1.5 border border-emerald-200 text-center font-medium">
                              ✓ PAYMENT RECEIVED & ESCROW CLEARED
                            </div>

                            {/* Clinical Next Steps */}
                            <div className="pt-2 border-t border-dashed border-neutral-400 text-[10px] text-neutral-600 leading-relaxed text-center">
                              Please wait for Practitioner Selvi to review your clinical intake form and confirm your telehealth appointment link via email ({patientDetails.email || 'your email'}).
                            </div>

                            <div className="pt-1 text-center text-[9px] text-neutral-400">
                              *** THANK YOU FOR CHOOSING JJ NUTRITION ***
                            </div>
                          </div>
                        </ReceiptPrinter.Paper>
                      </ReceiptPrinter.Output>
                    </ReceiptPrinter.Root>

                    {/* Done Action Button under printer */}
                    {printerStage === 'complete' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mt-6 text-center"
                      >
                        <button
                          type="button"
                          onClick={handleClose}
                          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-white hover:bg-accent-strong text-xs sm:text-sm font-montserrat font-medium transition-all shadow-[0_4px_14px_rgba(4,74,163,0.28)] hover:shadow-[0_6px_20px_rgba(3,59,133,0.36)] cursor-pointer active:scale-[0.98]"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Done & Return to Website</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ============================================================== */}
          {/* 4. REFINED FOOTER CONTROLS                                     */}
          {/* ============================================================== */}
          <div className="px-4 sm:px-8 py-3.5 sm:py-4 bg-white border-t border-[#CDE0F3] flex items-center justify-between flex-shrink-0">
            {step > 1 && step < 6 ? (
              <button
                type="button"
                disabled={isPaying}
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full border border-[#CDE0F3] text-xs sm:text-sm font-montserrat font-medium text-[#555555] hover:text-[#111827] hover:bg-[#F4F8FC] transition-all cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {/* Step 1 to Step 3: Next Step CTA */}
            {step < 4 && (
              <button
                type="button"
                onClick={handleNext}
                className="group inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 rounded-full bg-accent text-white text-xs sm:text-sm font-montserrat font-medium hover:bg-accent-strong transition-all duration-300 shadow-[0_4px_14px_rgba(4,74,163,0.28)] hover:shadow-[0_6px_20px_rgba(3,59,133,0.36)] cursor-pointer ml-auto active:scale-[0.98]"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Step 4: Confirm & Proceed to Payment CTA */}
            {step === 4 && (
              <button
                type="button"
                disabled={!isStep4Valid}
                onClick={handleNext}
                className={`group inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-montserrat font-medium transition-all duration-300 shadow-[0_4px_14px_rgba(4,74,163,0.28)] ml-auto ${
                  !isStep4Valid
                    ? 'bg-[#60748A]/30 text-white cursor-not-allowed shadow-none'
                    : 'bg-accent text-white hover:bg-accent-strong hover:shadow-[0_6px_20px_rgba(3,59,133,0.36)] cursor-pointer active:scale-[0.98]'
                }`}
              >
                <span>Confirm & Proceed to Payment</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}

            {/* Step 5: Pay & Confirm CTA */}
            {step === 5 && (
              <button
                type="button"
                disabled={isPaying}
                onClick={handleExecutePayment}
                className="group inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full bg-accent text-white hover:bg-accent-strong text-xs sm:text-sm font-montserrat font-medium transition-all duration-300 shadow-[0_4px_14px_rgba(4,74,163,0.28)] hover:shadow-[0_6px_20px_rgba(3,59,133,0.36)] cursor-pointer ml-auto active:scale-[0.98] disabled:opacity-60"
              >
                {isPaying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay A${selectedTier.priceAUD}.00 & Confirm</span>
                    <Lock className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            )}

            {/* Step 6: Done CTA */}
            {step === 6 && (
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-accent text-white hover:bg-accent-strong text-xs sm:text-sm font-montserrat font-medium transition-all duration-300 shadow-[0_4px_14px_rgba(4,74,163,0.28)] cursor-pointer mx-auto active:scale-[0.98]"
              >
                Done & Return to Website
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
