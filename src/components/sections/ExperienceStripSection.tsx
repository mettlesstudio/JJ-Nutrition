import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { HandwritingText } from '../ui/HandwritingText';
import { EdgeDecorItem } from '../decorative/FloatingDecorItem';

export const ExperienceStripSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, amount: 0.35 });

  // 38 characters at speed 0.065s + 0.012s delay finishes at ~2.9s
  const subtextDelay = shouldReduceMotion ? 0 : 2.95;

  return (
    <section
      ref={containerRef}
      aria-label="Experience Statement"
      className="w-full bg-transparent border-t border-[#DCE8F1]/70 border-b-0 py-6 sm:py-8 md:py-10 relative overflow-x-clip select-none"
    >
      {/* Strict outer-edge 1/4 cropped botanical graphics */}
      <EdgeDecorItem
        side="left"
        top="top-0 -translate-y-1/6"
        src="/images/floating/mint-leaf.png"
        alt="Fresh botanical mint sprig"
        initialRotate={35}
        sizeClass="w-14 sm:w-20 md:w-24"
        duration={5.0}
      />
      <EdgeDecorItem
        side="right"
        top="bottom-0 translate-y-1/6"
        src="/images/floating/citrus-slice.png"
        alt="Juicy citrus slice"
        initialRotate={20}
        sizeClass="w-14 sm:w-20 md:w-24"
        duration={5.2}
        delay={0.6}
      />

      {/* Screen reader accessible heading */}
      <h2 className="sr-only">14 Years of Nutritional Medicine Experience</h2>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center text-center">
        {/* ============================================================== */}
        {/* 1. 1:1 FRAMER HANDWRITING DRAWING HEADLINE                      */}
        {/* Exact stroke-dashoffset / path-reveal from handwriting.framer   */}
        {/* ============================================================== */}
        <div className="w-full flex items-center justify-center text-center text-2xl xs:text-3xl sm:text-4xl md:text-[42px] lg:text-[48px] xl:text-[52px] leading-tight text-[#044AA3]">
          <HandwritingText
            text="14 Years of Nutritional Medicine Experience"
            fontColor="#044AA3"
            strokeWidth={5.8}
            speed={0.065}
            delayBetween={0.012}
            inconsistentSpeed={4}
            isPlaying={isInView}
            className="w-full justify-center"
          />
        </div>

        {/* ============================================================== */}
        {/* 2. SUBTEXT BENEATH HANDWRITING (Fades in after drawing ends)   */}
        {/* ============================================================== */}
        <motion.p
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.65,
            delay: subtextDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="font-montserrat text-xs xs:text-sm sm:text-base md:text-[17px] text-[#475569] font-normal leading-relaxed max-w-2xl sm:max-w-3xl mx-auto text-center mt-2.5 sm:mt-3 md:mt-3.5 px-3 tracking-normal"
        >
          Individualised nutritional guidance, wholesome food choices and targeted practitioner-only support.
        </motion.p>
      </div>
    </section>
  );
};
