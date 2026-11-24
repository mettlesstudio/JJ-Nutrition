import React, { useRef, useMemo } from 'react';
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion';
import { FloatingScienceNode, EdgeDecorItem } from '../decorative/FloatingDecorItem';

interface AboutJJNutritionSectionProps {
  onExploreServices?: () => void;
  onBookNow?: () => void;
}

const ABOUT_TEXT =
  'JJ Nutrition is an evidence-informed clinical nutrition practice focused on individualised health. By evaluating cellular physiology and metabolic individuality, we combine practitioner-led guidance with targeted, pharmaceutical-grade supplement support to help you make informed, confident decisions about your wellbeing.';

// Deterministic pseudo-random tilt generator (±2.2 deg) for organic word pop
function getWordTilt(index: number): number {
  const t = Math.sin(index * 13.37) * 43758.5453;
  const val = (t - Math.floor(t)) * 2 - 1;
  return Number((val * 2.2).toFixed(1));
}

export const AboutJJNutritionSection: React.FC<AboutJJNutritionSectionProps> = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  const words = useMemo(() => ABOUT_TEXT.trim().split(/\s+/), []);

  // Word-by-word reveal variants mimicking two26.studio GSAP scrub/reveal
  const wordVariants: Variants = {
    hidden: {
      color: 'rgba(16, 36, 61, 0.22)',
      scale: 1,
      y: 0,
      rotate: 0,
    },
    visible: (custom: { index: number; tilt: number; shouldReduceMotion: boolean }) => {
      if (custom.shouldReduceMotion) {
        return {
          color: '#10243D',
          scale: 1,
          y: 0,
          rotate: 0,
          transition: { duration: 0 },
        };
      }
      const delay = custom.index * 0.042;
      return {
        color: ['rgba(16, 36, 61, 0.22)', '#044AA3', '#10243D'],
        scale: [1, 1.07, 1],
        y: [0, -2, 0],
        rotate: [0, custom.tilt, 0],
        transition: {
          duration: 0.52,
          delay,
          ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        },
      };
    },
  };

  // exact back.out(2) cubic-bezier spring physics from two26.studio
  const pillTransition = (delay: number) => ({
    duration: shouldReduceMotion ? 0 : 0.68,
    delay: shouldReduceMotion ? 0 : delay,
    ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number], // exact back.out(2)
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About JJ Nutrition"
      className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center select-none scroll-mt-0 py-20 sm:py-24 md:py-28 lg:py-32 bg-transparent overflow-x-clip"
    >
      {/* ============================================================== */}
      {/* LAYER 2: TRANSPARENT DNA PATTERN BACKGROUND (UPSIDE DOWN)       */}
      {/* Flipped vertically so circular arch curves upward from bottom  */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[1] opacity-100 scale-y-[-1]"
        style={{
          backgroundImage: `url('/dnapattern.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          transform: 'scaleY(-1)',
        }}
      />

      {/* ============================================================== */}
      {/* STRICT OUTER-EDGE FLUSH CROPPED NUTRITION GRAPHICS (~1/4 OUT) */}
      {/* ============================================================== */}
      <EdgeDecorItem
        side="left"
        top="top-2 sm:top-4 md:top-6 lg:top-8"
        src="/images/floating/cluster-avocado-greens.png"
        alt="Fresh avocado and microgreens cluster"
        initialRotate={-16}
        duration={5.2}
      />

      {/* Subtle scientific molecular & DNA nodes */}
      <FloatingScienceNode
        type="molecule"
        size={46}
        className="absolute top-24 right-12 sm:right-20 md:right-28"
        initialRotate={20}
        opacity={0.18}
        duration={6.0}
        hideOnMobile
      />
      <FloatingScienceNode
        type="dna"
        size={50}
        className="absolute bottom-28 left-10 sm:left-16 md:left-24"
        initialRotate={-25}
        opacity={0.16}
        duration={6.5}
        delay={1.2}
        hideOnMobile
      />

      {/* ============================================================== */}
      {/* LAYER 3: FOREGROUND EDITORIAL CONTENT (relative z-10)          */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 flex flex-col items-center justify-center text-center">
        {/* 1. Top Centered Eyebrow Label (Normal Title Casing, Not All-Caps) */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="font-montserrat text-xs sm:text-sm md:text-[15px] font-semibold tracking-wide text-[#044AA3] mb-6 sm:mb-8 md:mb-10 text-center"
        >
          Personalised Nutrition, Grounded in Science.
        </motion.div>

        {/* 2. Large Centered Statement Typography (Clean Upright Sans-Serif, Zero Italics) */}
        <div className="relative w-full max-w-4xl md:max-w-5xl mx-auto">
          <p className="font-montserrat font-bold not-italic [font-style:normal] tracking-tight text-center text-2xl xs:text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] xl:text-[52px] leading-[1.18] sm:leading-[1.15] md:leading-[1.12] select-text">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                variants={wordVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={{
                  index,
                  tilt: getWordTilt(index),
                  shouldReduceMotion,
                }}
                className="inline-block mr-[0.24em] last:mr-0 origin-center not-italic [font-style:normal]"
              >
                {word}
              </motion.span>
            ))}
          </p>
        </div>

        {/* ============================================================== */}
        {/* 3. THREE TILTED FLOATING PILL BADGES (ZERO TEXT OVERLAP)        */}
        {/* Placed cleanly underneath the statement block in a relaxed row */}
        {/* ============================================================== */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12 pt-1">
          {/* Pill 1: "Evidence-informed care" (tilt: -2.5deg) */}
          <motion.div
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              scale: shouldReduceMotion ? 1 : 0.55,
              y: shouldReduceMotion ? 0 : 20,
              rotate: -2.5,
            }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, y: 0, rotate: -2.5 }
                : { opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.55, y: shouldReduceMotion ? 0 : 20, rotate: -2.5 }
            }
            transition={pillTransition(0.45)}
            whileHover={{ scale: 1.08, rotate: 0, y: -2 }}
            className="origin-center"
          >
            <div className="bg-[#044AA3] text-white font-montserrat font-semibold rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm md:text-[15px] shadow-lg shadow-[#044AA3]/25 border border-white/20 whitespace-nowrap tracking-normal cursor-default">
              Evidence-informed care
            </div>
          </motion.div>

          {/* Pill 2: "Cellular physiology" (tilt: +3deg) */}
          <motion.div
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              scale: shouldReduceMotion ? 1 : 0.55,
              y: shouldReduceMotion ? 0 : 20,
              rotate: 3,
            }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, y: 0, rotate: 3 }
                : { opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.55, y: shouldReduceMotion ? 0 : 20, rotate: 3 }
            }
            transition={pillTransition(0.95)}
            whileHover={{ scale: 1.08, rotate: 0, y: -2 }}
            className="origin-center sm:translate-y-1.5"
          >
            <div className="bg-[#044AA3] text-white font-montserrat font-semibold rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm md:text-[15px] shadow-lg shadow-[#044AA3]/25 border border-white/20 whitespace-nowrap tracking-normal cursor-default">
              Cellular physiology
            </div>
          </motion.div>

          {/* Pill 3: "Practitioner-led support" (tilt: -2deg) */}
          <motion.div
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              scale: shouldReduceMotion ? 1 : 0.55,
              y: shouldReduceMotion ? 0 : 20,
              rotate: -2,
            }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, y: 0, rotate: -2 }
                : { opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.55, y: shouldReduceMotion ? 0 : 20, rotate: -2 }
            }
            transition={pillTransition(1.4)}
            whileHover={{ scale: 1.08, rotate: 0, y: -2 }}
            className="origin-center"
          >
            <div className="bg-[#044AA3] text-white font-montserrat font-semibold rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm md:text-[15px] shadow-lg shadow-[#044AA3]/25 border border-white/20 whitespace-nowrap tracking-normal cursor-default">
              Practitioner-led support
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
