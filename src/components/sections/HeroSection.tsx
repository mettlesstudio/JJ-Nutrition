import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import CircularText from '../ui/CircularText/CircularText';

// Official Hero Video Asset from Pexels (Happy couple preparing healthy food with warmth & positive wellbeing)
export const HERO_VIDEO_SRC = '/videos/hero-wellbeing.mp4';
export const HERO_POSTER_SRC = '/videos/hero-wellbeing-poster.jpg';

interface HeroSectionProps {
  onBookNow: () => void;
  onExploreServices?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookNow, onExploreServices }) => {
  // Track viewport tier for exact responsive insets & radius (matching Framer particular-site-336288)
  const [viewportTier, setViewportTier] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const updateTier = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setViewportTier('desktop');
      } else if (w >= 640) {
        setViewportTier('tablet');
      } else {
        setViewportTier('mobile');
      }
    };
    updateTier();
    window.addEventListener('resize', updateTier, { passive: true });
    return () => window.removeEventListener('resize', updateTier);
  }, []);

  // Framer-inspired "Radius on Scroll" scroll-linked physics
  const { scrollY } = useScroll();

  // Smooth scroll interpolation using Framer's exact spring curve
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 350,
    damping: 40,
    mass: 1.2,
  });

  // Progress from 0 (top of page) to 1 (fully expanded into edge-to-edge view)
  const scrollProgress = useTransform(smoothScrollY, [0, 260], [0, 1]);

  // Exact inset values per breakpoint:
  // Desktop: 44px -> 0px | Tablet: 24px -> 0px | Mobile: 14px -> 0px
  const startInset = viewportTier === 'desktop' ? 44 : viewportTier === 'tablet' ? 24 : 14;
  const startRadius = viewportTier === 'desktop' ? 44 : viewportTier === 'tablet' ? 32 : 28;

  const dynamicInset = useTransform(scrollProgress, [0, 1], [startInset, 0]);
  const dynamicRadius = useTransform(scrollProgress, [0, 1], [startRadius, 0]);

  // Badge positioning smoothly adapting as container expands
  const badgeOffset = useTransform(
    scrollProgress,
    [0, 1],
    [
      viewportTier === 'desktop' ? 16 : viewportTier === 'tablet' ? 10 : 4,
      viewportTier === 'desktop' ? 32 : 20,
    ]
  );

  return (
    <section
      id="home"
      className="relative w-full min-h-[100dvh] h-[100dvh] overflow-x-clip bg-[#FAF9F6]"
      style={{
        backgroundImage: `linear-gradient(rgba(250, 249, 246, 0.70), rgba(250, 249, 246, 0.70)), url('/white-wall-textures.webp')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto, 750px 750px',
      }}
    >
      {/* ========================================================================= */}
      {/* SHAPED HERO MEDIA CONTAINER (All Viewports)                               */}
      {/* Restores the signature rounded container with inset framing against the   */}
      {/* textured off-white background, and applies exact "Radius on Scroll"       */}
      {/* from https://particular-site-336288.framer.app/                           */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 40, mass: 1.5, delay: 0.05 }}
        style={{
          top: dynamicInset,
          bottom: dynamicInset,
          left: dynamicInset,
          right: dynamicInset,
          borderRadius: dynamicRadius,
        }}
        className="absolute overflow-hidden shadow-[0_20px_50px_rgba(16,36,61,0.18)] bg-slate-900 z-10 select-none"
      >
        {/* Full-bleed Background Video within the shaped container */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={HERO_POSTER_SRC}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>

        {/* Subtle Dark/Deep-Blue Gradient Overlays for Sharp Legibility */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(11, 27, 43, 0.65) 0%, rgba(11, 27, 43, 0.18) 28%, rgba(4, 74, 163, 0.20) 55%, rgba(11, 27, 43, 0.72) 80%, rgba(11, 27, 43, 0.92) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse 95% 75% at 15% 90%, rgba(11, 27, 43, 0.72) 0%, transparent 70%)',
          }}
        />

        {/* 1. TOP-CENTER VERTICAL BRAND LOCKUP (Preserved with clean clearance below liquid glass navbar on md+) */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 1.2, delay: 0.18 }}
          className="absolute top-6 sm:top-8 md:top-24 lg:top-28 left-0 right-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none px-4"
          style={{
            paddingTop: 'max(0.25rem, env(safe-area-inset-top, 0px))',
          }}
        >
          {/* Logo Emblem Icon */}
          <img
            src="/newlogo-transparent.png"
            alt="JJ Nutrition Emblem"
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 lg:h-14 lg:w-14 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.45))' }}
          />

          {/* JJ Nutrition Wordmark */}
          <h2 className="font-heading font-medium text-[25px] xs:text-[28px] sm:text-[32px] md:text-[36px] text-white leading-tight tracking-tight mt-1 sm:mt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            JJ Nutrition
          </h2>

          {/* AUTHENTIC NUTRITION Tagline */}
          <p className="font-inter font-medium text-[10.5px] sm:text-[11.5px] md:text-[12.5px] tracking-[0.22em] sm:tracking-[0.25em] text-white/90 uppercase leading-none mt-1 sm:mt-1.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            AUTHENTIC NUTRITION
          </p>
        </motion.div>

        {/* 2. LOWER-LEFT CONTENT BLOCK (Exact placement & hierarchy preserved) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 1.2, delay: 0.28 }}
          className="absolute bottom-6 left-5 sm:bottom-8 sm:left-8 md:bottom-10 md:left-12 lg:bottom-12 lg:left-16 z-20 max-w-[calc(100%-110px)] sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col items-start text-left pointer-events-auto"
          style={{
            paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom, 0px))',
            paddingLeft: 'max(0.25rem, env(safe-area-inset-left, 0px))',
          }}
        >
          {/* Main Headline */}
          <h1 className="font-heading font-medium italic text-[26px] xs:text-[30px] sm:text-[38px] md:text-[44px] lg:text-[50px] xl:text-[56px] text-white leading-[1.12] sm:leading-[1.14] tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
            Nourish Your Body.
            <br />
            Influence Your Wellbeing.
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 1.2, delay: 0.38 }}
            className="font-subheading text-[13px] xs:text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal tracking-wide text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] mt-2 sm:mt-2.5 capitalize"
          >
            Food · Nutrition · Lifestyle · Epigenetics
          </motion.p>

          {/* Left-Aligned CTA Buttons directly below headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 1.2, delay: 0.48 }}
            className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5"
          >
            {/* Button 1: Book Consultation (Primary Brand Blue) */}
            <button
              onClick={onBookNow}
              className="group relative h-[46px] xs:h-[48px] sm:h-[52px] lg:h-[54px] inline-flex items-center justify-between gap-3 sm:gap-4 rounded-full bg-[#044AA3] hover:bg-[#033A82] pl-4 sm:pl-5 lg:pl-6 pr-1.5 py-1.5 shadow-[0_4px_16px_rgba(4,74,163,0.35)] hover:shadow-[0_6px_22px_rgba(3,58,130,0.45)] cursor-pointer select-none active:scale-[0.98] transition-all duration-200"
            >
              <span className="font-montserrat text-[12.5px] xs:text-[13px] sm:text-[14.5px] lg:text-[15px] font-semibold tracking-tight text-white whitespace-nowrap">
                Book Consultation
              </span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs">
                <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#044AA3] stroke-[2.4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>

            {/* Button 2: Explore Services (High-Contrast White Secondary Pill) */}
            {onExploreServices && (
              <button
                onClick={onExploreServices}
                className="group relative h-[46px] xs:h-[48px] sm:h-[52px] lg:h-[54px] inline-flex items-center justify-between gap-3 sm:gap-4 rounded-full bg-white hover:bg-[#F3F9FD] border border-[#044AA3]/30 hover:border-[#044AA3]/60 pl-4 sm:pl-5 lg:pl-6 pr-1.5 py-1.5 shadow-[0_2px_12px_rgba(16,36,61,0.12)] hover:shadow-[0_4px_16px_rgba(4,74,163,0.2)] cursor-pointer select-none active:scale-[0.98] transition-all duration-200"
              >
                <span className="font-montserrat text-[12.5px] xs:text-[13px] sm:text-[14.5px] lg:text-[15px] font-medium tracking-tight text-[#10243D] whitespace-nowrap">
                  Explore Services
                </span>
                <span className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-[#044AA3] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs">
                  <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white stroke-[2.4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM-RIGHT CIRCULAR ROTATING TEXT BADGE                             */}
      {/* Cleanly positioned at the bottom-right corner cutout of the shaped shape  */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 1.4, delay: 0.58 }}
        style={{
          bottom: badgeOffset,
          right: badgeOffset,
        }}
        className="absolute z-30 pointer-events-auto"
      >
        <div
          className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-full border border-[#CDE0F3] shadow-[0_8px_28px_rgba(16,36,61,0.20)]"
          style={{ backgroundColor: '#FFFFFF', opacity: 1 }}
        >
          <CircularText
            text="HEALTH*NUTRITION*SCIENCE* "
            spinDuration={6}
            draggable={true}
            hoverTilt={30}
            fontWeight={400}
            fill={true}
            ring={true}
            ringColor="#044AA3"
            size={viewportTier === 'desktop' ? 96 : viewportTier === 'tablet' ? 88 : 80}
            fontSize={viewportTier === 'desktop' ? 9.5 : viewportTier === 'tablet' ? 8.8 : 8.2}
            letterSpacing={1.2}
            color="#10243D"
            className="font-montserrat tracking-widest"
          >
            {/* Stationary JJ Nutrition Logo at center */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center pointer-events-none select-none">
              <img
                src="/newlogo-transparent.png"
                alt="JJ Nutrition Logo"
                className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] lg:w-[32px] lg:h-[32px] object-contain filter drop-shadow-sm"
              />
            </div>
          </CircularText>
        </div>
      </motion.div>
    </section>
  );
};
