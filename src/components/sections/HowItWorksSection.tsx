import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export interface TimelineStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  bg: string;
  isDark: boolean;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: 'step-01',
    stepNumber: '01',
    title: 'Understand Individual',
    subtitle: 'Comprehensive Assessment & Cellular Profiling',
    description:
      'We begin with a comprehensive clinical assessment of your complete health history, cellular physiology, biomarkers, and metabolic individuality. Every protocol is rooted in objective science rather than generic guesswork.',
    bg: '#044AA3',
    isDark: true,
  },
  {
    id: 'step-02',
    stepNumber: '02',
    title: 'Food as Foundation',
    subtitle: 'Sustainable, Bioavailable Nutrition',
    description:
      'Building sustainable, whole-food nutritional strategies tailored to your unique biological needs. We prioritize nutrient density, anti-inflammatory compounds, and gut microbiome diversity as your primary medicine.',
    bg: '#FFFFFF',
    isDark: false,
  },
  {
    id: 'step-03',
    stepNumber: '03',
    title: 'Healthy Cooking',
    subtitle: 'Nutrient-Preserving Preparation Methods',
    description:
      'Practical, nutrient-preserving preparation methods that make everyday healthy eating effortless. Learn gentle cooking temperatures, cold-pressed fat balance, and culinary techniques that maximize cellular bioavailability.',
    bg: '#044AA3',
    isDark: true,
  },
  {
    id: 'step-04',
    stepNumber: '04',
    title: 'Teas & Infusions',
    subtitle: 'Digestive & Cellular Calming Elixirs',
    description:
      'Targeted herbal teas and botanical infusions formulated to support digestive vitality, cellular hydration, liver detoxification pathways, and nervous system relaxation throughout your daily routine.',
    bg: '#FFFFFF',
    isDark: false,
  },
  {
    id: 'step-05',
    stepNumber: '05',
    title: 'Quick Recipes',
    subtitle: 'Effortless Meal Blueprints for Busy Lives',
    description:
      'Simple, time-efficient meal ideas designed to fit demanding daily schedules without compromising nourishment. Nutritious, delicious recipes that come together in 15 minutes to keep you consistent and energized.',
    bg: '#044AA3',
    isDark: true,
  },
  {
    id: 'step-06',
    stepNumber: '06',
    title: 'Lifestyle Matters',
    subtitle: 'Sleep, Circadian Alignment & Stress Resilience',
    description:
      'Aligning restorative sleep, circadian rhythms, stress recovery, and daily habits with your nutritional protocol. Cellular regeneration requires physiological balance between nutrition, light exposure, and parasympathetic rest.',
    bg: '#FFFFFF',
    isDark: false,
  },
  {
    id: 'step-07',
    stepNumber: '07',
    title: 'Targeted Nutrition',
    subtitle: 'Evidence-Informed Practitioner Formulations',
    description:
      'Precision, evidence-informed practitioner supplementation to address specific physiological gaps. We prescribe only high-bioavailability, pharmaceutical-grade therapeutic cofactors tailored precisely to your diagnostic results.',
    bg: '#044AA3',
    isDark: true,
  },
  {
    id: 'step-08',
    stepNumber: '08',
    title: 'Ongoing Support',
    subtitle: 'Iterative Refinement & Dedicated Partnership',
    description:
      'Continuous progress tracking, periodic protocol refinements, and dedicated practitioner guidance. We partner with you at every milestone to ensure sustainable habits, cellular resilience, and lasting health mastery.',
    bg: '#FFFFFF',
    isDark: false,
  },
];

interface HowItWorksSectionProps {
  onBookConsultation?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLElement | null)[]>([]);
  const innersRef = useRef<(HTMLDivElement | null)[]>([]);
  const yearsRef = useRef<(HTMLHeadingElement | null)[]>([]);

  const shouldReduceMotion = useReducedMotion();

  // Chronicle Timeline Cubic Easing
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    let rafId: number | null = null;
    let lastProgress = -1;
    let currentSmoothProgress = 0;
    let targetProgress = 0;
    let lastTime = performance.now();

    const count = TIMELINE_STEPS.length;
    const yearRotation = 90;
    const contentParallax = 64;

    const updateTimeline = (rawProgress: number) => {
      const clamped = Math.min(count - 1, Math.max(0, rawProgress));
      const currentIndex = Math.min(Math.max(count - 2, 0), Math.floor(clamped));
      const stepT = count > 1 ? clamped - currentIndex : 0;
      const easedT = easeInOutCubic(stepT);

      for (let i = 0; i < count; i++) {
        const panel = panelsRef.current[i];
        const inner = innersRef.current[i];
        const year = yearsRef.current[i];
        if (!panel) continue;

        if (shouldReduceMotion) {
          panel.style.clipPath = i === Math.round(clamped) ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)';
          panel.style.zIndex = String(i + 1);
          if (year) year.style.transform = 'rotate(0deg)';
          if (inner) inner.style.transform = 'translate3d(0, 0, 0)';
          continue;
        }

        if (i === currentIndex) {
          // Current exiting panel: wipes away to the left as next panel enters
          const rightInset = Math.round(easedT * 10000) / 100;
          panel.style.clipPath = `inset(0 ${rightInset}% 0 0)`;
          panel.style.zIndex = String(i + 1);
          if (year) {
            year.style.transform = `rotate(${-yearRotation * easedT}deg)`;
          }
          if (inner) {
            inner.style.transform = `translate3d(${-contentParallax * easedT}px, 0, 0)`;
          }
        } else if (i === currentIndex + 1) {
          // Next entering panel: wipes in from the right over the current panel
          const leftInset = Math.round((1 - easedT) * 10000) / 100;
          panel.style.clipPath = `inset(0 0 0 ${leftInset}%)`;
          panel.style.zIndex = String(i + 1);
          if (year) {
            year.style.transform = `rotate(0deg)`;
          }
          if (inner) {
            inner.style.transform = `translate3d(${contentParallax * (1 - easedT)}px, 0, 0)`;
          }
        } else if (i < currentIndex) {
          // Preceding panels remain fully uncovered underneath
          panel.style.clipPath = 'inset(0 0 0 0)';
          panel.style.zIndex = String(i + 1);
          if (year) {
            year.style.transform = `rotate(${-yearRotation}deg)`;
          }
          if (inner) {
            inner.style.transform = 'translate3d(0, 0, 0)';
          }
        } else {
          // Subsequent panels remain hidden to the right
          panel.style.clipPath = 'inset(0 0 0 100%)';
          panel.style.zIndex = String(i + 1);
          if (year) {
            year.style.transform = 'rotate(0deg)';
          }
          if (inner) {
            inner.style.transform = 'translate3d(0, 0, 0)';
          }
        }
      }
    };

    const onScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const totalScroll = Math.max(1, container.offsetHeight - viewport.offsetHeight);
      // Trigger exactly when top of section hits top of viewport (zero dead scroll delay)
      const scrolled = Math.max(0, -containerRect.top);
      const raw = Math.min(1, scrolled / totalScroll) * (count - 1);
      targetProgress = raw;

      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(animateLoop);
      }
    };

    const animateLoop = (currentTime: number) => {
      const dt = Math.min(0.064, (currentTime - lastTime) / 1000 || 0.016);
      lastTime = currentTime;

      if (shouldReduceMotion) {
        currentSmoothProgress = targetProgress;
      } else {
        // Smooth exponential damping (Chronicle Timeline physics)
        currentSmoothProgress += (targetProgress - currentSmoothProgress) * (1 - Math.exp(-18 * dt));
        if (Math.abs(targetProgress - currentSmoothProgress) < 0.0004) {
          currentSmoothProgress = targetProgress;
        }
      }

      if (Math.abs(currentSmoothProgress - lastProgress) > 0.0001) {
        lastProgress = currentSmoothProgress;
        updateTimeline(currentSmoothProgress);
      }

      if (currentSmoothProgress !== targetProgress) {
        rafId = requestAnimationFrame(animateLoop);
      } else {
        rafId = null;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  return (
    /* Outer Scroll Runway: sets total distance for scrolling through all 8 steps */
    <div
      id="how-it-works"
      ref={containerRef}
      aria-label="How JJ Nutrition Works 8-Step Timeline"
      className="relative w-full h-[640vh] sm:h-[620vh] md:h-[600vh] lg:h-[580vh] box-border z-10"
      style={{
        backgroundColor: '#FAF9F6',
        backgroundImage: `linear-gradient(rgba(250, 249, 246, 0.70), rgba(250, 249, 246, 0.70)), url('/white-wall-textures.webp')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto, 750px 750px',
      }}
    >
      {/* ============================================================== */}
      {/* STICKY VIEWPORT CONTAINER (Header + Card Stack pinned together) */}
      {/* Flush edge-to-edge & flush bottom, zero background gap beside   */}
      {/* ============================================================== */}
      <div
        ref={viewportRef}
        className="sticky top-0 w-full h-[100svh] min-h-[100svh] flex flex-col justify-between items-center pt-5 xs:pt-6 sm:pt-8 md:pt-10 pb-0 px-0 overflow-hidden z-10 box-border"
      >
        {/* ============================================================ */}
        {/* DNA PATTERN BACKGROUND LAYER (Layer 2: Right-Side Up)        */}
        {/* Sits right above paper texture, behind header & solid cards  */}
        {/* ============================================================ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[1] opacity-100"
          style={{
            backgroundImage: `url('/dnapattern.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* ============================================================ */}
        {/* 1. SECTION HEADER (Framed cleanly above the cards)           */}
        {/* ============================================================ */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex-shrink-0 px-4 sm:px-6 md:px-8 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
          <h2 className="font-heading font-medium italic text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight tracking-tight mb-1.5 xs:mb-2 sm:mb-2.5">
            How <span className="text-[#044AA3]">JJ Nutrition</span> Works
          </h2>

          <p className="font-montserrat text-xs xs:text-sm sm:text-base md:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-normal">
            An evidence-informed, step-by-step roadmap to decode your cellular physiology, balance metabolism, and empower lasting vitality.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 2. CARD FRAME CONTAINER (Full-bleed edge-to-edge & bottom)   */}
        {/* ============================================================ */}
        <div
          ref={frameRef}
          className="relative z-10 w-full flex-1 min-h-0 overflow-hidden border-0 rounded-t-2xl sm:rounded-t-3xl md:rounded-t-[32px] rounded-b-none bg-[#044AA3] shadow-[0_-12px_40px_rgba(16,36,61,0.08)]"
          style={{ contain: 'paint' }}
        >
          {/* ========================================================== */}
          {/* 8 SEQUENTIAL MILESTONE CARDS (100% Solid & Opaque Panels) */}
          {/* ========================================================== */}
          {TIMELINE_STEPS.map((step, index) => {
            return (
              <section
                key={step.id}
                ref={(el) => {
                  panelsRef.current[index] = el;
                }}
                className="absolute inset-0 w-full h-full box-border"
                style={{
                  backgroundColor: step.bg,
                  color: step.isDark ? '#FFFFFF' : '#10243D',
                  clipPath: index === 0 ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)',
                  zIndex: index + 1,
                  opacity: 1, // 100% solid and opaque
                }}
              >
                {/* Inner Content Wrapper (Drifts with contentParallax) */}
                <div
                  ref={(el) => {
                    innersRef.current[index] = el;
                  }}
                  className="relative h-full w-full flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-20 pt-8 sm:pt-9 md:pt-11 lg:pt-12 pb-7 sm:pb-8 md:pb-10 lg:pb-12 box-border will-change-transform"
                >
                  {/* Top Section: Main Heading, Subtitle, Narrative Description */}
                  <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl">
                    {/* Step Title in Playfair-A Display Serif */}
                    <h3
                      className="font-heading font-medium italic text-[26px] xs:text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] leading-[1.12] tracking-tight mb-2 xs:mb-2.5 sm:mb-3"
                      style={{ color: step.isDark ? '#FFFFFF' : '#10243D' }}
                    >
                      {step.title}
                    </h3>

                    {/* Subtitle */}
                    <p
                      className="font-montserrat text-sm xs:text-base sm:text-lg md:text-xl font-medium mb-2.5 xs:mb-3 sm:mb-4 tracking-normal"
                      style={{ color: step.isDark ? '#88CEF7' : '#044AA3' }}
                    >
                      {step.subtitle}
                    </p>

                    {/* Narrative Description */}
                    <p
                      className="font-montserrat text-sm xs:text-base sm:text-lg md:text-[19px] leading-relaxed max-w-2xl md:max-w-3xl font-normal"
                      style={{ color: step.isDark ? 'rgba(255, 255, 255, 0.92)' : '#475569' }}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Bar: Horizontal Divider Line + Large Step Number (01–08) */}
                  <div
                    className="w-full pt-3 xs:pt-4 sm:pt-5 border-t"
                    style={{
                      borderColor: step.isDark ? 'rgba(255, 255, 255, 0.22)' : '#DCE8F1',
                    }}
                  >
                    <h2
                      ref={(el) => {
                        yearsRef.current[index] = el;
                      }}
                      className="font-heading font-medium italic text-[60px] xs:text-[72px] sm:text-[90px] md:text-[110px] lg:text-[130px] leading-[0.85] tracking-tighter select-none will-change-transform origin-bottom-left"
                      style={{
                        color: step.isDark ? '#FFFFFF' : '#044AA3',
                      }}
                    >
                      {step.stepNumber}
                    </h2>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
