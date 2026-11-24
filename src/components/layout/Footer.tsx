import React, { useState } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { IMAGES } from '../../assets/images';

interface FooterProps {
  onRouteChange: (route: string, sectionId?: string) => void;
  onOpenBooking?: (serviceId?: string) => void;
}

const headingContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const lineVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};
const KineticLink: React.FC<{
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: string;
  className?: string;
  showArrow?: boolean;
}> = ({ href, onClick, children, className = '', showArrow = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const chars = children.split('');

  return (
    <a
      href={href || '#'}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex items-center gap-1.5 cursor-pointer group select-none ${className}`}
    >
      <span className="inline-flex items-center flex-wrap">
        {chars.map((char, i) => (
          <motion.span
            key={i}
            animate={
              isHovered
                ? {
                    y: [0, -3, 0],
                    rotate: [0, i % 2 === 0 ? -4 : 4, 0],
                    scale: [1, 1.14, 1],
                  }
                : { y: 0, rotate: 0, scale: 1 }
            }
            transition={{
              duration: 0.35,
              delay: i * 0.018,
              ease: 'easeOut',
            }}
            className="inline-block origin-center will-change-transform"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
      {showArrow && (
        <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
      )}
    </a>
  );
};

export const Footer: React.FC<FooterProps> = ({ onRouteChange, onOpenBooking }) => {
  const shouldReduceMotion = useReducedMotion();

  const handleNavClick = (e: React.MouseEvent, route: string, sectionId?: string) => {
    e.preventDefault();
    onRouteChange(route, sectionId);
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      onRouteChange('/', 'consultations');
    }
  };

  return (
    <footer
      style={{ overflowX: 'clip' }}
      className="bg-[#044AA3] text-white pt-16 sm:pt-20 md:pt-24 pb-0 relative overflow-y-hidden"
    >
      {/* 1. Subtle DNA Linework Texture Underneath */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.055] bg-repeat bg-center"
        style={{
          backgroundImage: `url('/dnapattern.png')`,
          backgroundSize: '380px auto',
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 relative z-10">
        {/* ========================================================= */}
        {/* TOP / MIDDLE FOOTER GRID (Matching two26.studio structure)*/}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-14 sm:pb-20">
          {/* ------------------------------------------------------- */}
          {/* LEFT SIDE (Cols 1-6): Editorial Closing Statement & CTA */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col justify-between items-start space-y-8">
            <div className="w-full">
              {/* Brand Logo & Name Lockup */}
              <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
                <img
                  src={IMAGES.brandLogoWhite}
                  alt="JJ Nutrition Logo"
                  className="h-7 sm:h-8 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="font-montserrat text-xl sm:text-2xl tracking-wider font-medium text-white">
                  JJ NUTRITION
                </span>
              </div>

              {/* Bold Editorial Closing Statement with Line Mask Reveal */}
              <motion.h2
                variants={headingContainerVariants}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 'some' }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.05] mb-6 sm:mb-8 max-w-xl"
              >
                <span className="overflow-hidden block">
                  <motion.span
                    variants={lineVariants}
                    className="block"
                  >
                    Ready to restore your
                  </motion.span>
                </span>
                <span className="overflow-hidden block">
                  <motion.span
                    variants={lineVariants}
                    className="block font-heading italic text-[#D9EFFB]"
                  >
                    cellular vitality?
                  </motion.span>
                </span>
              </motion.h2>

              {/* CTA Pill Button (Replicating two26.studio "Let's Talk" magnetic pill) */}
              <motion.button
                onClick={handleBookingClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center justify-between gap-4 pl-6 pr-2 py-2 rounded-full bg-[#0B192C] text-white hover:bg-[#071324] border border-white/20 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <span className="font-sans text-sm sm:text-base font-medium tracking-wide">
                  Book Consultation
                </span>
                <div className="w-8 h-8 rounded-full bg-[#044AA3] group-hover:bg-[#033B85] text-white flex items-center justify-center transition-colors duration-200">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </motion.button>
            </div>

            {/* Direct Contact Details Block */}
            <div className="pt-4 space-y-4 w-full">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/50 mb-1.5 font-semibold">
                  Email Us
                </p>
                <KineticLink
                  href="mailto:info@jjnutrition.com.au"
                  className="text-base sm:text-lg text-white font-medium hover:text-[#D9EFFB]"
                >
                  info@jjnutrition.com.au
                </KineticLink>
              </div>

              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/50 mb-1.5 font-semibold">
                  Direct Line
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm sm:text-base text-white/85">
                  <KineticLink
                    href="tel:0416177347"
                    className="hover:text-white"
                  >
                    0416 177 347 (AU)
                  </KineticLink>
                  <span className="hidden sm:inline text-white/30">•</span>
                  <KineticLink
                    href="tel:+61416177347"
                    className="hover:text-white"
                  >
                    +61 416 177 347 (Intl)
                  </KineticLink>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT SIDE (Cols 7-12): Two-Column Navigation & Info    */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-10 lg:pl-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              {/* Column 1: Main Navigation Links */}
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/50 mb-4 font-semibold">
                  Navigation
                </p>
                <ul className="space-y-3">
                  {[
                    { label: 'About Selvi', route: '/', section: 'about' },
                    { label: 'Services', route: '/', section: 'services' },
                    { label: 'Consultations', route: '/', section: 'consultations' },
                    { label: 'Blogs & Education', route: '/blogs', section: undefined },
                    { label: 'Contact', route: '/', section: 'contact' },
                  ].map((item) => (
                    <li key={item.label}>
                      <KineticLink
                        onClick={(e) => handleNavClick(e, item.route, item.section)}
                        className="text-base sm:text-lg text-white/85 hover:text-white font-medium"
                        showArrow
                      >
                        {item.label}
                      </KineticLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Telehealth Hours & Global Practice */}
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/50 mb-4 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D0E0F2]" />
                  Telehealth Hours
                </p>
                <div className="space-y-3.5 text-sm sm:text-base text-white/85">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-0.5">
                      Monday – Friday
                    </span>
                    <span className="font-medium text-white">8:30 AM – 6:00 PM (AEST)</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-0.5">
                      Saturday
                    </span>
                    <span className="font-medium text-white">9:00 AM – 1:00 PM (AEST)</span>
                  </div>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/10">
                      Serving Australia, US, UK & Worldwide
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Right Tagline & Practice Location (Matching Two26's address block) */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/70">
              <div>
                <p className="font-sans font-medium text-white">Evidence-informed clinical nutrition.</p>
                <p className="text-white/60">Restoring metabolic individuality.</p>
              </div>
              <div className="sm:text-right">
                <p className="font-sans font-medium text-white">Sydney, Australia</p>
                <p className="text-white/60">Worldwide Confidential Telehealth</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COPYRIGHT LINE (Placed above giant display wordmark)      */}
        {/* ========================================================= */}
        <div className="pt-6 pb-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-white/70 gap-2 font-montserrat">
          <p>© 2026 JJ Nutrition. Directed by Practitioner Selvi, RDN. All rights reserved.</p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* OVERSIZED BOTTOM DISPLAY WORDMARK (Matching two26.studio) */}
      {/* ========================================================= */}
      <motion.div
        initial={shouldReduceMotion ? {} : { scaleY: 0.25, opacity: 0 }}
        whileInView={shouldReduceMotion ? {} : { scaleY: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 170,
          damping: 14,
          mass: 1.1,
          delay: 0.05,
        }}
        style={{ transformOrigin: 'bottom center' }}
        className="w-full flex justify-center items-end select-none pointer-events-none overflow-hidden relative z-10 leading-none pt-4 sm:pt-6 pb-2 sm:pb-4"
      >
        <span className="font-heading font-bold text-[13.5vw] leading-[0.88] tracking-tight text-white/95 whitespace-nowrap text-center block w-full px-2">
          JJ Nutrition
        </span>
      </motion.div>
    </footer>
  );
};
