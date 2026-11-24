import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CLINICAL_SERVICES, ClinicalService } from '../../data/clinicalData';
import { EdgeDecorItem } from '../decorative/FloatingDecorItem';

interface ServicesOverviewSectionProps {
  onSelectService?: (service: ClinicalService) => void;
  onBookService: (serviceId: string) => void;
}

// Curated botanical and nutritional artwork for the 10 clinical protocols
const PROTOCOL_IMAGES: Record<string, string> = {
  'cardiovascular-combo':
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  'detox-weight-loss':
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
  'bone-health':
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'energy-enhancement':
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  'insomnia-support':
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
  'anxiety-support':
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  'ulcer-healing':
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  'alcohol-weaning':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'iron-deficiency':
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
  'prostate-health':
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1200&q=80',
};

// Tailored concise copy for mobile screens to eliminate in-card scrolling
interface MobileProtocolData {
  tagline: string;
  description: string;
  outcomes: string[];
  synergists: string[];
  idealFor: string;
}

const MOBILE_PROTOCOL_CONTENT: Record<string, MobileProtocolData> = {
  'cardiovascular-combo': {
    tagline: 'Cardiovascular wellness, arterial elasticity & CoQ10 support.',
    description:
      'Evaluates endothelial nitric oxide and lipid ratios to optimize myocardial energetics and systemic vascular health.',
    outcomes: [
      'Improves endothelial tone and vascular circulation',
      'Supports balanced lipid ratios & cardiac ATP production',
    ],
    synergists: ['Ubiquinol CoQ10', 'Omega-3 EPA/DHA', 'Magnesium Taurate'],
    idealFor: 'Elevated blood pressure, lipid dysregulation, or statin-induced fatigue.',
  },
  'detox-weight-loss': {
    tagline: 'Phase I & II liver clearance, insulin sensitivity & metabolic reset.',
    description:
      'Supports hepatic biotransformation and cellular insulin signaling for sustainable visceral fat loss and energy.',
    outcomes: [
      'Reduction in stubborn abdominal adipose tissue',
      'Resolution of post-meal lethargy and sugar crashes',
    ],
    synergists: ['NAC & Milk Thistle', 'Alpha Lipoic Acid', 'Methylated B-Complex'],
    idealFor: 'Metabolic plateau, midsection weight gain, or post-meal fatigue.',
  },
  'bone-health': {
    tagline: 'Micro-crystalline osteo matrix, D3-K2 synergy & collagen scaffold.',
    description:
      'Supplies critical biochemical cofactors to direct calcium into the skeletal matrix rather than arterial soft tissues.',
    outcomes: [
      'Supports bone mineral density & skeletal resilience',
      'Directs calcium to bones while protecting arteries',
    ],
    synergists: ['MCHC Algae Calcium', 'Vitamin D3 + K2', 'Boron & Zinc'],
    idealFor: 'Osteopenia, osteoporosis, post-menopausal women, and fracture prevention.',
  },
  'energy-enhancement': {
    tagline: 'Mitochondrial biogenesis, cellular ATP synthesis & adrenal recovery.',
    description:
      'Restores mitochondrial electron transport and clears metabolic roadblocks causing chronic physical and mental fatigue.',
    outcomes: [
      'Sustained all-day stamina without stimulant crashes',
      'Sharper focus and elimination of afternoon brain fog',
    ],
    synergists: ['Acetyl-L-Carnitine', 'Active B-Complex', 'D-Ribose & Malate'],
    idealFor: 'Chronic daily fatigue, post-viral exhaustion, or executive burnout.',
  },
  'insomnia-support': {
    tagline: 'Circadian resync, nocturnal cortisol blunting & delta sleep architecture.',
    description:
      'Clinical nutrition focused on CNS down-regulation and melatonin precursors for deep, continuous sleep.',
    outcomes: [
      'Rapid, gentle sleep onset without racing bedtime thoughts',
      'Fewer 2-3 AM awakenings with restored morning clarity',
    ],
    synergists: ['Magnesium L-Threonate', 'L-Theanine & Tart Cherry', 'Phosphatidylserine'],
    idealFor: 'Sleep onset delay, middle-of-night waking, or circadian disruption.',
  },
  'anxiety-support': {
    tagline: 'Gut-brain axis modulation, GABA synthesis & stress hormone regulation.',
    description:
      'Rebalances glutamate-GABA neurotransmitters and nourishes the vagus nerve to reduce somatic tension and anxiety.',
    outcomes: [
      'Noticeable easing of acute muscular and nervous tension',
      'Greater emotional resilience and balanced cortisol levels',
    ],
    synergists: ['Suntheanine L-Theanine', 'Ashwagandha KSM-66', 'Active P-5-P & Taurine'],
    idealFor: 'Persistent nervous tension, racing thoughts, panic, or stress gut distress.',
  },
  'ulcer-healing': {
    tagline: 'Mucosal barrier restoration, H. pylori nutrition & lining repair.',
    description:
      'Promotes epithelial restitution of gastric and duodenal mucosa while soothing inflammatory digestive irritation.',
    outcomes: [
      'Relief from post-meal burning and epigastric discomfort',
      'Structural reinforcement of the stomach mucosal lining',
    ],
    synergists: ['Zinc L-Carnosine', 'DGL Chewables', 'L-Glutamine & Marshmallow'],
    idealFor: 'Stomach/duodenal ulcers, chronic gastritis, or long-term antacid/PPI users.',
  },
  'alcohol-weaning': {
    tagline: 'Neurochemical stabilization, liver regeneration & craving mitigation.',
    description:
      'Replenishes depleted micronutrients and balances neurotransmitters to soothe physiological cravings and restore liver function.',
    outcomes: [
      'Substantial reduction in physical alcohol cravings',
      'Rapid repletion of Thiamine B1 and glutathione reserves',
    ],
    synergists: ['Benfotiamine B1', 'NAC & SAMe', 'L-Glutamine & Kudzu'],
    idealFor: 'Individuals reducing or stopping alcohol seeking clinical biochemical support.',
  },
  'iron-deficiency': {
    tagline: 'Non-constipating chelated iron, ferritin pool repair & absorption cofactors.',
    description:
      'Gentle bisglycinate chelate paired with biological cofactors for deep ferritin replenishment without gastric distress or nausea.',
    outcomes: [
      'Documented rise in ferritin reserves and hemoglobin',
      'Zero constipation, nausea, or digestive side effects',
    ],
    synergists: ['Iron Bisglycinate', 'Apolactoferrin', 'Vitamin C & Methylfolate'],
    idealFor: 'Low ferritin, heavy menstrual cycles, athletes, or pharmacy iron intolerance.',
  },
  'prostate-health': {
    tagline: 'PSA support, 5-AR enzyme balance, zinc homeostasis & stream comfort.',
    description:
      'Targets 5-alpha-reductase modulation and cellular prostate health for uninterrupted sleep and smooth urinary comfort.',
    outcomes: [
      'Fewer nighttime bathroom trips (nocturia) and sleep disruption',
      'Improved urinary flow rate and bladder emptying ease',
    ],
    synergists: ['Saw Palmetto Berry', 'Beta-Sitosterol', 'Zinc Picolinate & Lycopene'],
    idealFor: 'Men 40+ with nighttime waking, weak urinary flow, or preventive health.',
  },
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Cubic Hermite smoothstep for magnetic dwell on each protocol
function smoothstep(val: number): number {
  return val * val * (3 - 2 * val);
}

export const ServicesOverviewSection: React.FC<ServicesOverviewSectionProps> = ({
  onBookService,
}) => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isIntersectingRef = useRef<boolean>(true);
  const isRunningRef = useRef<boolean>(false);

  // Viewport dimensions
  const [dimensions, setDimensions] = useState<{ W: number; H: number }>({
    W: typeof window !== 'undefined' ? window.innerWidth : 1440,
    H: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  // Animated interpolated progress (A)
  const [interpolatedProgress, setInterpolatedProgress] = useState<number>(0);

  // 10 Clinical Services derived from clinicalData.ts
  const services = useMemo(() => CLINICAL_SERVICES.slice(0, 10), []);
  const totalSteps = services.length;
  const isMobile = dimensions.W < 768;

  // Reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Update scroll progress & dimensions
  const updateScrollProgress = useCallback(() => {
    const el = runwayRef.current;
    const W = window.innerWidth || 1440;
    const H = window.innerHeight || 900;

    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollableDistance = rect.height - H;
      const progress = scrollableDistance > 0 ? -rect.top / scrollableDistance : 0;
      targetProgressRef.current = clamp(progress, 0, 1);
    }

    setDimensions((prev) => (prev.W !== W || prev.H !== H ? { W, H } : prev));
  }, []);

  // Smooth RAF update loop
  useEffect(() => {
    const onScroll = () => updateScrollProgress();
    const onResize = () => updateScrollProgress();

    const loop = () => {
      if (!isIntersectingRef.current) {
        isRunningRef.current = false;
        return;
      }

      updateScrollProgress();

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const scrollEase = reducedMotion ? 1 : 0.09;
      let nextProgress = current + (target - current) * scrollEase;

      if (Math.abs(target - nextProgress) < 0.0004) {
        nextProgress = target;
      }

      if (Math.abs(nextProgress - current) > 0.00005) {
        currentProgressRef.current = nextProgress;
        setInterpolatedProgress(nextProgress);
      }

      isRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    const stopLoop = () => {
      if (isRunningRef.current && rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        isRunningRef.current = false;
      }
    };

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
          (entries) => {
            const isVisible = !!entries[0]?.isIntersecting;
            isIntersectingRef.current = isVisible;
            if (isVisible) startLoop();
            else stopLoop();
          },
          { threshold: 0 }
        )
        : null;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    if (observer && runwayRef.current) {
      observer.observe(runwayRef.current);
    }

    updateScrollProgress();
    startLoop();

    return () => {
      stopLoop();
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [updateScrollProgress, reducedMotion]);

  // Smooth scroll navigation to a specific protocol step
  const scrollToStep = useCallback(
    (index: number) => {
      const el = runwayRef.current;
      if (!el) return;

      const H = dimensions.H;
      const scrollableDistance = el.offsetHeight - H;
      const runwayTop = window.scrollY + el.getBoundingClientRect().top;
      const targetY = Math.round(
        runwayTop + (index / (totalSteps - 1 || 1)) * scrollableDistance
      );

      const startY = window.scrollY;
      const diff = targetY - startY;

      if (Math.abs(diff) < 2) return;

      if (reducedMotion) {
        window.scrollTo(0, targetY);
        return;
      }

      const startTime = performance.now();
      const easeInOutQuad = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

      const animateScroll = (now: number) => {
        const elapsed = Math.min(1, (now - startTime) / 750);
        window.scrollTo(0, startY + diff * easeInOutQuad(elapsed));
        if (elapsed < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [dimensions.H, totalSteps, reducedMotion]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = runwayRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > 1 || rect.bottom < dimensions.H - 1) return;

      const currentStep = Math.round(currentProgressRef.current * (totalSteps - 1));
      let nextStep = currentStep;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
          nextStep = Math.min(totalSteps - 1, currentStep + 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          nextStep = Math.max(0, currentStep - 1);
          break;
        case 'Home':
          nextStep = 0;
          break;
        case 'End':
          nextStep = totalSteps - 1;
          break;
        default:
          return;
      }

      if (nextStep !== currentStep) {
        e.preventDefault();
        scrollToStep(nextStep);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToStep, totalSteps, dimensions.H]);

  // Compute magnetic smoothstep step coordinate A
  const At = interpolatedProgress * (totalSteps - 1);
  const jt = Math.min(Math.max(totalSteps - 2, 0), Math.floor(At));
  const Mt = At - jt;
  const Nt = Mt < 0.34 ? 0 : Mt > 0.66 ? 1 : smoothstep((Mt - 0.34) / 0.32);
  const A = jt + Nt;

  // Geometry for Rotary Arc & Wheel (Desktop/iPad)
  const { W, H } = dimensions;
  const circleLeftPct = -10;
  const circleRadiusPct = 32;
  const stepDegrees = 16.5;

  const centerX = (circleLeftPct / 100) * W;
  const centerY = H * 0.5;
  const radius = (circleRadiusPct / 100) * W;
  const circumference = 2 * Math.PI * radius;

  // Arc path progress
  const arcProgress = ((stepDegrees * A) / 360) * circumference;

  // Compute rotary button positions
  const rotaryButtons = useMemo(() => {
    const buttons = [];
    for (let i = 0; i < totalSteps; i++) {
      const angleDeg = (i - A) * stepDegrees;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY - radius * Math.sin(angleRad);
      const dist = Math.abs(i - A);
      const scale = clamp(1.12 - 0.11 * dist, 0.66, 1.12);
      const rot = angleDeg * 0.85;
      const bgAlpha = clamp(1.25 - 1.9 * dist, 0, 1);
      const ringAlpha = (1 - bgAlpha) * clamp(0.5 - 0.09 * dist, 0.2, 0.5);

      buttons.push({ x, y, scale, rot, bgAlpha, ringAlpha });
    }
    return buttons;
  }, [A, totalSteps, stepDegrees, centerX, centerY, radius]);

  return (
    <section
      id="services"
      className="bg-transparent relative overflow-visible"
      aria-label="Targeted Clinical Nutrition & Supplement Protocols"
    >
      {/* ============================================================== */}
      {/* 1. SECTION HEADER (Desktop & iPad >= 768px: Cleanly above layout) */}
      {/* ============================================================== */}
      <div className="hidden md:block max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-3 md:pt-12 md:pb-4">
        <h2 className="font-heading font-medium italic text-[32px] md:text-[44px] lg:text-[50px] text-[#10243D] leading-tight">
          <span>Targeted Clinical Nutrition</span>{' '}
          <span className="text-[#044AA3]">& Supplement Protocols</span>
        </h2>
      </div>

      {/* ============================================================== */}
      {/* 2. FRAMER SCROLL SERVICES RUNWAY CONTAINER                     */}
      {/* Desktop/iPad: 540vh runway | Mobile: 380svh runway             */}
      {/* ============================================================== */}
      <div
        ref={runwayRef}
        className="relative w-full h-[380svh] md:h-[540vh]"
        style={reducedMotion ? { height: 'auto' } : undefined}
      >
        {/* ============================================================ */}
        {/* PINNED STICKY STAGE (100svh Viewport Lock)                   */}
        {/* ============================================================ */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden select-none">
          {/* Strict outer-edge 1/4 cropped nutrition graphics (Topmost layer z-40 over arc & buttons) */}
          <EdgeDecorItem
            side="left"
            top="bottom-4 sm:bottom-8 md:bottom-10"
            src="/images/floating/cluster-roots-citrus.png"
            alt="Ginger, turmeric, star anise and citrus cluster"
            sizeClass="w-36 sm:w-48 md:w-64 lg:w-76 xl:w-84"
            zIndexClass="z-40"
            initialRotate={-15}
            duration={5.2}
          />

          {/* Subtle Ambient Background Gradient matching JJ Nutrition aesthetic */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(circle at 18% 50%, rgba(232, 245, 252, 0.45) 0%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)',
            }}
          />

          {/* ========================================================== */}
          {/* DESKTOP & IPAD ROTARY ARC & WHEEL (!isMobile >= 768px)     */}
          {/* ========================================================== */}
          {!isMobile && (
            <>
              {/* SVG Arc Track & Active Progress Stroke */}
              <svg
                style={{
                  position: 'absolute',
                  left: centerX - radius,
                  top: centerY - radius,
                  width: radius * 2,
                  height: radius * 2,
                  overflow: 'visible',
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                preserveAspectRatio="none"
              >
                {/* Static Faint Guide Circle */}
                <circle
                  cx={radius}
                  cy={radius}
                  r={radius}
                  fill="none"
                  stroke="rgba(4, 74, 163, 0.12)"
                  strokeWidth={1.5}
                />
                {/* Animated Active Progress Arc */}
                <circle
                  cx={radius}
                  cy={radius}
                  r={radius}
                  fill="none"
                  stroke="#044AA3"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeDasharray={`${arcProgress} ${circumference}`}
                />
              </svg>

              {/* Rotary Number Buttons on the Arc */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 5,
                  pointerEvents: 'none',
                }}
              >
                {services.map((service, index) => {
                  const btn = rotaryButtons[index];
                  return (
                    <button
                      key={`rotary-btn-${service.id}`}
                      type="button"
                      onClick={() => scrollToStep(index)}
                      aria-label={`Go to protocol ${service.number}`}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = '2px solid #044AA3';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.outline = 'none';
                      }}
                      style={{
                        position: 'absolute',
                        left: btn.x,
                        top: btn.y,
                        width: 66,
                        height: 66,
                        transform: `translate(-50%, -50%) rotate(${btn.rot}deg) scale(${btn.scale})`,
                        transformOrigin: 'center center',
                        pointerEvents: 'auto',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        userSelect: 'none',
                        outline: 'none',
                      }}
                    >
                      {/* Circular Base */}
                      <div className="absolute inset-0 rounded-full bg-white shadow-xs" />
                      {/* Active Background (#044AA3 Brand Blue) */}
                      <div
                        className="absolute inset-0 rounded-full bg-[#044AA3]"
                        style={{
                          opacity: btn.bgAlpha,
                          boxShadow:
                            btn.bgAlpha > 0.5
                              ? '0 10px 28px rgba(4, 74, 163, 0.32)'
                              : 'none',
                        }}
                      />
                      {/* Inactive Pale Ring */}
                      <div
                        className="absolute inset-0 rounded-full border-[1.4px] border-[#10243D]"
                        style={{ opacity: btn.ringAlpha }}
                      />
                      {/* Inactive Dark Navy Number */}
                      <div
                        className="absolute inset-0 flex items-center justify-center font-mono text-[17px] font-semibold tracking-wider text-[#10243D]"
                        style={{ opacity: 1 - btn.bgAlpha }}
                      >
                        {service.number}
                      </div>
                      {/* Active White Number */}
                      <div
                        className="absolute inset-0 flex items-center justify-center font-mono text-[17px] font-semibold tracking-wider text-white"
                        style={{ opacity: btn.bgAlpha }}
                      >
                        {service.number}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ========================================================== */}
          {/* DESKTOP & IPAD FULL-HEIGHT EDGE-BLEED FADING PHOTO         */}
          {/* Clean photography, full-height, dissolving seamlessly left */}
          {/* ========================================================== */}
          {!isMobile && (
            <div
              className="absolute inset-y-0 right-0 w-[46%] xl:w-[48%] pointer-events-none z-0 overflow-hidden"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.35) 28%, rgba(0, 0, 0, 0.85) 55%, black 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.35) 28%, rgba(0, 0, 0, 0.85) 55%, black 100%)',
              }}
            >
              {services.map((service, index) => {
                const dist = Math.abs(index - A);
                const opacity = clamp(1 - 1.5 * dist, 0, 1);
                return (
                  <div
                    key={`edge-bleed-photo-${service.id}`}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity,
                      transition: 'opacity 0.08s linear',
                      willChange: 'opacity',
                    }}
                  >
                    <img
                      src={
                        PROTOCOL_IMAGES[service.id] ||
                        PROTOCOL_IMAGES['cardiovascular-combo']
                      }
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================== */}
          {/* DESKTOP & IPAD CENTER CONTENT LAYER (Desktop >= 768px)     */}
          {/* Eyebrow removed, clean typography & clinical outcomes card */}
          {/* ========================================================== */}
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                left: '28%',
                top: '50%',
                width: '40%',
                maxWidth: 620,
                zIndex: 10,
              }}
            >
              {services.map((service, index) => {
                const dist = Math.abs(index - A);
                const opacity = clamp(1 - 1.7 * dist, 0, 1);
                const translateY = (index - A) * 80;
                return (
                  <div
                    key={`content-${service.id}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      opacity,
                      transform: `translateY(calc(-50% + ${translateY}px))`,
                      pointerEvents: opacity > 0.6 ? 'auto' : 'none',
                      transition: 'opacity 0.05s linear',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {/* Protocol Title (No top eyebrow label) */}
                    <h3 className="font-heading font-medium italic text-[36px] lg:text-[44px] xl:text-[50px] text-black leading-[1.08] mb-2.5 tracking-tight">
                      {service.title}
                    </h3>

                    {/* Clinical Subtitle / Tagline */}
                    <p className="text-[#044AA3] font-montserrat font-semibold text-[15px] lg:text-[17px] mb-3.5 leading-snug">
                      {service.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-black font-montserrat text-[15.5px] lg:text-[17px] leading-relaxed mb-4 max-w-2xl font-normal">
                      {service.description}
                    </p>

                    {/* Expected Clinical Outcomes Card */}
                    <div className="p-4 rounded-2xl bg-[#F3F9FD] border border-[#DCE8F1] mb-4">
                      <span className="text-[12.5px] lg:text-[13.5px] font-bold uppercase tracking-wider text-[#044AA3] block mb-2 font-montserrat">
                        Expected Clinical Outcomes
                      </span>
                      <ul className="space-y-1.5">
                        {service.expectedOutcomes.slice(0, 2).map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-[14px] lg:text-[15px] text-black font-montserrat leading-snug"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#044AA3] mt-2 flex-shrink-0" />
                            <span className="line-clamp-2">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Therapeutic Synergists Badges */}
                    <div className="flex flex-wrap gap-2 lg:gap-2.5 mb-4">
                      {service.therapeuticSynergists.map((syn, i) => (
                        <span
                          key={i}
                          className="px-3.5 py-1.5 rounded-full text-[13px] lg:text-[14px] font-semibold font-montserrat bg-[#E8F5FC] text-[#044AA3] border border-[#D9EFFB]"
                        >
                          {syn.split('(')[0].trim()}
                        </span>
                      ))}
                    </div>

                    {/* Ideal Clinical Candidate */}
                    <p className="text-[14px] lg:text-[15px] text-black font-montserrat mb-5 leading-normal">
                      <strong className="text-black font-bold">Ideal Candidate: </strong>
                      {service.idealFor}
                    </p>

                    {/* Book Consultation CTA Button */}
                    <button
                      onClick={() => onBookService(service.id)}
                      className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#044AA3] text-white hover:bg-[#0789D2] font-montserrat text-[15px] lg:text-[15.5px] font-semibold tracking-wide transition-all duration-200 shadow-[0_4px_16px_rgba(4,74,163,0.24)] hover:shadow-[0_6px_22px_rgba(7,137,210,0.3)] cursor-pointer select-none active:scale-[0.98]"
                    >
                      <span>Book Consultation</span>
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================== */}
          {/* MOBILE RESPONSIVE SCROLL SERVICES (isMobile < 768px)       */}
          {/* Top Section Heading, Top-to-Bottom Fading Card Photo,      */}
          {/* Zero Internal Scrolling, Compact Balanced Card Density     */}
          {/* ========================================================== */}
          {isMobile && (
            <div
              className="relative w-full h-full flex flex-col justify-between px-3 xs:px-3.5 py-2 xs:py-2.5"
              style={{ height: 'calc(100svh - 16px)' }}
            >
              {/* Top: Section Heading in place of thumbnail */}
              <div className="text-center pt-1 pb-1.5 px-2 flex-shrink-0">
                <h2 className="font-heading font-medium italic text-[20px] xs:text-[22px] sm:text-[25px] text-[#10243D] leading-tight">
                  <span>Targeted Clinical Nutrition</span>{' '}
                  <span className="text-[#044AA3]">& Supplement Protocols</span>
                </h2>
              </div>

              {/* Middle: Clean Mobile Protocol Card with Zero Internal Scrolling */}
              <div className="relative flex-1 w-full max-w-md mx-auto min-h-0 overflow-hidden my-1">
                {services.map((service, index) => {
                  const dist = Math.abs(index - A);
                  const opacity = clamp(1 - 1.7 * dist, 0, 1);
                  const translateY = (index - A) * 40;
                  const mobileData = MOBILE_PROTOCOL_CONTENT[service.id];
                  const mobileTagline = mobileData?.tagline || service.tagline;
                  const mobileDesc = mobileData?.description || service.description;
                  const mobileOutcomes = mobileData?.outcomes || service.expectedOutcomes.slice(0, 2);
                  const mobileSynergists = mobileData?.synergists || service.therapeuticSynergists.slice(0, 3).map(s => s.split('(')[0].trim());
                  const mobileIdeal = mobileData?.idealFor || service.idealFor;

                  return (
                    <div
                      key={`mobile-content-${service.id}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity,
                        transform: `translateY(${translateY}px)`,
                        pointerEvents: opacity > 0.6 ? 'auto' : 'none',
                        transition: 'opacity 0.05s linear',
                        willChange: 'transform, opacity',
                      }}
                      className="relative rounded-3xl overflow-hidden border border-[#DCE8F1] shadow-lg bg-white flex flex-col justify-between p-4 xs:p-5 h-full"
                    >
                      {/* Top-to-Bottom Fading Protocol Photo flush at top edge */}
                      <div
                        className="absolute top-0 inset-x-0 h-40 xs:h-44 pointer-events-none z-0 rounded-t-3xl overflow-hidden"
                        style={{
                          maskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)',
                          WebkitMaskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)',
                        }}
                      >
                        <img
                          src={
                            PROTOCOL_IMAGES[service.id] ||
                            PROTOCOL_IMAGES['cardiovascular-combo']
                          }
                          alt=""
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Foreground Content with Zero Internal Scrolling */}
                      <div className="relative z-10 flex flex-col justify-between h-full overflow-hidden">
                        <div className="space-y-2 xs:space-y-2.5">
                          {/* Protocol Title (No eyebrow) */}
                          <h3 className="font-heading font-medium italic text-[22px] xs:text-[24px] sm:text-[26px] text-black leading-[1.12] tracking-tight">
                            {service.title}
                          </h3>

                          {/* Clinical Subtitle / Tagline */}
                          <p className="text-[#044AA3] font-montserrat font-semibold text-[12px] xs:text-[12.5px] sm:text-[13.5px] leading-snug">
                            {mobileTagline}
                          </p>

                          {/* Concise Description Paragraph */}
                          <p className="text-black font-montserrat text-[11.5px] xs:text-[12px] sm:text-[13px] leading-relaxed font-normal">
                            {mobileDesc}
                          </p>

                          {/* Expected Clinical Outcomes Box */}
                          <div className="p-2.5 xs:p-3 rounded-xl bg-[#F3F9FD]/95 border border-[#DCE8F1] shadow-2xs">
                            <span className="text-[10px] xs:text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#044AA3] block mb-1 font-montserrat">
                              Expected Clinical Outcomes
                            </span>
                            <ul className="space-y-1">
                              {mobileOutcomes.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-1.5 text-[11px] xs:text-[11.5px] sm:text-[12px] text-black font-montserrat leading-snug"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#044AA3] mt-1.5 flex-shrink-0" />
                                  <span className="line-clamp-2">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Key Therapeutic Synergists Badges */}
                          <div className="flex flex-wrap gap-1 xs:gap-1.5">
                            {mobileSynergists.map((syn, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-full text-[10.5px] xs:text-[11px] sm:text-[11.5px] font-semibold font-montserrat bg-[#E8F5FC] text-[#044AA3] border border-[#D9EFFB]"
                              >
                                {syn}
                              </span>
                            ))}
                          </div>

                          {/* Concise Ideal Candidate Note */}
                          <p className="text-[11px] xs:text-[11.5px] sm:text-[12px] text-black font-montserrat leading-snug">
                            <strong className="text-black font-bold">Ideal Candidate: </strong>
                            {mobileIdeal}
                          </p>
                        </div>

                        {/* Large Book Consultation CTA Button */}
                        <div className="pt-2 border-t border-[#DCE8F1]/80 flex justify-center mt-1.5 flex-shrink-0">
                          <button
                            onClick={() => onBookService(service.id)}
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 xs:py-3 px-5 rounded-full bg-[#044AA3] text-white font-montserrat text-[13.5px] xs:text-[14px] sm:text-[15px] font-semibold tracking-wide shadow-md active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <span>Book Consultation</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
