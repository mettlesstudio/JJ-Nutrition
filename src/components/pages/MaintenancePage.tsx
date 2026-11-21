import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const MaintenancePage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main
      className="min-h-[100dvh] h-[100dvh] w-full flex flex-col items-center justify-center px-6 sm:px-8 py-12 relative overflow-hidden select-none bg-[#FAF9F6]"
      style={{
        backgroundImage: `linear-gradient(rgba(250, 249, 246, 0.70), rgba(250, 249, 246, 0.70)), url('/white-wall-textures.webp')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto, 750px 750px',
      }}
      aria-label="JJ Nutrition Maintenance Notice"
    >
      <div className="max-w-xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* 1. Official JJ Nutrition Logo — Elegant fade-in */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-10"
        >
          <img
            src="/newlogo-transparent.png"
            alt="JJ Nutrition Logo"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-xs"
            loading="eager"
          />
        </motion.div>

        {/* 2. Main Heading in Playfair-A 500 Italic & Brand Blue #044AA3 */}
        <motion.h1
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-medium italic text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#044AA3] leading-[1.14] tracking-tight mb-4 sm:mb-5"
        >
          JJ Nutrition is Upgrading
        </motion.h1>

        {/* 3. Supporting Message in Inter regular font */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="font-subheading font-normal text-base sm:text-lg md:text-xl text-[#10243D]/80 leading-relaxed max-w-lg"
        >
          We're making some improvements to bring you a better experience. We'll be back soon.
        </motion.p>
      </div>
    </main>
  );
};

export default MaintenancePage;
