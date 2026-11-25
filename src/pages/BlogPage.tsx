import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X, Sparkles, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { CLINICAL_BLOGS, CLINICAL_EDUCATION, ClinicalArticle } from '../data/clinicalData';
import { FannedCardDeck } from '../components/blog/FannedCardDeck';
import { EdgeDecorItem } from '../components/decorative/FloatingDecorItem';

interface BlogPageProps {
  onBookNow: () => void;
  onNavigateHomeSection?: (sectionId: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBookNow }) => {
  const [activeTab, setActiveTab] = useState<'blogs' | 'education'>('blogs');
  const [selectedArticle, setSelectedArticle] = useState<ClinicalArticle | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Active articles list
  const activeArticles = activeTab === 'blogs' ? CLINICAL_BLOGS : CLINICAL_EDUCATION;
  const featuredItem = activeArticles[0];
  const gridItems = activeArticles.slice(1);

  // Lock body scroll while article modal is open
  useEffect(() => {
    if (selectedArticle) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [selectedArticle]);

  // Handle Escape key to close article modal
  useEffect(() => {
    if (!selectedArticle) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedArticle]);

  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-28 relative min-h-screen overflow-x-clip bg-transparent">
      {/* Background DNA Pattern - Top of Page (Shifted down below Hero Video on Education tab) */}
      <div
        aria-hidden="true"
        className={`absolute left-0 right-0 w-full h-[650px] sm:h-[850px] pointer-events-none select-none z-[1] transition-all duration-500 ${
          activeTab === 'education'
            ? 'top-[42vh] sm:top-[52vh] md:top-[560px]'
            : 'top-0'
        }`}
        style={{
          backgroundImage: `url('/dnapattern.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Background DNA Pattern - Bottom of Page directly above Footer (Flipped vertically scale-y-[-1], Crisp visibility) */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 w-full h-[650px] sm:h-[850px] pointer-events-none select-none z-[1] scale-y-[-1]"
        style={{
          backgroundImage: `url('/dnapattern.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          transform: 'scaleY(-1)',
        }}
      />

      {/* ============================================================== */}
      {/* 0. EDUCATION TAB ONLY: FULL-WIDTH HERO VIDEO SECTION           */}
      {/* ============================================================== */}
      {activeTab === 'education' && (
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[68vh] max-h-[620px] -mt-24 sm:-mt-28 md:-mt-32 mb-8 sm:mb-12 overflow-hidden bg-black select-none z-10">
          {/* Full-width Nutrition / Wellness Video */}
          <video
            ref={videoRef}
            src="/videos/hero-nutrition.mp4"
            autoPlay
            loop
            playsInline
            muted={isMuted}
            controls={false}
            className="w-full h-full object-cover"
          />

          {/* Top subtle scrim for navbar visibility */}
          <div
            className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-10"
            aria-hidden="true"
          />

          {/* Tall Multi-stop Gradient Fade along Bottom dissolving into Page Base */}
          <div
            className="absolute inset-x-0 bottom-0 h-44 sm:h-56 md:h-64 bg-gradient-to-b from-transparent via-[#F7F6F2]/75 to-[#F7F6F2] pointer-events-none z-10"
            aria-hidden="true"
          />

          {/* Minimalist Frosted Circular Mute/Unmute Control in Bottom-Right Corner */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20">
            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (videoRef.current) {
                  videoRef.current.muted = nextMuted;
                }
              }}
              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-white/60 text-[#044AA3] shadow-[0_8px_24px_rgba(0,0,0,0.22)] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 group"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 transition-transform group-hover:scale-110" />
              ) : (
                <Volume2 className="w-5 h-5 transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DECORATIVE 1/4 SCREEN-EDGE NUTRITION PNGs                     */}
      {/* Topmost content layer z-40 (overlapping edges cleanly)         */}
      {/* ============================================================== */}
      {/* 1. Top-Right: Berry & Seed Bowl Cluster beside header / toggle */}
      <EdgeDecorItem
        side="right"
        top={activeTab === 'education' ? 'top-[48vh] sm:top-[58vh] md:top-[620px]' : 'top-16 sm:top-24 md:top-28'}
        src="/images/floating/cluster-berries-seeds.png"
        alt="Citrus, seed and botanical bowl cluster"
        initialRotate={-14}
        duration={5.4}
        delay={0.2}
        sizeClass="w-24 sm:w-32 md:w-44 lg:w-52"
        zIndexClass="z-40"
      />

      {/* 2. Mid-Left: Ginger, Turmeric & Star Anise cluster beside featured card */}
      <EdgeDecorItem
        side="left"
        top="top-[28%] sm:top-[30%]"
        src="/images/floating/cluster-roots-citrus.png"
        alt="Ginger, turmeric, star anise and blood orange roots cluster"
        initialRotate={16}
        duration={4.9}
        delay={0.6}
        sizeClass="w-24 sm:w-32 md:w-44 lg:w-52"
        zIndexClass="z-40"
      />

      {/* 3. Lower-Right: Apothecary Herbs & Botanicals flanking fanned carousel */}
      <EdgeDecorItem
        side="right"
        top="top-[62%] sm:top-[64%]"
        src="/images/floating/cluster-apothecary-herbs.png"
        alt="Clinical apothecary herbs and botanical mortar"
        initialRotate={-18}
        duration={5.8}
        delay={0.4}
        sizeClass="w-24 sm:w-32 md:w-44 lg:w-52"
        zIndexClass="z-40"
      />

      {/* 4. Lower-Left: Fresh Avocado & Dark Greens cluster flanking lower deck */}
      <EdgeDecorItem
        side="left"
        top="top-[78%] sm:top-[80%]"
        src="/images/floating/cluster-avocado-greens.png"
        alt="Fresh avocado and nutrient-dense greens cluster"
        initialRotate={12}
        duration={5.1}
        delay={0.8}
        sizeClass="w-24 sm:w-32 md:w-44 lg:w-52"
        zIndexClass="z-40"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ============================================================== */}
        {/* 1. HEADER & INTERACTIVE PILL SWITCHER                         */}
        {/* ============================================================== */}
        <div className="text-center pt-2 sm:pt-6 mb-8 sm:mb-12">
          {/* Large Section Heading (Top pill badge removed per user request) */}
          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-medium italic text-4xl sm:text-5xl md:text-6xl text-[#10243D] leading-tight mb-4"
          >
            {activeTab === 'blogs' ? 'Clinical Blogs' : 'Patient Education'}
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#60748A] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal font-montserrat mb-8"
          >
            {activeTab === 'blogs'
              ? 'Deep dives into human biochemical mechanisms, nutrient synergies, and clinical protocols written directly by practitioner Selvi.'
              : 'Empowering patient guides to understand cellular physiology, diagnostic biomarkers, and evidence-informed nutritional medicine.'}
          </motion.p>

          {/* Interactive Pill Switcher (Framer Motion layoutId) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#CDE0F3] shadow-[0_6px_24px_rgba(4,74,163,0.08)] select-none"
          >
            <button
              type="button"
              onClick={() => setActiveTab('blogs')}
              className={`relative px-7 sm:px-9 py-2.5 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-colors duration-200 z-10 cursor-pointer ${
                activeTab === 'blogs' ? 'text-white' : 'text-[#60748A] hover:text-[#10243D]'
              }`}
            >
              {activeTab === 'blogs' && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#044AA3] shadow-[0_4px_16px_rgba(4,74,163,0.35)]"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Blogs
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className={`relative px-7 sm:px-9 py-2.5 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-colors duration-200 z-10 cursor-pointer ${
                activeTab === 'education' ? 'text-white' : 'text-[#60748A] hover:text-[#10243D]'
              }`}
            >
              {activeTab === 'education' && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#044AA3] shadow-[0_4px_16px_rgba(4,74,163,0.35)]"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Education
              </span>
            </button>
          </motion.div>
        </div>

        {/* Content Container with Tab Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ============================================================== */}
            {/* 2. FEATURED HERO CARD (Straddling Pill Image + Blue Rectangle) */}
            {/* ============================================================== */}
            <div className="relative max-w-4xl mx-auto pt-20 sm:pt-28 md:pt-36 pb-16 px-3 sm:px-4">
              {/* Top Protruding Pill/Arch Landscape Image */}
              <motion.div
                initial={shouldReduceMotion ? { x: '-50%' } : { x: '-50%', scale: 0.95, opacity: 0 }}
                animate={{ x: '-50%', scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-1/2 w-[270px] xs:w-[320px] sm:w-[420px] md:w-[500px] h-[150px] xs:h-[180px] sm:h-[230px] md:h-[280px] rounded-[999px] overflow-hidden border-4 sm:border-[6px] border-white shadow-[0_16px_40px_rgba(4,74,163,0.22)] z-20 group cursor-pointer"
                onClick={() => setSelectedArticle(featuredItem)}
              >
                <img
                  src={featuredItem.image}
                  alt={featuredItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </motion.div>

              {/* Large Featured Card Container with /bluebackground.png */}
              <div
                className="relative rounded-3xl bg-[#044AA3] text-white pt-24 sm:pt-36 md:pt-44 pb-10 sm:pb-14 px-6 sm:px-12 md:px-16 text-center shadow-[0_20px_50px_rgba(4,74,163,0.24)] border border-[#044AA3] overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/bluebackground.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Left & Right Metadata flanking the lower curve of the pill image */}
                <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 sm:mb-8 text-xs font-semibold uppercase tracking-wider text-white/75 gap-2 relative z-10">
                  <span className="font-montserrat">PRACTITIONER SELVI, RDN</span>
                  <span className="font-montserrat">
                    {featuredItem.readTime.toUpperCase()} | {featuredItem.date}
                  </span>
                </div>

                {/* Centered Eyebrow */}
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#D9EFFB] mb-3.5 relative z-10">
                  {activeTab === 'blogs' ? 'FEATURED BLOG' : 'FEATURED EDUCATION'}
                </p>

                {/* Large Centered Editorial Title */}
                <h2
                  onClick={() => setSelectedArticle(featuredItem)}
                  className="font-heading font-medium italic text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-white leading-tight mb-4 sm:mb-6 max-w-2xl mx-auto cursor-pointer hover:text-[#D9EFFB] transition-colors relative z-10"
                >
                  {featuredItem.title}
                </h2>

                {/* Concise 2-3 Line Summary Paragraph */}
                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-normal font-montserrat relative z-10">
                  {featuredItem.summary}
                </p>

                {/* Centered Read More Pill Button */}
                <button
                  type="button"
                  onClick={() => setSelectedArticle(featuredItem)}
                  className="relative z-10 inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/60 bg-white/10 hover:bg-white hover:text-[#044AA3] text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg active:scale-95 group/btn"
                >
                  <span>Read More</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 3. FANNED CARD DECK (Other Blogs / Education Carousel)         */}
            {/* ============================================================== */}
            <div className="pt-8 sm:pt-14 pb-12 sm:pb-20 border-t border-[#DCE8F1] overflow-x-clip">
              {/* Section Heading & Subtitle */}
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-heading font-medium italic text-3xl sm:text-4xl md:text-5xl text-[#10243D] leading-tight mb-3">
                  {activeTab === 'blogs' ? 'Other Blogs' : 'Other Education'}
                </h2>
                <p className="text-[#60748A] text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-montserrat font-normal">
                  Evidence-informed clinical insights, grounded in nutritional science.
                </p>
              </div>

              {/* Fanned Overlapping Card Deck Carousel */}
              <FannedCardDeck
                items={gridItems}
                onSelectArticle={(article) => setSelectedArticle(article)}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ============================================================== */}
      {/* 4. FULL ARTICLE / GUIDE READER POPUP MODAL                     */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-[#0B192C]/65 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Window */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-[0_24px_70px_rgba(16,36,61,0.22)] border border-[#CDE0F3] overflow-hidden z-10 flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
            >
              {/* Header Image Arch with Multi-stop Gradient Fade into White */}
              <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden flex-shrink-0 bg-[#044AA3]">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />

                {/* Multi-stop gradient fade dissolving image into the white modal background */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-44 sm:h-52 bg-gradient-to-b from-transparent via-white/70 via-55% to-white pointer-events-none"
                  aria-hidden="true"
                />

                {/* Floating Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#10243D] transition-all flex items-center justify-center cursor-pointer shadow-md border border-white/60 z-30 active:scale-95"
                  aria-label="Close article modal"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Category & Read Time Pills + Main Heading inside the lower fading transition zone */}
                <div className="absolute inset-x-0 bottom-0 z-20 px-5 sm:px-8 pb-3 text-center flex flex-col items-center justify-end">
                  {/* Category & Read Time Pills */}
                  <div className="flex items-center justify-center gap-2 mb-2.5 flex-wrap">
                    <span className="px-3.5 py-1 rounded-full bg-[#E8F5FC]/95 backdrop-blur-md text-[#044AA3] text-xs font-semibold shadow-xs border border-[#CDE0F3]">
                      {selectedArticle.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[#60748A] text-xs font-medium border border-[#DCE8F1] shadow-xs">
                      {selectedArticle.readTime} • {selectedArticle.date}
                    </span>
                  </div>

                  {/* Main Article/Guide Heading */}
                  <h2
                    id="article-modal-title"
                    className="font-heading font-medium italic text-2xl sm:text-3xl md:text-4xl text-[#10243D] leading-tight text-center max-w-2xl mx-auto drop-shadow-xs"
                  >
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable Article Body - All Center-Aligned */}
              <div className="p-6 sm:p-8 lg:p-10 overflow-y-auto space-y-6 text-[#1A1A1A] font-montserrat leading-relaxed flex-1 text-center">
                {/* Article Paragraphs - Center-Aligned */}
                <div className="space-y-4 text-base text-[#333333] leading-relaxed max-w-2xl mx-auto text-center">
                  {selectedArticle.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Key Clinical Takeaways Callout - Center-Aligned */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#E8F5FC] border border-[#D0E0F2] max-w-2xl mx-auto text-center">
                  <h4 className="font-montserrat text-xs uppercase font-bold tracking-wider text-[#044AA3] mb-3 text-center">
                    Key Clinical Takeaways:
                  </h4>
                  <ul className="space-y-2 text-center flex flex-col items-center">
                    {selectedArticle.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-center justify-center gap-2 text-sm text-[#10243D] max-w-xl text-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#044AA3] flex-shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consultation Booking CTA Card - Center-Aligned */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#F3F9FD] border border-[#DCE8F1] flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-6">
                  <p className="text-lg font-semibold text-[#10243D] font-heading italic mb-1 text-center">
                    Need individualized clinical guidance?
                  </p>
                  <p className="text-xs sm:text-sm text-[#60748A] font-montserrat mb-4 text-center max-w-md">
                    Author your personalized nutritional protocol with Practitioner Selvi.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedArticle(null);
                      onBookNow();
                    }}
                    className="px-8 py-3 rounded-full bg-[#044AA3] text-white hover:bg-[#033B85] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(4,74,163,0.28)] cursor-pointer active:scale-95"
                  >
                    Book Consultation
                  </button>
                </div>

                {/* Practitioner Attribution - Placed BELOW the Book Consultation Button, Separated by Divider */}
                <div className="pt-6 mt-6 border-t border-[#DCE8F1] flex flex-col items-center justify-center text-center gap-2 max-w-md mx-auto">
                  <div className="w-10 h-10 rounded-full bg-[#044AA3] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    S
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#10243D]">
                      {selectedArticle.author || 'Practitioner Selvi, RDN'}
                    </p>
                    <p className="text-xs text-[#60748A]">
                      {selectedArticle.authorRole || 'Clinical Nutritionist & Supplement Specialist'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
