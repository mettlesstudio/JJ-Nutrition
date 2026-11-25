import React, { useState, useRef } from 'react';
import { motion, useReducedMotion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ClinicalArticle } from '../../data/clinicalData';

interface FannedCardDeckProps {
  items: ClinicalArticle[];
  onSelectArticle: (article: ClinicalArticle) => void;
}

export const FannedCardDeck: React.FC<FannedCardDeckProps> = ({
  items,
  onSelectArticle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const deckRef = useRef<HTMLDivElement | null>(null);

  const totalCards = items.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 40;
    const swipeVelocity = 400;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocity) {
      // Swiped left -> next card
      setActiveIndex((prev) => (prev + 1) % totalCards);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      // Swiped right -> prev card
      setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
    }
  };

  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      // Clicking the active centered card opens the detailed modal
      onSelectArticle(items[index]);
    } else {
      // Clicking a fanned side card brings it to center
      setActiveIndex(index);
    }
  };

  return (
    <div
      ref={deckRef}
      className="relative w-full overflow-x-clip py-6 sm:py-10 flex flex-col items-center justify-center select-none"
    >
      {/* Fanned Cards Stage */}
      <motion.div
        drag={shouldReduceMotion ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={handleDragEnd}
        className="relative w-full h-[460px] sm:h-[500px] md:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {items.map((item, index) => {
          // Relative offset from active index
          const offset = index - activeIndex;
          const distance = Math.abs(offset);

          // Only render cards within reasonable distance to keep performance ultra-high
          if (distance > 3) return null;

          const isActive = offset === 0;

          // Responsive calculation:
          // Center card: scale 1, rotate 0, y 0
          // Left side (offset < 0): offset * spreadX, -offset * rotationAngle, arc drop Y
          // Right side (offset > 0): offset * spreadX, offset * rotationAngle, arc drop Y
          const rotationAngle = offset * 6.5; // -13deg, -6.5deg, 0deg, +6.5deg, +13deg
          const scale = isActive ? 1.0 : Math.max(0.74, 0.90 - (distance - 1) * 0.1);
          const zIndex = 30 - distance * 5;
          const opacity = distance <= 2 ? 1 : 0.45;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleCardClick(index)}
              animate={{
                x: `calc(${offset} * clamp(85px, 15vw, 175px))`,
                y: distance * (distance * 6 + 18), // gentle downward parabolic arc drop
                rotate: rotationAngle,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.1 }
                  : { type: 'spring', stiffness: 260, damping: 26 }
              }
              whileHover={
                isActive
                  ? { scale: 1.02 }
                  : { scale: scale * 1.05 }
              }
              className={`absolute w-[275px] xs:w-[300px] sm:w-[340px] md:w-[360px] h-[390px] xs:h-[420px] sm:h-[460px] md:h-[480px] rounded-[34px] overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.18)] border border-white/20 cursor-pointer transition-shadow duration-300 ${
                isActive
                  ? 'ring-4 ring-[#044AA3]/15 shadow-[0_24px_65px_rgba(4,74,163,0.28)]'
                  : 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.26)]'
              }`}
              style={{
                transformOrigin: 'bottom center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Full-Bleed Card Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                loading="lazy"
              />

              {/* Top Dark Gradient Scrim */}
              <div
                className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none z-10"
                aria-hidden="true"
              />

              {/* Bottom Dark Gradient Scrim */}
              <div
                className="absolute bottom-0 inset-x-0 h-52 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none z-10"
                aria-hidden="true"
              />

              {/* Top Scrim Content (Date & Read Time) */}
              <div className="relative z-20 p-5 sm:p-6 flex items-center justify-between w-full pointer-events-none">
                <span className="text-xs font-semibold tracking-wider uppercase text-white/90 drop-shadow-sm font-montserrat">
                  {item.date}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-semibold tracking-wider uppercase shadow-xs">
                  {item.readTime}
                </span>
              </div>

              {/* Bottom Scrim Content (Category & Heading) */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 flex flex-col justify-end pointer-events-none">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#D9EFFB] mb-2 font-montserrat drop-shadow-xs">
                  {item.category}
                </span>
                <h3 className="font-heading font-medium italic text-lg sm:text-xl md:text-2xl text-white leading-snug line-clamp-3 drop-shadow-sm">
                  {item.title}
                </h3>
              </div>

              {/* Active Card Subtle Click Instruction Pill on Hover */}
              {isActive && (
                <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    Click to Read Article
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Navigation Controls: Left Arrow Button + Pagination Indicator Dots + Right Arrow Button */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 relative z-20">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous item"
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-[#044AA3] shadow-xs hover:bg-[#044AA3] hover:text-white transition-colors flex items-center justify-center cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 cursor-pointer p-0 border-0 ${
                  isActive
                    ? 'w-7 h-2 rounded-full bg-[#044AA3] shadow-xs'
                    : 'w-2 h-2 rounded-full bg-[#CDE0F3] hover:bg-[#60748A]'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={isActive ? 'true' : undefined}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next item"
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-[#044AA3] shadow-xs hover:bg-[#044AA3] hover:text-white transition-colors flex items-center justify-center cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
