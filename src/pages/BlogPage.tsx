import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X, Sparkles, BookOpen } from 'lucide-react';
import { CLINICAL_BLOGS, CLINICAL_EDUCATION, ClinicalArticle } from '../data/clinicalData';

interface BlogPageProps {
  onBookNow: () => void;
  onNavigateHomeSection?: (sectionId: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBookNow }) => {
  const [activeTab, setActiveTab] = useState<'blogs' | 'education'>('blogs');
  const [selectedArticle, setSelectedArticle] = useState<ClinicalArticle | null>(null);
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
    <main className="pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-28 relative min-h-screen">
      {/* Background Subtle DNA Linework Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045] bg-repeat bg-center"
        style={{
          backgroundImage: `url('/dnapattern.png')`,
          backgroundSize: '400px auto',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ============================================================== */}
        {/* 1. HEADER & INTERACTIVE PILL SWITCHER                         */}
        {/* ============================================================== */}
        <div className="text-center pt-2 sm:pt-6 mb-8 sm:mb-12">
          {/* Eyebrow Badge */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F5FC] border border-[#D0E0F2] text-[#044AA3] text-xs font-semibold tracking-wider uppercase font-montserrat mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#044AA3]" />
            Evidence-Based Clinical Knowledge
          </motion.div>

          {/* Large Section Heading */}
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
            {/* 3. GRID SECTION BELOW FEATURED CARD (Other Blogs / Education)  */}
            {/* ============================================================== */}
            <div className="pt-8 sm:pt-14 pb-12 sm:pb-20 border-t border-[#DCE8F1]">
              {/* Section Heading & Subtitle */}
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="font-heading font-medium italic text-3xl sm:text-4xl md:text-5xl text-[#10243D] leading-tight mb-3">
                  {activeTab === 'blogs' ? 'Other Blogs' : 'Other Education'}
                </h2>
                <p className="text-[#60748A] text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-montserrat font-normal">
                  Evidence-informed clinical insights, grounded in nutritional science.
                </p>
              </div>

              {/* 3-Column Responsive Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 lg:gap-10">
                {gridItems.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : idx * 0.06,
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => setSelectedArticle(item)}
                    className="group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Rounded Landscape Thumbnail */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-[#CDE0F3]/70 mb-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
                          loading="lazy"
                        />
                        {/* Frosted Top-Left Pill Badge */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#044AA3] text-xs font-semibold shadow-xs border border-white/60">
                          {item.category}
                        </div>
                      </div>

                      {/* Left-Aligned Title */}
                      <h3 className="font-heading font-medium text-lg sm:text-xl text-[#10243D] group-hover:text-[#044AA3] transition-colors leading-snug mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    {/* Date / Read Time Caption */}
                    <p className="text-xs text-[#60748A] font-montserrat mt-2 flex items-center gap-2">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </p>
                  </motion.article>
                ))}
              </div>
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
              {/* Header Image Arch */}
              <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-[#044AA3] flex-shrink-0">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/80 via-transparent to-transparent" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#10243D] transition-all flex items-center justify-center cursor-pointer shadow-md border border-white/60 z-20 active:scale-95"
                  aria-label="Close article modal"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Category & Read Time Pills */}
                <div className="absolute bottom-4 left-5 sm:left-7 flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white/95 text-[#044AA3] text-xs font-semibold shadow-xs">
                    {selectedArticle.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm">
                    {selectedArticle.readTime} • {selectedArticle.date}
                  </span>
                </div>
              </div>

              {/* Scrollable Article Body */}
              <div className="p-5 sm:p-7 lg:p-8 overflow-y-auto space-y-6 text-[#1A1A1A] font-montserrat leading-relaxed flex-1">
                {/* Title */}
                <h2
                  id="article-modal-title"
                  className="font-heading font-medium italic text-2xl sm:text-3xl text-[#10243D] leading-snug"
                >
                  {selectedArticle.title}
                </h2>

                {/* Author Card */}
                <div className="flex items-center gap-3 py-3 border-y border-[#DCE8F1]">
                  <div className="w-8 h-8 rounded-full bg-[#044AA3] text-white flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#10243D]">{selectedArticle.author}</p>
                    <p className="text-xs text-[#60748A]">{selectedArticle.authorRole}</p>
                  </div>
                </div>

                {/* Article Paragraphs */}
                <div className="space-y-4 text-base text-[#333333] leading-relaxed">
                  {selectedArticle.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Key Clinical Takeaways Callout */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#E8F5FC] border border-[#D0E0F2]">
                  <h4 className="font-montserrat text-xs uppercase font-bold tracking-wider text-[#044AA3] mb-3">
                    Key Clinical Takeaways:
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedArticle.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#10243D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#044AA3] mt-2 flex-shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consultation Booking CTA Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F3F9FD] border border-[#DCE8F1] flex items-center justify-between flex-wrap gap-4 mt-6">
                  <div>
                    <p className="text-base font-semibold text-[#10243D] font-heading italic">
                      Need individualized clinical guidance?
                    </p>
                    <p className="text-xs text-[#60748A] font-montserrat">
                      Author your personalized nutritional protocol with Practitioner Selvi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedArticle(null);
                      onBookNow();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#044AA3] text-white hover:bg-[#033B85] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(4,74,163,0.28)] cursor-pointer active:scale-95"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
