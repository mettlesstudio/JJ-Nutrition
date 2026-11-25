import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import CircularText from '../ui/CircularText/CircularText';
import { EdgeDecorItem } from '../decorative/FloatingDecorItem';

// Official Hero Video Asset (Vibrant Whole-Food Nutrition & Healthy Fresh Ingredients)
export const HERO_VIDEO_SRC = '/videos/hero-whole-foods.mp4';
export const HERO_POSTER_SRC = '/videos/hero-whole-foods-poster.jpg';

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

  // Framer-inspired "Radius on Scroll" scroll-linked physics for Mobile/Tablet
  const { scrollY } = useScroll();

  // Smooth scroll interpolation using Framer's exact spring curve
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 350,
    damping: 40,
    mass: 1.2,
  });

  // Progress from 0 (top of page) to 1 (fully expanded into edge-to-edge view)
  const scrollProgress = useTransform(smoothScrollY, [0, 260], [0, 1]);

  // Exact inset values per breakpoint for tablet/mobile:
  const startInset = viewportTier === 'tablet' ? 24 : 14;
  const startRadius = viewportTier === 'tablet' ? 32 : 28;

  const dynamicInset = useTransform(scrollProgress, [0, 1], [startInset, 0]);
  const dynamicRadius = useTransform(scrollProgress, [0, 1], [startRadius, 0]);

  // Badge positioning smoothly adapting as container expands for tablet/mobile
  const badgeOffset = useTransform(
    scrollProgress,
    [0, 1],
    [
      viewportTier === 'tablet' ? 10 : 4,
      20,
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
      {/* PART A: MOBILE & IPAD/TABLET LAYOUT (< 1024px)                            */}
      {/* 100% UNTOUCHED full-bleed media card with "Radius on Scroll" physics      */}
      {/* ========================================================================= */}
      <div className="block lg:hidden w-full h-full relative">

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

          {/* Dark/Deep-Blue Gradient Overlays for Sharp Legibility */}
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

          {/* Top-Center Vertical Brand Lockup */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 1.2, delay: 0.18 }}
            className="absolute top-6 sm:top-8 md:top-24 left-0 right-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none px-4"
            style={{
              paddingTop: 'max(0.25rem, env(safe-area-inset-top, 0px))',
            }}
          >
            <img
              src="/newlogo-transparent.png"
              alt="JJ Nutrition Emblem"
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.45))' }}
            />
            <h2 className="font-heading font-medium text-[25px] xs:text-[28px] sm:text-[32px] md:text-[36px] text-white leading-tight tracking-tight mt-1 sm:mt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              JJ Nutrition
            </h2>
            <p className="font-inter font-medium text-[10.5px] sm:text-[11.5px] md:text-[12.5px] tracking-[0.22em] sm:tracking-[0.25em] text-white/90 uppercase leading-none mt-1 sm:mt-1.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              AUTHENTIC NUTRITION
            </p>
          </motion.div>

          {/* Lower-Left Content Block */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 1.2, delay: 0.28 }}
            className="absolute bottom-6 left-5 sm:bottom-8 sm:left-8 md:bottom-10 md:left-12 z-20 max-w-[calc(100%-110px)] sm:max-w-xl md:max-w-2xl flex flex-col items-start text-left pointer-events-auto"
            style={{
              paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom, 0px))',
              paddingLeft: 'max(0.25rem, env(safe-area-inset-left, 0px))',
            }}
          >
            <h1 className="font-heading font-medium italic text-[26px] xs:text-[30px] sm:text-[38px] md:text-[44px] text-white leading-[1.12] sm:leading-[1.14] tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
              Nourish Your Body.
              <br />
              Influence Your Wellbeing.
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 1.2, delay: 0.38 }}
              className="font-subheading text-[13px] xs:text-[14px] sm:text-[16px] md:text-[17px] font-normal tracking-wide text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] mt-2 sm:mt-2.5 capitalize"
            >
              Food · Nutrition · Lifestyle · Epigenetics
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 1.2, delay: 0.48 }}
              className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5"
            >
              <button
                onClick={onBookNow}
                className="group relative h-[46px] xs:h-[48px] sm:h-[52px] inline-flex items-center justify-between gap-3 sm:gap-4 rounded-full bg-[#044AA3] hover:bg-[#033A82] pl-4 sm:pl-5 pr-1.5 py-1.5 shadow-[0_4px_16px_rgba(4,74,163,0.35)] hover:shadow-[0_6px_22px_rgba(3,58,130,0.45)] cursor-pointer select-none active:scale-[0.98] transition-all duration-200"
              >
                <span className="font-montserrat text-[12.5px] xs:text-[13px] sm:text-[14.5px] font-semibold tracking-tight text-white whitespace-nowrap">
                  Book Consultation
                </span>
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs">
                  <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#044AA3] stroke-[2.4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>

              {onExploreServices && (
                <button
                  onClick={onExploreServices}
                  className="group relative h-[46px] xs:h-[48px] sm:h-[52px] inline-flex items-center justify-between gap-3 sm:gap-4 rounded-full bg-white hover:bg-[#F3F9FD] border border-[#044AA3]/30 hover:border-[#044AA3]/60 pl-4 sm:pl-5 pr-1.5 py-1.5 shadow-[0_2px_12px_rgba(16,36,61,0.12)] hover:shadow-[0_4px_16px_rgba(4,74,163,0.2)] cursor-pointer select-none active:scale-[0.98] transition-all duration-200"
                >
                  <span className="font-montserrat text-[12.5px] xs:text-[13px] sm:text-[14.5px] font-medium tracking-tight text-[#10243D] whitespace-nowrap">
                    Explore Services
                  </span>
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#044AA3] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs">
                    <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom-Right Circular Badge for Tablet/Mobile */}
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
              size={viewportTier === 'tablet' ? 88 : 80}
              fontSize={viewportTier === 'tablet' ? 8.8 : 8.2}
              letterSpacing={1.2}
              color="#10243D"
              className="font-montserrat tracking-widest"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center pointer-events-none select-none">
                <img
                  src="/newlogo-transparent.png"
                  alt="JJ Nutrition Logo"
                  className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] object-contain filter drop-shadow-sm"
                />
              </div>
            </CircularText>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* PART B: DESKTOP 50/50 SPLIT-SCREEN LAYOUT (>= 1024px / lg:grid)           */}
      {/* Exact 50/50 split matching image_3c56ca.jpg:                              */}
      {/* Left: Light textured paper base, /dnapattern.png, brand lockup, copy      */}
      {/* Right: Full-height running nutrition video edge-to-edge                   */}
      {/* Center Seam: Circular rotating seal centered exactly on dividing line    */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid lg:grid-cols-2 relative w-full h-full min-h-[100dvh]">
        {/* Decorative Nutrition Edge PNGs for Desktop */}
        <EdgeDecorItem
          side="left"
          top="top-0"
          src="/images/floating/cluster-roots-citrus.png"
          sizeClass="w-44 xl:w-56"
          initialRotate={-12}
          opacity={0.92}
          zIndexClass="z-30"
          className="hidden lg:block -translate-y-1/4"
        />
        <EdgeDecorItem
          side="right"
          top="bottom-0"
          src="/images/floating/cluster-berries-seeds.png"
          sizeClass="w-44 xl:w-56"
          initialRotate={14}
          opacity={0.92}
          zIndexClass="z-30"
          className="hidden lg:block translate-y-1/4"
        />

        {/* ----------------------------------------------------------------------- */}
        {/* 1. LEFT HALF: Light Textured Paper Base + Brand & Editorial Content    */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative flex flex-col justify-center px-10 xl:px-16 2xl:px-24 pt-28 pb-16 h-full z-10 select-none overflow-hidden">
          {/* Subtle /dnapattern.png Background Layer (Arch curves/faces right toward the center seam) */}
          <img
            src="/dnapattern.png"
            alt=""
            aria-hidden="true"
            className="absolute -left-24 xl:-left-28 top-1/2 -translate-y-1/2 w-[140%] max-w-none h-[120%] object-contain rotate-90 opacity-25 pointer-events-none select-none z-[1]"
          />

          {/* Left Column Editorial Content Container */}
          <div className="relative z-10 flex flex-col items-start text-left">
            {/* Top Brand Lockup (Clean logo directly on background without circular card) */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="flex items-center gap-3 mb-6"
            >
              <img
                src="/newlogo-transparent.png"
                alt="JJ Nutrition Emblem"
                className="h-9 w-9 object-contain flex-shrink-0"
              />
              <div className="flex flex-col text-left">
                <span className="font-heading font-medium text-lg text-[#10243D] leading-none">
                  JJ Nutrition
                </span>
                <span className="font-inter font-medium text-[9.5px] tracking-[0.24em] text-[#044AA3] uppercase mt-1">
                  AUTHENTIC NUTRITION
                </span>
              </div>
            </motion.div>

            {/* Main Headline in Crisp Dark Slate/Navy */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="font-heading font-medium italic text-4xl xl:text-5xl 2xl:text-[58px] text-[#10243D] leading-[1.12] tracking-tight max-w-xl"
            >
              Nourish Your Body.
              <br />
              Influence Your Wellbeing.
            </motion.h1>

            {/* Subheading & Concise Editorial Supporting Text */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="mt-4 max-w-lg"
            >
              <p className="font-subheading text-base xl:text-lg font-medium text-[#044AA3] tracking-wide">
                Food · Nutrition · Lifestyle · Epigenetics
              </p>
              <p className="font-montserrat text-sm xl:text-[14.5px] text-[#555555] font-normal leading-relaxed mt-2.5">
                Evidence-based clinical nutrition, cellular biochemistry protocols, and targeted dietary interventions designed to restore vitality and metabolic equilibrium—guided directly by Practitioner Selvi, RDN.
              </p>
            </motion.div>

            {/* Left-Aligned CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              className="mt-8 flex items-center gap-3.5"
            >
              {/* Primary Solid Button */}
              <button
                onClick={onBookNow}
                className="group relative h-[52px] inline-flex items-center justify-between gap-4 rounded-full bg-[#044AA3] hover:bg-[#033A82] pl-6 pr-1.5 py-1.5 shadow-[0_4px_16px_rgba(4,74,163,0.30)] hover:shadow-[0_6px_22px_rgba(3,58,130,0.40)] cursor-pointer select-none active:scale-[0.98] transition-all duration-200"
              >
                <span className="font-montserrat text-sm font-semibold tracking-tight text-white whitespace-nowrap">
                  Book Consultation
                </span>
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs">
                  <ArrowUpRight className="w-4.5 h-4.5 text-[#044AA3] stroke-[2.4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>

              {/* Secondary High-Contrast Pill */}
              {onExploreServices && (
                <button
                  onClick={onExploreServices}
                  className="group relative h-[52px] inline-flex items-center justify-between gap-4 rounded-full bg-white hover:bg-[#F3F9FD] border border-[#044AA3]/30 hover:border-[#044AA3]/60 pl-6 pr-1.5 py-1.5 shadow-[0_2px_12px_rgba(16,36,61,0.08)] hover:shadow-[0_4px_16px_rgba(4,74,163,0.18)] cursor-pointer select-none active:scale-[0.98] transition-all duration-200"
                >
                  <span className="font-montserrat text-sm font-medium tracking-tight text-[#10243D] whitespace-nowrap">
                    Explore Services
                  </span>
                  <span className="w-9 h-9 rounded-full bg-[#044AA3] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs">
                    <ArrowUpRight className="w-4.5 h-4.5 text-white stroke-[2.4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </button>
              )}
            </motion.div>

            {/* Faint Aesthetic Outline Wordmark (Matching "Beauty" in image_3c56ca.jpg) */}
            <div className="mt-8 xl:mt-12 select-none pointer-events-none">
              <span
                className="font-heading italic font-light text-6xl xl:text-7xl 2xl:text-8xl block tracking-tight opacity-40"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px #044AA3',
                }}
              >
                Nutrition
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* 2. RIGHT HALF: Full-Height Running Nutrition Video (Edge-to-Edge)      */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative h-full w-full overflow-hidden bg-slate-900 select-none">
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

          {/* Subtle soft gradient overlay for depth */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to right, rgba(16, 36, 61, 0.22) 0%, transparent 25%), linear-gradient(180deg, rgba(16, 36, 61, 0.20) 0%, transparent 40%, rgba(16, 36, 61, 0.35) 100%)',
            }}
          />
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* 3. CENTER DIVIDING SEAM: Circular Rotating Seal Straddling Both Halves  */}
        {/* Rendered as direct child of desktop hero wrapper at left-1/2 -translate-x-1/2 bottom-12 z-30 */}
        {/* ----------------------------------------------------------------------- */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-30 pointer-events-auto select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 1.2, delay: 0.55 }}
          >
            <div
              className="relative flex items-center justify-center p-2 rounded-full border border-black/20 shadow-[0_12px_36px_rgba(16,36,61,0.30)]"
              style={{ backgroundColor: '#10243D' }}
            >
              <CircularText
                text="HEALTH*NUTRITION*SCIENCE* "
                spinDuration={7}
                draggable={true}
                hoverTilt={25}
                fontWeight={500}
                fill={true}
                ring={true}
                ringColor="#38BDF8"
                size={112}
                fontSize={10.2}
                letterSpacing={1.15}
                color="#FAF9F6"
                className="font-montserrat tracking-widest"
              >
                <div className="w-10 h-10 flex items-center justify-center pointer-events-none select-none">
                  <img
                    src="/newlogo-transparent.png"
                    alt="JJ Nutrition Logo"
                    className="w-7 h-7 object-contain brightness-0 invert filter drop-shadow-sm"
                  />
                </div>
              </CircularText>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
