import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface MilestoneStat {
  id: string;
  number: string;
  label: string;
}

const MILESTONES: MilestoneStat[] = [
  {
    id: 'years',
    number: '14+',
    label: 'Years of Clinical Nutrition Practice',
  },
  {
    id: 'consultations',
    number: '2800+',
    label: 'Individual Consultations Delivered',
  },
  {
    id: 'protocols',
    number: '10',
    label: 'Focus Areas & Dedicated Clinical Protocols',
  },
  {
    id: 'outcomes',
    number: '98%',
    label: 'Satisfied & Documented Health Outcomes',
  },
];

export const StatsCarouselStripSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll parallax for interactive corner elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxYTR = useTransform(scrollYProgress, [0, 1], [-16, 20]);
  const parallaxYBL = useTransform(scrollYProgress, [0, 1], [16, -16]);

  // Rapid auto-advance interval (2.0s pause, pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MILESTONES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const currentStat = MILESTONES[currentIndex];

  // Simultaneous Left-to-Right Horizontal Slide Variants
  // Incoming enters from left (-60% -> 0%), Outgoing exits to right (0% -> 60%)
  const horizontalSlideVariants = {
    initial: {
      x: shouldReduceMotion ? '0%' : '-60%',
      opacity: 0,
    },
    animate: {
      x: '0%',
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: {
      x: shouldReduceMotion ? '0%' : '60%',
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="stats-strip"
      ref={sectionRef}
      aria-label="Clinical Milestones & Evidence-Based Outcomes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-x-clip bg-[#FAF9F6] border-y border-[#CDE0F3]/70 select-none py-5 sm:py-7 md:py-8 z-30"
      style={{
        backgroundImage: `linear-gradient(rgba(250, 249, 246, 0.75), rgba(250, 249, 246, 0.75)), url('/white-wall-textures.webp')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto, 750px 750px',
      }}
    >
      {/* ============================================================== */}
      {/* 1. TOP-RIGHT CORNER NUTRITION FLAT-LAY PNG                     */}
      {/* Overlaps top seam & bleeds off right edge (cropped naturally)  */}
      {/* Continuous smooth Y-axis floating animation (amplitude: ±10px) */}
      {/* ============================================================== */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : parallaxYTR }}
        className="absolute -top-10 sm:-top-14 md:-top-20 lg:-top-24 -right-6 sm:-right-10 md:-right-14 lg:-right-16 xl:-right-20 z-30 pointer-events-auto"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                y: [-10, 10, -10],
              }
          }
          transition={{
            repeat: Infinity,
            duration: 3.4,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.05,
            rotate: 2,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <img
            src="/images/nutrition-corner-tr.png"
            alt="Natural botanical herbs, citrus and apothecary nutrition jar"
            className="w-28 xs:w-32 sm:w-44 md:w-56 lg:w-68 xl:w-76 h-auto object-contain filter drop-shadow-[0_12px_28px_rgba(16,36,61,0.18)]"
            loading="lazy"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* ============================================================== */}
      {/* 2. BOTTOM-LEFT CORNER BOTANICAL PNG                            */}
      {/* Static 90° orientation with pure smooth Y-axis floating bounce */}
      {/* Placed at uppermost z-50 layer so it overlaps sections cleanly */}
      {/* ============================================================== */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : parallaxYBL }}
        className="absolute -bottom-6 sm:-bottom-8 md:-bottom-12 -left-6 sm:-left-10 md:-left-14 lg:-left-16 xl:-left-20 z-50 pointer-events-auto"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                y: [10, -10, 10],
              }
          }
          transition={{
            repeat: Infinity,
            duration: 3.6,
            delay: 1.5,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          {/* Static 90deg orientation wrapper - completely isolated from Y-axis animation */}
          <div className="rotate-90 origin-center">
            <img
              src="/images/nutrition-corner-bl.png"
              alt="Fresh botanical herbs and leaves"
              className="w-24 xs:w-28 sm:w-40 md:w-52 lg:w-60 xl:w-68 h-auto object-contain filter drop-shadow-[0_10px_24px_rgba(16,36,61,0.14)]"
              loading="lazy"
              draggable={false}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ============================================================== */}
      {/* 3. FLUID HORIZONTAL STATS CAROUSEL (Left-to-Right Transition)   */}
      {/* Simultaneous sliding: incoming from left, outgoing to right    */}
      {/* Inner overflow-x: clip so text doesn't bleed, edge PNGs intact  */}
      {/* ============================================================== */}
      <div className="relative z-20 max-w-xl mx-auto px-6 sm:px-8 flex flex-col items-center justify-center text-center">
        <div className="relative w-full h-[90px] sm:h-[105px] md:h-[118px] flex items-center justify-center overflow-x-clip">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentStat.id}
              variants={horizontalSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex flex-col items-center justify-center text-center will-change-transform"
            >
              {/* TOP: Large Centered Display Number in Playfair-A Italic */}
              <span className="font-heading font-medium italic text-4xl sm:text-5xl md:text-6xl lg:text-[68px] text-[#044AA3] leading-none tracking-tight drop-shadow-xs mb-1.5 sm:mb-2 select-none">
                {currentStat.number}
              </span>

              {/* BOTTOM: Centered Descriptive Label Directly Underneath */}
              <span className="font-montserrat text-xs sm:text-sm md:text-base font-medium text-[#111827] sm:text-[#333333] tracking-wide text-center max-w-xs sm:max-w-md leading-snug select-none">
                {currentStat.label}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
