import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string, sectionId?: string) => void;
  onOpenBooking?: () => void;
}

interface NavItem {
  number: string;
  name: string;
  route: string;
  sectionId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onRouteChange, onOpenBooking }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  // All navigation destinations: exact requested order & mapping
  const navLinks: NavItem[] = [
    { number: '01', name: 'Home', route: '/', sectionId: 'home' },
    { number: '02', name: 'About', route: '/', sectionId: 'about' },
    { number: '03', name: 'How It Works', route: '/', sectionId: 'how-it-works' },
    { number: '04', name: 'Reviews', route: '/', sectionId: 'reviews' },
    { number: '05', name: 'Services', route: '/', sectionId: 'services' },
    { number: '06', name: 'Consultations', route: '/', sectionId: 'consultations' },
    { number: '07', name: 'Blogs & Education', route: '/blogs' },
    { number: '08', name: 'Contact', route: '/', sectionId: 'contact' },
  ];

  // Desktop Liquid Glass navigation tabs (Home, About, How It Works, Reviews, Services, Consultations, Contact)
  const desktopTabs = [
    { id: 'home', name: 'Home', sectionId: 'home', route: '/' },
    { id: 'about', name: 'About', sectionId: 'about', route: '/' },
    { id: 'how-it-works', name: 'How It Works', sectionId: 'how-it-works', route: '/' },
    { id: 'reviews', name: 'Reviews', sectionId: 'reviews', route: '/' },
    { id: 'services', name: 'Services', sectionId: 'services', route: '/' },
    { id: 'consultations', name: 'Consultations', sectionId: 'consultations', route: '/' },
    { id: 'contact', name: 'Contact', sectionId: 'contact', route: '/' },
  ];

  // Lock background page scroll when navigation drawer is open
  useEffect(() => {
    if (menuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [menuOpen]);

  // Close drawer if resized to tablet or desktop viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Support Escape key to close navigation drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Scrollspy: Track active section on the homepage
  useEffect(() => {
    if (currentRoute !== '/') {
      return;
    }

    const sections = [
      { id: 'home', navId: 'home' },
      { id: 'about', navId: 'about' },
      { id: 'how-it-works', navId: 'how-it-works' },
      { id: 'reviews', navId: 'reviews' },
      { id: 'services', navId: 'services' },
      { id: 'consultations', navId: 'consultations' },
      { id: 'contact', navId: 'contact' },
    ];

    const evaluateActiveSection = () => {
      if (isClickScrollingRef.current) return;

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // 1. If at or near top of the page (within 140px), always highlight 'home'
      if (scrollY < 140) {
        setActiveSection('home');
        return;
      }

      // 2. If scrolled near the very bottom (footer visible), highlight 'contact'
      if (scrollY + clientHeight >= scrollHeight - 140) {
        setActiveSection('contact');
        return;
      }

      // 3. Scan section bounding rects with offset for header
      const focalLine = 80 + clientHeight * 0.38;
      let currentActive = 'home';

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalLine) {
            currentActive = sec.navId;
          }
        }
      }

      setActiveSection(currentActive);
    };

    evaluateActiveSection();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          evaluateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [currentRoute]);

  const handleNavClick = (link: { name: string; route: string; sectionId?: string }) => {
    setMenuOpen(false);

    // If target is Health Insights (/blogs):
    if (link.route === '/blogs') {
      if (currentRoute !== '/blogs') {
        onRouteChange('/blogs');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // If currently on homepage and link has a sectionId:
    if (currentRoute === '/' && link.sectionId) {
      const targetEl = document.getElementById(link.sectionId);
      if (targetEl) {
        isClickScrollingRef.current = true;
        setActiveSection(link.sectionId);

        const headerOffset = 40;
        let targetY =
          link.sectionId === 'home'
            ? 0
            : targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;

        // On mobile, navigating to 'services' should pin directly to the mobile services explorer
        if (window.innerWidth < 768 && link.sectionId === 'services') {
          const mobileExplorer = document.getElementById('mobile-services-explorer');
          if (mobileExplorer) {
            targetY = mobileExplorer.getBoundingClientRect().top + window.scrollY - 84;
          }
        }

        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });

        if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = window.setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 1200);
        return;
      }
    }

    // If on /blogs or another route, navigate to '/' and smooth-scroll to section
    onRouteChange('/', link.sectionId);
  };

  const getIsActive = (link: NavItem) => {
    if (currentRoute === '/blogs') {
      return link.route === '/blogs';
    }
    return activeSection === link.sectionId;
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. TOP-LEFT: LARGE FLOATING JJ NUTRITION LOGO (Desktop Only)     */}
      {/* Appears when scrolling past the Hero; inside Hero, the centered   */}
      {/* brand lockup inside the video container serves as main branding  */}
      {/* ============================================================== */}
      {(() => {
        const showDesktopLogo = currentRoute !== '/' || activeSection !== 'home';
        return (
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: showDesktopLogo ? 1 : 0, y: showDesktopLogo ? 0 : -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => handleNavClick(navLinks[0])}
            aria-label="JJ Nutrition Home"
            className={`fixed z-50 cursor-pointer focus:outline-none select-none group hidden lg:block ${
              showDesktopLogo ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            style={{
              top: 'max(1.25rem, calc(env(safe-area-inset-top, 0px) + 0.85rem))',
              left: 'max(1.25rem, calc(env(safe-area-inset-left, 0px) + 1.25rem))',
            }}
          >
            <img
              src="/newlogo-transparent.png"
              alt="JJ Nutrition Logo"
              className="w-[62px] h-[62px] sm:w-[68px] sm:h-[68px] md:w-[74px] md:h-[74px] lg:w-[84px] lg:h-[84px] xl:w-[88px] xl:h-[88px] object-contain transition-transform duration-300 group-hover:scale-105 active:scale-95 drop-shadow-[0_2px_8px_rgba(16,36,61,0.08)]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </motion.button>
        );
      })()}

      {/* ============================================================== */}
      {/* 2. TOP-CENTER: LIQUID GLASS PILL NAVBAR (Desktop & iPad >=768) */}
      {/* 1:1 Physics, optics, caustics, and spring tabs from Framer ref */}
      {/* ============================================================== */}
      <nav
        aria-label="Main Navigation"
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center p-1.5 rounded-full select-none"
        style={{
          background:
            'linear-gradient(150deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.32) 42%, rgba(255, 255, 255, 0.58) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.75)',
          boxShadow:
            '0 20px 40px -15px rgba(16, 36, 61, 0.12), 0 8px 16px -8px rgba(16, 36, 61, 0.05), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.6), inset 1px 0 0.5px rgba(255, 255, 255, 0.7), inset -1px 0 0.5px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Specular top rim highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset 0 1px 1.2px 0 rgba(255, 255, 255, 0.95)',
          }}
        />

        {/* Caustic reflection line */}
        <div
          className="absolute left-[12%] bottom-[1px] w-[40%] h-[1.5px] rounded-full pointer-events-none opacity-70 filter blur-[0.35px]"
          style={{
            background:
              'linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.95) 48%, rgba(255, 255, 255, 0))',
          }}
        />

        {/* Tab Buttons Container */}
        <div className="relative flex items-center gap-0.5 lg:gap-1">
          {desktopTabs.map((tab) => {
            const isActive =
              currentRoute === '/blogs'
                ? tab.route === '/blogs'
                : activeSection === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab)}
                className="relative px-3 py-1.5 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-200 select-none flex items-center justify-center group"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-liquid-tab"
                    transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
                    className="absolute inset-0 rounded-full z-0 pointer-events-none overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(150deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.60) 42%, rgba(255, 255, 255, 0.86) 100%)',
                      boxShadow:
                        '0 2px 10px -1px rgba(16, 36, 61, 0.12), 0 6px 16px -4px rgba(16, 36, 61, 0.08), inset 0 1px 1.5px #ffffff, inset 0 -1px 1px rgba(255, 255, 255, 0.85), inset 1px 0 0.5px rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  >
                    {/* Specular traveling sheen */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none opacity-80"
                      style={{
                        background:
                          'linear-gradient(105deg, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.6) 48%, rgba(255, 255, 255, 0) 75%)',
                      }}
                    />
                    {/* Micro caustic bottom highlight */}
                    <div
                      className="absolute left-[15%] right-[15%] bottom-[1px] h-[1px] rounded-full pointer-events-none opacity-90"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0) 100%)',
                      }}
                    />
                  </motion.div>
                )}
                <span
                  className={`relative z-10 font-montserrat text-[12px] md:text-[12.5px] lg:text-[13.5px] font-semibold tracking-[-0.01em] transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-[#10243D]'
                      : 'text-[#334155]/85 hover:text-[#10243D]'
                  }`}
                >
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ============================================================== */}
      {/* 3. TOP-RIGHT: LIQUID GLASS MOBILE BURGER BUTTON (< md / 768px) */}
      {/* Strictly mobile (< 768px). Hidden on iPad and desktop.         */}
      {/* ============================================================== */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="fixed z-50 md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/55 hover:bg-white/80 active:scale-95 backdrop-blur-xl border border-white/70 shadow-[0_8px_24px_rgba(4,74,163,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] text-[#10243D] cursor-pointer transition-all duration-200 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{
          top: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 0.75rem))',
          right: 'max(1rem, calc(env(safe-area-inset-right, 0px) + 0.75rem))',
        }}
      >
        <div className="w-4 h-3.5 flex flex-col justify-between items-center relative pointer-events-none">
          <motion.span
            animate={{
              rotate: menuOpen ? 45 : 0,
              y: menuOpen ? 6 : 0,
            }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="w-4 h-[1.75px] bg-[#044AA3] rounded-full origin-center"
          />
          <motion.span
            animate={{
              opacity: menuOpen ? 0 : 1,
              x: menuOpen ? 6 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="w-2.5 h-[1.75px] bg-[#044AA3] rounded-full self-start"
          />
          <motion.span
            animate={{
              rotate: menuOpen ? -45 : 0,
              y: menuOpen ? -6 : 0,
              width: menuOpen ? 16 : 13,
            }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="w-3.5 h-[1.75px] bg-[#044AA3] rounded-full origin-center self-end"
          />
        </div>
      </motion.button>

      {/* ============================================================== */}
      {/* 4. MOBILE SIDEBAR NAVIGATION DRAWER (< md / < 768px)           */}
      {/* Framer-inspired spring mechanics, JJ Nutrition luxury paper   */}
      {/* ============================================================== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Fade & Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#10243D]/25 backdrop-blur-sm md:hidden"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              className="fixed top-0 right-0 z-50 w-[86vw] max-w-[360px] h-[100dvh] bg-[#F7F6F2]/95 backdrop-blur-2xl border-l border-white/70 shadow-[-16px_0_48px_rgba(4,74,163,0.16)] flex flex-col justify-between overflow-hidden md:hidden select-none"
            >
              {/* Background Linework & Subtle DNA Texture Layers */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 z-0 bg-repeat"
                style={{
                  backgroundImage: `url('/white-wall-textures.webp')`,
                  backgroundSize: '400px 400px',
                }}
              />
              <div
                className="absolute -right-20 top-1/4 w-72 h-72 opacity-[0.06] pointer-events-none z-0 bg-contain bg-no-repeat rotate-45 select-none"
                style={{ backgroundImage: `url('/dnapattern.png')` }}
              />
              <div
                className="absolute -left-20 bottom-16 w-72 h-72 opacity-[0.05] pointer-events-none z-0 bg-contain bg-no-repeat -rotate-12 select-none"
                style={{ backgroundImage: `url('/dnapattern.png')` }}
              />

              {/* Header inside Drawer: Clean Right-Aligned Glass Circular Close (×) Button */}
              <div
                className="relative z-10 flex items-center justify-end px-5 pb-2 pt-3"
                style={{
                  paddingTop: 'max(1.15rem, calc(env(safe-area-inset-top, 0px) + 0.75rem))',
                }}
              >
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/75 hover:bg-white active:scale-95 backdrop-blur-xl border border-white/80 shadow-[0_4px_16px_rgba(4,74,163,0.1)] text-[#10243D] cursor-pointer transition-all focus:outline-none"
                >
                  <X className="w-5 h-5 text-[#10243D]" />
                </button>
              </div>

              {/* Navigation Items with Staggered Entrance & Pill-Shaped Active Highlight */}
              <div className="relative z-10 flex-1 overflow-y-auto px-4 py-2 flex flex-col justify-center">
                <div className="text-[11px] font-semibold text-[#60748A] uppercase tracking-wider px-4 mb-2.5 font-montserrat">
                  Navigation
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.04,
                        delayChildren: 0.08,
                      },
                    },
                    exit: {
                      opacity: 0,
                      transition: {
                        staggerChildren: 0.02,
                        staggerDirection: -1,
                      },
                    },
                  }}
                  className="flex flex-col space-y-1.5"
                >
                  {navLinks.map((link) => {
                    const isSelected = getIsActive(link);
                    return (
                      <motion.button
                        key={link.name}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: 'spring',
                              duration: 0.4,
                              bounce: 0,
                            },
                          },
                          exit: {
                            opacity: 0,
                            y: 12,
                            transition: {
                              duration: 0.2,
                            },
                          },
                        }}
                        onClick={() => handleNavClick(link)}
                        className={`relative w-full text-left py-2.5 sm:py-3 px-5 rounded-full flex items-center justify-between cursor-pointer group select-none transition-colors duration-200 ${
                          isSelected ? 'text-white font-medium' : 'text-[#10243D] hover:text-[#044AA3]'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="mobileNavActivePill"
                            className="absolute inset-0 bg-[#044AA3] rounded-full shadow-[0_4px_16px_rgba(4,74,163,0.32)] z-0"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}

                        <div className="relative z-10 flex items-center gap-3.5">
                          <span
                            className={`font-mono text-xs sm:text-sm font-semibold tracking-wider ${
                              isSelected
                                ? 'text-white/80'
                                : 'text-[#60748A] group-hover:text-[#044AA3] transition-colors'
                            }`}
                          >
                            {link.number}
                          </span>
                          <span
                            className={`font-montserrat text-lg sm:text-xl tracking-tight ${
                              isSelected
                                ? 'font-semibold text-white'
                                : 'font-medium text-[#10243D] group-hover:text-[#044AA3] transition-colors'
                            }`}
                          >
                            {link.name}
                          </span>
                        </div>

                        <div className="relative z-10 flex items-center">
                          <ArrowUpRight
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                              isSelected
                                ? 'text-white opacity-95'
                                : 'text-[#60748A] opacity-30 group-hover:opacity-100 group-hover:text-[#044AA3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                            }`}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              {/* Drawer Footer: Book Consultation CTA & Telehealth Contact */}
              <div
                className="relative z-10 px-5 pt-3 pb-6 border-t border-[#CDE0F3]/60 bg-white/40 backdrop-blur-md flex flex-col gap-3"
                style={{
                  paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.25rem))',
                }}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (onOpenBooking) {
                      onOpenBooking();
                    } else {
                      handleNavClick({ name: 'Consultations', route: '/', sectionId: 'consultations' });
                    }
                  }}
                  className="w-full py-3.5 px-5 rounded-full bg-[#044AA3] hover:bg-[#033B82] active:scale-[0.98] text-white font-montserrat text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(4,74,163,0.32)] transition-all cursor-pointer"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center gap-1 text-center">
                  <a
                    href="mailto:info@jjnutrition.com.au"
                    className="text-xs text-[#044AA3] font-medium font-montserrat hover:underline flex items-center gap-1.5"
                  >
                    <span>info@jjnutrition.com.au</span>
                  </a>
                  <span className="text-[10px] text-[#60748A] font-montserrat">
                    Practitioner Selvi, RDN • Clinical Telehealth
                  </span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
