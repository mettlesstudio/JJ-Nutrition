import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Phone, Clock, ArrowUpRight } from 'lucide-react';
import GradientASCII from './GradientASCII';
import { EdgeDecorItem, FloatingScienceNode } from '../decorative/FloatingDecorItem';

interface ContactSectionProps {
  onBookNow: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onBookNow }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="bg-transparent pt-16 sm:pt-20 md:pt-24 pb-20 sm:pb-28 md:pb-36 relative overflow-x-clip scroll-mt-20 md:scroll-mt-28"
      aria-label="Contact Practitioner Selvi"
    >
      {/* Strict outer-edge 1/4 cropped nutrition graphics */}
      <EdgeDecorItem
        side="left"
        top="top-12 sm:top-16"
        src="/images/floating/cluster-roots-citrus.png"
        alt="Ginger, turmeric, star anise and citrus cluster"
        initialRotate={14}
        duration={5.2}
      />
      <EdgeDecorItem
        side="right"
        top="top-24 sm:top-32"
        src="/images/floating/walnut.png"
        alt="Raw walnut half"
        initialRotate={-18}
        duration={4.8}
        delay={0.7}
      />

      {/* Subtle scientific molecular & DNA nodes */}
      <FloatingScienceNode
        type="molecule"
        size={44}
        className="absolute top-36 left-1/4"
        initialRotate={20}
        opacity={0.16}
        duration={6.0}
        hideOnMobile
      />
      <FloatingScienceNode
        type="dna"
        size={42}
        className="absolute top-44 right-1/4"
        initialRotate={-25}
        opacity={0.15}
        duration={5.5}
        delay={1.1}
        hideOnMobile
      />

      {/* ============================================================== */}
      {/* GRADIENT ASCII ANIMATED BACKGROUND LAYER (Preserved intact)    */}
      {/* Sits at the bottom of the Contact section, leading to footer  */}
      {/* ============================================================== */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[600px] pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <GradientASCII
            colors={["#3580ff", "#ffffff", "#3b82f6", "#6366f1"]}
            shape="rise"
            characters=" ░▒▓█"
            cellSize={22}
            density={0.8}
            glyphOpacity={0.85}
            glow={0.2}
            depthOfField={0}
            flicker={0.2}
            softness={0.5}
            scale={1}
            flow={0.5}
            speed={1}
            gradientOpacity={0.9}
            grain={0.08}
            variation={0}
            mouseInteraction={false}
            scrambleRadius={0.1}
            clickEffect="wave"
            intro
            lightMode={false}
          />
        </div>
      </div>

      {/* Subtle bottom gradient veil that blends into the #044AA3 footer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(4, 74, 163, 0.75) 85%, #044AA3 100%)',
        }}
        aria-hidden="true"
      />

      {/* ============================================================== */}
      {/* FOREGROUND CONTENT LAYER                                       */}
      {/* ============================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading & Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
            transition={{ duration: 0.6 }}
            className="font-heading font-medium italic text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#111827] normal-case leading-tight mb-3 sm:mb-4"
          >
            Connect With Practitioner Selvi <br />
            <span className="text-accent font-medium">& Begin Your Health Recovery</span>
          </motion.h2>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#1A1A1A] text-base sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl mx-auto font-montserrat"
          >
            Reach Practitioner Selvi directly for clinical questions, pathology review inquiries, or schedule a worldwide telehealth consultation.
          </motion.p>
        </div>

        {/* ============================================================== */}
        {/* UNIFIED SINGLE WHITE CONTAINER (Pill-like, Generous Radius)    */}
        {/* Combines: Intro -> Book Button -> Three Contact Info Groups    */}
        {/* ============================================================== */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[32px] sm:rounded-[40px] md:rounded-[48px] bg-white border border-[#CDE0F3] shadow-[0_16px_50px_rgba(16,36,61,0.07)] p-7 sm:p-10 md:p-14 text-center relative z-10"
        >
          {/* 1. FIRST — Consultation introduction */}
          <div className="max-w-2xl mx-auto">
            <h3 className="font-heading font-medium italic text-2xl sm:text-3xl md:text-[32px] text-[#111827] leading-tight mb-3.5">
              Your Next Step Towards Personalised Nutrition
            </h3>

            <p className="text-[#1A1A1A] text-base sm:text-base leading-relaxed font-montserrat font-normal max-w-xl mx-auto mb-7 sm:mb-8">
              Have questions about your nutritional health or want guidance tailored to your needs? Connect with Practitioner Selvi to discuss your concerns and explore the right consultation for you.
            </p>

            {/* 2. SECOND — Book Consultation button */}
            <div className="flex justify-center mb-10 sm:mb-12">
              <motion.button
                type="button"
                onClick={onBookNow}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-accent text-white hover:bg-accent-strong transition-all duration-300 shadow-[0_4px_18px_rgba(4,74,163,0.30)] hover:shadow-[0_6px_24px_rgba(3,59,133,0.40)] cursor-pointer select-none"
              >
                <span className="font-montserrat text-base sm:text-sm font-semibold tracking-wide">
                  Book a Consultation
                </span>
                <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </motion.button>
            </div>
          </div>

          {/* Delicate Horizontal Divider */}
          <div className="w-full h-px bg-[#CDE0F3] mb-8 sm:mb-10" />

          {/* 3. THIRD — Contact information (Desktop: 3 columns with dividers | Mobile: Stacked with dividers) */}
          {/* DESKTOP & IPAD (md+) */}
          <div className="hidden md:grid grid-cols-3 divide-x divide-[#CDE0F3] items-start text-center">
            {/* Group 1: Telehealth Phone */}
            <div className="px-4 lg:px-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#E6EEF8] flex items-center justify-center mb-3 border border-[#D0E0F2]">
                <Phone className="w-5 h-5 text-accent" strokeWidth={1.85} />
              </div>
              <h4 className="font-montserrat text-xs font-medium uppercase tracking-wider text-[#555555] mb-1.5">
                TELEHEALTH PHONE
              </h4>
              <a
                href="tel:0416177347"
                className="font-sans text-lg lg:text-xl font-bold text-[#111827] hover:text-accent transition-colors block mb-1"
              >
                0416 177 347
              </a>
              <p className="text-xs text-[#555555] font-montserrat">
                +61 416 177 347 (International)
              </p>
            </div>

            {/* Group 2: Clinical Inquiries */}
            <div className="px-4 lg:px-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#E6EEF8] flex items-center justify-center mb-3 border border-[#D0E0F2]">
                <Mail className="w-5 h-5 text-accent" strokeWidth={1.85} />
              </div>
              <h4 className="font-montserrat text-xs font-medium uppercase tracking-wider text-[#555555] mb-1.5">
                CLINICAL INQUIRIES
              </h4>
              <a
                href="mailto:info@jjnutrition.com.au"
                className="font-sans text-lg lg:text-xl font-bold text-[#111827] hover:text-accent transition-colors block mb-1"
              >
                info@jjnutrition.com.au
              </a>
              <p className="text-xs text-[#555555] font-montserrat">
                Direct practitioner inbox
              </p>
            </div>

            {/* Group 3: Consultation Hours */}
            <div className="px-4 lg:px-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#E6EEF8] flex items-center justify-center mb-3 border border-[#D0E0F2]">
                <Clock className="w-5 h-5 text-accent" strokeWidth={1.85} />
              </div>
              <h4 className="font-montserrat text-xs font-medium uppercase tracking-wider text-[#555555] mb-1.5">
                CONSULTATION HOURS
              </h4>
              <p className="font-sans text-lg lg:text-xl font-bold text-[#111827] mb-1">
                Mon – Fri: 8:30am – 6pm
              </p>
              <p className="text-xs text-[#555555] font-montserrat">
                Sat: 9am – 1pm (AEST)
              </p>
            </div>
          </div>

          {/* MOBILE (< md) — Stacked Vertically with Subtle Separators */}
          <div className="flex md:hidden flex-col divide-y divide-[#CDE0F3] text-center">
            {/* Group 1: Telehealth Phone */}
            <div className="pb-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#E6EEF8] flex items-center justify-center mb-2.5 border border-[#D0E0F2]">
                <Phone className="w-5 h-5 text-accent" strokeWidth={1.85} />
              </div>
              <h4 className="font-montserrat text-xs sm:text-xs font-medium uppercase tracking-wider text-[#555555] mb-1">
                TELEHEALTH PHONE
              </h4>
              <a
                href="tel:0416177347"
                className="font-sans text-xl sm:text-lg font-bold text-[#111827] hover:text-accent transition-colors block mb-0.5"
              >
                0416 177 347
              </a>
              <p className="text-sm sm:text-xs text-[#555555] font-montserrat">
                +61 416 177 347 (International)
              </p>
            </div>

            {/* Group 2: Clinical Inquiries */}
            <div className="py-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#E6EEF8] flex items-center justify-center mb-2.5 border border-[#D0E0F2]">
                <Mail className="w-5 h-5 text-accent" strokeWidth={1.85} />
              </div>
              <h4 className="font-montserrat text-xs sm:text-xs font-medium uppercase tracking-wider text-[#555555] mb-1">
                CLINICAL INQUIRIES
              </h4>
              <a
                href="mailto:info@jjnutrition.com.au"
                className="font-sans text-xl sm:text-lg font-bold text-[#111827] hover:text-accent transition-colors block mb-0.5"
              >
                info@jjnutrition.com.au
              </a>
              <p className="text-sm sm:text-xs text-[#555555] font-montserrat">
                Direct practitioner inbox
              </p>
            </div>

            {/* Group 3: Consultation Hours */}
            <div className="pt-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#E6EEF8] flex items-center justify-center mb-2.5 border border-[#D0E0F2]">
                <Clock className="w-5 h-5 text-accent" strokeWidth={1.85} />
              </div>
              <h4 className="font-montserrat text-xs sm:text-xs font-medium uppercase tracking-wider text-[#555555] mb-1">
                CONSULTATION HOURS
              </h4>
              <p className="font-sans text-xl sm:text-lg font-bold text-[#111827] mb-0.5">
                Mon – Fri: 8:30am – 6pm
              </p>
              <p className="text-sm sm:text-xs text-[#555555] font-montserrat">
                Sat: 9am – 1pm (AEST)
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
