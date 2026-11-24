import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

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
      {/* 3. TOP-RIGHT: CIRCULAR FLOATING GLASS BURGER BUTTON (Mobile Only) */}
      {/* Strictly mobile (< 768px). Hidden on iPad and desktop.         */}
      {/* ============================================================== */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setMenuOpen(true)}
        aria-label="Open navigation menu"
        className="fixed z-50 w-11 h-11 sm:w-12 sm:h-12 md:hidden rounded-full flex items-center justify-center bg-white/75 hover:bg-white/95 active:scale-95 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(16,36,61,0.08)] text-[#10243D] cursor-pointer transition-all duration-200 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{
          top: 'max(1.25rem, calc(env(safe-area-inset-top, 0px) + 0.85rem))',
          right: 'max(1.25rem, calc(env(safe-area-inset-right, 0px) + 1.25rem))',
        }}
      >
        <Menu className="w-5 h-5 text-[#10243D] transition-transform duration-200 group-hover:scale-110" />
      </motion.button>

      {/* ============================================================== */}
      {/* 4. NAVIGATION DRAWER (Full-screen Glassmorphic Menu, Mobile Only) */}
      {/* Preserves all destinations, staggered reveal, & consultation CTA */}
      {/* ============================================================== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto md:hidden"
            style={{
              paddingTop: 'max(2rem, calc(env(safe-area-inset-top, 0px) + 1.5rem))',
              paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))',
              paddingLeft: 'max(1.5rem, calc(env(safe-area-inset-left, 0px) + 1.5rem))',
              paddingRight: 'max(1.5rem, calc(env(safe-area-inset-right, 0px) + 1.5rem))',
            }}
          >
            {/* Top Bar inside Drawer: Logo on left, Circular Close button on right */}
            <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-6 sm:mb-8">
              <button
                onClick={() => handleNavClick(navLinks[0])}
                aria-label="JJ Nutrition Home"
                className="cursor-pointer focus:outline-none"
              >
                <img
                  src="/newlogo-transparent.png"
                  alt="JJ Nutrition Logo"
                  className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] object-contain"
                />
              </button>

              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/80 hover:bg-white active:scale-95 backdrop-blur-xl border border-white shadow-[0_4px_20px_rgba(16,36,61,0.1)] text-[#10243D] cursor-pointer transition-all focus:outline-none"
              >
                <X className="w-5 h-5 text-[#10243D]" />
              </button>
            </div>

            {/* Staggered Navigation List (01 through 08, right-aligned) */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.045,
                    delayChildren: 0.05,
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
              className="w-full max-w-2xl mx-auto flex flex-col space-y-1 my-auto"
            >
              {navLinks.map((link) => {
                const isSelected = getIsActive(link);
                return (
                  <motion.button
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        },
                      },
                      exit: {
                        opacity: 0,
                        x: 16,
                        transition: {
                          duration: 0.2,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        },
                      },
                    }}
                    onClick={() => handleNavClick(link)}
                    className={`w-full text-right py-3 sm:py-3.5 px-3 flex items-center justify-end gap-3.5 sm:gap-4 border-b border-[#CDE0F3]/70 cursor-pointer group select-none transition-colors ${
                      isSelected
                        ? 'text-accent'
                        : 'text-[#10243D] hover:text-accent'
                    }`}
                  >
                    <div className="flex items-baseline justify-end gap-3.5 sm:gap-4">
                      <span className="font-mono text-sm sm:text-sm text-[#60748A] group-hover:text-accent transition-colors flex-shrink-0">
                        {link.number}
                      </span>
                      <span
                        className={`font-montserrat text-lg sm:text-2xl tracking-tight transition-colors ${
                          isSelected
                            ? 'font-medium text-accent'
                            : 'font-normal text-[#10243D] group-hover:text-accent'
                        }`}
                      >
                        {link.name}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-accent flex-shrink-0" />
                  </motion.button>
                );
              })}

              {/* Book Consultation button: DIRECTLY UNDERNEATH CONTACT */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: 10,
                    transition: {
                      duration: 0.2,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                    },
                  },
                }}
                className="pt-6 sm:pt-8"
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
                  className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-accent text-white hover:bg-accent-strong text-center text-base sm:text-base font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(4,74,163,0.32)] transition-all cursor-pointer font-montserrat active:scale-[0.99]"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </motion.div>
            </motion.div>

            {/* Footer inside Drawer */}
            <div className="w-full max-w-2xl mx-auto text-center pt-4">
              <p className="text-sm sm:text-xs text-[#60748A] font-montserrat">
                © 2026 JJ Nutrition. Directed by Practitioner Selvi, RDN. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
