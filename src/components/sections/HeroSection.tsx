import React from 'react';
import { motion } from 'framer-motion';
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
      {/* A. DESKTOP HERO (xl and up: >= 1280px) — SPLIT SCREEN EDITORIAL LAYOUT    */}
      {/* Left: 46-48% Vertically Centred Content with Textured Background          */}
      {/* Right: 52-54% Video (Flush Top & Right, 28-32px Bottom Gap exposing texture) */}
      {/* Rotating text anchored precisely on Video Container's Bottom-Left Corner  */}
      {/* ========================================================================= */}
      <div className="hidden xl:flex w-full h-full flex-row relative z-10">
        {/* LEFT SIDE: HERO CONTENT (46-48% width) */}
        <div className="w-[46%] xl:w-[48%] h-full flex flex-col justify-center px-10 xl:px-20 z-10 relative">
          {/* Main Heading — Two-line hierarchy in #044AA3 with Playfair-A 500 Italic */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-medium italic text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] 2xl:text-[84.896px] text-[#044AA3] leading-[1.08] tracking-tight"
          >
            Nourish Your Body.
            <br />
            Influence Your Wellbeing.
          </motion.h1>

          {/* Supporting Line — Inter font reference ~23px */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-subheading text-base xl:text-[22.9px] font-normal tracking-wide text-[#10243D]/80 capitalize"
          >
            Food · Nutrition · Lifestyle · Epigenetics
          </motion.p>

          {/* Two Primary Buttons Side by Side */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex items-center gap-4"
          >
            {/* Button 1: Book Consultation */}
            <button
              onClick={onBookNow}
              className="group inline-flex items-center justify-between gap-3.5 pl-6 pr-2 py-2 rounded-full bg-[#044AA3] text-white hover:bg-[#033b82] transition-all duration-300 shadow-[0_4px_16px_rgba(4,74,163,0.28)] hover:shadow-[0_6px_22px_rgba(3,59,133,0.36)] cursor-pointer select-none active:scale-[0.98]"
            >
              <span className="font-montserrat text-sm font-semibold tracking-wide">
                Book Consultation
              </span>
              <span className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>

            {/* Button 2: Explore Services */}
            {onExploreServices && (
              <button
                onClick={onExploreServices}
                className="group inline-flex items-center justify-between gap-3.5 pl-6 pr-2 py-2 rounded-full bg-white text-[#10243D] border border-[#CDE0F3] hover:border-[#044AA3] hover:text-[#044AA3] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer select-none active:scale-[0.98]"
              >
                <span className="font-montserrat text-sm font-semibold tracking-wide">
                  Explore Services
                </span>
                <span className="w-8 h-8 rounded-full bg-[#10243D]/5 group-hover:bg-[#044AA3]/15 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-[#10243D] group-hover:text-[#044AA3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>
            )}
          </motion.div>

          {/* Nutrition Graphic Artwork — Desktop Only, immediately below the two CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 xl:mt-10 hidden xl:block pointer-events-none select-none"
          >
            <img
              src="/Nutrition.png"
              alt="Clinical Nutrition Guidance"
              className="w-full max-w-[320px] xl:max-w-[360px] 2xl:max-w-[400px] h-auto object-contain"
              loading="eager"
            />
          </motion.div>
        </div>

        {/* RIGHT SIDE: VIDEO CONTAINER & ROTATING BADGE (52-54% width) */}
        {/* Starts flush at top: 0, reaches extreme right edge, height leaves ~76px bottom gap exposing textured background */}
        <div className="w-[54%] xl:w-[52%] h-full relative flex flex-col justify-start">
          {/* Video Container Box: Flush top, flush right, left boundary at centre division, ends 76px above bottom */}
          <div className="w-full h-[calc(100%-76px)] relative bg-slate-900">
            <div className="w-full h-full relative overflow-hidden">
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

              {/* Subtle gradient vignette to blend gently with left side */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(90deg, rgba(250, 249, 246, 0.25) 0%, transparent 6%, transparent 100%)',
                }}
              />
            </div>

            {/* ROTATING TEXT COMPONENT: Exact centre point anchored on video container's bottom-left corner */}
            {/* Position: absolute; left: 0; bottom: 0; transform: translate(-50%, 50%) */}
            <div
              className="absolute left-0 bottom-0 z-30 pointer-events-auto"
              style={{ transform: 'translate(-50%, 50%)' }}
            >
              <div
                className="relative flex items-center justify-center p-2 rounded-full border border-[#CDE0F3] shadow-[0_8px_28px_rgba(16,36,61,0.14)]"
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
                  size={96}
                  fontSize={9.5}
                  letterSpacing={1.3}
                  color="#10243D"
                  className="font-montserrat tracking-widest"
                >
                  {/* Stationary DNA Icon at the exact visual center, rotated ~45 deg */}
                  <div className="w-11 h-11 flex items-center justify-center pointer-events-none select-none">
                    <img
                      src="/DNAicon.png"
                      alt="JJ Nutrition DNA Icon"
                      className="w-[32px] h-[32px] object-contain filter drop-shadow-sm transform rotate-45"
                    />
                  </div>
                </CircularText>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* B. MOBILE & IPAD HERO (< xl: Mobile, iPad Portrait & iPad Landscape)      */}
      {/* 1. TALLER video shape occupying available height via flex-1               */}
      {/* 2. Side margins and asymmetric curved geometry strictly preserved        */}
      {/* 3. Strict 5-Layer Hierarchy:                                              */}
      {/*    Layer 1: Background texture (white-wall-textures.webp)                 */}
      {/*    Layer 2: Video (z-0)                                                   */}
      {/*    Layer 3: Dark/deep-blue overlay (z-10)                                 */}
      {/*    Layer 4: Heading (z-20, fully opaque white)                            */}
      {/*    Layer 5: Rotating text component (z-30, foreground sibling, 100% opaque)*/}
      {/* 4. Supporting line & side-by-side CTAs positioned towards screen bottom   */}
      {/* ========================================================================= */}
      <div
        className="flex xl:hidden w-full h-[100dvh] min-h-[100dvh] flex-col justify-between pt-0 px-4 sm:px-6 md:px-8 max-w-2xl md:max-w-3xl mx-auto relative z-10"
        style={{
          paddingBottom: 'max(1.75rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))',
        }}
      >
        {/* TALLER Video Shape: flex-1 fills available vertical viewport space */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex-1 min-h-[380px] sm:min-h-[440px] md:min-h-[520px]"
        >
          {/* Main Video Container: Begins at absolute top Y = 0 */}
          {/* Shape: rounded-t-none rounded-b-[56px] sm:rounded-b-[72px] md:rounded-b-[80px] */}
          <div className="relative w-full h-full rounded-t-none rounded-b-[56px] sm:rounded-b-[72px] md:rounded-b-[80px] overflow-hidden shadow-[0_16px_40px_rgba(16,36,61,0.12)] bg-slate-900">
            {/* LAYER 2: Real Nutrition & Wellbeing Video from Pexels (Lowest Stacking Level z-0) */}
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

            {/* LAYER 3: Subtle Dark/Deep-Blue Overlay (z-10, Above video, Below heading) */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(4, 74, 163, 0.28) 0%, rgba(11, 27, 43, 0.26) 45%, rgba(4, 74, 163, 0.34) 100%)',
              }}
            />

            {/* Subtle top light highlight so top-left logo and top-right burger stand out crisply */}
            <div
              className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-11"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)',
              }}
            />

            {/* LAYER 4: Fully Opaque White Heading (z-20, Above overlay, Completely Unaffected by Overlay Opacity) */}
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-20 pointer-events-none">
              <div className="max-w-[88%] sm:max-w-[82%] md:max-w-[76%]">
                <h1 className="font-heading font-medium italic text-2xl sm:text-3xl md:text-4xl text-white leading-[1.2] tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
                  Nourish Your Body.
                  <br />
                  Influence Your Wellbeing.
                </h1>
              </div>
            </div>
          </div>

          {/* LAYER 5: ROTATING TEXT FOREGROUND SIBLING */}
          {/* Highest visual layer (z-30), solid opaque white background, unaffected by overlay or parent filters */}
          <div className="absolute -bottom-5 right-2 sm:-bottom-6 sm:right-4 md:-bottom-7 md:right-6 z-30 pointer-events-auto">
            <div
              className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-full border border-[#CDE0F3] shadow-[0_6px_22px_rgba(16,36,61,0.16)]"
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
                size={82}
                fontSize={8.5}
                letterSpacing={1.2}
                color="#10243D"
                className="font-montserrat tracking-widest"
              >
                {/* Stationary DNA Icon at center, rotated ~45 deg */}
                <div className="w-9 h-9 flex items-center justify-center pointer-events-none select-none">
                  <img
                    src="/DNAicon.png"
                    alt="JJ Nutrition DNA Icon"
                    className="w-7 h-7 object-contain filter drop-shadow-sm transform rotate-45"
                  />
                </div>
              </CircularText>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM CONTENT BLOCK: Supporting text + CTAs positioned towards bottom of viewport */}
        <div className="w-full flex-shrink-0 flex flex-col items-center">
          {/* Supporting Line: 24-32px spacing below video shape */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-6 sm:pt-7 md:pt-8 text-center px-4"
          >
            <p className="font-subheading text-xs sm:text-sm md:text-base font-normal tracking-wide text-[#044AA3] capitalize">
              Food · Nutrition · Lifestyle · Epigenetics
            </p>
          </motion.div>

          {/* Two CTA Buttons: 28-36px spacing below supporting line, side-by-side towards screen bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-7 sm:pt-8 md:pt-9 px-2 sm:px-4 grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-md mx-auto"
          >
            {/* Button 1: Book Consultation */}
            <button
              onClick={onBookNow}
              className="group w-full inline-flex items-center justify-between gap-1 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#044AA3] text-white hover:bg-[#033b82] transition-all shadow-[0_4px_14px_rgba(4,74,163,0.25)] cursor-pointer select-none active:scale-[0.98]"
            >
              <span className="font-montserrat text-[10.5px] sm:text-xs md:text-sm font-semibold tracking-tight whitespace-nowrap">
                Book Consultation
              </span>
              <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
              </span>
            </button>

            {/* Button 2: Explore Services */}
            {onExploreServices && (
              <button
                onClick={onExploreServices}
                className="group w-full inline-flex items-center justify-between gap-1 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-white text-[#10243D] border border-[#CDE0F3] hover:border-[#044AA3] hover:text-[#044AA3] transition-all shadow-sm cursor-pointer select-none active:scale-[0.98]"
              >
                <span className="font-montserrat text-[10.5px] sm:text-xs md:text-sm font-semibold tracking-tight whitespace-nowrap">
                  Explore Services
                </span>
                <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#10243D]/5 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#10243D] group-hover:text-[#044AA3]" />
                </span>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
